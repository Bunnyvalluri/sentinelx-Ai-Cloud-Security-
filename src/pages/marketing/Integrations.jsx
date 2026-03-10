import MarketingLayout from '../../components/MarketingLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Cloud', 'Identity & Access', 'SIEM & Logging', 'Ticketing & Chat', 'Containers', 'DevOps & IaC'];

const INTEGRATIONS = [
  { name: 'AWS', cat: 'Cloud', icon: '☁', color: '#ff9900', status: 'Native', badge: 'Popular', desc: 'CloudTrail · GuardDuty · Security Hub · Config · 40+ services' },
  { name: 'Google Cloud', cat: 'Cloud', icon: '🌐', color: '#4285f4', status: 'Native', badge: '', desc: 'Audit Logs · SCC · Cloud Armor · IAM Recommender' },
  { name: 'Azure', cat: 'Cloud', icon: '🔷', color: '#0089d6', status: 'Native', badge: '', desc: 'Monitor · Sentinel · Defender · AD · Activity Logs' },
  { name: 'Okta', cat: 'Identity & Access', icon: '🔑', color: '#007dc1', status: 'Native', badge: 'Popular', desc: 'Syslog · Identity Governance · Lifecycle · Risk APIs' },
  { name: 'Azure AD', cat: 'Identity & Access', icon: '🏢', color: '#0089d6', status: 'Native', badge: '', desc: 'Sign-in logs · Conditional Access · PIM alerts' },
  { name: 'Google WS', cat: 'Identity & Access', icon: '📧', color: '#4285f4', status: 'Native', badge: '', desc: 'Workspace Admin · Login Audit · Drive activity' },
  { name: 'HashiCorp Vault', cat: 'Identity & Access', icon: '🔐', color: '#ffca28', status: 'Native', badge: '', desc: 'Secret access audit · Dynamic credential monitoring' },
  { name: 'Splunk', cat: 'SIEM & Logging', icon: '🟢', color: '#44bc65', status: 'Native', badge: '', desc: 'Bi-directional alert sync · HEC forwarding' },
  { name: 'Datadog', cat: 'SIEM & Logging', icon: '🐶', color: '#632ca6', status: 'Native', badge: 'Popular', desc: 'Log Management · CSPM · Cloud Security' },
  { name: 'Elastic SIEM', cat: 'SIEM & Logging', icon: '⚡', color: '#00bfb3', status: 'Native', badge: '', desc: 'Elasticsearch ingest · Kibana dashboard push' },
  { name: 'Jira', cat: 'Ticketing & Chat', icon: '🎯', color: '#0052cc', status: 'Native', badge: 'Popular', desc: 'Auto-ticket creation · Status sync · SLA tracking' },
  { name: 'PagerDuty', cat: 'Ticketing & Chat', icon: '🚨', color: '#06ac38', status: 'Native', badge: '', desc: 'On-call routing · Escalation policies · Webhooks' },
  { name: 'Slack', cat: 'Ticketing & Chat', icon: '💬', color: '#4a154b', status: 'Native', badge: '', desc: 'Alert channels · Incident threads · Slash commands' },
  { name: 'ServiceNow', cat: 'Ticketing & Chat', icon: '🔧', color: '#81b5a1', status: 'Certified', badge: '', desc: 'ITSM incident sync · CMDB enrichment' },
  { name: 'Kubernetes', cat: 'Containers', icon: '⎈', color: '#326ce5', status: 'Native', badge: 'Popular', desc: 'Audit logs · RBAC analysis · Pod security · Helm scan' },
  { name: 'Docker', cat: 'Containers', icon: '🐳', color: '#2496ed', status: 'Native', badge: '', desc: 'Runtime security · Image vulnerability gating · Registry scan' },
  { name: 'GitHub', cat: 'DevOps & IaC', icon: '🐙', color: '#f0f0f0', status: 'Native', badge: '', desc: 'Code scanning · Secret detection · Actions monitoring' },
  { name: 'Terraform', cat: 'DevOps & IaC', icon: '🏗', color: '#7b42bc', status: 'Native', badge: '', desc: 'Drift detection · Infrastructure as Code mis-config scan' },
  { name: 'Jenkins', cat: 'DevOps & IaC', icon: '👷', color: '#d33833', status: 'Native', badge: 'Popular', desc: 'CI/CD pipeline security gating · Build log analysis' },
  { name: 'Ansible', cat: 'DevOps & IaC', icon: '🅰', color: '#000000', status: 'Native', badge: '', desc: 'Configuration drift monitoring · Playbook audit' },
  { name: 'Trivy', cat: 'DevOps & IaC', icon: '🛡', color: '#2dd4bf', status: 'Native', badge: '', desc: 'Vulnerability scanning for containers, config, and code' },
];

const STATUS_COLOR = {
  Native: { bg: 'rgba(0,255,163,0.1)', color: '#fbbf24', border: 'rgba(0,255,163,0.25)' },
  Certified: { bg: 'rgba(16, 185, 129,0.1)', color: '#10b981', border: 'rgba(16, 185, 129,0.25)' },
  Beta: { bg: 'rgba(249,200,14,0.1)', color: '#f9c80e', border: 'rgba(249,200,14,0.25)' },
};

