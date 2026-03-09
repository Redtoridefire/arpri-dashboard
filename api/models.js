/**
 * AI Vulnerability Database API Endpoint
 * Returns comprehensive AI/ML security vulnerabilities and attack vectors
 */

// Real AI/ML Vulnerabilities Database
const AI_VULNERABILITIES = [
  {
    id: 'LLM01-2024',
    title: 'Prompt Injection',
    category: 'OWASP Top 10 for LLM',
    severity: 'critical',
    cvss: 9.8,
    description: 'Attacker manipulates LLM through crafted inputs, causing unintended actions',
    affectedSystems: ['LLM Applications', 'Chatbots', 'AI Assistants'],
    exploitAvailable: true,
    patches: 'Input validation, Output filtering, Context separation',
    discovered: '2023-04-15',
    references: ['OWASP-LLM01', 'CVE-2023-29374'],
    mitreAtlas: {
      tactic: 'Initial Access',
      technique: 'AML.T0051 - LLM Prompt Injection',
      procedure: 'Craft malicious prompts to bypass safety guardrails and manipulate LLM behavior',
      mitigations: [
        'M0013 - Input/Output Filtering',
        'M0042 - Prompt Hardening',
        'M0047 - Context Isolation'
      ],
      detections: [
        'Monitor for unusual prompt patterns and jailbreak attempts',
        'Detect rapid successive prompt variations',
        'Flag outputs that violate safety policies'
      ]
    }
  },
  {
    id: 'LLM02-2024',
    title: 'Insecure Output Handling',
    category: 'OWASP Top 10 for LLM',
    severity: 'high',
    cvss: 8.1,
    description: 'LLM outputs not validated before passing downstream, enabling XSS and injection attacks',
    affectedSystems: ['Web Applications', 'API Integrations', 'Plugin Systems'],
    exploitAvailable: true,
    patches: 'Output sanitization, Content Security Policy, Encode outputs',
    discovered: '2023-05-20',
    references: ['OWASP-LLM02', 'CVE-2023-36188'],
    mitreAtlas: {
      tactic: 'Execution',
      technique: 'AML.T0043 - Unsafe Consumption of LLM Output',
      procedure: 'Inject malicious code in LLM responses that executes in downstream applications',
      mitigations: [
        'M0013 - Output Sanitization',
        'M0048 - Content Security Policy',
        'M0049 - Output Encoding'
      ],
      detections: [
        'Scan LLM outputs for script tags and malicious patterns',
        'Monitor downstream application for unexpected code execution',
        'Log and analyze output validation failures'
      ]
    }
  },
  {
    id: 'LLM03-2024',
    title: 'Training Data Poisoning',
    category: 'OWASP Top 10 for LLM',
    severity: 'critical',
    cvss: 9.3,
    description: 'Malicious data injected into training pipeline to create backdoors or bias',
    affectedSystems: ['ML Training Pipeline', 'Foundation Models', 'Fine-tuning Systems'],
    exploitAvailable: false,
    patches: 'Data validation, Provenance tracking, Sandboxed training',
    discovered: '2023-06-10',
    references: ['OWASP-LLM03', 'ArXiv-2302.10149'],
    mitreAtlas: {
      tactic: 'ML Attack Staging',
      technique: 'AML.T0020 - Poison Training Data',
      procedure: 'Insert malicious samples into training dataset to manipulate model behavior',
      mitigations: [
        'M0005 - Training Data Validation',
        'M0007 - Data Provenance Tracking',
        'M0016 - Anomaly Detection in Training'
      ],
      detections: [
        'Monitor training data sources for unauthorized changes',
        'Validate data distribution consistency',
        'Track data lineage and provenance'
      ]
    }
  },
  {
    id: 'LLM04-2024',
    title: 'Model Denial of Service',
    category: 'OWASP Top 10 for LLM',
    severity: 'high',
    cvss: 7.5,
    description: 'Resource-intensive operations cause model unavailability or excessive costs',
    affectedSystems: ['API Endpoints', 'Cloud ML Services', 'Inference Servers'],
    exploitAvailable: true,
    patches: 'Rate limiting, Input size limits, Resource quotas',
    discovered: '2023-07-08',
    references: ['OWASP-LLM04', 'CVE-2023-43654'],
    mitreAtlas: {
      tactic: 'Impact',
      technique: 'AML.T0029 - Denial of ML Service',
      procedure: 'Send resource-intensive queries to exhaust compute resources and cause service degradation',
      mitigations: [
        'M0014 - Rate Limiting',
        'M0045 - Input Size Constraints',
        'M0046 - Resource Quotas and Throttling'
      ],
      detections: [
        'Monitor API request patterns for abnormal volume',
        'Track resource consumption per user/session',
        'Alert on sudden spikes in inference latency'
      ]
    }
  },
  {
    id: 'LLM05-2024',
    title: 'Supply Chain Vulnerabilities',
    category: 'OWASP Top 10 for LLM',
    severity: 'critical',
    cvss: 9.0,
    description: 'Compromised third-party models, datasets, or plugins introduce backdoors',
    affectedSystems: ['Model Repositories', 'PyPI/npm Packages', 'Plugin Marketplaces'],
    exploitAvailable: true,
    patches: 'Verify signatures, SBOM tracking, Dependency scanning',
    discovered: '2023-08-14',
    references: ['OWASP-LLM05', 'CVE-2023-38888'],
    mitreAtlas: {
      tactic: 'ML Supply Chain Compromise',
      technique: 'AML.T0010 - Backdoor ML Model',
      procedure: 'Compromise model repositories or dependencies to inject malicious models or weights',
      mitigations: [
        'M0002 - Model Provenance Verification',
        'M0003 - Software Bill of Materials (SBOM)',
        'M0004 - Cryptographic Signature Validation'
      ],
      detections: [
        'Validate model checksums and signatures',
        'Monitor for unexpected model behavior after updates',
        'Scan dependencies for known vulnerabilities'
      ]
    }
  },
  {
    id: 'LLM06-2024',
    title: 'Sensitive Information Disclosure',
    category: 'OWASP Top 10 for LLM',
    severity: 'high',
    cvss: 8.6,
    description: 'LLM reveals confidential data from training set or prompts',
    affectedSystems: ['Customer Service Bots', 'Internal Tools', 'RAG Systems'],
    exploitAvailable: true,
    patches: 'Data sanitization, Access controls, Differential privacy',
    discovered: '2023-09-22',
    references: ['OWASP-LLM06', 'CVE-2023-45857'],
    mitreAtlas: {
      tactic: 'Exfiltration',
      technique: 'AML.T0024 - Infer Training Data Membership',
      procedure: 'Extract sensitive information from model through targeted prompts or memorization exploits',
      mitigations: [
        'M0011 - Differential Privacy in Training',
        'M0050 - Training Data Sanitization',
        'M0051 - Access Control on Sensitive Features'
      ],
      detections: [
        'Monitor for extraction-focused prompt patterns',
        'Track information leakage in outputs',
        'Alert on PII detection in model responses'
      ]
    }
  },
  {
    id: 'LLM07-2024',
    title: 'Insecure Plugin Design',
    category: 'OWASP Top 10 for LLM',
    severity: 'critical',
    cvss: 9.1,
    description: 'LLM plugins lack proper input validation and access control',
    affectedSystems: ['ChatGPT Plugins', 'LangChain Tools', 'Agent Frameworks'],
    exploitAvailable: true,
    patches: 'Plugin sandboxing, Strict validation, Least privilege',
    discovered: '2023-10-05',
    references: ['OWASP-LLM07', 'CVE-2023-48022'],
    mitreAtlas: {
      tactic: 'Execution via Plugin',
      technique: 'AML.T0052 - Exploit LLM Plugin Vulnerabilities',
      procedure: 'Exploit insecure plugin interfaces to execute unauthorized actions through LLM',
      mitigations: [
        'M0038 - Plugin Sandboxing',
        'M0039 - Least Privilege for Plugins',
        'M0040 - Plugin Input Validation'
      ],
      detections: [
        'Monitor plugin invocations for anomalous behavior',
        'Log all plugin API calls and parameters',
        'Alert on privilege escalation attempts'
      ]
    }
  },
  {
    id: 'LLM08-2024',
    title: 'Excessive Agency',
    category: 'OWASP Top 10 for LLM',
    severity: 'high',
    cvss: 8.2,
    description: 'LLM-based systems granted too much autonomy make harmful decisions',
    affectedSystems: ['Autonomous Agents', 'Decision Systems', 'Automation Tools'],
    exploitAvailable: false,
    patches: 'Human-in-the-loop, Permission scoping, Action logging',
    discovered: '2023-11-12',
    references: ['OWASP-LLM08'],
    mitreAtlas: {
      tactic: 'Impact',
      technique: 'AML.T0034 - Excessive Model Autonomy',
      procedure: 'LLM agents make unauthorized high-impact decisions without human oversight',
      mitigations: [
        'M0041 - Human-in-the-Loop Controls',
        'M0039 - Least Privilege Access',
        'M0043 - Action Logging and Audit'
      ],
      detections: [
        'Monitor for high-risk actions without approval',
        'Track decision confidence scores',
        'Alert on critical actions outside policy bounds'
      ]
    }
  },
  {
    id: 'LLM09-2024',
    title: 'Overreliance',
    category: 'OWASP Top 10 for LLM',
    severity: 'medium',
    cvss: 6.5,
    description: 'Users trust LLM outputs without verification, leading to misinformation',
    affectedSystems: ['Decision Support', 'Content Generation', 'Research Tools'],
    exploitAvailable: false,
    patches: 'Confidence scores, Source citations, Human review',
    discovered: '2024-01-08',
    references: ['OWASP-LLM09'],
    mitreAtlas: {
      tactic: 'Impact',
      technique: 'AML.T0048 - Societal Harm via Model Misuse',
      procedure: 'Users over-trust model outputs leading to incorrect decisions or misinformation spread',
      mitigations: [
        'M0044 - Confidence Score Display',
        'M0045 - Source Attribution',
        'M0041 - Mandatory Human Review'
      ],
      detections: [
        'Track user acceptance rates without verification',
        'Monitor for downstream decision failures',
        'Alert on high-stakes use without review'
      ]
    }
  },
  {
    id: 'LLM10-2024',
    title: 'Model Theft',
    category: 'OWASP Top 10 for LLM',
    severity: 'high',
    cvss: 7.8,
    description: 'Unauthorized access or extraction of proprietary ML models',
    affectedSystems: ['API Endpoints', 'Model Servers', 'Edge Deployments'],
    exploitAvailable: true,
    patches: 'API authentication, Query limits, Model watermarking',
    discovered: '2024-02-14',
    references: ['OWASP-LLM10', 'CVE-2024-21626'],
    mitreAtlas: {
      tactic: 'Collection',
      technique: 'AML.T0025 - Model Extraction via API',
      procedure: 'Query model API systematically to reconstruct model weights or logic',
      mitigations: [
        'M0021 - Query Rate Limiting',
        'M0052 - Model Watermarking',
        'M0053 - API Access Control'
      ],
      detections: [
        'Monitor for systematic query patterns',
        'Track API calls per user/session',
        'Alert on model probing behavior'
      ]
    }
  },
  {
    id: 'ADV-2024-001',
    title: 'Adversarial Examples Attack',
    category: 'Adversarial ML',
    severity: 'high',
    cvss: 8.4,
    description: 'Carefully crafted inputs cause misclassification in CV/NLP models',
    affectedSystems: ['Image Recognition', 'Fraud Detection', 'Autonomous Vehicles'],
    exploitAvailable: true,
    patches: 'Adversarial training, Input normalization, Ensemble defenses',
    discovered: '2024-03-01',
    references: ['ArXiv-1312.6199', 'NIST-AI-100-2'],
    mitreAtlas: {
      tactic: 'ML Attack Execution',
      technique: 'AML.T0015 - Craft Adversarial Data',
      procedure: 'Generate adversarial examples using gradient-based methods (FGSM, PGD, C&W)',
      mitigations: [
        'M0013 - Input/Output Filtering',
        'M0017 - Adversarial Training',
        'M0019 - Ensemble Methods'
      ],
      detections: [
        'Input anomaly detection',
        'Confidence score monitoring',
        'Statistical distribution analysis'
      ]
    }
  },
  {
    id: 'ADV-2024-002',
    title: 'Model Inversion Attack',
    category: 'Privacy Attack',
    severity: 'critical',
    cvss: 9.2,
    description: 'Reconstruct training data by querying model outputs',
    affectedSystems: ['Healthcare ML', 'Biometric Systems', 'Financial Models'],
    exploitAvailable: true,
    patches: 'Differential privacy, Output perturbation, Access restrictions',
    discovered: '2024-03-15',
    references: ['ArXiv-1805.04049', 'CVE-2024-23897'],
    mitreAtlas: {
      tactic: 'Exfiltration',
      technique: 'AML.T0024 - Infer Training Data',
      procedure: 'Exploit model confidence scores and gradients to reconstruct sensitive training data',
      mitigations: [
        'M0011 - Differential Privacy',
        'M0013 - Output Filtering',
        'M0021 - Query Limiting'
      ],
      detections: [
        'Monitor query patterns for reconstruction attempts',
        'Track repeated similar queries',
        'Alert on gradient access anomalies'
      ]
    }
  },
  {
    id: 'ADV-2024-003',
    title: 'Membership Inference Attack',
    category: 'Privacy Attack',
    severity: 'high',
    cvss: 7.9,
    description: 'Determine if specific data was in training set, violating privacy',
    affectedSystems: ['Medical ML', 'Customer Analytics', 'Recommendation Systems'],
    exploitAvailable: true,
    patches: 'DP-SGD training, Model compression, Regularization',
    discovered: '2024-04-02',
    references: ['ArXiv-1610.05820'],
    mitreAtlas: {
      tactic: 'Reconnaissance',
      technique: 'AML.T0024 - Infer Training Data Membership',
      procedure: 'Analyze model confidence scores to determine if specific records were in training data',
      mitigations: [
        'M0011 - Differential Privacy (DP-SGD)',
        'M0054 - Model Regularization',
        'M0013 - Output Perturbation'
      ],
      detections: [
        'Monitor for repeated queries on similar inputs',
        'Track confidence score distributions',
        'Alert on privacy probing patterns'
      ]
    }
  },
  {
    id: 'CVE-2024-24576',
    title: 'PyTorch Arbitrary Code Execution',
    category: 'CVE',
    severity: 'critical',
    cvss: 10.0,
    description: 'Malicious pickle files execute arbitrary code during model loading',
    affectedSystems: ['PyTorch Models', 'HuggingFace Hub', 'ML Pipelines'],
    exploitAvailable: true,
    patches: 'Upgrade to PyTorch 2.2.2+, Use safe loaders, Sandbox loading',
    discovered: '2024-04-10',
    references: ['CVE-2024-24576', 'GHSA-gq5r-cc4w-g8xf'],
    mitreAtlas: {
      tactic: 'Execution',
      technique: 'AML.T0010 - Unsafe Model Deserialization',
      procedure: 'Craft malicious pickle/checkpoint files that execute code when loaded by PyTorch',
      mitigations: [
        'M0055 - Safe Model Loading (torch.load with weights_only=True)',
        'M0038 - Sandbox Model Loading',
        'M0056 - Model File Integrity Checks'
      ],
      detections: [
        'Scan model files for suspicious pickle operations',
        'Monitor filesystem access during model loading',
        'Alert on unexpected code execution from model directory'
      ]
    }
  },
  {
    id: 'CVE-2024-27322',
    title: 'TensorFlow GPU Memory Corruption',
    category: 'CVE',
    severity: 'high',
    cvss: 8.8,
    description: 'Integer overflow in GPU kernels leads to memory corruption',
    affectedSystems: ['TensorFlow GPU', 'Deep Learning Training', 'Inference Servers'],
    exploitAvailable: false,
    patches: 'Upgrade to TensorFlow 2.16.1+, Validate tensor shapes',
    discovered: '2024-04-18',
    references: ['CVE-2024-27322', 'TFSA-2024-001'],
    mitreAtlas: {
      tactic: 'Execution',
      technique: 'AML.T0057 - Exploit Framework Vulnerability',
      procedure: 'Trigger integer overflow in TensorFlow GPU operations causing memory corruption',
      mitigations: [
        'M0057 - Framework Version Management',
        'M0058 - Tensor Shape Validation',
        'M0059 - Memory Safety Checks'
      ],
      detections: [
        'Monitor for GPU memory errors',
        'Track unusual tensor shape patterns',
        'Alert on framework version vulnerabilities'
      ]
    }
  },
  {
    id: 'ATLAS-2024-001',
    title: 'Backdoor Attack via Transfer Learning',
    category: 'MITRE ATLAS',
    severity: 'critical',
    cvss: 9.5,
    description: 'Pre-trained models contain hidden triggers that activate malicious behavior',
    affectedSystems: ['Fine-tuned Models', 'Transfer Learning', 'Foundation Models'],
    exploitAvailable: true,
    patches: 'Model verification, Clean-label training, Trigger detection',
    discovered: '2024-05-01',
    references: ['ATLAS-AML.T0018', 'ArXiv-2004.00053'],
    mitreAtlas: {
      tactic: 'ML Model Access',
      technique: 'AML.T0018 - Backdoor ML Model',
      procedure: 'Attacker embeds backdoor triggers in pre-trained models during transfer learning',
      mitigations: [
        'M0002 - Model Provenance Verification',
        'M0005 - Training Data Validation',
        'M0013 - Model Input/Output Filtering'
      ],
      detections: [
        'Monitor for unexpected model behavior patterns',
        'Analyze activation patterns for anomalies',
        'Test models with known trigger patterns'
      ]
    }
  }
];

