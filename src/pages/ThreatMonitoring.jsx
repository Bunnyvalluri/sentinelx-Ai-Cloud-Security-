import AppLayout from '../components/AppLayout';
import { useState, useEffect } from 'react';

const INITIAL_ALERTS = [
  { sev: 'CRITICAL', ts: '14:22:01.402', src: '192.168.1.105', def: 'SQL Injection Pattern Match', sub: '/api/v1/auth', score: 92, status: 'OPEN' },
  { sev: 'WARNING', ts: '14:15:30.911', src: 'S3-Prod-Storage', def: 'Unauthorized IAM Action', sub: 'sts:AssumeRole', score: 88, status: 'INVESTIGATING' },
  { sev: 'CRITICAL', ts: '14:10:12.112', src: 'auth-svc-node-02', def: 'Brute Force Detected', sub: 'user:admin_01', score: 76, status: 'OPEN' },
  { sev: 'INFO', ts: '13:55:44.201', src: '10.0.0.45', def: 'Lateral Movement Check', sub: 'Internal Scanning', score: 82, status: 'RESOLVED' },
  { sev: 'INFO', ts: '13:48:22.000', src: 'lambda-edge-node', def: 'API Rate Limit Threshold', sub: 'Quota: 85%', score: 45, status: 'RESOLVED' },
];

const SEV_STYLE = {
  CRITICAL: { bg: 'var(--red-dim)', c: '#ef4444', b: 'rgba(239,68,68,.3)' },
  WARNING: { bg: 'var(--yellow-dim)', c: '#f59e0b', b: 'rgba(245,158,11,.3)' },
  INFO: { bg: 'rgba(45, 212, 191, 0.1)', c: '#2dd4bf', b: 'rgba(45, 212, 191,.3)' },
};

function generateWave(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 50) + 10);
}

