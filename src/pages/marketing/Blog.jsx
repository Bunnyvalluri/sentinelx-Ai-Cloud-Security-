import MarketingLayout from '../../components/MarketingLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Research', 'Engineering', 'Compliance', 'Customer Stories', 'Announcements'];

const POSTS = [
  {
    featured: true,
    cat: 'Research', color: '#ff3b6b',
    title: 'How Credential-Based Attacks Bypassed MFA at Three Fortune 500 Companies',
    excerpt: 'Our threat research team analyzed 14 confirmed breaches in 2024 where attackers bypassed MFA through session token hijacking and OAuth abuse. Here\'s what we found — and how to defend your organization today.',
    author: 'Dr. Priya Nair', role: 'Principal Security Researcher', initials: 'PN', avatarBg: 'linear-gradient(135deg,#10b981,#7c3aed)',
    readTime: '12 min', date: 'Dec 10, 2024', tags: ['Zero Trust', 'MFA', 'OAuth'],
  },
  {
    cat: 'Engineering', color: '#10b981',
    title: 'Inside CEREBRO AI: How We Cut False Positives by 87% with Behavioral Baselining',
    excerpt: 'A deep technical look at the probabilistic behavioral graph that powers our v3.0 anomaly detection engine, including the math behind entity risk scoring.',
    author: 'Ethan Brooks', role: 'VP Engineering', initials: 'EB', avatarBg: 'linear-gradient(135deg,#2dd4bf,#10b981)',
    readTime: '9 min', date: 'Nov 28, 2024', tags: ['AI', 'Detection', 'Engineering'],
  },
  {
    cat: 'Customer Stories', color: '#fbbf24',
    title: 'How Axiom Health Cut MTTD from 4 Hours to 8 Minutes',
    excerpt: 'Axiom Health\'s security team replaced three separate tools with SentinelX, consolidated their SOC workflow, and achieved a positive ROI within 60 days of deployment.',
    author: 'Sasha Okafor', role: 'Security Operations Manager', initials: 'SO', avatarBg: 'linear-gradient(135deg,#fbbf24,#10b981)',
    readTime: '7 min', date: 'Nov 14, 2024', tags: ['Case Study', 'Healthcare', 'MTTD'],
  },
  {
    cat: 'Research', color: '#ff3b6b',
    title: 'The 2024 Cloud Threat Intelligence Report: 5 Trends Every CISO Must Know',
    excerpt: 'Based on 1.2 billion events analyzed across 3,000+ enterprise environments, we\'ve identified the five attack patterns that defined cloud security in 2024.',
    author: 'SENTINEL Research Team', role: 'Threat Intelligence', initials: 'ST', avatarBg: 'linear-gradient(135deg,#ff3b6b,#ff6b2b)',
    readTime: '15 min', date: 'Oct 30, 2024', tags: ['Threat Intel', 'Annual Report', '2024'],
  },
  {
    cat: 'Announcements', color: '#f9c80e',
    title: 'CEREBRO AI v3.0 Is Now Generally Available',
    excerpt: 'Our most powerful detection engine yet is live for all customers. Neural threat modeling, expanded UEBA coverage, explainable alerts, and 40% fewer analyst escalations.',
    author: 'Marcus Chen', role: 'CEO, SentinelX', initials: 'MC', avatarBg: 'linear-gradient(135deg,#f9c80e,#ff6b2b)',
    readTime: '4 min', date: 'Oct 15, 2024', tags: ['Product', 'AI', 'Release'],
  },
  {
    cat: 'Compliance', color: '#b44fff',
    title: 'GDPR Enforcement in 2024: What Security Teams Need to Do Right Now',
    excerpt: 'EU regulators issued €1.2B in GDPR fines in Q3 2024 — a 180% year-over-year increase. We break down the top enforcement themes and what security controls auditors are checking.',
    author: 'Lena Weiss', role: 'Head of Compliance', initials: 'LW', avatarBg: 'linear-gradient(135deg,#b44fff,#7c3aed)',
    readTime: '10 min', date: 'Oct 2, 2024', tags: ['GDPR', 'Compliance', 'EU'],
  },
  {
    cat: 'Engineering', color: '#10b981',
    title: 'Building a Sub-200ms Detection Pipeline at Scale: Lessons from Our Kafka Rewrite',
    excerpt: 'How we redesigned our log processing pipeline to achieve consistent sub-200ms end-to-end detection latency at 1.2 billion events per hour without adding hardware.',
    author: 'Aisha Patel', role: 'Principal Engineer', initials: 'AP', avatarBg: 'linear-gradient(135deg,#10b981,#2dd4bf)',
    readTime: '14 min', date: 'Sep 18, 2024', tags: ['Engineering', 'Kafka', 'Performance'],
  },
  {
    cat: 'Customer Stories', color: '#fbbf24',
    title: 'NordCloud Logistics: Securing a 200-Node Global Network with SentinelX',
    excerpt: 'NordCloud\'s infrastructure spans 14 countries and 3 clouds. Their CISO shares how they went from alert fatigue to a 95% reduction in analyst escalations.',
    author: 'Jennifer Walsh', role: 'CISO, NordCloud', initials: 'JW', avatarBg: 'linear-gradient(135deg,#fbbf24,#2dd4bf)',
    readTime: '6 min', date: 'Sep 5, 2024', tags: ['Case Study', 'Multi-Cloud', 'Logistics'],
  },
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featured = POSTS[0];
  const filtered = POSTS.slice(1).filter(p => activeCategory === 'All' || p.cat === activeCategory);

  const catColor = { Research: '#ff3b6b', Engineering: '#10b981', Compliance: '#b44fff', 'Customer Stories': '#fbbf24', Announcements: '#f9c80e' };

  return (
    <MarketingLayout>
      {/* Hero */}
      <section style={{ padding: '96px 48px 64px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: 7, background: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.22)', padding: '5px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, color: '#ff6b2b', marginBottom: 24 }}>📖 SENTINEL BLOG</div>
        <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 60, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 18 }}>
          Security research,<br /><span style={{ background: 'linear-gradient(90deg,#ff3b6b,#ff6b2b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>direct from our team</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.75 }}>
          Threat intelligence, engineering deep-dives, compliance guides, and customer stories from the world's most advanced cloud security platform.
        </p>
      </section>

      {/* Featured Post */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 48px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(255,59,107,0.08),var(--bg-card))', border: '1px solid rgba(255,59,107,0.25)', borderRadius: 20, padding: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, alignItems: 'center', cursor: 'pointer', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,59,107,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,59,107,0.25)'; e.currentTarget.style.transform = 'none'; }}
        >
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100, background: 'rgba(249,200,14,0.15)', color: '#f9c80e', border: '1px solid rgba(249,200,14,0.3)', letterSpacing: 0.5 }}>FEATURED</span>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100, background: `${catColor[featured.cat]}15`, color: catColor[featured.cat], border: `1px solid ${catColor[featured.cat]}30` }}>{featured.cat.toUpperCase()}</span>
            </div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 16 }}>{featured.title}</h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>{featured.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: featured.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 13 }}>{featured.initials}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{featured.author}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{featured.role} · {featured.date} · {featured.readTime} read</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,59,107,0.06)', border: '1px solid rgba(255,59,107,0.15)', borderRadius: 14, padding: '30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Credential phishing → Session token theft → Lateral movement', 'MFA bypass via OAuth device flow abuse', 'Attack path: exposed S3 bucket → IAM role escalation', 'Defensive controls auditors confirmed worked in each case'].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                <span style={{ color: '#ff3b6b', fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>{item}
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ff3b6b', cursor: 'pointer' }}>Read the full report →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category tabs + Grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 72px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 36, alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: activeCategory === cat ? 'rgba(16, 185, 129,0.14)' : 'rgba(255,255,255,0.04)', color: activeCategory === cat ? '#fff' : 'var(--text-secondary)', borderBottom: activeCategory === cat ? '2px solid #10b981' : '2px solid transparent', transition: 'background-color .15s, border-color .15s, color .15s, fill .15s, stroke .15s, opacity .15s, box-shadow .15s, transform .15s' }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {filtered.map((post, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'background-color .2s, border-color .2s, color .2s, fill .2s, stroke .2s, opacity .2s, box-shadow .2s, transform .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${catColor[post.cat] || '#10b981'}40`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 32px ${catColor[post.cat] || '#10b981'}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ height: 6, background: catColor[post.cat] || '#10b981' }} />
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 100, background: `${catColor[post.cat] || '#10b981'}14`, color: catColor[post.cat] || '#10b981', border: `1px solid ${catColor[post.cat] || '#10b981'}30` }}>{post.cat.toUpperCase()}</span>
                </div>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.35, marginBottom: 10 }}>{post.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 18 }}>{post.excerpt}</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 18 }}>
                  {post.tags.map(tag => <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: post.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 11, flexShrink: 0 }}>{post.initials}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{post.author}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.date} · {post.readTime} read</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '72px 48px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Weekly Threat Intelligence Digest</h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 28 }}>Join 18,000+ security professionals who get our weekly digest — curated threat intel, new CVEs, and SentinelX platform updates.</p>
          {subscribed ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,255,163,0.1)', border: '1px solid rgba(0,255,163,0.3)', borderRadius: 12, padding: '14px 24px', color: '#fbbf24', fontWeight: 700, fontSize: 15 }}>
              ✓ You're subscribed — check your inbox to confirm
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }} style={{ display: 'flex', gap: 10 }}>
              <input required type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 16px', color: '#fff', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(16, 185, 129,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button onClick={() => alert('Demo Mode: Feature coming soon!')} type="submit" style={{ background: 'linear-gradient(135deg,#10b981,#0f766e)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(16, 185, 129,0.3)' }}>Subscribe →</button>
            </form>
          )}
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>No spam. Unsubscribe anytime. We respect your privacy.</p>
        </div>
      </section>
    </MarketingLayout>
  );
}
