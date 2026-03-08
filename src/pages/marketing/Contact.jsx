import MarketingLayout from '../../components/MarketingLayout';
import { useState } from 'react';

const OFFICES = [
  { city: 'San Francisco (HQ)', emoji: '🇺🇸', addr: '535 Mission Street, 14th Floor\nSan Francisco, CA 94105\nUnited States' },
  { city: 'New York', emoji: '🇺🇸', addr: '200 Park Avenue, 32nd Floor\nNew York, NY 10166\nUnited States' },
  { city: 'London', emoji: '🇬🇧', addr: 'The Gherkin, 30 St Mary Axe\nLondon EC3A 8BF\nUnited Kingdom' },
  { city: 'Singapore', emoji: '🇸🇬', addr: '8 Shenton Way, Level 24\nSingapore 068811' },
];

const INQUIRIES = [
  { type: 'Sales & Demo', email: 'sales@sentinelx.ai', icon: '💼', desc: 'Talk to a security engineer about your specific use case.' },
  { type: 'Customer Support', email: 'support@sentinelx.ai', icon: '🛟', desc: 'Technical help for existing customers and trial users.' },
  { type: 'Security Issues', email: 'security@sentinelx.ai', icon: '🔐', desc: 'Responsible disclosure of platform vulnerabilities.' },
  { type: 'Press & Media', email: 'press@sentinelx.ai', icon: '📰', desc: 'Media enquiries, logo assets, and interview requests.' },
  { type: 'Partnerships', email: 'partners@sentinelx.ai', icon: '🤝', desc: 'Technology & reseller partnership opportunities.' },
  { type: 'Legal & Privacy', email: 'legal@sentinelx.ai', icon: '⚖', desc: 'Legal notices, subpoenas, and privacy requests.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', role: '', inquiry: 'Sales & Demo', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  return (
    <MarketingLayout>
      <section style={{ padding: '100px 48px 60px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,163,0.1)', border: '1px solid rgba(0,255,163,0.25)', padding: '6px 16px', borderRadius: 100, color: 'var(--green)', fontSize: 12, fontWeight: 700, marginBottom: 24 }}>📬 GET IN TOUCH</div>
        <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 18, letterSpacing: -1 }}>We'd love to hear from you</h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>Whether you're evaluating SentinelX, need support, or want to partner with us — our team responds within one business day.</p>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48 }}>
        {/* Left */}
        <div>
          {/* Contact types */}
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Contact by topic</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 56 }}>
            {INQUIRIES.map(inq => (
              <div key={inq.type} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16, 185, 129,0.35)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{inq.icon}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 4 }}>{inq.type}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{inq.desc}</div>
                <a href={`mailto:${inq.email}`} style={{ fontSize: 12, color: 'var(--blue-light)', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>{inq.email}</a>
              </div>
            ))}
          </div>

          {/* Offices */}
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Global offices</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {OFFICES.map(o => (
              <div key={o.city} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{o.emoji}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 8 }}>{o.city}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{o.addr}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px', position: 'sticky', top: 88, height: 'fit-content' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Message sent!</h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>Thanks for reaching out. A SentinelX team member will get back to you within one business day.</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 24, background: 'rgba(16, 185, 129,0.1)', color: 'var(--blue-light)', border: '1px solid rgba(16, 185, 129,0.3)', borderRadius: 8, padding: '10px 24px', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Send another →</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Send us a message</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'Alex Morgan' },
                  { key: 'company', label: 'Company *', type: 'text', placeholder: 'Acme Corp' },
                  { key: 'email', label: 'Work Email *', type: 'email', placeholder: 'alex@acme.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</label>
                    <input required type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(16, 185, 129,0.06)', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(16, 185, 129,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Inquiry Type</label>
                  <select value={form.inquiry} onChange={e => setForm(p => ({ ...p, inquiry: e.target.value }))} style={{ width: '100%', background: '#0a1628', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                    {INQUIRIES.map(i => <option key={i.type} value={i.type}>{i.type}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Message *</label>
                  <textarea required placeholder="Tell us about your security environment, team size, and what you're trying to solve..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5}
                    style={{ width: '100%', background: 'rgba(16, 185, 129,0.06)', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(16, 185, 129,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <button onClick={() => alert('Demo Mode: Feature coming soon!')} type="submit" style={{ background: 'linear-gradient(135deg,#10b981,#0f766e)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(16, 185, 129,0.35)', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s' }}>
                  Send Message →
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </MarketingLayout>
  );
}
