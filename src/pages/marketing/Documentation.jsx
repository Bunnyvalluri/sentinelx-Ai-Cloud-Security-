import MarketingLayout from '../../components/MarketingLayout';
import { useState } from 'react';

/* ─── Sidebar structure ─────────────────────────────────────────────────── */
const SIDEBAR = [
  { section: 'Getting Started', items: ['Quick Start Guide', 'Architecture Overview', 'Authentication & API Keys', 'First Log Source Integration'] },
  { section: 'Core Concepts', items: ['Log Ingestion Pipeline', 'Anomaly Scoring Engine', 'Alert Lifecycle', 'RBAC & Permissions'] },
  { section: 'Integrations', items: ['AWS CloudTrail', 'GCP Audit Logs', 'Azure Monitor', 'Kubernetes', 'Custom Syslog'] },
  { section: 'API Reference', items: ['REST API Overview', 'Authentication', 'Alerts Endpoints', 'Logs Endpoints', 'Webhooks'] },
  { section: 'Compliance', items: ['SOC2 Mapping', 'GDPR Guide', 'HIPAA Controls', 'ISO 27001 Checklist'] },
];

/* ─── Code block component ──────────────────────────────────────────────── */
function Code({ lang = 'bash', children }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <div style={{ background: '#080d18', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
      <div style={{ padding: '8px 18px', borderBottom: '1px solid rgba(16,185,129,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16,185,129,0.04)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ef4444', '#f59e0b', '#10b981'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>{lang}</span>
          <button onClick={copy} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '2px 8px', color: copied ? '#10b981' : 'var(--text-muted)', fontSize: 10, cursor: 'pointer', fontFamily: 'Inter' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre style={{ margin: 0, padding: '20px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, color: '#c9d1d9', lineHeight: 1.85, overflowX: 'auto', whiteSpace: 'pre' }}>{children}</pre>
    </div>
  );
}

/* ─── Info / Warning / Note callouts ───────────────────────────────────── */
function Callout({ type = 'info', children }) {
  const cfg = {
    info: { bg: 'rgba(56,189,248,0.07)', border: 'rgba(56,189,248,0.25)', icon: 'ℹ', color: '#38bdf8' },
    warn: { bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.25)', icon: '⚠', color: '#fbbf24' },
    success: { bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.25)', icon: '✓', color: '#10b981' },
    danger: { bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.25)', icon: '✕', color: '#ef4444' },
  }[type];
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderLeft: `3px solid ${cfg.color}`, borderRadius: 8, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ color: cfg.color, fontSize: 15, flexShrink: 0 }}>{cfg.icon}</span>
      <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

/* ─── Section heading ───────────────────────────────────────────────────── */
function H2({ children }) {
  return <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--border)' }}>{children}</h2>;
}
function P({ children }) {
  return <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 18 }}>{children}</p>;
}
function UL({ items }) {
  return (
    <ul style={{ margin: '0 0 20px 0', paddingLeft: 22 }}>
      {items.map((it) => <li key={it} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 6 }}>{it}</li>)}
    </ul>
  );
}

