import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import {
  auth, googleProvider, githubProvider, appleProvider,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, sendPasswordResetEmail,
} from '../firebase';
import ReCAPTCHA from 'react-google-recaptcha';

/* ─── Event pool (streamed in randomly) ─────────────────────────────────── */
const EVENT_POOL = [
  { sev: 'CRIT', color: '#ff3b6b', msg: 'Brute-force on prod-auth-api-02 — auto-blocked', region: 'EU-WEST' },
  { sev: 'HIGH', color: '#ff6b2b', msg: 'IAM AssumeRole from 185.220.x.x (TOR exit node)', region: 'US-EAST' },
  { sev: 'MED', color: '#f9c80e', msg: 'S3 bucket policy change without ticket reference', region: 'APAC' },
  { sev: 'CRIT', color: '#ff3b6b', msg: 'Root account login — MFA bypass attempted', region: 'SA-EAST' },
  { sev: 'LOW', color: '#2dd4bf', msg: 'First-time API call from Singapore edge endpoint', region: 'APAC' },
  { sev: 'CRIT', color: '#ff3b6b', msg: 'Data exfiltration: 4,291 S3 GetObject in 8 min', region: 'EU-NORTH' },
  { sev: 'MED', color: '#f9c80e', msg: 'KMS key rotation overdue — CIS Benchmark violation', region: 'US-WEST' },
  { sev: 'HIGH', color: '#ff6b2b', msg: 'Cryptominer binary detected on ec2-prod-worker-07', region: 'US-EAST' },
  { sev: 'LOW', color: '#2dd4bf', msg: 'Unusual CloudTrail API sequence — risk score 42', region: 'APAC' },
  { sev: 'HIGH', color: '#ff6b2b', msg: 'Port scan from 45.33.x.x — firewall rule triggered', region: 'EU-WEST' },
  { sev: 'CRIT', color: '#ff3b6b', msg: 'Ransomware signature detected in Lambda /tmp dir', region: 'US-EAST' },
  { sev: 'MED', color: '#f9c80e', msg: 'Expired SSL cert on api-gateway.prod (3 days left)', region: 'GLOBAL' },
  { sev: 'LOW', color: '#2dd4bf', msg: 'New cross-account assume-role from dev environment', region: 'US-WEST' },
  { sev: 'HIGH', color: '#ff6b2b', msg: 'Suspicious kubectl exec into production pod detected', region: 'APAC' },
  { sev: 'CRIT', color: '#ff3b6b', msg: 'DDoS surge: 2.3M rps on edge-lb-01 — mitigation ON', region: 'GLOBAL' },
];

const CEREBRO_MESSAGES = [
  'CEREBRO AI: Lateral movement detected in RU-East cluster. Confidence 96.4%',
  'CEREBRO AI: Anomalous data transfer spike — S3 exfil pattern recognized',
  'CEREBRO AI: Zero-day exploit attempt on CVE-2024-1234 blocked at WAF layer',
  'CEREBRO AI: Credential stuffing campaign from 3 distinct botnets identified',
  'CEREBRO AI: Privilege escalation chain broken — attacker path neutralized',
];

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

