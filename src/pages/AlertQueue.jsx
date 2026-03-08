import AppLayout from '../components/AppLayout';
import { useState, useEffect, useRef } from 'react';

const INITIAL_ALERTS = [
  {
    sev: 'CRITICAL THREAT', id: 'ALRT-8842-X',
    title: 'Unauthorized API Access Attempt',
    priority: 94, zscore: 4.2, zLabel: 'High Anomaly', ttb: '~14 mins',
    desc: 'Originating from 192.168.44.12 in restricted Zone-B. Request pattern matches known SQL injection heuristics. Target: Prod-Database-01.',
    color: 'var(--red)', bg: 'var(--red-dim)',
  },
  {
    sev: 'HIGH SEVERITY', id: 'ALRT-7210-B',
    title: 'Massive Geospatial Login Anomaly',
    priority: 78, zscore: 2.9, zLabel: 'Anomaly', ttb: '~120 mins',
    desc: 'Multiple successful logins for User: Admin_JSmith from Singapore and St. Petersburg within 5 minutes. No VPN profile matched.',
    color: 'var(--orange)', bg: 'rgba(249,115,22,.12)',
  },
  {
    sev: 'CRITICAL THREAT', id: 'ALRT-4022-L',
    title: 'Privileged User Activity Anomaly',
    priority: 89, zscore: 3.8, zLabel: 'Significant', ttb: '~38 mins',
    desc: 'Unusual bulk deletion of IAM policies detected by user System_Automation_04. Elevated permissions not usually exercised.',
    color: 'var(--red)', bg: 'var(--red-dim)',
  },
  {
    sev: 'MEDIUM SEVERITY', id: 'ALRT-1194-S',
    title: 'Abnormal Outbound Data Volume',
    priority: 54, zscore: 1.8, zLabel: 'Moderate', ttb: 'N/A',
    desc: 'Workstation DEV-WS-12 is uploading 4GB of encrypted blob data to an unknown endpoint. Volume exceeds average by 450%.',
    color: 'var(--yellow)', bg: 'var(--yellow-dim)',
  },
];

const INCOMING_POOL = [
  { sev: 'CRITICAL THREAT', title: 'DNS Tunneling Detected', desc: 'Unusual volume of DNS TXT records requested from Host-77. Exfiltration vector confirmed.', color: 'var(--red)', bg: 'var(--red-dim)', zscore: 3.5, zLabel: 'High Anomaly', ttb: '~22 mins', priority: 91 },
  { sev: 'HIGH SEVERITY', title: 'Ransomware Extension Match', desc: 'File system events show multiple files renamed with known ransomware extensions (.lock, .enc) on FS-NAS-03.', color: 'var(--orange)', bg: 'rgba(249,115,22,.12)', zscore: 2.7, zLabel: 'Anomaly', ttb: '~60 mins', priority: 80 },
  { sev: 'MEDIUM SEVERITY', title: 'Failed SSH Bruteforce', desc: '500+ failed SSH login attempts on external-facing Bastion host within 2 minutes. Source IP: 110.45.201.88.', color: 'var(--yellow)', bg: 'var(--yellow-dim)', zscore: 1.5, zLabel: 'Moderate', ttb: 'N/A', priority: 55 },
  { sev: 'CRITICAL THREAT', title: 'Lateral Movement Detected', desc: 'Mimikatz signatures detected in memory of WORKSTATION-ENG-04. Credential harvesting underway.', color: 'var(--red)', bg: 'var(--red-dim)', zscore: 4.8, zLabel: 'Critical', ttb: '~8 mins', priority: 97 },
  { sev: 'HIGH SEVERITY', title: 'Cloud Storage Misconfiguration', desc: 'S3 bucket "prod-logs-exports" has been set to public-read. Contains 1.2M customer records.', color: 'var(--orange)', bg: 'rgba(249,115,22,.12)', zscore: 2.2, zLabel: 'Anomaly', ttb: '~200 mins', priority: 72 },
];

let idCounter = 5000;

