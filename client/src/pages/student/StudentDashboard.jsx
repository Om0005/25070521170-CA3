import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api/resources';
import { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { formatDate, greeting, initials, timeAgo } from '../../data/helpers';
import { StatusBadge } from '../../components/Badge';
import CountUp from '../../components/CountUp';
import FlowSteps from '../../components/FlowSteps';
import {
  IconArrowRight,
  IconCalendar,
  IconClock,
  IconCourses,
  IconFaculty,
  IconIdCard,
  IconInfo,
  IconMapPin,
  IconNotice,
  IconPhone,
  IconSparkles,
} from '../../components/icons';

const FLOW = [
  { label: 'Signed in', hint: 'Student account active' },
  { label: 'Check notices', hint: 'Campus updates', to: '/student/notices' },
  { label: 'Open my courses', hint: 'Credits & faculty', to: '/student/courses' },
  { label: 'Update profile', hint: 'Phone & address', to: '/student/profile' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await studentApi.dashboard());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const profile = data?.profile;
  const stats = data?.stats;
  const semester = profile?.semester || (profile?.year ? profile.year * 2 - 1 : 1);
  const contactFields = [profile?.phone, profile?.address];
  const filled = contactFields.filter(Boolean).length;
  const completeness = Math.round((filled / contactFields.length) * 100);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const firstName = (user?.name || profile?.name || 'Student')
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '')
    .split(' ')[0];

  const statCards = [
    { key: 'courses', label: 'My courses', icon: IconCourses, tone: 'stat-card--teal', hint: 'This semester' },
    { key: 'credits', label: 'Credits enrolled', icon: IconSparkles, tone: 'stat-card--green', hint: 'Across my courses' },
    { key: 'notices', label: 'Notices for me', icon: IconNotice, tone: 'stat-card--amber', hint: 'Published to students' },
    { key: 'faculty', label: 'Dept. faculty', icon: IconFaculty, tone: 'stat-card--sky', hint: 'Active teaching staff' },
  ];

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">
            {greeting()}, {firstName}
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="page__subtitle">
            {profile ? (
              <>
                {profile.department} · Year {profile.year} · Semester {semester} · Roll{' '}
                <span className="mono">{profile.rollNo}</span>
              </>
            ) : (
              'Your courses, notices and contact details in one student portal.'
            )}
          </p>
        </div>

        <div className="page__actions">
          <span className="badge badge--plain badge--neutral">
            <IconClock size={13} />
            {today}
          </span>
          <Link to="/student/profile" className="btn btn--secondary btn--sm">
            <IconIdCard size={15} />
            My profile
          </Link>
        </div>
      </div>

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

      <section className="hero-card">
        <span className="hero-card__orb" aria-hidden="true" />
        <div className="hero-card__main">
          <span className="hero-card__eyebrow">
            <IconSparkles size={14} />
            Student dashboard
          </span>

          {loading ? (
            <>
              <span className="skeleton" style={{ width: 210, height: 28, marginTop: 14 }} />
              <span className="skeleton" style={{ width: 320, height: 14, marginTop: 14 }} />
            </>
          ) : (
            <>
              <h2 className="hero-card__name">{profile?.name || user?.name}</h2>
              <div className="hero-card__chips">
                <span className="chip">
                  <IconIdCard size={14} />
                  <span className="mono">{profile?.rollNo || '—'}</span>
                </span>
                <span className="chip">
                  <IconCourses size={14} />
                  {profile?.department || 'Department'}
                </span>
                <span className="chip">
                  <IconCalendar size={14} />
                  Semester {semester}
                </span>
                {profile ? <StatusBadge value={profile.status} /> : null}
              </div>
            </>
          )}

          <div className="hero-card__actions">
            <Link to="/student/courses" className="btn btn--primary btn--student btn--sm">
              My courses
              <IconArrowRight size={14} />
            </Link>
            <Link to="/student/notices" className="btn btn--secondary btn--sm">
              Read notices
            </Link>
          </div>
        </div>

        <div className="hero-card__side">
          <div
            className="semester-ring"
            style={{ '--progress': `${Math.min(100, Math.round((semester / 8) * 100))}%` }}
            role="img"
            aria-label={`Semester ${semester} of 8`}
          >
            <div className="semester-ring__inner">
              <strong>{semester}/8</strong>
              <span>semester</span>
            </div>
          </div>
          <p className="hero-card__side-note">Programme progress</p>
        </div>
      </section>

      <div className="stats-grid">
        {statCards.map(({ key, label, icon: Icon, tone, hint }) => (
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
                <CountUp value={stats?.[key] ?? 0} />
              </div>
            )}

            <div className="stat-card__hint">
              <span>{hint}</span>
            </div>
            <span className="stat-card__accent" aria-hidden="true" />
          </article>
        ))}
      </div>

      <section className="flow-card flow-card--student">
        <div className="flow-card__head">
          <h2 className="flow-card__title">
            <span className="dot" aria-hidden="true" />
            Your campus flow
          </h2>
          <p className="flow-card__hint">
            Your record is live from MongoDB — jump into any step.
          </p>
        </div>
        <FlowSteps steps={FLOW} />
      </section>

      <div className="dash-grid">
        <section className="card">
          <div className="card__head">
            <div>
              <h2 className="card__title">My courses</h2>
              <p className="card__subtitle">
                {profile
                  ? `${profile.department} · Semester ${semester}`
                  : 'Courses assigned to your department'}
              </p>
            </div>
            <Link to="/student/courses" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>

          <div className="card__body">
            {loading ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <span key={index} className="skeleton" style={{ height: 46 }} />
                ))}
              </div>
            ) : (data?.courses || []).length === 0 ? (
              <div className="empty" style={{ padding: '34px 10px' }}>
                <span className="empty__icon">
                  <IconCourses />
                </span>
                <p className="empty__title">No courses mapped yet</p>
                <p className="empty__text">
                  Your department courses will appear here as soon as the academic office publishes
                  them.
                </p>
              </div>
            ) : (
              <div className="mini-course-list">
                {data.courses.slice(0, 4).map((course) => (
                  <article key={course._id} className="mini-course">
                    <span className="mini-course__code">{course.code}</span>
                    <div className="mini-course__body">
                      <strong>{course.title}</strong>
                      <span>
                        Semester {course.semester} · {course.credits} credits
                        {course.faculty?.name ? ` · ${course.faculty.name}` : ''}
                      </span>
                    </div>
                    <IconArrowRight size={15} className="mini-course__arrow" />
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="dash-stack">
          <section className="card">
            <div className="card__head">
              <div>
                <h2 className="card__title">Latest notices</h2>
                <p className="card__subtitle">Published for students</p>
              </div>
              <Link to="/student/notices" className="btn btn--ghost btn--sm">
                All
              </Link>
            </div>

            <div className="card__body">
              {loading ? (
                <div className="bar-row" style={{ gap: 14 }}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <span key={index} className="skeleton" style={{ height: 38 }} />
                  ))}
                </div>
              ) : (data?.notices || []).length === 0 ? (
                <p className="page__subtitle">No notices have been published yet.</p>
              ) : (
                <div className="notice-list">
                  {data.notices.map((notice) => (
                    <div key={notice._id} className="notice-item">
                      <span className={`notice-item__dot notice-item__dot--${notice.priority}`} />
                      <div className="notice-item__body">
                        <p className="notice-item__title">{notice.title}</p>
                        <div className="notice-item__meta">
                          <span>{timeAgo(notice.createdAt)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(notice.createdAt)}</span>
                        </div>
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
                <h2 className="card__title">Contact details</h2>
                <p className="card__subtitle">How the office reaches you</p>
              </div>
              <Link to="/student/profile" className="btn btn--ghost btn--sm">
                Edit
              </Link>
            </div>

            <div className="card__body">
              {loading ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <span key={index} className="skeleton" style={{ height: 18 }} />
                  ))}
                </div>
              ) : (
                <>
                  <ul className="contact-list">
                    <li>
                      <span className="contact-list__icon">
                        <IconPhone size={15} />
                      </span>
                      <span>{profile?.phone || 'No phone number added yet'}</span>
                    </li>
                    <li>
                      <span className="contact-list__icon">
                        <IconMapPin size={15} />
                      </span>
                      <span>{profile?.address || 'No address added yet'}</span>
                    </li>
                  </ul>

                  <div className="completeness">
                    <div className="completeness__top">
                      <span>Profile completeness</span>
                      <strong>{completeness}%</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${completeness}%` }} />
                    </div>
                    {completeness < 100 ? (
                      <p className="completeness__hint">
                        <Link to="/student/profile">Add your phone and address</Link> so the office can
                        reach you.
                      </p>
                    ) : (
                      <p className="completeness__hint">All contact details are up to date.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