/* ─── Animated Counter ───────────────────────────────────────────────────── */
function AnimCounter({ value, suffix = '', color }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const diff = value - display;
    if (diff === 0) return;
    const step = Math.ceil(Math.abs(diff) / 12);
    const id = setInterval(() => {
      setDisplay(prev => {
        const next = diff > 0 ? Math.min(prev + step, value) : Math.max(prev - step, value);
        if (next === value) clearInterval(id);
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, [value, display]);
  return (
    <span style={{ color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── Typing text effect ─────────────────────────────────────────────────── */
function TypingText({ text, speed = 28 }) {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayed('');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdx(0);
  }, [text]);
  useEffect(() => {
    if (idx >= text.length) return;
    const id = setTimeout(() => {
      setDisplayed(text.slice(0, idx + 1));
      setIdx(i => i + 1);
    }, speed);
    return () => clearTimeout(id);
  }, [idx, text, speed]);
  return (
    <span>
      {displayed}
      {idx < text.length && (
        <span style={{ borderRight: '2px solid #10b981', animation: 'blink 0.7s step-end infinite', marginLeft: 1 }}>&nbsp;</span>
      )}
    </span>
  );
}

/* ─── SparkLine mini chart ───────────────────────────────────────────────── */
function SparkLine({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const h = 32, w = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.8" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.12" stroke="none" />
    </svg>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();

  // Auth state
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  // Live feed state
  const [events, setEvents] = useState(() => EVENT_POOL.slice(0, 5).map((e, i) => ({ ...e, id: i, ts: `${(i + 1) * 8}s ago`, fresh: false })));
  const [eventIdCounter, setEventIdCounter] = useState(100);
  const [cerebroIdx, setCerebroIdx] = useState(0);
  const [cerebroKey, setCerebroKey] = useState(0);

  // Live counters
  const [threats, setThreats] = useState(1285);
  const [blocked, setBlocked] = useState(14523);
  const [evPerSec, setEvPerSec] = useState(342);
  const [sparkData, setSparkData] = useState([210, 280, 320, 295, 342, 310, 360, 380, 342]);

  // Clock
  const [now, setNow] = useState(new Date());

  // Stream new events every 2.2s
  useEffect(() => {
    const id = setInterval(() => {
      const ev = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const newEvent = { ...ev, id: Date.now(), ts: 'just now', fresh: true };
      setEvents(prev => [newEvent, ...prev.slice(0, 5)]);
      setEventIdCounter(c => c + 1);

      // Remove "fresh" flag after animation
      setTimeout(() => {
        setEvents(prev => prev.map(e => e.id === newEvent.id ? { ...e, fresh: false } : e));
      }, 600);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // Update timestamps every second
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      setEvents(prev => prev.map(e => {
        if (e.ts === 'just now') return { ...e, ts: '1s ago' };
        const sec = parseInt(e.ts);
        if (!isNaN(sec) && e.ts.endsWith('s ago')) return { ...e, ts: `${sec + 1}s ago` };
        return e;
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Animate live counters
  useEffect(() => {
    const id = setInterval(() => {
      setThreats(v => v + Math.floor(Math.random() * 4));
      setBlocked(v => v + Math.floor(Math.random() * 8));
      setEvPerSec(v => {
        const next = v + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
        return Math.max(200, Math.min(600, next));
      });
      setSparkData(prev => [...prev.slice(1), evPerSec]);
    }, 1800);
    return () => clearInterval(id);
  }, [evPerSec]);

  // Rotate CEREBRO message every 6s
  useEffect(() => {
    const id = setInterval(() => {
      setCerebroIdx(i => (i + 1) % CEREBRO_MESSAGES.length);
      setCerebroKey(k => k + 1);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  /* ── Auth helpers ──────────────────────────────────────────────────────── */
  const friendlyError = (code) => ({
    'auth/user-not-found': 'No account with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'Email already registered.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/popup-closed-by-user': 'Popup closed. Try again.',
    'auth/account-exists-with-different-credential': 'Account exists with another provider.',
  }[code] || 'An error occurred. Please try again.');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!recaptchaToken) {
      setError('Please complete the human verification (reCAPTCHA).');
      return;
    }

    if (mode === 'signup' && pwd !== confirmPwd) { setError('Passwords do not match.'); return; }
    setLoading('email');
    try {
      if (mode === 'login') await signInWithEmailAndPassword(auth, email, pwd);
      else await createUserWithEmailAndPassword(auth, email, pwd);
      navigate('/dashboard');
    } catch (err) { setError(friendlyError(err.code)); }
    finally { setLoading(null); }
  };

  const handleSocial = async (provider, name) => {
    setError('');
    setLoading(name);
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) { setError(friendlyError(err.code)); }
    finally { setLoading(null); }
  };

  const handleForgot = async () => {
    if (!email) { setError('Enter your email first.'); return; }
    setError(''); setLoading('reset');
    try { await sendPasswordResetEmail(auth, email); setResetSent(true); }
    catch (err) { setError(friendlyError(err.code)); }
    finally { setLoading(null); }
  };

  /* ── Styles ────────────────────────────────────────────────────────────── */
  const inp = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 9, padding: '12px 16px',
    color: 'var(--text-primary)', fontSize: 14,
    fontFamily: 'Inter, sans-serif', outline: 'none',
    transition: 'border-color .2s',
  };
  const socBtn = {
    display: 'flex', alignItems: 'center', gap: 11,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 9, padding: '11px 16px',
    color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'background .2s, border-color .2s, transform .15s',
    width: '100%', textAlign: 'left',
  };
  const Spinner = ({ c = '#fff' }) => (
    <span style={{ width: 15, height: 15, border: `2px solid rgba(255,255,255,0.25)`, borderTopColor: c, borderRadius: '50%', display: 'inline-block', animation: 'spin .6s linear infinite', flexShrink: 0 }} />
  );



  return (
    <div className="login-layout" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 440px', background: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT — Live SOC panel
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="login-left-panel" style={{ padding: '36px 48px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>

        {/* Subtle ambient glow */}
        <div style={{ position: 'absolute', top: -120, left: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo + live clock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <Logo layout="horizontal" size={32} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: 2 }}>
              {now.toLocaleTimeString('en-GB')}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>{now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()} · UTC+0</div>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 8, letterSpacing: -0.5 }}>
          Your cloud is<br />
          <span style={{ background: 'linear-gradient(90deg, var(--blue), var(--green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            under attack right now.
          </span>
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 420, marginBottom: 24 }}>
          CEREBRO AI processes 1.2B+ events/hour. Live threat feed below is real-time.
        </p>

        {/* ── Live metric cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'THREATS TODAY', value: threats, suffix: '', color: '#ff3b6b', spark: sparkData.map(v => v * 3) },
            { label: 'EVENTS/SEC', value: evPerSec, suffix: '', color: '#10b981', spark: sparkData },
            { label: 'VECTORS BLOCKED', value: blocked, suffix: '', color: '#7c3aed', spark: sparkData.map(v => v * 40) },
          ].map(m => (
            <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.8, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>
                <AnimCounter value={m.value} suffix={m.suffix} color={m.color} />
              </div>
              <SparkLine data={m.spark} color={m.color} />
              {/* Pulse dot */}
              <span style={{ position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: '50%', background: m.color, boxShadow: `0 0 6px ${m.color}`, animation: 'ping 1.5s ease-out infinite' }} />
            </div>
          ))}
        </div>

        {/* ── CEREBRO AI strip ── */}
        <div style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.08), rgba(124,58,237,0.06))', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, minHeight: 42, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🧠</span>
          <span style={{ fontSize: 12, color: '#10b981', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: 0.2 }}>
            <TypingText key={cerebroKey} text={CEREBRO_MESSAGES[cerebroIdx]} speed={22} />
          </span>
        </div>

        {/* ── Live event stream ── */}
        <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', minHeight: 0 }}>
          {/* Header with live pulsing dot */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fbbf24', display: 'inline-block', boxShadow: '0 0 8px #fbbf24', animation: 'ping 1.2s ease-out infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live Global Threat Stream</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 4, padding: '2px 6px' }}>
              {eventIdCounter} events
            </span>
          </div>

          {/* Streaming rows */}
          <div style={{ overflow: 'hidden' }}>
            {events.map((ev, i) => (
              <div key={ev.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
                borderBottom: i < events.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                opacity: i === 0 ? 1 : Math.max(0.30, 1 - i * 0.14),
                transform: ev.fresh ? 'translateY(0)' : 'none',
                animation: ev.fresh ? 'slideDown 0.4s cubic-bezier(0.16,1,0.3,1)' : 'none',
                background: ev.fresh ? `${ev.color}06` : 'transparent',
                transition: 'background 1s ease',
              }}>
                <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.4, padding: '2px 6px', borderRadius: 3, background: `${ev.color}18`, color: ev.color, border: `1px solid ${ev.color}30`, flexShrink: 0, minWidth: 32, textAlign: 'center' }}>{ev.sev}</span>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', flexShrink: 0 }}>{ev.region}</span>
                <span style={{ flex: 1, fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ev.msg}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>{ev.ts}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>© 2024 SentinelX · SOC2 Type II · ISO 27001 · <span style={{ color: '#10b981' }}>●</span> All systems operational</div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT — Auth form
      ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 36px', background: 'var(--bg-primary)' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* Status badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--blue-dim)', border: '1px solid var(--border-light)', borderRadius: 100, padding: '4px 12px', fontSize: 11, color: 'var(--blue-light)', fontWeight: 600, marginBottom: 22 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'ping 1.5s ease-out infinite' }} />
            Firebase Auth · TLS 1.3 Encrypted
          </div>

          {/* Sign In / Create Account toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 11, padding: 4, marginBottom: 22, gap: 4 }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setResetSent(false); }}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
                  background: mode === m ? 'var(--bg-card)' : 'transparent',
                  color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                  transition: 'all .2s',
                }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>
            {mode === 'login' ? 'Welcome back' : 'Join SentinelX'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 22 }}>
            {mode === 'login' ? 'Access your security command center.' : 'Start protecting your cloud today.'}
          </p>

          {/* Error / Success */}
          {error && (
            <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red-glow)', borderRadius: 8, padding: '10px 13px', fontSize: 12.5, color: 'var(--red)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              ⚠️ {error}
            </div>
          )}
          {resetSent && (
            <div style={{ background: 'var(--blue-dim)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '10px 13px', fontSize: 12.5, color: 'var(--blue-light)', marginBottom: 14 }}>
              ✅ Reset email sent! Check your inbox.
            </div>
          )}

          {/* Email/Password form */}
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label htmlFor="login-email" style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 }}>Email</label>
              <input
                id="login-email"
                required type="email" placeholder="you@company.com" value={email}
                onChange={e => setEmail(e.target.value)} style={inp}
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label htmlFor="login-pwd" style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={handleForgot} disabled={loading === 'reset'}
                    style={{ fontSize: 11.5, color: 'var(--blue-light)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {loading === 'reset' ? 'Sending…' : 'Forgot?'}
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-pwd"
                  required type={showPwd ? 'text' : 'password'} placeholder="••••••••••" value={pwd}
                  onChange={e => setPwd(e.target.value)} style={{ ...inp, paddingRight: 50 }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 10.5, fontWeight: 700 }}>
                  {showPwd ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirm-pwd" style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 }}>Confirm Password</label>
                <input
                  id="confirm-pwd"
                  required type="password" placeholder="••••••••••" value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)} style={inp}
                  onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
                />
              </div>
            )}

            {/* reCAPTCHA validation widget */}
            <div style={{ marginTop: 6, marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Dummy test key for localhost
                theme="dark"
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>

            <button type="submit" disabled={!!loading}
              style={{ background: loading === 'email' ? 'var(--blue-hover)' : 'linear-gradient(135deg, var(--blue), var(--indigo))', color: '#fff', border: 'none', borderRadius: 9, padding: '13px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: 'var(--shadow-glow-blue)', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading && loading !== 'email' ? 0.6 : 1 }}>
              {loading === 'email' ? <><Spinner /> {mode === 'login' ? 'Signing in…' : 'Creating…'}</> : (mode === 'login' ? 'Sign In with Email →' : 'Create Account →')}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.6 }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <button disabled={!!loading} onClick={() => handleSocial(googleProvider, 'google')} style={socBtn}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(66,133,244,0.10)'; e.currentTarget.style.borderColor = 'rgba(66,133,244,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'none'; }}>
              {loading === 'google' ? <Spinner c="#4285F4" /> : <GoogleIcon />}
              Continue with Google
            </button>

            <button disabled={!!loading} onClick={() => handleSocial(githubProvider, 'github')} style={socBtn}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'none'; }}>
              {loading === 'github' ? <Spinner /> : <GitHubIcon />}
              Continue with GitHub
            </button>

            <button disabled={!!loading} onClick={() => handleSocial(appleProvider, 'apple')} style={socBtn}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'none'; }}>
              {loading === 'apple' ? <Spinner /> : <AppleIcon />}
              Continue with Apple
            </button>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 8 }}>
              {mode === 'login'
                ? <> Don't have an account? <Link to="/pricing" style={{ color: 'var(--blue-light)', fontWeight: 700, textDecoration: 'none' }}>Start free trial</Link></>
                : <> Have an account? <button onClick={() => setMode('login')} style={{ color: 'var(--blue-light)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5 }}>Sign in</button></>
              }
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 10.5, color: 'var(--text-muted)' }}>
              <span>🔒 TLS 1.3</span><span>🛡 SOC2 II</span><span>🔐 Firebase Auth</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
