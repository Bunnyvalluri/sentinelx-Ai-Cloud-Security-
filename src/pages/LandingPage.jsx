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
    glow: 'rgba(16,185,129,0.08)',
    metric: '< 1ms',
    metricLabel: 'P99 Latency',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, transparent 60%)',
  },
  {
    icon: '✦',
    label: 'AI',
    title: 'CEREBRO AI Engine',
    desc: 'Automate zero-day threat analysis with pre-trained models processing 1.2B events/hour in real time.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.08)',
    metric: '1.2B',
    metricLabel: 'Events/hour',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, transparent 60%)',
  },
  {
    icon: '⚡',
    label: 'INFRA',
    title: 'Instant Cloud Provisioning',
    desc: 'Deploy across AWS, Azure, and GCP in under 30 seconds with zero downtime rolling updates.',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.08)',
    metric: '< 30s',
    metricLabel: 'Deploy time',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.12) 0%, transparent 60%)',
  },
  {
    icon: '🔒',
    label: 'COMPLIANCE',
    title: 'Enterprise Compliance',
    desc: 'SOC 2 Type II certified with immutable audit logs, encryption at rest & in transit, GDPR ready.',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.08)',
    metric: 'SOC 2',
    metricLabel: 'Type II',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, transparent 60%)',
  },
];

const STATS = [
  { val: '99.99%', label: 'Uptime SLA', icon: '●', color: '#10b981', desc: 'Enterprise-grade reliability' },
  { val: '142M+', label: 'Events/day', icon: '⚡', color: '#a78bfa', desc: 'Processed in real-time' },
  { val: '< 1.2s', label: 'Avg latency', icon: '⏱', color: '#38bdf8', desc: 'Global edge network' },
  { val: '10K+', label: 'Enterprises', icon: '🏢', color: '#fbbf24', desc: 'Trust SentinelX daily' },
];

const TESTIMONIALS = [
  {
    quote: 'SentinelX cut our threat response time from hours to seconds. The CEREBRO AI is genuinely magic. We had a zero-day stopped before our team even got paged.',
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'Rippling',
    avatar: 'SC',
    color: '#10b981',
    rating: 5,
  },
  {
    quote: "We evaluated every security platform on the market. SentinelX wasn't even close — it just worked. The API integration took under 2 hours to deploy across all our services.",
    name: 'Marcus Williams',
    role: 'CTO',
    company: 'Fly.io',
    avatar: 'MW',
    color: '#a78bfa',
    rating: 5,
  },
  {
    quote: 'The developer experience is exceptional. Our team adopted it in a weekend with zero training. The CEREBRO AI dashboard alone saves us 10+ hours per week.',
    name: 'Priya Patel',
    role: 'Head of Security',
    company: 'Planetscale',
    avatar: 'PP',
    color: '#38bdf8',
    rating: 5,
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

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect Your Infrastructure',
    desc: 'One-click integrations with AWS, GCP, Azure, Kubernetes and 200+ services. No agents to install.',
    icon: '🔗',
    color: '#8b5cf6',
  },
  {
    step: '02',
    title: 'AI Scans & Learns',
    desc: 'CEREBRO AI builds a behavioral baseline across your entire stack and detects deviations in real time.',
    icon: '🧠',
    color: '#38bdf8',
  },
  {
    step: '03',
    title: 'Auto-Remediate Threats',
    desc: 'Misconfigurations and threats are fixed automatically with human-readable audit trails for every action.',
    icon: '⚡',
    color: '#10b981',
  },
];

