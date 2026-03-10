import MarketingLayout from '../../components/MarketingLayout';
import { Link } from 'react-router-dom';

const OPENINGS = [
  { team: 'Engineering', role: 'Senior Detection Engineer', loc: 'San Francisco / Remote', type: 'Full-time', badge: '🔥 HOT' },
  { team: 'Engineering', role: 'Staff ML Engineer — Anomaly Detection', loc: 'Remote (US / EU)', type: 'Full-time', badge: '' },
  { team: 'Engineering', role: 'Backend Engineer — Data Pipeline', loc: 'San Francisco', type: 'Full-time', badge: '' },
  { team: 'Engineering', role: 'Frontend Engineer — React / TypeScript', loc: 'Remote (US)', type: 'Full-time', badge: '🔥 HOT' },
  { team: 'Security Research', role: 'Threat Intelligence Analyst', loc: 'Washington DC / Remote', type: 'Full-time', badge: '' },
  { team: 'Security Research', role: 'Red Team Engineer', loc: 'Remote (Worldwide)', type: 'Full-time', badge: '' },
  { team: 'Product', role: 'Product Manager — Platform', loc: 'San Francisco', type: 'Full-time', badge: '' },
  { team: 'Sales & GTM', role: 'Enterprise Account Executive (EMEA)', loc: 'London / Amsterdam', type: 'Full-time', badge: '🔥 HOT' },
  { team: 'Sales & GTM', role: 'Solutions Engineer (APAC)', loc: 'Singapore / Sydney', type: 'Full-time', badge: '' },
  { team: 'Customer Success', role: 'Senior Security Customer Success Mgr', loc: 'Remote (US)', type: 'Full-time', badge: '' },
];

const BENEFITS = [
  { icon: '💰', title: 'Top-of-market compensation', desc: 'Salary benchmarked at the 95th percentile with meaningful equity across all levels.' },
  { icon: '🏥', title: 'Platinum health benefits', desc: 'Full medical, dental, and vision coverage for you and your family — 100% company-paid premiums.' },
  { icon: '🏡', title: 'Remote-first culture', desc: '75% of our team works remotely. Quarterly in-person offsites in exciting global cities.' },
  { icon: '📚', title: '$5,000 learning stipend', desc: 'Annual budget for conferences, certifications (CISSP, CEH, OSCP), and courses.' },
  { icon: '🛑', title: 'Unlimited PTO', desc: 'We mean it — 5 mandatory weeks minimum, tracked and enforced by your manager.' },
  { icon: '👶', title: '16 weeks parental leave', desc: 'Fully paid for all new parents — birth, adoption, or foster placement.' },
];

const TEAMS = ['All', 'Engineering', 'Security Research', 'Product', 'Sales & GTM', 'Customer Success'];

export default function Careers() {
  return (
    <MarketingLayout>
      <section style={{ padding: '100px 48px 72px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,200,14,0.1)', border: '1px solid rgba(249,200,14,0.25)', padding: '6px 16px', borderRadius: 100, color: '#f9c80e', fontSize: 12, fontWeight: 700, marginBottom: 24 }}>🚀 WE'RE HIRING — {OPENINGS.length} OPEN ROLES</div>
        <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 52, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 20, letterSpacing: -1 }}>
          Join the team securing<br /><span style={{ background: 'linear-gradient(90deg,#f9c80e,#ff6b2b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>the world's enterprises</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.75 }}>
          We're a team of 400+ security engineers, ML researchers, and builders on a mission to democratize enterprise-grade security. Come solve the hardest problems in cloud threat detection.
        </p>
      </section>

      {/* Benefits */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 64px' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 32, textAlign: 'center' }}>Why SentinelX?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {BENEFITS.map(b => (
            <div key={b.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16, 185, 129,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 16, marginBottom: 8 }}>{b.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Open Roles */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 100px' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 32 }}>Open Positions</h2>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
          {OPENINGS.map((job, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '20px 28px', borderBottom: i < OPENINGS.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background .2s', cursor: 'pointer', gap: 16 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 16 }}>{job.role}</span>
                  {job.badge && <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(255,59,107,0.18)', color: '#ff3b6b', border: '1px solid rgba(255,59,107,0.3)', borderRadius: 100, padding: '2px 8px' }}>{job.badge}</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                  <span>📂 {job.team}</span>
                  <span>📍 {job.loc}</span>
                  <span>⏱ {job.type}</span>
                </div>
              </div>
              <button onClick={() => alert('Demo Mode: Feature coming soon!')} style={{ background: 'rgba(16, 185, 129,0.1)', color: 'var(--blue-light)', border: '1px solid rgba(16, 185, 129,0.3)', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Apply →</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)', fontSize: 15 }}>
          Don't see your role? <a href="mailto:careers@sentinelx.ai" style={{ color: 'var(--blue-light)', fontWeight: 600 }}>Send us your resume</a> — we're always looking for exceptional people.
        </div>
      </section>
    </MarketingLayout>
  );
}
