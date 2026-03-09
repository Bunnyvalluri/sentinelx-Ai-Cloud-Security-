import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ── Professional SVG Icons ── */
const Icons = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Logs: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Threats: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Compliance: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Analytics: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  Bell2: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  HelpCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  LogOut: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Chat: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  ),
  Server: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
};

const navSections = [
  {
    section: null, items: [
      { to: '/dashboard', Icon: Icons.Dashboard, label: 'Overview' },
      { to: '/logs', Icon: Icons.Logs, label: 'Log Ingestion' },
      { to: '/threats', Icon: Icons.Threats, label: 'Anomaly Detection' },
      { to: '/alerts', Icon: Icons.Bell, label: 'Alert Queue', badge: 3 },
      { to: '/compliance', Icon: Icons.Compliance, label: 'Audit Logs' },
    ]
  },
  {
    section: 'ANALYTICS', items: [
      { to: '/analytics', Icon: Icons.Analytics, label: 'Security Analytics' },
      { to: '/load-balancer', Icon: Icons.Server, label: 'LB Matrix' },
    ]
  },
  {
    section: 'SETTINGS', items: [
      { to: '/users', Icon: Icons.Users, label: 'User Management' },
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
  '/chat': { title: 'CEREBRO AI', subtitle: 'Real-time RAG powered assistant for any question', bg: 'bg-gradient-analytics' },
  '/load-balancer': { title: 'Global Load Balancer', subtitle: 'Active matrix edge-routing overview', bg: 'bg-gradient-security' },
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
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

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
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
            <Icons.Shield />
          </div>
          <span style={{
            background: 'linear-gradient(90deg, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: '-0.3px',
          }}>SentinelX</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-btn"
            aria-label="Close menu"
          >✕</button>
        </div>

        {/* New: version badge */}
        <div style={{ padding: '10px 16px 6px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#a78bfa', borderRadius: 6, padding: '2px 8px',
          }}>v4.2.1</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>All systems up</span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
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
                  <span className="nav-icon">
                    <item.Icon />
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11, color: 'var(--text-muted)' }}>
              <span>Quota Used</span>
              <span style={{ color: 'var(--blue-light)', fontWeight: 700 }}>75%</span>
            </div>
            <div className="progress-bar" style={{ height: 3 }}>
              <div className="progress-fill" style={{ width: '75%' }} />
            </div>
          </div>

          <button onClick={() => navigate('/login')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '9px 14px', borderRadius: 10,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
          >
            <Icons.LogOut /> Sign Out
          </button>
        </div>

        {/* Aurora shimmer */}
        <div style={{ position: 'absolute', top: '30%', right: -1, width: 2, height: 120, background: 'linear-gradient(180deg, transparent, var(--blue-light), var(--blue), transparent)', opacity: 0.5, animation: 'borderShimmer 3s ease infinite' }} />
      </aside>

      {/* ── TOPBAR ── */}
      <header className="topbar">
        {/* Scroll progress */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, height: 2,
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, var(--blue), var(--cyan), var(--violet))',
          transition: 'width 0.05s linear',
          borderRadius: '0 2px 2px 0',
          boxShadow: '0 0 8px var(--blue-glow)',
        }} />

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          <div>
            {pageTitle && (
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.2px' }}>
                {pageTitle}
              </div>
            )}
            {pageSubtitle && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{pageSubtitle}</span>
                <span className="live-indicator">
                  <span className="live-dot" />
                  Live
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Search */}
          <div className="search-input topbar-search" style={{ width: 230 }}>
            <Icons.Search />
            <input placeholder="Search logs, IPs, alerts…" />
          </div>

          {/* Clock */}
          <div className="topbar-clock" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 0.5, padding: '0 4px' }}>
            {time.toLocaleTimeString('en-GB')} UTC
          </div>

          {/* Theme */}
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <div className="theme-toggle-track">
              <div className="theme-toggle-thumb" />
            </div>
          </button>

          {/* Notification */}
          <div className="icon-btn" style={{ position: 'relative' }}>
            <Icons.Bell2 />
            <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--red)', border: '2px solid var(--bg-secondary)', boxShadow: '0 0 6px var(--red)' }} />
          </div>

          {/* Help */}
          <div className="icon-btn topbar-help">
            <Icons.HelpCircle />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">
        <div className="page-content">
          {children}
        </div>

        <footer className="app-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block', animation: 'liveRing 2s infinite' }} />
            <span style={{ fontWeight: 600, color: 'var(--green)' }}>All systems operational</span>
            <span style={{ color: 'var(--border-light)' }}>·</span>
            <span>Latency: <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>12ms</span></span>
            <span style={{ color: 'var(--border-light)' }}>·</span>
            <span>EPS: <span style={{ color: 'var(--blue-light)', fontWeight: 700 }}>14.2k</span>/s</span>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 11 }}>
            <span>SentinelX v4.2.1</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span>SOC2 Type II Certified</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span>© 2024 SentinelX Inc.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
