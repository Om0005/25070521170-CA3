import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/resources';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatDate, greeting, initials, timeAgo } from '../data/helpers';
import { StatusBadge } from '../components/Badge';
import CountUp from '../components/CountUp';
import FlowSteps from '../components/FlowSteps';
import {
  IconStudents,
  IconCourses,
  IconFaculty,
  IconNotice,
  IconArrowRight,
  IconSparkles,
  IconInfo,
  IconClock,
} from '../components/icons';

const STAT_CARDS = [
  { key: 'students', label: 'Active students', icon: IconStudents, tone: '', to: '/students', hint: 'Enrolled this semester' },
  { key: 'courses', label: 'Running courses', icon: IconCourses, tone: 'stat-card--sky', to: '/courses', hint: 'Across all departments' },
  { key: 'faculty', label: 'Faculty on roll', icon: IconFaculty, tone: 'stat-card--green', to: '/faculty', hint: 'Active teaching staff' },
  { key: 'notices', label: 'Published notices', icon: IconNotice, tone: 'stat-card--amber', to: '/notices', hint: 'Visible on the board' },
];

const WORKFLOW = [
  { label: 'Admit students', hint: 'Roll number, department, year', to: '/students' },
  { label: 'Create courses', hint: 'Credits, semester, seats', to: '/courses' },
  { label: 'Assign faculty', hint: 'Map teachers to subjects', to: '/faculty' },
  { label: 'Publish notices', hint: 'Reach students & staff', to: '/notices' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await dashboardApi.get();
      setData(response);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const maxDepartment = Math.max(1, ...(data?.studentsByDepartment || []).map((row) => row.students));

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">
            {greeting()},{' '}
            {(user?.name || 'Administrator')
              .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '')
              .split(' ')[0]}
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="page__subtitle">
            Here is the current state of the campus — student strength, running courses and the
            latest notices.
          </p>
        </div>

        <div className="page__actions">
          <span className="badge badge--plain badge--neutral">
            <IconClock size={13} />
            {today}
          </span>
        </div>
      </div>

      <section className="flow-card">
        <div className="flow-card__head">
          <h2 className="flow-card__title">
            <span className="dot" aria-hidden="true" />
            Administration workflow
          </h2>
          <p className="flow-card__hint">
            Every step writes straight to MongoDB — pick any step to jump in.
          </p>
        </div>
        <FlowSteps steps={WORKFLOW} />
      </section>

      {error ? (
        <div className="card" style={{ padding: 18, marginBottom: 18 }}>
          <div className="alert alert--error" role="alert">
            <IconInfo size={16} />
            <span>{error}</span>
          </div>
          <button type="button" className="btn btn--secondary btn--sm" style={{ marginTop: 12 }} onClick={load}>
            Reload dashboard
          </button>
        </div>
      ) : null}

      <div className="stats-grid">
        {STAT_CARDS.map(({ key, label, icon: Icon, tone, to, hint }) => (
          <article key={key} className={`stat-card ${tone}`}>
            <div className="stat-card__top">
              <span className="stat-card__label">{label}</span>
              <span className="stat-card__icon">
                <Icon />
              </span>
            </div>

            {loading ? (
              <span className="skeleton" style={{ width: 64, height: 30, marginTop: 12 }} />
            ) : (
              <div className="stat-card__value">
                <CountUp value={data?.stats?.[key] ?? 0} />
              </div>
            )}

            <div className="stat-card__hint">
              <span>{hint}</span>
              <Link
                to={to}
                style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 600 }}
              >
                View <IconArrowRight size={13} />
              </Link>
            </div>
            <span className="stat-card__accent" aria-hidden="true" />
          </article>
        ))}
      </div>

      <div className="dash-grid">
        <section className="card">
          <div className="card__head">
            <div>
              <h2 className="card__title">Students by department</h2>
              <p className="card__subtitle">Distribution of registered students</p>
            </div>
            <IconSparkles size={16} style={{ color: 'var(--muted-light)' }} />
          </div>

          <div className="card__body">
            {loading ? (
              <div className="bars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="bar-row">
                    <span className="skeleton" style={{ width: '40%' }} />
                    <span className="skeleton" style={{ height: 8 }} />
                  </div>
                ))}
              </div>
            ) : (data?.studentsByDepartment || []).length === 0 ? (
              <p className="page__subtitle">No students registered yet.</p>
            ) : (
              <div className="bars">
                {data.studentsByDepartment.map((row) => (
                  <div key={row.department} className="bar-row">
                    <div className="bar-row__top">
                      <span className="bar-row__label">{row.department}</span>
                      <span className="bar-row__value">
                        {row.students} {row.students === 1 ? 'student' : 'students'}
                      </span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${Math.round((row.students / maxDepartment) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="card">
          <div className="card__head">
            <div>
              <h2 className="card__title">Latest notices</h2>
              <p className="card__subtitle">Recently published to the campus</p>
            </div>
            <Link to="/notices" className="btn btn--ghost btn--sm">
              Manage
            </Link>
          </div>

          <div className="card__body">
            {loading ? (
              <div className="bar-row" style={{ gap: 14 }}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <span key={index} className="skeleton" style={{ height: 38 }} />
                ))}
              </div>
            ) : (data?.recentNotices || []).length === 0 ? (
              <p className="page__subtitle">No notices have been published yet.</p>
            ) : (
              <div className="notice-list">
                {data.recentNotices.map((notice) => (
                  <div key={notice._id} className="notice-item">
                    <span className={`notice-item__dot notice-item__dot--${notice.priority}`} />
                    <div className="notice-item__body">
                      <p className="notice-item__title">{notice.title}</p>
                      <div className="notice-item__meta">
                        <span className={`badge badge--plain badge--${notice.priority === 'high' ? 'danger' : notice.priority === 'low' ? 'neutral' : 'info'}`}>
                          {notice.priority}
                        </span>
                        <span style={{ textTransform: 'capitalize' }}>{notice.audience}</span>
                        <span aria-hidden="true">·</span>
                        <span>{timeAgo(notice.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card__head">
          <div>
            <h2 className="card__title">Recent admissions</h2>
            <p className="card__subtitle">The five students added most recently</p>
          </div>
          <Link to="/students" className="btn btn--secondary btn--sm">
            All students <IconArrowRight size={14} />
          </Link>
        </div>

        <div className="card__body">
          {loading ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} className="skeleton" style={{ height: 22 }} />
              ))}
            </div>
          ) : (data?.recentStudents || []).length === 0 ? (
            <p className="page__subtitle">No student records yet.</p>
          ) : (
            <div className="table-scroll">
              <table className="data" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll no.</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentStudents.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="cell-stack">
                          <span className="avatar" aria-hidden="true">
                            {initials(student.name)}
                          </span>
                          <span className="cell-strong">{student.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="mono">{student.rollNo}</span>
                      </td>
                      <td>{student.department}</td>
                      <td>Year {student.year}</td>
                      <td>
                        <StatusBadge value={student.status} />
                      </td>
                      <td>{formatDate(student.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
