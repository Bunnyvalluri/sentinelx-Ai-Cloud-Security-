import AppLayout from '../components/AppLayout';
import { useState, useEffect } from 'react';

const LOGS = [
  { ts: '2023-11-20\n14:22:01.442', src: 'AWS', sev: 'CRITICAL', msg: 'Unauthorized API call: iam:DeleteUser by root-account', rid: 'i-04f12...a9c', highlight: 'iam:DeleteUser' },
  { ts: '2023-11-20\n14:21:55.109', src: 'GCP', sev: 'WARNING', msg: 'High disk latency detected on compute-node-us-east1', rid: 'gcp-vm-88221' },
  { ts: '2023-11-20\n14:20:44.002', src: 'AWS', sev: 'INFO', msg: 'User login successful: developer_admin (MFA verified)', rid: 'iam-user-41' },
  { ts: '2023-11-20\n14:18:33.712', src: 'AWS', sev: 'CRITICAL', msg: 'S3 bucket policy changed to Public Read', rid: 's3-prod-assets', highlight: 'Public Read' },
  { ts: '2023-11-20\n14:15:00.899', src: 'GCP', sev: 'INFO', msg: 'Auto-scaling group triggered: Scaling out +2 instances', rid: 'asg-web-pool' },
];

const SEV = {
  CRITICAL: { bg: 'var(--red-dim)', c: 'var(--red)', b: 'rgba(239,68,68,.3)' },
  WARNING: { bg: 'var(--yellow-dim)', c: 'var(--yellow)', b: 'rgba(245,158,11,.3)' },
  INFO: { bg: 'var(--blue-dim)', c: 'var(--blue-light)', b: 'rgba(16, 185, 129,.3)' },
};
const SRC = {
  AWS: { bg: 'rgba(245,158,11,.12)', c: '#fbbf24', b: 'rgba(245,158,11,.3)' },
  GCP: { bg: 'var(--blue-dim)', c: '#60a5fa', b: 'rgba(16, 185, 129,.3)' },
  Azure: { bg: 'rgba(16, 185, 129,.12)', c: '#60a5fa', b: 'rgba(16, 185, 129,.3)' }
};

