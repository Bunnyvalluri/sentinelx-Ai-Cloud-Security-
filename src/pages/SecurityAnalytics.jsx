import AppLayout from '../components/AppLayout';
import { useState, useEffect } from 'react';

const INITIAL_BASELINE = [15, 20, 25, 30, 40, 55, 48, 42, 35, 28, 22, 25, 30, 38, 50, 65, 70, 62, 52, 42, 35, 28, 25, 30, 40, 55, 68, 72, 65, 52];
const INITIAL_AIPREDICT = [10, 15, 18, 23, 30, 42, 38, 33, 28, 22, 17, 20, 25, 30, 40, 52, 55, 48, 40, 33, 27, 22, 18, 23, 32, 45, 55, 60, 53, 42];

const TOP_RESOURCES = [
  { name: 'us-east-1-auth-db', type: 'RDS PostgreSQL', freq: '2,842 req/hr', risk: 'CRITICAL', riskC: 'var(--red)', status: 'Shield Active', statusC: 'var(--green)' },
  { name: 'prod-api-gateway-v2', type: 'AWS API Gateway', freq: '1,924 req/hr', risk: 'HIGH', riskC: 'var(--orange)', status: 'Shield Active', statusC: 'var(--green)' },
  { name: 's3-backup-storage', type: 'AWS S3 Bucket', freq: '842 req/hr', risk: 'MEDIUM', riskC: 'var(--yellow)', status: 'Monitoring', statusC: 'var(--yellow)' },
];

const REGIONS = [
  { label: 'USA', val: 65, c: '#10b981' },
  { label: 'EMEA', val: 45, c: '#f59e0b' },
  { label: 'APAC', val: 30, c: '#f59e0b' },
  { label: 'LATAM', val: 18, c: '#10b981' },
  { label: 'OTHER', val: 8, c: '#6b7280' },
];

