import MarketingLayout from '../../components/MarketingLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ────────────────────────────────────────────────────────────────────── */
/*  DATA                                                                  */
/* ────────────────────────────────────────────────────────────────────── */
const STATS = [
  { val: '1.2B+', label: 'Events / hour', color: '#10b981' },
  { val: '< 200ms', label: 'Detection latency', color: '#fbbf24' },
  { val: '99.99%', label: 'Platform SLA', color: '#22d3ee' },
  { val: '87%', label: 'False-positive reduction', color: '#f59e0b' },
  { val: '120+', label: 'Native integrations', color: '#f59e0b' },
  { val: '3,000+', label: 'Enterprise customers', color: '#f97316' },
];

/* six capability tabs */
const TABS = [
  'AI Detection',
  'Log Intelligence',
  'Cloud Posture',
  'Compliance',
  'Forensics',
  'Identity',
];

const TAB_DETAILS = {
  'AI Detection': {
    headline: 'Neural anomaly detection that learns your environment',
    body: 'CEREBRO AI ingests every user action, API call, network flow, and configuration change across your multi-cloud footprint. Over 7 days it constructs a probabilistic behavioral graph of "normal." From day 8 onward every event is scored in real time — sub-200ms — against that baseline. The result is alerts your Tier 1 analysts actually trust, with an 87% reduction in false positives vs rule-based SIEMs.',
    bullets: [
      'Unsupervised ML — no rules, no tuning required',
      'Explainable AI: plain-English reason attached to every alert',
      'Automatic re-baselining after deployments, migrations, and mergers',
      'Lateral movement chain detection across unrelated log sources',
      'Zero-day coverage — detects novel TTPs with no prior signature',
    ],
    badge: { label: 'CEREBRO AI v3.0', color: '#10b981' },
    console: [
      { prefix: 'sentinel >', cmd: 'anomaly scan --realtime --env prod', color: '#fbbf24' },
      { prefix: '  ↳ scoring', cmd: '142,830 events… [OK]', color: '#8fa3c0' },
      { prefix: '  ✗ ALERT   ', cmd: 'score=98  IAM GetSessionToken anomaly on arn:aws:iam::12345:user/dev-ops-bot', color: '#ef4444' },
      { prefix: '  ↳ reason', cmd: 'First use of this credential from TOR exit node (confidence 98%)', color: '#f59e0b' },
      { prefix: '  ↳ playbook', cmd: 'Revoke session token? [y/N] y → EXECUTED', color: '#22d3ee' },
    ],
  },
  'Log Intelligence': {
    headline: 'Search 90 days of logs in under 2 seconds',
    body: 'SentinelX\'s Columnar Log Store compresses, indexes, and stores your cloud logs with sub-second full-text and field-level queries — at a fraction of legacy SIEM storage cost. Write SQL-compatible queries, build live dashboards, and schedule digests. Data is retained per your plan (14–365 days) with SHA-256 tamper-evident chain-of-custody.',
    bullets: [
      'SQL-compatible query language with auto-complete',
      'Columnar compression — 12× smaller than raw JSON storage',
      'Cross-source correlation: AWS + GCP + Kubernetes in one query',
      'Saved searches and scheduled digest emails',
      'Chain-of-custody hashing for legal admissibility',
    ],
    badge: { label: 'QUERY ENGINE', color: '#fbbf24' },
    console: [
      { prefix: 'sentinel >', cmd: 'query --sql', color: '#fbbf24' },
      { prefix: '  sql>', cmd: "SELECT actor, action, src_ip, COUNT(*) AS hits", color: '#8fa3c0' },
      { prefix: '       ', cmd: "FROM logs WHERE severity='HIGH'", color: '#8fa3c0' },
      { prefix: '       ', cmd: "  AND timestamp > now()-7d", color: '#8fa3c0' },
      { prefix: '       ', cmd: "GROUP BY actor ORDER BY hits DESC LIMIT 10;", color: '#8fa3c0' },
      { prefix: '  rows', cmd: '→ 47 results in 1.8s  (scanned 142GB)', color: '#22d3ee' },
    ],
  },
  'Cloud Posture': {
    headline: 'Continuous cloud security posture — no drift allowed',
    body: 'CSPM built for the speed of modern cloud. SentinelX continuously evaluates 1,400+ configuration checks across AWS, GCP, and Azure every 5 minutes. Exposed S3 buckets, open IAM roles, unencrypted databases, and misconfigured network ACLs surface immediately with severity scoring and one-click remediation.',
    bullets: [
      '1,400+ pre-built checks across AWS, GCP, Azure',
      '5-minute continuous evaluation cycle',
      'One-click Terraform remediation generation',
      'Drift detection with Git-blamed change attribution',
      'Risk score aggregated per account, region, and service',
    ],
    badge: { label: 'CSPM', color: '#f59e0b' },
    console: [
      { prefix: 'sentinel >', cmd: 'posture scan --account prod-aws-001', color: '#fbbf24' },
      { prefix: '  ✗ CRITICAL', cmd: 's3://prod-backups — Public READ enabled', color: '#ef4444' },
      { prefix: '  ✗ HIGH    ', cmd: 'IAM role DevOpsRole — wildcard * action', color: '#f97316' },
      { prefix: '  ✓ PASS    ', cmd: '1,392 checks passed', color: '#22d3ee' },
      { prefix: '  ↳ fix', cmd: 'sentinel remediate --check CRIT-S3-001 --auto', color: '#f59e0b' },
    ],
  },
  'Compliance': {
    headline: 'Audit-ready in minutes, not months',
    body: 'SentinelX maps every log, alert, and configuration finding to SOC2 Type II, HIPAA, GDPR, PCI-DSS, ISO 27001, and NIST 800-53 controls automatically. Generate board-ready reports, download evidence bundles for auditors, and maintain a continuous compliance score — no spreadsheet wrangling required.',
    bullets: [
      'SOC2, HIPAA, GDPR, PCI-DSS, ISO 27001, NIST 800-53',
      'Control mapping updated automatically as regulations change',
      'One-click auditor evidence package (PDF + JSON)',
      'Continuous compliance score with gap heatmap',
      'Integration with Vanta, Drata, and Secureframe',
    ],
    badge: { label: 'COMPLIANCE', color: '#22d3ee' },
    console: [
      { prefix: 'sentinel >', cmd: 'compliance report --framework SOC2 --period Q4-2024', color: '#fbbf24' },
      { prefix: '  mapping', cmd: 'CC6.1 → 42 controls satisfied ✓', color: '#22d3ee' },
      { prefix: '  mapping', cmd: 'CC6.6 → 1 gap: MFA not enforced on 3 users', color: '#f59e0b' },
      { prefix: '  export', cmd: 'SOC2_Q4_2024_evidence.zip (SHA-256: a4f91...)', color: '#8fa3c0' },
      { prefix: '  score', cmd: '98.2 / 100  — Ready for audit ✓', color: '#fbbf24' },
    ],
  },
  'Forensics': {
    headline: 'Replay any attack. Prove what happened.',
    body: 'The SentinelX Forensic Investigation Suite lets your team reconstruct any security incident as a complete timeline — clicking through each attacker action, seeing the blast radius, and exporting tamper-evident bundles for legal, insurance, or regulatory proceedings. No more correlation by hand across five dashboards.',
    bullets: [
      'Incident timeline replay from first compromise to exfiltration',
      'Cross-source actor identity resolution (IP → user → role → resource)',
      'One-click evidence export with SHA-256 integrity chain',
      'Guided remediation wizard with rollback options',
      'Legal-hold mode: immutable log archive activated per incident',
    ],
    badge: { label: 'FORENSICS', color: '#ff6b2b' },
    console: [
      { prefix: 'sentinel >', cmd: 'investigate --incident INC-2024-0928', color: '#2dd4bf' },
      { prefix: '  T+0:00  ', cmd: 'Initial access: GetSessionToken from 185.220.x.x (TOR)', color: '#ff3b6b' },
      { prefix: '  T+0:03  ', cmd: 'Recon: ListBuckets (12 buckets enumerated)', color: '#ff6b2b' },
      { prefix: '  T+0:08  ', cmd: 'Exfil: GetObject × 4,291 from s3://prod-data', color: '#f9c80e' },
      { prefix: '  export  ', cmd: 'INC-2024-0928_forensics.zip → Legal Hold applied', color: '#fbbf24' },
    ],
  },
  'Identity': {
    headline: 'Zero Trust identity — enforced, not assumed',
    body: 'SentinelX builds a continuous identity risk score for every human and machine identity in your environment — combining access reviews, login anomalies, privilege escalation patterns, and lateral movement signals. Integrate with Okta, Azure AD, Google Workspace, and Ping Identity to enforce least privilege in real time.',
    bullets: [
      'Continuous identity risk scoring per human and service account',
      'Okta, Azure AD, Google Workspace, Ping Identity integrations',
      'Ghost account detection (dormant credentials with active permissions)',
      'Access review campaigns with 1-click revocation',
      'SaaS OAuth scope analysis (detect over-privileged apps)',
    ],
    badge: { label: 'IDENTITY', color: '#ff3b6b' },
    console: [
      { prefix: 'sentinel >', cmd: 'identity review --account prod --risk HIGH', color: '#2dd4bf' },
      { prefix: '  HIGH  ', cmd: 'jsmith@corp.com — last login 127d ago, admin role active', color: '#ff3b6b' },
      { prefix: '  HIGH  ', cmd: 'svc-deploy-bot — GetSecretValue on 41 secrets (no CI ref)', color: '#ff6b2b' },
      { prefix: '  action', cmd: 'Revoke 2 accounts + 12 OAuth scopes? [y/N] y', color: '#f9c80e' },
      { prefix: '  done  ', cmd: 'Access surface reduced by 34%  ✓', color: '#fbbf24' },
    ],
  },
};

