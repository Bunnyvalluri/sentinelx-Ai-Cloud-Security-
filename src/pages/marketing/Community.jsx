import MarketingLayout from '../../components/MarketingLayout';

const THREADS = [
  { avatar: 'SC', bg: 'linear-gradient(135deg,#10b981,#22d3ee)', author: 'sarah_chen_sec', role: 'Security Engineer @ Stripe', time: '2h ago', tag: 'Detection', title: 'How to detect AWS STS AssumeRole abuse with SentinelX?', replies: 14, votes: 47, pinned: true },
  { avatar: 'MR', bg: 'linear-gradient(135deg,#f59e0b,#fbbf24)', author: 'marcus_r_ops', role: 'SecOps Lead @ Coinbase', time: '5h ago', tag: 'Integration', title: 'Best practices for ingesting Kubernetes audit logs at scale?', replies: 9, votes: 32, pinned: false },
  { avatar: 'PP', bg: 'linear-gradient(135deg,#22d3ee,#34d399)', author: 'priya_threat_hunt', role: 'Threat Hunter @ Crowdstrike', time: '1d ago', tag: 'Query', title: 'Sharing my SQL query library for detecting lateral movement in Azure AD', replies: 22, votes: 86, pinned: false },
  { avatar: 'JO', bg: 'linear-gradient(135deg,#fbbf24,#f97316)', author: 'james_infra', role: 'Platform Engineer @ Datadog', time: '2d ago', tag: 'API', title: 'SentinelX REST API v2 migration guide — what changed in per_page defaults?', replies: 6, votes: 21, pinned: false },
  { avatar: 'EV', bg: 'linear-gradient(135deg,#f97316,#ef4444)', author: 'elena_compliance', role: 'CISO @ healthcare startup', time: '3d ago', tag: 'Compliance', title: 'HIPAA + SOC2 overlap: how are others structuring their audit export schedules?', replies: 18, votes: 63, pinned: false },
];

const EVENTS = [
  { date: 'Nov 12, 2024', title: 'SentinelX Community AMA', desc: 'Live Q&A with our engineering team. Submit questions in advance.' },
  { date: 'Nov 19, 2024', title: 'Webinar: Kubernetes Threat Hunting 101', desc: 'Hands-on walkthrough with our k8s expert.' },
  { date: 'Dec 4, 2024', title: 'Community Hack Day', desc: 'Build custom detection rules and win SentinelX swag.' },
];

const TAG_COLORS = { Detection: '#10b981', Integration: '#22d3ee', Query: '#f59e0b', API: '#fbbf24', Compliance: '#34d399' };

export default function Community() {
  return (
    <MarketingLayout>
      <section style={{ padding: '100px 48px 60px', textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', padding: '6px 16px', borderRadius: 100, color: 'var(--cyan)', fontSize: 12, fontWeight: 700, marginBottom: 24 }}>👥 COMMUNITY HUB</div>
        <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 18, letterSpacing: -1 }}>
          Learn, share, and build<br /><span style={{ background: 'linear-gradient(90deg,#22d3ee,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>with 12,000+ security pros</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7 }}>The SentinelX Community is where security engineers, threat hunters, and compliance teams collaborate — sharing detection rules, discussing threats, and helping each other get the most out of the platform.</p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 40 }}>
          {[{ val: '12,400+', label: 'Members' }, { val: '3,200', label: 'Threads' }, { val: '97%', label: 'Questions answered' }, { val: '<4h', label: 'Avg response time' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 30, fontWeight: 900, color: 'var(--blue-light)', marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 24, fontWeight: 800, color: '#fff' }}>Recent Discussions</h2>
            <button className="btn btn-primary" onClick={() => alert('Demo Mode: Feature coming soon!')}>+ New Thread</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {THREADS.map((t, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: `1px solid ${t.pinned ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: 16, padding: '22px 24px', cursor: 'pointer', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s', display: 'flex', gap: 16, alignItems: 'flex-start' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.pinned ? 'rgba(16,185,129,0.3)' : 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    {t.pinned && <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--blue-light)', padding: '2px 8px', borderRadius: 100, fontSize: 9, fontWeight: 800, border: '1px solid rgba(16,185,129,0.35)' }}>📌 PINNED</span>}
                    <span style={{ background: `${TAG_COLORS[t.tag]}18`, color: TAG_COLORS[t.tag], padding: '2px 10px', borderRadius: 100, fontSize: 10, fontWeight: 800, border: `1px solid ${TAG_COLORS[t.tag]}35` }}>{t.tag}</span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 6, lineHeight: 1.4 }}>{t.title}</div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--blue-light)', fontWeight: 600 }}>@{t.author}</span>
                    <span>{t.role}</span>
                    <span>{t.time}</span>
                    <span>💬 {t.replies} replies</span>
                    <span>▲ {t.votes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 18 }}>Upcoming Events</h3>
            {EVENTS.map((ev, i) => (
              <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < EVENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue-light)', marginBottom: 4 }}>{ev.date}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>{ev.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ev.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 18 }}>Join the Community</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 18 }}>Connect with security engineers on Slack, GitHub, and Discord. Share detection rules and get help in real-time.</p>
            {[{ icon: '💬', label: 'Join Slack Community', color: '#4a154b' }, { icon: '🐙', label: 'GitHub Discussions', color: '#333' }, { icon: '🎮', label: 'Discord Server', color: '#5865f2' }].map(s => (
              <button onClick={() => alert('Demo Mode: Feature coming soon!')} key={s.label} className="btn btn-outline justify-start w-full mb-3 text-sm py-3 px-4">
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
