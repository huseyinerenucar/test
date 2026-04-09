const statusConfig = {
  'New': { bg: 'var(--status-new)', label: 'New' },
  'Reviewed': { bg: 'var(--status-reviewed)', label: 'Reviewed' },
  'Interview': { bg: 'var(--status-interview)', label: 'Interview' },
  'Pending CV': { bg: 'var(--status-pending)', label: 'Pending CV' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['New'];

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  );
}
