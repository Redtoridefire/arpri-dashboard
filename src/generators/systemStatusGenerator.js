/**
 * System Status Generator
 * Generates realistic system health, uptime, and infrastructure metrics
 */

const SYSTEM_COMPONENTS = [
  { name: 'API Gateway', criticality: 'critical', baseUptime: 99.99 },
  { name: 'Payment Processor', criticality: 'critical', baseUptime: 99.98 },
  { name: 'Fraud Detection Engine', criticality: 'critical', baseUptime: 99.95 },
  { name: 'AI Orchestrator', criticality: 'high', baseUptime: 99.92 },
  { name: 'Model Registry', criticality: 'high', baseUptime: 99.90 },
  { name: 'Token Vault', criticality: 'critical', baseUptime: 99.99 },
  { name: 'Database Cluster', criticality: 'critical', baseUptime: 99.97 },
  { name: 'Cache Layer', criticality: 'medium', baseUptime: 99.85 },
  { name: 'Message Queue', criticality: 'high', baseUptime: 99.88 },
  { name: 'Analytics Engine', criticality: 'low', baseUptime: 99.50 },
  { name: 'Monitoring System', criticality: 'medium', baseUptime: 99.70 },
  { name: 'Backup System', criticality: 'medium', baseUptime: 99.60 }
];

class SystemStatusGenerator {
  constructor() {
    this.componentStates = {};
    this.incidentCounter = 0;

    // Initialize component states
    SYSTEM_COMPONENTS.forEach(component => {
      this.componentStates[component.name] = {
        status: Math.random() > 0.05 ? 'operational' : 'degraded',
        lastIncident: this.generatePastDate(Math.floor(Math.random() * 30)),
        uptime: component.baseUptime
      };
    });
  }

