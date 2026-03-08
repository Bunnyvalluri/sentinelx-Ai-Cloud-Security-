import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

/* ── Live AI via Gemini (real-time streaming events) ── */
const GEMINI_KEY = 'AIzaSyA4-uJDVQj-Sh9wndsWr473MwVqpTBLndo';

const INITIAL_EVENTS = [
  { id: 'INC-901', time: '14:02:11', sev: 'INFO', col: '#10b981', type: 'System Scan', origin: 'Internal', msg: 'Initializing global scan on prod-cluster-01' },
  { id: 'INC-902', time: '14:02:15', sev: 'SUCCESS', col: '#10b981', type: 'Verification', origin: 'Global', msg: 'TLS Handshake verified for 42 nodes.' },
  { id: 'INC-903', time: '14:02:44', sev: 'CRITICAL', col: '#ef4444', type: 'Unauthorized Access', origin: '192.168.1.45', msg: 'Unauthorized access attempt via SSH. Source: RU.' },
  { id: 'INC-904', time: '14:03:02', sev: 'INFO', col: '#10b981', type: 'Policy Update', origin: 'Firewall', msg: "Rule set 'anti-bruteforce-v4' applied to firewall." },
  { id: 'INC-905', time: '14:03:10', sev: 'MEDIUM', col: '#f59e0b', type: 'Network Anomaly', origin: '10.0.1.0/24', msg: 'Elevated latency detected on subnet 10.0.1.0/24.' },
  { id: 'INC-906', time: '14:03:15', sev: 'SUCCESS', col: '#10b981', type: 'Auto-Mitigation', origin: 'System', msg: 'IP 192.168.1.45 quarantined for 24 hours.' },
  { id: 'INC-907', time: '14:04:01', sev: 'INFO', col: '#ffe066', type: 'Policy Audit', origin: 'S3-Bucket', msg: 'Access policy audit complete. 0 leaks found.' },
  { id: 'INC-908', time: '14:04:22', sev: 'INFO', col: '#10b981', type: 'Backup', origin: 'DB-Instance', msg: 'Snapshot backup created for DB-INSTANCE-A.' },
  { id: 'INC-909', time: '14:04:55', sev: 'HIGH', col: '#ef4444', type: 'File Integrity', origin: 'web-node-3', msg: 'File modification detected in /etc/passwd.' },
];

const WAVE_POINTS_TRAFFIC = [12, 18, 22, 34, 28, 42, 55, 62, 58, 48, 38, 30, 24, 19, 28, 40, 52, 61, 58, 46, 36, 30, 25, 22, 30, 42, 54, 62, 58, 49, 38, 28, 22, 30, 44, 56, 64, 59, 46, 34, 26];
const WAVE_POINTS_BLOCKED = [5, 8, 10, 16, 13, 20, 26, 30, 27, 22, 17, 13, 10, 8, 12, 18, 24, 29, 27, 22, 16, 13, 10, 8, 13, 19, 25, 30, 27, 23, 17, 12, 10, 14, 21, 27, 32, 28, 22, 16, 12];