/* ─── Table component ───────────────────────────────────────────────────── */
function Table({ headers, rows }) {
  return (
    <div style={{ overflow: 'auto', marginBottom: 28, border: '1px solid var(--border)', borderRadius: 10 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
            {headers.map(h => <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('-')} style={{ borderBottom: rows.indexOf(row) < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {row.map((cell) => <td key={cell} style={{ padding: '10px 16px', color: row.indexOf(cell) === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── All documentation content ─────────────────────────────────────────── */
const CONTENT = {
  'Quick Start Guide': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Quick Start Guide</h1>
      <P>Get SentinelX connected to your first cloud environment in under 10 minutes. This guide walks through installing the CLI, configuring an AWS integration, and verifying events are streaming.</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 32 }}>
        {[{ i: '⏱', l: 'Setup time', v: '~10 minutes' }, { i: '✅', l: 'Prerequisites', v: 'AWS account, Node.js 18+' }, { i: '📡', l: 'First event', v: '< 60 seconds' }].map(s => (
          <div key={s.l} style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.i}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.l}</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 600 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <H2>Step 1 — Install the CLI</H2>
      <P>The SentinelX CLI is the fastest way to connect cloud accounts. It handles IAM role creation, S3 bucket policy configuration, and CloudTrail setup automatically.</P>
      <Code lang="bash">{`# Install globally via npm
npm install -g @sentinelx/cli

# Verify installation
sentinelx --version
# sentinelx/2.4.1 linux-x64 node-v20.9.0

# Authenticate with your workspace
sentinelx login
# Opening browser...
# ✓ Logged in as alex@acme.com (workspace: acme-prod)`}</Code>
      <H2>Step 2 — Connect Your AWS Account</H2>
      <P>SentinelX deploys a read-only IAM role using CloudFormation. It never stores credentials — all access is via STS AssumeRole with a unique external ID per workspace.</P>
      <Code lang="bash">{`# Interactive setup wizard
sentinelx integrate aws

# Or provide flags directly
sentinelx integrate aws \\
  --account-id 123456789012 \\
  --role-arn arn:aws:iam::123456789012:role/SentinelXReader \\
  --regions us-east-1,eu-west-1,ap-southeast-1

# Output:
# ✓ IAM role validated
# ✓ CloudTrail access confirmed
# ✓ S3 bucket policy configured
# ✓ Integration active — streaming started`}</Code>
      <Callout type="success">Once connected, CEREBRO AI starts building behavioral baselines for your environment. The first anomaly report is ready within 24 hours.</Callout>
      <H2>Step 3 — Verify the Connection</H2>
      <Code lang="bash">{`sentinelx status --source aws-123456789012

# ✓ Connected
# Events/hr:    142,830
# Latency:      1.2s
# Missed events: 0
# Last event:   2s ago
# Regions:      us-east-1, eu-west-1, ap-southeast-1`}</Code>
      <H2>Step 4 — Create Your First Alert Rule</H2>
      <P>Alert rules are YAML-based policies evaluated against every incoming event in real time. The following rule fires when any IAM user logs in from a TOR exit node.</P>
      <Code lang="yaml">{`# ~/.sentinelx/rules/tor-login.yml
name: TOR Exit Node Login
severity: CRITICAL
description: Detects any AWS console login from a known TOR exit node IP.

match:
  event_type: ConsoleLogin
  source_ip:
    threat_intel: tor_exit_nodes

actions:
  - alert:
      channel: "#security-alerts"
      message: "TOR login from {{ source_ip }} by {{ user_identity }}"
  - auto_block:
      scope: source_ip
      duration: 24h`}</Code>
      <Callout type="warn">Auto-block actions require the <strong>Response Automation</strong> add-on. Contact support to enable it on your workspace.</Callout>
    </div>
  ),

  'Architecture Overview': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Architecture Overview</h1>
      <P>SentinelX is a multi-tenant SaaS platform built on a cloud-native event streaming architecture. Events flow from your cloud accounts through the ingestion layer, CEREBRO AI scoring engine, and into your dashboard in real time.</P>
      <H2>High-Level Data Flow</H2>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px', marginBottom: 28, fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2.2 }}>
        {`Cloud Sources (AWS / GCP / Azure / K8s)\n        ↓  (TLS 1.3 encrypted)\nIngestion Gateway  →  Kafka Cluster (3-zone replicated)\n        ↓\nStream Processing (Flink)  →  CEREBRO AI Engine\n        ↓                         ↓\nTimeSeries DB (ClickHouse)   Alert Engine\n        ↓                         ↓\nWebSocket Push  ←──────── Rule Evaluation\n        ↓\nSentinelX Dashboard / Webhooks / PagerDuty / Slack`}
      </div>
      <H2>Core Components</H2>
      <Table
        headers={['Component', 'Technology', 'Purpose']}
        rows={[
          ['Ingestion Gateway', 'Go + gRPC', 'Receives events via webhooks, pull polling, or native SDKs. Validates schema, normalizes format, deduplicates.'],
          ['Message Bus', 'Apache Kafka (3 replicas)', 'Guaranteed at-least-once delivery. 7-day retention. Supports 2M+ events/sec per cluster.'],
          ['Stream Processor', 'Apache Flink', 'Real-time CEP (Complex Event Processing), joins, aggregations, and enrichment with threat-intel feeds.'],
          ['CEREBRO AI', 'PyTorch + custom ONNX', 'Unsupervised ML baseline engine. Scores each event 0–100 for anomaly probability using LSTM and Isolation Forest models.'],
          ['Storage', 'ClickHouse (columnar)', 'Immutable append-only event store. Query latency < 50ms at 10B+ rows. 90-day hot storage, S3 cold tier.'],
          ['Alert Engine', 'Rust', 'Evaluates YAML rules against enriched events at < 5ms p99. Handles fan-out to notification channels.'],
        ]}
      />
      <H2>Security & Isolation</H2>
      <UL items={['All tenant data is encrypted at rest using AES-256 and in transit via TLS 1.3.', 'Workspace data is isolated via row-level scoping in ClickHouse — data never crosses tenant boundaries.', 'IAM access uses STS AssumeRole with unique external IDs — SentinelX never stores AWS credentials.', 'All infrastructure runs on SOC2 Type II certified cloud regions (us-east-1, eu-west-1, ap-southeast-1).']} />
    </div>
  ),

  'Authentication & API Keys': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Authentication & API Keys</h1>
      <P>All SentinelX API endpoints require authentication via Bearer tokens. API keys are workspace-scoped and can be granted fine-grained permissions.</P>
      <H2>Creating an API Key</H2>
      <P>Navigate to <strong>Settings → API Keys → New Key</strong> in the dashboard. Each key has an optional expiry and a set of scopes:</P>
      <Table
        headers={['Scope', 'Description']}
        rows={[
          ['logs:read', 'Read raw log events and search the log explorer.'],
          ['alerts:read', 'Read alerts and alert history.'],
          ['alerts:write', 'Create, acknowledge, and close alerts.'],
          ['rules:read', 'Read alert rules and policies.'],
          ['rules:write', 'Create, update, and delete alert rules.'],
          ['integrations:write', 'Add and remove cloud integrations.'],
          ['admin', 'Full access — use with caution.'],
        ]}
      />
      <H2>Using Your API Key</H2>
      <Code lang="bash">{`# Set your API key
export SENTINELX_API_KEY="sxk_live_xxxxxxxxxxxxxxxxxxxxxxxx"

# All requests use Bearer token auth
curl https://api.sentinelx.io/v1/alerts \\
  -H "Authorization: Bearer $SENTINELX_API_KEY" \\
  -H "Content-Type: application/json"`}</Code>
      <H2>OAuth 2.0 (Machine-to-Machine)</H2>
      <P>For server-to-server integrations, use the OAuth client credentials flow:</P>
      <Code lang="bash">{`# Exchange client credentials for an access token
curl -X POST https://auth.sentinelx.io/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "audience": "https://api.sentinelx.io"
  }'

# Response:
# {
#   "access_token": "eyJhbGc...",
#   "token_type": "Bearer",
#   "expires_in": 86400
# }`}</Code>
      <Callout type="danger">Never commit API keys to source control. Use environment variables or a secrets manager like AWS Secrets Manager or HashiCorp Vault.</Callout>
    </div>
  ),

  'Log Ingestion Pipeline': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Log Ingestion Pipeline</h1>
      <P>The SentinelX ingestion pipeline accepts events from cloud-native sources, agent-based collectors, and direct webhook endpoints. All events pass through validation, normalization, enrichment, and storage stages.</P>
      <H2>Ingestion Methods</H2>
      <Table
        headers={['Method', 'Latency', 'Best For']}
        rows={[
          ['Native Integration (AWS, GCP, Azure)', '< 2s', 'Recommended. Zero-config. Automatic schema mapping.'],
          ['SentinelX Agent (Linux/Windows)', '< 500ms', 'On-premise servers, custom app logs, syslog streams.'],
          ['HTTP Webhook', '< 1s', 'Third-party SaaS tools, custom applications.'],
          ['Kafka Topic', '< 100ms', 'High-volume environments (> 100K events/sec).'],
          ['S3 Batch Import', 'Minutes', 'Historical log backfill. Supports gzip, parquet, JSON.'],
        ]}
      />
      <H2>Event Schema</H2>
      <P>All events are normalized into the SentinelX Common Event Format (CEF) before storage. Raw original events are also preserved.</P>
      <Code lang="json">{`{
  "event_id": "evt_01HXYZ...",
  "timestamp": "2024-03-08T18:42:01.382Z",
  "source": "aws-cloudtrail",
  "account_id": "123456789012",
  "region": "us-east-1",
  "event_type": "ConsoleLogin",
  "severity": "HIGH",
  "actor": {
    "type": "IAMUser",
    "arn": "arn:aws:iam::123456789012:user/john",
    "username": "john"
  },
  "source_ip": "185.220.101.4",
  "geo": { "country": "RU", "city": "Moscow", "lat": 55.75, "lon": 37.62 },
  "threat_intel": { "tor_exit_node": true, "known_bad": true, "score": 94 },
  "cerebro_score": 91.4,
  "raw": { "...": "original CloudTrail event preserved here" }
}`}</Code>
      <H2>Enrichment Pipeline</H2>
      <UL items={['IP Geolocation — MaxMind GeoIP2 database, updated daily.', 'Threat Intelligence — AlienVault OTX, Shodan, internal TOR exit node lists.', 'WHOIS enrichment — ASN, organisation name, and abuse contact for each source IP.', 'User context — IAM user history, last known location, typical working hours from your tenant baseline.']} />
    </div>
  ),

  'Anomaly Scoring Engine': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Anomaly Scoring Engine (CEREBRO AI)</h1>
      <P>CEREBRO is SentinelX's AI core. It assigns every event an anomaly score from 0–100 using an ensemble of unsupervised ML models trained on your specific environment's behavioral baseline.</P>
      <H2>How Scoring Works</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        {[
          { n: '01', t: 'Baseline Learning', d: 'CEREBRO observes your environment for 7 days, building per-user, per-service, and per-IP behavioral profiles. No labels needed.' },
          { n: '02', t: 'Feature Extraction', d: 'For each event, 140+ features are extracted: time-of-day, geolocation delta, API call rarity, volume spikes, session patterns.' },
          { n: '03', t: 'Ensemble Scoring', d: 'Three models vote: Isolation Forest (outlier detection), LSTM (sequence anomaly), and a rule-based heuristic layer.' },
          { n: '04', t: 'Final Score', d: 'Scores are blended with threat-intel signals and calibrated to minimise false positives. Events > 70 trigger alert evaluation.' },
        ].map(s => (
          <div key={s.n} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--blue-light)', fontWeight: 700, marginBottom: 8 }}>STEP {s.n}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{s.t}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.d}</div>
          </div>
        ))}
      </div>
      <H2>Score Thresholds</H2>
      <Table
        headers={['Score Range', 'Severity', 'Default Action']}
        rows={[
          ['0 – 30', 'INFO', 'Logged silently. No alert generated.'],
          ['31 – 55', 'LOW', 'Logged. Visible in alert queue. No notification.'],
          ['56 – 70', 'MEDIUM', 'Alert created. Slack/email notification (if configured).'],
          ['71 – 85', 'HIGH', 'Alert created. PagerDuty notification. Appears in dashboard.'],
          ['86 – 100', 'CRITICAL', 'Alert created. All channels notified. Optional auto-block.'],
        ]}
      />
      <Callout type="info">You can tune thresholds per alert rule. Some teams raise the CRITICAL threshold to 92+ to reduce noise in high-volume environments.</Callout>
    </div>
  ),

  'Alert Lifecycle': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Alert Lifecycle</h1>
      <P>Every alert in SentinelX moves through a defined lifecycle with full audit trail — from creation through investigation to resolution.</P>
      <H2>Alert States</H2>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 24px', marginBottom: 28, lineHeight: 2.2 }}>
        {`TRIGGERED → ASSIGNED → INVESTIGATING → RESOLVED\n                               ↓\n                         ESCALATED → RESOLVED\n                               ↓\n                         FALSE_POSITIVE (closes silently)`}
      </div>
      <Table
        headers={['State', 'Who Sets It', 'Meaning']}
        rows={[
          ['TRIGGERED', 'System', 'Rule evaluated and matched. Alert created, notifications sent.'],
          ['ASSIGNED', 'User or auto-assign rule', 'A team member has taken ownership.'],
          ['INVESTIGATING', 'User', 'Active investigation underway.'],
          ['ESCALATED', 'User or SLA policy', 'Escalated to senior analyst or external team.'],
          ['RESOLVED', 'User', 'Threat mitigated or confirmed benign. Requires resolution note.'],
          ['FALSE_POSITIVE', 'User', 'Marked as non-threatening. Used to tune CEREBRO\'s model.'],
        ]}
      />
      <H2>Alert API Example</H2>
      <Code lang="bash">{`# List open alerts ordered by severity
curl https://api.sentinelx.io/v1/alerts?status=TRIGGERED&sort=severity \\
  -H "Authorization: Bearer $SENTINELX_API_KEY"

# Acknowledge an alert
curl -X PATCH https://api.sentinelx.io/v1/alerts/alt_01HXYZ \\
  -H "Authorization: Bearer $SENTINELX_API_KEY" \\
  -d '{"status":"INVESTIGATING","assignee":"john@acme.com"}'

# Resolve with a note
curl -X PATCH https://api.sentinelx.io/v1/alerts/alt_01HXYZ \\
  -H "Authorization: Bearer $SENTINELX_API_KEY" \\
  -d '{"status":"RESOLVED","resolution":"Confirmed auth from known VPN. User verified."}'`}</Code>
    </div>
  ),

  'RBAC & Permissions': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>RBAC & Permissions</h1>
      <P>SentinelX uses Role-Based Access Control (RBAC) to enforce the principle of least privilege. All actions are logged in the immutable audit trail.</P>
      <H2>Built-In Roles</H2>
      <Table
        headers={['Role', 'Alerts', 'Logs', 'Rules', 'Integrations', 'Billing', 'Users']}
        rows={[
          ['Viewer', 'Read', 'Read', 'Read', '—', '—', '—'],
          ['Analyst', 'Read/Write', 'Read', 'Read', '—', '—', '—'],
          ['Engineer', 'Read/Write', 'Read/Write', 'Read/Write', 'Read', '—', '—'],
          ['Admin', 'Full', 'Full', 'Full', 'Full', 'Read', 'Full'],
          ['Owner', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full'],
        ]}
      />
      <H2>Custom Roles</H2>
      <Code lang="yaml">{`# Example: Read-only SOC analyst role
name: soc-analyst-readonly
description: Can view alerts and logs but cannot modify anything.
permissions:
  - alerts:read
  - logs:read
  - rules:read
  - integrations:read

# Assign to users
members:
  - alice@acme.com
  - bob@acme.com`}</Code>
      <Callout type="info">Custom RBAC is available on the <strong>Team</strong> plan and above. SCIM provisioning for Okta and Azure AD is on the <strong>Enterprise</strong> plan.</Callout>
    </div>
  ),

  'AWS CloudTrail': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>AWS CloudTrail Integration</h1>
      <P>The AWS CloudTrail integration streams every API call, console login, and IAM event from your AWS accounts into SentinelX in real time. No agents required.</P>
      <H2>What Gets Collected</H2>
      <UL items={['All CloudTrail management events (control plane — IAM, S3, EC2, etc.)', 'Optionally: S3 data events (object-level API calls)', 'Optionally: Lambda invocation events', 'VPC Flow Logs (requires separate CloudWatch Logs integration)', 'AWS Config change events', 'GuardDuty findings (de-duplicated and merged into SentinelX alerts)']} />
      <H2>Setup via CLI</H2>
      <Code lang="bash">{`# One-command setup
sentinelx integrate aws \\
  --account-id 123456789012 \\
  --regions us-east-1,eu-west-1 \\
  --include-data-events s3,lambda

# This will:
# 1. Deploy a CloudFormation stack with read-only IAM role
# 2. Create an SNS topic and SQS queue for event delivery
# 3. Configure CloudTrail to forward to the SQS queue
# 4. Start streaming events to your workspace`}</Code>
      <H2>Manual CloudFormation</H2>
      <Code lang="bash">{`# Download the CloudFormation template
curl -O https://docs.sentinelx.io/cfn/sentinelx-reader.yml

# Deploy the stack
aws cloudformation deploy \\
  --template-file sentinelx-reader.yml \\
  --stack-name SentinelXIntegration \\
  --capabilities CAPABILITY_NAMED_IAM \\
  --parameter-overrides \\
    WorkspaceId=ws_01HXYZ \\
    ExternalId=ext_01HXYZ`}</Code>
      <Callout type="warn">Ensure the IAM role has <strong>ReadOnly</strong> permissions only. SentinelX never requires write access to your AWS account.</Callout>
    </div>
  ),

  'REST API Overview': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>REST API Overview</h1>
      <P>The SentinelX REST API is a JSON-over-HTTPS API. The base URL is <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 7px', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 12 }}>https://api.sentinelx.io/v1</code>. All requests must include a valid API key.</P>
      <H2>Rate Limits</H2>
      <Table
        headers={['Plan', 'Requests/min', 'Burst']}
        rows={[['Free', '60', '100'], ['Pro', '600', '1,000'], ['Team', '3,000', '5,000'], ['Enterprise', 'Unlimited', '—']]}
      />
      <H2>Pagination</H2>
      <P>All list endpoints use cursor-based pagination. Pass <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 12 }}>cursor</code> from the previous response to fetch the next page.</P>
      <Code lang="json">{`// GET /v1/alerts?limit=25
{
  "data": [ { "id": "alt_01...", ... }, ... ],
  "pagination": {
    "cursor":   "cursor_01HXYZ",
    "has_more": true,
    "total":    1438
  }
}`}</Code>
      <H2>Error Codes</H2>
      <Table
        headers={['HTTP Status', 'Error Code', 'Meaning']}
        rows={[
          ['400', 'invalid_request', 'Missing or malformed request body.'],
          ['401', 'unauthorized', 'Invalid or missing API key.'],
          ['403', 'forbidden', 'API key lacks required scope.'],
          ['404', 'not_found', 'Resource does not exist.'],
          ['429', 'rate_limited', 'Too many requests. Retry after the indicated delay.'],
          ['500', 'internal_error', 'Server error. Please contact support.'],
        ]}
      />
    </div>
  ),

  'Alerts Endpoints': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Alerts API</h1>
      <P>The Alerts API lets you read, update, and manage alerts programmatically. Useful for building custom dashboards, SOAR integrations, or automated triage workflows.</P>
      <H2>List Alerts</H2>
      <Code lang="bash">{`GET /v1/alerts

# Query parameters
?status=TRIGGERED,INVESTIGATING  # comma-separated
?severity=HIGH,CRITICAL
?source=aws-cloudtrail
?from=2024-03-01T00:00:00Z
?to=2024-03-08T23:59:59Z
?limit=50
?cursor=cursor_01HXYZ

# Example
curl "https://api.sentinelx.io/v1/alerts?severity=CRITICAL&status=TRIGGERED" \\
  -H "Authorization: Bearer $SENTINELX_API_KEY"`}</Code>
      <H2>Get Alert Detail</H2>
      <Code lang="bash">{`GET /v1/alerts/:id

curl https://api.sentinelx.io/v1/alerts/alt_01HXYZ \\
  -H "Authorization: Bearer $SENTINELX_API_KEY"

# Response:
{
  "id": "alt_01HXYZ",
  "title": "TOR Exit Node Login — IAMUser/john",
  "severity": "CRITICAL",
  "status": "TRIGGERED",
  "cerebro_score": 94.2,
  "triggered_at": "2024-03-08T18:42:01Z",
  "source_event": { ... },
  "rule": { "id": "rule_01...", "name": "TOR Exit Node Login" },
  "assignee": null,
  "comments": []
}`}</Code>
      <H2>Update an Alert</H2>
      <Code lang="bash">{`PATCH /v1/alerts/:id

curl -X PATCH https://api.sentinelx.io/v1/alerts/alt_01HXYZ \\
  -H "Authorization: Bearer $SENTINELX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "RESOLVED",
    "resolution": "Confirmed as authorized access by security team.",
    "assignee": "alice@acme.com"
  }'`}</Code>
    </div>
  ),

  'Webhooks': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Webhooks</h1>
      <P>SentinelX can POST real-time event payloads to any HTTPS endpoint. Use webhooks to integrate with Slack, PagerDuty, custom SOAR platforms, or your own backend.</P>
      <H2>Creating a Webhook</H2>
      <Code lang="bash">{`curl -X POST https://api.sentinelx.io/v1/webhooks \\
  -H "Authorization: Bearer $SENTINELX_API_KEY" \\
  -d '{
    "url": "https://your-server.com/sentinelx-events",
    "events": ["alert.triggered", "alert.resolved", "integration.disconnected"],
    "secret": "your_signing_secret"
  }'`}</Code>
      <H2>Verifying Webhook Signatures</H2>
      <P>Every webhook request includes a <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 12 }}>X-SentinelX-Signature</code> header. Verify it to ensure requests are genuine.</P>
      <Code lang="javascript">{`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}

// In your Express handler:
app.post('/sentinelx-events', (req, res) => {
  const sig = req.headers['x-sentinelx-signature'];
  if (!verifyWebhook(req.rawBody, sig, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Unauthorized');
  }
  const event = req.body;
  console.log('Alert received:', event.alert.title);
  res.sendStatus(200);
});`}</Code>
    </div>
  ),

  'SOC2 Mapping': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>SOC2 Compliance Mapping</h1>
      <P>SentinelX is SOC2 Type II certified. The platform also helps your organisation achieve and maintain SOC2 compliance by mapping detected events to specific Trust Service Criteria (TSC).</P>
      <H2>Trust Service Criteria Coverage</H2>
      <Table
        headers={['TSC', 'Control', 'SentinelX Feature']}
        rows={[
          ['CC6.1', 'Logical access controls', 'IAM anomaly detection, MFA enforcement monitoring.'],
          ['CC6.2', 'User provisioning/deprovisioning', 'New IAM user alerts, orphaned account detection.'],
          ['CC6.3', 'Access removal', 'Detects access that persists after offboarding events.'],
          ['CC7.1', 'System monitoring', 'Continuous log ingestion and CEREBRO AI baseline monitoring.'],
          ['CC7.2', 'Vulnerability detection', 'CloudTrail CVE-related API call detection.'],
          ['CC7.3', 'Incident response', 'Alert lifecycle with full audit trail and SLA tracking.'],
          ['CC7.4', 'Incident response testing', 'Automated red-team simulation alerts in test mode.'],
          ['A1.1', 'Availability monitoring', 'Uptime monitoring and SLA dashboard.'],
          ['PI1.1', 'Data processing integrity', 'Immutable audit log with tamper-evident hashing.'],
        ]}
      />
      <H2>Audit Evidence Export</H2>
      <Code lang="bash">{`# Export SOC2 evidence report for a date range
sentinelx compliance export \\
  --framework soc2 \\
  --from 2024-01-01 \\
  --to 2024-03-31 \\
  --format pdf \\
  --output soc2-q1-2024.pdf

# Output includes:
# - Alert resolution times and SLA compliance
# - Access log for all privileged operations
# - Anomaly detection summary with CEREBRO scores`}</Code>
      <Callout type="success">SentinelX's latest SOC2 Type II report is available under NDA. Contact <strong>security@sentinelx.io</strong> to request a copy.</Callout>
    </div>
  ),

  'GCP Audit Logs': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>GCP Audit Logs Integration</h1>
      <P>Collect Admin Activity, Data Access, and System Event audit logs from Google Cloud Platform projects or entire organizations.</P>
      <H2>Setup</H2>
      <Code lang="bash">{`# Authenticate with GCP
gcloud auth application-default login

# Deploy SentinelX collector
sentinelx integrate gcp \\
  --project-id my-gcp-project \\
  --log-types admin-activity,data-access \\
  --pubsub-topic projects/my-gcp-project/topics/sentinelx

# For org-wide collection
sentinelx integrate gcp \\
  --org-id 123456789 \\
  --log-types admin-activity`}</Code>
      <Callout type="info">Organization-level collection requires <code style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>roles/logging.configWriter</code> on the GCP organization root.</Callout>
    </div>
  ),

  'Kubernetes': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Kubernetes Integration</h1>
      <P>The SentinelX Kubernetes agent collects API server audit logs, pod security events, image pull events, and exec/attach sessions from any Kubernetes cluster.</P>
      <H2>Deploy via Helm</H2>
      <Code lang="bash">{`# Add the SentinelX Helm repo
helm repo add sentinelx https://charts.sentinelx.io
helm repo update

# Install the agent
helm install sentinelx-agent sentinelx/agent \\
  --namespace sentinelx \\
  --create-namespace \\
  --set agent.workspaceId=ws_01HXYZ \\
  --set agent.apiKey=$SENTINELX_API_KEY

# Verify
kubectl get pods -n sentinelx
# NAME                              READY   STATUS    RESTARTS
# sentinelx-agent-5d8f9b7c4-xk2p9  1/1     Running   0`}</Code>
      <H2>What Gets Collected</H2>
      <UL items={['Kubernetes API server audit log (all verbs: get, list, create, delete, patch, exec)', 'Pod exec / attach sessions (who ran kubectl exec and what commands)', 'Image pull events — detects unknown or unsigned container images', 'RBAC changes — new ClusterRoleBindings, ServiceAccount tokens created', 'Namespace creation and deletion events', 'Node-level syslog via optional DaemonSet']} />
    </div>
  ),

  'GDPR Guide': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>GDPR Compliance Guide</h1>
      <P>SentinelX acts as a Data Processor under GDPR. We provide a standard Data Processing Agreement (DPA) and a set of controls to help you meet your GDPR obligations as a Data Controller.</P>
      <H2>Data Residency</H2>
      <P>EU customers can select <strong>eu-west-1 (Ireland)</strong> or <strong>eu-central-1 (Frankfurt)</strong> as their primary region. Data never leaves the EU region. You can configure this during workspace creation or by contacting support.</P>
      <H2>Key GDPR Controls</H2>
      <Table
        headers={['Article', 'Requirement', 'SentinelX Control']}
        rows={[
          ['Art. 5(1)(f)', 'Integrity and confidentiality', 'AES-256 at rest, TLS 1.3 in transit, hardware-backed key management.'],
          ['Art. 17', 'Right to erasure', 'Workspace deletion API, log purge API, immutable storage exempt from erasure.'],
          ['Art. 20', 'Data portability', 'Full data export via API in JSON or Parquet format.'],
          ['Art. 25', 'Privacy by design', 'Minimal data collection. IP addresses pseudonymised by default.'],
          ['Art. 32', 'Security of processing', 'SOC2 Type II, pen tested annually, ISO 27001 in progress.'],
          ['Art. 33', 'Breach notification', 'SentinelX notifies affected tenants within 72 hours of any security incident.'],
        ]}
      />
      <Callout type="info">Download our pre-signed DPA from <strong>Settings → Legal → Data Processing Agreement</strong> in your workspace.</Callout>
    </div>
  ),

  'First Log Source Integration': () => (
    <div>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>First Log Source Integration</h1>
      <P>After installing the CLI and logging in, choose the cloud provider or custom source you want to connect. SentinelX supports AWS, GCP, Azure, Kubernetes, and custom syslog out of the box.</P>
      <H2>Supported Sources at a Glance</H2>
      <Table
        headers={['Source', 'Setup Time', 'Events/hr Typical']}
        rows={[
          ['AWS CloudTrail', '5 min', '50,000 – 500,000'],
          ['GCP Audit Logs', '5 min', '20,000 – 200,000'],
          ['Azure Monitor', '8 min', '30,000 – 300,000'],
          ['Kubernetes API Server', '3 min', '5,000 – 100,000'],
          ['Custom Syslog', '2 min', 'Variable'],
          ['Okta System Log', '3 min', '1,000 – 50,000'],
          ['GitHub Audit Log', '3 min', '500 – 20,000'],
          ['Cloudflare Logpush', '5 min', '100,000 – 2,000,000'],
        ]}
      />
      <Callout type="success">Run <code style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>sentinelx integrate list</code> to see all supported integrations and their current status in your workspace.</Callout>
    </div>
  ),
};

