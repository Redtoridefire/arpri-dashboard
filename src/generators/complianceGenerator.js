/**
 * Compliance Generator
 * Generates realistic compliance framework status, audit findings, and control coverage
 */

const FRAMEWORKS = [
  {
    framework: 'NIST AI RMF',
    baseCoverage: 94,
    type: 'AI Governance',
    mandatory: false,
    auditCycle: 180
  },
  {
    framework: 'PCI DSS 4.0',
    baseCoverage: 98,
    type: 'Payment Security',
    mandatory: true,
    auditCycle: 365
  },
  {
    framework: 'NYDFS 500',
    baseCoverage: 96,
    type: 'Cybersecurity',
    mandatory: true,
    auditCycle: 180
  },
  {
    framework: 'SOX',
    baseCoverage: 99,
    type: 'Financial Controls',
    mandatory: true,
    auditCycle: 365
  },
  {
    framework: 'GDPR/CCPA',
    baseCoverage: 87,
    type: 'Data Privacy',
    mandatory: true,
    auditCycle: 365
  },
  {
    framework: 'OCC Guidelines',
    baseCoverage: 92,
    type: 'Model Risk Management',
    mandatory: true,
    auditCycle: 365
  },
  {
    framework: 'ISO 27001',
    baseCoverage: 90,
    type: 'Information Security',
    mandatory: false,
    auditCycle: 365
  },
  {
    framework: 'SOC 2 Type II',
    baseCoverage: 95,
    type: 'Trust Services',
    mandatory: false,
    auditCycle: 365
  }
];

class ComplianceGenerator {
  constructor() {
    this.frameworkStates = {};

    // Initialize framework states
    FRAMEWORKS.forEach(fw => {
      const lastAuditDaysAgo = Math.floor(Math.random() * fw.auditCycle);
      const lastAudit = new Date(Date.now() - lastAuditDaysAgo * 24 * 60 * 60 * 1000);
      const nextAudit = new Date(lastAudit.getTime() + fw.auditCycle * 24 * 60 * 60 * 1000);

      this.frameworkStates[fw.framework] = {
        lastAudit: lastAudit.toISOString().split('T')[0],
        nextAudit: nextAudit.toISOString().split('T')[0],
        findings: Math.floor(Math.random() * (fw.mandatory ? 3 : 5)),
        remediated: 0
      };
    });
  }

  /**
   * Generate compliance framework status
   */
  generateComplianceStatus() {
    return FRAMEWORKS.map(fw => {
      const state = this.frameworkStates[fw.framework];
      const coverageVariance = (Math.random() - 0.5) * 4;
      const coverage = Math.max(75, Math.min(100, Math.round(fw.baseCoverage + coverageVariance)));

      // Determine status based on coverage and findings
      let status = 'compliant';
      if (coverage < 85 || state.findings > 5) {
        status = 'partial';
      } else if (state.findings > 3) {
        status = 'partial';
      }

      return {
        framework: fw.framework,
        status,
        coverage,
        type: fw.type,
        mandatory: fw.mandatory,
        lastAudit: state.lastAudit,
        nextAudit: state.nextAudit,
        findings: state.findings,
        openFindings: Math.max(0, state.findings - state.remediated),
        closedFindings: state.remediated,
        auditCycle: fw.auditCycle,
        daysUntilAudit: this.calculateDaysUntil(state.nextAudit),
        controls: this.generateControls(fw)
      };
    });
  }

  /**
   * Generate control coverage for a framework
   */
  generateControls(framework) {
    const totalControls = Math.floor(Math.random() * 50) + 30;
    const implemented = Math.floor(totalControls * (framework.baseCoverage / 100));
    const inProgress = Math.floor((totalControls - implemented) * 0.6);
    const notStarted = totalControls - implemented - inProgress;

    return {
      total: totalControls,
      implemented,
      inProgress,
      notStarted,
      effectiveness: Math.round((85 + Math.random() * 12) * 10) / 10
    };
  }

