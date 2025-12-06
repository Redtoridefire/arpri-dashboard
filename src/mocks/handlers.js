import { http, HttpResponse } from 'msw';

export const handlers = [
  // Resilience Score Endpoint
  http.get('/api/v1/resilience/score', () => {
    return HttpResponse.json({
      overall: 78,
      previousMonth: 75,
      categories: {
        aiGovernance: { score: 82, trend: 'up', change: 3 },
        fraudDetection: { score: 85, trend: 'up', change: 2 },
        dataPrivacy: { score: 71, trend: 'down', change: -2 },
        operationalResilience: { score: 79, trend: 'up', change: 4 },
        supplyChainSecurity: { score: 68, trend: 'stable', change: 0 },
        compliancePosture: { score: 88, trend: 'up', change: 1 }
      }
    });
  }),

  // Real-time Metrics Endpoint
  http.get('/api/v1/metrics/realtime', () => {
    return HttpResponse.json({
      txnPerSecond: 47892 + Math.floor(Math.random() * 1000),
      fraudAttempts: 1247 + Math.floor(Math.random() * 50),
      blockedRate: 99.2,
      aiDecisions: 892456 + Math.floor(Math.random() * 5000),
      humanEscalations: 234
    });
  }),

  // Threat Vectors Endpoint
  http.get('/api/v1/threats', () => {
    return HttpResponse.json([
      {
        name: 'Model Poisoning',
        risk: 'HIGH',
        score: 72,
        trend: 'up',
        incidents: 3,
        description: 'Adversarial manipulation of training data to compromise model integrity',
        mitigation: 'Input validation, anomaly detection, model versioning'
      },
      {
        name: 'Prompt Injection',
        risk: 'CRITICAL',
        score: 65,
        trend: 'up',
        incidents: 8,
        description: 'Malicious inputs designed to manipulate LLM behavior',
        mitigation: 'Input sanitization, output filtering, prompt hardening'
      },
      {
        name: 'Data Exfiltration',
        risk: 'MEDIUM',
        score: 81,
        trend: 'down',
        incidents: 1,
        description: 'Unauthorized extraction of sensitive payment data via AI systems',
        mitigation: 'DLP controls, tokenization, access monitoring'
      }
    ]);
  }),

  // AI Models Inventory Endpoint
  http.get('/api/v1/models', () => {
    return HttpResponse.json([
      {
        name: 'FraudNet-v3.2',
        type: 'Detection',
        status: 'production',
        riskTier: 'high',
        lastValidation: '2024-11-20',
        driftScore: 2.1,
        accuracy: 99.2,
        latency: 12
      },
      {
        name: 'TokenAuth-LLM',
        type: 'Authentication',
        status: 'production',
        riskTier: 'critical',
        lastValidation: '2024-11-18',
        driftScore: 1.8,
        accuracy: 99.8,
        latency: 8
      }
    ]);
  }),

  // Compliance Frameworks Endpoint
  http.get('/api/v1/compliance', () => {
    return HttpResponse.json([
      {
        framework: 'NIST AI RMF',
        status: 'compliant',
        coverage: 94,
        lastAudit: '2024-11-15',
        nextAudit: '2025-05-15',
        findings: 2
      },
      {
        framework: 'PCI DSS 4.0',
        status: 'compliant',
        coverage: 98,
        lastAudit: '2024-10-22',
        nextAudit: '2025-04-22',
        findings: 1
      }
    ]);
  }),

  // Risk Assessment Endpoint (for transaction risk scoring)
  http.post('/api/v1/risk/assess', async ({ request }) => {
    const body = await request.json();

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 50));

    return HttpResponse.json({
      risk_score: Math.floor(Math.random() * 100),
      risk_level: Math.random() > 0.8 ? 'HIGH' : Math.random() > 0.5 ? 'MEDIUM' : 'LOW',
      decision: Math.random() > 0.1 ? 'APPROVE' : 'DECLINE',
      confidence: 0.92 + Math.random() * 0.08,
      model_version: '3.2.1',
      latency_ms: 8 + Math.floor(Math.random() * 20),
      explanation: {
        top_factors: [
          { factor: 'merchant_history', impact: -15 },
          { factor: 'device_trust', impact: -8 },
          { factor: 'amount_pattern', impact: +3 }
        ]
      },
      audit: {
        request_id: `req_${Date.now()}`,
        models_invoked: ['fraud_v3', 'aml_v2'],
        guardrails_triggered: []
      }
    });
  }),

  // Time Series Data Endpoint
  http.get('/api/v1/metrics/timeseries', () => {
    return HttpResponse.json([
      { month: 'Jan', riskScore: 72, incidents: 12, fraudBlocked: 98.2, uptime: 99.94 },
      { month: 'Feb', riskScore: 74, incidents: 9, fraudBlocked: 98.5, uptime: 99.97 },
      { month: 'Mar', riskScore: 71, incidents: 15, fraudBlocked: 98.1, uptime: 99.91 },
      { month: 'Apr', riskScore: 76, incidents: 8, fraudBlocked: 98.7, uptime: 99.98 },
      { month: 'May', riskScore: 78, incidents: 6, fraudBlocked: 98.9, uptime: 99.99 },
      { month: 'Jun', riskScore: 75, incidents: 11, fraudBlocked: 98.4, uptime: 99.95 },
      { month: 'Jul', riskScore: 79, incidents: 5, fraudBlocked: 99.1, uptime: 99.99 },
      { month: 'Aug', riskScore: 77, incidents: 7, fraudBlocked: 98.8, uptime: 99.97 },
      { month: 'Sep', riskScore: 80, incidents: 4, fraudBlocked: 99.2, uptime: 99.99 },
      { month: 'Oct', riskScore: 78, incidents: 6, fraudBlocked: 99.0, uptime: 99.98 },
      { month: 'Nov', riskScore: 81, incidents: 3, fraudBlocked: 99.3, uptime: 99.99 },
      { month: 'Dec', riskScore: 78, incidents: 5, fraudBlocked: 99.1, uptime: 99.97 }
    ]);
  })
];
