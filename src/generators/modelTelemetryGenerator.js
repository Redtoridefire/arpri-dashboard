/**
 * Model Telemetry Generator
 * Generates realistic AI model inventory, performance metrics, and drift data
 */

const MODEL_TEMPLATES = [
  {
    name: 'FraudNet-v3.2',
    type: 'Detection',
    riskTier: 'high',
    baseAccuracy: 99.2,
    baseLatency: 12,
    baseDrift: 2.1
  },
  {
    name: 'TokenAuth-LLM',
    type: 'Authentication',
    riskTier: 'critical',
    baseAccuracy: 99.8,
    baseLatency: 8,
    baseDrift: 1.8
  },
  {
    name: 'TxnClassifier',
    type: 'Classification',
    riskTier: 'medium',
    baseAccuracy: 97.5,
    baseLatency: 15,
    baseDrift: 3.4
  },
  {
    name: 'RiskScore-Agent',
    type: 'Agentic',
    riskTier: 'critical',
    baseAccuracy: 98.9,
    baseLatency: 45,
    baseDrift: 1.2
  },
  {
    name: 'CustomerIntent',
    type: 'NLP',
    riskTier: 'low',
    baseAccuracy: 94.2,
    baseLatency: 22,
    baseDrift: 4.7
  },
  {
    name: 'AnomalyHunter',
    type: 'Detection',
    riskTier: 'high',
    baseAccuracy: 98.1,
    baseLatency: 18,
    baseDrift: 2.9
  },
  {
    name: 'SentimentAnalyzer',
    type: 'NLP',
    riskTier: 'low',
    baseAccuracy: 92.7,
    baseLatency: 25,
    baseDrift: 5.2
  },
  {
    name: 'BehaviorPredictor',
    type: 'Prediction',
    riskTier: 'medium',
    baseAccuracy: 96.3,
    baseLatency: 20,
    baseDrift: 3.1
  }
];

