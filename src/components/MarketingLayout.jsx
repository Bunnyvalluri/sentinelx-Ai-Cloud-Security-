import { useState, useEffect, useRef } from 'react';
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

const FOOTER_COLS = [
  { title: 'Product', links: [{ l: 'Features', to: '/features' }, { l: 'Integrations', to: '/integrations' }, { l: 'Pricing', to: '/pricing' }, { l: 'Roadmap', to: '/roadmap' }] },
  { title: 'Resources', links: [{ l: 'Documentation', to: '/docs' }, { l: 'API Reference', to: '/api-reference' }, { l: 'Blog', to: '/blog' }, { l: 'Community', to: '/community' }] },
  { title: 'Company', links: [{ l: 'About Us', to: '/about' }, { l: 'Careers', to: '/careers' }, { l: 'Legal', to: '/legal' }, { l: 'Contact', to: '/contact' }] },
  { title: 'Security', links: [{ l: 'SOC2 Report', to: '/legal' }, { l: 'Privacy Policy', to: '/legal' }, { l: 'Status Page', to: '/contact' }, { l: 'Bug Bounty', to: '/contact' }] },
];

export default function MarketingLayout({ children }) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMobileOpen(false), [pathname]);

  // Scroll-reveal observer - re-runs on route change
  useEffect(() => {
    // Small delay to let React finish rendering new page content
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.visible)');
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        }),
        { threshold: 0.05, rootMargin: '100px 0px 0px 0px' }
      );
      els.forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname]);


  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', transition: 'background 0.3s ease, color 0.3s ease' }}>

      <style>{`
        @keyframes mlSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mlFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .ml-nav-link {
          position: relative;
          padding: 7px 14px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.25s;
          text-decoration: none;
          white-space: nowrap;
        }
        .ml-nav-link::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          border-radius: 1px;
          background: linear-gradient(90deg, #8b5cf6, #38bdf8);
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ml-nav-link.active::after,
        .ml-nav-link:hover::after { width: 60%; }

        .footer-link {
          display: block;
          margin-bottom: 13px;
          font-size: 13.5px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s, transform 0.2s;
          font-weight: 400;
        }
        .footer-link:hover {
          color: var(--text-primary);
          transform: translateX(3px);
        }

        .social-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--text-muted);
          cursor: pointer; transition: all 0.25s; font-weight: 700;
          background: var(--bg-card);
        }
        .social-btn:hover {
          border-color: rgba(139,92,246,0.45);
          color: #a78bfa;
          background: rgba(139,92,246,0.1);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .get-demo-btn {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: #fff; border: none; border-radius: 10px;
          padding: 9px 22px; font-size: 13.5px; font-weight: 700;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(139,92,246,0.28), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: all 0.25s; display: flex; align-items: center; gap: 7px;
          letter-spacing: -0.2px;
        }
        .get-demo-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
        }
        .get-demo-btn:active { transform: translateY(0); }

        .sign-in-link {
          font-size: 13.5px; font-weight: 600;
          color: var(--text-secondary); text-decoration: none;
          transition: color 0.2s; padding: 7px 10px; border-radius: 8px;
        }
        .sign-in-link:hover { color: var(--text-primary); }

        .announcement-bar {
          background: linear-gradient(90deg, rgba(124,58,237,0.12) 0%, rgba(99,102,241,0.10) 50%, rgba(56,189,248,0.08) 100%);
          border-bottom: 1px solid rgba(139,92,246,0.15);
          padding: 9px 24px;
          text-align: center;
          font-size: 12.5px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease;
          overflow: hidden;
          position: relative;
        }
        .close-announcement {
          position: absolute; right: 20px;
          width: 24px; height: 24px;
          border-radius: 6px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 13px;
          transition: all 0.2s;
        }
        .close-announcement:hover {
          background: rgba(244,63,94,0.12);
          border-color: rgba(244,63,94,0.3);
          color: #f43f5e;
        }

        .mobile-menu {
          position: fixed; inset: 0; z-index: 200;
          background: var(--bg-glass);
          backdrop-filter: blur(32px) saturate(180%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none;
          transition: opacity 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .mobile-menu.open {
          opacity: 1; pointer-events: all;
        }

        .scroll-progress-bar {
          position: fixed;
          top: 0; left: 0;
          height: 2px;
          background: linear-gradient(90deg, #7c3aed, #38bdf8, #10b981);
          z-index: 1001;
          transition: width 0.1s linear;
        }
      `}</style>

      {/* ── Scroll Progress ── */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* ── Announcement Banner ── */}
      {announcementVisible && (
        <div className="announcement-bar">
          <span style={{ background: 'linear-gradient(90deg,#8b5cf6,#38bdf8)', color: '#fff', borderRadius: 100, padding: '2px 11px', fontSize: 10, fontWeight: 800, letterSpacing: 0.6 }}>NEW</span>
          <span>SentinelX 4.0 is here — CEREBRO AI with real-time threat correlation.</span>
          <Link to="/features" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
            onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}>
            See what's new
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <button className="close-announcement" onClick={() => setAnnouncementVisible(false)}>✕</button>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav
        ref={navRef}
        className="marketing-nav"
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          borderBottom: scrolled
            ? (theme === 'light' ? '1px solid rgba(109,40,217,0.10)' : '1px solid rgba(255,255,255,0.07)')
            : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'blur(12px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'blur(12px)',
          background: theme === 'light'
            ? (scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(249,248,255,0.80)')
            : (scrolled ? 'rgba(6,6,12,0.92)' : 'rgba(6,6,12,0.60)'),
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: scrolled
            ? (theme === 'light' ? '0 4px 24px rgba(109,40,217,0.08)' : '0 4px 40px rgba(0,0,0,0.3)')
            : 'none',
        }}>

        {/* Logo */}
        <Link to="/" className="marketing-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo layout="horizontal" size={28} glow={true} />
        </Link>

        {/* Desktop nav */}
        <div className="marketing-nav-links">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`ml-nav-link ${pathname === l.to ? 'active' : ''}`}
              style={{
                color: pathname === l.to ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: pathname === l.to ? 'rgba(139,92,246,0.1)' : 'transparent',
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
          <Link to="/login" className="sign-in-link">Sign In</Link>
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <div className="theme-toggle-track"><div className="theme-toggle-thumb" /></div>
          </button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="get-demo-btn">
              Get a Demo
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {/* Close button */}
        <button onClick={() => setMobileOpen(false)} style={{
          position: 'absolute', top: 24, right: 24,
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: 'var(--text-secondary)', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.12)'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >✕</button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', textAlign: 'center' }}>
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '14px 32px',
                fontSize: 32,
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '-0.5px',
                color: pathname === l.to ? 'var(--blue-light)' : 'var(--text-primary)',
                textDecoration: 'none',
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
                borderRadius: 12,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; }}
              onMouseLeave={e => { e.currentTarget.style.color = pathname === l.to ? 'var(--blue-light)' : 'var(--text-primary)'; }}
            >{l.label}</Link>
          ))}
          <div style={{
            marginTop: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            width: '100%',
            opacity: mobileOpen ? 1 : 0,
            transition: 'all 0.5s ease 0.4s'
          }}>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ width: '100%', maxWidth: 300, padding: '17px', fontSize: 17, borderRadius: 100, textAlign: 'center' }}>Get Started Free</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>

      {/* ── Premium Footer ── */}
      <footer style={{
        background: theme === 'light'
          ? 'linear-gradient(180deg, var(--bg-primary) 0%, #ede9fe 100%)'
          : 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(4,4,10,1) 100%)',
        borderTop: theme === 'light' ? '1px solid rgba(109,40,217,0.10)' : '1px solid rgba(255,255,255,0.06)',
        padding: '80px 0 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Footer bg glow */}
        <div style={{ position: 'absolute', top: 0, left: '30%', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, right: '20%', width: 400, height: 200, background: 'radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Top glow line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 30%, rgba(56,189,248,0.5) 70%, transparent 100%)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', position: 'relative' }}>
          <div className="marketing-footer-grid">
            {/* Brand col */}
            <div>
              <Link to="/" style={{ textDecoration: 'none', marginBottom: 20, display: 'block' }}>
                <Logo layout="horizontal" size={30} />
              </Link>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: 270, marginBottom: 28, fontWeight: 400 }}>
                AI-powered cloud security platform protecting enterprise infrastructure from advanced threats — in real time.
              </p>
              {/* Status */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '7px 14px', marginBottom: 24 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>All systems operational</span>
              </div>
              {/* Socials */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ icon: '𝕏', label: 'Twitter' }, { icon: 'in', label: 'LinkedIn' }, { icon: '⌥', label: 'GitHub' }].map(s => (
                  <div key={s.icon} className="social-btn" title={s.label}>{s.icon}</div>
                ))}
              </div>
            </div>

            {/* Link cols */}
            {FOOTER_COLS.map(col => (
              <div key={col.title}>
                <h5 style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 22 }}>{col.title}</h5>
                {col.links.map(l => (
                  <Link key={l.l} to={l.to} className="footer-link">{l.l}</Link>
                ))}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.14)', borderRadius: 16, padding: '28px 32px', margin: '48px 0', display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', marginBottom: 6 }}>Stay ahead of threats</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>Get weekly security insights from our CEREBRO AI team.</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flex: '1', maxWidth: 420, minWidth: 280 }}>
              <input
                type="email"
                placeholder="your@company.com"
                style={{
                  flex: 1, padding: '10px 18px', borderRadius: 100,
                  border: `1px solid ${theme === 'light' ? 'rgba(109,40,217,0.15)' : 'rgba(255,255,255,0.1)'}`,
                  background: theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                  color: 'var(--text-primary)', fontSize: 14,
                  outline: 'none', transition: 'border-color 0.25s, box-shadow 0.25s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = theme === 'light' ? 'rgba(109,40,217,0.15)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = ''; }}
              />
              <button style={{ padding: '10px 22px', borderRadius: 100, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                Subscribe →
              </button>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: theme === 'light' ? '1px solid rgba(109,40,217,0.10)' : '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            <div>© 2025 SentinelX Security Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[{ icon: '🔒', text: 'SOC2 Type II' }, { icon: '🌐', text: 'ISO 27001' }, { icon: '🛡', text: 'GDPR Compliant' }].map(b => (
                <span key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.2s', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
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
