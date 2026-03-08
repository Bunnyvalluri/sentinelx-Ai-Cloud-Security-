import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LOGOS_ROW1 = [
  { name: 'Vercel', icon: '▲' },
  { name: 'Supabase', icon: '⚡' },
  { name: 'Linear', icon: '◈' },
  { name: 'Raycast', icon: '✦' },
  { name: 'Rippling', icon: '🔷' },
  { name: 'Clerk', icon: '🔑' },
  { name: 'Resend', icon: '✉' },
  { name: 'Loom', icon: '🎬' },
  { name: 'Stripe', icon: '💳' },
  { name: 'Figma', icon: '🎨' },
];

const LOGOS_ROW2 = [
  { name: 'Datadog', icon: '🐶' },
  { name: 'GitHub', icon: '🐙' },
  { name: 'Notion', icon: '📝' },
  { name: 'Retool', icon: '🔧' },
  { name: 'Planetscale', icon: '🪐' },
  { name: 'Fly.io', icon: '🚀' },
  { name: 'Cloudflare', icon: '🌐' },
  { name: 'HashiCorp', icon: '🔐' },
  { name: 'Grafana', icon: '📊' },
  { name: 'Twilio', icon: '📱' },
];

const FEATURES = [
  { icon: '⌘', title: 'Developer-First APIs', desc: 'Secure APIs with sub-millisecond latency. Built entirely with edge function capabilities.', color: '#10b981', glow: 'rgba(16, 185, 129,0.15)' },
  { icon: '✨', title: 'Generative AI Workflows', desc: 'Automate zero-day threat analysis with pre-trained security models. Instantly ship remediations.', color: '#2dd4bf', glow: 'rgba(0,229,255,0.12)' },
  { icon: '⚡', title: 'Instant Provisioning', desc: 'Deploy across AWS, Azure, and Google Cloud in under 30 seconds. Zero downtime architecture.', color: '#b44fff', glow: 'rgba(180,79,255,0.12)' },
  { icon: '🔒', title: 'SOC 2 Type II Certified', desc: 'Enterprise-grade encryption, immutable audit logs, and compliant infrastructure by default.', color: '#fbbf24', glow: 'rgba(0,255,163,0.12)' },
];

const STATS = [
  { val: '99.99%', label: 'Uptime SLA', color: '#fbbf24' },
  { val: '142M+', label: 'Events/day', color: '#10b981' },
  { val: '<1.2s', label: 'Avg latency', color: '#2dd4bf' },
  { val: '10K+', label: 'Enterprises', color: '#b44fff' },
];

const TERMINAL_LINES = [
  { prefix: '$ ', text: 'sentinelx init --workspace "production"', color: '#2dd4bf' },
  { prefix: '', text: 'Authenticating with SentinelX Edge...', color: '#8fa3c0' },
  { prefix: '✓ ', text: 'Authentication successful (0.13s)', color: '#fbbf24' },
  { prefix: '$ ', text: 'sentinelx scan --deep --ai-mode', color: '#2dd4bf' },
  { prefix: '', text: 'Analyzing 1.2M objects in S3 bucket "user-data-prod"...', color: '#8fa3c0' },
  { prefix: '', text: 'Checking IAM role misconfigurations...', color: '#8fa3c0' },
  { prefix: '', text: 'Running CEREBRO AI anomaly detection...', color: '#b44fff' },
  { prefix: '✓ ', text: 'Analysis complete. 0 vulnerabilities found. (1.4s)', color: '#fbbf24' },
];

