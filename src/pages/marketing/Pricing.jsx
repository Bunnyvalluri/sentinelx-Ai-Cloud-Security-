import MarketingLayout from '../../components/MarketingLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    id: 'starter', name: 'Starter', color: '#fbbf24', monthlyPrice: 249, annualPrice: 207,
    tagline: 'For growing security teams getting started with cloud visibility.',
    cta: 'Start Free Trial', ctaLink: '/login',
    features: [
      'Up to 50 GB log ingest / day', '5 cloud source connectors', 'AI anomaly detection (base model)',
      'Alert queue with email notifications', '14-day log retention', 'SOC2 compliance mapping',
      'Community support', 'REST API access',
    ],
  },
  {
    id: 'pro', name: 'Professional', color: '#10b981', monthlyPrice: 749, annualPrice: 623, popular: true,
    tagline: 'For established security teams managing complex multi-cloud environments.',
    cta: 'Start Free Trial', ctaLink: '/login',
    features: [
      'Up to 500 GB log ingest / day', '25 cloud source connectors', 'CEREBRO AI full anomaly suite',
      'Automated remediation playbooks', '90-day log retention', 'SOC2, GDPR, HIPAA, ISO 27001',
      'PagerDuty & Jira integration', 'Slack & Teams alerting', 'Priority email & chat support',
      'Full REST API + Webhooks',
    ],
  },
  {
    id: 'enterprise', name: 'Enterprise', color: '#f59e0b', annualPrice: null, isCustom: true,
    tagline: 'For large organizations with custom compliance, scale, and integration requirements.',
    cta: 'Contact Sales', ctaLink: '/contact',
    features: [
      'Unlimited log ingest', '120+ connectors + custom API', 'CEREBRO AI + custom fine-tuned models',
      'Full SOAR playbook builder', '365-day retention + legal hold', 'All compliance frameworks',
      'Dedicated Customer Success Manager', 'Custom SLA (up to 99.99%)', 'SSO/SAML + custom RBAC',
      'On-prem / private cloud deployment', 'Security architecture review', 'SentinelX Academy training',
    ],
  },
];

const FAQS = [
  { q: 'Is there a free trial?', a: 'Yes — all plans include a 14-day free trial with full access to every feature. No credit card required to start.' },
  { q: 'How does log volume pricing work?', a: 'We price on compressed daily log ingest (not raw bytes). Most customers find actual usage is 60–70% of their raw log volume. Overage is billed at $0.40/GB/day on Starter and $0.22/GB/day on Professional.' },
  { q: 'Can I switch plans mid-cycle?', a: 'You can upgrade at any time — the difference is prorated immediately. Downgrades take effect at the next billing cycle.' },
  { q: 'What counts as a "cloud source connector"?', a: 'Each distinct cloud account or SaaS application counts as one connector. An AWS organization with 3 accounts counts as 3 connectors. Integrations like Slack or PagerDuty for alerting are free and unlimited.' },
  { q: 'Do you offer discounts for non-profits or startups?', a: 'Yes. We offer 50% off Professional for qualifying non-profits and a startup program for seed-stage companies. Contact sales@sentinelx.ai with proof of status.' },
  { q: 'Is there on-premises deployment?', a: 'On-prem and private cloud (AWS GovCloud, Azure Government) deployment is available on Enterprise plans only. Contact our team for architecture review.' },
];

