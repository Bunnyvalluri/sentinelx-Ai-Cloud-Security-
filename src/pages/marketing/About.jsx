import MarketingLayout from '../../components/MarketingLayout';
import { Link } from 'react-router-dom';

const TIMELINE = [
  { year: '2020', title: 'The Founding', desc: 'Frustrated by endless false positives and siloed SIEM tools, our founders (ex-NSA, Datadog, Stripe) began building the first prototype of the CEREBRO engine.' },
  { year: '2021', title: 'Seed Round & Beta', desc: 'Raised $12M from Sequoia and launched private beta with 5 design partners in financial services and healthcare.' },
  { year: '2022', title: 'Series A & GA Release', desc: 'Raised $45M Series A led by Andreessen Horowitz. SentinelX 1.0 launched publicly, introducing our sub-200ms streaming architecture.' },
  { year: '2023', title: 'Expansion & Scale', desc: 'Crossed 1,000 enterprise customers and 1B+ events analyzed per day. Opened engineering hubs in London and Singapore.' },
  { year: '2024', title: 'CEREBRO v3.0 Series B', desc: 'Raised $110M Series B at a $1.2B valuation. Released our neural anomaly detection model, redefining behavioral baseline accuracy.' },
];

const LEADERSHIP = [
  { name: 'Alex Morgan', role: 'Chief Executive Officer', bg: 'linear-gradient(135deg,#10b981,#0f766e)' },
  { name: 'Dr. Sarah Chen', role: 'Chief Technology Officer', bg: 'linear-gradient(135deg,#2dd4bf,#10b981)' },
  { name: 'Marcus Vance', role: 'Chief Information Security Officer', bg: 'linear-gradient(135deg,#b44fff,#7c3aed)' },
  { name: 'Elena Rostova', role: 'VP of Product', bg: 'linear-gradient(135deg,#ff3b6b,#ff6b2b)' },
  { name: 'David Kim', role: 'VP of Engineering', bg: 'linear-gradient(135deg,#fbbf24,#2dd4bf)' },
  { name: 'Priya Desai', role: 'Head of Threat Intelligence', bg: 'linear-gradient(135deg,#f9c80e,#ff6b2b)' },
];

export default function About() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section style={{ padding: '96px 48px 72px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: 7, background: 'rgba(16, 185, 129,0.08)', border: '1px solid rgba(16, 185, 129,0.22)', padding: '5px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, color: 'var(--blue-light)', marginBottom: 26 }}>WHO WE ARE</div>
        <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: -2, marginBottom: 20 }}>
          Defending the cloud<br /><span style={{ background: 'linear-gradient(90deg,#10b981,#2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>requires a neural approach</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.75 }}>
          Traditional SIEMs rely on static rules. But attackers move dynamically. We built SentinelX to give security teams the speed, scale, and intelligence needed to fight back.
        </p>
      </section>

      {/* Mission */}
      <section style={{ padding: '0 48px 88px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'radial-gradient(circle,rgba(16, 185, 129,0.08) 0%,transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, background: 'radial-gradient(circle,rgba(0,255,163,0.05) 0%,transparent 70%)', borderRadius: '50%' }} />

          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 24, zIndex: 1 }}>Our Mission</h2>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 720, lineHeight: 1.8, zIndex: 1 }}>
            "To eliminate the noise in cybersecurity, allowing human defenders to focus entirely on real threats, armed with absolute context and immediate remediation power."
          </p>
          <div style={{ display: 'flex', gap: 32, marginTop: 48, zIndex: 1 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Outfit,sans-serif', color: '#10b981' }}>240+</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>Employees Globally</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Outfit,sans-serif', color: '#2dd4bf' }}>$167M</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>Total Funding</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Outfit,sans-serif', color: '#fbbf24' }}>San Francisco</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>Headquarters</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ padding: '0 48px 88px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 16 }}>Leadership Team</h2>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)' }}>Built by veterans from the NSA, Datadog, Stripe, and CrowdStrike.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {LEADERSHIP.map(person => (
            <div key={person.name} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: person.bg, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#fff' }}>
                {person.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{person.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '88px 48px', maxWidth: 800, margin: '0 auto', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 48, textAlign: 'center' }}>The Journey</h2>
        <div style={{ position: 'relative', paddingLeft: 40 }}>
          <div style={{ position: 'absolute', left: 15, top: 12, bottom: 12, width: 2, background: 'var(--border)' }} />
          {TIMELINE.map((item, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: i === TIMELINE.length - 1 ? 0 : 48 }}>
              <div style={{ position: 'absolute', left: -31, top: 4, width: 12, height: 12, borderRadius: '50%', background: '#10b981', border: '3px solid var(--bg-secondary)' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-light)', letterSpacing: 1, marginBottom: 8 }}>{item.year}</div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '88px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 16 }}>Join the team</h2>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 36px' }}>We're always looking for brilliant engineers, researchers, and builders.</p>
        <Link to="/careers">
          <button onClick={() => alert('Demo Mode: Feature coming soon!')} style={{ background: 'linear-gradient(135deg,#10b981,#0f766e)', color: '#fff', border: 'none', borderRadius: 10, padding: '15px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(16, 185, 129,0.3)' }}>View Open Positions →</button>
        </Link>
      </section>
    </MarketingLayout>
  );
}
