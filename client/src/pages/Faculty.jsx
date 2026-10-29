import ResourcePage from '../components/ResourcePage';
import { StatusBadge } from '../components/Badge';
import { DEPARTMENTS, DESIGNATIONS, FACULTY_STATUS, toOptions } from '../data/constants';
import { initials } from '../data/helpers';

const columns = [
  {
    key: 'name',
    label: 'Faculty member',
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
    key: 'employeeId',
    label: 'Employee ID',
    render: (row) => <span className="mono">{row.employeeId}</span>,
  },
  { key: 'department', label: 'Department' },
  { key: 'designation', label: 'Designation' },
  { key: 'phone', label: 'Phone', render: (row) => row.phone || '—' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge value={row.status} />,
  },
];

const fields = [
  { name: 'name', label: 'Full name', type: 'text', required: true, span: 'full', placeholder: 'Dr. Rajesh Kulkarni' },
  { name: 'employeeId', label: 'Employee ID', type: 'text', required: true, placeholder: 'FAC-101' },
  { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'faculty@college.edu' },
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
    name: 'designation',
    label: 'Designation',
    type: 'select',
    required: true,
    options: DESIGNATIONS,
    placeholder: 'Select designation',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: FACULTY_STATUS.map((status) => ({
      value: status,
      label: status === 'on-leave' ? 'On leave' : status.replace(/^\w/, (c) => c.toUpperCase()),
    })),
  },
];

const filters = [
  { name: 'department', label: 'Departments', options: DEPARTMENTS },
  { name: 'designation', label: 'Designations', options: DESIGNATIONS },
  { name: 'status', label: 'Statuses', options: toOptions(FACULTY_STATUS) },
];

export default function Faculty() {
  return (
    <ResourcePage
      title="Faculty"
      subtitle="Teaching staff, designations and department allocation."
      endpoint="/faculty"
      itemLabel="Faculty member"
      columns={columns}
      fields={fields}
      filters={filters}
      searchPlaceholder="Search by name, employee ID or email…"
      initialValues={{ status: 'active' }}
      emptyTitle="No faculty records found"
      emptyText="Add faculty members so they can be assigned to courses."
    />
  );
}
