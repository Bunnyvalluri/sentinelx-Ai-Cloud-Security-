import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import FloatingChatbot from './components/FloatingChatbot';

// App pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ThreatMonitoring from './pages/ThreatMonitoring';
import LogExplorer from './pages/LogExplorer';
import ComplianceAudit from './pages/ComplianceAudit';
import UserManagement from './pages/UserManagement';
import SecurityAnalytics from './pages/SecurityAnalytics';
import AlertQueue from './pages/AlertQueue';

// Marketing pages
import Features from './pages/marketing/Features';
import Integrations from './pages/marketing/Integrations';
import Pricing from './pages/marketing/Pricing';
import Roadmap from './pages/marketing/Roadmap';
import Documentation from './pages/marketing/Documentation';
import APIReference from './pages/marketing/APIReference';
import Blog from './pages/marketing/Blog';
import Community from './pages/marketing/Community';
import About from './pages/marketing/About';
import Careers from './pages/marketing/Careers';
import Legal from './pages/marketing/Legal';
import Contact from './pages/marketing/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Routes>
          {/* Main */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/threats" element={<ThreatMonitoring />} />
          <Route path="/logs" element={<LogExplorer />} />
          <Route path="/compliance" element={<ComplianceAudit />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/analytics" element={<SecurityAnalytics />} />
          <Route path="/alerts" element={<AlertQueue />} />

          {/* Product */}
          <Route path="/features" element={<Features />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/roadmap" element={<Roadmap />} />

          {/* Resources */}
          <Route path="/docs" element={<Documentation />} />
          <Route path="/api-reference" element={<APIReference />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/community" element={<Community />} />

          {/* Company */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <FloatingChatbot />
      </SmoothScroll>
    </BrowserRouter>
  );
}
