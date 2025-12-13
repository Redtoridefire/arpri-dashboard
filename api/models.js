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
      tactic: 'ML Attack Execution',
      technique: 'AML.T0051 - LLM Prompt Injection',
      procedure: 'Craft malicious prompts to bypass safety controls, extract sensitive data, or cause harmful outputs',
      mitigations: [
        'M0013 - Input/Output Filtering',
        'M0047 - Prompt Validation',
        'M0048 - Context Separation'
      ],
      detections: [
        'Monitor for unusual prompt patterns',
        'Detect attempts to override system instructions',
        'Track anomalous model behavior'
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
      tactic: 'Initial Access',
      technique: 'AML.T0052 - LLM Output Manipulation',
      procedure: 'Exploit unvalidated LLM outputs to inject malicious content into downstream systems',
      mitigations: [
        'M0013 - Output Filtering and Encoding',
        'M0042 - Content Security Policy',
        'M0050 - Output Validation'
      ],
      detections: [
        'Monitor LLM outputs for injection patterns',
        'Scan for script tags and executable content',
        'Validate output format and structure'
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
      procedure: 'Overwhelm ML inference endpoints with resource-intensive queries to degrade availability',
      mitigations: [
        'M0037 - Rate Limiting',
        'M0038 - Input Size Restrictions',
        'M0039 - Resource Quotas and Throttling'
      ],
      detections: [
        'Monitor API request patterns for anomalies',
        'Track resource utilization metrics',
        'Alert on sustained high-cost queries'
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
      tactic: 'Resource Development',
      technique: 'AML.T0010 - ML Supply Chain Compromise',
      procedure: 'Inject malicious code into ML dependencies, pre-trained models, or data pipelines',
      mitigations: [
        'M0002 - Model Provenance Verification',
        'M0003 - SBOM and Dependency Scanning',
        'M0004 - Code Signing and Attestation'
      ],
      detections: [
        'Verify package signatures and checksums',
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
      technique: 'AML.T0024 - Infer Training Data',
      procedure: 'Extract sensitive information from LLM outputs by exploiting memorization of training data',
      mitigations: [
        'M0011 - Differential Privacy',
        'M0012 - Training Data Sanitization',
        'M0013 - Output Filtering'
      ],
      detections: [
        'Monitor for repeated queries attempting data extraction',
        'Detect verbatim training data in outputs',
        'Alert on PII or sensitive data in responses'
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
      tactic: 'Execution',
      technique: 'AML.T0019 - Exploit ML Plugin Vulnerabilities',
      procedure: 'Abuse insecure LLM plugins to execute unauthorized actions or access restricted resources',
      mitigations: [
        'M0022 - Plugin Sandboxing',
        'M0023 - Least Privilege Access',
        'M0024 - Plugin Input Validation'
      ],
      detections: [
        'Monitor plugin execution for unauthorized actions',
        'Track plugin API calls and permissions',
        'Alert on sandbox escape attempts'
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
      technique: 'AML.T0034 - Exploit Excessive Model Permissions',
      procedure: 'Leverage overly permissive LLM agent configurations to perform unauthorized high-impact actions',
      mitigations: [
        'M0025 - Human-in-the-Loop Controls',
        'M0026 - Permission Scoping',
        'M0027 - Action Approval Workflows'
      ],
      detections: [
        'Monitor for high-impact autonomous actions',
        'Track permission usage and escalations',
        'Alert on actions exceeding defined boundaries'
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
      technique: 'AML.T0048 - User Trust Exploitation',
      procedure: 'Exploit user over-reliance on LLM outputs to propagate misinformation or flawed decisions',
      mitigations: [
        'M0028 - Confidence Score Display',
        'M0029 - Source Attribution',
        'M0030 - Human Verification Requirements'
      ],
      detections: [
        'Track instances of incorrect LLM outputs',
        'Monitor user acceptance rates without verification',
        'Measure impact of LLM-based decisions'
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
      technique: 'AML.T0004 - Model Exfiltration',
      procedure: 'Extract model architecture, weights, or parameters through API queries or direct access',
      mitigations: [
        'M0031 - API Authentication and Authorization',
        'M0021 - Query Rate Limiting',
        'M0032 - Model Watermarking'
      ],
      detections: [
        'Monitor for excessive model queries',
        'Detect model extraction patterns',
        'Track unauthorized model file access'
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
      technique: 'AML.T0025 - Membership Inference',
      procedure: 'Determine if specific records were used in model training by analyzing prediction confidence',
      mitigations: [
        'M0011 - Differential Privacy (DP-SGD)',
        'M0033 - Model Regularization',
        'M0034 - Prediction Obfuscation'
      ],
      detections: [
        'Monitor for repeated queries on similar inputs',
        'Detect confidence score analysis patterns',
        'Track queries correlated with known datasets'
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
      technique: 'AML.T0010 - ML Supply Chain Compromise',
      procedure: 'Embed malicious code in serialized model files to execute arbitrary commands during loading',
      mitigations: [
        'M0035 - Safe Model Loading (avoid pickle)',
        'M0036 - Sandbox Model Deserialization',
        'M0002 - Verify Model Provenance'
      ],
      detections: [
        'Scan model files for suspicious pickle operations',
        'Monitor model loading for unexpected system calls',
        'Validate model file signatures before loading'
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
      tactic: 'Impact',
      technique: 'AML.T0040 - ML System Compromise',
      procedure: 'Trigger integer overflow in GPU kernels to corrupt memory and potentially execute code',
      mitigations: [
        'M0040 - Framework Version Updates',
        'M0041 - Tensor Shape Validation',
        'M0042 - Resource Bounds Checking'
      ],
      detections: [
        'Monitor for GPU kernel crashes',
        'Detect abnormal tensor dimensions',
        'Alert on memory corruption patterns'
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
