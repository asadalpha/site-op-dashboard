import type { Installation, InstallationInput, Site, SiteInput, Summary } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.error || 'Request failed');
  return body?.data;
};

export const dashboardApi = { summary: () => request<Summary>('/dashboard/summary') };
export const sitesApi = {
  list: (params: Record<string, string | number> = {}) => request<Site[]>(`/sites?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]))}`),
  create: (site: SiteInput) => request<Site>('/sites', { method: 'POST', body: JSON.stringify(site) }),
  update: (id: number, site: SiteInput) => request<Site>(`/sites/${id}`, { method: 'PUT', body: JSON.stringify(site) }),
  remove: (id: number) => request<void>(`/sites/${id}`, { method: 'DELETE' }),
};
export const installationsApi = {
  list: (params: Record<string, string | number> = {}) => request<Installation[]>(`/installations?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]))}`),
  create: (installation: InstallationInput) => request<Installation>('/installations', { method: 'POST', body: JSON.stringify(installation) }),
  update: (id: number, installation: InstallationInput) => request<Installation>(`/installations/${id}`, { method: 'PUT', body: JSON.stringify(installation) }),
  remove: (id: number) => request<void>(`/installations/${id}`, { method: 'DELETE' }),
};
