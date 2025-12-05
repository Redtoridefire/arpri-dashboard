import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  Shield, AlertTriangle, Activity, Zap, Lock, Eye, Server, 
  TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, 
  Database, Cloud, Cpu, Network, FileWarning, ShieldCheck,
  BarChart3, PieChart as PieIcon, Layers, Target, AlertCircle
} from 'lucide-react';

// ============================================================================
// DATA MODELS & MOCK DATA
// ============================================================================

const resilienceData = {
  overall: 78,
  categories: {
    aiGovernance: 82,
    fraudDetection: 85,
    dataPrivacy: 71,
    operationalResilience: 79,
    supplyChainSecurity: 68,
    compliancePosture: 88
  }
};

const timeSeriesData = [
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
];

const radarData = [
  { category: 'AI Governance', score: 82, fullMark: 100 },
  { category: 'Fraud Detection', score: 85, fullMark: 100 },
  { category: 'Data Privacy', score: 71, fullMark: 100 },
  { category: 'Ops Resilience', score: 79, fullMark: 100 },
  { category: 'Supply Chain', score: 68, fullMark: 100 },
  { category: 'Compliance', score: 88, fullMark: 100 }
];

const threatVectors = [
  { name: 'Model Poisoning', risk: 'HIGH', score: 72, trend: 'up', incidents: 3 },
  { name: 'Prompt Injection', risk: 'CRITICAL', score: 65, trend: 'up', incidents: 8 },
  { name: 'Data Exfiltration', risk: 'MEDIUM', score: 81, trend: 'down', incidents: 1 },
  { name: 'API Abuse', risk: 'HIGH', score: 74, trend: 'stable', incidents: 5 },
  { name: 'Shadow AI', risk: 'HIGH', score: 69, trend: 'up', incidents: 12 },
  { name: 'Supply Chain', risk: 'MEDIUM', score: 78, trend: 'down', incidents: 2 }
];

const complianceFrameworks = [
  { framework: 'NIST AI RMF', status: 'compliant', coverage: 94, lastAudit: '2024-11-15' },
  { framework: 'PCI DSS 4.0', status: 'compliant', coverage: 98, lastAudit: '2024-10-22' },
  { framework: 'NYDFS 500', status: 'compliant', coverage: 96, lastAudit: '2024-09-30' },
  { framework: 'SOX', status: 'compliant', coverage: 99, lastAudit: '2024-11-01' },
  { framework: 'GDPR/CCPA', status: 'partial', coverage: 87, lastAudit: '2024-08-15' },
  { framework: 'OCC Guidelines', status: 'compliant', coverage: 92, lastAudit: '2024-10-10' }
];

const aiModelInventory = [
  { name: 'FraudNet-v3.2', type: 'Detection', status: 'production', riskTier: 'high', lastValidation: '2024-11-20', driftScore: 2.1 },
  { name: 'TokenAuth-LLM', type: 'Authentication', status: 'production', riskTier: 'critical', lastValidation: '2024-11-18', driftScore: 1.8 },
  { name: 'TxnClassifier', type: 'Classification', status: 'production', riskTier: 'medium', lastValidation: '2024-11-22', driftScore: 3.4 },
  { name: 'RiskScore-Agent', type: 'Agentic', status: 'staging', riskTier: 'critical', lastValidation: '2024-11-21', driftScore: 1.2 },
  { name: 'CustomerIntent', type: 'NLP', status: 'production', riskTier: 'low', lastValidation: '2024-11-19', driftScore: 4.7 },
  { name: 'AnomalyHunter', type: 'Detection', status: 'production', riskTier: 'high', lastValidation: '2024-11-17', driftScore: 2.9 }
];

const realtimeMetrics = {
  txnPerSecond: 47892,
  avgLatency: 12.4,
  fraudAttempts: 1247,
  blockedRate: 99.2,
  aiDecisions: 892456,
  humanEscalations: 234
};