const COMPARE_ROWS = [
  { label: 'Log ingest / day', starter: '50 GB', pro: '500 GB', ent: 'Unlimited' },
  { label: 'Cloud connectors', starter: '5', pro: '25', ent: '120+' },
  { label: 'Log retention', starter: '14 days', pro: '90 days', ent: '365 days+' },
  { label: 'AI anomaly detection', starter: 'Base', pro: 'Full', ent: 'Custom model' },
  { label: 'Auto remediation', starter: '—', pro: '✓', ent: '✓ Full SOAR' },
  { label: 'Compliance frameworks', starter: 'SOC2', pro: '4 frameworks', ent: 'All + custom' },
  { label: 'Support', starter: 'Community', pro: 'Priority', ent: 'Dedicated CSM' },
  { label: 'SLA uptime', starter: '99.5%', pro: '99.9%', ent: '99.99%' },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <MarketingLayout>
      {/* Hero */}
      <section style={{ padding: '96px 48px 72px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: 7, background: 'rgba(249,200,14,0.1)', border: '1px solid rgba(249,200,14,0.25)', padding: '5px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, color: '#f9c80e', marginBottom: 26 }}>💰 TRANSPARENT PRICING</div>
        <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 66, fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: -2, marginBottom: 18 }}>
          Simple, predictable<br /><span style={{ background: 'linear-gradient(90deg,#f9c80e,#ff6b2b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>pricing</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>No per-seat surprises. No hidden log ingestion fees. Just powerful security at a price that scales with your team.</p>

        {/* Toggle */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {[{ label: 'Monthly', v: false }, { label: 'Annual', v: true, note: 'Save 17%' }].map(opt => (
            <button key={opt.label} onClick={() => setAnnual(opt.v)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: annual === opt.v ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent', color: annual === opt.v ? '#fff' : 'var(--text-secondary)', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              {opt.label}{opt.note && annual === opt.v && <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', padding: '2px 7px', borderRadius: 100 }}>{opt.note}</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 88px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, alignItems: 'start' }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{ background: plan.popular ? 'linear-gradient(135deg,rgba(16,185,129,0.10),rgba(10,22,40,0.98))' : 'var(--bg-card)', border: `1px solid ${plan.popular ? 'rgba(16,185,129,0.45)' : 'var(--border)'}`, borderRadius: 20, padding: '36px 32px', position: 'relative', boxShadow: plan.popular ? '0 0 50px rgba(16,185,129,0.15)' : 'none' }}>
            {plan.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#10b981,#34d399)', color: '#000', fontWeight: 800, fontSize: 11, padding: '5px 20px', borderRadius: 100, letterSpacing: 0.5 }}>MOST POPULAR</div>}

            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: plan.color, marginBottom: 12 }}>{plan.name.toUpperCase()}</div>
            <div style={{ marginBottom: 10 }}>
              {plan.isCustom ? (
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 40, fontWeight: 900, color: '#fff' }}>Custom</span>
              ) : (
                <>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>
                    ${annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/mo</span>
                  {annual && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>billed annually · ${plan.monthlyPrice}/mo monthly</div>}
                </>
              )}
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 24, minHeight: 44 }}>{plan.tagline}</p>

            <Link to={plan.ctaLink} className="block mt-auto">
              <button
                onClick={() => alert('Demo Mode: Feature coming soon!')}
                className={`w-full py-3.5 btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
              >
                {plan.cta}
              </button>
            </Link>

            <div style={{ height: 1, background: 'var(--border)', marginBottom: 22 }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase' }}>What's included</div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <span style={{ color: '#fbbf24', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Comparison table */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 88px' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 38, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 40 }}>Full plan comparison</h2>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '18px 24px', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Feature</div>
            {[{ n: 'Starter', color: '#fbbf24' }, { n: 'Professional', color: '#10b981', hl: true }, { n: 'Enterprise', color: '#f59e0b' }].map(c => (
              <div key={c.n} style={{ padding: '18px 0', textAlign: 'center', background: c.hl ? 'rgba(16,185,129,0.06)' : 'transparent', borderLeft: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.n}</div>
              </div>
            ))}
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < COMPARE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ padding: '14px 24px', fontSize: 13.5, color: 'var(--text-secondary)' }}>{row.label}</div>
              {[row.starter, row.pro, row.ent].map((val, ci) => (
                <div key={ci} style={{ padding: '14px 0', textAlign: 'center', fontSize: 13, color: val === '—' ? 'var(--text-muted)' : '#fff', fontWeight: val === '—' ? 400 : 600, background: ci === 1 ? 'rgba(16,185,129,0.04)' : 'transparent', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>{val}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 48px 88px' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 38, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 40 }}>Frequently asked questions</h2>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 10, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
            <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{faq.q}</span>
              <span style={{ fontSize: 18, color: 'var(--blue-light)', transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </div>
            {openFaq === i && <div style={{ padding: '0 22px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, borderTop: '1px solid var(--border)' }}><br />{faq.a}</div>}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ margin: '0 48px 80px', background: 'linear-gradient(135deg,rgba(16,185,129,0.10),rgba(10,22,40,0.97))', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 22, padding: '72px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 44, fontWeight: 900, color: '#fff', marginBottom: 16 }}>Start securing your cloud today</h2>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 36px', lineHeight: 1.7 }}>Full 14-day trial. No credit card. No commitment. Cancel anytime.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link to="/login">
            <button className="btn btn-primary px-9 py-3.5 text-base" onClick={() => alert('Demo Mode: Feature coming soon!')}>Start Free Trial →</button>
          </Link>
          <Link to="/contact">
            <button className="btn btn-outline px-9 py-3.5 text-base" onClick={() => alert('Demo Mode: Feature coming soon!')}>Talk to Sales</button>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
