# 🛡 SentinelX — AI Cloud Security Platform

> Real-time AI-powered cloud security monitoring, threat detection, compliance and user access management — built for enterprise teams.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sentinelx--platform.vercel.app-8b5cf6?style=for-the-badge&logo=vercel)](https://sentinelx-platform.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Bunnyvalluri-181717?style=for-the-badge&logo=github)](https://github.com/Bunnyvalluri/sentinelx-Ai-Cloud-Security-)

---

## 🌐 Live URLs

| | URL |
|---|---|
| **Production** | https://sentinelx-platform.vercel.app |
| **GitHub Repo** | https://github.com/Bunnyvalluri/sentinelx-Ai-Cloud-Security- |

---

## ✨ Features

- 🔴 **Real-time threat monitoring** — Live incident feed with AI-powered severity scoring
- 🧠 **CEREBRO AI** — Gemini-powered intelligence analysis with streaming responses
- 📊 **Security analytics** — SVG charts, geo-radar, traffic visualization
- 👥 **RBAC User Management** — Role-based access control with live session tracking
- 📋 **Compliance Audit** — Tamper-evident audit logs, SOC2 ready
- 🤖 **Floating AI Chatbot** — NVIDIA NIM-powered assistant with word-by-word streaming
- 🌙 **Dark + Light Mode** — Dev-tool dark (Vercel/Linear style) & zinc-white light mode
- 📱 **Fully Responsive** — Mobile hamburger sidebar, tablet grid collapse, desktop full layout
- ⚡ **Apple-style Smooth Scroll** — Lenis smooth scroll with quintic ease-out across all pages

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **Routing** | React Router v6 |
| **Styling** | Vanilla CSS + TailwindCSS |
| **Smooth Scroll** | Lenis (`@studio-freight/lenis`) |
| **AI / LLM** | NVIDIA NIM API + Google Gemini |
| **Deployment** | Vercel (auto-deploy from GitHub) |
| **Fonts** | Inter · JetBrains Mono · Outfit (Google Fonts) |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Bunnyvalluri/sentinelx-Ai-Cloud-Security-.git
cd sentinelx-Ai-Cloud-Security-

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your API keys to .env

# Start development server
npm run dev
```

The app runs at **http://localhost:5173**

---

## 🔐 Environment Variables

Create a `.env` file in the root (never commit this):

```env
VITE_NVIDIA_API_KEY=your_nvidia_nim_api_key_here
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLayout.jsx        # Dashboard shell: sidebar + topbar + mobile hamburger
│   ├── MarketingLayout.jsx  # Public pages: nav + footer + mobile menu
│   ├── SmoothScroll.jsx     # Lenis Apple-style smooth scroll
│   └── FloatingChatbot.jsx  # AI chatbot with streaming
├── pages/
│   ├── LandingPage.jsx      # Homepage
│   ├── LoginPage.jsx        # Auth + live SOC feed
│   ├── Dashboard.jsx        # Main security command center
│   ├── ThreatMonitoring.jsx
│   ├── LogExplorer.jsx
│   ├── ComplianceAudit.jsx
│   ├── AlertQueue.jsx
│   ├── SecurityAnalytics.jsx
│   ├── UserManagement.jsx
│   └── marketing/           # Features, Pricing, Docs, Blog, etc.
├── context/
│   └── ThemeContext.jsx     # Dark/Light mode state
└── index.css                # Design system: tokens, components, responsive
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| ≥ 1025px | Full desktop: sidebar always visible, search + clock in topbar |
| ≤ 1024px | Tablet: off-canvas sidebar with hamburger ☰ |
| ≤ 768px | Mobile: stacked grids, table scroll, login form only |
| ≤ 480px | Small phone: ultra compact, single-column everything |

---

## 🎨 Design System

**Dark Mode** (default) — Vercel/Linear inspired:
- Background: `#09090d` jet black
- Accent: `#8b5cf6` electric violet
- Cards: `#131318` elevated surface

**Light Mode** — Raycast/Supabase inspired:
- Background: `#fafafa` zinc white
- Accent: `#7c3aed` vivid violet
- Cards: `#ffffff` pure white

---

## 🚢 Deployment

The project auto-deploys to Vercel on every `git push` to `master`.

```bash
# Manual deploy
vercel --prod
```

---

*Built with ❤️ — SentinelX Security Inc. © 2024*
