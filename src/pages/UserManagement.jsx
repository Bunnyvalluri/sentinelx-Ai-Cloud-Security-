import AppLayout from '../components/AppLayout';
import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Seed Data ─────────────────────────────────────────────────── */
const SEED_USERS = [
  { id: 'u1', name: 'Alex Rivera',    email: 'alex.r@sentinelx.ai',    role: 'ADMIN',   status: 'Online',  mfa: true,  country: 'US', sessions: 2, risk: 'Low',    lastSeen: Date.now() - 120000,  img: 'https://i.pravatar.cc/100?img=11' },
  { id: 'u2', name: 'Jordan Smith',   email: 'jordan.s@sentinelx.ai',  role: 'ANALYST', status: 'Online',  mfa: true,  country: 'UK', sessions: 1, risk: 'Low',    lastSeen: Date.now() - 3600000, img: 'https://i.pravatar.cc/100?img=12' },
  { id: 'u3', name: 'Taylor Wong',    email: 'taylor.w@sentinelx.ai',  role: 'VIEWER',  status: 'Offline', mfa: false, country: 'SG', sessions: 0, risk: 'Medium', lastSeen: Date.now() - 259200000, img: 'https://i.pravatar.cc/100?img=13' },
  { id: 'u4', name: 'Morgan Lee',     email: 'morgan.l@sentinelx.ai',  role: 'ANALYST', status: 'Online',  mfa: true,  country: 'AU', sessions: 3, risk: 'Low',    lastSeen: Date.now() - 10000,   img: 'https://i.pravatar.cc/100?img=14' },
  { id: 'u5', name: 'Casey Park',     email: 'casey.p@sentinelx.ai',   role: 'VIEWER',  status: 'Idle',    mfa: true,  country: 'CA', sessions: 1, risk: 'Low',    lastSeen: Date.now() - 900000,  img: 'https://i.pravatar.cc/100?img=15' },
  { id: 'u6', name: 'Riley Nguyen',   email: 'riley.n@sentinelx.ai',   role: 'ANALYST', status: 'Online',  mfa: false, country: 'VN', sessions: 1, risk: 'High',   lastSeen: Date.now() - 5000,    img: 'https://i.pravatar.cc/100?img=16' },
];

const ROLE_STYLE = {
  ADMIN:   { bg: 'rgba(224,92,92,.12)',  c: '#e05c5c', b: 'rgba(224,92,92,.30)' },
  ANALYST: { bg: 'rgba(91,184,212,.12)', c: '#5bb8d4', b: 'rgba(91,184,212,.30)' },
  VIEWER:  { bg: 'rgba(107,114,128,.10)', c: '#9ca3af', b: 'rgba(107,114,128,.26)' },
};
const STATUS_COLOR = { Online: '#4ecdc4', Idle: '#e8c97a', Offline: '#7a96aa' };
const RISK_COLOR   = { Low: '#4ecdc4',    Medium: '#e8c97a', High: '#e05c5c' };

const ACTIVITY_POOL = [
  (n, r) => `🔐 ${n} authenticated via ${r > 0.5 ? 'SSO' : 'password + MFA'}`,
  (n)    => `📋 ${n} exported audit report`,
  (n)    => `🛡 ${n} updated firewall rule set`,
  (n)    => `🔑 ${n} rotated API credentials`,
  (n)    => `👁 ${n} accessed classified log segment`,
  (n)    => `⚠️ Failed login attempt on ${n}'s account`,
  (n)    => `🌐 ${n} opened session from new IP`,
  (n)    => `🚫 ${n} revoked access for sub-user`,
  (n)    => `✅ ${n} completed security training`,
  (n)    => `📡 ${n} initiated live threat scan`,
];

const COUNTRIES = { US:'🇺🇸', UK:'🇬🇧', SG:'🇸🇬', AU:'🇦🇺', CA:'🇨🇦', VN:'🇻🇳', DE:'🇩🇪', IN:'🇮🇳' };

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)  return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function LiveDot({ color, pulse = true }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
      {pulse && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: color, opacity: 0.5,
          animation: 'pingDot 1.4s cubic-bezier(0,0,0.2,1) infinite'
        }} />
      )}
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'block' }} />
    </span>
  );
}

