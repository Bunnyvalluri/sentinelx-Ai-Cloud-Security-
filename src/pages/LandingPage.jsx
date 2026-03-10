import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MarketingLayout from '../components/MarketingLayout';
import Logo from '../components/common/Logo';

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
    <MarketingLayout>
      <div className="landing-page-wrapper" style={{ overflowX: 'hidden' }}>

        {/* Background glow orbs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '30%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '20%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>


        {/* Hero Section */}
        <section className="landing-hero" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 860, margin: '0 auto', padding: '110px 32px 80px' }}>

          {/* Main Brand Logo on Hero */}
          <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'center', animation: 'fadeInDown 0.8s ease-out' }}>
            <Logo layout="vertical" size={120} glow={true} />
          </div>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.30)', borderRadius: 100, padding: '6px 18px 6px 8px', marginBottom: 32 }}>
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', borderRadius: 100, padding: '2px 10px', fontSize: 10, fontWeight: 800, letterSpacing: 0.6 }}>NEW</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.3 }}>SentinelX 4.0 — CEREBRO AI is live</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>

          <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2.5px', marginBottom: 24, fontFamily: 'Outfit, Inter, sans-serif' }}>
            <span className="hero-text-primary">Security Infrastructure</span><br />
            <span style={{ background: 'linear-gradient(90deg, #a78bfa, #818cf8, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              for Modern Teams
            </span>
          </h1>

          <p className="hero-text-secondary" style={{ fontSize: 18, maxWidth: 580, margin: '0 auto 44px', lineHeight: 1.75 }}>
            Monitor, detect, and automatically remediate threats across your entire cloud stack — powered by CEREBRO AI processing 1.2B events/hour.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/login">
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 28px rgba(139,92,246,0.38)', transition: 'all 0.25s ease', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(139,92,246,0.50)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(139,92,246,0.38)'; }}
              >
                Start Free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </Link>
            <Link to="/docs">
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit' }}>
                Read the Docs
              </button>
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 12.5, color: 'rgba(255,255,255,0.35)' }}>
            <div style={{ display: 'flex' }}>
              {['#8b5cf6', '#6366f1', '#38bdf8', '#22c55e', '#f59e0b'].map((c) => (
                <div
                  className="marquee-item"
                  key={c}
                  role="presentation"
                  style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: '2px solid #05080f', marginLeft: -8, firstChild: { marginLeft: 0 }, boxShadow: `0 0 8px ${c}55` }}
                />
              ))}
            </div>
            <span>Trusted by <strong style={{ color: 'rgba(255,255,255,0.65)' }}>10,000+</strong> security teams worldwide</span>
          </div>
        </section>

        {/* Stats Bar */}
        <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px' }}>
          <div className="landing-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, borderRadius: 16, overflow: 'hidden' }}>
            {STATS.map((s) => (
              <div key={s.label} className="stats-card" style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 34, fontWeight: 900, color: s.color, marginBottom: 6, textShadow: `0 0 20px ${s.color}55` }}>{s.val}</div>
                <div className="stats-label" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
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
              {TERMINAL_LINES.slice(0, visibleLines).map((line) => (
                <div className="marquee-item" key={line.text} style={{ display: 'flex', opacity: 1, animation: 'fadeInLine .3s ease' }}>
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
        <section style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '60px 0', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: 36, padding: '0 32px' }}>
            <p className="hero-text-secondary" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Trusted by the best engineering teams worldwide</p>
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
                <div className="marquee-item" key={`${logo.name}-${i}`} style={{
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
                <div className="marquee-item" key={`${logo.name}-${i}`} style={{
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
        <section style={{ position: 'relative', zIndex: 1, padding: '100px 32px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 100, padding: '5px 18px', fontSize: 11, fontWeight: 700, color: '#2dd4bf', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>PLATFORM CAPABILITIES</div>
              <h2 className="hero-text-primary" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 52, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 16 }}>
                Built for speed.<br />
                <span style={{ background: 'linear-gradient(90deg, #2dd4bf, #b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Designed for security.</span>
              </h2>
              <p className="hero-text-secondary" style={{ fontSize: 17, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>Everything you need to secure your modern infrastructure, packed into a single developer-centric platform.</p>
            </div>

            <div className="landing-features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {FEATURES.map((f) => (
                <div className="marquee-item" key={f.title} style={{
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
                  <h3 className="hero-text-primary" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{f.title}</h3>
                  <p className="hero-text-secondary" style={{ fontSize: 14.5, lineHeight: 1.7, marginBottom: 24 }}>{f.desc}</p>
                  <Link to="/features" style={{ fontSize: 13, fontWeight: 700, color: f.color, textDecoration: 'none' }}>Learn more →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ position: 'relative', zIndex: 1, padding: '100px 32px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
            <div className="relative overflow-hidden rounded-[2rem] px-14 py-20 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/20 shadow-2xl hover:border-emerald-500/40 transition-all duration-500 backdrop-blur-md">
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)' }} />
              <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)' }} />
              <h2 className="hero-text-primary" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 48, fontWeight: 900, letterSpacing: '-1px', marginBottom: 18, lineHeight: 1.1, position: 'relative' }}>Deploy security<br />instantly.</h2>
              <p className="hero-text-secondary" style={{ fontSize: 17, maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.7, position: 'relative' }}>
                Join thousands of developers building fast, secure, and globally distributed applications with SentinelX.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <Link to="/login" className="btn btn-primary text-base px-9 py-3.5">
                  Start Building →
                </Link>
                <Link to="/contact" className="btn btn-outline text-base px-9 py-3.5">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

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
    </MarketingLayout>
  );
}