const CAPABILITIES = [
  { icon: '🧠', color: '#10b981', title: 'CEREBRO AI Engine', desc: '3rd-gen neural detection trained on 10TB of real-world attack data. Scores every event in real time with explainable reasoning.' },
  { icon: '⚡', color: '#2dd4bf', title: 'Sub-200ms Detection', desc: 'From raw log ingest to AI scoring to alert delivery, end-to-end, without compromising at scale.' },
  { icon: '🌐', color: '#b44fff', title: 'Multi-Cloud Unified', desc: 'AWS, GCP, Azure, Kubernetes, 120+ SaaS apps — one normalized pipeline, one pane of glass.' },
  { icon: '🔐', color: '#fbbf24', title: 'Zero Trust Identity', desc: 'Continuous identity risk scoring. One-click access revocation. Ghost account and OAuth scope analysis.' },
  { icon: '📋', color: '#f9c80e', title: 'Compliance Automation', desc: 'SOC2, GDPR, HIPAA, ISO 27001, PCI-DSS, NIST 800-53 — auto-mapped, always current, board-ready.' },
  { icon: '🔍', color: '#ff6b2b', title: 'Forensic Investigation', desc: 'Replay any attack, resolve identities across sources, export legal-grade evidence bundles.' },
  { icon: '🛡', color: '#ff3b6b', title: 'Auto Remediation', desc: 'Configurable playbooks that isolate endpoints, revoke credentials, update firewall rules — without human latency.' },
  { icon: '📡', color: '#10b981', title: 'Real-Time Threat Intel', desc: 'Live feed from 95 commercial and open-source threat intel providers fused into every detection score.' },
  { icon: '🗂️', color: '#2dd4bf', title: 'SQL Log Query Engine', desc: 'Full-text search and SQL queries across 90 days of logs — results in under 2 seconds, 12× cheaper than legacy SIEMs.' },
  { icon: '🔔', color: '#b44fff', title: 'Smart Alert Routing', desc: 'Route alerts to PagerDuty, Slack, Teams, Jira, or email — with severity-based suppression and on-call routing.' },
  { icon: '👁️', color: '#fbbf24', title: 'CSPM & Drift Detection', desc: '1,400+ cloud config checks every 5 minutes. Immediate notification when your posture drifts from baseline.' },
  { icon: '🤝', color: '#f9c80e', title: 'API-First Architecture', desc: 'Every SentinelX capability is fully accessible via REST API and Terraform provider for policy-as-code workflows.' },
];

