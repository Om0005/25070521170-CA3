import { humanize } from '../data/helpers';

export default function Badge({ tone = 'neutral', children, plain = false }) {
  return (
    <span className={`badge badge--${tone}${plain ? ' badge--plain' : ''}`}>{children}</span>
  );
}

const STATUS_TONES = {
  active: 'success',
  inactive: 'warning',
  graduated: 'info',
  'on-leave': 'warning',
  retired: 'neutral',
};

export function StatusBadge({ value }) {
  return <Badge tone={STATUS_TONES[value] || 'neutral'}>{humanize(value || '—')}</Badge>;
}

const PRIORITY_TONES = { high: 'danger', normal: 'info', low: 'neutral' };

export function PriorityBadge({ value }) {
  return <Badge tone={PRIORITY_TONES[value] || 'neutral'}>{humanize(value || 'normal')}</Badge>;
}
