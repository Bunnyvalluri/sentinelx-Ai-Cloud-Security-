import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import MarketingLayout from '../components/MarketingLayout';
import Logo from '../components/common/Logo';

/* ─── Data ─── */
const LOGOS = [
  { name: 'Vercel', icon: '▲' },
  { name: 'Supabase', icon: '⚡' },
  { name: 'Linear', icon: '◈' },
  { name: 'Stripe', icon: '💳' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Clerk', icon: '🔑' },
  { name: 'GitHub', icon: '🐙' },
  { name: 'Datadog', icon: '🐶' },
  { name: 'Notion', icon: '📝' },
  { name: 'Cloudflare', icon: '🌐' },
  { name: 'HashiCorp', icon: '🔐' },
  { name: 'Grafana', icon: '📊' },
];

const FEATURES = [
  {
    icon: '⌘',
    label: 'APIs',
    title: 'Developer-First APIs',
    desc: 'Secure APIs with sub-millisecond latency. Built entirely with edge function capabilities for maximum throughput.',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.12)',
    metric: '< 1ms',
    metricLabel: 'P99 Latency',
  },
  {
    icon: '✦',
    label: 'AI',
    title: 'CEREBRO AI Engine',
    desc: 'Automate zero-day threat analysis with pre-trained models processing 1.2B events/hour in real time.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.12)',
    metric: '1.2B',
    metricLabel: 'Events/hour',
  },
  {
    icon: '⚡',
    label: 'INFRA',
    title: 'Instant Cloud Provisioning',
    desc: 'Deploy across AWS, Azure, and GCP in under 30 seconds with zero downtime rolling updates.',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.12)',
    metric: '< 30s',
    metricLabel: 'Deploy time',
  },
  {
    icon: '🔒',
    label: 'COMPLIANCE',
    title: 'Enterprise Compliance',
    desc: 'SOC 2 Type II certified with immutable audit logs, encryption at rest & in transit, GDPR ready.',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.12)',
    metric: 'SOC 2',
    metricLabel: 'Type II',
  },
];

const STATS = [
  { val: '99.99%', label: 'Uptime SLA', icon: '●', color: '#10b981' },
  { val: '142M+', label: 'Events/day', icon: '⚡', color: '#a78bfa' },
  { val: '< 1.2s', label: 'Avg latency', icon: '⏱', color: '#38bdf8' },
  { val: '10K+', label: 'Enterprises', icon: '🏢', color: '#fbbf24' },
];

const TESTIMONIALS = [
  {
    quote: 'SentinelX cut our threat response time from hours to seconds. The CEREBRO AI is genuinely magic.',
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'Rippling',
    avatar: 'SC',
    color: '#10b981',
  },
  {
    quote: "We evaluated every security platform on the market. SentinelX wasn't even close — it just worked.",
    name: 'Marcus Williams',
    role: 'CTO',
    company: 'Fly.io',
    avatar: 'MW',
    color: '#a78bfa',
  },
  {
    quote: 'The developer experience is exceptional. Our team adopted it in a weekend with zero training.',
    name: 'Priya Patel',
    role: 'Head of Security',
    company: 'Planetscale',
    avatar: 'PP',
    color: '#38bdf8',
  },
];

