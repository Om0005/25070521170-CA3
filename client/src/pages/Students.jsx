import ResourcePage from '../components/ResourcePage';
import { StatusBadge } from '../components/Badge';
import { DEPARTMENTS, STUDENT_STATUS, YEARS, toOptions } from '../data/constants';
import { initials } from '../data/helpers';

const columns = [
  {
    key: 'name',
    label: 'Student',
    render: (row) => (
      <div className="cell-stack">
        <span className="avatar" aria-hidden="true">
          {initials(row.name)}
        </span>
        <div style={{ minWidth: 0 }}>
          <div className="cell-strong">{row.name}</div>
          <div className="cell-stack__meta">{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'rollNo',
    label: 'Roll no.',
    render: (row) => <span className="mono">{row.rollNo}</span>,
  },
  { key: 'department', label: 'Department' },
  { key: 'year', label: 'Year', render: (row) => `Year ${row.year}` },
  { key: 'phone', label: 'Phone', render: (row) => row.phone || '—' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge value={row.status} />,
  },
];

const fields = [
  { name: 'name', label: 'Full name', type: 'text', required: true, span: 'full', placeholder: 'Aarav Mehta' },
  { name: 'rollNo', label: 'Roll number', type: 'text', required: true, placeholder: '25070521001' },
  { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'student@college.edu' },
  { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '9822011201', hint: 'Optional, 8–15 digits' },
  {
    name: 'department',
    label: 'Department',
    type: 'select',
    required: true,
    options: DEPARTMENTS,
    placeholder: 'Select department',
  },
  {
    name: 'year',
    label: 'Year of study',
    type: 'select',
    required: true,
    options: YEARS.map((year) => ({ value: String(year), label: `Year ${year}` })),
    placeholder: 'Select year',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: STUDENT_STATUS.map((status) => ({ value: status, label: status.replace(/^\w/, (c) => c.toUpperCase()) })),
  },
  { name: 'admissionDate', label: 'Admission date', type: 'date', hint: 'Defaults to today when left empty' },
];

const filters = [
  { name: 'department', label: 'Departments', options: DEPARTMENTS },
  { name: 'year', label: 'Years', options: toOptions(YEARS) },
  { name: 'status', label: 'Statuses', options: toOptions(STUDENT_STATUS) },
];

export default function Students() {
  return (
    <ResourcePage
      title="Students"
      subtitle="Admission records, roll numbers and department-wise enrolment."
      endpoint="/students"
      itemLabel="Student"
      columns={columns}
      fields={fields}
      filters={filters}
      searchPlaceholder="Search by name, roll number, email or phone…"
      initialValues={{ status: 'active' }}
      emptyTitle="No students found"
      emptyText="Adjust your search or filters, or add the first student record."
    />
  );
}
