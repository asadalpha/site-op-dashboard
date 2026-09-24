import { useEffect, useMemo, useState } from 'react';
import { dashboardApi } from '../services/api';
import SummaryCard from '../components/SummaryCard';
import type { Summary } from '../types';

const emptySummary: Summary = {
  totalSites: 0,
  activeSites: 0,
  totalInstallations: 0,
  completedInstallations: 0,
  inProgressInstallations: 0,
  failedInstallations: 0,
};

interface DashboardPageProps {
  onNavigate: (page: 'sites' | 'installations', filterStatus?: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = () => {
    setLoading(true);
    setError('');

    dashboardApi.summary()
      .then((data) => {
        setSummary(data);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load operational summary');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const today = useMemo(() => new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date()), []);

  const planned = Math.max(
    summary.totalInstallations
      - summary.completedInstallations
      - summary.inProgressInstallations
      - summary.failedInstallations,
    0,
  );

  const statuses = [
    { key: 'planned', label: 'Planned', value: planned },
    { key: 'in-progress', label: 'In progress', value: summary.inProgressInstallations },
    { key: 'completed', label: 'Completed', value: summary.completedInstallations },
    { key: 'failed', label: 'Failed', value: summary.failedInstallations },
  ];

  const percentage = (value: number) => (summary.totalInstallations
    ? Math.round((value / summary.totalInstallations) * 100)
    : 0);

  return (
    <>
      <header className="page-header">
        <div className="page-header-info">
          <h1>Operations overview</h1>
          <p>Current site and installation status.</p>
        </div>
        <div className="page-actions">
          <span className="page-date">{today}</span>
          <button
            className="secondary-button"
            type="button"
            onClick={fetchSummary}
            disabled={loading}
          >
            Refresh
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => onNavigate('installations')}
          >
            New installation
          </button>
        </div>
      </header>

      {error && <div className="alert" role="alert">{error}</div>}

      <section className="summary-grid" aria-label="Operational summary">
        <SummaryCard
          label="Total sites"
          value={summary.totalSites}
          detail="Across all locations"
          onClick={() => onNavigate('sites')}
        />
        <SummaryCard
          label="Active sites"
          value={summary.activeSites}
          detail="Currently operational"
          onClick={() => onNavigate('sites')}
        />
        <SummaryCard
          label="Installations"
          value={summary.totalInstallations}
          detail="Recorded in total"
          onClick={() => onNavigate('installations')}
        />
        <SummaryCard
          label="Needs attention"
          value={summary.failedInstallations}
          detail="Failed installations"
          onClick={() => onNavigate('installations', 'failed')}
        />
      </section>

      <section className="content-section" aria-labelledby="installation-status-heading">
        <div className="section-heading">
          <div>
            <h2 id="installation-status-heading">Installation status</h2>
            <p>Distribution of all installation records.</p>
          </div>
          <span className="section-meta">{summary.totalInstallations} total</span>
        </div>

        {loading ? (
          <div className="loading-state" role="status">Loading installation status...</div>
        ) : summary.totalInstallations ? (
          <>
            <div
              className="status-distribution"
              role="img"
              aria-label={`${statuses.map((item) => `${item.label}: ${item.value}`).join(', ')}`}
            >
              {statuses.map((item) => {
                const pct = percentage(item.value);
                if (pct === 0) return null;
                return (
                  <span
                    className={`distribution-${item.key}`}
                    key={item.key}
                    style={{ width: `${pct}%` }}
                    title={`${item.label}: ${item.value} (${pct}%)`}
                  />
                );
              })}
            </div>
            <div className="status-breakdown">
              {statuses.map((item) => (
                <div
                  className="status-row"
                  key={item.key}
                  onClick={() => onNavigate('installations', item.key.replace('-', '_'))}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('installations', item.key.replace('-', '_')); }}
                >
                  <span className={`status-label status-label-${item.key}`}>{item.label}</span>
                  <strong>{item.value}</strong>
                  <span>{percentage(item.value)}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state compact">
            <h3>No installation data</h3>
            <p>Installation records will appear here after they are added.</p>
            <button className="secondary-button" type="button" onClick={() => onNavigate('installations')}>
              Add installation
            </button>
          </div>
        )}
      </section>
    </>
  );
}