function SmoothLineChart({ data1, data2 }) {
  const W = 500, H = 200;
  const max = Math.max(...data1, ...data2);
  const xs = data1.map((_, i) => (i / (data1.length - 1)) * W);
  const y1 = data1.map(v => H - 20 - (v / max) * (H - 40));
  const y2 = data2.map(v => H - 20 - (v / max) * (H - 40));
  const p1 = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y1[i].toFixed(1)}`).join(' ');
  const p2 = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y2[i].toFixed(1)}`).join(' ');
  const area1 = p1 + ` L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1="0" x2={W} y1={H - 20 - f * (H - 40)} y2={H - 20 - f * (H - 40)} stroke="rgba(99,130,200,0.08)" strokeWidth="1" />
      ))}
      <path d={area1} fill="url(#sg1)" />
      <path d={p1} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={p2} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" strokeLinejoin="round" />
      {['DAY 01', 'DAY 15', 'DAY 30'].map((t, i) => (
        <text key={t} x={(i / 2) * W} y={H - 2} fontSize="10" fill="rgba(99,130,200,0.5)" textAnchor="middle">{t}</text>
      ))}
    </svg>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div style={{ display: 'flex', gap: 12, height: 100, alignItems: 'flex-end', padding: '0 8px' }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: '100%', height: `${(d.val / max) * 80}px`, background: d.c, borderRadius: '4px 4px 0 0', transition: 'height .6s ease' }} />
          <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center', letterSpacing: 0.5 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function SecurityAnalytics() {
  const [tab, setTab] = useState('24H');
  const [baselineData, setBaselineData] = useState(INITIAL_BASELINE);
  const [metrics, setMetrics] = useState([
    { label: 'TOTAL BLOCKED', val: 14284, delta: '+12%', deltaC: '#10b981', icon: '✅', c: '#fff', glow: '' },
    { label: 'ACTIVE ANOMALIES', val: 18, delta: '-5%', deltaC: '#10b981', icon: '📊', c: '#ef4444', glow: 'glow-red' },
    { label: 'AVG MITIGATE TIME', val: 4.2, delta: '-0.8m', deltaC: '#10b981', icon: '⚡', c: '#fff', glow: '', unit: 'm' },
    { label: 'NETWORK UPTIME', val: 99.99, delta: 'Stable', deltaC: '#10b981', icon: '☁', c: '#10b981', glow: 'glow-green', unit: '%' },
  ]);

  useEffect(() => {
    const int = setInterval(() => {
      // Rotate and slightly tweak baseline data
      setBaselineData(prev => {
        const next = [...prev];
        const last = next.pop();
        const newVal = Math.max(10, Math.min(80, last + (Math.random() - 0.5) * 15));
        return [Math.round(newVal), ...next];
      });

      // Jitter metrics
      setMetrics(prev => prev.map(m => {
        if (m.label === 'TOTAL BLOCKED') {
          return { ...m, val: m.val + Math.floor(Math.random() * 5) };
        }
        if (m.label === 'ACTIVE ANOMALIES') {
          return { ...m, val: Math.max(0, m.val + Math.floor(Math.random() * 3) - 1) };
        }
        return m;
      }));
    }, 2000);
    return () => clearInterval(int);
  }, []);

  return (
    <AppLayout title="Security Analytics" subtitle="Visualizing threat vectors and critical asset targeting across the infrastructure." bgClass="bg-gradient-analytics">

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 26, fontWeight: 800, color: '#fff' }}>Security Intelligence Overview</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {['24H', '7D', '30D', 'YTD'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="btn"
              style={{
                padding: '6px 14px', fontSize: 12, background: tab === t ? 'var(--blue-glow)' : 'transparent',
                color: tab === t ? 'var(--blue-light)' : 'var(--text-secondary)',
                border: tab === t ? '1px solid rgba(16, 185, 129,.3)' : '1px solid transparent',
                borderRadius: 6, transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s'
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {metrics.map(m => (
          <div className="metric-card" key={m.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</span>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: m.c, letterSpacing: -0.5, marginBottom: 8, transition: 'background-color .3s, border-color .3s, color .3s, fill .3s, stroke .3s, opacity .3s, box-shadow .3s, transform .3s' }}>
              {m.label === 'TOTAL BLOCKED' ? m.val.toLocaleString() : m.val}{m.unit || ''}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: m.deltaC }}>{m.delta} <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: 11 }}>vs last 7d</span></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Baseline Deviation */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 4 }}>Anomaly Deviation (30 Days)</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Observed traffic vs AI-predicted baseline</div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>● Traffic</span>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>- AI Baseline</span>
            </div>
          </div>
          <SmoothLineChart data1={baselineData} data2={INITIAL_AIPREDICT} />
        </div>

        {/* Global Threat Origins */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 4 }}>Attack Origins</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Identified threats by geo</div>
            </div>
            <button onClick={() => alert('Demo Mode: Feature coming soon!')} className="icon-btn" style={{ fontSize: 12, border: 'none' }}>🌍</button>
          </div>
          <BarChart data={REGIONS} />
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {REGIONS.slice(0, 3).map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: r.c }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{r.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: r.c }}>{r.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 Most Targeted */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 4 }}>Highly Targeted Assets</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Resources facing active vulnerability probes</div>
          </div>
          <button onClick={() => alert('Demo Mode: Feature coming soon!')} className="btn btn-primary" style={{ fontSize: 12 }}>View Inventory</button>
        </div>
        <table className="data-table">
          <thead><tr><th>RESOURCE NAME</th><th>RESOURCE TYPE</th><th>ATTACK FREQUENCY</th><th>RISK LEVEL</th><th>PROTECTION STATUS</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {TOP_RESOURCES.map((r, i) => (
              <tr key={i}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--blue-light)' }}>≡</div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>{r.name}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{r.type}</td>
                <td style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600 }}>{r.freq}</td>
                <td>
                  <span style={{ background: `${r.riskC}15`, color: r.riskC, border: `1px solid ${r.riskC}44`, borderRadius: 100, padding: '4px 12px', fontSize: 10, fontWeight: 800, letterSpacing: 0.8 }}>{r.risk}</span>
                </td>
                <td>
                  <span style={{ color: r.statusC, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.statusC, boxShadow: `0 0 6px ${r.statusC}` }} />{r.status}
                  </span>
                </td>
                <td><button onClick={() => alert('Demo Mode: Feature coming soon!')} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 11 }}>Analyze</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
