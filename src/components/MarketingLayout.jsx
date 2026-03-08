import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

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

      {/* ── Navbar ── */}
      <nav className="marketing-nav">
        <Link to="/" className="marketing-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 900, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 20px rgba(139,92,246,0.4)', flexShrink: 0 }}>🛡</div>
          <span style={{ background: 'linear-gradient(90deg,#8b5cf6,#6366f1,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SentinelX</span>
        </Link>

        {/* Desktop nav links */}
        <div className="marketing-nav-links">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13.5, fontWeight: 500,
              color: pathname === l.to ? 'var(--blue-light)' : 'var(--text-secondary)',
              background: pathname === l.to ? 'var(--blue-dim)' : 'transparent',
              transition: 'all .2s', textDecoration: 'none',
            }}
              onMouseEnter={e => { if (pathname !== l.to) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
              onMouseLeave={e => { if (pathname !== l.to) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
            >{l.label}</Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="marketing-nav-right">
          <Link to="/login" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Log In</Link>
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <div className="theme-toggle-track"><div className="theme-toggle-thumb" /></div>
          </button>
          <Link to="/dashboard">
            <button style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(139,92,246,0.35)', transition: 'all 0.3s ease' }}>
              Get a Demo
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="marketing-hamburger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text-primary)', borderRadius: 2, transition: 'all .3s', transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text-primary)', borderRadius: 2, transition: 'all .3s', opacity: mobileOpen ? 0 : 1, margin: '5px 0' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text-primary)', borderRadius: 2, transition: 'all .3s', transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="marketing-mobile-menu">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '13px 20px', fontSize: 15, fontWeight: 500, color: pathname === l.to ? 'var(--blue-light)' : 'var(--text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
            >{l.label}</Link>
          ))}
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Log In</Link>
            <button onClick={toggleTheme} className="theme-toggle">
              <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
              <div className="theme-toggle-track"><div className="theme-toggle-thumb" /></div>
            </button>
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
              <button style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Get a Demo</button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer style={{ background: 'rgba(3,5,15,0.98)', borderTop: '1px solid var(--border)', padding: '64px 0 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="marketing-footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontFamily: 'Outfit,sans-serif', fontSize: 20, fontWeight: 800, color: '#fff' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(139,92,246,0.4)' }}>🛡</div>
                SentinelX
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 280 }}>
                AI-powered cloud security platform protecting enterprise infrastructure from advanced threats — in real time.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                {['𝕏', 'in', '𝔾', '▶'].map(s => (
                  <div key={s} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue-light)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >{s}</div>
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
                <h5 style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 18 }}>{col.title}</h5>
                {col.links.map(l => (
                  <Link key={l.l} to={l.to} style={{ display: 'block', marginBottom: 12, fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--blue-light)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >{l.l}</Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            <div>© 2024 SentinelX Security Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block' }} />
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
