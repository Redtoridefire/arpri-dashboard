/**
 * Risk Score Generator
 * Generates realistic risk scores with trends, seasonal patterns, and anomalies
 */

class RiskScoreGenerator {
  constructor() {
    this.baseScore = 78;
    this.trend = 0.1; // Gradual improvement
    this.lastUpdate = Date.now();
  }

  /**
   * Generate overall resilience score with categories
   */
  generateResilienceScore() {
    const now = Date.now();
    const daysSinceLastUpdate = (now - this.lastUpdate) / (1000 * 60 * 60 * 24);

    // Apply trend over time
    this.baseScore = Math.min(95, Math.max(60, this.baseScore + (this.trend * daysSinceLastUpdate)));
    this.lastUpdate = now;

    // Add some variance
    const variance = (Math.random() - 0.5) * 4;
    const currentScore = Math.round(Math.max(60, Math.min(95, this.baseScore + variance)));
    const previousScore = currentScore - Math.floor(Math.random() * 5) + 2;

    return {
      overall: currentScore,
      previousMonth: previousScore,
      categories: {
        aiGovernance: this.generateCategoryScore(82, 'stable'),
        fraudDetection: this.generateCategoryScore(85, 'up'),
        dataPrivacy: this.generateCategoryScore(71, 'down'),
        operationalResilience: this.generateCategoryScore(79, 'up'),
        supplyChainSecurity: this.generateCategoryScore(68, 'stable'),
        compliancePosture: this.generateCategoryScore(88, 'up')
      },
      lastUpdated: new Date().toISOString(),
      metadata: {
        totalControls: 156,
        implementedControls: 142,
        coverage: Math.round((142/156) * 100)
      }
    };
  }

  /**
   * Generate category-specific score
   */
  generateCategoryScore(baseScore, trendDirection) {
    const variance = (Math.random() - 0.5) * 6;
    const score = Math.round(Math.max(50, Math.min(100, baseScore + variance)));

    let change = 0;
    if (trendDirection === 'up') {
      change = Math.floor(Math.random() * 5) + 1;
    } else if (trendDirection === 'down') {
      change = -(Math.floor(Math.random() * 4) + 1);
    } else {
      change = Math.floor(Math.random() * 3) - 1;
    }

    return {
      score,
      trend: trendDirection,
      change
    };
  }

  /**
   * Generate 12-month time series data
   */
  generateTimeSeries() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    let baseScore = 72;

    for (let i = 0; i < 12; i++) {
      baseScore += (Math.random() - 0.4) * 6; // Slight upward trend
      baseScore = Math.max(65, Math.min(85, baseScore));

      data.push({
        month: months[i],
        riskScore: Math.round(baseScore),
        incidents: Math.max(3, Math.floor(15 - i * 0.8 + Math.random() * 5)),
        fraudBlocked: Math.round((98 + Math.random() * 1.5) * 10) / 10,
        uptime: Math.round((99.9 + Math.random() * 0.09) * 100) / 100,
        aiDecisions: Math.floor(750000 + i * 12000 + Math.random() * 50000)
      });
    }

    return data;
  }

  /**
   * Generate risk distribution by severity
   */
  generateRiskDistribution() {
    const total = 100;
    const critical = Math.floor(Math.random() * 10) + 5;
    const high = Math.floor(Math.random() * 25) + 20;
    const medium = Math.floor(Math.random() * 20) + 35;
    const low = total - critical - high - medium;

    return [
      { name: 'Critical', value: critical, color: '#ff4757' },
      { name: 'High', value: high, color: '#ffa502' },
      { name: 'Medium', value: medium, color: '#2ed573' },
      { name: 'Low', value: low, color: '#1e90ff' }
    ];
  }

  /**
   * Generate radar chart data for domain analysis
   */
  generateRadarData() {
    return [
      { category: 'AI Governance', score: Math.floor(Math.random() * 15) + 78, fullMark: 100 },
      { category: 'Fraud Detection', score: Math.floor(Math.random() * 15) + 80, fullMark: 100 },
      { category: 'Data Privacy', score: Math.floor(Math.random() * 20) + 65, fullMark: 100 },
      { category: 'Ops Resilience', score: Math.floor(Math.random() * 15) + 75, fullMark: 100 },
      { category: 'Supply Chain', score: Math.floor(Math.random() * 20) + 62, fullMark: 100 },
      { category: 'Compliance', score: Math.floor(Math.random() * 10) + 85, fullMark: 100 }
    ];
  }
}

// Singleton instance
const riskScoreGenerator = new RiskScoreGenerator();

export default riskScoreGenerator;
