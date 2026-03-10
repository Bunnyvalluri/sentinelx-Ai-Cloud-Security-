import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from './common/Logo';

const NAV_LINKS = [
  { label: 'Features', to: '/features' },
  { label: 'Integrations', to: '/integrations' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Docs', to: '/docs' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
];

export default function MarketingLayout({ children }) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', transition: 'background 0.3s ease, color 0.3s ease' }}>

      {/* ── Announcement banner ── */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.15) 50%, rgba(56,189,248,0.1) 100%)',
        borderBottom: '1px solid rgba(139,92,246,0.2)',
        padding: '9px 24px',
        textAlign: 'center',
        fontSize: 12.5,
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
        <span style={{ background: 'linear-gradient(90deg,#8b5cf6,#38bdf8)', color: '#fff', borderRadius: 100, padding: '2px 10px', fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>NEW</span>
        SentinelX 4.0 is here — CEREBRO AI with real-time threat correlation.
        <Link to="/features" style={{ color: 'var(--blue-light)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          See what's new
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>

      {/* ── Navbar ── */}
      <nav className="marketing-nav" style={{
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(var(--bg-primary-rgb, 6,6,8),0.85)',
      }}>
        <Link to="/" className="marketing-logo" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo layout="vertical" size={32} glow={true} />
        </Link>

        {/* Desktop nav */}
        <div className="marketing-nav-links">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                position: 'relative',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 500,
                color: pathname === l.to ? 'var(--blue-light)' : 'var(--text-secondary)',
                background: pathname === l.to ? 'var(--blue-dim)' : 'transparent',
                transition: 'color 0.2s, background 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                if (pathname !== l.to) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (pathname !== l.to) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >{l.label}</Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="marketing-nav-right">
          <Link to="/login" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Sign In
          </Link>
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <div className="theme-toggle-track"><div className="theme-toggle-thumb" /></div>
          </button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              color: '#fff', border: 'none', borderRadius: 9,
              padding: '9px 22px', fontSize: 13.5, fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(139,92,246,0.30)',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,92,246,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.30)'; }}
            >
              Get a Demo
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`hamburger-btn ${mobileOpen ? 'sidebar-open' : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          style={{ display: 'flex' }}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`marketing-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {/* Close button */}
        <button onClick={() => setMobileOpen(false)} style={{
          position: 'absolute', top: 20, right: 24,
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: 'var(--text-secondary)', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
        >✕</button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '16px',
                fontSize: 28,
                fontWeight: 700,
                color: pathname === l.to ? 'var(--blue-light)' : 'var(--text-primary)',
                textDecoration: 'none',
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`
              }}
            >{l.label}</Link>
          ))}
          <div style={{
            marginTop: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            width: '100%',
            opacity: mobileOpen ? 1 : 0,
            transition: 'all 0.5s ease 0.4s'
          }}>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ width: '100%', maxWidth: 280, padding: '16px', fontSize: 16 }}>Get Started</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign In</Link>
            <button onClick={toggleTheme} className="theme-toggle" style={{ transform: 'scale(1.2)' }}>
              <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
              <div className="theme-toggle-track"><div className="theme-toggle-thumb" /></div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>

      {/* ── Premium Footer ── */}
      <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', padding: '72px 0 36px', transition: 'background 0.3s ease' }}>
        {/* Top glow line */}
        <div className="glow-line" style={{ marginBottom: 0 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div className="marketing-footer-grid">
            <div>
              <Link to="/" style={{ textDecoration: 'none', marginBottom: 18, display: 'block' }}>
                <Logo layout="horizontal" size={32} />
              </Link>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
                AI-powered cloud security platform protecting enterprise infrastructure from advanced threats — in real time.
              </p>
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, padding: '7px 12px', display: 'inline-flex', marginBottom: 20 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', display: 'inline-block', animation: 'liveRing 2s infinite' }} />
                <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>All systems operational</span>
              </div>
              {/* Socials */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { icon: '𝕏', label: 'Twitter' },
                  { icon: 'in', label: 'LinkedIn' },
                  { icon: '⌥', label: 'GitHub' },
                ].map(s => (
                  <div key={s.icon} title={s.label} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all .2s', fontWeight: 700 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'; e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent'; }}
                  >{s.icon}</div>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: [{ l: 'Features', to: '/features' }, { l: 'Integrations', to: '/integrations' }, { l: 'Pricing', to: '/pricing' }, { l: 'Roadmap', to: '/roadmap' }] },
              { title: 'Resources', links: [{ l: 'Documentation', to: '/docs' }, { l: 'API Reference', to: '/api-reference' }, { l: 'Blog', to: '/blog' }, { l: 'Community', to: '/community' }] },
              { title: 'Company', links: [{ l: 'About Us', to: '/about' }, { l: 'Careers', to: '/careers' }, { l: 'Legal', to: '/legal' }, { l: 'Contact', to: '/contact' }] },
              { title: 'Security', links: [{ l: 'SOC2 Report', to: '/legal' }, { l: 'Privacy Policy', to: '/legal' }, { l: 'Status Page', to: '/contact' }, { l: 'Bug Bounty', to: '/contact' }] },
            ].map(col => (
              <div key={col.title}>
                <h5 style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>{col.title}</h5>
                {col.links.map(l => (
                  <Link key={l.l} to={l.to} style={{ display: 'block', marginBottom: 12, fontSize: 13.5, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >{l.l}</Link>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            <div>© 2024 SentinelX Security Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { icon: '🔒', text: 'SOC2 Type II' },
                { icon: '🌐', text: 'ISO 27001' },
                { icon: '🛡', text: 'GDPR Compliant' },
              ].map(b => (
                <span key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {b.icon} {b.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
