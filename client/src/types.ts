export type SiteStatus = 'active' | 'inactive' | 'completed';
export type InstallationStatus = 'planned' | 'in_progress' | 'completed' | 'failed';

export interface Site {
  id: number;
  name: string;
  address: string;
  status: SiteStatus;
  contactName?: string | null;
  contactPhone?: string | null;
  createdAt: string;
}

export interface SiteInput {
  name: string;
  address: string;
  status: SiteStatus;
  contactName: string;
  contactPhone: string;
}

export interface Installation {
  id: number;
  siteId: number;
  siteName: string;
  status: InstallationStatus;
  scheduledDate?: string | null;
  assignedToName?: string | null;
  notes?: string | null;
}

export interface InstallationInput {
  siteId: number;
  status: InstallationStatus;
  scheduledDate: string;
  notes: string;
}

export interface Summary {
  totalSites: number;
  activeSites: number;
  totalInstallations: number;
  completedInstallations: number;
  inProgressInstallations: number;
  failedInstallations: number;
}
