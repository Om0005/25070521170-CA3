import { useEffect, useMemo, useState } from 'react';
import ResourcePage from '../components/ResourcePage';
import Badge from '../components/Badge';
import { resourceApi } from '../api/resources';
import { DEPARTMENTS, SEMESTERS, toOptions } from '../data/constants';
import { truncate } from '../data/helpers';

const columns = [
  {
    key: 'code',
    label: 'Code',
    render: (row) => <span className="mono cell-strong">{row.code}</span>,
  },
  {
    key: 'title',
    label: 'Course',
    render: (row) => (
      <div style={{ minWidth: 0 }}>
        <div className="cell-strong">{row.title}</div>
        <div className="cell-stack__meta">{truncate(row.description || 'No description', 64)}</div>
      </div>
    ),
  },
  { key: 'department', label: 'Department' },
  {
    key: 'credits',
    label: 'Credits',
    render: (row) => (
      <span>
        {row.credits} · Sem {row.semester}
      </span>
    ),
  },
  {
    key: 'faculty',
    label: 'Faculty',
    render: (row) =>
      row.faculty ? (
        <div>
          <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{row.faculty.name}</div>
          <div className="cell-stack__meta">{row.faculty.designation}</div>
        </div>
      ) : (
        <span className="badge badge--plain badge--warning">Unassigned</span>
      ),
  },
  { key: 'seats', label: 'Seats', render: (row) => row.seats },
  {
    key: 'isActive',
    label: 'Status',
    render: (row) => (
      <Badge tone={row.isActive ? 'success' : 'neutral'}>{row.isActive ? 'Running' : 'Archived'}</Badge>
    ),
  },
];

const filters = [
  { name: 'department', label: 'Departments', options: DEPARTMENTS },
  { name: 'semester', label: 'Semesters', options: toOptions(SEMESTERS) },
  {
    name: 'isActive',
    label: 'Statuses',
    options: [
      { value: 'true', label: 'Running' },
      { value: 'false', label: 'Archived' },
    ],
  },
];

export default function Courses() {
  const [facultyOptions, setFacultyOptions] = useState([]);

  useEffect(() => {
    let active = true;

    resourceApi
      .list('/faculty', { limit: 100 })
      .then((response) => {
        if (!active) return;
        setFacultyOptions(
          (response.data || []).map((member) => ({
            value: member._id,
            label: `${member.name} — ${member.department}`,
          }))
        );
      })
      .catch(() => {
        if (active) setFacultyOptions([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const fields = useMemo(
    () => [
      { name: 'code', label: 'Course code', type: 'text', required: true, placeholder: 'CS301' },
      { name: 'title', label: 'Course title', type: 'text', required: true, placeholder: 'Full Stack Web Development' },
      {
        name: 'department',
        label: 'Department',
        type: 'select',
        required: true,
        options: DEPARTMENTS,
        placeholder: 'Select department',
      },
      {
        name: 'semester',
        label: 'Semester',
        type: 'select',
        required: true,
        options: SEMESTERS.map((semester) => ({ value: String(semester), label: `Semester ${semester}` })),
        placeholder: 'Select semester',
      },
      {
        name: 'credits',
        label: 'Credits',
        type: 'number',
        required: true,
        placeholder: '4',
        hint: 'Between 1 and 6',
      },
      { name: 'seats', label: 'Total seats', type: 'number', placeholder: '60', hint: 'Defaults to 60' },
      {
        name: 'faculty',
        label: 'Assigned faculty',
        type: 'select',
        options: facultyOptions,
        placeholder: facultyOptions.length ? 'Select faculty member' : 'No faculty available',
        hint: 'Optional — the course can be assigned later',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        span: 'full',
        placeholder: 'What does this course cover?',
      },
      {
        name: 'isActive',
        label: 'Course is currently running',
        type: 'checkbox',
        hint: 'Uncheck to archive the course without deleting it.',
      },
    ],
    [facultyOptions]
  );

  return (
    <ResourcePage
      title="Courses"
      subtitle="Course catalogue with credits, semesters and faculty allocation."
      endpoint="/courses"
      itemLabel="Course"
      columns={columns}
      fields={fields}
      filters={filters}
      searchPlaceholder="Search by course code, title or description…"
      initialValues={{ isActive: true, credits: 4, seats: 60 }}
      emptyTitle="No courses found"
      emptyText="Add a course to start building the catalogue for this semester."
    />
  );
}
