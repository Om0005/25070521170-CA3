import { useCallback, useEffect, useState } from 'react';
import { resourceApi } from '../api/resources';
import { getErrorMessage, getFieldErrors } from '../api/client';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';
import FormField from './FormField';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconInbox,
  IconChevronLeft,
  IconChevronRight,
} from './icons';

/** Blank form state for a set of field definitions. */
const buildEmptyValues = (fields, initialValues = {}) => {
  const values = { ...initialValues };
  fields.forEach((field) => {
    if (values[field.name] === undefined) {
      values[field.name] = field.type === 'checkbox' ? false : '';
    }
  });
  return values;
};

/** Copy a table row into form values (handles populated objects). */
const rowToValues = (row, fields, initialValues) => {
  const values = buildEmptyValues(fields, initialValues);

  fields.forEach((field) => {
    const raw = row?.[field.name];
    if (raw === null || raw === undefined) {
      values[field.name] = field.type === 'checkbox' ? false : '';
      return;
    }
    if (typeof raw === 'object') {
      values[field.name] = raw._id || '';
      return;
    }
    values[field.name] = raw;
  });

  return values;
};

/**
 * Generic CRUD screen: toolbar (search + filters), table, pagination,
 * create/edit modal and a delete confirmation. Each resource page only
 * supplies its columns and form fields.
 */