/* ─── Edit User Modal ───────────────────────────────────────────── */
function EditModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user.name, role: user.role, mfa: user.mfa });
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
      animation: 'fadeIn .2s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg,#1a3a52,#1e4160)',
        border: '1px solid rgba(91,184,212,.25)', borderRadius: 20,
        padding: '32px', width: 420, boxShadow: '0 24px 80px rgba(0,0,0,.6)',
        animation: 'slideUp .25s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'Outfit,sans-serif' }}>Edit Identity</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Modify RBAC configuration</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#9ca3af', width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
        <img src={user.img} alt="" style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid rgba(91,184,212,.4)', marginBottom: 20 }} />
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 6 }}>DISPLAY NAME</label>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          style={{ width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(91,184,212,.25)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, marginBottom: 16, outline: 'none' }} />
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 6 }}>RBAC ROLE</label>
        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          style={{ width: '100%', background: '#1a3a52', border: '1px solid rgba(91,184,212,.25)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, marginBottom: 16, outline: 'none', cursor: 'pointer' }}>
          <option value="ADMIN">ADMIN</option>
          <option value="ANALYST">ANALYST</option>
          <option value="VIEWER">VIEWER</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>MFA Enforced</span>
          <div onClick={() => setForm(f => ({ ...f, mfa: !f.mfa }))}
            style={{ width: 40, height: 22, borderRadius: 100, background: form.mfa ? 'var(--green)' : 'rgba(255,255,255,.1)', position: 'relative', transition: 'background .2s', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', top: 3, left: form.mfa ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.3)' }} />
          </div>
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg,rgba(91,184,212,.3),rgba(78,205,196,.2))', border: '1px solid rgba(91,184,212,.4)', borderRadius: 10, color: '#7ecde3', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function UserManagement() {
  const [tab, setTab]     = useState('All');
  const [users, setUsers] = useState(SEED_USERS);
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState([]);
  const [editUser, setEditUser]     = useState(null);
  const [provisionStep, setProvisionStep] = useState('idle'); // idle | loading | done
  const [sessionKilling, setSessionKilling] = useState(null);
  const [failedLogins, setFailedLogins]   = useState(2);
  const [pendingInvites, setPendingInvites] = useState(4);
  const [highlight, setHighlight] = useState(null);
  const [now, setNow] = useState(Date.now());
  const activityRef = useRef(null);
  const tickRef = useRef(null);

  /* ── Clock tick (updates "X ago" labels) ── */
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);

  /* ── Push activity helper ── */
  const pushActivity = useCallback((msg, type = 'info') => {
    setActivities(prev => [{ id: Date.now() + Math.random(), msg, type, ts: Date.now() }, ...prev].slice(0, 60));
  }, []);

  /* ── Random real-time events ── */
  useEffect(() => {
    const loop = () => {
      const delay = 2800 + Math.random() * 4200;
      tickRef.current = setTimeout(() => {
        const u = SEED_USERS[Math.floor(Math.random() * SEED_USERS.length)];
        const r = Math.random();
        const fn = ACTIVITY_POOL[Math.floor(Math.random() * ACTIVITY_POOL.length)];
        const msg = fn(u.name.split(' ')[0], r);
        const type = msg.includes('Failed') || msg.includes('⚠') ? 'warn'
                   : msg.includes('🌐') ? 'alert' : 'info';

        pushActivity(msg, type);

        /* occasionally update a user's lastSeen / status */
        if (r < 0.35) {
          setUsers(prev => prev.map(pu => pu.id === u.id
            ? { ...pu, lastSeen: Date.now(), status: r < 0.15 ? 'Idle' : 'Online' }
            : pu
          ));
          setHighlight(u.id);
          setTimeout(() => setHighlight(null), 1800);
        }

        /* occasionally tick failed logins */
        if (msg.includes('Failed')) setFailedLogins(n => n + 1);

        loop();
      }, delay);
    };
    loop();
    return () => clearTimeout(tickRef.current);
  }, [pushActivity]);

  /* ── Scroll activity feed ── */
  useEffect(() => {
    if (activityRef.current) activityRef.current.scrollTop = 0;
  }, [activities]);

  /* ── Filtering ── */
  const filtered = users.filter(u => {
    const matchTab =
      tab === 'All' ? true :
      tab === 'Admins'   ? u.role === 'ADMIN' :
      tab === 'Analysts' ? u.role === 'ANALYST' :
      tab === 'Online'   ? u.status === 'Online' :
      tab === 'High Risk'? u.risk === 'High' : true;
    const q = search.toLowerCase();
    return matchTab && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  });

  /* ── Stats ── */
  const online  = users.filter(u => u.status === 'Online').length;
  const sessions = users.reduce((a, u) => a + u.sessions, 0);
  const highRisk = users.filter(u => u.risk === 'High').length;

  /* ── Provision ── */
  const handleProvision = () => {
    if (provisionStep !== 'idle') return;
    setProvisionStep('loading');
    pushActivity('🔄 Provisioning new identity...', 'info');
    const names = ['Sam Chen','Drew Patel','Jamie Osei','Robin Müller','Avery Kim'];
    setTimeout(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const newU = {
        id: 'u' + Date.now(),
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@sentinelx.ai`,
        role: 'ANALYST', status: 'Online', mfa: false,
        country: 'US', sessions: 0, risk: 'Low',
        lastSeen: Date.now(),
        img: `https://i.pravatar.cc/100?img=${20 + Math.floor(Math.random() * 30)}`
      };
      setUsers(prev => [newU, ...prev]);
      setPendingInvites(n => n - 1 < 0 ? 0 : n - 1);
      setHighlight(newU.id);
      setTimeout(() => setHighlight(null), 2500);
      pushActivity(`✅ Identity provisioned: ${name}`, 'success');
      setProvisionStep('done');
      setTimeout(() => setProvisionStep('idle'), 2000);
    }, 1800);
  };

  /* ── Kill session ── */
  const handleKillSession = (uid) => {
    setSessionKilling(uid);
    pushActivity(`🚫 Session terminated for ${users.find(u => u.id === uid)?.name.split(' ')[0]}`, 'warn');
    setTimeout(() => {
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, sessions: 0, status: 'Offline' } : u));
      setSessionKilling(null);
    }, 1200);
  };

  /* ── Revoke ── */
  const handleRevoke = (uid) => {
    const u = users.find(x => x.id === uid);
    pushActivity(`🗑 Access revoked for ${u?.name.split(' ')[0]}`, 'warn');
    setUsers(prev => prev.filter(x => x.id !== uid));
  };

  /* ── Save edit ── */
  const handleSave = (form) => {
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    pushActivity(`✏️ Identity updated: ${form.name} → ${form.role}`, 'info');
    setEditUser(null);
  };

  /* ── Toggle MFA directly from table ── */
  const toggleMFA = (uid) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== uid) return u;
      const next = !u.mfa;
      pushActivity(`🔐 MFA ${next ? 'enabled' : 'disabled'} for ${u.name.split(' ')[0]}`, next ? 'success' : 'warn');
      return { ...u, mfa: next };
    }));
  };

  return (
    <AppLayout title="Identity & Access Management" subtitle="Real-time RBAC control with live session monitoring" bgClass="bg-gradient-users">

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            RBAC Control Center
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <LiveDot color="#4ecdc4" />
            <span>Live monitoring active</span>
            <span style={{ color: 'var(--border-light)' }}>·</span>
            <span>{online} users online</span>
            <span style={{ color: 'var(--border-light)' }}>·</span>
            <span>{sessions} active sessions</span>
          </div>
        </div>
        <button
          onClick={handleProvision}
          disabled={provisionStep === 'loading'}
          className="btn btn-primary"
          style={{ gap: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background-color .3s, border-color .3s, color .3s, opacity .3s, box-shadow .3s, transform .3s',
            opacity: provisionStep === 'loading' ? 0.7 : 1,
            transform: provisionStep === 'loading' ? 'scale(0.97)' : 'scale(1)' }}
        >
          {provisionStep === 'loading' ? (
            <>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
              Provisioning…
            </>
          ) : provisionStep === 'done' ? '✅ Provisioned!' : '👤⁺ Provision Identity'}
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'TOTAL IDENTITIES', val: users.length,       icon: '👥', color: 'var(--blue)', glow: 'glow-blue' },
          { label: 'LIVE SESSIONS',    val: sessions,            icon: '📡', color: '#4ecdc4',     glow: 'glow-green' },
          { label: 'PENDING INVITES',  val: pendingInvites,      icon: '✉',  color: 'var(--yellow)' },
          { label: 'FAILED LOGINS 24H',val: failedLogins,        icon: '⚠',  color: 'var(--red)',   glow: 'glow-red' },
        ].map(s => (
          <div key={s.label} className={`metric-card ${s.glow || ''}`}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 34, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: s.color || '#fff',
                transition: 'color .4s' }}>{s.val}</div>
            </div>
            <span style={{ fontSize: 28, opacity: 0.8 }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* ── Main layout: table + activity feed ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* ── User Table ── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Tab row */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(91,184,212,.03)' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['All', 'Admins', 'Analysts', 'Online', 'High Risk'].map(t => (
                <button key={t} onClick={() => setTab(t)} className="btn"
                  style={{
                    padding: '5px 14px', fontSize: 12,
                    background: tab === t ? 'var(--blue-glow)' : 'transparent',
                    color: tab === t ? 'var(--blue-light)' : 'var(--text-secondary)',
                    border: tab === t ? '1px solid rgba(91,184,212,.3)' : '1px solid transparent',
                    borderRadius: 6,
                    transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s'
                  }}>
                  {t}
                  {t === 'High Risk' && highRisk > 0 && (
                    <span style={{ marginLeft: 5, background: 'rgba(224,92,92,.2)', color: '#e05c5c', fontSize: 9, padding: '1px 5px', borderRadius: 100, fontWeight: 700 }}>{highRisk}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="search-input">
              <input placeholder="🔍 Search identity…" style={{ width: 150 }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th>USER IDENTITY</th>
                  <th>ROLE</th>
                  <th>MFA</th>
                  <th>STATUS</th>
                  <th>SESSIONS</th>
                  <th>RISK</th>
                  <th>LAST SEEN</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const rs = ROLE_STYLE[u.role] || ROLE_STYLE.VIEWER;
                  const sc = STATUS_COLOR[u.status] || '#9ca3af';
                  const rc = RISK_COLOR[u.risk] || '#9ca3af';
                  const isNew = highlight === u.id;
                  return (
                    <tr key={u.id} style={{
                      background: isNew ? 'rgba(91,184,212,.07)' : 'transparent',
                      transition: 'background .6s ease',
                      animation: 'fadeInRow .35s ease'
                    }}>
                      {/* Identity */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ position: 'relative', flexShrink: 0 }}>
                            <img src={u.img} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${sc}40` }} alt={u.name} />
                            <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: sc, border: '2px solid var(--bg-card)', display: 'inline-block' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                          <span style={{ fontSize: 14, marginLeft: 2 }}>{COUNTRIES[u.country] || '🌍'}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span style={{ background: rs.bg, color: rs.c, border: `1px solid ${rs.b}`, padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{u.role}</span>
                      </td>

                      {/* MFA toggle */}
                      <td>
                        <button onClick={() => toggleMFA(u.id)} title="Toggle MFA"
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                          <div style={{ width: 32, height: 18, borderRadius: 100, background: u.mfa ? 'rgba(78,205,196,.3)' : 'rgba(255,255,255,.1)', position: 'relative', transition: 'background .25s', border: `1px solid ${u.mfa ? '#4ecdc4' : 'rgba(255,255,255,.15)'}` }}>
                            <div style={{ position: 'absolute', top: 2, left: u.mfa ? 14 : 2, width: 12, height: 12, borderRadius: '50%', background: u.mfa ? '#4ecdc4' : '#6b7280', transition: 'left .25s', boxShadow: '0 1px 3px rgba(0,0,0,.4)' }} />
                          </div>
                          <span style={{ fontSize: 11, color: u.mfa ? '#4ecdc4' : 'var(--text-muted)', fontWeight: 600, transition: 'color .25s' }}>{u.mfa ? 'ON' : 'OFF'}</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <LiveDot color={sc} pulse={u.status === 'Online'} />
                          <span style={{ fontSize: 12, color: sc, fontWeight: 600 }}>{u.status}</span>
                        </div>
                      </td>

                      {/* Sessions */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: u.sessions > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{u.sessions}</span>
                          {u.sessions > 0 && (
                            <button onClick={() => handleKillSession(u.id)}
                              disabled={sessionKilling === u.id}
                              title="Kill all sessions"
                              style={{ background: 'rgba(224,92,92,.12)', border: '1px solid rgba(224,92,92,.25)', borderRadius: 5, color: '#e05c5c', fontSize: 9, fontWeight: 700, padding: '2px 6px', cursor: 'pointer', opacity: sessionKilling === u.id ? 0.5 : 1, letterSpacing: 0.4, transition: 'opacity .2s' }}>
                              {sessionKilling === u.id ? '…' : 'KILL'}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Risk */}
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: rc }}>
                          {u.risk === 'High' && <span style={{ animation: 'pingDot 1.2s infinite', display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: rc }} />}
                          {u.risk}
                        </span>
                      </td>

                      {/* Last seen */}
                      <td style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                        {u.status === 'Online' ? (
                          <span style={{ color: '#4ecdc4', fontWeight: 600 }}>● Active</span>
                        ) : timeAgo(u.lastSeen)}
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => setEditUser(u)} className="btn btn-outline"
                            style={{ padding: '3px 9px', fontSize: 10, transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s' }}>
                            ✏ Edit
                          </button>
                          <button onClick={() => handleRevoke(u.id)} className="btn btn-outline"
                            style={{ padding: '3px 9px', fontSize: 10, borderColor: 'rgba(224,92,92,.3)', color: 'var(--red)', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s' }}>
                            🚫 Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>Showing {filtered.length} of {users.length} identities</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <LiveDot color="#4ecdc4" />
              <span>Auto-refresh active</span>
            </div>
          </div>
        </div>

        {/* ── Live Activity Feed ── */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Feed header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(78,205,196,.03)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Live Activity Stream</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{activities.length} events captured</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <LiveDot color="#4ecdc4" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#4ecdc4', letterSpacing: 0.5 }}>LIVE</span>
            </div>
          </div>

          {/* Scrollable feed */}
          <div ref={activityRef} style={{ flex: 1, overflowY: 'auto', maxHeight: 480, padding: '8px 0' }}>
            {activities.length === 0 && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                Waiting for events…
              </div>
            )}
            {activities.map((ev, i) => {
              const isWarn = ev.type === 'warn' || ev.type === 'alert';
              const isSucc = ev.type === 'success';
              return (
                <div key={ev.id} style={{
                  padding: '9px 18px',
                  borderBottom: '1px solid rgba(255,255,255,.04)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  background: i === 0 ? 'rgba(91,184,212,.05)' : 'transparent',
                  animation: i === 0 ? 'slideInFeed .3s ease' : 'none',
                  transition: 'background .4s'
                }}>
                  <div style={{ width: 3, borderRadius: 2, alignSelf: 'stretch', flexShrink: 0, marginTop: 2,
                    background: isWarn ? 'var(--red)' : isSucc ? '#4ecdc4' : 'rgba(91,184,212,.5)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: isWarn ? '#e8c97a' : 'var(--text-secondary)', lineHeight: 1.4, wordBreak: 'break-word' }}>{ev.msg}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{timeAgo(ev.ts)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk Summary */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', background: 'rgba(224,92,92,.04)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>Risk Overview</div>
            {['Low', 'Medium', 'High'].map(r => {
              const count = users.filter(u => u.risk === r).length;
              const pct = Math.round((count / Math.max(users.length, 1)) * 100);
              return (
                <div key={r} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: 'var(--text-secondary)' }}>
                    <span>{r}</span><span>{count} users</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 100, background: 'rgba(255,255,255,.07)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 100, width: `${pct}%`, background: RISK_COLOR[r], transition: 'width .6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Session map strip ── */}
      <div className="card" style={{ marginTop: 20, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Active Session Map</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LiveDot color="#4ecdc4" />
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sessions} total sessions</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {users.filter(u => u.sessions > 0).map(u => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(91,184,212,.06)', border: '1px solid rgba(91,184,212,.15)',
              borderRadius: 12, padding: '10px 14px', minWidth: 200
            }}>
              <img src={u.img} style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${STATUS_COLOR[u.status]}60` }} alt="" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{COUNTRIES[u.country]} {u.sessions} session{u.sessions > 1 ? 's' : ''}</div>
              </div>
              <button onClick={() => handleKillSession(u.id)} disabled={sessionKilling === u.id}
                style={{ background: 'rgba(224,92,92,.15)', border: '1px solid rgba(224,92,92,.25)', borderRadius: 6, color: '#e05c5c', fontSize: 9, fontWeight: 700, padding: '3px 8px', cursor: 'pointer', letterSpacing: 0.4, transition: 'opacity .2s', opacity: sessionKilling === u.id ? 0.5 : 1 }}>
                KILL
              </button>
            </div>
          ))}
          {users.filter(u => u.sessions === 0).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', padding: '10px 4px' }}>
              + {users.filter(u => u.sessions === 0).length} offline identities
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editUser && <EditModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} />}

      <style>{`
        @keyframes fadeInRow {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFeed {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pingDot {
          0%, 100% { transform: scale(1);   opacity: 0.6; }
          50%       { transform: scale(2.2); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AppLayout>
  );
}