  /**
   * Calculate days until date
   */
  calculateDaysUntil(dateString) {
    const target = new Date(dateString);
    const now = new Date();
    const diff = target - now;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  /**
   * Generate audit findings
   */
  generateAuditFindings() {
    const severities = ['critical', 'high', 'medium', 'low'];
    const findings = [];

    FRAMEWORKS.forEach(fw => {
      const state = this.frameworkStates[fw.framework];

      for (let i = 0; i < state.findings; i++) {
        const severity = severities[Math.min(severities.length - 1, Math.floor(Math.random() * severities.length))];
        const isOpen = Math.random() > 0.6;

        findings.push({
          id: `F-${fw.framework.replace(/\s/g, '')}-${i + 1}`,
          framework: fw.framework,
          severity,
          status: isOpen ? 'open' : 'closed',
          title: this.generateFindingTitle(fw.type),
          description: this.generateFindingDescription(fw.type),
          identifiedDate: state.lastAudit,
          dueDate: this.generateDueDate(severity, state.lastAudit),
          assignedTo: this.getRandomTeam(),
          remediation: this.getRemediationPlan(severity)
        });
      }
    });

    return findings.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Generate finding title
   */
  generateFindingTitle(type) {
    const titles = {
      'AI Governance': [
        'Incomplete AI model inventory documentation',
        'Missing bias testing procedures',
        'Insufficient model validation controls'
      ],
      'Payment Security': [
        'Incomplete PAN encryption in transit',
        'Missing tokenization controls',
        'Weak access controls on payment data'
      ],
      'Cybersecurity': [
        'Multi-factor authentication not enforced',
        'Incomplete asset inventory',
        'Missing penetration test evidence'
      ],
      'Data Privacy': [
        'Incomplete data retention policies',
        'Missing privacy impact assessments',
        'Insufficient consent management'
      ],
      'Financial Controls': [
        'Incomplete segregation of duties',
        'Missing change management controls',
        'Insufficient audit trail'
      ],
      'Model Risk Management': [
        'Incomplete model risk assessment',
        'Missing model performance monitoring',
        'Insufficient model governance'
      ]
    };

    const options = titles[type] || titles['Cybersecurity'];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Generate finding description
   */
  generateFindingDescription(type) {
    return `Control gap identified during ${type} review requiring remediation to ensure full compliance with framework requirements.`;
  }

  /**
   * Generate due date based on severity
   */
  generateDueDate(severity, auditDate) {
    const days = {
      critical: 30,
      high: 60,
      medium: 90,
      low: 120
    };

    const daysToAdd = days[severity] || 90;
    const date = new Date(auditDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
  }

  /**
   * Get random team
   */
  getRandomTeam() {
    const teams = [
      'Security Engineering',
      'Compliance Team',
      'AI Governance',
      'Data Protection',
      'Infrastructure',
      'Application Security'
    ];
    return teams[Math.floor(Math.random() * teams.length)];
  }

  /**
   * Get remediation plan
   */
  getRemediationPlan(severity) {
    if (severity === 'critical') {
      return 'Immediate remediation required with executive oversight';
    } else if (severity === 'high') {
      return 'Priority remediation with weekly progress updates';
    } else if (severity === 'medium') {
      return 'Standard remediation timeline with monthly review';
    }
    return 'Remediate during next maintenance cycle';
  }

  /**
   * Generate compliance metrics summary
   */
  generateComplianceSummary() {
    const frameworks = this.generateComplianceStatus();
    const totalControls = frameworks.reduce((sum, fw) => sum + fw.controls.total, 0);
    const implementedControls = frameworks.reduce((sum, fw) => sum + fw.controls.implemented, 0);

    const totalFindings = frameworks.reduce((sum, fw) => sum + fw.findings, 0);
    const openFindings = frameworks.reduce((sum, fw) => sum + fw.openFindings, 0);

    return {
      overallCoverage: Math.round((implementedControls / totalControls) * 100),
      totalFrameworks: frameworks.length,
      compliantFrameworks: frameworks.filter(fw => fw.status === 'compliant').length,
      partialFrameworks: frameworks.filter(fw => fw.status === 'partial').length,
      totalControls,
      implementedControls,
      totalFindings,
      openFindings,
      closedFindings: totalFindings - openFindings,
      nextAudit: frameworks
        .map(fw => ({ name: fw.framework, date: fw.nextAudit }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0]
    };
  }

  /**
   * Generate compliance trend
   */
  generateComplianceTrend(months = 12) {
    const trend = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const baseCoverage = 88;
      const improvementRate = 0.3;
      const variance = (Math.random() - 0.5) * 3;

      trend.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        coverage: Math.min(98, Math.round(baseCoverage + (months - i) * improvementRate + variance)),
        findings: Math.max(5, Math.floor(25 - i * 1.2 + Math.random() * 5)),
        frameworks: FRAMEWORKS.length
      });
    }

    return trend;
  }
}

// Singleton instance
const complianceGenerator = new ComplianceGenerator();

export default complianceGenerator;