const VS_TABLE = [
  { feature: 'AI anomaly detection', sx: true, siem: false, xdr: false },
  { feature: 'Explainable AI alerts', sx: true, siem: false, xdr: false },
  { feature: 'Sub-200ms detection latency', sx: true, siem: false, xdr: false },
  { feature: 'Multi-cloud native (3 clouds)', sx: true, siem: false, xdr: true },
  { feature: 'SQL log query engine', sx: true, siem: true, xdr: false },
  { feature: 'Auto-remediation playbooks', sx: true, siem: false, xdr: true },
  { feature: 'Compliance report automation', sx: true, siem: false, xdr: false },
  { feature: 'Identity risk scoring (UEBA)', sx: true, siem: false, xdr: false },
  { feature: 'Forensic attack replay', sx: true, siem: false, xdr: false },
  { feature: 'No-code onboarding (<10 min)', sx: true, siem: false, xdr: false },
  { feature: 'Transparent per-event pricing', sx: true, siem: false, xdr: false },
];

const TICK = <span style={{ color: '#22d3ee', fontWeight: 800, fontSize: 17 }}>✓</span>;
const CROSS = <span style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 700, fontSize: 15 }}>—</span>;

/* ────────────────────────────────────────────────────────────────────── */
export default function Features() {
  const [activeTab, setActiveTab] = useState('AI Detection');
  const detail = TAB_DETAILS[activeTab];

  return (
    <MarketingLayout>

      {/* ── HERO ── */}
      <section style={{ padding: '96px 48px 72px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, color: 'var(--blue-light)', marginBottom: 28, letterSpacing: 0.6 }}>
          🛡 PLATFORM CAPABILITIES
        </div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 72, fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: -2, marginBottom: 22, maxWidth: 860, margin: '0 auto 22px' }}>
          Everything you need to<br />
          <span style={{ background: 'linear-gradient(90deg,#10b981 0%,#34d399 50%,#fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            defend your cloud
          </span>
        </h1>
        <p style={{ fontSize: 19, color: 'var(--text-secondary)', maxWidth: 620, margin: '0 auto 44px', lineHeight: 1.75 }}>
          SentinelX brings AI threat detection, compliance automation, multi-cloud visibility, and forensic investigation into one unified platform — designed for the speed and scale of modern enterprise infrastructure.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link to="/login">
            <button className="btn btn-primary px-9 py-3.5 text-base" onClick={() => alert('Demo Mode: Feature coming soon!')}>Start Free Trial →</button>
          </Link>
          <Link to="/docs">
            <button className="btn btn-outline px-9 py-3.5 text-base" onClick={() => alert('Demo Mode: Feature coming soon!')}>View Documentation</button>
          </Link>
        </div>
      </section>

      {/* ── STAT STRIP ── */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: '32px 16px', textAlign: 'center', borderRight: i < 5 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEEP DIVE TABS ── */}
      <section style={{ padding: '88px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: -0.8, marginBottom: 12 }}>
            Deep-dive into the platform
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Explore each capability in detail — see the exact commands, outputs, and impact on your security posture.
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 48, flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '9px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: activeTab === tab ? 'rgba(16,185,129,0.14)' : 'rgba(255,255,255,0.04)',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              borderBottom: activeTab === tab ? '2px solid #10b981' : '2px solid transparent',
              transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s',
            }}
              onMouseEnter={e => { if (activeTab !== tab) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; } }}
              onMouseLeave={e => { if (activeTab !== tab) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
            >{tab}</button>
          ))}
        </div>

        {/* Tab content — alternating layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 22, padding: '52px 48px' }}>
          {/* Left: text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${detail.badge.color}14`, border: `1px solid ${detail.badge.color}30`, borderRadius: 100, padding: '4px 14px', fontSize: 10, fontWeight: 800, color: detail.badge.color, letterSpacing: 1.2, marginBottom: 22 }}>
              {detail.badge.label}
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 18 }}>{detail.headline}</h3>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 28 }}>{detail.body}</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {detail.bullets.map(b => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, color: 'var(--text-secondary)' }}>
                  <span style={{ color: '#10b981', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>{b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: terminal */}
          <div style={{ background: '#070d1a', border: '1px solid rgba(16, 185, 129,0.22)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ background: '#0c1628', padding: '12px 18px', borderBottom: '1px solid rgba(16, 185, 129,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 5 }}>{['#ef4444', '#f59e0b', '#10b981'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}</div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>sentinelx — zsh</span>
            </div>
            <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 260 }}>
              {detail.console.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, lineHeight: 1.7 }}>
                  <span style={{ color: 'var(--text-muted)', whiteSpace: 'pre', flexShrink: 0, minWidth: 120 }}>{line.prefix}</span>
                  <span style={{ color: line.color, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line.cmd}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12.5, color: 'var(--text-muted)' }}>sentinel &gt;</span>
                <span style={{ width: 2, height: 16, background: '#10b981', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12-CAPABILITY GRID ── */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '88px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: -0.8, marginBottom: 14 }}>
              Complete security coverage
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
              12 integrated capabilities that work together — so your team doesn't have to manually correlate across tools.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {CAPABILITIES.map(cap => (
              <div key={cap.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '26px', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${cap.color}50`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${cap.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${cap.color}12`, border: `1px solid ${cap.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{cap.icon}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{cap.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VS COMPARISON TABLE ── */}
      <section style={{ padding: '88px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: -0.8, marginBottom: 14 }}>
            Why teams switch to SentinelX
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
            One platform that replaces your SIEM, CSPM, and XDR — with better detection and a fraction of the total cost of ownership.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px 200px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '20px 28px', fontSize: 12, fontWeight: 800, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capability</div>
            {[
              { name: 'SentinelX', accent: true, color: '#10b981' },
              { name: 'Legacy SIEM', accent: false, color: null },
              { name: 'XDR Platform', accent: false, color: null },
            ].map(col => (
              <div key={col.name} style={{ padding: '20px 0', textAlign: 'center', background: col.accent ? 'rgba(16, 185, 129,0.06)' : 'transparent', borderLeft: col.accent ? '1px solid rgba(16, 185, 129,0.18)' : '1px solid var(--border)' }}>
                {col.accent && <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: '#10b981', marginBottom: 4 }}>RECOMMENDED</div>}
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, color: col.accent ? '#fff' : 'var(--text-secondary)' }}>{col.name}</div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {VS_TABLE.map((row, i) => (
            <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px 200px', borderBottom: i < VS_TABLE.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ padding: '16px 28px', fontSize: 14, color: 'var(--text-secondary)' }}>{row.feature}</div>
              {[
                { val: row.sx, accent: true },
                { val: row.siem, accent: false },
                { val: row.xdr, accent: false },
              ].map((cell, ci) => (
                <div key={ci} style={{ padding: '16px 0', textAlign: 'center', background: cell.accent ? 'rgba(16, 185, 129,0.04)' : 'transparent', borderLeft: cell.accent ? '1px solid rgba(16, 185, 129,0.12)' : '1px solid var(--border)' }}>
                  {cell.val ? TICK : CROSS}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── INTEGRATION LOGOS MINI ── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px', background: 'rgba(255,255,255,0.01)' }}>
        <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, letterSpacing: 1.6, color: 'var(--text-muted)', marginBottom: 28, textTransform: 'uppercase' }}>Connects with your existing stack in minutes</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', opacity: 0.6 }}>
          {['AWS', 'GCP', 'Azure', 'Kubernetes', 'Okta', 'Datadog', 'Splunk', 'PagerDuty', 'Jira', 'Slack', 'GitHub', 'Terraform'].map(name => (
            <div key={name} style={{ padding: '10px 18px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'Outfit, sans-serif' }}>{name}</div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/integrations" style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-light)', textDecoration: 'none' }}>View all 120+ integrations →</Link>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: -1, marginBottom: 18 }}>
          See every feature in action
        </h2>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Start a 14-day free trial with full access to every capability. No credit card, no commitment.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 20 }}>
          <Link to="/login">
            <button className="btn btn-primary px-9 py-3.5 text-base" onClick={() => alert('Demo Mode: Feature coming soon!')}>Start Free Trial →</button>
          </Link>
          <Link to="/contact">
            <button className="btn btn-outline px-9 py-3.5 text-base" onClick={() => alert('Demo Mode: Feature coming soon!')}>Request a Demo</button>
          </Link>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 20, justifyContent: 'center' }}>
          <span>✓ No credit card</span><span>✓ Full access</span><span>✓ SOC2 certified</span><span>✓ Cancel anytime</span>
        </div>
      </section>

    </MarketingLayout>
  );
}