export default function ThreatMonitoring() {
  const [filter, setFilter] = useState('All');
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [velTime, setVelTime] = useState('24H');
  const [velData, setVelData] = useState([8, 12, 16, 24, 30, 36, 28, 22, 18, 14, 20, 28, 36, 44, 50, 47, 40, 34, 28, 24, 30, 40, 50, 56, 52, 44, 36, 28, 22, 28, 38, 50, 58, 54, 46, 38, 30, 24, 30, 40, 50]);
  const [selectedAlertIdx, setSelectedAlertIdx] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const defs = ['DDoS Attempt (Layer 7)', 'Malware Signature (RATS)', 'Advanced Persistent Threat', 'Data Exfiltration (DNS)', 'Privilege Escalation'];
      const current = new Date();
      const newAlert = {
        sev: Math.random() > 0.8 ? 'CRITICAL' : (Math.random() > 0.4 ? 'WARNING' : 'INFO'),
        ts: `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}:${String(current.getSeconds()).padStart(2, '0')}.${String(current.getMilliseconds()).padStart(3, '0')}`,
        src: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        def: defs[Math.floor(Math.random() * defs.length)],
        sub: 'Auto-detected by AI Core',
        score: Math.floor(Math.random() * 40) + 60,
        status: 'OPEN'
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleTimeChange = (t) => {
    setVelTime(t);
    setVelData(generateWave(41));
  };

  const filteredAlerts = alerts
    .filter(a => filter === 'All' || (filter === 'Active' && a.status !== 'RESOLVED'))
    .sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);

  const totalPages = Math.ceil(filteredAlerts.length / 5) || 1;
  const safePage = Math.min(page, totalPages);
  const paginatedAlerts = filteredAlerts.slice((safePage - 1) * 5, safePage * 5);

  const selectedAlert = filteredAlerts[selectedAlertIdx] || filteredAlerts[0] || null;

  const handleAction = (actionType) => {
    if (!selectedAlert) return;
    setAlerts(prev => prev.map(a =>
      a === selectedAlert ? { ...a, status: actionType === 'QUARANTINE' ? 'RESOLVED' : 'INVESTIGATING' } : a
    ));
    if (actionType === 'QUARANTINE') {
      setToast(`Quarantine signal sent to endpoint ${selectedAlert.src}`);
    } else {
      setToast(`Initiating deep packet inspection pipeline for ${selectedAlert.src}`);
    }
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <AppLayout title="Engineering Hub / Threat Monitoring" subtitle="Real-time threat detection and alerting" bgClass="bg-gradient-threats">
      {/* Metrics */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'LOGS INGESTED', value: '1.24 BILLION', delta: '+12%', deltaC: '#10b981', sub: '', barC: '#10b981', bar: 82 },
          { label: 'ACTIVE ANOMALIES', value: alerts.filter(a => a.status !== 'RESOLVED').length.toString(), delta: 'CRITICAL', deltaC: '#ef4444', sub: 'DETECTION EVENTS', barC: '#ef4444', bar: Math.min(100, alerts.filter(a => a.status !== 'RESOLVED').length * 2) },
          { label: 'AVG THREAT SCORE', value: '74.2 / 100', delta: 'HIGH', deltaC: '#f59e0b', sub: '', barC: '#f59e0b', bar: 74 },
          { label: 'LATENCY (P99)', value: '184 ms', delta: 'STABLE', deltaC: '#ffe066', sub: '', barC: '#ffe066', bar: 30 },
        ].map(m => (
          <div className="metric-card" key={m.label} style={{ background: 'rgba(5, 10, 20, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '24px', transition: 'transform 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: m.deltaC }}>{m.delta}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: '#fff', letterSpacing: -0.5, marginBottom: 6 }}>{m.value}</div>
            {m.sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>{m.sub}</div>}
            <div className="progress-bar" style={{ height: 4, marginTop: 10, background: 'rgba(255,255,255,0.05)' }}>
              <div className="progress-fill" style={{ width: `${m.bar}%`, background: m.barC, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Alert Queue + AI Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 18 }}>
        {/* Alert Queue */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 3, height: 18, background: 'var(--red)', borderRadius: 2, display: 'inline-block' }} />
              <span style={{ fontWeight: 700, fontFamily: 'Outfit,sans-serif', color: '#fff', fontSize: 15 }}>REAL-TIME ALERT QUEUE</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Active'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                  className="btn btn-outline"
                  style={{ padding: '4px 14px', fontSize: 12, background: filter === f ? 'var(--blue-glow)' : '', color: filter === f ? 'var(--blue-light)' : '' }}>
                  {f}
                </button>
              ))}
              <button onClick={() => setSortAsc(!sortAsc)} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: 14 }}>⇅</button>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>SEVERITY</th><th>TIMESTAMP</th><th>SOURCE (CIDR/HOST)</th>
                <th>EVENT DEFINITION</th><th>SCORE</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.map((a, i) => {
                const s = SEV_STYLE[a.sev] || SEV_STYLE['INFO'];
                const statC = { OPEN: '#ef4444', INVESTIGATING: '#f59e0b', RESOLVED: '#10b981' }[a.status] || '#10b981';
                const actualIndex = filteredAlerts.findIndex(f => f === a);
                const isSelected = selectedAlertIdx === actualIndex;
                return (
                  <tr key={a.ts + i} onClick={() => setSelectedAlertIdx(actualIndex)} style={{ cursor: 'pointer', background: isSelected ? 'rgba(255,255,255,0.04)' : '' }}>
                    <td>
                      <span style={{ background: s.bg, color: s.c, border: `1px solid ${s.b}`, padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700 }}>{a.sev}</span>
                    </td>
                    <td><span className="tag" style={{ color: 'var(--text-muted)', fontSize: 11 }}>{a.ts}</span></td>
                    <td><span style={{ fontFamily: 'JetBrains Mono', color: 'var(--blue-light)', fontSize: 12 }}>{a.src}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{a.def}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.sub}</div>
                    </td>
                    <td>
                      <span style={{ background: a.score >= 80 ? 'var(--red-dim)' : 'var(--yellow-dim)', color: a.score >= 80 ? 'var(--red)' : 'var(--yellow)', border: `1px solid ${a.score >= 80 ? 'rgba(239,68,68,.3)' : 'rgba(245,158,11,.3)'}`, padding: '2px 10px', borderRadius: 6, fontWeight: 700, fontSize: 13, display: 'inline-block' }}>
                        {a.score}
                      </span>
                    </td>
                    <td>
                      <span style={{ background: `${statC}15`, color: statC, border: `1px solid ${statC}40`, padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700 }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {paginatedAlerts.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No alerts found in this view.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', alignItems: 'center' }}>
            <span>Showing {(safePage - 1) * 5 + 1} to {Math.min(safePage * 5, filteredAlerts.length)} of {filteredAlerts.length} alerts</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <span onClick={() => setPage(p => Math.max(1, p - 1))} style={{ cursor: 'pointer', color: safePage > 1 ? 'var(--blue-light)' : 'var(--text-secondary)' }}>PREVIOUS</span>
              <span onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{ cursor: 'pointer', color: safePage < totalPages ? 'var(--blue-light)' : 'var(--text-secondary)' }}>NEXT</span>
            </div>
          </div>
        </div>

        {/* AI Reasoning Panel */}
        <div className="card" style={{ padding: '24px', border: '1px solid rgba(16, 185, 129,0.2)', background: 'linear-gradient(180deg, rgba(16, 185, 129,0.05) 0%, rgba(20, 24, 38,0.4) 100%)', boxShadow: '0 0 32px rgba(16, 185, 129, 0.05) inset' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: '#10b981', letterSpacing: 1 }}>
            <span style={{ fontSize: 18, animation: 'pulse 2s infinite' }}>🧠</span> CEREBRO AI REASONING
          </div>
          {selectedAlert ? (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase' }}>DETECTION CONTEXT</span>
                <span style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 100, padding: '2px 10px', fontSize: 10, fontWeight: 800 }}>{selectedAlert.score}% CONF</span>
              </div>
              <div className="code-block" style={{ marginBottom: 16, fontSize: 11, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 14 }}>
                <div><span style={{ color: '#2dd4bf', fontWeight: 600 }}># {selectedAlert.def}:</span></div>
                <div style={{ color: 'var(--text-secondary)' }}>Src:     {selectedAlert.src}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Time:    {selectedAlert.ts}</div>
                <div><span style={{ color: '#ef4444', fontWeight: 600 }}>Action:  {selectedAlert.sub}</span></div>
              </div>

              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>PROBABILITY BREAKDOWN</div>
              {[
                { label: 'Anomaly Signature', val: Math.min(99, selectedAlert.score + 12), c: '#2dd4bf' },
                { label: 'History Deviation', val: Math.max(10, selectedAlert.score - 15), c: '#f59e0b' }
              ].map(p => (
                <div key={p.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{p.label}</span>
                    <span style={{ fontWeight: 800, color: '#fff' }}>{p.val}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 4, background: 'rgba(255,255,255,0.05)' }}>
                    <div className="progress-fill" style={{ width: `${p.val}%`, background: p.c, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </div>
                </div>
              ))}

              <button onClick={() => handleAction('QUARANTINE')} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', marginTop: 20, fontSize: 13, padding: '12px', opacity: selectedAlert.status === 'RESOLVED' ? 0.5 : 1 }}>
                {selectedAlert.status === 'RESOLVED' ? '✓ RESOLVED' : '🚫 QUARANTINE ASSET'}
              </button>
              <button onClick={() => handleAction('INSPECT')} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontSize: 13, padding: '12px' }}>
                🔍 INSPECT TRAFFIC
              </button>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Select an alert to view AI reasoning.</div>
          )}

          {/* Global heatmap */}
          <div style={{ marginTop: 24, background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, textAlign: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 8 }}>GLOBAL THREAT HEATMAP</div>
            <div style={{ fontSize: 9, color: '#10b981', letterSpacing: 1, fontWeight: 600 }}>LIVE GEOSPATIAL NODE STREAM</div>
            <svg viewBox="0 0 200 100" style={{ width: '100%', height: 60, marginTop: 12 }}>
              <rect width="200" height="100" fill="rgba(255,255,255,0.01)" rx="6" />
              {[20, 40, 60, 80].map(y => <line key={`y${y}`} x1="0" x2="200" y1={y} y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />)}
              {[40, 80, 120, 160].map(x => <line key={`x${x}`} x1={x} x2={x} y1="0" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />)}
              {[[30, 40, '#ef4444'], [120, 55, '#10b981'], [160, 35, '#f59e0b'], [80, 60, '#10b981'], [140, 20, '#2dd4bf'], [50, 70, '#f97316']].map(([x, y, c], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="2.5" fill={c} opacity="0.9" />
                  <circle cx={x} cy={y} r="8" fill={c} opacity="0.2">
                    <animate attributeName="r" values="6;16;6" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Threat Velocity Chart */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontWeight: 700, fontFamily: 'Outfit,sans-serif', color: '#fff', fontSize: 15 }}>THREAT VELOCITY ({velTime})</span>
            <span style={{ marginLeft: 16, color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>EPS: {14.2 + (alerts.length % 5)}k</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['1H', '24H', '7D'].map((t) => (
              <button onClick={() => handleTimeChange(t)} key={t} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 11, background: velTime === t ? 'var(--blue-glow)' : '', color: velTime === t ? 'var(--blue-light)' : '' }}>{t}</button>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 600 80" style={{ width: '100%', height: 80, transition: 'background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease, fill 0.5s ease, stroke 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease, transform 0.5s ease' }}>
          <defs>
            <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe066" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const max = Math.max(...velData, 1);
            const W = 600;
            const xs = velData.map((_, i) => (i / (velData.length - 1)) * W);
            const ys = velData.map(v => 70 - (v / max) * 60);
            const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
            const area = path + ` L${W},70 L0,70 Z`;
            return (<>
              <path d={area} fill="url(#velGrad)" style={{ transition: 'd 0.5s ease' }} />
              <path d={path} fill="none" stroke="#ffe066" strokeWidth="2" strokeLinejoin="round" style={{ transition: 'd 0.5s ease' }} />
            </>);
          })()}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          {velTime === '1H' ? ['00', '15', '30', '45', 'NOW'].map(t => <span key={t}>{t} mins</span>) : null}
          {velTime === '24H' ? ['00:00', '06:00', '12:00', '18:00', 'NOW'].map(t => <span key={t}>{t}</span>) : null}
          {velTime === '7D' ? ['Mon', 'Tue', 'Wed', 'Thu', 'NOW'].map(t => <span key={t}>{t}</span>) : null}
        </div>
      </div>
      {toast && (
        <div style={{ position: 'fixed', bottom: 30, right: 30, background: 'rgba(20,20,30,0.95)', border: '1px solid var(--blue)', boxShadow: '0 8px 32px rgba(0,229,255,0.2)', color: '#fff', padding: '16px 24px', borderRadius: 8, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Outfit, sans-serif', fontSize: 13, animation: 'slideInRight 0.3s ease-out' }}>
          <span style={{ color: 'var(--blue-light)', fontSize: 18 }}>✓</span>
          {toast}
        </div>
      )}
    </AppLayout>
  );
}