const riskDistribution = [
  { name: 'Critical', value: 8, color: '#ff4757' },
  { name: 'High', value: 23, color: '#ffa502' },
  { name: 'Medium', value: 42, color: '#2ed573' },
  { name: 'Low', value: 27, color: '#1e90ff' }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getScoreColor = (score) => {
  if (score >= 85) return '#00ffc8';
  if (score >= 70) return '#2ed573';
  if (score >= 50) return '#ffa502';
  return '#ff4757';
};

const getRiskBadgeColor = (risk) => {
  const colors = {
    'CRITICAL': 'bg-red-500/20 text-red-400 border-red-500/50',
    'HIGH': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    'MEDIUM': 'bg-green-500/20 text-green-400 border-green-500/50',
    'LOW': 'bg-blue-500/20 text-blue-400 border-blue-500/50'
  };
  return colors[risk] || colors['MEDIUM'];
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// ============================================================================
// COMPONENTS
// ============================================================================

const GlowingBorder = ({ children, className = '', color = 'cyan' }) => {
  const glowColors = {
    cyan: 'shadow-[0_0_15px_rgba(0,255,200,0.3)]',
    orange: 'shadow-[0_0_15px_rgba(255,165,2,0.3)]',
    red: 'shadow-[0_0_15px_rgba(255,71,87,0.3)]',
    purple: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]'
  };
  
  return (
    <div className={`${glowColors[color]} ${className}`}>
      {children}
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'cyan' }) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30',
    orange: 'from-orange-500/20 to-orange-900/10 border-orange-500/30',
    red: 'from-red-500/20 to-red-900/10 border-red-500/30',
    green: 'from-green-500/20 to-green-900/10 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-900/10 border-purple-500/30'
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">{title}</p>
          <p className="text-3xl font-bold text-white mt-1 font-mono">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-black/30 border border-white/10`}>
          <Icon className="w-6 h-6 text-gray-300" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-3 text-sm">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
          ) : (
            <Activity className="w-4 h-4 text-gray-400 mr-1" />
          )}
          <span className={trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

const ResilienceGauge = ({ score, label }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="120" height="120" className="-rotate-90">
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
              transition: 'stroke-dashoffset 1s ease-out'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white font-mono">{score}</span>
        </div>
      </div>
      <span className="text-gray-400 text-sm mt-2 text-center">{label}</span>
    </div>
  );
};

const ThreatCard = ({ threat }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium">{threat.name}</span>
        <span className={`px-2 py-1 rounded text-xs font-bold border ${getRiskBadgeColor(threat.risk)}`}>
          {threat.risk}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Score:</span>
          <span className="font-mono" style={{ color: getScoreColor(threat.score) }}>{threat.score}</span>
        </div>
        <div className="flex items-center">
          {threat.trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-red-400" />
          ) : threat.trend === 'down' ? (
            <TrendingDown className="w-4 h-4 text-green-400" />
          ) : (
            <Activity className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-gray-500 ml-2">{threat.incidents} incidents</span>
        </div>
      </div>
    </div>
  );
};

const ComplianceRow = ({ item }) => {
  const statusColors = {
    compliant: 'bg-green-500/20 text-green-400',
    partial: 'bg-yellow-500/20 text-yellow-400',
    'non-compliant': 'bg-red-500/20 text-red-400'
  };

  return (
    <tr className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
      <td className="py-3 px-4">
        <span className="text-white font-medium">{item.framework}</span>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[item.status]}`}>
          {item.status.toUpperCase()}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${item.coverage}%`,
                backgroundColor: getScoreColor(item.coverage)
              }}
            />
          </div>
          <span className="text-gray-400 font-mono text-sm">{item.coverage}%</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-500 text-sm">{item.lastAudit}</td>
    </tr>
  );
};

const ModelCard = ({ model }) => {
  const tierColors = {
    critical: 'border-red-500/50 bg-red-500/10',
    high: 'border-orange-500/50 bg-orange-500/10',
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    low: 'border-green-500/50 bg-green-500/10'
  };

  const statusBadge = {
    production: 'bg-green-500/20 text-green-400',
    staging: 'bg-blue-500/20 text-blue-400',
    development: 'bg-gray-500/20 text-gray-400'
  };

  return (
    <div className={`rounded-lg border ${tierColors[model.riskTier]} p-4 transition-all hover:scale-[1.01]`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Cpu className="w-5 h-5 text-cyan-400 mr-2" />
          <span className="text-white font-semibold">{model.name}</span>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${statusBadge[model.status]}`}>
          {model.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Type:</span>
          <span className="text-gray-300 ml-2">{model.type}</span>
        </div>
        <div>
          <span className="text-gray-500">Risk:</span>
          <span className="text-gray-300 ml-2 capitalize">{model.riskTier}</span>
        </div>
        <div>
          <span className="text-gray-500">Drift:</span>
          <span className={`ml-2 ${model.driftScore > 3 ? 'text-orange-400' : 'text-green-400'}`}>
            {model.driftScore}%
          </span>
        </div>
        <div>
          <span className="text-gray-500">Validated:</span>
          <span className="text-gray-300 ml-2">{model.lastValidation.slice(5)}</span>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center mb-6">
    <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 mr-3">
      <Icon className="w-5 h-5 text-cyan-400" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
  </div>
);