/* Default content for unimplemented sections */
const DefaultContent = ({ title }) => (
  <div>
    <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>{title}</h1>
    <P>This section covers {title.toLowerCase()} in depth. Use the sidebar to navigate between topics.</P>
    <Callout type="info">Full documentation for this section is being expanded. Check back soon or contact <strong>support@sentinelx.io</strong> for direct assistance.</Callout>
    <H2>Overview</H2>
    <P>SentinelX provides enterprise-grade capabilities in this area, designed to integrate seamlessly with your existing security tooling and workflows. All features are accessible via the dashboard, CLI, and REST API.</P>
    <H2>Quick Reference</H2>
    <Code lang="bash">{`# Get help for any CLI command
sentinelx help ${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}

# Open an issue or request docs
sentinelx feedback --topic "${title}"`}</Code>
  </div>
);

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function Documentation() {
  const [activeSection, setActiveSection] = useState('Quick Start Guide');
  const ContentComponent = CONTENT[activeSection];

  return (
    <MarketingLayout>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 248, borderRight: '1px solid var(--border)', padding: '28px 0', flexShrink: 0, background: 'rgba(0,0,0,0.25)', position: 'sticky', top: 68, height: 'calc(100vh - 68px)', overflowY: 'auto' }}>
          <div style={{ padding: '0 18px 14px', fontSize: 11, fontWeight: 800, letterSpacing: 1.3, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Documentation</div>
          {SIDEBAR.map(group => (
            <div key={group.section} style={{ marginBottom: 22 }}>
              <div style={{ padding: '0 18px 7px', fontSize: 9.5, fontWeight: 800, letterSpacing: 1.1, color: 'var(--blue-light)', textTransform: 'uppercase' }}>{group.section}</div>
              {group.items.map(item => (
                <div key={item} onClick={() => setActiveSection(item)}
                  style={{
                    padding: '8px 18px', fontSize: 13, cursor: 'pointer', fontWeight: activeSection === item ? 600 : 400,
                    color: activeSection === item ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: activeSection === item ? 'rgba(16,185,129,0.09)' : 'transparent',
                    borderLeft: `2px solid ${activeSection === item ? 'var(--blue)' : 'transparent'}`,
                    transition: 'all .15s',
                  }}
                  onMouseEnter={e => { if (activeSection !== item) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                  onMouseLeave={e => { if (activeSection !== item) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, padding: '48px 60px', maxWidth: 860, overflowY: 'auto' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            {SIDEBAR.find(g => g.items.includes(activeSection))?.section.split(' ').map((b) => (
              <span key={b} style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b} ›</span>
            ))}
            <span style={{ fontSize: 12, color: 'var(--blue-light)', fontWeight: 600 }}>{activeSection}</span>
          </div>

          {/* Page content */}
          {ContentComponent ? <ContentComponent /> : <DefaultContent title={activeSection} />}

          {/* Navigation footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
            {(() => {
              const all = SIDEBAR.flatMap(g => g.items);
              const idx = all.indexOf(activeSection);
              return (
                <>
                  {idx > 0
                    ? <button onClick={() => setActiveSection(all[idx - 1])} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}>← {all[idx - 1]}</button>
                    : <div />}
                  {idx < all.length - 1
                    ? <button onClick={() => setActiveSection(all[idx + 1])} style={{ background: 'linear-gradient(135deg,var(--blue),var(--indigo))', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{all[idx + 1]} →</button>
                    : <div />}
                </>
              );
            })()}
          </div>
        </main>
      </div>
    </MarketingLayout>
  );
}
