import MarketingLayout from '../../components/MarketingLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ENDPOINTS = [
  { method: 'GET', path: '/v1/alerts', desc: 'List all alerts with filter support' },
  { method: 'GET', path: '/v1/alerts/{id}', desc: 'Get a specific alert by ID' },
  { method: 'PATCH', path: '/v1/alerts/{id}/status', desc: 'Update alert status (open/resolved)' },
  { method: 'GET', path: '/v1/logs', desc: 'Query ingested logs with full-text search' },
  { method: 'POST', path: '/v1/logs/query', desc: 'Execute a SQL-compatible log query' },
  { method: 'GET', path: '/v1/anomalies', desc: 'List AI-detected anomalies' },
  { method: 'GET', path: '/v1/assets', desc: 'List monitored cloud assets' },
  { method: 'GET', path: '/v1/compliance/reports', desc: 'Fetch compliance report data' },
  { method: 'POST', path: '/v1/webhooks', desc: 'Register a webhook endpoint' },
  { method: 'DELETE', path: '/v1/webhooks/{id}', desc: 'Remove a webhook endpoint' },
];

const METHOD_COLOR = { GET: '#fbbf24', POST: '#10b981', PATCH: '#f9c80e', DELETE: '#ff3b6b' };

const EXAMPLE_RESPONSE = `{
  "data": [
    {
      "id": "ALT-2024-0928-X72",
      "severity": "CRITICAL",
      "title": "Brute Force Attack Detected",
      "source_ip": "192.168.1.45",
      "target": "prod-auth-api-02",
      "ai_score": 98,
      "status": "open",
      "created_at": "2024-10-27T14:22:01Z",
      "ai_reasoning": "540 failed login attempts in 2 minutes..."
    }
  ],
  "meta": {
    "total": 128,
    "page": 1,
    "per_page": 25
  }
}`;

export default function APIReference() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);

  return (
    <MarketingLayout>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
        {/* Sidebar */}
        <aside style={{ width: 280, borderRight: '1px solid var(--border)', padding: '32px 0', flexShrink: 0, background: 'rgba(5,12,26,0.5)', position: 'sticky', top: 68, height: 'calc(100vh - 68px)', overflowY: 'auto' }}>
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>API Reference</div>
            <div style={{ background: 'rgba(0,255,163,0.1)', border: '1px solid rgba(0,255,163,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--green)' }}>
              <span style={{ fontWeight: 700 }}>Base URL:</span> <span style={{ fontFamily: 'JetBrains Mono' }}>api.sentinelx.ai/v1</span>
            </div>
          </div>
          {ENDPOINTS.map(ep => (
            <div key={ep.path} onClick={() => setSelectedEndpoint(ep)} style={{ padding: '10px 20px', cursor: 'pointer', background: selectedEndpoint.path === ep.path ? 'rgba(16, 185, 129,0.10)' : 'transparent', borderLeft: selectedEndpoint.path === ep.path ? '2px solid var(--blue)' : '2px solid transparent', transition: 'background-color .15s, border-color .15s, color .15s, fill .15s, stroke .15s, opacity .15s, box-shadow .15s, transform .15s', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: `${METHOD_COLOR[ep.method]}18`, color: METHOD_COLOR[ep.method], fontFamily: 'JetBrains Mono', letterSpacing: 0.3, flexShrink: 0 }}>{ep.method}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: selectedEndpoint.path === ep.path ? '#fff' : 'var(--text-secondary)', wordBreak: 'break-all' }}>{ep.path}</span>
            </div>
          ))}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '48px 56px', maxWidth: 900 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <span style={{ padding: '6px 14px', borderRadius: 8, background: `${METHOD_COLOR[selectedEndpoint.method]}18`, color: METHOD_COLOR[selectedEndpoint.method], fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 14 }}>{selectedEndpoint.method}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 22, color: 'var(--text-primary)', fontWeight: 600 }}>{selectedEndpoint.path}</span>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36, lineHeight: 1.7 }}>{selectedEndpoint.desc}. Returns paginated results ordered by creation time descending.</p>

          {/* Auth */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Authentication</h3>
            <div style={{ background: '#0a0e1a', border: '1px solid rgba(16, 185, 129,0.2)', borderRadius: 12, padding: '16px 20px', fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Authorization: </span>
              <span style={{ color: 'var(--blue-light)' }}>Bearer </span>
              <span style={{ color: '#f9c80e' }}>{'<YOUR_API_KEY>'}</span>
            </div>
          </div>

          {/* Parameters */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Query Parameters</h3>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              {[
                { param: 'severity', type: 'string', req: false, desc: 'Filter by severity: critical, high, medium, low' },
                { param: 'status', type: 'string', req: false, desc: 'Filter by status: open, resolved, acknowledged' },
                { param: 'from', type: 'ISO 8601', req: false, desc: 'Start of time range (e.g. 2024-10-27T00:00:00Z)' },
                { param: 'to', type: 'ISO 8601', req: false, desc: 'End of time range' },
                { param: 'page', type: 'integer', req: false, desc: 'Page number, default: 1' },
                { param: 'per_page', type: 'integer', req: false, desc: 'Results per page (max 100), default: 25' },
              ].map((p, i, arr) => (
                <div key={p.param} style={{ display: 'grid', gridTemplateColumns: '160px 80px 60px 1fr', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'start', gap: 12 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--blue-light)' }}>{p.param}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#b44fff' }}>{p.type}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{p.req ? 'required' : 'optional'}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Response */}
          <div>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Example Response</h3>
            <div style={{ background: '#0a0e1a', border: '1px solid rgba(16, 185, 129,0.2)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(16, 185, 129,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>{['#ef4444', '#f59e0b', '#10b981'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}</div>
                <span style={{ display: 'inline-flex', padding: '2px 10px', background: 'rgba(0,255,163,0.1)', color: 'var(--green)', border: '1px solid rgba(0,255,163,0.3)', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>200 OK</span>
              </div>
              <pre style={{ padding: '24px 28px', fontFamily: 'JetBrains Mono', fontSize: 12.5, color: '#c9d1d9', lineHeight: 1.9, overflowX: 'auto', margin: 0 }}>
                {EXAMPLE_RESPONSE.split('\n').map((line, i) => {
                  const colored = line
                    .replace(/"CRITICAL"|"open"/g, m => `<span style="color:#ff3b6b">${m}</span>`)
                    .replace(/(\d+)/g, m => `<span style="color:#f9c80e">${m}</span>`)
                    .replace(/"[a-z_]+":/g, m => `<span style="color:#2dd4bf">${m}</span>`)
                    .replace(/"[A-Z].*?"/g, m => `<span style="color:#a7f3d0">${m}</span>`);
                  return <span key={i} dangerouslySetInnerHTML={{ __html: colored + '\n' }} />;
                })}
              </pre>
            </div>
          </div>
        </main>
      </div>
    </MarketingLayout>
  );
}
