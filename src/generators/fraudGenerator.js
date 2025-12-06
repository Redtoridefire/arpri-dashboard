/**
 * Fraud Generator
 * Generates realistic fraud metrics, patterns, and real-time transaction data
 */

class FraudGenerator {
  constructor() {
    this.baselineT

xnPerSec = 48000;
    this.baselineFraudAttempts = 1250;
    this.baselineAIDecisions = 890000;
  }

  /**
   * Generate real-time fraud metrics
   */
  generateRealTimeMetrics() {
    const now = new Date();
    const hour = now.getHours();

    // Simulate daily patterns (higher during business hours)
    const businessHourMultiplier = (hour >= 9 && hour <= 17) ? 1.3 : 0.8;

    const txnPerSecond = Math.floor(
      this.baselineTxnPerSec * businessHourMultiplier + (Math.random() - 0.5) * 2000
    );

    const fraudAttempts = Math.floor(
      this.baselineFraudAttempts * businessHourMultiplier + (Math.random() - 0.5) * 100
    );

    const aiDecisions = Math.floor(
      this.baselineAIDecisions + (Math.random() - 0.5) * 10000
    );

    const blockedRate = Math.round((99.0 + Math.random() * 0.5) * 10) / 10;
    const humanEscalations = Math.floor(Math.random() * 50) + 200;

    return {
      txnPerSecond,
      fraudAttempts,
      blockedRate,
      aiDecisions,
      humanEscalations,
      escalationRate: Math.round((humanEscalations / aiDecisions) * 10000) / 100,
      avgDecisionTime: Math.round((10 + Math.random() * 20) * 10) / 10,
      falsePositiveRate: Math.round((0.2 + Math.random() * 0.3) * 100) / 100,
      timestamp: now.toISOString()
    };
  }

  /**
   * Generate fraud pattern analysis
   */
  generateFraudPatterns() {
    const patterns = [
      {
        type: 'Card Testing',
        description: 'Sequential low-value transactions to test stolen cards',
        prevalence: Math.floor(Math.random() * 30) + 20,
        blocked: Math.floor(Math.random() * 20) + 95,
        avgAmount: Math.round((5 + Math.random() * 15) * 100) / 100,
        geography: ['US', 'UK', 'CA'],
        trend: Math.random() > 0.5 ? 'increasing' : 'stable'
      },
      {
        type: 'Account Takeover',
        description: 'Credential stuffing and unauthorized account access',
        prevalence: Math.floor(Math.random() * 20) + 15,
        blocked: Math.floor(Math.random() * 15) + 85,
        avgAmount: Math.round((200 + Math.random() * 300) * 100) / 100,
        geography: ['US', 'BR', 'IN'],
        trend: Math.random() > 0.3 ? 'increasing' : 'decreasing'
      },
      {
        type: 'Synthetic Identity',
        description: 'Fabricated identities using real and fake information',
        prevalence: Math.floor(Math.random() * 15) + 10,
        blocked: Math.floor(Math.random() * 20) + 70,
        avgAmount: Math.round((500 + Math.random() * 1000) * 100) / 100,
        geography: ['US', 'MX'],
        trend: 'increasing'
      },
      {
        type: 'Friendly Fraud',
        description: 'Legitimate purchase followed by chargeback',
        prevalence: Math.floor(Math.random() * 25) + 15,
        blocked: Math.floor(Math.random() * 10) + 40,
        avgAmount: Math.round((100 + Math.random() * 200) * 100) / 100,
        geography: ['US', 'UK', 'AU'],
        trend: 'stable'
      },
      {
        type: 'BIN Attack',
        description: 'Systematic testing of card number ranges',
        prevalence: Math.floor(Math.random() * 10) + 5,
        blocked: Math.floor(Math.random() * 5) + 95,
        avgAmount: Math.round((1 + Math.random() * 5) * 100) / 100,
        geography: ['CN', 'RU', 'VN'],
        trend: Math.random() > 0.6 ? 'increasing' : 'stable'
      }
    ];

    return patterns.map(pattern => ({
      ...pattern,
      detectedToday: Math.floor(Math.random() * 100) + 20,
      blockedToday: Math.floor((pattern.blocked / 100) * (Math.random() * 100 + 20)),
      riskScore: this.calculatePatternRisk(pattern.prevalence, pattern.blocked)
    }));
  }