export default function Integrations() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = INTEGRATIONS.filter(i =>
    (activeCategory === 'All' || i.cat === activeCategory) &&
    (search === '' || i.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <MarketingLayout>
      {/* Hero */}
      <section style={{ padding: '96px 48px 72px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: 7, background: 'rgba(16, 185, 129,0.08)', border: '1px solid rgba(16, 185, 129,0.22)', padding: '5px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, color: 'var(--blue-light)', marginBottom: 26 }}>🔌 120+ NATIVE INTEGRATIONS</div>
        <h1 className="hero-text-primary" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 64, fontWeight: 900, lineHeight: 1.08, letterSpacing: -2, marginBottom: 20, maxWidth: 780, margin: '0 auto 20px' }}>
          Connects to everything<br /><span style={{ background: 'linear-gradient(90deg,#10b981,#2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>your team already uses</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>Native API integrations — no forwarder, no agent. Deploy in under 10 minutes with zero data loss guarantees.</p>
        <div style={{ maxWidth: 440, margin: '0 auto', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input placeholder="Search integrations…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px 12px 42px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'rgba(16, 185, 129,0.5)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[{ val: '120+', label: 'Native integrations', color: '#10b981' }, { val: '< 10m', label: 'Avg. setup time', color: '#2dd4bf' }, { val: '0', label: 'Data loss guarantee', color: '#fbbf24' }, { val: '99.5%', label: 'API uptime SLA', color: '#b44fff' }].map((s, i) => (
            <div key={s.label} style={{ padding: '26px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 30, fontWeight: 900, color: s.color, marginBottom: 5 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 48px 80px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 36, alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: activeCategory === cat ? 'rgba(16, 185, 129,0.14)' : 'rgba(255,255,255,0.04)', color: activeCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)', borderBottom: activeCategory === cat ? '2px solid #10b981' : '2px solid transparent', transition: 'background-color .15s, border-color .15s, color .15s, fill .15s, stroke .15s, opacity .15s, box-shadow .15s, transform .15s' }}>{cat}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} results</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {filtered.map(int => {
            const st = STATUS_COLOR[int.status] || STATUS_COLOR.Beta;
            return (
              <div key={int.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${int.color}40`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: `${int.color}14`, border: `1px solid ${int.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{int.icon}</div>
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{int.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {int.badge && <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 7px', borderRadius: 100, background: 'rgba(249,200,14,0.12)', color: '#f9c80e', border: '1px solid rgba(249,200,14,0.25)' }}>{int.badge}</span>}
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 100, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{int.status}</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{int.desc}</div>
                <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>📂 {int.cat}</div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 15 }}>No results for "{search}" · <a href="mailto:integrations@sentinelx.ai" style={{ color: 'var(--blue-light)', fontWeight: 600 }}>Request it →</a></div>}
      </section>

      {/* CLI Setup */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '72px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <h2 className="hero-text-primary" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 40, fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>Connect your first source in under 10 minutes</h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}>Install the CLI or use the native cloud-connector wizard — no forwarder required for most integrations.</p>
            {[['1', 'Install the CLI', 'npm install -g @sentinelx/cli && sentinelx login'], ['2', 'Connect AWS', 'sentinelx integrate aws --account-id 123456789012'], ['3', 'Verify & monitor', 'sentinelx status  →  Events/hr: 142,830  ✓']].map(([n, t, d]) => (
              <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#2dd4bf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000', flexShrink: 0 }}>{n}</div>
                <div><div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontSize: 14 }}>{t}</div><code style={{ fontFamily: 'JetBrains Mono', fontSize: 11.5, color: '#2dd4bf', background: 'rgba(0,229,255,0.06)', padding: '3px 8px', borderRadius: 5 }}>{d}</code></div>
              </div>
            ))}
            <Link to="/docs"><button onClick={() => alert('Demo Mode: Feature coming soon!')} style={{ marginTop: 8, background: 'linear-gradient(135deg,#10b981,#0f766e)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>View Full Setup Guide →</button></Link>
          </div>
          <div style={{ background: '#070d1a', border: '1px solid rgba(16, 185, 129,0.22)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ background: '#0c1628', padding: '12px 18px', borderBottom: '1px solid rgba(16, 185, 129,0.1)', display: 'flex', gap: 6, alignItems: 'center' }}>
              {['#ef4444', '#f59e0b', '#10b981'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>sentinelx — zsh</span>
            </div>
            <div style={{ padding: '22px', fontFamily: 'JetBrains Mono', fontSize: 12.5, lineHeight: 1.9 }}>
              {[['$ ', 'npm install -g @sentinelx/cli', '#2dd4bf'], ['', 'added 1 package in 3.1s', '#8fa3c0'], ['$ ', 'sentinelx login', '#2dd4bf'], ['✓ ', 'Authenticated as alex@acmecorp.com', '#fbbf24'], ['$ ', 'sentinelx integrate aws --account-id 12345', '#2dd4bf'], ['✓ ', 'CloudTrail enabled (us-east-1, eu-west-1)', '#fbbf24'], ['✓ ', 'Events/hr: 142,830  |  Latency: 1.2s', '#fbbf24'], ['✓ ', 'CEREBRO AI baseline started', '#10b981']].map(([p, t, c]) => (
                <div key={t} style={{ display: 'flex' }}><span style={{ color: 'var(--text-muted)', minWidth: 18 }}>{p}</span><span style={{ color: c }}>{t}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 48px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="hero-text-primary" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 38, fontWeight: 900, marginBottom: 14 }}>Don't see your tool?</h2>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>We add integrations every sprint. Submit a request and our team evaluates it for the next release cycle.</p>
        <a href="mailto:integrations@sentinelx.ai"><button onClick={() => alert('Demo Mode: Feature coming soon!')} style={{ background: 'linear-gradient(135deg,#10b981,#0f766e)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(16, 185, 129,0.3)' }}>Request an Integration →</button></a>
      </section>
    </MarketingLayout>
  );
}