export default function ResourcePage({
  title,
  subtitle,
  endpoint,
  itemLabel = 'Record',
  columns,
  fields,
  filters = [],
  searchPlaceholder = 'Search…',
  initialValues = {},
  pageSize = 8,
  toggleField = null,
  emptyTitle,
  emptyText,
}) {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterState, setFilterState] = useState(() =>
    Object.fromEntries(filters.map((filter) => [filter.name, 'all']))
  );
  const filterKey = JSON.stringify(filterState);

  const [modal, setModal] = useState(null);
  const [values, setValues] = useState(() => buildEmptyValues(fields, initialValues));
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  /* ------------------------------ data ------------------------------ */

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = { page, limit: pageSize };
      if (debouncedSearch) params.search = debouncedSearch;

      filters.forEach((filter) => {
        const value = filterState[filter.name];
        if (value && value !== 'all') params[filter.name] = value;
      });

      const response = await resourceApi.list(endpoint, params);
      setRows(response.data || []);
      setMeta({
        total: response.total ?? 0,
        page: response.page ?? 1,
        pages: response.pages ?? 1,
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setRows([]);
    } finally {
      setLoading(false);
    }
    // filterKey stands in for filterState to keep the dependency list stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, page, pageSize, debouncedSearch, filterKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce typing so we don't hit the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Any new search / filter starts again from page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterKey]);

  // If the current page disappeared (e.g. last row deleted), step back.
  useEffect(() => {
    if (!loading && meta.page > meta.pages) setPage(meta.pages);
  }, [loading, meta.page, meta.pages]);

  /* ---------------------------- modal ---------------------------- */

  const openCreate = () => {
    setValues(buildEmptyValues(fields, initialValues));
    setFieldErrors({});
    setModal({ mode: 'create', record: null });
  };

  const openEdit = (row) => {
    setValues(rowToValues(row, fields, initialValues));
    setFieldErrors({});
    setModal({ mode: 'edit', record: row });
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setFieldErrors({});
  };

  const handleChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const buildPayload = () => {
    const payload = {};

    fields.forEach((field) => {
      const value = values[field.name];

      if (field.type === 'checkbox') {
        payload[field.name] = Boolean(value);
        return;
      }

      if (value === '' || value === null || value === undefined) {
        // Numbers and dates are omitted when empty so the schema default applies.
        if (field.type === 'number' || field.type === 'date') return;
        payload[field.name] = '';
        return;
      }

      payload[field.name] = field.type === 'number' ? Number(value) : value;
    });

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const missing = {};
    fields.forEach((field) => {
      if (!field.required) return;
      const value = values[field.name];
      if (value === '' || value === null || value === undefined) {
        missing[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(missing).length) {
      setFieldErrors(missing);
      toast.error('Please fill in the required fields.', 'Incomplete form');
      return;
    }

    setSaving(true);
    setFieldErrors({});

    try {
      if (modal.mode === 'create') {
        await resourceApi.create(endpoint, buildPayload());
        toast.success(`${itemLabel} was added successfully.`, 'Created');
        setPage(1);
      } else {
        await resourceApi.update(endpoint, modal.record._id, buildPayload());
        toast.success(`${itemLabel} was updated successfully.`, 'Saved');
      }

      setModal(null);
      await load();
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      toast.error(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);

    try {
      await resourceApi.remove(endpoint, confirmTarget._id);
      toast.success(`${itemLabel} was deleted.`, 'Removed');
      setConfirmTarget(null);
      await load();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (row) => {
    setTogglingId(row._id);
    try {
      await resourceApi.update(endpoint, row._id, {
        [toggleField.name]: !row[toggleField.name],
      });
      await load();
      toast.success(
        `${itemLabel} marked as ${!row[toggleField.name] ? toggleField.onLabel : toggleField.offLabel}.`,
        'Updated'
      );
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setTogglingId(null);
    }
  };

  /* ---------------------------- rendering ---------------------------- */

  const columnCount = columns.length + 1 + (toggleField ? 1 : 0);
  const firstRow = meta.total === 0 ? 0 : (meta.page - 1) * pageSize + 1;
  const lastRow = Math.min(meta.page * pageSize, meta.total);

  const pageNumbers = () => {
    const total = meta.pages;
    if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
    const start = Math.max(1, Math.min(meta.page - 2, total - 4));
    return Array.from({ length: 5 }, (_, index) => start + index);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <h1 className="page__title">{title}</h1>
          <p className="page__subtitle">{subtitle}</p>
        </div>
        <div className="page__actions">
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            <IconPlus />
            New {itemLabel.toLowerCase()}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <IconSearch />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </div>

          {filters.map((filter) => (
            <select
              key={filter.name}
              className="filter-select"
              value={filterState[filter.name]}
              onChange={(event) =>
                setFilterState((current) => ({ ...current, [filter.name]: event.target.value }))
              }
              aria-label={`Filter by ${filter.label}`}
            >
              <option value="all">All {filter.label.toLowerCase()}</option>
              {(filter.options || []).map((option) => {
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : String(option);
                return (
                  <option key={optionValue} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          ))}
        </div>

        {error ? (
          <div style={{ padding: 18 }}>
            <div className="alert alert--error" role="alert">
              {error}
            </div>
            <button type="button" className="btn btn--secondary btn--sm" style={{ marginTop: 12 }} onClick={load}>
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                    {toggleField ? <th>{toggleField.label}</th> : null}
                    <th className="td-actions">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, rowIndex) => (
                        <tr key={`skeleton-${rowIndex}`}>
                          {Array.from({ length: columnCount }).map((__, cellIndex) => (
                            <td key={`skeleton-${rowIndex}-${cellIndex}`}>
                              <span className="skeleton" style={{ width: '70%' }} />
                            </td>
                          ))}
                        </tr>
                      ))
                    : rows.map((row) => (
                        <tr key={row._id}>
                          {columns.map((column) => (
                            <td key={column.key}>
                              {column.render ? column.render(row) : row[column.key] ?? '—'}
                            </td>
                          ))}

                          {toggleField ? (
                            <td>
                              <button
                                type="button"
                                className={`badge badge--plain badge--${
                                  row[toggleField.name]
                                    ? toggleField.onTone || 'success'
                                    : toggleField.offTone || 'neutral'
                                }`}
                                onClick={() => handleToggle(row)}
                                disabled={togglingId === row._id}
                                title={toggleField.hint || 'Click to change'}
                                style={{ cursor: 'pointer', border: '1px solid transparent' }}
                              >
                                {row[toggleField.name] ? toggleField.onLabel : toggleField.offLabel}
                              </button>
                            </td>
                          ) : null}

                          <td className="td-actions">
                            <div className="row-actions">
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => openEdit(row)}
                                aria-label={`Edit ${itemLabel}`}
                                title="Edit"
                              >
                                <IconEdit />
                              </button>
                              <button
                                type="button"
                                className="icon-btn icon-btn--danger"
                                onClick={() => setConfirmTarget(row)}
                                aria-label={`Delete ${itemLabel}`}
                                title="Delete"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {!loading && rows.length === 0 ? (
              <div className="empty">
                <div className="empty__icon">
                  <IconInbox />
                </div>
                <p className="empty__title">{emptyTitle || `No ${itemLabel.toLowerCase()}s found`}</p>
                <p className="empty__text">
                  {emptyText || 'Try a different search or filter, or add the first record.'}
                </p>
                <button type="button" className="btn btn--primary btn--sm" onClick={openCreate}>
                  <IconPlus />
                  Add {itemLabel.toLowerCase()}
                </button>
              </div>
            ) : null}
          </>
        )}

        {!error ? (
          <div className="table-foot">
            <span>
              Showing <strong>{firstRow}</strong>–<strong>{lastRow}</strong> of{' '}
              <strong>{meta.total}</strong>
            </span>

            <div className="pager">
              <button
                type="button"
                className="pager__btn"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={meta.page <= 1 || loading}
                aria-label="Previous page"
              >
                <IconChevronLeft size={14} />
              </button>

              {pageNumbers().map((number) => (
                <button
                  key={number}
                  type="button"
                  className={`pager__btn${number === meta.page ? ' is-current' : ''}`}
                  onClick={() => setPage(number)}
                  disabled={loading}
                  aria-current={number === meta.page ? 'page' : undefined}
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                className="pager__btn"
                onClick={() => setPage((current) => Math.min(meta.pages, current + 1))}
                disabled={meta.page >= meta.pages || loading}
                aria-label="Next page"
              >
                <IconChevronRight size={14} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {modal ? (
        <Modal
          title={`${modal.mode === 'create' ? 'Add' : 'Edit'} ${itemLabel.toLowerCase()}`}
          subtitle={
            modal.mode === 'create'
              ? `Create a new ${itemLabel.toLowerCase()} record.`
              : 'Update the details and save your changes.'
          }
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="btn btn--secondary" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button type="submit" form="resource-form" className="btn btn--primary" disabled={saving}>
                {saving ? <span className="spinner" /> : null}
                {modal.mode === 'create' ? `Create ${itemLabel.toLowerCase()}` : 'Save changes'}
              </button>
            </>
          }
        >
          <form id="resource-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  error={fieldErrors[field.name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </form>
        </Modal>
      ) : null}

      {confirmTarget ? (
        <Modal
          size="sm"
          title={`Delete ${itemLabel.toLowerCase()}?`}
          onClose={() => (deleting ? null : setConfirmTarget(null))}
          footer={
            <>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setConfirmTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button type="button" className="btn btn--danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? <span className="spinner" /> : null}
                Delete
              </button>
            </>
          }
        >
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
            This will permanently remove{' '}
            <strong>{confirmTarget.name || confirmTarget.title || confirmTarget.code || 'this record'}</strong>{' '}
            from the database. This action cannot be undone.
          </p>
        </Modal>
      ) : null}
    </>
  );
}