  /**
   * Calculate pattern risk score
   */
  calculatePatternRisk(prevalence, blockedRate) {
    const risk = prevalence * (1 - blockedRate / 100);
    if (risk > 15) return 'HIGH';
    if (risk > 8) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Generate geographic fraud distribution
   */
  generateGeographicDistribution() {
    const regions = [
      { code: 'US', name: 'United States', attempts: 450, blocked: 440, rate: 97.8 },
      { code: 'UK', name: 'United Kingdom', attempts: 180, blocked: 175, rate: 97.2 },
      { code: 'BR', name: 'Brazil', attempts: 220, blocked: 210, rate: 95.5 },
      { code: 'IN', name: 'India', attempts: 190, blocked: 182, rate: 95.8 },
      { code: 'CN', name: 'China', attempts: 160, blocked: 152, rate: 95.0 },
      { code: 'RU', name: 'Russia', attempts: 140, blocked: 130, rate: 92.9 },
      { code: 'MX', name: 'Mexico', attempts: 110, blocked: 105, rate: 95.5 },
      { code: 'CA', name: 'Canada', attempts: 95, blocked: 92, rate: 96.8 }
    ];

    return regions.map(region => ({
      ...region,
      attempts: region.attempts + Math.floor((Math.random() - 0.5) * 40),
      variance: Math.round((Math.random() - 0.5) * 5 * 10) / 10
    }));
  }

  /**
   * Generate fraud velocity metrics
   */
  generateVelocityMetrics() {
    return {
      perSecond: Math.floor(Math.random() * 3) + 1,
      perMinute: Math.floor(Math.random() * 150) + 50,
      perHour: Math.floor(Math.random() * 8000) + 2000,
      per24Hours: Math.floor(Math.random() * 150000) + 50000,
      peakHour: Math.floor(Math.random() * 24),
      peakDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)]
    };
  }

  /**
   * Generate merchant risk scores
   */
  generateMerchantRisks() {
    const categories = ['E-commerce', 'Travel', 'Gaming', 'Subscription', 'Retail', 'Financial Services'];

    return categories.map(category => ({
      category,
      riskScore: Math.floor(Math.random() * 40) + 30,
      transactionVolume: Math.floor(Math.random() * 100000) + 50000,
      fraudRate: Math.round((0.5 + Math.random() * 2) * 100) / 100,
      chargebackRate: Math.round((0.2 + Math.random() * 1) * 100) / 100,
      topMerchants: Math.floor(Math.random() * 50) + 20
    }));
  }

  /**
   * Generate decision breakdown
   */
  generateDecisionBreakdown() {
    const total = 100000;
    const approved = Math.floor(total * (0.92 + Math.random() * 0.05));
    const declined = Math.floor(total * (0.03 + Math.random() * 0.02));
    const reviewed = total - approved - declined;

    return {
      total,
      approved,
      declined,
      manualReview: reviewed,
      autoApproved: Math.floor(approved * 0.98),
      autoDeclined: Math.floor(declined * 0.95),
      avgConfidence: Math.round((92 + Math.random() * 7) * 10) / 10
    };
  }

  /**
   * Generate hourly fraud trends
   */
  generateHourlyTrends(hours = 24) {
    const trends = [];
    const now = new Date();

    for (let i = hours - 1; i >= 0; i--) {
      const hour = new Date(now - i * 60 * 60 * 1000);
      const hourNum = hour.getHours();
      const businessMultiplier = (hourNum >= 9 && hourNum <= 17) ? 1.3 : 0.8;

      trends.push({
        hour: hour.toISOString(),
        transactions: Math.floor((Math.random() * 50000 + 150000) * businessMultiplier),
        fraudAttempts: Math.floor((Math.random() * 500 + 1000) * businessMultiplier),
        blocked: Math.floor((Math.random() * 480 + 980) * businessMultiplier),
        falsePositives: Math.floor(Math.random() * 20) + 5
      });
    }

    return trends;
  }
}

// Singleton instance
const fraudGenerator = new FraudGenerator();

export default fraudGenerator;