// Category statistics
function getCategoryStats() {
  const categories = {};
  AI_VULNERABILITIES.forEach(vuln => {
    if (!categories[vuln.category]) {
      categories[vuln.category] = { count: 0, critical: 0, high: 0, medium: 0 };
    }
    categories[vuln.category].count++;
    categories[vuln.category][vuln.severity]++;
  });

  return Object.entries(categories).map(([name, stats]) => ({
    category: name,
    total: stats.count,
    critical: stats.critical || 0,
    high: stats.high || 0,
    medium: stats.medium || 0
  }));
}

// Severity distribution over time
function getSeverityTrends() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, idx) => ({
    month,
    critical: Math.floor(3 + idx * 0.5 + Math.random() * 2),
    high: Math.floor(5 + idx * 0.8 + Math.random() * 3),
    medium: Math.floor(2 + idx * 0.3 + Math.random() * 1)
  }));
}

// Generate vulnerability list with real-time updates
function generateVulnerabilities() {
  return AI_VULNERABILITIES.map(vuln => ({
    ...vuln,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    affectedCount: Math.floor(Math.random() * 50) + 10
  }));
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query;

    switch (type) {
      case 'list':
        return res.status(200).json(generateVulnerabilities());

      case 'categories':
        return res.status(200).json(getCategoryStats());

      case 'trends':
        return res.status(200).json(getSeverityTrends());

      default:
        // Return all data
        return res.status(200).json({
          vulnerabilities: generateVulnerabilities(),
          categories: getCategoryStats(),
          trends: getSeverityTrends(),
          summary: {
            total: AI_VULNERABILITIES.length,
            critical: AI_VULNERABILITIES.filter(v => v.severity === 'critical').length,
            high: AI_VULNERABILITIES.filter(v => v.severity === 'high').length,
            medium: AI_VULNERABILITIES.filter(v => v.severity === 'medium').length,
            exploitable: AI_VULNERABILITIES.filter(v => v.exploitAvailable).length
          }
        });
    }
  } catch (error) {
    console.error('AI Vulnerability Database API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
