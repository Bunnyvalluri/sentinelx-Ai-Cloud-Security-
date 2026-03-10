import MarketingLayout from '../../components/MarketingLayout';
import { Link } from 'react-router-dom';

const QUARTERS = [
  {
    q: 'Q1 2024', status: 'shipped', label: 'SHIPPED',
    items: [
      { title: 'CEREBRO AI v2.0 — Behavioral Graph Engine', desc: 'Full re-architecture of the anomaly detection layer; 7-day behavioral baseline with entity-level probabilistic scoring.', tags: ['AI', 'Detection'] },
      { title: 'Multi-Cloud Log Pipeline v2', desc: 'Native ingestion for AWS CloudTrail, GCP Audit Logs, and Azure Monitor — zero forwarder required.', tags: ['Cloud', 'Ingestion'] },
      { title: 'SOC2 Type II Compliance Module', desc: 'Auto-mapped controls, one-click audit report generation, and continuous compliance score.', tags: ['Compliance'] },
    ],
  },
  {
    q: 'Q2 2024', status: 'shipped', label: 'SHIPPED',
    items: [
      { title: 'Forensic Investigation Suite', desc: 'Full incident timeline replay, cross-source identity resolution, and tamper-evident evidence export.', tags: ['Forensics'] },
      { title: 'Auto-Remediation Playbook Builder', desc: 'No-code playbook editor with 40 pre-built actions: revoke credentials, isolate endpoint, update firewall.', tags: ['SOAR', 'Automation'] },
      { title: 'SQL Log Query Engine', desc: 'Full-text and SQL-compatible queries across 90 days of logs with sub-2-second result times.', tags: ['Logs', 'Query'] },
    ],
  },
  {
    q: 'Q3 2024', status: 'shipped', label: 'SHIPPED',
    items: [
      { title: 'Identity Risk Scoring (UEBA)', desc: 'Continuous risk score per human and machine identity with ghost account detection and OAuth scope analysis.', tags: ['Identity', 'UEBA'] },
      { title: 'CSPM: 1,400+ Configuration Checks', desc: 'Cloud Security Posture Management running every 5 minutes with one-click Terraform remediation generation.', tags: ['CSPM', 'Cloud'] },
      { title: 'Jira, PagerDuty & Slack Native Integrations', desc: 'Bi-directional ticket sync, on-call routing, and contextual alert threads with full incident history.', tags: ['Integrations'] },
    ],
  },
  {
    q: 'Q4 2024', status: 'in-progress', label: 'IN PROGRESS',
    items: [
      { title: 'CEREBRO AI v3.0 — Neural Threat Engine', desc: 'Third-generation neural detection model trained on 10TB of real-world attack data with explainable AI output on every alert.', tags: ['AI', '🔥 Major Release'] },
      { title: 'Public API v2 + Terraform Provider', desc: 'Full GraphQL API with Terraform provider for policy-as-code detection rule management.', tags: ['API', 'DevOps'] },
      { title: 'GDPR & HIPAA Compliance Modules', desc: 'Dedicated compliance scoring, data residency controls, and automated DPA evidence generation.', tags: ['Compliance'] },
    ],
  },
  {
    q: 'Q1 2025', status: 'planned', label: 'PLANNED',
    items: [
      { title: 'AI-Guided Threat Hunting', desc: 'Guided hunt workflows that surface emerging TTPs from your own environment based on global threat intelligence correlation.', tags: ['AI', 'Hunting', '🚀 Coming Soon'] },
      { title: 'Runtime Container Security (eBPF)', desc: 'Kernel-level container runtime monitoring using eBPF — zero performance overhead, no sidecar required.', tags: ['Containers', 'Runtime'] },
      { title: 'SentinelX Mobile: iOS & Android', desc: 'Mobile-first incident management, live alert triage, and on-call acknowledgement from any device.', tags: ['Mobile'] },
      { title: 'SaaS Security Posture Management', desc: 'Deep configuration assessment for Salesforce, GitHub, Workday, and Zoom — beyond OAuth scope analysis.', tags: ['SSPM', 'SaaS'] },
    ],
  },
];

const STATUS_STYLE = {
  shipped: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.25)', dot: '#10b981' },
  'in-progress': { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.25)', dot: '#fbbf24' },
  planned: { bg: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)', border: 'rgba(255,255,255,0.1)', dot: '#556' },
};

export default function Roadmap() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section style={{ padding: '96px 48px 72px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: 7, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', padding: '5px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, color: 'var(--blue)', marginBottom: 26 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          PUBLIC ROADMAP
        </div>
        <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 64, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.08, letterSpacing: -2, marginBottom: 20 }}>
          Built with your team.<br /><span style={{ background: 'linear-gradient(90deg,#10b981,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Shipped for your team.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.75 }}>
          Our roadmap is 100% public. Every item here came directly from customer feedback or our security research team. Ship request? Vote on GitHub Discussions.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ label: '● Shipped', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
          { label: '● In Progress', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' },
          { label: '● Planned', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' }].map(b => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 7, background: b.bg, border: `1px solid ${b.border}`, borderRadius: 100, padding: '6px 16px', fontSize: 13, fontWeight: 600, color: b.color }}>{b.label}</div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 88px', position: 'relative' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 148, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, var(--border), transparent)', zIndex: 0 }} />

        {QUARTERS.map((quarter, qi) => {
          const st = STATUS_STYLE[quarter.status];
          return (
            <div key={qi} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 42, marginBottom: 64, position: 'relative', zIndex: 1 }}>
              {/* Quarter label */}
              <div style={{ textAlign: 'right', paddingTop: 16 }}>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{quarter.q}</div>
                <div style={{ display: 'inline-flex', marginTop: 8, alignItems: 'center', gap: 5, background: st.bg, border: `1px solid ${st.border}`, borderRadius: 100, padding: '3px 10px', fontSize: 9, fontWeight: 800, color: st.color, letterSpacing: 0.5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />{quarter.label}
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 40 }}>
                {quarter.items.map((item, ii) => (
                  <div key={ii} style={{ background: quarter.status === 'in-progress' ? 'linear-gradient(135deg,rgba(251,191,36,0.08),var(--bg-card))' : 'var(--bg-card)', border: `1px solid ${quarter.status === 'in-progress' ? 'rgba(251,191,36,0.28)' : 'var(--border)'}`, borderRadius: 14, padding: '22px 24px', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${st.dot}50`; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = quarter.status === 'in-progress' ? 'rgba(251,191,36,0.28)' : 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1 }}>{item.title}</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 0 }}>
                        {item.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 100, background: tag.includes('🔥') || tag.includes('🚀') ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.07)', color: tag.includes('🔥') || tag.includes('🚀') ? '#fbbf24' : 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Feature request CTA */}
      <section style={{ margin: '0 48px 80px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 22, padding: '64px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>💡</div>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 14 }}>Have a feature request?</h2>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.7 }}>We build what our customers need. Upvote existing requests or submit new ones — the top requests ship next quarter.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://github.com/sentinelx/feedback/discussions" target="_blank" rel="noreferrer">
            <button className="btn btn-primary px-8 py-3 text-base" onClick={() => alert('Demo Mode: Feature coming soon!')}>Submit a Request on GitHub →</button>
          </a>
          <Link to="/contact">
            <button className="btn btn-outline px-8 py-3 text-base" onClick={() => alert('Demo Mode: Feature coming soon!')}>Talk to Our Product Team</button>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
