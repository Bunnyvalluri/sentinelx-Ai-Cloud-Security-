import { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '../components/AppLayout';

/* ─── helpers ─── */
const pad = n => String(n).padStart(2, '0');
const nowStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}\n${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} UTC`;
};
const fakeHash = () => {
  const hex = '0123456789abcdef';
  return '0x' + Array.from({ length: 40 }, () => hex[Math.floor(Math.random() * 16)]).join('');
};

/* ─── data pools ─── */
const ACTORS = [
  { actor: 'j.doe@sentinelx.ai', initials: 'JD' },
  { actor: 'a.miller@sentinelx.ai', initials: 'AM' },
  { actor: 's.smith@sentinelx.ai', initials: 'SS' },
  { actor: 'service-account-04', initials: 'SA' },
  { actor: 'network-ops', initials: 'NO' },
  { actor: 'eks-node-04', initials: 'EK' },
  { actor: 'system-core', initials: 'SC' },
  { actor: 'sec-bot@sentinelx.ai', initials: 'SB' },
];

const EVENT_TEMPLATES = [
  { action: 'IAM_USER_LOGIN', icon: '→', category: 'AUTH' },
  { action: 'S3_POLICY_UPDATE', icon: '⚙', category: 'CONFIG' },
  { action: 'ALERT_RESOLVED', icon: '🔔', category: 'ALERT' },
  { action: 'IAM_ACCESS_KEY_DELETED', icon: '✖', category: 'IAM' },
  { action: 'CLI_SESSION_START', icon: '▣', category: 'SESSION' },
  { action: 'VPC_ROUTE_CHANGE', icon: '🔀', category: 'NETWORK' },
  { action: 'KMS_KEY_ACCESS', icon: '🔑', category: 'CRYPTO' },
  { action: 'CONTAINER_STARTED', icon: '📦', category: 'COMPUTE' },
  { action: 'EC2_INSTANCE_STOP', icon: '⏹', category: 'COMPUTE' },
  { action: 'RDS_BACKUP_COMPLETE', icon: '💾', category: 'DATABASE' },
  { action: 'SSL_CERT_RENEWED', icon: '🔒', category: 'SECURITY' },
  { action: 'FIREWALL_RULE_ADDED', icon: '🛡', category: 'NETWORK' },
  { action: 'USER_ROLE_CHANGED', icon: '👤', category: 'IAM' },
  { action: 'MFA_ENFORCED', icon: '📱', category: 'AUTH' },
  { action: 'AUDIT_EXPORT', icon: '📤', category: 'AUDIT' },
  { action: 'POLICY_VIOLATION', icon: '⚠', category: 'ALERT' },
  { action: 'SECRETS_ROTATED', icon: '🔄', category: 'CRYPTO' },
  { action: 'COMPLIANCE_SCAN_DONE', icon: '✅', category: 'AUDIT' },
];

const RESOURCES = [
  'Management Console', 'prod-billing-records', 'IDP-Anomalous-Login',
  'User: backup-agent-01', 'Global API Gateway', 'vpc-main-01',
  'key/prod-db-enc', 'auth-service-v2', 'rds-cluster-prod',
  'ec2-bastion-02', 's3://logs-archive', 'lambda:report-gen',
];

const buildLog = () => {
  const tpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
  const act = ACTORS[Math.floor(Math.random() * ACTORS.length)];
  return {
    ...tpl, ...act,
    resource: RESOURCES[Math.floor(Math.random() * RESOURCES.length)],
    ts: nowStr(),
    integrity: 'TAMPER-EVIDENT',
    hash: fakeHash(),
    id: 'l' + Date.now() + Math.random(),
  };
};

const INITIAL_LOGS = Array.from({ length: 8 }, buildLog);

const TIME_RANGES = ['Last 1 Hour', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom'];
const CATEGORIES = ['ALL', 'AUTH', 'IAM', 'NETWORK', 'CONFIG', 'CRYPTO', 'COMPUTE', 'DATABASE', 'SECURITY', 'AUDIT', 'ALERT', 'SESSION'];

/* ─── tiny toast helper ─── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  return { toasts, push };
}

export default function ComplianceAudit() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState('Last 24 Hours');
  const [category, setCategory] = useState('ALL');
  const [paused, setPaused] = useState(false);
  const [lastLogTime, setLastLogTime] = useState('Just now');
  const [totalLogs, setTotalLogs] = useState(1248592);
  const [hashModal, setHashModal] = useState(null);
  const [reportModal, setReportModal] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportDone, setReportDone] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyOk, setVerifyOk] = useState(true);
  const [sortDesc, setSortDesc] = useState(true);
  const [exportBusy, setExportBusy] = useState(false);
  const [newRowIds, setNewRowIds] = useState(new Set());
  const secsRef = useRef(0);
  const pausedRef = useRef(false);
  const { toasts, push } = useToast();

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  /* ── live stream ── */
  useEffect(() => {
    const ticker = setInterval(() => {
      secsRef.current++;
      setLastLogTime(secsRef.current < 60
        ? `${secsRef.current}s ago`
        : `${Math.floor(secsRef.current / 60)}m ${secsRef.current % 60}s ago`);
    }, 1000);

    const streamer = setInterval(() => {
      if (pausedRef.current) return;
      if (Math.random() > 0.35) {
        const newLog = buildLog();
        setLogs(prev => [newLog, ...prev].slice(0, 50));
        setNewRowIds(prev => new Set([...prev, newLog.id]));
        setTimeout(() => setNewRowIds(prev => { const n = new Set(prev); n.delete(newLog.id); return n; }), 800);
        setTotalLogs(p => p + 1);
        secsRef.current = 0;
        setLastLogTime('Just now');
      }
    }, 2800);

    return () => { clearInterval(ticker); clearInterval(streamer); };
  }, []);

  /* ── filters ── */
  const filtered = logs
    .filter(l => category === 'ALL' || l.category === category)
    .filter(l =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));

  /* ── export CSV ── */
  const handleExport = useCallback(() => {
    if (exportBusy) return;
    setExportBusy(true);
    push('Preparing CSV export…', 'info');
    setTimeout(() => {
      const header = 'Timestamp,Action,Category,Actor,Resource,Integrity,Hash';
      const rows = logs.map(l =>
        `"${l.ts.replace(/\n/, ' ')}","${l.action}","${l.category}","${l.actor}","${l.resource}","${l.integrity}","${l.hash}"`
      ).join('\n');
      const blob = new Blob([header + '\n' + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `sentinelx_audit_${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
      setExportBusy(false);
      push(`✅ Exported ${logs.length} records successfully`, 'success');
    }, 1200);
  }, [logs, exportBusy, push]);

  /* ── report generator ── */
  const handleReport = useCallback(() => {
    setReportModal(true);
    setReportProgress(0);
    setReportDone(false);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 12) + 3;
      if (p >= 100) { p = 100; clearInterval(iv); setReportDone(true); push('📄 Compliance report ready!', 'success'); }
      setReportProgress(p);
    }, 200);
  }, [push]);

  /* ── integrity re-verify ── */
  const handleVerify = useCallback(() => {
    setVerifying(true);
    push('⛓ Running blockchain integrity check…', 'info');
    setTimeout(() => {
      setVerifying(false);
      setVerifyOk(true);
      push('✅ All 1,248,592 records verified — chain intact', 'success');
    }, 2800);
  }, [push]);

  /* ── hash modal ── */
  const openHash = log => setHashModal(log);

  /* ── copy hash ── */
  const copyHash = hash => {
    navigator.clipboard.writeText(hash).then(() => push('🔑 Hash copied to clipboard', 'success'));
  };

  /* ── clear logs ── */
  const clearStream = () => { setLogs(INITIAL_LOGS); push('Stream buffer cleared', 'info'); };

  const catColor = cat => ({
    AUTH: '#10b981', IAM: '#f59e0b', NETWORK: '#3b82f6', CONFIG: '#f59e0b',
    CRYPTO: '#10b981', COMPUTE: '#06b6d4', DATABASE: '#ec4899', SECURITY: '#ef4444',
    AUDIT: '#fbbf24', ALERT: '#f97316', SESSION: '#14b8a6',
  }[cat] || '#64748b');

  return (
    <AppLayout
      title="Compliance Audit Logs"
      subtitle="Tamper-evident, immutable records of all system activity. Protected by AES-256 blockchain hashing."
      bgClass="bg-gradient-compliance"
    >

      {/* ─── Toast Rack ─── */}
      <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'success' ? 'rgba(16,185,129,.15)' : 'rgba(59,130,246,.15)',
            border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,.4)' : 'rgba(59,130,246,.4)'}`,
            color: '#fff', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 600,
            backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,.4)',
            animation: 'slideIn .3s ease-out',
          }}>{t.msg}</div>
        ))}
      </div>

      {/* ─── Action Bar ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={handleExport}
            disabled={exportBusy}
            className="btn btn-outline"
            style={{ fontSize: 12, gap: 6, opacity: exportBusy ? .6 : 1 }}
          >
            {exportBusy ? '⏳ Exporting…' : '⬇ Export CSV'}
          </button>
          <button
            onClick={handleReport}
            className="btn btn-primary"
            style={{ fontSize: 12 }}
          >
            📄 Report Generator
          </button>
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="btn btn-outline"
            style={{ fontSize: 12, borderColor: 'var(--green)', color: 'var(--green)', opacity: verifying ? .7 : 1 }}
          >
            {verifying ? '⛓ Verifying…' : '⛓ Verify Integrity'}
          </button>
          <button
            onClick={() => { setPaused(p => !p); push(paused ? '▶ Stream resumed' : '⏸ Stream paused', 'info'); }}
            className="btn btn-outline"
            style={{ fontSize: 12, borderColor: paused ? 'var(--green)' : '#f59e0b', color: paused ? 'var(--green)' : '#f59e0b' }}
          >
            {paused ? '▶ Resume Stream' : '⏸ Pause Stream'}
          </button>
          <button onClick={clearStream} className="btn btn-outline" style={{ fontSize: 12 }}>🗑 Clear Buffer</button>
        </div>

        {/* live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: paused ? '#f59e0b' : 'var(--green)',
            boxShadow: paused ? '0 0 8px #f59e0b' : '0 0 8px var(--green)',
            display: 'inline-block',
            animation: paused ? 'none' : 'pulse 1.5s infinite',
          }} />
          {paused ? 'PAUSED' : 'LIVE STREAM'} &nbsp;·&nbsp; {totalLogs.toLocaleString()} total events
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Verified Logs', val: totalLogs.toLocaleString(), sub: '↑ 12% vs last month', subC: 'var(--green)' },
          { label: 'Integrity Status', val: '100%', sub: 'Chain of custody intact', valC: 'var(--green)', icon: '✅' },
          { label: 'Audit Coverage', val: 'SOC2, GDPR, HIPAA', sub: '3 frameworks monitored', small: true },
          { label: 'Last Log Entry', val: lastLogTime, sub: 'Continuous streaming active' },
        ].map(s => (
          <div className="metric-card" key={s.label}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: .8, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>{s.label}</div>
            <div className="hero-text-primary" style={{ fontSize: s.small ? 18 : 28, fontWeight: 800, fontFamily: 'Outfit,sans-serif', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s' }}>
              {s.icon && <span role="img" aria-label={s.label}>{s.icon}</span>}{s.val}
            </div>
            {s.sub && <div style={{ fontSize: 12, color: s.subC || 'var(--text-muted)', fontWeight: s.subC ? 700 : 500 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Time Range */}
          <select
            value={timeRange}
            onChange={e => { setTimeRange(e.target.value); push(`⏱ Range set: ${e.target.value}`, 'info'); }}
            style={{ background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}
          >
            {TIME_RANGES.map(r => <option key={r}>{r}</option>)}
          </select>

          {/* Sort toggle */}
          <button
            onClick={() => setSortDesc(p => !p)}
            className="icon-btn"
            style={{ width: 34, height: 34, fontSize: 14 }}
            title="Toggle sort order"
          >
            {sortDesc ? '↓' : '↑'}
          </button>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                  background: category === cat ? (cat === 'ALL' ? 'var(--blue)' : catColor(cat)) : 'var(--bg-secondary)',
                  color: category === cat ? '#fff' : 'var(--text-muted)',
                  transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s',
                }}
              >{cat}</button>
            ))}
          </div>

          {/* Search */}
          <div className="search-input" style={{ width: 260 }}>
            <input
              placeholder="Search action, actor, resource…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ─── Audit Table ─── */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .8 }}>
            Audit Event Stream
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Showing {filtered.length} / {totalLogs.toLocaleString()} logs
          </span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>ACTION</th>
              <th>CATEGORY</th>
              <th>ACTOR</th>
              <th>RESOURCE</th>
              <th>INTEGRITY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr
                key={l.id}
                style={{
                  animation: newRowIds.has(l.id) ? 'flashNew .8s ease-out' : 'fadeIn .4s ease-out',
                  background: newRowIds.has(l.id) ? 'rgba(59,130,246,.07)' : 'transparent',
                  transition: 'background .5s',
                }}
              >
                <td><span className="tag" style={{ color: 'var(--text-muted)', fontSize: 11, whiteSpace: 'pre-line' }}>{l.ts}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{l.icon}</span>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#fff', fontWeight: 600 }}>{l.action}</span>
                  </div>
                </td>
                <td>
                  <span style={{ background: `${catColor(l.category)}22`, color: catColor(l.category), border: `1px solid ${catColor(l.category)}55`, borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 800, letterSpacing: .5 }}>
                    {l.category}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{l.initials}</div>
                    <span style={{ color: 'var(--blue-light)', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>{l.actor}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{l.resource}</td>
                <td>
                  <span style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    🛡️ {l.integrity}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => openHash(l)}
                      className="btn btn-outline"
                      style={{ padding: '5px 10px', fontSize: 10 }}
                    >View Hash</button>
                    <button
                      onClick={() => { push(`📋 Log ${l.action} copied`, 'success'); navigator.clipboard.writeText(`${l.ts.replace(/\n/, ' ')} | ${l.action} | ${l.actor} | ${l.resource} | ${l.hash}`); }}
                      className="icon-btn"
                      style={{ width: 28, height: 28, fontSize: 12 }}
                      title="Copy log line"
                    >📋</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>No logs match current filters</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>Buffer: {logs.length} / 50 rows (oldest auto-pruned)</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>Auto-refresh:</span>
            <button
              onClick={() => setPaused(p => !p)}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                background: paused ? 'rgba(16,185,129,.15)' : 'rgba(245,158,11,.15)',
                color: paused ? 'var(--green)' : '#f59e0b',
              }}
            >{paused ? '▶ ON' : '⏸ OFF'}</button>
          </div>
        </div>
      </div>

      {/* ─── Bottom 3-col ─── */}
      <div className="grid-3">
        <div className="card" style={{ padding: 24 }}>
          <div style={{ color: 'var(--blue-light)', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>🛡 SentinelX Audit Engine</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
            Our proprietary immutable logging engine ensures that once an event is recorded, it cannot be deleted, modified, or
            reordered without detection. Designed for rigorous compliance audits.
          </p>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'AES-256 Encryption', val: 'Active' },
              { label: 'Chain Depth', val: `${(totalLogs).toLocaleString()} blocks` },
              { label: 'Block Time', val: '~2.8s avg' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase' }}>COMPLIANCE PORTALS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'GDPR Data Processing Agreement', badge: '✓ Compliant' },
              { label: 'SOC2 Trust Principles', badge: '✓ Compliant' },
              { label: 'ISO 27001 Controls Mapping', badge: '✓ Compliant' },
              { label: 'HIPAA Safeguards Report', badge: '✓ Compliant' },
              { label: 'Internal Privacy Policy', badge: '↗ Updated' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', font: 'inherit', color: 'var(--text-secondary)', fontSize: 13, transition: 'color .2s', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--blue-light)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  onClick={() => push(`📄 Opening ${l.label}…`, 'info')}
                >
                  <span style={{ color: 'var(--blue)' }}>▸</span> {l.label}
                </button>
                <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, marginLeft: 8, flexShrink: 0 }}>{l.badge}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase' }}>INTEGRITY VERIFICATION</div>
          <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 10, padding: 18, marginBottom: 14 }}>
            <div style={{ color: 'var(--green)', fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              {verifying ? '⏳ Verifying…' : (verifyOk ? '✅ Node Consensus: VALID' : '❌ Integrity Error')}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--text-muted)', wordBreak: 'break-all', lineHeight: 1.6 }}>
              0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b<br />2b0b822cd15d6c15b0f06a08
            </div>
          </div>
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="btn btn-outline"
            style={{ width: '100%', fontSize: 12, borderColor: 'var(--green)', color: 'var(--green)', opacity: verifying ? .6 : 1 }}
          >
            {verifying ? '⏳ Running Verification…' : '⛓ Re-Verify Chain Now'}
          </button>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Last full scan: just now · Next auto-scan: 5m
          </div>
        </div>
      </div>

      {/* ─── Hash Modal ─── */}
      {hashModal && (
        <div
          onClick={() => setHashModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: 520, maxWidth: '90vw', boxShadow: '0 24px 80px rgba(0,0,0,.6)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>🔑 Audit Log Hash</div>
              <button onClick={() => setHashModal(null)} className="icon-btn" style={{ width: 32, height: 32 }}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .8 }}>Event</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: '#fff', fontWeight: 600 }}>{hashModal.action}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .8 }}>Actor</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--blue-light)' }}>{hashModal.actor}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .8 }}>Timestamp</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{hashModal.ts.replace(/\n/, ' ')}</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .8 }}>SHA-256 Block Hash</div>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--green)', wordBreak: 'break-all', lineHeight: 1.7 }}>
                {hashModal.hash}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => copyHash(hashModal.hash)}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: 12 }}
              >📋 Copy Hash</button>
              <button
                onClick={() => { push('🔗 Viewing on chain explorer (demo)', 'info'); }}
                className="btn btn-outline"
                style={{ flex: 1, fontSize: 12 }}
              >🔗 Chain Explorer</button>
              <button onClick={() => setHashModal(null)} className="btn btn-outline" style={{ fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Report Modal ─── */}
      {reportModal && (
        <div
          onClick={() => { if (reportDone) setReportModal(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 36, width: 480, maxWidth: '90vw', boxShadow: '0 24px 80px rgba(0,0,0,.6)' }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 8 }}>📄 Compliance Report Generator</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>
              Generating a full audit report covering all {totalLogs.toLocaleString()} log entries across SOC2, GDPR, and HIPAA frameworks.
            </div>

            {/* progress sections */}
            {[
              { label: 'Collecting log data', threshold: 20 },
              { label: 'Applying compliance mappings', threshold: 50 },
              { label: 'Generating SHA-256 checksums', threshold: 75 },
              { label: 'Building PDF document', threshold: 95 },
              { label: 'Finalising & encrypting', threshold: 100 },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: reportProgress >= s.threshold ? 'var(--green)' : 'var(--text-muted)' }}>
                    {reportProgress >= s.threshold ? '✅' : reportProgress > s.threshold - 25 ? '⏳' : '○'} {s.label}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{reportProgress >= s.threshold ? '100%' : `${Math.min(100, Math.floor((reportProgress / (s.threshold)) * 100))}%`}</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${reportProgress >= s.threshold ? 100 : Math.min(100, Math.floor((reportProgress / (s.threshold)) * 100))}%`, background: 'linear-gradient(90deg,#3b82f6,#f59e0b)', borderRadius: 2, transition: 'width .2s' }} />
                </div>
              </div>
            ))}

            {/* overall bar */}
            <div style={{ margin: '20px 0 16px', height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${reportProgress}%`, background: 'linear-gradient(90deg,#3b82f6,var(--green))', borderRadius: 3, transition: 'width .15s' }} />
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              {reportDone ? '🎉 Report ready — 100%' : `Processing… ${reportProgress}%`}
            </div>

            {reportDone ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }}
                  onClick={() => { push('📥 Downloading report (demo)', 'success'); setReportModal(false); }}>
                  📥 Download PDF
                </button>
                <button className="btn btn-outline" style={{ flex: 1, fontSize: 12 }}
                  onClick={() => { push('📧 Report emailed (demo)', 'success'); setReportModal(false); }}>
                  📧 Email Report
                </button>
              </div>
            ) : (
              <button className="btn btn-outline" style={{ width: '100%', fontSize: 12 }}
                onClick={() => setReportModal(false)}>
                Run in Background
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn   { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes flashNew { 0%{background:rgba(59,130,246,.18)} 100%{background:transparent} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </AppLayout>
  );
}
