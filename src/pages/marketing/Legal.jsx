import MarketingLayout from '../../components/MarketingLayout';
import { useState } from 'react';

const SECTIONS = [
  {
    id: 'privacy', title: 'Privacy Policy', lastUpdated: 'October 1, 2024', content: [
      { h: '1. Information We Collect', p: 'SentinelX ("we", "us", or "our") collects information you provide directly — including name, corporate email address, company name, and billing information when signing up for paid plans. We also collect information automatically when you use our platform: log data, usage telemetry, IP addresses, browser type, and device identifiers. We do not sell this data to any third party.' },
      { h: '2. How We Use Your Information', p: 'We use collected data to (a) provide, operate, and improve the SentinelX platform; (b) send transactional emails, security alerts, and product updates; (c) analyze usage patterns to optimize performance; (d) fulfill contractual obligations including SLA reporting; (e) comply with applicable law, including responding to lawful requests from government authorities.' },
      { h: '3. Data Retention', p: 'Log data ingested into SentinelX is retained per your plan tier: 14 days (Starter), 90 days (Professional), or per custom agreement (Enterprise). Account data is retained for the duration of your subscription plus 90 days following termination, unless a longer period is required by law. You may request early deletion of log data through your account settings or by contacting support.' },
      { h: '4. Data Security', p: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We employ role-based access control, multi-factor authentication requirements for all internal access, and undergo annual third-party penetration testing. Our infrastructure runs on AWS in SOC2-certified, ISO 27001-certified regions.' },
      { h: '5. Your Rights', p: 'Depending on your jurisdiction, you may have the right to: access, correct, or delete personal data we hold about you; object to or restrict processing; data portability; and lodge a complaint with a supervisory authority. To exercise any of these rights, contact privacy@sentinelx.ai. We will respond within 30 days.' },
    ]
  },
  {
    id: 'terms', title: 'Terms of Service', lastUpdated: 'October 1, 2024', content: [
      { h: '1. Acceptance of Terms', p: 'By accessing or using SentinelX ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use the Service. These terms apply to all users, including those who trial, purchase, or integrate with the Service.' },
      { h: '2. Permitted Use', p: 'You may use SentinelX solely for lawful security monitoring and operations purposes within your organization. You may not: (a) use the Service to monitor individuals without their knowledge in violation of applicable law; (b) attempt to reverse-engineer, decompile, or extract source code; (c) resell or sublicense access without written permission; (d) use the Service to process data relating to individuals in jurisdictions where such processing is prohibited.' },
      { h: '3. Service Level Agreement', p: 'SentinelX commits to 99.95% platform availability on Professional and Enterprise plans, measured monthly excluding scheduled maintenance windows (maximum 4 hours/month, announced 48 hours in advance). In the event of SLA breach, customers are eligible for service credits: 10% of monthly fee for uptime below 99.5%, 25% for uptime below 99.0%. Credits are calculated automatically and applied to the following invoice.' },
      { h: '4. Limitation of Liability', p: 'To the maximum extent permitted by applicable law, SentinelX shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of revenue, data, business, or goodwill — arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages. Our total liability to you shall not exceed the amounts paid by you to SentinelX in the 12 months preceding the claim.' },
      { h: '5. Governing Law', p: 'These Terms are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the state and federal courts located in San Francisco County, California.' },
    ]
  },
  {
    id: 'security', title: 'Security Policy', lastUpdated: 'September 15, 2024', content: [
      { h: 'Vulnerability Disclosure Program', p: 'SentinelX operates a responsible disclosure program. If you discover a security vulnerability in our platform, please report it to security@sentinelx.ai with a detailed description, steps to reproduce, and potential impact. We commit to acknowledging reports within 24 hours, providing status updates every 72 hours, and resolving CVSS 9.0+ vulnerabilities within 14 days.' },
      { h: 'Bug Bounty Rewards', p: 'We offer monetary rewards for qualifying vulnerabilities: Critical (CVSS 9.0-10.0): $5,000-$25,000; High (CVSS 7.0-8.9): $1,000-$5,000; Medium (CVSS 4.0-6.9): $250-$1,000; Low (CVSS 1.0-3.9): SentinelX swag + acknowledgment. Rewards are determined by our security team based on severity, exploitability, and impact.' },
      { h: 'Our Security Practices', p: 'SentinelX maintains SOC2 Type II and ISO 27001 certifications. Our security program includes: (a) quarterly internal red team exercises; (b) annual third-party penetration testing by Mandiant; (c) continuous automated vulnerability scanning in production; (d) mandatory security training for all employees; (e) a 24/7 security operations function monitoring our own infrastructure.' },
    ]
  },
  {
    id: 'dpa', title: 'Data Processing Agreement', lastUpdated: 'October 1, 2024', content: [
      { h: 'Data Controller and Processor', p: 'In the context of the GDPR, CCPA, and other applicable data protection regulations: You (the customer) are the Data Controller of any personal data contained within logs and events ingested into SentinelX. SentinelX acts as a Data Processor, processing that data only on your documented instructions as set out in your subscription agreement and these DPA terms.' },
      { h: 'Sub-processors', p: 'SentinelX uses the following sub-processors to deliver the Service: Amazon Web Services (cloud infrastructure, US/EU); Stripe (payment processing, US); Sendgrid (transactional email, US); Intercom (customer support, US). We maintain an up-to-date sub-processor list at sentinelx.ai/legal/sub-processors and provide 30 days advance notice before adding new sub-processors.' },
      { h: 'International Data Transfers', p: 'If you are located in the EEA, UK, or Switzerland, your data is processed in AWS EU-WEST-1 (Ireland) by default. Any transfer of personal data outside the EEA is conducted under Standard Contractual Clauses approved by the European Commission. Enterprise customers may additionally request data residency in AWS EU-CENTRAL-1 (Frankfurt) or AWS AP-SOUTHEAST-1 (Singapore).' },
    ]
  },
];

export default function Legal() {
  const [active, setActive] = useState('privacy');
  const section = SECTIONS.find(s => s.id === active);

  return (
    <MarketingLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 48px 100px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48 }}>
        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 88, height: 'fit-content' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 20 }}>Legal Documents</div>
          {SECTIONS.map(s => (
            <div key={s.id} onClick={() => setActive(s.id)} style={{ padding: '12px 16px', marginBottom: 6, borderRadius: 10, cursor: 'pointer', background: active === s.id ? 'rgba(16, 185, 129,0.12)' : 'transparent', color: active === s.id ? '#fff' : 'var(--text-secondary)', fontWeight: active === s.id ? 700 : 500, fontSize: 14, borderLeft: active === s.id ? '3px solid var(--blue)' : '3px solid transparent', transition: 'background-color .15s, border-color .15s, color .15s, fill .15s, stroke .15s, opacity .15s, box-shadow .15s, transform .15s' }}>{s.title}</div>
          ))}
        </div>

        {/* Content */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16, 185, 129,0.08)', border: '1px solid rgba(16, 185, 129,0.2)', padding: '4px 14px', borderRadius: 100, fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
            📅 Last updated: {section.lastUpdated}
          </div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 42, fontWeight: 900, color: '#fff', marginBottom: 40, lineHeight: 1.1 }}>{section.title}</h1>
          {section.content.map((block, i) => (
            <div key={i} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: i < section.content.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 14 }}>{block.h}</h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.9 }}>{block.p}</p>
            </div>
          ))}
          <div style={{ background: 'rgba(16, 185, 129,0.06)', border: '1px solid rgba(16, 185, 129,0.2)', borderRadius: 14, padding: '22px 28px', marginTop: 20 }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Questions about this document? Contact us at <a href="mailto:legal@sentinelx.ai" style={{ color: 'var(--blue-light)', fontWeight: 600 }}>legal@sentinelx.ai</a></p>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