function genId() {
  idCounter++;
  return 'ALRT-' + idCounter + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

export default function AlertQueue() {
  const [filter, setFilter] = useState('All');
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [queueStatus, setQueueStatus] = useState('Elevated');
  const [activeThreads, setActiveThreads] = useState(124);
  const [investigating, setInvestigating] = useState({});
  const [notification, setNotification] = useState(null);
  const notifTimer = useRef(null);

  const showNotification = (msg) => {
    if (notifTimer.current) clearTimeout(notifTimer.current);
    setNotification(msg);
    notifTimer.current = setTimeout(() => setNotification(null), 4000);
  };

  // Real-time: stream new alerts
  useEffect(() => {
    const int = setInterval(() => {
      if (Math.random() > 0.55) {
        const template = INCOMING_POOL[Math.floor(Math.random() * INCOMING_POOL.length)];
        const newAlert = { ...template, id: genId() };
        setAlerts(prev => [newAlert, ...prev].slice(0, 12));
        setActiveThreads(prev => prev + Math.floor(Math.random() * 3));

        // Show live notification
        showNotification(`🚨 New Alert: ${newAlert.title}`);
      }
    }, 7000);
    return () => clearInterval(int);
  }, []);

  // Live queue status flicker
  useEffect(() => {
    const int = setInterval(() => {
      setQueueStatus(prev => (prev === 'Elevated' ? 'Critical' : prev === 'Critical' ? 'Elevated' : 'Active'));
      setActiveThreads(prev => Math.max(50, prev + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(int);
  }, []);

  const handleInvestigate = (id) => {
    setInvestigating(prev => ({ ...prev, [id]: true }));
    showNotification(`🔍 Investigating alert ${id}...`);
    setTimeout(() => {
      setInvestigating(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setAlerts(prev => prev.filter(a => a.id !== id));
      showNotification(`✅ Alert ${id} resolved and logged.`);
    }, 2500);
  };

  const handleDismiss = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showNotification(`🗑 Alert ${id} dismissed.`);
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'All') return true;
    if (filter === 'Critical') return a.sev.includes('CRITICAL');
    if (filter === 'High') return a.sev.includes('HIGH');
    if (filter === 'Medium') return a.sev.includes('MEDIUM');
    return true;
  });

  const critCount = alerts.filter(a => a.sev.includes('CRITICAL')).length;
  const highCount = alerts.filter(a => a.sev.includes('HIGH')).length;
  const medCount = alerts.filter(a => a.sev.includes('MEDIUM')).length;

  const statusColor = queueStatus === 'Critical' ? 'var(--red)' : queueStatus === 'Elevated' ? 'var(--orange)' : 'var(--green)';
  const statusIcon = queueStatus === 'Critical' ? '🔴' : queueStatus === 'Elevated' ? '⚠' : '✅';

  return (
    <AppLayout title="Active Alert Queue" subtitle="AI-prioritized security incident queue requiring immediate intervention" bgClass="bg-gradient-threats">

      {/* Live Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 9999,
          background: 'rgba(10,15,30,0.96)', border: '1px solid rgba(16, 185, 129,0.4)',
          borderRadius: 10, padding: '12px 20px',
          color: '#fff', fontSize: 13.5, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(16, 185, 129,0.2)',
          animation: 'slideInRight .3s ease-out',
          maxWidth: 380,
        }}>
          {notification}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

        {/* Main Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 24, fontWeight: 800, color: '#fff' }}>
                {alerts.length} Active Threats
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>{critCount} CRIT</span>
                <span style={{ background: 'rgba(249,115,22,.12)', color: 'var(--orange)', border: '1px solid var(--orange)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>{highCount} HIGH</span>
                <span style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)', border: '1px solid var(--yellow)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>{medCount} MED</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['All', 'Critical', 'High', 'Medium'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="btn"
                  style={{
                    padding: '6px 16px', fontSize: 12, background: filter === f ? 'var(--blue-glow)' : 'transparent',
                    color: filter === f ? 'var(--blue-light)' : 'var(--text-secondary)',
                    border: filter === f ? '1px solid rgba(16, 185, 129,.3)' : '1px solid transparent',
                    borderRadius: 6, transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s'
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredAlerts.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                No alerts match the selected filter.
              </div>
            ) : filteredAlerts.map((a) => (
              <div key={a.id} className="card" style={{ borderLeft: `3px solid ${a.color}`, padding: '24px', animation: 'slideIn .3s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ background: a.bg, color: a.color, border: `1px solid ${a.color}44`, padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 800, letterSpacing: 0.8 }}>
                        {a.sev}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>ID: {a.id}</span>
                    </div>
                    <div style={{ fontSize: 19, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: '#fff', marginBottom: 16 }}>{a.title}</div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 18, background: 'rgba(16, 185, 129, 0.03)', padding: '14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)' }}>PRIORITY SCORE</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'Outfit,sans-serif' }}>
                          {a.priority}<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)' }}>Z-SCORE DEVIATION</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: a.color, fontFamily: 'Outfit,sans-serif' }}>
                          {a.zscore} <span style={{ fontSize: 12, color: a.color, opacity: 0.8, letterSpacing: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>{a.zLabel}</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)' }}>EST TIME-TO-BREACH</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'Outfit,sans-serif' }}>{a.ttb}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 13.5 }}>
                      <span style={{ color: a.color, marginTop: 2, fontSize: 16 }}>{a.color === 'var(--red)' ? '⚠' : a.color === 'var(--orange)' ? '📍' : '⚠️'}</span>
                      <p>{a.desc}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 24, flexShrink: 0 }}>
                    <button
                      onClick={() => handleInvestigate(a.id)}
                      className="btn btn-primary"
                      disabled={!!investigating[a.id]}
                      style={{
                        padding: '10px 24px', justifyContent: 'center', fontSize: 12,
                        opacity: investigating[a.id] ? 0.7 : 1,
                        transition: 'background-color 0.3s, border-color 0.3s, color 0.3s, fill 0.3s, stroke 0.3s, opacity 0.3s, box-shadow 0.3s, transform 0.3s'
                      }}
                    >
                      {investigating[a.id] ? '🔍 Investigating...' : 'Investigate'}
                    </button>
                    <button
                      onClick={() => handleDismiss(a.id)}
                      className="btn btn-outline"
                      style={{ padding: '8px 24px', justifyContent: 'center', fontSize: 12 }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="dot" style={{ background: 'var(--red)', boxShadow: '0 0 6px var(--red)', animation: 'pulse 1.5s infinite' }} />
                Live stream active — new alerts appear automatically
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div>
          <div className="card" style={{ padding: '20px', position: 'sticky', top: 90 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: '#fff', marginBottom: 20 }}>System Status</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'ACTIVE THREADS', val: activeThreads.toLocaleString(), c: '#fff' },
                { label: 'QUEUE STATUS', val: queueStatus, c: statusColor, icon: statusIcon },
                { label: 'AVG RESP TIME', val: '4.2m', c: '#fff' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--text-muted)' }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: s.c, display: 'flex', alignItems: 'center', gap: 6, transition: 'background-color 0.3s, border-color 0.3s, color 0.3s, fill 0.3s, stroke 0.3s, opacity 0.3s, box-shadow 0.3s, transform 0.3s' }}>
                    {s.icon && <span style={{ fontSize: 14 }}>{s.icon}</span>}{s.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Alert breakdown mini chart */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12 }}>SEVERITY BREAKDOWN</div>
              {[
                { label: 'Critical', count: critCount, color: 'var(--red)', total: alerts.length },
                { label: 'High', count: highCount, color: 'var(--orange)', total: alerts.length },
                { label: 'Medium', count: medCount, color: 'var(--yellow)', total: alerts.length },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontSize: 12, color: row.color, fontWeight: 800 }}>{row.count}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${row.total > 0 ? (row.count / row.total) * 100 : 0}%`,
                      background: row.color, borderRadius: 2, transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--blue-dim)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '20px' }}>
              <div style={{ color: 'var(--blue-light)', fontWeight: 800, fontSize: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>✨ AI Assistant</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, lineHeight: 1.6, marginBottom: 16 }}>CEREBRO AI recommends applying firewall policy <strong style={{ color: '#fff' }}>BLOCK_EXT_44</strong> to isolate Zone-B immediately.</p>
              <button
                onClick={(e) => {
                  const btn = e.currentTarget;
                  btn.textContent = '⏳ Applying...';
                  btn.disabled = true;
                  setTimeout(() => {
                    btn.textContent = '✅ Policy Executed';
                    btn.style.background = 'var(--green)';
                    btn.style.color = '#000';
                    btn.style.borderColor = 'var(--green)';
                    setTimeout(() => {
                      btn.textContent = 'Execute Policy';
                      btn.style.background = '';
                      btn.style.color = '';
                      btn.style.borderColor = '';
                      btn.disabled = false;
                    }, 3000);
                  }, 1500);
                }}
                className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, transition: 'background-color 0.3s, border-color 0.3s, color 0.3s, fill 0.3s, stroke 0.3s, opacity 0.3s, box-shadow 0.3s, transform 0.3s' }}>
                Execute Policy
              </button>
            </div>
          </div>
        </div>

      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </AppLayout>
  );
}
