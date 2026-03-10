import AppLayout from '../components/AppLayout';
import { useState, useEffect, useRef } from 'react';

const PIPELINES = [
  { id: 'p1', branch: 'main', commit: 'a4f7c9b', author: 'Alex Rivera', status: 'Running', progress: 65, duration: '2m 14s', testCoverage: 94, vulns: 0, service: 'auth-service', tools: ['Jira', 'Jenkins', 'Docker'] },
  { id: 'p2', branch: 'feature/rbac', commit: '88b3f1a', author: 'Jordan Smith', status: 'Success', progress: 100, duration: '4m 30s', testCoverage: 92, vulns: 0, service: 'api-gateway', tools: ['Terraform', 'Ansible'] },
  { id: 'p3', branch: 'hotfix/cache', commit: 'd190efa', author: 'Morgan Lee', status: 'Failed', progress: 40, duration: '1m 20s', testCoverage: 88, vulns: 2, service: 'cerebro-engine', tools: ['Trivy', 'Kubernetes'] },
  { id: 'p4', branch: 'staging', commit: 'c392bba', author: 'Taylor Wong', status: 'Success', progress: 100, duration: '5m 12s', testCoverage: 96, vulns: 0, service: 'log-ingestor', tools: ['Jenkins', 'Terraform', 'K8s'] },
];

const LOG_LINES = [
  '[JENKINS] Job triggered by Jira ticket SEC-4092...',
  '[JENKINS] Checking out branch main (commit: a4f7c9b)...',
  '[ANSIBLE] Provisioning dynamic build agents...',
  '[INFO] Running unit test suite (Jest)...',
  '       ✓ 112 tests passed (4.2s)',
  '[TRIVY] Scanning source code for vulnerabilities...',
  '       ✓ 0 Critical, 0 High vulnerabilities found',
  '[DOCKER] Starting Docker build for auth-service:latest...',
  '[DOCKER] Fetching base image node:18-alpine...',
  '[DOCKER] Copied package.json and ran npm ci...',
  '[DOCKER] Image auth-service:latest built successfully.',
  '[TRIVY] Scanning container image auth-service:latest...',
  '       ✓ No known vulnerabilities in OS packages',
  '[DOCKER] Pushing image to registry.sentinelx.io...',
  '[TERRAFORM] Refreshing state for infrastructure...',
  '[TERRAFORM] State matched. No infrastructure changes required.',
  '[KUBERNETES] Generating deployment manifests via Helm...',
  '[KUBERNETES] Deploying new image to EKS Cluster (namespace: prod)...',
  '[KUBERNETES] Rolling update in progress: 2/5 pods ready...',
  '[KUBERNETES] Rolling update in progress: 4/5 pods ready...',
  '[KUBERNETES] Deployment complete. Service is healthy.',
  '[JIRA] Transitioning ticket SEC-4092 to "Done"...'
];

export default function DevOpsPipeline() {
  const [logs, setLogs] = useState([]);
  const [logIndex, setLogIndex] = useState(0);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (logIndex < LOG_LINES.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, LOG_LINES[logIndex]]);
        setLogIndex(i => i + 1);
      }, 300 + Math.random() * 800);
      return () => clearTimeout(timer);
    }
  }, [logIndex]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const STATUS_COLORS = {
    Running: '#38bdf8',
    Success: '#4ade80',
    Failed: '#f87171'
  };

  return (
    <AppLayout title="CI/CD & Deployments" subtitle="Automated pipelines, test coverage, and security gates" bgClass="bg-gradient-analytics">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        {[
          { label: 'ACTIVE BUILDS', val: '1', color: '#38bdf8' },
          { label: 'DEPLOYMENT FREQUENCY', val: '42/day', color: '#4ade80' },
          { label: 'AVG TEST COVERAGE', val: '94.2%', color: '#f59e0b' },
          { label: 'CRITICAL VULNS', val: '0', color: '#4ade80' }
        ].map(s => (
          <div key={s.label} className="metric-card" style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* Pipeline List */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(56,189,248,.03)', fontSize: 14, fontWeight: 700, color: '#fff' }}>
            Active Pipelines
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>SERVICE</th>
                <th>BRANCH / COMMIT</th>
                <th>AUTHOR</th>
                <th>COVERAGE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {PIPELINES.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div>{p.service}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {p.tools.map(t => <span key={t} style={{ fontSize: 9, background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '2px 4px', borderRadius: 4, color: 'var(--text-muted)' }}>{t}</span>)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: 'var(--blue-light)' }}>{p.branch}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', background: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>{p.commit}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.author}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: p.testCoverage + '%', height: '100%', background: p.testCoverage > 90 ? '#4ade80' : '#f59e0b' }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.testCoverage}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {p.status === 'Running' && <span style={{ width: 12, height: 12, border: '2px solid rgba(56,189,248,.3)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                      <span style={{ fontSize: 12, fontWeight: 700, color: STATUS_COLORS[p.status] }}>{p.status}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.duration}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Build Terminal */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(56,189,248,.15)', background: '#0a1120', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)' }}>Build Logs: auth-service (a4f7c9b)</div>
          </div>
          <div ref={terminalRef} style={{ padding: '20px', background: '#05080f', flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.6, overflowY: 'auto', maxHeight: 400 }}>
            {logs.map((log, i) => {
              const color = log.includes('✓') ? '#4ade80' : log.includes('ERR') || log.includes('Failed') ? '#f87171' : log.includes('JENKINS') ? '#facc15' : log.includes('DOCKER') ? '#38bdf8' : log.includes('KUBERNETES') ? '#60a5fa' : log.includes('TERRAFORM') ? '#a78bfa' : log.includes('TRIVY') ? '#4ade80' : log.includes('JIRA') ? '#3b82f6' : log.includes('ANSIBLE') ? '#ef4444' : 'var(--text-secondary)';
              return <div key={i} style={{ color, wordBreak: 'break-all', marginBottom: 4 }}>{log}</div>;
            })}
            {logIndex < LOG_LINES.length && <span style={{ display: 'inline-block', width: 8, height: 14, background: '#38bdf8', animation: 'blink 1s infinite' }} />}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </AppLayout>
  );
}
