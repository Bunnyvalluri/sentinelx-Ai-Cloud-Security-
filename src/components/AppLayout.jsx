import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const navSections = [
  {
    section: null, items: [
      { to: '/dashboard', icon: '▣', label: 'Overview' },
      { to: '/logs', icon: '≡', label: 'Log Ingestion' },
      { to: '/threats', icon: '⚠', label: 'Anomaly Detection' },
      { to: '/alerts', icon: '🔔', label: 'Alert Queue', badge: 3 },
      { to: '/compliance', icon: '📋', label: 'Audit Logs' },
    ]
  },
  {
    section: 'ANALYTICS', items: [
      { to: '/analytics', icon: '📈', label: 'Security Analytics' },
    ]
  },
  {
    section: 'SETTINGS', items: [
      { to: '/users', icon: '👥', label: 'Users' },
    ]
  },
];

const PAGE_META = {
  '/dashboard': { title: 'Command Center', subtitle: 'Real-time security operations overview', bg: 'bg-gradient-security' },
  '/logs': { title: 'Log Ingestion', subtitle: 'Real-time cloud infrastructure log stream', bg: 'bg-gradient-logs' },
  '/threats': { title: 'Threat Monitoring Hub', subtitle: 'Active anomaly detection and response', bg: 'bg-gradient-threats' },
  '/alerts': { title: 'Active Alert Queue', subtitle: 'AI-prioritized security incident queue', bg: 'bg-gradient-threats' },
  '/compliance': { title: 'Compliance Audit', subtitle: 'Tamper-evident immutable system records', bg: 'bg-gradient-compliance' },
  '/analytics': { title: 'Security Analytics', subtitle: 'Threat trend visualisation & intelligence', bg: 'bg-gradient-analytics' },
  '/users': { title: 'User Management', subtitle: 'Role-based access control administration', bg: 'bg-gradient-users' },
};

export default function AppLayout({ children, title, subtitle, bgClass }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = PAGE_META[pathname] || {};
  const pageTitle = title || meta.title || 'SentinelX';
  const pageSubtitle = subtitle || meta.subtitle || '';
  const pageBg = bgClass || meta.bg || 'bg-gradient-security';
  const { theme, toggleTheme } = useTheme();

  const [time, setTime] = useState(new Date());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Track scroll progress via Lenis or native scroll
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    const lenis = window.__lenis;
    if (lenis) {
      lenis.on('scroll', ({ progress }) => setScrollProgress(progress * 100));
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (lenis) lenis.off('scroll');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`app-layout ${pageBg}`} style={{ minHeight: '100vh' }}>

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🛡</div>
          <span style={{
            background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>SentinelX</span>
          {/* Close button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-btn"
            aria-label="Close menu"
          >✕</button>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          {navSections.map((group, gi) => (
            <div className="nav-section" key={gi}>
              {group.section && (
                <div className="nav-section-label">{group.section}</div>
              )}
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Footer: user + quota */}
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>AM</div>
            <div className="user-info">
              <div className="user-name">Alex Morgan</div>
              <div className="user-role">Security Lead</div>
            </div>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: 'var(--text-muted)' }}>
              <span>Quota Used</span>
              <span style={{ color: 'var(--blue-light)', fontWeight: 700 }}>75%</span>
            </div>
            <div className="progress-bar" style={{ height: 3 }}>
              <div className="progress-fill" style={{ width: '75%' }} />
            </div>
          </div>

          <button onClick={() => navigate('/login')} className="btn btn-danger w-full py-2.5 text-xs">
            ⏻ Sign Out
          </button>
        </div>

        {/* Side aurora shimmer decoration */}
        <div style={{ position: 'absolute', top: '30%', right: -1, width: 2, height: 120, background: 'linear-gradient(180deg, transparent, var(--blue-light), var(--blue), transparent)', opacity: 0.6, animation: 'borderShimmer 3s ease infinite' }} />
      </aside>

      {/* ── TOPBAR ── */}
      <header className="topbar">
        {/* Scroll progress bar */}
        <div style={{
          position: 'absolute', bottom: -1, left: 0, height: 2,
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, var(--blue), var(--green), var(--violet))',
          transition: 'width 0.05s linear',
          borderRadius: '0 2px 2px 0',
          boxShadow: '0 0 8px var(--blue-glow)',
        }} />

        {/* Left: hamburger (mobile) + page title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Hamburger – mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          <div>
            {pageTitle && (
              <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {pageTitle}
              </div>
            )}
            {pageSubtitle && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{pageSubtitle}</span>
                <span className="live-indicator">
                  <span className="live-dot" />
                  Live
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: search + clock + notif */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Search */}
          <div className="search-input topbar-search" style={{ width: 240 }}>
            <svg width="13" height="13" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input placeholder="Search logs, IPs, alerts…" />
          </div>

          {/* Live clock */}
          <div className="topbar-clock" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 0.5 }}>
            {time.toLocaleTimeString('en-GB')} UTC
          </div>

          {/* Theme toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <div className="theme-toggle-track">
              <div className="theme-toggle-thumb" />
            </div>
          </button>

          {/* Notification bell */}
          <div className="icon-btn animate-glow" style={{ position: 'relative' }}>
            🔔
            <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--red)', border: '2px solid var(--bg-secondary)', boxShadow: '0 0 6px var(--red)' }} />
          </div>

          {/* Help */}
          <div className="icon-btn topbar-help">?</div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">
        <div className="page-content">
          {children}
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 10 }}>●</span>
            <span>All systems operational</span>
            <span>·</span>
            <span>Latency: <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>12ms</span></span>
            <span>·</span>
            <span>EPS: <span style={{ color: 'var(--blue-light)', fontWeight: 700 }}>14.2k</span>/s</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>SentinelX v4.2.1</span>
            <span>SOC2 Certified</span>
            <span>© 2023 SentinelX Inc.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
