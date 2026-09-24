import { useState, type ReactNode } from 'react';

export type Page = 'dashboard' | 'sites' | 'installations';

interface LayoutProps {
  children: ReactNode;
  activePage: Page;
  theme: 'light' | 'dark';
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  onNavigate: (page: Page) => void;
}

const navigation: Array<{ id: Page; label: string }> = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'sites', label: 'Sites' },
  { id: 'installations', label: 'Installations' },
];

function ThemeIcon({ theme }: { theme: 'light' | 'dark' }) {
  if (theme === 'dark') {
    // Sun icon to switch to light mode
    return (
      <svg
        className="theme-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    );
  }

  // Moon icon to switch to dark mode
  return (
    <svg
      className="theme-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default function Layout({
  children,
  activePage,
  theme,
  collapsed,
  onToggleSidebar,
  onToggleTheme,
  onNavigate,
}: LayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileDrawerOpen(false);
  };

  const activePageLabel = navigation.find((n) => n.id === activePage)?.label || 'Overview';

  return (
    <div className={`app-shell theme-${theme}${collapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
          role="presentation"
        />
      )}

      {/* Left Sidebar */}
      <aside className={`sidebar${mobileDrawerOpen ? ' mobile-open' : ''}`}>
        <div className="brand-row">
          <span className="brand-name">SiteOps</span>
          <button
            className="collapse-text-button"
            type="button"
            onClick={onToggleSidebar}
            aria-label="Collapse sidebar"
          >
            Collapse
          </button>
          <button
            className="mobile-close-text-button"
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <nav className="primary-nav" aria-label="Main navigation">
          <span className="nav-section-label">Workspace</span>
          {navigation.map((item) => (
            <button
              className={`nav-item${activePage === item.id ? ' active' : ''}`}
              type="button"
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              aria-current={activePage === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-label-text">Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-frame">
          {/* Topbar with Theme Toggle exclusively on top right */}
          <div className="topbar">
            <div className="topbar-left">
              {collapsed && (
                <button
                  className="sidebar-expand-button"
                  type="button"
                  onClick={onToggleSidebar}
                >
                  Show sidebar
                </button>
              )}
              <button
                className="mobile-menu-trigger"
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
              >
                Menu
              </button>
              <div className="topbar-context">
                <span>SiteOps</span>
                <span className="context-separator">/</span>
                <span className="context-current">{activePageLabel}</span>
              </div>
            </div>

            <div className="topbar-right">
              <button
                className="theme-icon-button"
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <ThemeIcon theme={theme} />
              </button>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