class ModelTelemetryGenerator {
  constructor() {
    this.modelStates = {};

    // Initialize model states
    MODEL_TEMPLATES.forEach(model => {
      this.modelStates[model.name] = {
        status: Math.random() > 0.1 ? 'production' : 'staging',
        lastValidation: this.generateRecentDate(),
        requestCount: Math.floor(Math.random() * 1000000) + 500000,
        errorCount: Math.floor(Math.random() * 100),
        version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`
      };
    });
  }

  /**
   * Generate AI model inventory
   */
  generateModels() {
    return MODEL_TEMPLATES.map(template => {
      const state = this.modelStates[template.name];
      const accuracyVariance = (Math.random() - 0.5) * 1.0;
      const latencyVariance = Math.floor((Math.random() - 0.5) * 5);
      const driftVariance = (Math.random() - 0.5) * 1.0;

      return {
        name: template.name,
        type: template.type,
        status: state.status,
        riskTier: template.riskTier,
        lastValidation: state.lastValidation,
        version: state.version,
        driftScore: Math.max(0, Math.min(10, Math.round((template.baseDrift + driftVariance) * 10) / 10)),
        accuracy: Math.max(80, Math.min(100, Math.round((template.baseAccuracy + accuracyVariance) * 10) / 10)),
        latency: Math.max(5, template.baseLatency + latencyVariance),
        requestCount: state.requestCount,
        errorCount: state.errorCount,
        errorRate: Math.round((state.errorCount / state.requestCount) * 10000) / 100,
        uptime: Math.round((99.5 + Math.random() * 0.5) * 100) / 100,
        lastDeployed: this.generateRecentDate(60),
        framework: this.getFramework(template.type),
        size: this.getModelSize(),
        environment: state.status === 'production' ? 'prod' : 'staging'
      };
    });
  }

  /**
   * Generate model performance trends
   */
  generatePerformanceTrends(modelName, days = 30) {
    const trends = [];
    const now = new Date();
    const model = MODEL_TEMPLATES.find(m => m.name === modelName) || MODEL_TEMPLATES[0];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const accuracyTrend = model.baseAccuracy + (Math.random() - 0.5) * 2;
      const latencyTrend = model.baseLatency + Math.floor((Math.random() - 0.5) * 8);

      trends.push({
        date: date.toISOString().split('T')[0],
        accuracy: Math.max(85, Math.min(100, Math.round(accuracyTrend * 10) / 10)),
        latency: Math.max(5, latencyTrend),
        throughput: Math.floor(Math.random() * 5000) + 10000,
        errors: Math.floor(Math.random() * 20),
        drift: Math.max(0, Math.min(10, Math.round((model.baseDrift + (Math.random() - 0.5) * 2) * 10) / 10))
      });
    }

    return trends;
  }

  /**
   * Generate model drift analysis
   */
  generateDriftAnalysis() {
    return MODEL_TEMPLATES.map(template => {
      const driftLevel = template.baseDrift;
      let status = 'healthy';
      let recommendation = 'Continue monitoring';

      if (driftLevel > 4) {
        status = 'critical';
        recommendation = 'Immediate retraining required';
      } else if (driftLevel > 3) {
        status = 'warning';
        recommendation = 'Schedule retraining soon';
      }

      return {
        modelName: template.name,
        driftScore: Math.round(driftLevel * 10) / 10,
        status,
        recommendation,
        lastRetrained: this.generateRecentDate(90),
        features: {
          categorical: Math.floor(Math.random() * 20) + 10,
          numerical: Math.floor(Math.random() * 30) + 20,
          drifted: Math.floor(Math.random() * 5)
        }
      };
    });
  }

  /**
   * Generate real-time model metrics
   */
  generateRealTimeMetrics() {
    const randomModel = MODEL_TEMPLATES[Math.floor(Math.random() * MODEL_TEMPLATES.length)];

    return {
      activeModels: MODEL_TEMPLATES.filter(m => this.modelStates[m.name].status === 'production').length,
      totalInferences: Math.floor(Math.random() * 10000) + 50000,
      averageLatency: Math.floor(Math.random() * 30) + 15,
      peakLatency: Math.floor(Math.random() * 80) + 50,
      errorRate: Math.round(Math.random() * 0.5 * 100) / 100,
      queueDepth: Math.floor(Math.random() * 500),
      topModel: randomModel.name,
      cpu: Math.round((40 + Math.random() * 40) * 10) / 10,
      memory: Math.round((50 + Math.random() * 30) * 10) / 10,
      gpu: Math.round((30 + Math.random() * 50) * 10) / 10
    };
  }

  /**
   * Generate model SBOM (Software Bill of Materials)
   */
  generateModelSBOM(modelName) {
    const model = MODEL_TEMPLATES.find(m => m.name === modelName) || MODEL_TEMPLATES[0];

    return {
      modelName: model.name,
      version: this.modelStates[model.name].version,
      created: this.generateRecentDate(180),
      organization: 'ARPRI Security Labs',
      components: [
        {
          type: 'base_model',
          name: this.getBaseModel(model.type),
          version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 5)}.0`,
          source: 'huggingface.co',
          hash: `sha256:${this.generateHash()}`,
          license: 'Apache-2.0'
        },
        {
          type: 'training_data',
          name: `${model.type.toLowerCase()}-dataset-2024`,
          version: '2024.12',
          records: Math.floor(Math.random() * 50000000) + 10000000,
          dateRange: '2023-01-01/2024-11-30',
          piiStatus: 'tokenized'
        },
        {
          type: 'dependency',
          name: this.getFramework(model.type),
          version: this.getFrameworkVersion(model.type)
        }
      ],
      security: {
        vulnerabilityScan: this.generateRecentDate(7),
        findings: Math.floor(Math.random() * 3),
        lastPenTest: this.generateRecentDate(90),
        certifications: ['SOC2', 'ISO27001']
      },
      performance: {
        accuracy: model.baseAccuracy,
        latency: model.baseLatency,
        throughput: Math.floor(Math.random() * 10000) + 5000
      }
    };
  }

  /**
   * Helper: Get framework based on model type
   */
  getFramework(type) {
    const frameworks = {
      'Detection': 'TensorFlow',
      'Authentication': 'PyTorch',
      'Classification': 'Scikit-learn',
      'Agentic': 'LangChain',
      'NLP': 'Transformers',
      'Prediction': 'XGBoost'
    };
    return frameworks[type] || 'PyTorch';
  }

  /**
   * Helper: Get framework version
   */
  getFrameworkVersion(type) {
    const versions = {
      'TensorFlow': '2.15.0',
      'PyTorch': '2.1.0',
      'Scikit-learn': '1.3.2',
      'LangChain': '0.1.0',
      'Transformers': '4.35.0',
      'XGBoost': '2.0.2'
    };
    return versions[this.getFramework(type)] || '1.0.0';
  }

  /**
   * Helper: Get base model name
   */
  getBaseModel(type) {
    const models = {
      'Detection': 'efficientnet-b0',
      'Authentication': 'bert-base-uncased',
      'Classification': 'random-forest',
      'Agentic': 'gpt-4-turbo',
      'NLP': 'roberta-large',
      'Prediction': 'gradient-boosting'
    };
    return models[type] || 'transformer-base';
  }

  /**
   * Helper: Get model size
   */
  getModelSize() {
    const sizes = ['Small (<100MB)', 'Medium (100MB-1GB)', 'Large (1GB-5GB)', 'XLarge (>5GB)'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  /**
   * Helper: Generate recent date
   */
  generateRecentDate(maxDaysAgo = 30) {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
    const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper: Generate hash
   */
  generateHash() {
    return Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}

// Singleton instance
const modelTelemetryGenerator = new ModelTelemetryGenerator();

export default modelTelemetryGenerator;
