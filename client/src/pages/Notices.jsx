import ResourcePage from '../components/ResourcePage';
import Badge, { PriorityBadge } from '../components/Badge';
import { AUDIENCES, PRIORITIES, toOptions } from '../data/constants';
import { formatDate, humanize, truncate } from '../data/helpers';

const columns = [
  {
    key: 'title',
    label: 'Notice',
    render: (row) => (
      <div style={{ minWidth: 0 }}>
        <div className="cell-strong">{row.title}</div>
        <div className="cell-stack__meta">{truncate(row.body, 76)}</div>
      </div>
    ),
  },
  {
    key: 'audience',
    label: 'Audience',
    render: (row) => <Badge tone="sky">{humanize(row.audience)}</Badge>,
  },
  {
    key: 'priority',
    label: 'Priority',
    render: (row) => <PriorityBadge value={row.priority} />,
  },
  {
    key: 'postedBy',
    label: 'Posted by',
    render: (row) => row.postedBy?.name || 'Administrator',
  },
  { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
];

const fields = [
  {
    name: 'title',
    label: 'Notice title',
    type: 'text',
    required: true,
    span: 'full',
    placeholder: 'Semester end examination timetable released',
  },
  {
    name: 'body',
    label: 'Notice content',
    type: 'textarea',
    required: true,
    span: 'full',
    rows: 5,
    placeholder: 'Write the full notice here…',
  },
  {
    name: 'audience',
    label: 'Audience',
    type: 'select',
    required: true,
    options: AUDIENCES.map((audience) => ({ value: audience, label: humanize(audience) })),
    placeholder: 'Select audience',
  },
  {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    required: true,
    options: PRIORITIES.map((priority) => ({ value: priority, label: humanize(priority) })),
    placeholder: 'Select priority',
  },
  {
    name: 'published',
    label: 'Publish this notice immediately',
    type: 'checkbox',
    hint: 'Unpublished notices stay as drafts and are hidden from the dashboard.',
  },
];

const filters = [
  { name: 'audience', label: 'Audiences', options: toOptions(AUDIENCES) },
  { name: 'priority', label: 'Priorities', options: toOptions(PRIORITIES) },
  {
    name: 'published',
    label: 'Statuses',
    options: [
      { value: 'true', label: 'Published' },
      { value: 'false', label: 'Draft' },
    ],
  },
];

export default function Notices() {
  return (
    <ResourcePage
      title="Notices"
      subtitle="Official announcements for students, faculty or the whole campus."
      endpoint="/notices"
      itemLabel="Notice"
      columns={columns}
      fields={fields}
      filters={filters}
      searchPlaceholder="Search notices by title or content…"
      initialValues={{ audience: 'all', priority: 'normal', published: true }}
      toggleField={{
        name: 'published',
        label: 'Status',
        onLabel: 'Published',
        offLabel: 'Draft',
        onTone: 'success',
        offTone: 'neutral',
        hint: 'Click to publish or unpublish',
      }}
      emptyTitle="No notices found"
      emptyText="Publish an announcement so it appears on the dashboard."
    />
  );
}
