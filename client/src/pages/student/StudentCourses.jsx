import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api/resources';
import { getErrorMessage } from '../../api/client';
import { initials } from '../../data/helpers';
import { IconCourses, IconFaculty, IconInfo, IconSearch, IconSparkles, IconStudents } from '../../components/icons';

export default function StudentCourses() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await studentApi.courses());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const courses = data?.courses || [];
  const semesters = [...new Set(courses.map((course) => course.semester))].sort((a, b) => a - b);
  const profile = data?.profile;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return courses
      .filter((course) => (semester === 'all' ? true : String(course.semester) === semester))
      .filter((course) => {
        if (!term) return true;
        return [course.code, course.title, course.department, course.faculty?.name, course.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      });
  }, [courses, search, semester]);

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">My courses</h1>
          <p className="page__subtitle">
            {profile
              ? `Courses mapped to ${profile.department}${profile.semester ? ` · Semester ${profile.semester}` : ''}.`
              : 'Courses mapped to your department.'}
          </p>
        </div>

        <div className="page__actions">
          <span className="badge badge--plain badge--info">
            <IconCourses size={13} />
            {data?.total ?? 0} courses
          </span>
          <span className="badge badge--plain badge--success">
            <IconSparkles size={13} />
            {data?.credits ?? 0} credits
          </span>
        </div>
      </div>

      {error ? (
        <div className="card" style={{ padding: 18, marginBottom: 18 }}>
          <div className="alert alert--error" role="alert">
            <IconInfo size={16} />
            <span>{error}</span>
          </div>
          <button type="button" className="btn btn--secondary btn--sm" style={{ marginTop: 12 }} onClick={load}>
            Try again
          </button>
        </div>
      ) : null}

      <section className="card" style={{ marginBottom: 18 }}>
        <div className="toolbar">
          <div className="search">
            <IconSearch />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by code, title, faculty or keyword…"
              aria-label="Search courses"
            />
          </div>

          <select
            className="filter-select"
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
            aria-label="Filter by semester"
          >
            <option value="all">All semesters</option>
            {semesters.map((value) => (
              <option key={value} value={value}>
                Semester {value}
              </option>
            ))}
          </select>

          <span className="toolbar__count">
            <strong>{visible.length}</strong> showing
          </span>
        </div>
      </section>

      {loading ? (
        <div className="course-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="card" style={{ padding: 22 }}>
              <span className="skeleton" style={{ width: 72, height: 22 }} />
              <span className="skeleton" style={{ width: '80%', height: 18, marginTop: 18 }} />
              <span className="skeleton" style={{ width: '100%', height: 34, marginTop: 14 }} />
              <span className="skeleton" style={{ width: '55%', height: 16, marginTop: 18 }} />
            </article>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="card">
          <div className="empty">
            <span className="empty__icon">
              <IconCourses />
            </span>
            <p className="empty__title">{courses.length === 0 ? 'No courses mapped yet' : 'No matching course'}</p>
            <p className="empty__text">
              {courses.length === 0
                ? 'The academic office has not published courses for your department yet. Check back shortly.'
                : 'Try a different keyword or clear the semester filter.'}
            </p>
            {courses.length > 0 ? (
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => {
                  setSearch('');
                  setSemester('all');
                }}
              >
                Clear filters
              </button>
            ) : (
              <Link to="/student/notices" className="btn btn--primary btn--student btn--sm">
                Read notices
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="course-grid">
          {visible.map((course) => (
            <article key={course._id} className="course-card">
              <div className="course-card__top">
                <span className="course-card__code">{course.code}</span>
                <span className="badge badge--plain badge--info">Sem {course.semester}</span>
              </div>

              <h2 className="course-card__title">{course.title}</h2>
              <p className="course-card__desc">{course.description || 'Syllabus details will be shared by the department.'}</p>

              <div className="course-card__meta">
                <span>
                  <IconSparkles size={14} />
                  {course.credits} credits
                </span>
                <span>
                  <IconStudents size={14} />
                  {course.seats} seats
                </span>
                <span>
                  <IconFaculty size={14} />
                  {course.department}
                </span>
              </div>

              <div className="course-card__faculty">
                {course.faculty ? (
                  <>
                    <span className="avatar avatar--sm avatar--student" aria-hidden="true">
                      {initials(course.faculty.name)}
                    </span>
                    <div>
                      <strong>{course.faculty.name}</strong>
                      <span>{course.faculty.designation || 'Faculty'}</span>
                    </div>
                  </>
                ) : (
                  <span className="course-card__unassigned">Faculty to be assigned</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
