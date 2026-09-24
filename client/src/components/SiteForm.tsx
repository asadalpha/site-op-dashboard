import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal } from './Modal';
import type { SiteInput, SiteStatus } from '../types';

const emptySite: SiteInput = {
  name: '',
  address: '',
  status: 'active',
  contactName: '',
  contactPhone: '',
};

interface SiteFormProps {
  initialValue?: SiteInput;
  onSubmit: (site: SiteInput) => Promise<boolean>;
  onCancel: () => void;
}

export default function SiteForm({ initialValue, onSubmit, onCancel }: SiteFormProps) {
  const [form, setForm] = useState<SiteInput>(initialValue ?? emptySite);
  const [saving, setSaving] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.name === 'status'
      ? event.target.value as SiteStatus
      : event.target.value;
    setForm((current) => ({ ...current, [event.target.name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const saved = await onSubmit(form);
    if (saved) setForm(emptySite);
    setSaving(false);
  };

  return (
    <Modal
      title={initialValue ? 'Edit site' : 'Add site'}
      description={initialValue ? 'Update the site details and operational status.' : 'Enter location details for a new site.'}
      onClose={onCancel}
    >
      <form className="dialog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="site-name">
            Site name
          </label>
          <input
            id="site-name"
            name="name"
            required
            autoComplete="organization"
            placeholder="Site name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="site-address">
            Address
          </label>
          <input
            id="site-address"
            name="address"
            required
            autoComplete="street-address"
            placeholder="Street address, city"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="site-status">
              Status
            </label>
            <select
              id="site-status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="site-contact-name">
              Contact name
            </label>
            <input
              id="site-contact-name"
              name="contactName"
              autoComplete="name"
              placeholder="Primary contact"
              value={form.contactName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="site-contact-phone">
            Contact phone
          </label>
          <input
            id="site-contact-phone"
            name="contactPhone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Phone number"
            value={form.contactPhone}
            onChange={handleChange}
          />
        </div>

        <div className="dialog-actions">
          <button className="secondary-button" type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Saving...' : initialValue ? 'Save changes' : 'Add site'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
