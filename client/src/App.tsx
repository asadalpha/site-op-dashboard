import { useState } from 'react';
import Layout, { type Page } from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import SitesPage from './pages/SitesPage';
import InstallationsPage from './pages/InstallationsPage';
import { ToastProvider } from './components/Toast';
import './App.css';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    if (document.documentElement.classList.contains('theme-light')) return 'light';
    if (document.documentElement.classList.contains('theme-dark')) return 'dark';
  }
  const saved = localStorage.getItem('siteops-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'dark';
}

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('siteops-sidebar-collapsed') === 'true';
  });
  const [initialInstallationStatus, setInitialInstallationStatus] = useState<string>('');

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add('theme-transition');

    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    root.classList.toggle('theme-dark', next === 'dark');
    root.classList.toggle('theme-light', next === 'light');
    root.style.colorScheme = next;
    localStorage.setItem('siteops-theme', next);
    setTheme(next);

    window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 200);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((value) => {
      const next = !value;
      localStorage.setItem('siteops-sidebar-collapsed', String(next));
      return next;
    });
  };

  const handleNavigate = (targetPage: Page, filterStatus?: string) => {
    setPage(targetPage);
    if (targetPage === 'installations' && filterStatus !== undefined) {
      setInitialInstallationStatus(filterStatus);
    } else {
      setInitialInstallationStatus('');
    }
  };

  const content = page === 'sites'
    ? <SitesPage />
    : page === 'installations'
      ? <InstallationsPage initialStatus={initialInstallationStatus} />
      : <DashboardPage onNavigate={handleNavigate} />;

  return (
    <ToastProvider>
      <Layout
        activePage={page}
        theme={theme}
        collapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onToggleTheme={toggleTheme}
        onNavigate={(p) => handleNavigate(p)}
      >
        {content}
      </Layout>
    </ToastProvider>
  );
}

export default App;
