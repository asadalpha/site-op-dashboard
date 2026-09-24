import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal } from './Modal';
import type { InstallationInput, InstallationStatus, Site } from '../types';

interface InstallationFormProps {
  sites: Site[];
  initialValue?: InstallationInput;
  onSubmit: (installation: InstallationInput) => Promise<boolean>;
  onCancel: () => void;
}

export default function InstallationForm({ sites, initialValue, onSubmit, onCancel }: InstallationFormProps) {
  const [form, setForm] = useState({
    siteId: initialValue?.siteId ?? sites[0]?.id ?? '',
    status: initialValue?.status ?? ('planned' as InstallationStatus),
    scheduledDate: initialValue?.scheduledDate ?? '',
    notes: initialValue?.notes ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target.name === 'status'
      ? (event.target.value as InstallationStatus)
      : event.target.value;
    setForm((current) => ({ ...current, [event.target.name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.siteId) return;

    setSaving(true);
    const saved = await onSubmit({
      siteId: Number(form.siteId),
      status: form.status,
      scheduledDate: form.scheduledDate,
      notes: form.notes,
    });
    if (saved) {
      setForm({
        siteId: sites[0]?.id ?? '',
        status: 'planned',
        scheduledDate: '',
        notes: '',
      });
    }
    setSaving(false);
  };

  return (
    <Modal
      title={initialValue ? 'Edit installation' : 'New installation'}
      description={initialValue ? 'Update the installation record.' : 'Record installation work against a site.'}
      onClose={onCancel}
    >
      <form className="dialog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="installation-site">
            Site
          </label>
          <select
            id="installation-site"
            name="siteId"
            required
            value={form.siteId}
            onChange={handleChange}
            disabled={!sites.length}
          >
            {!sites.length && <option value="">No sites available</option>}
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
          {!sites.length && (
            <p className="form-message">Add a site before creating an installation.</p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="installation-status">
              Status
            </label>
            <select
              id="installation-status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="installation-date">
              Scheduled date
            </label>
            <input
              id="installation-date"
              type="date"
              name="scheduledDate"
              value={form.scheduledDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="installation-notes">
            Notes
          </label>
          <textarea
            id="installation-notes"
            name="notes"
            rows={4}
            placeholder="Technical details, access instructions, or equipment notes..."
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <div className="dialog-actions">
          <button className="secondary-button" type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button
            className="primary-button"
            type="submit"
            disabled={saving || !sites.length || !form.siteId}
          >
            {saving ? 'Saving...' : initialValue ? 'Save changes' : 'Create installation'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