/* ─── Animated Number Counter ─── */
function AnimatedCounter({ value, suffix = '' }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const numMatch = value.match(/[\d.]+/);
          if (!numMatch) { setDisplay(value); return; }
          const num = parseFloat(numMatch[0]);
          const prefix = value.slice(0, value.indexOf(numMatch[0]));
          const postfix = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length);
          const end = num;
          const duration = 1800;
          const step = duration / 60;
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            const progress = Math.min(current / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = eased * end;
            const formatted = Number.isInteger(num) ? Math.round(val).toString() : val.toFixed(1);
            setDisplay(`${prefix}${formatted}${postfix}`);
            if (progress >= 1) clearInterval(timer);
          }, step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [visibleLines, setVisibleLines] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  /* Typewriter terminal */
  useEffect(() => {
    if (visibleLines < TERMINAL_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 380);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  /* Testimonial auto-rotate */
  useEffect(() => {
    const id = setInterval(() => {
      setActiveReview(v => (v + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);



  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      color: ['#8b5cf6', '#38bdf8', '#10b981', '#a78bfa'][Math.floor(Math.random() * 4)],
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);



  return (
    <MarketingLayout>
      <div style={{ overflowX: 'hidden' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

          @keyframes float-orb {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-40px) scale(1.06); }
          }
          @keyframes hero-in {
            from { opacity: 0; transform: translateY(32px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes badge-pop {
            from { opacity: 0; transform: scale(0.85) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes code-line {
            from { opacity: 0; transform: translateX(-12px); }
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
          @keyframes pulse-ring {
            0%   { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(2.8); opacity: 0; }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes border-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(48px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }

          .hero-title-glow {
            background: linear-gradient(100deg, #c4b5fd 0%, #818cf8 30%, #38bdf8 60%, #c4b5fd 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 5s linear infinite;
          }

          .btn-hero-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%);
            background-size: 200% auto;
            color: #fff;
            padding: 16px 40px;
            border-radius: 100px;
            font-size: 16px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 0 0 0 rgba(124,58,237,0.4), 0 4px 24px rgba(124,58,237,0.3);
            position: relative;
            overflow: hidden;
            letter-spacing: -0.2px;
          }
          .btn-hero-primary::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent);
            opacity: 0;
            transition: opacity 0.3s;
          }
          .btn-hero-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 40px rgba(124,58,237,0.5), 0 4px 12px rgba(79,70,229,0.3);
            background-position: right center;
          }
          .btn-hero-primary:hover::before { opacity: 1; }
          .btn-hero-primary:active { transform: translateY(-1px); }

          .btn-hero-outline {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(255,255,255,0.04);
            color: var(--text-primary);
            padding: 15px 36px;
            border-radius: 100px;
            font-size: 16px;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.12);
            cursor: pointer;
            transition: all 0.3s;
            backdrop-filter: blur(8px);
          }
          .btn-hero-outline:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(139,92,246,0.5);
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          }

          .feature-card {
            background: rgba(16,16,28,0.6);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 24px;
            padding: 36px;
            transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
            position: relative;
            overflow: hidden;
            cursor: default;
            backdrop-filter: blur(12px);
          }
          .feature-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--card-gradient, transparent);
            opacity: 0;
            transition: opacity 0.4s;
            border-radius: 24px;
          }
          .feature-card:hover {
            transform: translateY(-8px) scale(1.01);
            border-color: var(--card-color, rgba(255,255,255,0.15));
            box-shadow: 0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px var(--card-color, rgba(255,255,255,0.1));
          }
          .feature-card:hover::before { opacity: 1; }

          .stat-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 36px 24px;
            background: rgba(16,16,28,0.5);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 20px;
            text-align: center;
            transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
            backdrop-filter: blur(12px);
            position: relative;
            overflow: hidden;
          }
          .stat-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--card-color, transparent);
            opacity: 0;
            transition: opacity 0.4s;
          }
          .stat-card:hover {
            transform: translateY(-6px);
            border-color: rgba(255,255,255,0.12);
            box-shadow: 0 24px 60px rgba(0,0,0,0.25);
          }
          .stat-card:hover::after { opacity: 1; }

          .testimonial-card {
            background: rgba(16,16,28,0.6);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 24px;
            padding: 36px;
            transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
            backdrop-filter: blur(12px);
            position: relative;
          }

          .badge-new {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(124,58,237,0.08);
            border: 1px solid rgba(124,58,237,0.25);
            border-radius: 100px;
            padding: 6px 20px 6px 8px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 36px;
            animation: badge-pop 0.7s cubic-bezier(0.16,1,0.3,1);
            cursor: pointer;
            transition: all 0.25s;
            backdrop-filter: blur(8px);
          }
          .badge-new:hover {
            border-color: rgba(124,58,237,0.5);
            background: rgba(124,58,237,0.14);
            transform: scale(1.02);
          }
          .badge-new .badge-pill {
            background: linear-gradient(135deg,#7c3aed,#4f46e5);
            color: #fff;
            border-radius: 100px;
            padding: 3px 12px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.8px;
          }

          .section-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 20px;
          }
          .section-label::before, .section-label::after {
            content: '';
            display: block;
            width: 28px;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border-light));
          }
          .section-label::after {
            background: linear-gradient(90deg, var(--border-light), transparent);
          }

          .glow-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            display: inline-block;
            position: relative;
            box-shadow: 0 0 10px #10b981;
          }
          .glow-dot::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 1px solid #10b981;
            animation: pulse-ring 2s ease infinite;
          }

          .how-step {
            display: flex;
            gap: 28px;
            align-items: flex-start;
            padding: 36px;
            background: rgba(16,16,28,0.5);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 20px;
            transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
            backdrop-filter: blur(12px);
          }
          .how-step:hover {
            transform: translateX(8px);
            border-color: rgba(255,255,255,0.12);
            box-shadow: 0 16px 48px rgba(0,0,0,0.2);
          }

          .reveal {
            opacity: 0;
            transform: translateY(32px);
            transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
          }
          .reveal.visible {
            opacity: 1;
            transform: translateY(0);
          }

          .gradient-text-green {
            background: linear-gradient(90deg, #10b981, #2dd4bf);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .gradient-text-purple {
            background: linear-gradient(90deg, #8b5cf6, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .gradient-text-cyan {
            background: linear-gradient(90deg, #2dd4bf, #38bdf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .cta-box {
            background: linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(56,189,248,0.06) 50%, rgba(16,185,129,0.08) 100%);
            border: 1px solid rgba(124,58,237,0.2);
            border-radius: 32px;
            padding: clamp(48px,7vw,80px) clamp(24px,6vw,72px);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(16px);
          }
          .cta-box::before {
            content: '';
            position: absolute;
            top: -1px;
            left: 10%;
            right: 10%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(56,189,248,0.6), transparent);
          }

          @media (max-width: 768px) {
            .hero-btns { flex-direction: column; width: 100%; }
            .hero-btns .btn-hero-primary,
            .hero-btns .btn-hero-outline { width: 100%; max-width: 340px; justify-content: center; }
            .features-grid { grid-template-columns: 1fr !important; }
            .stats-row { grid-template-columns: 1fr 1fr !important; }
            .testimonials-grid { grid-template-columns: 1fr !important; }
            .cta-btns { flex-direction: column; align-items: center; }
            .how-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 480px) {
            .stats-row { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* ═══════════ PARTICLE CANVAS ═══════════ */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
            zIndex: 0, pointerEvents: 'none', opacity: 0.6,
          }}
        />

        {/* ═══════════ MESH BACKGROUND ═══════════ */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          }} />
          {/* Glowing orbs */}
          <div style={{
            position: 'absolute', top: '-20%', left: '15%', width: 900, height: 900, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)',
            filter: 'blur(60px)', animation: 'float-orb 10s ease-in-out infinite',
            transform: `translateY(${scrollY * 0.1}px)`,
          }} />
          <div style={{
            position: 'absolute', top: '40%', right: '-15%', width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 65%)',
            filter: 'blur(60px)', animation: 'float-orb 14s ease-in-out infinite reverse',
          }} />
          <div style={{
            position: 'absolute', bottom: '0%', left: '5%', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 65%)',
            filter: 'blur(80px)', animation: 'float-orb 12s ease-in-out infinite 3s',
          }} />
          <div style={{
            position: 'absolute', top: '20%', left: '50%', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)',
            filter: 'blur(60px)', animation: 'float-orb 8s ease-in-out infinite 1.5s reverse',
          }} />
        </div>

        {/* ═══════════ HERO ═══════════ */}
        <section
          ref={heroRef}
          className="landing-hero"
          style={{ position: 'relative', zIndex: 1, paddingBottom: 80 }}
        >

          {/* Logo mark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44, animation: 'hero-in 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
            <Logo layout="vertical" size={120} glow={true} />
          </div>

          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', animation: 'badge-pop 0.7s 0.2s both' }}>
            <div className="badge-new" onClick={() => navigate('/features')}>
              <span className="badge-pill">NEW</span>
              <span>SentinelX 4.0 — CEREBRO AI is live</span>
              <span style={{ opacity: 0.5, fontSize: 12 }}>→</span>
            </div>
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'Outfit, Inter, sans-serif',
            fontSize: 'clamp(48px, 9vw, 96px)',
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            marginBottom: 32,
            animation: 'hero-in 0.9s 0.3s both',
            textAlign: 'center',
            maxWidth: 900,
            margin: '0 auto 32px',
          }}>
            <span style={{ color: 'var(--text-primary)' }}>Security Infrastructure</span>
            <br />
            <span className="hero-title-glow">for Modern Teams</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(17px, 2.2vw, 21px)',
            color: 'var(--text-secondary)',
            maxWidth: 640,
            margin: '0 auto 52px',
            lineHeight: 1.8,
            fontWeight: 400,
            animation: 'hero-in 0.9s 0.4s both',
            textAlign: 'center',
          }}>
            Monitor, detect, and automatically remediate threats across your entire cloud stack.
            Powered by <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>CEREBRO AI</strong> — processing 1.2B events/hour.
          </p>

          {/* CTAs */}
          <div className="hero-btns" style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', animation: 'hero-in 0.9s 0.5s both', marginBottom: 56 }}>
            <button className="btn-hero-primary" onClick={() => navigate('/login')}>
              <span className="glow-dot" />
              Get Started — It's Free
            </button>
            <button className="btn-hero-outline" onClick={() => navigate('/docs')}>
              Read the Docs →
            </button>
          </div>

          {/* Social proof strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.7, animation: 'hero-in 0.9s 0.65s both', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['#7c3aed', '#4f46e5', '#38bdf8', '#10b981', '#fbbf24'].map((c, i) => (
                <div key={c} style={{
                  width: 32, height: 32, borderRadius: '50%', background: c,
                  border: '2.5px solid var(--bg-primary)', marginLeft: i === 0 ? 0 : -10,
                  boxShadow: `0 0 16px ${c}60`, zIndex: 5 - i,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Trusted by <strong style={{ color: 'var(--text-primary)' }}>10,000+</strong> cloud-native teams
            </span>
            <span style={{ width: 1, height: 18, background: 'var(--border-light)' }} />
            <div style={{ display: 'flex', gap: 16 }}>
              {['No credit card', 'Cancel anytime'].map(item => (
                <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                  <span style={{ color: '#10b981', fontSize: 11 }}>✓</span> {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ STATS ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,48px) 100px' }}>
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {STATS.map(s => (
              <div className="reveal stat-card" key={s.label} style={{ '--card-color': s.color }}>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 700, marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{s.icon}</span> {s.label}
                </div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(30px,4vw,44px)', fontWeight: 900, color: s.color, lineHeight: 1, textShadow: `0 0 40px ${s.color}60`, marginBottom: 8 }}>
                  <AnimatedCounter value={s.val} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ TERMINAL ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, maxWidth: 920, margin: '0 auto', padding: '0 clamp(16px,4vw,48px) 110px' }}>
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            border: '1px solid rgba(16,185,129,0.2)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 100px rgba(16,185,129,0.12), 0 40px 80px rgba(0,0,0,0.4)',
          }}>
            {/* Chrome */}
            <div style={{
              background: 'linear-gradient(180deg, #0d1320 0%, #09111e 100%)',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {['#ef4444', '#f59e0b', '#10b981'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.9 }} />
              ))}
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginLeft: 12 }}>
                sentinelx — zsh ── ai.sentinelx.dev
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 6, padding: '3px 12px', fontSize: 10, fontWeight: 800, color: '#10b981', letterSpacing: 0.5 }}>
                <span className="glow-dot" style={{ width: 6, height: 6 }} /> LIVE
              </div>
            </div>
            {/* Body */}
            <div style={{
              background: 'linear-gradient(135deg, #060c18 0%, #080e1c 100%)',
              padding: 'clamp(24px,4vw,36px)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(12px,1.5vw,14px)',
              lineHeight: 2,
              minHeight: 240,
            }}>
              {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{ display: 'flex', animation: 'code-line 0.35s ease' }}>
                  <span style={{ color: 'rgba(255,255,255,0.18)', minWidth: 24 }}>{line.prefix}</span>
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
        <section style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '56px 0', overflow: 'hidden', background: 'rgba(8,8,16,0.4)', backdropFilter: 'blur(8px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="section-label">Trusted by the best engineering teams worldwide</div>
          </div>
          <div style={{
            position: 'relative',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}>
            <div
              style={{ display: 'flex', gap: 12, width: 'max-content', animation: 'marquee-l 32s linear infinite' }}
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
            >
              {[...LOGOS, ...LOGOS].map((logo, idx) => (
                <div key={idx} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
                  whiteSpace: 'nowrap', cursor: 'default', transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.boxShadow = ''; }}>
                  <span style={{ fontSize: 18 }}>{logo.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.1 }}>{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(72px,8vw,128px) clamp(16px,4vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-label">How It Works</div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: 20 }}>
              From zero to{' '}
              <span className="gradient-text-green">secure</span> in minutes
            </h2>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
              No agents. No complex setup. Connect, scan, and secure — all from a single dashboard.
            </p>
          </div>

          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="how-step reveal" style={{ transitionDelay: `${i * 0.15}s`, flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: 48, fontWeight: 900,
                    background: `linear-gradient(135deg, ${step.color}40, ${step.color}10)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    lineHeight: 1,
                  }}>{step.step}</div>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${step.color}18`, border: `1px solid ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {step.icon}
                  </div>
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(72px,8vw,128px) clamp(16px,4vw,48px)', borderTop: '1px solid rgba(255,255,255,0.05)', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-label">Platform Capabilities</div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: 20 }}>
              Built for speed.{' '}
              <span className="gradient-text-cyan">Designed for security.</span>
            </h2>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
              Everything you need to secure modern infrastructure — packed in a single, developer-centric platform.
            </p>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="feature-card reveal" style={{ '--card-color': `${f.color}44`, '--card-gradient': f.gradient, transitionDelay: `${i * 0.1}s` }}
                onMouseEnter={e => {
                  e.currentTarget.style.setProperty('--card-color', `${f.color}55`);
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.setProperty('--card-color', `${f.color}44`);
                }}>
                {/* Top row: icon + metric */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: `${f.color}14`, border: `1px solid ${f.color}28` }}>
                    {f.icon}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: f.color, lineHeight: 1, textShadow: `0 0 24px ${f.color}60` }}>{f.metric}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 4 }}>{f.metricLabel}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: f.color, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>{f.label}</div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, lineHeight: 1.2 }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}>{f.desc}</p>
                <Link to="/features" style={{ fontSize: 13.5, fontWeight: 700, color: f.color, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'gap 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '6px'}>
                  Learn more <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(72px,8vw,120px) clamp(16px,4vw,48px)', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,16,0.4)', backdropFilter: 'blur(8px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div className="section-label">Customer Stories</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                Loved by security teams{' '}
                <span className="gradient-text-purple">everywhere</span>
              </h2>
            </div>

            <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="testimonial-card"
                  style={{ opacity: activeReview === i ? 1 : 0.55, transform: activeReview === i ? 'scale(1.03) translateY(-4px)' : 'scale(1)', cursor: 'pointer', borderColor: activeReview === i ? `${t.color}30` : 'rgba(255,255,255,0.06)', boxShadow: activeReview === i ? `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${t.color}20` : 'none' }}
                  onClick={() => setActiveReview(i)}>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} style={{ color: idx < t.rating ? '#fbbf24' : 'rgba(255,255,255,0.1)' }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28, fontStyle: 'italic' }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0, boxShadow: `0 0 20px ${t.color}40` }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{t.role} · <span style={{ color: t.color }}>{t.company}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicator dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveReview(i)} style={{
                  width: activeReview === i ? 28 : 8, height: 8, borderRadius: 100, border: 'none', cursor: 'pointer',
                  background: activeReview === i ? 'linear-gradient(90deg, #7c3aed, #38bdf8)' : 'rgba(255,255,255,0.15)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                }} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CTA SECTION ═══════════ */}
        <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(72px,8vw,128px) clamp(16px,4vw,48px)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, rgba(56,189,248,0.08) 40%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

            <div className="cta-box" style={{ position: 'relative', zIndex: 1 }}>
              {/* Decorative orbs */}
              <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.15), transparent)', pointerEvents: 'none' }} />

              <div className="section-label" style={{ justifyContent: 'center' }}>Start today</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 24, position: 'relative' }}>
                Deploy security.<br />
                <span className="gradient-text-green">Instantly.</span>
              </h2>
              <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.8, position: 'relative' }}>
                Join thousands of developers building fast, secure, and globally distributed applications with SentinelX.
              </p>

              <div className="cta-btns" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', marginBottom: 36 }}>
                <button className="btn-hero-primary" onClick={() => navigate('/login')} style={{ fontSize: 17, padding: '18px 52px' }}>
                  <span className="glow-dot" />
                  Start Building for Free
                </button>
                <button className="btn-hero-outline" onClick={() => navigate('/contact')} style={{ fontSize: 17, padding: '17px 44px' }}>
                  Talk to Sales →
                </button>
              </div>

              {/* Trust line */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap', position: 'relative' }}>
                {['No credit card', 'SOC 2 Type II', '99.99% SLA', 'GDPR Ready'].map(item => (
                  <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                    <span style={{ color: '#10b981', fontSize: 12 }}>✓</span> {item}
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
