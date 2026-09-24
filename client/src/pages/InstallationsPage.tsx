import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { installationsApi, sitesApi } from '../services/api';
import InstallationForm from '../components/InstallationForm';
import StatusBadge from '../components/StatusBadge';
import { ConfirmDialog } from '../components/Modal';
import { useToast } from '../components/toast-context';
import type { Installation, InstallationInput, Site } from '../types';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

interface InstallationsPageProps {
  initialStatus?: string;
}

export default function InstallationsPage({ initialStatus = '' }: InstallationsPageProps) {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Installation | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Installation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const requestId = useRef(0);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  const loadInstallations = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError('');

    try {
      const data = await installationsApi.list(status ? { status } : {});
      if (currentRequest === requestId.current) setInstallations(data);
    } catch (requestError) {
      if (currentRequest === requestId.current) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load installations');
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [status]);

  const loadSites = useCallback(async () => {
    try {
      setSites(await sitesApi.list({ limit: 100 }));
    } catch {
      setSites([]);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInstallations();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadInstallations]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSites();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadSites]);

  const filteredInstallations = useMemo(() => {
    if (!search.trim()) return installations;
    const query = search.toLowerCase();
    return installations.filter((item) => {
      const matchSite = item.siteName.toLowerCase().includes(query);
      const matchNotes = item.notes?.toLowerCase().includes(query) ?? false;
      const matchAssignee = item.assignedToName?.toLowerCase().includes(query) ?? false;
      return matchSite || matchNotes || matchAssignee;
    });
  }, [installations, search]);

  const openCreateForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (installation: Installation) => {
    setEditing(installation);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const saveInstallation = async (installation: InstallationInput): Promise<boolean> => {
    try {
      if (editing) {
        await installationsApi.update(editing.id, installation);
        showToast('Installation updated');
      } else {
        await installationsApi.create(installation);
        showToast('Installation created');
      }
      closeForm();
      void Promise.all([loadInstallations(), loadSites()]);
      return true;
    } catch (requestError) {
      showToast(requestError instanceof Error ? requestError.message : 'Unable to save installation', 'error');
      return false;
    }
  };

  const deleteInstallation = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      await installationsApi.remove(pendingDelete.id);
      showToast('Installation deleted');
      setPendingDelete(null);
      void loadInstallations();
    } catch (requestError) {
      showToast(requestError instanceof Error ? requestError.message : 'Unable to delete installation', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
  };

  const formValue = editing ? {
    siteId: editing.siteId,
    status: editing.status,
    scheduledDate: editing.scheduledDate ? editing.scheduledDate.slice(0, 10) : '',
    notes: editing.notes || '',
  } : undefined;

  const hasFilters = Boolean(search || status);

  return (
    <>
      <header className="page-header">
        <div className="page-header-info">
          <h1>Installations</h1>
          <p>Track scheduled and completed installation work.</p>
        </div>
        <div className="page-actions">
          <button className="primary-button" type="button" onClick={openCreateForm}>
            New installation
          </button>
        </div>
      </header>

      <section className="content-section" aria-labelledby="installations-heading">
        <div className="section-heading">
          <div>
            <h2 id="installations-heading">Installation records</h2>
            <p>
              {loading
                ? 'Loading installations...'
                : `${filteredInstallations.length} ${filteredInstallations.length === 1 ? 'record' : 'records'}`}
            </p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-field">
            <input
              type="search"
              placeholder="Search by site, assignee, notes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="filter-select">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter installation status"
            >
              <option value="">All statuses</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          {hasFilters && (
            <button className="text-button" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {error && <div className="alert" role="alert">{error}</div>}

        {loading ? (
          <div className="loading-state" role="status">Loading installation records...</div>
        ) : filteredInstallations.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Status</th>
                  <th>Scheduled</th>
                  <th>Assigned to</th>
                  <th>Notes</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstallations.map((installation) => (
                  <tr key={installation.id}>
                    <td data-label="Site">
                      <strong>{installation.siteName}</strong>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={installation.status} />
                    </td>
                    <td data-label="Scheduled">
                      {installation.scheduledDate
                        ? dateFormatter.format(new Date(installation.scheduledDate))
                        : 'Not set'}
                    </td>
                    <td data-label="Assigned to">{installation.assignedToName || 'Unassigned'}</td>
                    <td data-label="Notes" className="notes-cell">
                      {installation.notes || 'Not set'}
                    </td>
                    <td data-label="Actions" className="table-actions">
                      <button className="text-button" type="button" onClick={() => openEditForm(installation)}>
                        Edit
                      </button>
                      <button className="text-button danger" type="button" onClick={() => setPendingDelete(installation)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No installations found</h3>
            <p>{hasFilters ? 'No results match the current filters.' : 'Add an installation to begin tracking work.'}</p>
            {hasFilters ? (
              <button className="secondary-button" type="button" onClick={clearFilters}>
                Clear filters
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={openCreateForm}>
                New installation
              </button>
            )}
          </div>
        )}
      </section>

      {formOpen && (
        <InstallationForm
          sites={sites}
          initialValue={formValue}
          onSubmit={saveInstallation}
          onCancel={closeForm}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete installation?"
          description={`This will remove the installation record for "${pendingDelete.siteName}".`}
          confirmLabel="Delete installation"
          busy={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => void deleteInstallation()}
        />
      )}
    </>
  );
}
