# ARPRI Dashboard

**AI Risk & Payments Resilience Index** — A comprehensive security monitoring dashboard for agentic AI in payments infrastructure.

![ARPRI Dashboard](https://img.shields.io/badge/version-1.0.0-cyan)
![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-teal)

## Overview

ARPRI Dashboard is an executive-level monitoring interface designed to provide real-time visibility into AI risk posture, payments security, and operational resilience. Built as a thought leadership demonstration for cybersecurity and AI governance in financial services.

### Key Features

- **Resilience Index Scoring** — Domain-specific risk scores across AI Governance, Fraud Detection, Data Privacy, Operational Resilience, Supply Chain Security, and Compliance
- **Real-time Metrics** — Live transaction monitoring, fraud detection rates, and AI decision tracking
- **Threat Intelligence** — Active threat vector monitoring with trend analysis
- **Compliance Dashboard** — Framework alignment tracking (NIST AI RMF, PCI DSS 4.0, NYDFS 500, SOX, GDPR/CCPA, OCC)
- **AI Model Inventory** — Production model monitoring with drift detection and risk classification

## Tech Stack

- **React 18** — Modern React with hooks
- **Vite** — Lightning-fast build tooling
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Data visualization
- **Lucide React** — Icon library

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/arpri-dashboard.git
cd arpri-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Deployment

### Deploy to Vercel

#### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 2: GitHub Integration (Recommended)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel auto-detects Vite configuration
6. Click "Deploy"

**Build Settings (auto-detected):**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Deploy to GitHub Pages

```bash
# Add homepage to package.json
# "homepage": "https://YOUR_USERNAME.github.io/arpri-dashboard"

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## Project Structure

```
arpri-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main dashboard component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles + Tailwind
├── index.html           # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Dashboard Sections

### 1. Overview Tab
- Overall Resilience Score (0-100)
- Real-time transaction metrics
- 12-month trend analysis
- Domain radar chart
- Risk distribution pie chart

### 2. Threat Intelligence Tab
- Active threat vectors
- Risk severity ratings
- Incident counts
- Trend indicators

### 3. Compliance Tab
- Framework status tracking
- Coverage percentages
- Audit history
- Open findings summary

### 4. AI Models Tab
- Model inventory
- Risk tier classification
- Drift monitoring
- Validation status

## Data Model

The dashboard uses a structured data model designed for real-world integration:

```javascript
// Resilience Scoring
{
  overall: 78,
  categories: {
    aiGovernance: 82,
    fraudDetection: 85,
    dataPrivacy: 71,
    operationalResilience: 79,
    supplyChainSecurity: 68,
    compliancePosture: 88
  }
}

// AI Model Inventory
{
  name: 'FraudNet-v3.2',
  type: 'Detection',
  status: 'production',
  riskTier: 'high',
  lastValidation: '2024-11-20',
  driftScore: 2.1
}
```

## Customization

### Theming

The dashboard uses CSS custom properties and Tailwind for theming:

```css
:root {
  --color-bg-primary: #0a0f1a;
  --color-accent-cyan: #00ffc8;
  --color-accent-purple: #8b5cf6;
}
```

### Adding Real Data Sources

Replace mock data in `App.jsx` with API calls:

```javascript
useEffect(() => {
  fetch('/api/resilience-score')
    .then(res => res.json())
    .then(data => setResilienceData(data));
}, []);
```

## License

MIT License — Free for commercial and personal use.

## Author

Built as a thought leadership demonstration for cybersecurity consulting in financial services.

---

**Keywords**: AI Risk Management, Payments Security, Agentic AI, Cybersecurity Dashboard, NIST AI RMF, PCI DSS, Financial Services, Enterprise Security
