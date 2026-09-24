import type { SiteStatus, InstallationStatus } from '../types';

interface StatusBadgeProps {
  status: SiteStatus | InstallationStatus;
}

const statusLabels: Record<SiteStatus | InstallationStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  completed: 'Completed',
  planned: 'Planned',
  in_progress: 'In progress',
  failed: 'Failed',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = statusLabels[status] || status;
  return (
    <span className={`status-badge status-${status.replace('_', '-')}`}>
      {label}
    </span>
  );
}
