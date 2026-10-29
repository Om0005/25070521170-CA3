import { useCallback, useEffect, useMemo, useState } from 'react';
import { studentApi } from '../../api/resources';
import { getErrorMessage } from '../../api/client';
import { formatDate, timeAgo } from '../../data/helpers';
import { IconCalendar, IconClock, IconInfo, IconNotice, IconSearch } from '../../components/icons';

const PRIORITY_LABEL = { high: 'High priority', normal: 'Normal', low: 'Low' };
const PRIORITY_TONE = { high: 'danger', normal: 'info', low: 'neutral' };

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentApi.notices();
      setNotices(response.data || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return notices.filter((notice) => {
      if (priority !== 'all' && notice.priority !== priority) return false;
      if (!term) return true;
      return [notice.title, notice.body, notice.audience, notice.postedBy?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [notices, priority, search]);

  const highCount = notices.filter((notice) => notice.priority === 'high').length;

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">Notices</h1>
          <p className="page__subtitle">
            Official announcements published for students by the administration.
          </p>
        </div>

        <div className="page__actions">
          <span className="badge badge--plain badge--info">
            <IconNotice size={13} />
            {notices.length} published
          </span>
          {highCount ? (
            <span className="badge badge--plain badge--danger">
              <IconInfo size={13} />
              {highCount} high priority
            </span>
          ) : null}
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
              placeholder="Search notices by title or content…"
              aria-label="Search notices"
            />
          </div>

          <select
            className="filter-select"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>

          <span className="toolbar__count">
            <strong>{visible.length}</strong> showing
          </span>
        </div>
      </section>

      {loading ? (
        <div style={{ display: 'grid', gap: 14 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="card" style={{ padding: 22 }}>
              <span className="skeleton" style={{ width: '45%', height: 18 }} />
              <span className="skeleton" style={{ width: '100%', height: 12, marginTop: 14 }} />
              <span className="skeleton" style={{ width: '80%', height: 12, marginTop: 8 }} />
            </article>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="card">
          <div className="empty">
            <span className="empty__icon">
              <IconNotice />
            </span>
            <p className="empty__title">{notices.length === 0 ? 'No notices yet' : 'No matching notice'}</p>
            <p className="empty__text">
              {notices.length === 0
                ? 'When the administration publishes an announcement for students, it will appear here.'
                : 'Try a different keyword or clear the priority filter.'}
            </p>
            {notices.length > 0 ? (
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => {
                  setSearch('');
                  setPriority('all');
                }}
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="notice-feed">
          {visible.map((notice) => (
            <article key={notice._id} className={`notice-card notice-card--${notice.priority}`}>
              <div className="notice-card__mark" aria-hidden="true">
                <IconNotice size={19} />
              </div>

              <div className="notice-card__body">
                <div className="notice-card__head">
                  <h2 className="notice-card__title">{notice.title}</h2>
                  <span className={`badge badge--plain badge--${PRIORITY_TONE[notice.priority] || 'info'}`}>
                    {PRIORITY_LABEL[notice.priority] || notice.priority}
                  </span>
                </div>

                <p className="notice-card__text">{notice.body}</p>

                <div className="notice-card__meta">
                  <span>
                    <IconClock size={13} />
                    {timeAgo(notice.createdAt)}
                  </span>
                  <span>
                    <IconCalendar size={13} />
                    {formatDate(notice.createdAt)}
                  </span>
                  <span className="notice-card__audience">
                    For {notice.audience === 'all' ? 'everyone' : notice.audience}
                  </span>
                  {notice.postedBy?.name ? (
                    <span className="notice-card__author">Posted by {notice.postedBy.name}</span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