const LiveIndicator = () => (
  <div className="flex items-center">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
    <span className="text-green-400 text-sm font-medium">LIVE</span>
  </div>
);

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function ARPRIDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedMetrics, setAnimatedMetrics] = useState(realtimeMetrics);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedMetrics(prev => ({
        ...prev,
        txnPerSecond: prev.txnPerSecond + Math.floor(Math.random() * 200 - 100),
        fraudAttempts: prev.fraudAttempts + Math.floor(Math.random() * 10),
        aiDecisions: prev.aiDecisions + Math.floor(Math.random() * 1000)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'threats', label: 'Threat Intel', icon: AlertTriangle },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'models', label: 'AI Models', icon: Cpu }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-800/50 backdrop-blur-xl bg-black/30">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <Shield className="w-10 h-10 text-cyan-400" />
                <div className="absolute inset-0 w-10 h-10 bg-cyan-400/30 blur-xl" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ARPRI
                  </span>
                  <span className="text-gray-300 ml-2 font-light">Dashboard</span>
                </h1>
                <p className="text-gray-500 text-sm">AI Risk & Payments Resilience Index</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <LiveIndicator />
              <div className="text-right">
                <p className="text-gray-400 text-sm">Last Updated</p>
                <p className="text-white font-mono text-sm">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 mt-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-[1600px] mx-auto px-6 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Overall Resilience"
                value={`${resilienceData.overall}/100`}
                subtitle="Enterprise Score"
                icon={Shield}
                trend="up"
                trendValue="+3.2 this month"
                color="cyan"
              />
              <MetricCard
                title="Transactions/sec"
                value={formatNumber(animatedMetrics.txnPerSecond)}
                subtitle="Real-time volume"
                icon={Zap}
                trend="up"
                trendValue="+12% from baseline"
                color="green"
              />
              <MetricCard
                title="Fraud Blocked"
                value={`${realtimeMetrics.blockedRate}%`}
                subtitle={`${formatNumber(animatedMetrics.fraudAttempts)} attempts today`}
                icon={Lock}
                trend="up"
                trendValue="+0.3% accuracy"
                color="purple"
              />
              <MetricCard
                title="AI Decisions"
                value={formatNumber(animatedMetrics.aiDecisions)}
                subtitle={`${realtimeMetrics.humanEscalations} escalations`}
                icon={Cpu}
                trend="stable"
                trendValue="0.03% escalation rate"
                color="orange"
              />
            </div>

            {/* Resilience Scores + Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resilience Gauges */}
              <GlowingBorder className="col-span-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={Target} title="Resilience Index" subtitle="Domain Scores" />
                <div className="grid grid-cols-3 gap-4">
                  <ResilienceGauge score={resilienceData.categories.aiGovernance} label="AI Gov" />
                  <ResilienceGauge score={resilienceData.categories.fraudDetection} label="Fraud" />
                  <ResilienceGauge score={resilienceData.categories.dataPrivacy} label="Privacy" />
                  <ResilienceGauge score={resilienceData.categories.operationalResilience} label="Ops" />
                  <ResilienceGauge score={resilienceData.categories.supplyChainSecurity} label="Supply" />
                  <ResilienceGauge score={resilienceData.categories.compliancePosture} label="Comply" />
                </div>
              </GlowingBorder>

              {/* Trend Chart */}
              <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={Activity} title="12-Month Trend" subtitle="Risk Score & Incident Correlation" />
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ffc8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00ffc8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1f2e', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="riskScore" 
                      stroke="#00ffc8" 
                      fillOpacity={1} 
                      fill="url(#riskGradient)"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="incidents" 
                      stroke="#ff4757" 
                      strokeWidth={2}
                      dot={{ fill: '#ff4757', r: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar + Risk Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={Layers} title="Domain Analysis" subtitle="Capability Radar" />
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#888', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666' }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#00ffc8"
                      fill="#00ffc8"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1f2e', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Distribution */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={PieIcon} title="Risk Distribution" subtitle="By Severity Level" />
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1f2e', 
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend 
                        formatter={(value) => <span style={{ color: '#888' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Threats Tab */}
        {activeTab === 'threats' && (
          <div className="space-y-6">
            <SectionHeader icon={AlertTriangle} title="Threat Intelligence" subtitle="Active threat vectors and risk indicators" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {threatVectors.map((threat, index) => (
                <ThreatCard key={index} threat={threat} />
              ))}
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Threat Trend Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={threatVectors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#666" fontSize={11} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1f2e', 
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="score" fill="#00ffc8" radius={[4, 4, 0, 0]}>
                    {threatVectors.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getScoreColor(entry.score)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <SectionHeader icon={ShieldCheck} title="Compliance Posture" subtitle="Regulatory framework alignment and coverage" />
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-black/30">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Framework</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Coverage</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Last Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceFrameworks.map((item, index) => (
                    <ComplianceRow key={index} item={item} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <MetricCard
                title="Average Coverage"
                value="94%"
                subtitle="Across all frameworks"
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Next Audit"
                value="Dec 15"
                subtitle="PCI DSS Assessment"
                icon={Clock}
                color="orange"
              />
              <MetricCard
                title="Open Findings"
                value="7"
                subtitle="2 critical, 5 medium"
                icon={AlertCircle}
                color="red"
              />
            </div>
          </div>
        )}

        {/* AI Models Tab */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <SectionHeader icon={Cpu} title="AI Model Inventory" subtitle="Production models and risk classification" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiModelInventory.map((model, index) => (
                <ModelCard key={index} model={model} />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Model Drift Monitoring</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={aiModelInventory} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#666" domain={[0, 5]} />
                    <YAxis type="category" dataKey="name" stroke="#666" width={100} fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1f2e', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="driftScore" fill="#00ffc8" radius={[0, 4, 4, 0]}>
                      {aiModelInventory.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.driftScore > 3 ? '#ffa502' : '#00ffc8'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Model Risk Tiers</h3>
                <div className="space-y-4">
                  {['critical', 'high', 'medium', 'low'].map(tier => {
                    const count = aiModelInventory.filter(m => m.riskTier === tier).length;
                    const percentage = (count / aiModelInventory.length) * 100;
                    const colors = {
                      critical: '#ff4757',
                      high: '#ffa502',
                      medium: '#2ed573',
                      low: '#1e90ff'
                    };
                    return (
                      <div key={tier} className="flex items-center">
                        <span className="w-20 text-gray-400 text-sm capitalize">{tier}</span>
                        <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden mx-3">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: colors[tier] }}
                          />
                        </div>
                        <span className="text-gray-400 text-sm font-mono w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-800/50 backdrop-blur-xl bg-black/30 mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>ARPRI Dashboard v1.0 • AI Risk & Payments Resilience Index</p>
            <p>Agentic AI Security Blueprint 2025–2030</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