export default function LandingPage() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < TERMINAL_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 400);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  return (
    <div style={{ background: '#05080f', color: '#fff', fontFamily: 'Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] left-[30%] w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[60px]" />
        <div className="absolute top-[20%] -right-[5%] w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[60px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[60px]" />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, backdropFilter: 'blur(16px)', background: 'rgba(5,8,15,0.8)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(16,185,129,0.4)' }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>S</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>SentinelX</span>
          </Link>
          <div style={{ display: 'flex', gap: 32, fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
            {[['Features', '/features'], ['Documentation', '/docs'], ['Pricing', '/pricing'], ['Blog', '/blog']].map(([label, to]) => (
              <Link key={label} to={to} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>
                {label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }} className="hover:text-white transition-colors duration-200">Log In</Link>
            <Link to="/dashboard" className="btn btn-primary px-5 py-2">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero" style={{ position: 'relative', zIndex: 1, paddingTop: 160, paddingBottom: 80, textAlign: 'center', maxWidth: 900, margin: '0 auto', padding: '160px 32px 80px' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, padding: '6px 18px', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', letterSpacing: 0.5 }}>SENTINELX 3.0 IS LIVE</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>→</span>
        </div>

        <h1 style={{
          fontSize: 72, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24,
          fontFamily: 'Outfit, Inter, sans-serif'
        }}>
          <span style={{ color: '#fff' }}>Security Infrastructure</span><br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            for Modern Teams
          </span>
        </h1>

        <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.55)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
          The developer-friendly platform to monitor, detect, and automatically remediate vulnerabilities across your entire stack. Powered by CEREBRO AI.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary text-base px-8 py-3.5">
            ⚡ Start Free
          </Link>
          <Link to="/docs" className="btn btn-outline text-base font-semibold px-8 py-3.5">
            📖 Read Docs
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px' }}>
        <div className="landing-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ padding: '28px 24px', textAlign: 'center', background: 'rgba(5,8,15,0.8)', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 34, fontWeight: 900, color: s.color, marginBottom: 6, textShadow: `0 0 20px ${s.color}55` }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal Mockup */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '0 32px 100px' }}>
        <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl backdrop-blur-md bg-slate-900/40 hover:-translate-y-1 hover:border-emerald-500/40 transition-all duration-300">
          {/* Terminal chrome */}
          <div style={{ background: '#0c1628', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#ef4444', '#f59e0b', '#10b981'].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 12 }}>sentinelx — zsh — ai.sentinelx.dev</span>
            <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 4, padding: '2px 10px', fontSize: 10, fontWeight: 700, color: '#10b981' }}>● LIVE</div>
          </div>
          {/* Terminal body */}
          <div style={{ background: '#070d1a', padding: '28px 32px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13.5, lineHeight: 2 }}>
            {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} style={{ display: 'flex', opacity: 1, animation: 'fadeInLine .3s ease' }}>
                <span style={{ color: 'rgba(255,255,255,0.25)', minWidth: 18 }}>{line.prefix}</span>
                <span style={{ color: line.color }}>{line.text}</span>
              </div>
            ))}
            {visibleLines < TERMINAL_LINES.length && (
              <span style={{ color: '#10b981', animation: 'blink 1s steps(1) infinite' }}>▋</span>
            )}
          </div>
        </div>
      </section>

      {/* Trusted By — Marquee */}
      <section style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '60px 0', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 36, padding: '0 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.22)', letterSpacing: 3, textTransform: 'uppercase' }}>Trusted by the best engineering teams worldwide</p>
        </div>

        {/* Row 1 — scrolls left */}
        <div style={{
          position: 'relative', marginBottom: 14,
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', gap: 14, width: 'max-content', animation: 'marquee-left 30s linear infinite' }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}>
            {[...LOGOS_ROW1, ...LOGOS_ROW1].map((logo, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '12px 22px',
                whiteSpace: 'nowrap', cursor: 'default',
                transition: 'background-color .25s, border-color .25s, color .25s, fill .25s, stroke .25s, opacity .25s, box-shadow .25s, transform .25s',
                backdropFilter: 'blur(8px)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129,0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = 'none';
                }}>
                <span style={{ fontSize: 18 }}>{logo.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.2px' }}>{logo.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div style={{
          position: 'relative',
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', gap: 14, width: 'max-content', animation: 'marquee-right 34s linear infinite' }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}>
            {[...LOGOS_ROW2, ...LOGOS_ROW2].map((logo, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '12px 22px',
                whiteSpace: 'nowrap', cursor: 'default',
                transition: 'background-color .25s, border-color .25s, color .25s, fill .25s, stroke .25s, opacity .25s, box-shadow .25s, transform .25s',
                backdropFilter: 'blur(8px)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(0,229,255,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(0,229,255,0.22)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = 'none';
                }}>
                <span style={{ fontSize: 18 }}>{logo.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.2px' }}>{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 100, padding: '5px 18px', fontSize: 11, fontWeight: 700, color: '#2dd4bf', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>PLATFORM CAPABILITIES</div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 52, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', color: '#fff', marginBottom: 16 }}>
              Built for speed.<br />
              <span style={{ background: 'linear-gradient(90deg, #2dd4bf, #b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Designed for security.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>Everything you need to secure your modern infrastructure, packed into a single developer-centric platform.</p>
          </div>

          <div className="landing-features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                padding: '36px', borderRadius: 16,
                background: `linear-gradient(135deg, ${f.glow}, rgba(255,255,255,0.02))`,
                border: `1px solid ${f.color}22`,
                transition: 'background-color .3s, border-color .3s, color .3s, fill .3s, stroke .3s, opacity .3s, box-shadow .3s, transform .3s', cursor: 'default',
                position: 'relative', overflow: 'hidden'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = `1px solid ${f.color}55`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = `1px solid ${f.color}22`;
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 24 }}>{f.desc}</p>
                <Link to="/features" style={{ fontSize: 13, fontWeight: 700, color: f.color, textDecoration: 'none' }}>Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <div className="relative overflow-hidden rounded-[2rem] px-14 py-20 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/20 shadow-2xl hover:border-emerald-500/40 transition-all duration-500 backdrop-blur-md">
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)' }} />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 18, lineHeight: 1.1, position: 'relative' }}>Deploy security<br />instantly.</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.7, position: 'relative' }}>
              Join thousands of developers building fast, secure, and globally distributed applications with SentinelX.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link to="/dashboard" className="btn btn-primary text-base px-9 py-3.5">
                Start Building →
              </Link>
              <Link to="/contact" className="btn btn-outline text-base px-9 py-3.5">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 32px', background: 'rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>S</span>
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>SentinelX</span>
            </Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', lineHeight: 1.7 }}>© 2026 SentinelX Inc.<br />Built for builders.</p>
          </div>
          {[
            { title: 'Product', links: [['Features', '/features'], ['Integrations', '/integrations'], ['Pricing', '/pricing'], ['Changelog', '/changelog']] },
            { title: 'Resources', links: [['Documentation', '/docs'], ['Blog', '/blog'], ['Community', '/community'], ['Guides', '/guides']] },
            { title: 'Company', links: [['About Us', '/about'], ['Careers', '/careers'], ['Legal', '/legal'], ['Contact', '/contact']] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color .2s' }}
                      onMouseEnter={e => e.target.style.color = '#fff'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
