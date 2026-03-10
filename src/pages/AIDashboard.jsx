import AppLayout from '../components/AppLayout';
import { useState, useEffect } from 'react';

const METRICS = [
  { label: 'MODEL VERSION', val: 'v3.4.2-cerebro' },
  { label: 'AVG INFERENCE LATENCY', val: '135ms', color: '#4ade80' },
  { label: 'FALSE POSITIVE RATE', val: '0.04%', color: '#38bdf8' },
  { label: 'EVENTS SCANNED (24H)', val: '1.2B', color: '#c084fc' },
];

export default function AIDashboard() {
  const [pulse, setPulse] = useState(false);
  const [stream, setStream] = useState([]);

  useEffect(() => {
    const t1 = setInterval(() => setPulse(p => !p), 1500);
    const t2 = setInterval(() => {
      const ms = Math.floor(Math.random() * 80 + 100);
      const conf = Math.floor(Math.random() * 10 + 90);
      setStream(prev => [{ id: Date.now(), ms, conf, ev: Math.floor(Math.random() * 100000) }, ...prev].slice(0, 15));
    }, 800);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <AppLayout title="CEREBRO AI Engine" subtitle="Live threat heuristic analysis and model performance" bgClass="bg-gradient-analytics">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
        {METRICS.map(m => (
          <div key={m.label} className="metric-card" style={{ padding: 24, textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: 1 }}>{m.label}</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 900, color: m.color || '#fff' }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Model Architecture Canvas */}
        <div className="card" style={{ padding: 32, height: 500, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 24, zIndex: 1 }}>Neural Pipeline Topology</h3>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 10, boxShadow: pulse ? '0 0 20px rgba(56,189,248,0.3)' : 'none', transition: 'all 0.5s' }}>🌐</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Log Ingestion<br />(Kafka)</div>
              </div>
              <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, rgba(56,189,248,0.5), rgba(192,132,252,0.5))', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -3, left: pulse ? '80%' : '10%', width: 8, height: 8, borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px #fff', transition: 'left 1s linear' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: 20, background: 'rgba(192,132,252,0.1)', border: '2px solid rgba(192,132,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 10, boxShadow: !pulse ? '0 0 30px rgba(192,132,252,0.4)' : '0 0 10px rgba(192,132,252,0.1)', transition: 'all 0.5s' }}>🧠</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#c084fc' }}>CEREBRO Engine</div>
              </div>
              <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, rgba(192,132,252,0.5), rgba(248,113,113,0.5))', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -3, left: !pulse ? '80%' : '10%', width: 8, height: 8, borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px #fff', transition: 'left 1s linear' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 10 }}>🔔</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Anomaly Alerting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Inference Stream */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(192,132,252,0.05)', fontSize: 13, fontWeight: 700, color: '#c084fc', display: 'flex', justifyContent: 'space-between' }}>
            <span>Live Inference Stream</span>
            <span style={{ fontSize: 10, background: 'rgba(192,132,252,0.2)', padding: '2px 6px', borderRadius: 4 }}>Live</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {stream.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)', animation: i === 0 ? 'slideInFeed .3s ease' : 'none' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Event ID: {s.ev}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>Scored in {s.ms}ms</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Confidence</div>
                  <div style={{ fontSize: 13, color: '#4ade80', fontWeight: 700 }}>{s.conf}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
