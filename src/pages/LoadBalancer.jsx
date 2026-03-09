import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';

const generateNodes = (count, baseId, errorRate = 0.05) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${baseId}-${i + 1}`,
    status: Math.random() < errorRate ? 'error' : (Math.random() < 0.1 ? 'warn' : 'healthy'),
    latency: Math.floor(Math.random() * 80 + 10),
    cpu: Math.floor(Math.random() * 60 + 20),
  }));
};

export default function LoadBalancer() {
  const [extNodes, setExtNodes] = useState(() => generateNodes(12, 'edge-node'));
  const [intNodes, setIntNodes] = useState(() => generateNodes(24, 'core-svc'));
  const [extTraffic, setExtTraffic] = useState(24500);
  const [intTraffic, setIntTraffic] = useState(89200);

  // Animate node states to simulate live traffic
  useEffect(() => {
    const extInterval = setInterval(() => {
      setExtNodes(generateNodes(12, 'edge-node', 0.08));
      setExtTraffic(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 500));
    }, 3000);

    const intInterval = setInterval(() => {
      setIntNodes(generateNodes(24, 'core-svc', 0.03));
      setIntTraffic(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 1500));
    }, 2000);

    return () => { clearInterval(extInterval); clearInterval(intInterval); };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'var(--green)';
      case 'warn': return 'var(--yellow)';
      case 'error': return 'var(--red)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy': return 'var(--green-dim)';
      case 'warn': return 'var(--yellow-dim)';
      case 'error': return 'var(--red-dim)';
      default: return 'rgba(255,255,255,0.05)';
    }
  };

  const LBPanel = ({ title, type, nodes, traffic, maxReq, latency }) => {
    const healthyCount = nodes.filter(n => n.status === 'healthy').length;
    const errorCount = nodes.filter(n => n.status === 'error').length;
    const healthPercent = Math.round((healthyCount / nodes.length) * 100);

    return (
      <div className="card" style={{ padding: '24px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ padding: '6px 8px', background: type === 'external' ? 'var(--blue-dim)' : 'var(--purple-glow)', color: type === 'external' ? 'var(--blue-light)' : '#d946ef', borderRadius: 6, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                {type.toUpperCase()} ALB
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{title}</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {type === 'external' ? 'Routing internet traffic to edge proxies (WAF attached).' : 'Routing east-west microservice RPC traffic.'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>
              {(traffic / 1000).toFixed(1)}k <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>RPS</span>
            </div>
            <div style={{ fontSize: 12, color: healthPercent > 90 ? 'var(--green)' : 'var(--yellow)', fontWeight: 600 }}>
              {healthPercent}% Cluster Health
            </div>
          </div>
        </div>

        {/* Top-line metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>P99 LATENCY</div>
            <div style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{latency}ms</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>THROUGHPUT</div>
            <div style={{ fontSize: 18, color: 'var(--blue-light)', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{(traffic * 2.4 / 1000).toFixed(1)} GB/s</div>
          </div>
          <div style={{ background: errorCount > 0 ? 'var(--red-dim)' : 'var(--green-dim)', border: `1px solid ${errorCount > 0 ? 'var(--red-glow)' : 'var(--green-glow)'}`, borderRadius: 8, padding: '12px' }}>
            <div style={{ fontSize: 10, color: errorCount > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>FAILED NODES</div>
            <div style={{ fontSize: 18, color: errorCount > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{errorCount}</div>
          </div>
        </div>

        {/* Node Matrix */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>TARGET GROUP MATRIX</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
          {nodes.map(node => (
            <div key={node.id} style={{
              background: getStatusBg(node.status),
              border: `1px solid ${getStatusColor(node.status)}40`,
              borderRadius: 6,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)', fontWeight: 600 }}>{node.id}</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: getStatusColor(node.status), boxShadow: `0 0 6px ${getStatusColor(node.status)}` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                <span>CPU <span style={{ color: node.cpu > 70 ? 'var(--yellow)' : 'var(--text-secondary)' }}>{node.cpu}%</span></span>
                <span>{node.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AppLayout
      title="Load Balancer Matrix"
      subtitle="Real-time traffic routing & node health via Application Load Balancers"
      bgClass="bg-gradient-compliance"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Global Topology Summary */}
        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(9,9,13,0.95), rgba(20,20,30,0.95))' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, var(--blue-glow) 0%, transparent 60%)', opacity: 0.5, pointerEvents: 'none' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--blue-light)' }}>⟿</span> Traffic Flow Topology
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Frontend SSL Offload</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>ext-alb-prod.us-east-1.elb.amazonaws.com</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Rules</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>12 Header Match, 4 Path Traversal</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>WAF Association</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>✓ SentinelX Shield (Strict Mode)</div>
            </div>
          </div>
        </div>

        {/* LBs */}
        <div style={{ display: 'flex', gap: 24, flexDirection: 'column' }}>
          <LBPanel
            title="External Ingress (ALB-01)"
            type="external"
            nodes={extNodes}
            traffic={extTraffic}
            latency={42}
          />
          <LBPanel
            title="Internal Service Mesh (NLB-Core)"
            type="internal"
            nodes={intNodes}
            traffic={intTraffic}
            latency={8}
          />
        </div>

      </div>
    </AppLayout>
  );
}
