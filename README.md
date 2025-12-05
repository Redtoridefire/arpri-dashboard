# ARPRI Dashboard v2.0

**AI Risk & Payments Resilience Index** — Enterprise security monitoring for agentic AI in payments infrastructure.

![Version](https://img.shields.io/badge/version-2.0.0-cyan)
![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 What's New in v2.0

- **AI Demo Agent** — Interactive chat interface for exploring AI security concepts in payments context
- **Architecture Diagrams** — Visual security stack and transaction flow visualizations
- **Drill-Down Modals** — Detailed views for threats and AI models
- **Export Functionality** — JSON data export capability
- **API Integration Layer** — Ready-to-connect hooks and WebSocket support
- **Comprehensive Whitepaper** — Full thought leadership publication included

---

## 📊 Dashboard Features

### Overview Tab
- Real-time resilience scoring (0-100) across 6 domains
- Live transaction metrics with animated updates
- 12-month trend analysis with risk/incident correlation
- Interactive radar chart for domain analysis
- Risk distribution visualization

### Threat Intelligence Tab
- 6 active threat vectors with severity ratings
- Trend indicators and incident counts
- Click-to-expand threat details
- Bar chart visualization of security scores

### Compliance Tab
- Framework tracking: NIST AI RMF, PCI DSS 4.0, NYDFS 500, SOX, GDPR/CCPA, OCC
- Coverage percentages with progress bars
- Audit dates and open findings
- Summary metrics

### AI Models Tab
- Production model inventory with risk tiers
- Drift monitoring visualization
- Latency distribution charts
- Click-to-expand model details

### Architecture Tab
- Interactive security stack visualization
- Transaction processing flow diagram
- Zero Trust principles checklist
- DSPM controls dashboard

### AI Agent
- Chat interface for AI security concepts
- Pre-built knowledge base for payments security topics
- Contextual responses with frameworks and mitigations

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite 5 | Build Tool |
| Tailwind CSS | Styling |
| Recharts | Data Visualization |
| Lucide React | Icons |

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or download the project
cd arpri-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

Dashboard available at `http://localhost:3000`

### Production Build

```bash
npm run build
```

Output in `dist/` directory.

---

## 🚢 Deployment

### Vercel (Recommended)

**Option 1: CLI**
```bash
npm i -g vercel
vercel
```

**Option 2: GitHub Integration**
1. Push to GitHub
2. Connect at vercel.com
3. Auto-deploys on push

### Vercel Configuration
The included `vercel.json` handles:
- Framework detection (Vite)
- Build commands
- Security headers
- SPA routing

---

## 📁 Project Structure

```
arpri-v2/
├── public/
│   ├── favicon.svg
│   └── ARPRI-Whitepaper.md      # Full publication
├── src/
│   ├── api/
│   │   └── index.js             # API integration layer
│   ├── App.jsx                  # Main dashboard
│   ├── main.jsx                 # Entry point
│   └── index.css                # Styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── README.md
```

---

## 🔌 API Integration

The dashboard includes a complete API integration layer in `src/api/index.js`:

### Available Hooks

```javascript
import { 
  useResilience,      // Resilience scores
  useThreats,         // Threat intelligence
  useCompliance,      // Compliance status
  useModels,          // AI model inventory
  useRealTimeMetrics  // WebSocket-powered metrics
} from './api';

function MyComponent() {
  const { data, loading, error } = useResilience();
  const metrics = useRealTimeMetrics();
  // ...
}
```

### API Client

```javascript
import { ARPRIApiClient } from './api';

const client = new ARPRIApiClient({
  baseUrl: 'https://your-api.com',
  version: 'v1'
});

// Fetch data
const threats = await client.getThreats();
const models = await client.getModels();

// Generate report
const report = await client.generateReport({
  format: 'pdf',
  sections: ['resilience', 'threats', 'compliance']
});
```

### WebSocket Real-Time Updates

```javascript
import { WebSocketManager, ARPRIApiClient } from './api';

const client = new ARPRIApiClient();
const wsManager = new WebSocketManager(client);

wsManager.connect();
wsManager.subscribe('transactions', (data) => {
  console.log('TPS:', data.tps);
});
```

---

## 📖 Included Whitepaper

The `/public/ARPRI-Whitepaper.md` includes:

1. **Executive Summary** — Key findings and strategic imperatives
2. **Agentic AI Overview** — From assistive to autonomous
3. **Threat Landscape** — AI-specific attack vectors
4. **Security Architecture** — Defense-in-depth model
5. **AI Governance** — NIST AI RMF alignment
6. **Threat Modeling** — STRIDE-AI framework
7. **Fraud Detection** — Gen 4 agentic systems
8. **Tokenization & DSPM** — Data protection strategies
9. **Regulatory Alignment** — Cross-framework mapping
10. **2025-2030 Roadmap** — Evolution timeline
11. **KPIs & Metrics** — ARPRI scoring methodology
12. **Technical Appendix** — Diagrams and specifications

---

## 🎨 Customization

### Theme Colors

```css
/* In index.css or tailwind.config.js */
:root {
  --color-bg-primary: #0a0f1a;
  --color-accent-cyan: #00ffc8;
  --color-accent-purple: #8b5cf6;
}
```

### Adding New Threat Vectors

```javascript
// In App.jsx, modify threatVectors array
const threatVectors = [
  // ... existing threats
  {
    name: 'New Threat',
    risk: 'HIGH',
    score: 70,
    trend: 'up',
    incidents: 5,
    description: 'Description here',
    mitigation: 'Mitigations here'
  }
];
```

### Adding AI Agent Knowledge

```javascript
// In App.jsx, extend agentKnowledge object
const agentKnowledge = {
  // ... existing topics
  'new topic': {
    definition: 'What it is',
    paymentsContext: 'Why it matters',
    mitigations: ['Step 1', 'Step 2'],
    frameworks: ['NIST AI RMF', 'PCI DSS']
  }
};
```

---

## 📊 Data Model Reference

### Resilience Score

```typescript
interface ResilienceScore {
  overall: number;           // 0-100
  previousMonth: number;
  categories: {
    aiGovernance: DomainScore;
    fraudDetection: DomainScore;
    dataPrivacy: DomainScore;
    operationalResilience: DomainScore;
    supplyChainSecurity: DomainScore;
    compliancePosture: DomainScore;
  }
}

interface DomainScore {
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}
```

### AI Model

```typescript
interface AIModel {
  name: string;
  type: 'Detection' | 'Classification' | 'Authentication' | 'NLP' | 'Agentic';
  status: 'production' | 'staging' | 'development';
  riskTier: 'critical' | 'high' | 'medium' | 'low';
  lastValidation: string;  // ISO date
  driftScore: number;      // percentage
  accuracy: number;        // percentage
  latency: number;         // ms
}
```

---

## 🔒 Security Headers

The `vercel.json` includes security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 📝 License

MIT License — Free for commercial and personal use.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📬 Support

For questions or issues, please open a GitHub issue.

---

**Keywords**: AI Risk Management, Payments Security, Agentic AI, Cybersecurity Dashboard, NIST AI RMF, PCI DSS 4.0, Financial Services, Enterprise Security, Fraud Detection, Zero Trust, DSPM