function SVGChart({ traffic, blocked }) {
  const W = 600, H = 180;
  const maxV = Math.max(...traffic);
  const xs = traffic.map((_, i) => (i / (traffic.length - 1)) * W);
  const tYs = traffic.map(v => H - 20 - (v / maxV) * (H - 40));
  const bYs = blocked.map(v => H - 20 - (v / maxV) * (H - 40));
  const tPath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${tYs[i].toFixed(1)}`).join(' ');
  const bPath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${bYs[i].toFixed(1)}`).join(' ');
  const tArea = tPath + ` L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block' }}>
      <defs>
        <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1="0" x2={W} y1={H - 20 - f * (H - 40)} y2={H - 20 - f * (H - 40)}
          stroke="rgba(99,130,200,0.08)" strokeWidth="1" />
      ))}
      <path d={tArea} fill="url(#tGrad)" />
      <path d={tPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={bPath} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" strokeLinejoin="round" />
      {/* X labels */}
      {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'LIVE'].map((t, i) => (
        <text key={t} x={(i / 6) * W} y={H - 2} fontSize="10" fill="rgba(99,130,200,0.5)" textAnchor="middle">{t}</text>
      ))}
    </svg>
  );
}

function GeoRadar() {
  const [threats, setThreats] = useState([
    { label: 'APAC-1', rate: 402, angle: -30, dist: 0.55, color: '#ef4444' },
    { label: 'EU-EAST', rate: 318, angle: 40, dist: 0.6, color: '#f59e0b' },
    { label: 'SA-1', rate: 120, angle: 130, dist: 0.5, color: '#f97316' },
  ]);

  useEffect(() => {
    const int = setInterval(() => {
      setThreats(prev => prev.map(t => ({
        ...t,
        rate: Math.max(50, t.rate + Math.floor(Math.random() * 50 - 25)),
        angle: t.angle + (Math.random() * 4 - 2),
        dist: Math.max(0.3, Math.min(0.9, t.dist + (Math.random() * 0.06 - 0.03)))
      })));
    }, 1500);
    return () => clearInterval(int);
  }, []);

  const cx = 140, cy = 140, r = 110;
  return (
    <svg viewBox="0 0 280 280" style={{ width: '100%', height: 240, background: 'radial-gradient(circle at center, rgba(16,185,129,0.05) 0%, transparent 70%)', borderRadius: '50%' }}>
      <defs>
        <radialGradient id="radarBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 10} fill="url(#radarBg)" />
      {[0.25, 0.5, 0.75, 1].map(f => (
        <circle key={f} cx={cx} cy={cy} r={r * f} fill="none" stroke="rgba(16, 185, 129,0.2)" strokeWidth="1" strokeDasharray={f === 1 ? '' : '4 4'} />
      ))}
      {[0, 60, 120, 180, 240, 300].map(a => {
        const rad = a * Math.PI / 180;
        return <line key={a} x1={cx} y1={cy} x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)}
          stroke="rgba(16, 185, 129,0.15)" strokeWidth="1" />;
      })}
      {/* Rotating sweep */}
      <polygon points={`${cx},${cy} ${cx + r},${cy - r / 2} ${cx + r},${cy + r / 2}`} fill="url(#sweepGrad)" fillOpacity="0.1"
        style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'spin 3s linear infinite' }} />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="rgba(16, 185, 129,0.6)" strokeWidth="2"
        style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'spin 3s linear infinite' }} />
      <defs>
        <linearGradient id="sweepGrad" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="rgba(16,185,129,0)" />
          <stop offset="100%" stopColor="rgba(16,185,129,1)" />
        </linearGradient>
      </defs>
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={5} fill="#10b981" style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
      <circle cx={cx} cy={cy} r={16} fill="none" stroke="rgba(16, 185, 129,0.4)" strokeWidth="1" style={{ animation: 'pulse 2s infinite' }} />
      {/* Threat nodes */}
      {threats.map(t => {
        const rad = t.angle * Math.PI / 180;
        const x = cx + r * t.dist * Math.cos(rad);
        const y = cy + r * t.dist * Math.sin(rad);
        return (
          <g key={t.label} style={{ transition: 'background-color 1.5s ease-out, border-color 1.5s ease-out, color 1.5s ease-out, fill 1.5s ease-out, stroke 1.5s ease-out, opacity 1.5s ease-out, box-shadow 1.5s ease-out, transform 1.5s ease-out' }}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={t.color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
            <circle cx={x} cy={y} r={6} fill={t.color} opacity="0.9" style={{ filter: `drop-shadow(0 0 6px ${t.color})` }} />
            <circle cx={x} cy={y} r={14} fill={t.color} opacity="0.2" style={{ animation: 'pulse 1.5s infinite' }} />
            <rect x={x + 10} y={y - 8} width={80} height={20} fill="rgba(6,14,28,0.8)" rx={4} stroke={`rgba(255,255,255,0.1)`} />
            <text x={x + 16} y={y + 6} fontSize="10" fill="#fff" fontWeight="700" fontFamily="JetBrains Mono"><tspan fill={t.color}>{t.label}</tspan>: {t.rate}/s</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('24H');
  const [trafficData, setTrafficData] = useState(WAVE_POINTS_TRAFFIC);
  const [blockedData, setBlockedData] = useState(WAVE_POINTS_BLOCKED);

  const [liveMetrics, setLiveMetrics] = useState([
    { label: 'TOTAL THREATS', value: 1284, delta: '↑ 12%', deltaColor: '#ef4444', icon: '🔴', sub: 'vs 24h ago', barColor: '#ef4444', bar: 78, glowClass: 'glow-red' },
    { label: 'ACTIVE ALERTS', value: 42, delta: '↑ 5%', deltaColor: '#f59e0b', icon: '⚠', sub: 'Priority High', barColor: '#f59e0b', bar: 42, glowClass: 'glow-yellow' },
    { label: 'SYSTEM HEALTH', value: 99.9, delta: 'Stable', deltaColor: '#10b981', icon: '💜', sub: 'Latency 12ms', barColor: '#10b981', bar: 99, glowClass: '' },
    { label: 'BLOCKED VECTORS', value: 14500, delta: '↑ 24%', deltaColor: '#10b981', icon: '🛡', sub: 'Auto-mitigated', barColor: '#10b981', bar: 88, glowClass: 'glow-green' },
  ]);

  const handleTimeRangeChange = (t) => {
    setTimeRange(t);
    // Simulate data loading and new network flow pattern
    setTrafficData(Array.from({ length: 41 }, () => Math.floor(Math.random() * 50 + 20)));
    setBlockedData(Array.from({ length: 41 }, () => Math.floor(Math.random() * 25 + 5)));
  };

  /* Simulate live event prepend every 4s and animate metrics */
  useEffect(() => {
    const msgs = [
      { id: 'INC-910', sev: 'INFO', col: '#10b981', type: 'Packet Inspection', origin: 'vpc-prod-01', msg: 'Deep packet inspection completed on vpc-prod-01.' },
      { id: 'INC-911', sev: 'CRITICAL', col: '#ef4444', type: 'Anomalous Traffic', origin: 'lambda-fn-42', msg: 'Anomalous outbound traffic detected: 4 GB/hr.' },
      { id: 'INC-912', sev: 'INFO', col: '#10b981', type: 'Certificate Renew', origin: 'System', msg: 'Certificate renewed for *.sentinelx.ai.' },
      { id: 'INC-913', sev: 'SUCCESS', col: '#10b981', type: 'Signature Update', origin: 'Database', msg: 'Threat signature updated: DB v2024.11.27.' },
      { id: 'INC-914', sev: 'HIGH', col: '#f59e0b', type: 'Auth Failure Spikes', origin: '192.168.1.88', msg: 'Multiple failed logins against admin pane.' },
      { id: 'INC-915', sev: 'CRITICAL', col: '#ef4444', type: 'Lateral Movement', origin: 'k8s-worker-3', msg: 'Suspicious east-west traffic bypassing namespace boundaries.' },
    ];
    let i = 0;
    const id = setInterval(() => {
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const newMsg = { ...msgs[i % msgs.length], time: t, id: `INC-${Math.floor(Date.now() % 10000)}` };
      setEvents(prev => [newMsg, ...prev.slice(0, 8)]);

      // Animate Metrics
      setLiveMetrics(prev => [
        { ...prev[0], value: prev[0].value + (newMsg.sev === 'CRITICAL' || newMsg.sev === 'HIGH' ? Math.floor(Math.random() * 3 + 1) : 0), bar: Math.max(10, Math.min(100, prev[0].bar + (Math.random() * 4 - 2))) },
        { ...prev[1], value: prev[1].value + (newMsg.sev === 'HIGH' ? 1 : 0), bar: Math.max(10, Math.min(100, prev[1].bar + (Math.random() * 4 - 2))) },
        { ...prev[2], value: +(prev[2].value + (Math.random() * 0.04 - 0.02)).toFixed(2), sub: `Latency ${Math.floor(Math.random() * 8 + 8)}ms` },
        { ...prev[3], value: prev[3].value + (newMsg.sev === 'CRITICAL' || newMsg.sev === 'HIGH' ? Math.floor(Math.random() * 20 + 5) : 0) },
      ]);

      // Add slight jitter to traffic charts
      setTrafficData(prev => [...prev.slice(1), Math.floor(Math.random() * 50 + 20)]);
      setBlockedData(prev => [...prev.slice(1), Math.floor(Math.random() * 20 + 5 + (newMsg.sev === 'CRITICAL' ? 15 : 0))]);

      i++;
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const fetchAiInsight = async () => {
    setAiLoading(true);
    setAiInsight('');
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    setAiLoading(false);

    // Typewriter effect
    const fullText = 'CEREBRO AI detects elevated lateral movement reconnaissance targeting edge nodes in RU-East. Recommended action: enforce strict zero-trust subnets and issue forced password resets. Confidence: 96.4%.';
    let idx = 0;
    const typeInt = setInterval(() => {
      setAiInsight(fullText.slice(0, idx));
      idx++;
      if (idx > fullText.length) clearInterval(typeInt);
    }, 15);
  };

  useEffect(() => { fetchAiInsight(); }, []);

  return (
    <AppLayout title="Global Threat Overview" subtitle="Real-time security monitoring dashboard" bgClass="bg-gradient-security">
      {/* ── Metric cards ── */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {liveMetrics.map(m => (
          <div className={`metric-card ${m.glowClass}`} key={m.label} style={{ background: 'rgba(5, 10, 20, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</span>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, fontFamily: 'Outfit, sans-serif', letterSpacing: -1, color: '#fff', marginBottom: 6, transition: 'background-color 0.3s, border-color 0.3s, color 0.3s, fill 0.3s, stroke 0.3s, opacity 0.3s, box-shadow 0.3s, transform 0.3s' }}>
              {m.label === 'SYSTEM HEALTH' ? m.value.toFixed(1) : m.value.toLocaleString()}
              {m.label === 'SYSTEM HEALTH' && <span style={{ fontSize: 18 }}>%</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: m.deltaColor }}>{m.delta}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.sub}</span>
            </div>
            <div className="progress-bar" style={{ height: 4, background: 'rgba(255,255,255,0.05)' }}>
              <div className="progress-fill" style={{ width: `${m.bar}%`, background: m.barColor, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main charts ── */}
      <div className="dashboard-chart-row" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 18 }}>
        {/* Network Traffic chart */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#fff', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 18, background: 'var(--blue)', borderRadius: 2, display: 'inline-block' }} />
                Network Traffic Analysis
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Inbound Packets vs Blocked Threats (Real-time)</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, marginRight: 12 }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>● Traffic</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>- Blocked</span>
              </div>
              {['1H', '24H', '7D'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTimeRangeChange(t)}
                  className="btn btn-outline"
                  style={{
                    padding: '4px 12px',
                    fontSize: 11,
                    background: timeRange === t ? 'var(--blue-glow)' : '',
                    color: timeRange === t ? 'var(--blue-light)' : '',
                    borderColor: timeRange === t ? 'rgba(16, 185, 129,0.3)' : ''
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <SVGChart traffic={trafficData} blocked={blockedData} />
        </div>

        {/* Geographic Origins */}
        <div className="card" style={{ padding: '22px 20px' }}>
          <div style={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#fff', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15 }}>🌐</span> Geographic Origins
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Live Attack Vector Sources</div>
          <GeoRadar />
          <div style={{ textAlign: 'right', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 0.8 }}>TOP SOURCE</span>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>192.88.x.x</div>
          </div>
        </div>
      </div>

      {/* ── AI Insight banner ── */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 18, border: '1px solid rgba(16, 185, 129,0.3)', background: 'linear-gradient(90deg, rgba(16, 185, 129,0.08) 0%, rgba(20, 24, 38,0.4) 100%)', boxShadow: '0 0 32px rgba(16, 185, 129, 0.05) inset' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #2dd4bf)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20, boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)' }}>
            <span style={{ animation: 'pulse 2s infinite' }}>🧠</span>
          </div>
          <div style={{ flex: 1, marginTop: 2 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: '#10b981', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, background: '#10b981', borderRadius: '50%', animation: 'blink 1s infinite' }} />
              CEREBRO AI INTELLIGENCE
            </div>
            <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, fontWeight: 500, minHeight: 44 }}>
              {aiLoading ? (
                <span style={{ color: 'var(--text-muted)', animation: 'pulse 1.5s infinite' }}>Analyzing global threat surface...</span>
              ) : (
                <span>
                  {aiInsight}
                  <span style={{ display: 'inline-block', width: 4, height: 16, background: '#10b981', verticalAlign: 'middle', marginLeft: 4, animation: 'blink 1s infinite steps(1)' }} />
                </span>
              )}
            </div>
          </div>
          <button className="btn btn-outline" style={{ fontSize: 12, padding: '8px 16px', flexShrink: 0, fontWeight: 600, borderColor: 'rgba(16,185,129,0.3)', color: '#10b981', background: 'rgba(16,185,129,0.05)' }} onClick={fetchAiInsight}>
            <span style={{ display: 'inline-block', animation: aiLoading ? 'spin 1s linear infinite' : 'none' }}>⟳</span> Refresh Analysis
          </button>
        </div>
      </div>

      {/* ── Live Incident Feed ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--yellow)' }}>⚠</span> Live Incident Feed
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Critical Events Requiring Immediate Attention</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/logs?filter=critical')} className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>⚙ FILTER</button>
            <button onClick={() => {
              const element = document.createElement('a');
              const file = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
              element.href = URL.createObjectURL(file);
              element.download = 'events_export.json';
              document.body.appendChild(element);
              element.click();
            }} className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>⬇ EXPORT LOGS</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>SEVERITY</th><th>ID</th><th>THREAT TYPE</th><th>ORIGIN</th><th>TIMESTAMP</th><th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {events.map((inc) => {
                const sev = {
                  CRITICAL: { bg: 'var(--red-dim)', c: 'var(--red)', b: 'rgba(239,68,68,.3)' },
                  HIGH: { bg: 'rgba(249,115,22,.12)', c: 'var(--orange)', b: 'rgba(249,115,22,.3)' },
                  MEDIUM: { bg: 'var(--yellow-dim)', c: 'var(--yellow)', b: 'rgba(245,158,11,.3)' },
                  SUCCESS: { bg: 'var(--green-dim)', c: 'var(--green)', b: 'rgba(16,185,129,.3)' },
                  INFO: { bg: 'rgba(99,130,200,0.1)', c: '#6382c8', b: 'rgba(99,130,200,0.3)' }
                }[inc.sev] || { bg: 'rgba(255,255,255,0.05)', c: '#ccc', b: 'rgba(255,255,255,0.1)' };
                return (
                  <tr key={inc.id} style={{ animation: 'fadeIn .4s ease' }}>
                    <td><span style={{ background: sev.bg, color: sev.c, border: `1px solid ${sev.b}`, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{inc.sev}</span></td>
                    <td><span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-primary)', fontWeight: 600 }}>{inc.id}</span></td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{inc.type}</td>
                    <td><span style={{ fontFamily: 'JetBrains Mono', color: 'var(--blue-light)' }}>{inc.origin}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{inc.time}</td>
                    <td><button onClick={() => navigate('/threats')} className="btn btn-primary" style={{ padding: '5px 14px', fontSize: 12 }}>INVESTIGATE</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>{/* /table-wrapper */}
      </div>
    </AppLayout>

  );
}