export default function LogExplorer() {
  const [src, setSrc] = useState('All Providers');
  const [sev, setSev] = useState('Any');
  const [time, setTime] = useState('Last 24 Hours');
  const [region, setRegion] = useState('Global');
  const [logs, setLogs] = useState(LOGS);
  const [isLive, setIsLive] = useState(true);
  const [page, setPage] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const msgs = [
        { src: 'AWS', sev: 'INFO', msg: 'System check complete on edge router.' },
        { src: 'GCP', sev: 'WARNING', msg: 'Elevated CPU on auto-scaling group.' },
        { src: 'Azure', sev: 'INFO', msg: 'Database backup successfully taken.' },
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      const now = new Date();
      const newLog = {
        ts: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}\n${now.toLocaleTimeString('en-US', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`,
        src: randomMsg.src,
        sev: randomMsg.sev,
        msg: randomMsg.msg,
        rid: `i-${Math.random().toString(36).substr(2, 6)}`
      };
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["TIMESTAMP", "SOURCE", "SEVERITY", "MESSAGE", "RESOURCE ID"].join(",") + "\n"
      + logs.map(e => [e.ts.replace(/\n/g, " "), e.src, e.sev, `"${e.msg.replace(/"/g, '""')}"`, e.rid].join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "logs_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    const sqlText = "SELECT * FROM cloud_logs WHERE severity = 'CRITICAL' AND timestamp > NOW() - INTERVAL '1 day' ORDER BY timestamp DESC;";
    navigator.clipboard.writeText(sqlText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setSrc('All Providers');
    setSev('Any');
    setTime('Last 24 Hours');
    setRegion('Global');
  };

  return (
    <AppLayout title="Cloud Log Explorer" subtitle="Real-time auditing and forensic analysis of cloud infrastructure logs." bgClass="bg-gradient-logs">
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 26, fontWeight: 800, color: '#fff' }}>Unified Log Stream</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setIsLive(!isLive)} className={isLive ? "btn btn-primary" : "btn btn-outline"} style={{ gap: 6 }}>
            {isLive ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }} /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)' }} />}
            {isLive ? 'Live Stream' : 'Paused Stream'}
          </button>
          <button onClick={handleExport} className="btn btn-outline" style={{ gap: 6 }}>⬇ Export CSV</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Source', val: src, set: setSrc, opts: ['All Providers', 'AWS', 'GCP', 'Azure'] },
            { label: 'Severity', val: sev, set: setSev, opts: ['Any', 'Critical', 'Warning', 'Info'] },
            { label: 'Time', val: time, set: setTime, opts: ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'] },
            { label: 'Region', val: region, set: setRegion, opts: ['Global', 'US-East-1', 'EU-West-1'] },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{f.label}</span>
              <select value={f.val} onChange={e => f.set(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '6px 12px', color: '#fff', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
                {f.opts.map(o => <option key={o} style={{ background: 'var(--bg-card)', color: '#fff' }}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing {logs.length} logs</span>
            <button onClick={handleClear} className="btn" style={{ fontSize: 12, color: 'var(--text-muted)', background: 'transparent', padding: 0 }}>Clear All</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        <div>
          {/* Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr><th>TIMESTAMP</th><th>SOURCE</th><th>SEVERITY</th><th>EVENT MESSAGE</th><th>RESOURCE ID</th></tr>
              </thead>
              <tbody>
                {logs.map((l, i) => {
                  const sv = SEV[l.sev] || SEV['INFO'];
                  const sr = SRC[l.src] || SRC['AWS'];
                  return (
                    <tr key={l.ts + i}>
                      <td><span className="tag" style={{ color: 'var(--text-muted)', fontSize: 11, whiteSpace: 'pre-line' }}>{l.ts}</span></td>
                      <td>
                        <span style={{ background: sr.bg, color: sr.c, border: `1px solid ${sr.b}`, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{l.src}</span>
                      </td>
                      <td>
                        <span style={{ background: sv.bg, color: sv.c, border: `1px solid ${sv.b}`, borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: sv.c, flexShrink: 0 }} />
                          {l.sev}
                        </span>
                      </td>
                      <td style={{ maxWidth: 280 }}>
                        <span style={{ color: 'var(--text-primary)', fontSize: 13, fontFamily: l.sev !== 'INFO' ? 'JetBrains Mono,monospace' : 'inherit', lineHeight: 1.5 }}>
                          {l.highlight
                            ? <>{l.msg.split(l.highlight)[0]}<span style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'underline' }}>{l.highlight}</span>{l.msg.split(l.highlight)[1]}</>
                            : l.msg}
                        </span>
                      </td>
                      <td><span className="tag" style={{ color: 'var(--cyan)' }}>{l.rid}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>Logs per page: 50</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{(page - 1) * 50 + 1} – {page * 50} of {logs.length}</span>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} className="icon-btn" style={{ width: 28, height: 28 }}>‹</button>
                <button onClick={() => setPage(p => p + 1)} className="icon-btn" style={{ width: 28, height: 28 }}>›</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <div>
          {/* SQL query preview */}
          <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)' }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: 'var(--blue-light)' }}>SQL QUERY PREVIEW</span>
              <button onClick={handleCopy} style={{ background: 'transparent', border: 'none', color: isCopied ? 'var(--green)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>{isCopied ? '✓ Copied' : '⧉ Copy'}</button>
            </div>
            <div className="code-block" style={{ borderRadius: 0, border: 'none', padding: '20px', fontSize: 13, background: 'var(--bg-void)', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--violet-light)' }}>SELECT</span> * <span style={{ color: 'var(--violet-light)' }}>FROM</span> cloud_logs{'\n'}
              <span style={{ color: 'var(--violet-light)' }}>WHERE</span> severity = <span style={{ color: 'var(--green)' }}>'CRITICAL'</span>{'\n'}
              <span style={{ color: 'var(--violet-light)' }}>AND</span> timestamp {'>'} <span style={{ color: 'var(--blue-light)' }}>NOW()</span> - <span style={{ color: 'var(--green)' }}>INTERVAL '1 day'</span>{'\n'}
              <span style={{ color: 'var(--violet-light)' }}>ORDER BY</span> timestamp <span style={{ color: 'var(--violet-light)' }}>DESC</span>;
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Log Volume (24h)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
              {[30, 45, 20, 60, 80, 50, 40, 70, 90, 60, 40, 30].map((v, i) => (
                <div key={i} style={{ flex: 1, background: i === 8 ? 'var(--red)' : 'var(--blue-light)', height: `${v}%`, borderRadius: '3px 3px 0 0', opacity: i === 8 ? 1 : 0.4 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
              <span>00:00</span>
              <span style={{ color: 'var(--red)', fontWeight: 700 }}>Peak Anomaly</span>
              <span>24:00</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