const TERMINAL_LINES = [
  { prefix: '$ ', text: 'sentinelx init --workspace production', color: '#2dd4bf' },
  { prefix: '', text: 'Connecting to SentinelX Edge Network...', color: '#6b7280' },
  { prefix: '✓ ', text: 'Workspace initialized (0.13s)', color: '#10b981' },
  { prefix: '$ ', text: 'sentinelx scan --deep --ai-mode --report', color: '#2dd4bf' },
  { prefix: '', text: 'Scanning 1.2M objects across 3 cloud regions...', color: '#6b7280' },
  { prefix: '', text: 'Running CEREBRO AI anomaly detection...', color: '#a78bfa' },
  { prefix: '⚠ ', text: '2 IAM misconfigurations detected — auto-patching...', color: '#fbbf24' },
  { prefix: '✓ ', text: 'All vulnerabilities resolved. Score: 100/100 (1.4s)', color: '#10b981' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [visibleLines, setVisibleLines] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  /* Typewriter terminal */
  useEffect(() => {
    if (visibleLines < TERMINAL_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 420);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  /* Testimonial auto-rotate */
  useEffect(() => {
    const t = setInterval(() => setActiveReview(v => (v + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* Mouse parallax on hero */
  const handleMouseMove = e => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
    });
  };

  return (
    <MarketingLayout>
      <div style={{ overflowX: 'hidden' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

          @keyframes float-orb {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-30px) scale(1.04); }
          }
          @keyframes grid-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes hero-in {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes badge-pop {
            from { opacity: 0; transform: scale(0.88); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes code-line {
            from { opacity: 0; transform: translateX(-8px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes marquee-l {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes marquee-r {
            from { transform: translateX(-50%); }
            to   { transform: translateX(0); }
          }
          @keyframes pulse-ring {
            0%   { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.4); opacity: 0; }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .hero-title-glow {
            background: linear-gradient(90deg, #c4b5fd, #818cf8, #38bdf8, #c4b5fd);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 4s linear infinite;
          }
          .btn-hero-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, #7c3aed, #4f46e5);
            color: #fff;
            padding: 16px 40px;
            border-radius: 100px;
            font-size: 16px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.25s;
            box-shadow: 0 0 0 0 rgba(124,58,237,0.4);
            position: relative;
            overflow: hidden;
          }
          .btn-hero-primary::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
            opacity: 0;
            transition: opacity 0.25s;
          }
          .btn-hero-primary:hover { 
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(124,58,237,0.45);
          }
          .btn-hero-primary:hover::before { opacity: 1; }
          .btn-hero-outline {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: transparent;
            color: var(--text-primary);
            padding: 15px 36px;
            border-radius: 100px;
            font-size: 16px;
            font-weight: 600;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.25s;
          }
          .btn-hero-outline:hover {
            background: var(--bg-card);
            border-color: var(--text-secondary);
            transform: translateY(-2px);
          }
          .feature-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 32px;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            cursor: default;
          }
          .feature-card::after {
            content: '';
            position: absolute;
            inset: 0;
            opacity: 0;
            transition: opacity 0.3s;
            border-radius: 20px;
          }
          .feature-card:hover {
            transform: translateY(-6px);
          }
          .stat-pill {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 28px 24px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
            text-align: center;
            transition: all 0.3s;
          }
          .stat-pill:hover {
            transform: translateY(-4px);
          }
          .testimonial-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 32px;
            transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          }
          .badge-new {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(124,58,237,0.10);
            border: 1px solid rgba(124,58,237,0.28);
            border-radius: 100px;
            padding: 6px 20px 6px 8px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 32px;
            animation: badge-pop 0.6s ease;
            cursor: pointer;
            transition: all 0.2s;
          }
          .badge-new:hover {
            border-color: rgba(124,58,237,0.5);
            background: rgba(124,58,237,0.15);
          }
          .badge-new .badge-pill {
            background: linear-gradient(135deg,#7c3aed,#4f46e5);
            color: #fff;
            border-radius: 100px;
            padding: 3px 12px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .section-label {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 16px;
          }
          .section-label::before,
          .section-label::after {
            content: '';
            display: block;
            width: 24px;
            height: 1px;
            background: var(--border);
          }
          .glow-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            display: inline-block;
            position: relative;
            box-shadow: 0 0 8px #10b981;
          }
          .glow-dot::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 1px solid #10b981;
            animation: pulse-ring 2s ease infinite;
          }
          @media (max-width: 768px) {
            .hero-btns { flex-direction: column; width: 100%; }
            .hero-btns .btn-hero-primary,
            .hero-btns .btn-hero-outline { width: 100%; max-width: 320px; justify-content: center; }
            .features-grid { grid-template-columns: 1fr !important; }
            .stats-row { grid-template-columns: 1fr 1fr !important; }
            .testimonials-grid { grid-template-columns: 1fr !important; }
            .cta-btns { flex-direction: column; align-items: center; }
          }
        `}</style>

        {/* ═══════════ MESH BACKGROUND ═══════════ */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
            opacity: 0.4,
          }} />
          {/* Glowing orbs */}
          <div style={{ position: 'absolute', top: '-15%', left: '20%', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)', filter: 'blur(40px)', animation: 'float-orb 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '30%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 65%)', filter: 'blur(40px)', animation: 'float-orb 12s ease-in-out infinite reverse' }} />
          <div style={{ position: 'absolute', bottom: '-5%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 65%)', filter: 'blur(60px)', animation: 'float-orb 10s ease-in-out infinite 2s' }} />
        </div>

        {/* ═══════════ HERO ═══════════ */}
        <section
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className="landing-hero"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Floating mouse-parallax glow orb */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`,
            transition: 'transform 0.15s ease-out',
            pointerEvents: 'none',
          }} />

          {/* Logo mark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40, animation: 'hero-in 0.7s ease' }}>
            <Logo layout="vertical" size={120} glow={true} />
          </div>

          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', animation: 'badge-pop 0.6s 0.2s both' }}>
            <div className="badge-new" onClick={() => navigate('/features')}>
              <span className="badge-pill">NEW</span>
              <span>SentinelX 4.0 — CEREBRO AI is live</span>
              <span style={{ opacity: 0.5 }}>→</span>
            </div>
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'Outfit, Inter, sans-serif',
            fontSize: 'clamp(44px, 8vw, 88px)',
            fontWeight: 900,
            lineHeight: 1.03,
            letterSpacing: '-0.04em',
            marginBottom: 28,
            animation: 'hero-in 0.8s 0.3s both',
            textAlign: 'center',
          }}>
            <span style={{ color: 'var(--text-primary)' }}>Security Infrastructure</span>
            <br />
            <span className="hero-title-glow">for Modern Teams</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: 620,
            margin: '0 auto 48px',
            lineHeight: 1.75,
            fontWeight: 450,
            animation: 'hero-in 0.8s 0.4s both',
            textAlign: 'center',
          }}>
            Monitor, detect, and automatically remediate threats across your entire cloud stack.
            Powered by <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>CEREBRO AI</strong> — processing 1.2B events/hour.
          </p>

          {/* CTAs */}
          <div className="hero-btns" style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', animation: 'hero-in 0.8s 0.5s both' }}>
            <button className="btn-hero-primary" onClick={() => navigate('/login')}>
              <span className="glow-dot" />
              Get Started — It's Free
            </button>
            <button className="btn-hero-outline" onClick={() => navigate('/docs')}>
              Read the Docs →
            </button>
          </div>

          {/* Social proof strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 52, opacity: 0.65, animation: 'hero-in 0.8s 0.65s both', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['#7c3aed', '#4f46e5', '#38bdf8', '#10b981', '#fbbf24'].map((c, i) => (
                <div key={c} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid var(--bg-primary)', marginLeft: i === 0 ? 0 : -9, boxShadow: `0 0 12px ${c}55`, zIndex: 5 - i }} />
              ))}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Trusted by <strong style={{ color: 'var(--text-primary)' }}>10,000+</strong> cloud-native teams
            </span>
            <span style={{ width: 1, height: 16, background: 'var(--border)' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
              <span className="glow-dot" style={{ width: 6, height: 6 }} />No credit card required
            </span>
          </div>
        </section>

        {/* ═══════════ STATS ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,48px) 96px' }}>
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {STATS.map(s => (
              <div className="stat-pill" key={s.label}>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 700, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{s.icon}</span> {s.label}
                </div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: s.color, lineHeight: 1, textShadow: `0 0 32px ${s.color}55` }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ TERMINAL ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,4vw,48px) 100px' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(16,185,129,0.18)', boxShadow: '0 4px 80px rgba(16,185,129,0.10), 0 0 0 1px rgba(255,255,255,0.04)' }}>
            {/* Chrome */}
            <div style={{ background: '#0a0f1e', padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {['#ef4444', '#f59e0b', '#10b981'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.85 }} />
              ))}
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.28)', marginLeft: 12 }}>
                sentinelx — zsh ── ai.sentinelx.dev
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '3px 11px', fontSize: 10, fontWeight: 800, color: '#10b981', letterSpacing: 0.5 }}>
                <span className="glow-dot" style={{ width: 6, height: 6 }} /> LIVE
              </div>
            </div>
            {/* Body */}
            <div style={{ background: 'linear-gradient(135deg, #040810 0%, #060d1a 100%)', padding: 'clamp(20px,4vw,32px)', fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(11px,1.5vw,13.5px)', lineHeight: 1.9, minHeight: 220, overflowX: 'auto' }}>
              {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{ display: 'flex', animation: 'code-line 0.3s ease' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', minWidth: 22 }}>{line.prefix}</span>
                  <span style={{ color: line.color }}>{line.text}</span>
                </div>
              ))}
              {visibleLines < TERMINAL_LINES.length && (
                <span style={{ color: '#10b981', animation: 'blink 0.9s steps(1) infinite' }}>▋</span>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ LOGO MARQUEE ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '52px 0', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="section-label">Trusted by the best engineering teams worldwide</div>
          </div>
          {/* Row */}
          <div style={{
            position: 'relative',
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}>
            <div
              style={{ display: 'flex', gap: 12, width: 'max-content', animation: 'marquee-l 28s linear infinite' }}
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
            >
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '11px 22px',
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
                  whiteSpace: 'nowrap', cursor: 'default',
                  transition: 'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'var(--bg-card)'; }}>
                  <span style={{ fontSize: 16 }}>{logo.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(64px,8vw,120px) clamp(16px,4vw,48px)', borderTop: '1px solid var(--border-light)', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label">Platform Capabilities</div>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(36px,5vw,60px)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.08,
              letterSpacing: '-1.5px',
              marginBottom: 20,
            }}>
              Built for speed.{' '}
              <span style={{ background: 'linear-gradient(90deg, #2dd4bf, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Designed for security.
              </span>
            </h2>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Everything you need to secure modern infrastructure — packed in a single, developer-centric platform.
            </p>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card"
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${f.color}44`;
                  e.currentTarget.style.boxShadow = `0 24px 64px ${f.color}12`;
                  e.currentTarget.style.background = `linear-gradient(135deg, ${f.glow}, var(--bg-card))`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}>
                {/* Top row: icon + metric */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, background: `${f.color}16`, border: `1px solid ${f.color}30`,
                  }}>{f.icon}</div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900, color: f.color, lineHeight: 1 }}>{f.metric}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 3 }}>{f.metricLabel}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: f.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{f.label}</div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.2 }}>{f.title}</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 24 }}>{f.desc}</p>
                <Link to="/features" style={{ fontSize: 13, fontWeight: 700, color: f.color, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Learn more <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,48px)', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-label">Customer Stories</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                Loved by security teams everywhere
              </h2>
            </div>

            <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="testimonial-card"
                  style={{ opacity: activeReview === i ? 1 : 0.65, transform: activeReview === i ? 'scale(1.02)' : 'scale(1)' }}
                  onClick={() => setActiveReview(i)}>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                    {Array(5).fill(0).map((_, si) => (
                      <span key={si} style={{ color: '#fbbf24', fontSize: 14 }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role} · {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicator dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveReview(i)} style={{
                  width: activeReview === i ? 24 : 8, height: 8, borderRadius: 100, border: 'none', cursor: 'pointer',
                  background: activeReview === i ? '#7c3aed' : 'var(--border)', transition: 'all 0.3s',
                }} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CTA SECTION ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(64px,8vw,120px) clamp(16px,4vw,48px)', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{
              position: 'relative',
              background: 'var(--bg-card)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 28,
              padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,64px)',
              boxShadow: '0 0 80px rgba(124,58,237,0.12)',
              overflow: 'hidden',
            }}>
              {/* Decorative corners */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.18), transparent)' }} />
              <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.14), transparent)' }} />

              <div className="section-label" style={{ justifyContent: 'center' }}>Start today</div>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(32px,5vw,56px)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
                marginBottom: 20,
                position: 'relative',
              }}>
                Deploy security.<br />
                <span style={{ background: 'linear-gradient(90deg,#10b981,#2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Instantly.
                </span>
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.75, position: 'relative' }}>
                Join thousands of developers building fast, secure, and globally distributed applications with SentinelX.
              </p>

              <div className="cta-btns" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <button className="btn-hero-primary" onClick={() => navigate('/login')} style={{ fontSize: 17, padding: '18px 48px' }}>
                  Start Building for Free →
                </button>
                <button className="btn-hero-outline" onClick={() => navigate('/contact')} style={{ fontSize: 17, padding: '17px 40px' }}>
                  Talk to Sales
                </button>
              </div>

              {/* Trust line */}
              <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', position: 'relative' }}>
                {['No credit card', 'SOC 2 Type II', '99.99% SLA', 'GDPR Ready'].map(item => (
                  <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                    <span style={{ color: '#10b981' }}>✓</span> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
