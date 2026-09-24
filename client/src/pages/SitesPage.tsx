import { useCallback, useEffect, useRef, useState } from 'react';
import { sitesApi } from '../services/api';
import SiteForm from '../components/SiteForm';
import StatusBadge from '../components/StatusBadge';
import { ConfirmDialog } from '../components/Modal';
import { useToast } from '../components/toast-context';
import type { Site, SiteInput } from '../types';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Site | null>(null);
  const [deleting, setDeleting] = useState(false);
  const requestId = useRef(0);
  const { showToast } = useToast();

  const loadSites = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError('');

    try {
      const data = await sitesApi.list({
        ...(search && { search }),
        ...(status && { status }),
      });
      if (currentRequest === requestId.current) setSites(data);
    } catch (requestError) {
      if (currentRequest === requestId.current) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load sites');
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSites();
    }, search ? 250 : 0);

    return () => window.clearTimeout(timer);
  }, [loadSites, search]);

  const openCreateForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (site: Site) => {
    setEditing(site);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const saveSite = async (site: SiteInput): Promise<boolean> => {
    try {
      if (editing) {
        await sitesApi.update(editing.id, site);
        showToast('Site updated');
      } else {
        await sitesApi.create(site);
        showToast('Site created');
      }
      closeForm();
      void loadSites();
      return true;
    } catch (requestError) {
      showToast(requestError instanceof Error ? requestError.message : 'Unable to save site', 'error');
      return false;
    }
  };

  const deleteSite = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      await sitesApi.remove(pendingDelete.id);
      showToast('Site deleted');
      setPendingDelete(null);
      void loadSites();
    } catch (requestError) {
      showToast(requestError instanceof Error ? requestError.message : 'Unable to delete site', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
  };

  const formValue = editing ? {
    name: editing.name,
    address: editing.address,
    status: editing.status,
    contactName: editing.contactName || '',
    contactPhone: editing.contactPhone || '',
  } : undefined;

  const hasFilters = Boolean(search || status);

  return (
    <>
      <header className="page-header">
        <div className="page-header-info">
          <h1>Sites</h1>
          <p>Manage locations and operational statuses.</p>
        </div>
        <div className="page-actions">
          <button className="primary-button" type="button" onClick={openCreateForm}>
            Add site
          </button>
        </div>
      </header>

      <section className="content-section" aria-labelledby="sites-heading">
        <div className="section-heading">
          <div>
            <h2 id="sites-heading">Site directory</h2>
            <p>{loading ? 'Loading sites...' : `${sites.length} ${sites.length === 1 ? 'site' : 'sites'}`}</p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-field">
            <input
              type="search"
              placeholder="Search by name or address..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="filter-select">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by site status"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
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
          <div className="loading-state" role="status">Loading site records...</div>
        ) : sites.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th>Created</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id}>
                    <td data-label="Site">
                      <strong>{site.name}</strong>
                    </td>
                    <td data-label="Address">{site.address}</td>
                    <td data-label="Status">
                      <StatusBadge status={site.status} />
                    </td>
                    <td data-label="Contact">
                      {site.contactName ? (
                        <span>
                          {site.contactName}
                          {site.contactPhone && <span className="cell-subtext"> ({site.contactPhone})</span>}
                        </span>
                      ) : (
                        <span className="cell-faint">None</span>
                      )}
                    </td>
                    <td data-label="Created">{dateFormatter.format(new Date(site.createdAt))}</td>
                    <td data-label="Actions" className="table-actions">
                      <button className="text-button" type="button" onClick={() => openEditForm(site)}>
                        Edit
                      </button>
                      <button className="text-button danger" type="button" onClick={() => setPendingDelete(site)}>
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
            <h3>No sites found</h3>
            <p>{hasFilters ? 'No results match the current filters.' : 'Add a site to start tracking operations.'}</p>
            {hasFilters ? (
              <button className="secondary-button" type="button" onClick={clearFilters}>
                Clear filters
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={openCreateForm}>
                Add site
              </button>
            )}
          </div>
        )}
      </section>

      {formOpen && (
        <SiteForm
          initialValue={formValue}
          onSubmit={saveSite}
          onCancel={closeForm}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete site?"
          description={`Deleting "${pendingDelete.name}" will also remove all its installation records.`}
          confirmLabel="Delete site"
          busy={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => void deleteSite()}
        />
      )}
    </>
  );
}