  /**
   * Generate system status overview
   */
  generateSystemStatus() {
    return {
      overall: this.calculateOverallStatus(),
      components: SYSTEM_COMPONENTS.map(component => {
        const state = this.componentStates[component.name];
        const uptimeVariance = (Math.random() - 0.5) * 0.05;
        const currentUptime = Math.max(95, Math.min(100,
          Math.round((component.baseUptime + uptimeVariance) * 100) / 100
        ));

        return {
          name: component.name,
          status: state.status,
          criticality: component.criticality,
          uptime: currentUptime,
          responseTime: this.generateResponseTime(component.criticality),
          lastIncident: state.lastIncident,
          incidentCount: Math.floor(Math.random() * 5),
          metrics: this.generateComponentMetrics(component.name)
        };
      }),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Calculate overall system status
   */
  calculateOverallStatus() {
    const criticalComponents = SYSTEM_COMPONENTS.filter(c => c.criticality === 'critical');
    const criticalStates = criticalComponents.map(c => this.componentStates[c.name].status);

    if (criticalStates.some(s => s === 'down')) return 'major_outage';
    if (criticalStates.some(s => s === 'degraded')) return 'degraded';
    if (criticalStates.every(s => s === 'operational')) return 'operational';

    return 'operational';
  }

  /**
   * Generate component metrics
   */
  generateComponentMetrics(componentName) {
    return {
      cpu: Math.round((30 + Math.random() * 50) * 10) / 10,
      memory: Math.round((40 + Math.random() * 40) * 10) / 10,
      disk: Math.round((20 + Math.random() * 60) * 10) / 10,
      network: Math.round((10 + Math.random() * 30) * 10) / 10,
      requests: Math.floor(Math.random() * 10000) + 5000,
      errors: Math.floor(Math.random() * 50)
    };
  }

  /**
   * Generate response time based on criticality
   */
  generateResponseTime(criticality) {
    const baseTimes = {
      critical: 15,
      high: 30,
      medium: 50,
      low: 100
    };

    const baseTime = baseTimes[criticality] || 50;
    const variance = (Math.random() - 0.5) * baseTime * 0.4;

    return Math.max(5, Math.round(baseTime + variance));
  }

  /**
   * Generate infrastructure metrics
   */
  generateInfrastructureMetrics() {
    return {
      servers: {
        total: 45,
        active: 43,
        standby: 2,
        maintenance: 0
      },
      containers: {
        total: 280,
        running: 275,
        stopped: 3,
        restarting: 2
      },
      databases: {
        total: 6,
        primary: 3,
        replicas: 3,
        health: 'healthy'
      },
      loadBalancers: {
        total: 4,
        active: 4,
        avgLoad: Math.round((45 + Math.random() * 30) * 10) / 10
      },
      network: {
        bandwidth: Math.round((500 + Math.random() * 300) * 10) / 10, // Mbps
        latency: Math.round((2 + Math.random() * 3) * 10) / 10, // ms
        packets: Math.floor(Math.random() * 1000000) + 5000000
      },
      storage: {
        total: 50000, // GB
        used: 32500 + Math.floor(Math.random() * 5000),
        available: 17500 - Math.floor(Math.random() * 5000),
        iops: Math.floor(Math.random() * 10000) + 20000
      }
    };
  }

  /**
   * Generate incident history
   */
  generateIncidents(days = 30) {
    const incidents = [];
    const count = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < count; i++) {
      const component = SYSTEM_COMPONENTS[Math.floor(Math.random() * SYSTEM_COMPONENTS.length)];
      const severity = this.getSeverityFromCriticality(component.criticality);
      const status = ['resolved', 'investigating', 'monitoring'][Math.floor(Math.random() * 3)];
      const daysAgo = Math.floor(Math.random() * days);

      incidents.push({
        id: `INC-${this.generateIncidentId()}`,
        title: this.generateIncidentTitle(component.name),
        component: component.name,
        severity,
        status,
        impact: this.generateImpact(severity),
        startTime: this.generatePastDate(daysAgo),
        endTime: status === 'resolved' ? this.generatePastDate(Math.max(0, daysAgo - 1)) : null,
        duration: status === 'resolved' ? this.generateDuration() : null,
        updates: Math.floor(Math.random() * 5) + 1
      });
    }

    return incidents.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }

  /**
   * Get severity from criticality
   */
  getSeverityFromCriticality(criticality) {
    const mapping = {
      critical: ['critical', 'major'][Math.floor(Math.random() * 2)],
      high: ['major', 'minor'][Math.floor(Math.random() * 2)],
      medium: 'minor',
      low: 'minor'
    };
    return mapping[criticality] || 'minor';
  }

  /**
   * Generate incident title
   */
  generateIncidentTitle(componentName) {
    const types = [
      'High Response Time',
      'Intermittent Errors',
      'Performance Degradation',
      'Connection Timeout',
      'Memory Pressure',
      'Elevated Error Rate'
    ];
    return `${componentName}: ${types[Math.floor(Math.random() * types.length)]}`;
  }

  /**
   * Generate incident impact
   */
  generateImpact(severity) {
    const impacts = {
      critical: 'Service unavailable for all users',
      major: 'Degraded performance affecting multiple users',
      minor: 'Minor impact to subset of users'
    };
    return impacts[severity] || impacts.minor;
  }

  /**
   * Generate incident ID
   */
  generateIncidentId() {
    return `${Date.now()}-${++this.incidentCounter}`;
  }

  /**
   * Generate incident duration
   */
  generateDuration() {
    const minutes = Math.floor(Math.random() * 120) + 5;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Generate past date
   */
  generatePastDate(daysAgo) {
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }

  /**
   * Generate uptime statistics
   */
  generateUptimeStats(days = 90) {
    const stats = [];
    let runningUptime = 99.95;

    for (let i = days - 1; i >= 0; i--) {
      const variance = (Math.random() - 0.7) * 0.1; // Slight improvement over time
      runningUptime = Math.min(99.99, Math.max(99.5, runningUptime + variance));

      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      stats.push({
        date: date.toISOString().split('T')[0],
        uptime: Math.round(runningUptime * 100) / 100,
        incidents: Math.floor(Math.random() * 3),
        downtime: Math.round((100 - runningUptime) * 1440) // minutes
      });
    }

    return stats;
  }

  /**
   * Generate SLA metrics
   */
  generateSLAMetrics() {
    return {
      availability: {
        target: 99.95,
        actual: Math.round((99.92 + Math.random() * 0.05) * 100) / 100,
        status: 'meeting'
      },
      latency: {
        target: 50, // ms
        actual: Math.round((25 + Math.random() * 15) * 10) / 10,
        status: 'meeting'
      },
      errorRate: {
        target: 0.1, // percentage
        actual: Math.round((0.02 + Math.random() * 0.05) * 1000) / 1000,
        status: 'meeting'
      },
      throughput: {
        target: 100000, // requests per minute
        actual: Math.floor(Math.random() * 50000) + 110000,
        status: 'exceeding'
      }
    };
  }

  /**
   * Generate performance metrics
   */
  generatePerformanceMetrics() {
    return {
      requests: {
        total: Math.floor(Math.random() * 10000000) + 50000000,
        successful: Math.floor(Math.random() * 9900000) + 49500000,
        failed: Math.floor(Math.random() * 50000) + 10000,
        avgDuration: Math.round((150 + Math.random() * 100) * 10) / 10
      },
      database: {
        queries: Math.floor(Math.random() * 50000000) + 200000000,
        avgQueryTime: Math.round((5 + Math.random() * 10) * 10) / 10,
        slowQueries: Math.floor(Math.random() * 1000) + 500,
        connectionPool: Math.round((60 + Math.random() * 30) * 10) / 10
      },
      cache: {
        hits: Math.floor(Math.random() * 40000000) + 180000000,
        misses: Math.floor(Math.random() * 5000000) + 10000000,
        hitRate: Math.round((94 + Math.random() * 4) * 10) / 10,
        evictions: Math.floor(Math.random() * 100000) + 50000
      }
    };
  }
}

// Singleton instance
const systemStatusGenerator = new SystemStatusGenerator();

export default systemStatusGenerator;
