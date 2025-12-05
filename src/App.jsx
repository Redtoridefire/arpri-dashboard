import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, Sankey, Layer
} from 'recharts';
import {
  Shield, AlertTriangle, Activity, Zap, Lock, Eye, Server,
  TrendingUp, TrendingDown, CheckCircle, XCircle, Clock,
  Database, Cloud, Cpu, Network, FileWarning, ShieldCheck,
  BarChart3, PieChart as PieIcon, Layers, Target, AlertCircle,
  MessageSquare, Send, Bot, X, Download, ChevronRight, ChevronDown,
  GitBranch, Box, Workflow, FileText, Settings, Info, ExternalLink,
  Play, Pause, RefreshCw, Filter, Search, Menu, Home, BookOpen
} from 'lucide-react';
import WhitepaperTab from './WhitepaperTab';

// ============================================================================
// DATA MODELS
// ============================================================================

const resilienceData = {
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
};

const timeSeriesData = [
  { month: 'Jan', riskScore: 72, incidents: 12, fraudBlocked: 98.2, uptime: 99.94, aiDecisions: 782000 },
  { month: 'Feb', riskScore: 74, incidents: 9, fraudBlocked: 98.5, uptime: 99.97, aiDecisions: 801000 },
  { month: 'Mar', riskScore: 71, incidents: 15, fraudBlocked: 98.1, uptime: 99.91, aiDecisions: 756000 },
  { month: 'Apr', riskScore: 76, incidents: 8, fraudBlocked: 98.7, uptime: 99.98, aiDecisions: 823000 },
  { month: 'May', riskScore: 78, incidents: 6, fraudBlocked: 98.9, uptime: 99.99, aiDecisions: 845000 },
  { month: 'Jun', riskScore: 75, incidents: 11, fraudBlocked: 98.4, uptime: 99.95, aiDecisions: 812000 },
  { month: 'Jul', riskScore: 79, incidents: 5, fraudBlocked: 99.1, uptime: 99.99, aiDecisions: 867000 },
  { month: 'Aug', riskScore: 77, incidents: 7, fraudBlocked: 98.8, uptime: 99.97, aiDecisions: 834000 },
  { month: 'Sep', riskScore: 80, incidents: 4, fraudBlocked: 99.2, uptime: 99.99, aiDecisions: 889000 },
  { month: 'Oct', riskScore: 78, incidents: 6, fraudBlocked: 99.0, uptime: 99.98, aiDecisions: 856000 },
  { month: 'Nov', riskScore: 81, incidents: 3, fraudBlocked: 99.3, uptime: 99.99, aiDecisions: 912000 },
  { month: 'Dec', riskScore: 78, incidents: 5, fraudBlocked: 99.1, uptime: 99.97, aiDecisions: 892000 }
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
  { name: 'Model Poisoning', risk: 'HIGH', score: 72, trend: 'up', incidents: 3, description: 'Adversarial manipulation of training data to compromise model integrity', mitigation: 'Input validation, anomaly detection, model versioning' },
  { name: 'Prompt Injection', risk: 'CRITICAL', score: 65, trend: 'up', incidents: 8, description: 'Malicious inputs designed to manipulate LLM behavior', mitigation: 'Input sanitization, output filtering, prompt hardening' },
  { name: 'Data Exfiltration', risk: 'MEDIUM', score: 81, trend: 'down', incidents: 1, description: 'Unauthorized extraction of sensitive payment data via AI systems', mitigation: 'DLP controls, tokenization, access monitoring' },
  { name: 'API Abuse', risk: 'HIGH', score: 74, trend: 'stable', incidents: 5, description: 'Exploitation of AI service endpoints for fraud or DoS', mitigation: 'Rate limiting, authentication, behavioral analysis' },
  { name: 'Shadow AI', risk: 'HIGH', score: 69, trend: 'up', incidents: 12, description: 'Unauthorized AI tools processing payment data', mitigation: 'AI inventory, CASB integration, policy enforcement' },
  { name: 'Supply Chain', risk: 'MEDIUM', score: 78, trend: 'down', incidents: 2, description: 'Compromised third-party models or training data', mitigation: 'Model SBOM, vendor assessment, integrity verification' }
];

const complianceFrameworks = [
  { framework: 'NIST AI RMF', status: 'compliant', coverage: 94, lastAudit: '2024-11-15', nextAudit: '2025-05-15', findings: 2 },
  { framework: 'PCI DSS 4.0', status: 'compliant', coverage: 98, lastAudit: '2024-10-22', nextAudit: '2025-04-22', findings: 1 },
  { framework: 'NYDFS 500', status: 'compliant', coverage: 96, lastAudit: '2024-09-30', nextAudit: '2025-03-30', findings: 3 },
  { framework: 'SOX', status: 'compliant', coverage: 99, lastAudit: '2024-11-01', nextAudit: '2025-05-01', findings: 0 },
  { framework: 'GDPR/CCPA', status: 'partial', coverage: 87, lastAudit: '2024-08-15', nextAudit: '2025-02-15', findings: 5 },
  { framework: 'OCC Guidelines', status: 'compliant', coverage: 92, lastAudit: '2024-10-10', nextAudit: '2025-04-10', findings: 2 }
];

const aiModelInventory = [
  { name: 'FraudNet-v3.2', type: 'Detection', status: 'production', riskTier: 'high', lastValidation: '2024-11-20', driftScore: 2.1, accuracy: 99.2, latency: 12 },
  { name: 'TokenAuth-LLM', type: 'Authentication', status: 'production', riskTier: 'critical', lastValidation: '2024-11-18', driftScore: 1.8, accuracy: 99.8, latency: 8 },
  { name: 'TxnClassifier', type: 'Classification', status: 'production', riskTier: 'medium', lastValidation: '2024-11-22', driftScore: 3.4, accuracy: 97.5, latency: 15 },
  { name: 'RiskScore-Agent', type: 'Agentic', status: 'staging', riskTier: 'critical', lastValidation: '2024-11-21', driftScore: 1.2, accuracy: 98.9, latency: 45 },
  { name: 'CustomerIntent', type: 'NLP', status: 'production', riskTier: 'low', lastValidation: '2024-11-19', driftScore: 4.7, accuracy: 94.2, latency: 22 },
  { name: 'AnomalyHunter', type: 'Detection', status: 'production', riskTier: 'high', lastValidation: '2024-11-17', driftScore: 2.9, accuracy: 98.1, latency: 18 }
];

const riskDistribution = [
  { name: 'Critical', value: 8, color: '#ff4757' },
  { name: 'High', value: 23, color: '#ffa502' },
  { name: 'Medium', value: 42, color: '#2ed573' },
  { name: 'Low', value: 27, color: '#1e90ff' }
];

// Architecture data for diagrams
const architectureLayers = [
  { id: 'presentation', name: 'Presentation Layer', components: ['API Gateway', 'Load Balancer', 'WAF'], color: '#00ffc8' },
  { id: 'orchestration', name: 'AI Orchestration', components: ['Agent Router', 'Model Registry', 'Guardrails'], color: '#1e90ff' },
  { id: 'inference', name: 'Inference Layer', components: ['LLM Cluster', 'ML Models', 'Vector DB'], color: '#8b5cf6' },
  { id: 'data', name: 'Data Layer', components: ['Token Vault', 'DSPM', 'Encryption'], color: '#ffa502' },
  { id: 'security', name: 'Security Fabric', components: ['Zero Trust', 'SIEM', 'SOAR'], color: '#ff4757' }
];

// AI Agent knowledge base
const agentKnowledge = {
  'prompt injection': {
    definition: 'A technique where malicious inputs are crafted to manipulate LLM behavior, bypass safety controls, or extract sensitive information.',
    paymentsContext: 'In payments, prompt injection could manipulate transaction classification, bypass fraud rules, or expose cardholder data through conversational interfaces.',
    mitigations: ['Input sanitization and validation', 'Output filtering and content moderation', 'Prompt hardening with system instructions', 'Behavioral monitoring and anomaly detection'],
    frameworks: ['NIST AI RMF (Govern 1.3)', 'OWASP LLM Top 10']
  },
  'model poisoning': {
    definition: 'The deliberate corruption of ML training data or model weights to introduce backdoors or degrade model performance.',
    paymentsContext: 'Poisoned fraud detection models could allow specific transaction patterns to bypass detection, enabling large-scale financial fraud.',
    mitigations: ['Training data validation', 'Model integrity verification', 'Continuous performance monitoring', 'Secure model supply chain'],
    frameworks: ['NIST AI RMF (Map 1.5)', 'MITRE ATLAS']
  },
  'zero trust': {
    definition: 'A security model that requires strict identity verification for every person and device accessing resources, regardless of network location.',
    paymentsContext: 'Zero Trust in AI payments means every API call, model inference, and data access is authenticated, authorized, and encrypted—no implicit trust.',
    mitigations: ['Microsegmentation', 'Continuous authentication', 'Least privilege access', 'Encrypted data in transit/rest'],
    frameworks: ['NIST SP 800-207', 'PCI DSS 4.0']
  },
  'tokenization': {
    definition: 'The process of replacing sensitive data (like PANs) with non-sensitive tokens that retain essential information without exposing actual values.',
    paymentsContext: 'Tokenization protects cardholder data when processed by AI systems, ensuring models never see actual PANs while maintaining transaction context.',
    mitigations: ['Format-preserving tokenization', 'Token vault isolation', 'Detokenization controls', 'Token lifecycle management'],
    frameworks: ['PCI DSS 4.0 (Req 3)', 'EMVCo Tokenization']
  },
  'agentic ai': {
    definition: 'AI systems capable of autonomous decision-making and action-taking, often orchestrating multiple models and tools to achieve complex goals.',
    paymentsContext: 'Agentic AI in payments can autonomously investigate fraud, adjust risk thresholds, initiate chargebacks, or escalate to human review based on learned patterns.',
    mitigations: ['Human-in-the-loop controls', 'Action boundaries and guardrails', 'Audit logging of all decisions', 'Explainability requirements'],
    frameworks: ['NIST AI RMF (Measure 2.6)', 'EU AI Act']
  },
  'dspm': {
    definition: 'Data Security Posture Management—continuous discovery, classification, and protection of sensitive data across cloud and on-premise environments.',
    paymentsContext: 'DSPM ensures AI training data, model outputs, and inference logs are properly classified and protected according to PCI DSS and privacy regulations.',
    mitigations: ['Automated data discovery', 'Classification tagging', 'Access monitoring', 'Data lineage tracking'],
    frameworks: ['NYDFS 500', 'GDPR Article 32']
  }
};

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

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'cyan', onClick }) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30 hover:border-cyan-500/50',
    orange: 'from-orange-500/20 to-orange-900/10 border-orange-500/30 hover:border-orange-500/50',
    red: 'from-red-500/20 to-red-900/10 border-red-500/30 hover:border-red-500/50',
    green: 'from-green-500/20 to-green-900/10 border-green-500/30 hover:border-green-500/50',
    purple: 'from-purple-500/20 to-purple-900/10 border-purple-500/30 hover:border-purple-500/50'
  };

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
    >
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
      
      {onClick && (
        <div className="absolute bottom-2 right-2">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
};

const ResilienceGauge = ({ score, label, previousScore }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const change = previousScore ? score - previousScore : 0;

  return (
    <div className="flex flex-col items-center group">
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
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white font-mono">{score}</span>
          {change !== 0 && (
            <span className={`text-xs ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change > 0 ? '+' : ''}{change}
            </span>
          )}
        </div>
      </div>
      <span className="text-gray-400 text-sm mt-2 text-center group-hover:text-white transition-colors">{label}</span>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 mr-3">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </div>
    {action && action}
  </div>
);

const LiveIndicator = () => (
  <div className="flex items-center">
    <div className="relative">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
    </div>
    <span className="text-green-400 text-sm font-medium ml-2">LIVE</span>
  </div>
);

// AI Agent Chat Component
const AIAgentChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm the ARPRI AI Agent. I can help you understand AI risk concepts in the context of global payments security. Try asking me about prompt injection, tokenization, zero trust, or agentic AI risks." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Find matching topic
    for (const [key, data] of Object.entries(agentKnowledge)) {
      if (lowerQuery.includes(key) || lowerQuery.includes(key.replace(' ', ''))) {
        return {
          topic: key,
          response: `**${key.charAt(0).toUpperCase() + key.slice(1)}**\n\n${data.definition}\n\n**Payments Context:**\n${data.paymentsContext}\n\n**Key Mitigations:**\n${data.mitigations.map(m => `• ${m}`).join('\n')}\n\n**Relevant Frameworks:** ${data.frameworks.join(', ')}`
        };
      }
    }

    // Generic response
    return {
      topic: null,
      response: "I can provide detailed information on several AI security topics relevant to payments:\n\n• **Prompt Injection** - LLM manipulation attacks\n• **Model Poisoning** - Training data corruption\n• **Zero Trust** - Identity-first security\n• **Tokenization** - Data protection\n• **Agentic AI** - Autonomous AI risks\n• **DSPM** - Data security posture\n\nWhich topic would you like to explore?"
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { response } = processQuery(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/30">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 mr-3">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">ARPRI AI Agent</h3>
              <p className="text-xs text-gray-500">AI Risk & Payments Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl ${
                msg.role === 'user' 
                  ? 'bg-cyan-500/20 border border-cyan-500/30 text-white' 
                  : 'bg-gray-800 border border-gray-700 text-gray-200'
              }`}>
                <div className="text-sm whitespace-pre-wrap">
                  {msg.content.split('**').map((part, j) => 
                    j % 2 === 1 ? <strong key={j} className="text-cyan-400">{part}</strong> : part
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 p-3 rounded-xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 bg-black/30">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about AI security in payments..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 transition-colors"
            >
              <Send className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Try: "What is prompt injection?" or "Explain zero trust for payments"
          </p>
        </div>
      </div>
    </div>
  );
};

// Architecture Diagram Component
const ArchitectureDiagram = ({ type }) => {
  const [hoveredLayer, setHoveredLayer] = useState(null);

  if (type === 'stack') {
    return (
      <div className="space-y-3">
        {architectureLayers.map((layer, index) => (
          <div
            key={layer.id}
            onMouseEnter={() => setHoveredLayer(layer.id)}
            onMouseLeave={() => setHoveredLayer(null)}
            className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
              hoveredLayer === layer.id 
                ? 'border-opacity-100 scale-[1.02] shadow-lg' 
                : 'border-opacity-30'
            }`}
            style={{ 
              borderColor: layer.color,
              backgroundColor: hoveredLayer === layer.id ? `${layer.color}15` : 'transparent'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: layer.color, boxShadow: `0 0 10px ${layer.color}` }}
                />
                <span className="text-white font-medium">{layer.name}</span>
              </div>
              <div className="flex space-x-2">
                {layer.components.map((comp, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 text-xs rounded bg-black/30 border border-white/10 text-gray-400"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Connection line */}
            {index < architectureLayers.length - 1 && (
              <div className="absolute left-6 -bottom-3 w-0.5 h-6 bg-gradient-to-b from-white/20 to-transparent" />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'flow') {
    const flowSteps = [
      { name: 'Transaction', icon: Zap, color: '#00ffc8' },
      { name: 'Gateway', icon: Shield, color: '#1e90ff' },
      { name: 'AI Analysis', icon: Cpu, color: '#8b5cf6' },
      { name: 'Risk Score', icon: Target, color: '#ffa502' },
      { name: 'Decision', icon: CheckCircle, color: '#2ed573' }
    ];

    return (
      <div className="flex items-center justify-between">
        {flowSteps.map((step, index) => (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center group">
              <div 
                className="p-4 rounded-xl border transition-all duration-300 group-hover:scale-110"
                style={{ 
                  borderColor: step.color,
                  backgroundColor: `${step.color}20`,
                  boxShadow: `0 0 20px ${step.color}30`
                }}
              >
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
              </div>
              <span className="text-xs text-gray-400 mt-2 group-hover:text-white transition-colors">
                {step.name}
              </span>
            </div>
            {index < flowSteps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-gradient-to-r from-white/20 via-white/10 to-white/20" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return null;
};

// Drill-down Modal Component
const DrillDownModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/30 sticky top-0">
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Threat Detail Component
const ThreatDetail = ({ threat }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
        <p className="text-gray-500 text-sm">Risk Level</p>
        <span className={`inline-block mt-1 px-3 py-1 rounded text-sm font-bold border ${getRiskBadgeColor(threat.risk)}`}>
          {threat.risk}
        </span>
      </div>
      <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
        <p className="text-gray-500 text-sm">Security Score</p>
        <p className="text-2xl font-bold font-mono" style={{ color: getScoreColor(threat.score) }}>{threat.score}</p>
      </div>
      <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
        <p className="text-gray-500 text-sm">Active Incidents</p>
        <p className="text-2xl font-bold text-white font-mono">{threat.incidents}</p>
      </div>
    </div>
    
    <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
      <p className="text-gray-500 text-sm mb-2">Description</p>
      <p className="text-gray-300">{threat.description}</p>
    </div>
    
    <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
      <p className="text-gray-500 text-sm mb-2">Recommended Mitigations</p>
      <p className="text-gray-300">{threat.mitigation}</p>
    </div>
  </div>
);

// Export Button Component
const ExportButton = ({ onExport }) => (
  <button 
    onClick={onExport}
    className="flex items-center px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
  >
    <Download className="w-4 h-4 mr-2" />
    Export
  </button>
);

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function ARPRIDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedMetrics, setAnimatedMetrics] = useState({
    txnPerSecond: 47892,
    fraudAttempts: 1247,
    aiDecisions: 892456,
    blockedRate: 99.2,
    humanEscalations: 234
  });
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

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

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      resilience: resilienceData,
      threats: threatVectors,
      compliance: complianceFrameworks,
      models: aiModelInventory
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arpri-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'threats', label: 'Threat Intel', icon: AlertTriangle },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'models', label: 'AI Models', icon: Cpu },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'whitepaper', label: 'Whitepaper', icon: BookOpen }
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
      <header className="relative border-b border-gray-800/50 backdrop-blur-xl bg-black/30 sticky top-0 z-40">
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
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAgentOpen(true)}
                className="flex items-center px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/30 transition-all"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Agent
              </button>
              <ExportButton onExport={handleExport} />
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
                value={`${animatedMetrics.blockedRate}%`}
                subtitle={`${formatNumber(animatedMetrics.fraudAttempts)} attempts today`}
                icon={Lock}
                trend="up"
                trendValue="+0.3% accuracy"
                color="purple"
              />
              <MetricCard
                title="AI Decisions"
                value={formatNumber(animatedMetrics.aiDecisions)}
                subtitle={`${animatedMetrics.humanEscalations} escalations`}
                icon={Cpu}
                trend="stable"
                trendValue="0.03% escalation rate"
                color="orange"
              />
            </div>

            {/* Resilience Scores + Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resilience Gauges */}
              <div className="col-span-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={Target} title="Resilience Index" subtitle="Domain Scores" />
                <div className="grid grid-cols-3 gap-4">
                  <ResilienceGauge 
                    score={resilienceData.categories.aiGovernance.score} 
                    label="AI Gov" 
                    previousScore={resilienceData.categories.aiGovernance.score - resilienceData.categories.aiGovernance.change}
                  />
                  <ResilienceGauge 
                    score={resilienceData.categories.fraudDetection.score} 
                    label="Fraud"
                    previousScore={resilienceData.categories.fraudDetection.score - resilienceData.categories.fraudDetection.change}
                  />
                  <ResilienceGauge 
                    score={resilienceData.categories.dataPrivacy.score} 
                    label="Privacy"
                    previousScore={resilienceData.categories.dataPrivacy.score - resilienceData.categories.dataPrivacy.change}
                  />
                  <ResilienceGauge 
                    score={resilienceData.categories.operationalResilience.score} 
                    label="Ops"
                    previousScore={resilienceData.categories.operationalResilience.score - resilienceData.categories.operationalResilience.change}
                  />
                  <ResilienceGauge 
                    score={resilienceData.categories.supplyChainSecurity.score} 
                    label="Supply"
                    previousScore={resilienceData.categories.supplyChainSecurity.score - resilienceData.categories.supplyChainSecurity.change}
                  />
                  <ResilienceGauge 
                    score={resilienceData.categories.compliancePosture.score} 
                    label="Comply"
                    previousScore={resilienceData.categories.compliancePosture.score - resilienceData.categories.compliancePosture.change}
                  />
                </div>
              </div>

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
            <SectionHeader 
              icon={AlertTriangle} 
              title="Threat Intelligence" 
              subtitle="Active threat vectors and risk indicators" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {threatVectors.map((threat, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedThreat(threat)}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all cursor-pointer hover:scale-[1.02]"
                >
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
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">{threat.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
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
                      <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
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
            <SectionHeader 
              icon={ShieldCheck} 
              title="Compliance Posture" 
              subtitle="Regulatory framework alignment and coverage" 
            />
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-black/30">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Framework</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Coverage</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Last Audit</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceFrameworks.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-white font-medium">{item.framework}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'compliant' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${item.coverage}%`, backgroundColor: getScoreColor(item.coverage) }}
                            />
                          </div>
                          <span className="text-gray-400 font-mono text-sm">{item.coverage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">{item.lastAudit}</td>
                      <td className="py-3 px-4">
                        <span className={`font-mono ${item.findings > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {item.findings}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Average Coverage"
                value="94%"
                subtitle="Across all frameworks"
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Next Audit"
                value="Feb 15"
                subtitle="GDPR/CCPA Assessment"
                icon={Clock}
                color="orange"
              />
              <MetricCard
                title="Open Findings"
                value="13"
                subtitle="5 critical, 8 medium"
                icon={AlertCircle}
                color="red"
              />
            </div>
          </div>
        )}

        {/* AI Models Tab */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <SectionHeader 
              icon={Cpu} 
              title="AI Model Inventory" 
              subtitle="Production models and risk classification" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiModelInventory.map((model, index) => {
                const tierColors = {
                  critical: 'border-red-500/50 bg-red-500/10',
                  high: 'border-orange-500/50 bg-orange-500/10',
                  medium: 'border-yellow-500/50 bg-yellow-500/10',
                  low: 'border-green-500/50 bg-green-500/10'
                };

                return (
                  <div 
                    key={index} 
                    onClick={() => setSelectedModel(model)}
                    className={`rounded-lg border ${tierColors[model.riskTier]} p-4 transition-all hover:scale-[1.01] cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Cpu className="w-5 h-5 text-cyan-400 mr-2" />
                        <span className="text-white font-semibold">{model.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        model.status === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
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
                        <span className="text-gray-500">Accuracy:</span>
                        <span className="text-gray-300 ml-2">{model.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Cell key={`cell-${index}`} fill={entry.driftScore > 3 ? '#ffa502' : '#00ffc8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Latency Distribution (ms)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={aiModelInventory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#666" fontSize={10} angle={-20} textAnchor="end" height={60} />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1f2e', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="latency" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <div className="space-y-8">
            <SectionHeader
              icon={Layers}
              title="Security Architecture"
              subtitle="AI-native payments security stack"
            />

            {/* Security Stack */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Server className="w-5 h-5 text-cyan-400 mr-2" />
                AI Security Stack
              </h3>
              <ArchitectureDiagram type="stack" />
            </div>

            {/* Transaction Flow */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Workflow className="w-5 h-5 text-cyan-400 mr-2" />
                Transaction Processing Flow
              </h3>
              <ArchitectureDiagram type="flow" />
            </div>

            {/* Zero Trust + DSPM Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-cyan-400 mr-2" />
                  Zero Trust Principles
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Never Trust, Always Verify', status: 'active', coverage: 98 },
                    { name: 'Least Privilege Access', status: 'active', coverage: 94 },
                    { name: 'Microsegmentation', status: 'active', coverage: 87 },
                    { name: 'Continuous Validation', status: 'active', coverage: 92 },
                    { name: 'Assume Breach', status: 'active', coverage: 89 }
                  ].map((principle, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-gray-300">{principle.name}</span>
                      </div>
                      <span className="text-gray-500 font-mono text-sm">{principle.coverage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Database className="w-5 h-5 text-cyan-400 mr-2" />
                  DSPM Controls
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Data Discovery', status: 'active', coverage: 96 },
                    { name: 'Classification Engine', status: 'active', coverage: 91 },
                    { name: 'Access Monitoring', status: 'active', coverage: 94 },
                    { name: 'Data Lineage', status: 'partial', coverage: 78 },
                    { name: 'Encryption Validation', status: 'active', coverage: 99 }
                  ].map((control, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
                      <div className="flex items-center">
                        {control.status === 'active' ? (
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                        )}
                        <span className="text-gray-300">{control.name}</span>
                      </div>
                      <span className="text-gray-500 font-mono text-sm">{control.coverage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Whitepaper Tab */}
        {activeTab === 'whitepaper' && <WhitepaperTab />}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-800/50 backdrop-blur-xl bg-black/30 mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>ARPRI Dashboard v2.0 • AI Risk & Payments Resilience Index</p>
            <p>Agentic AI Security Blueprint 2025–2030</p>
          </div>
        </div>
      </footer>

      {/* AI Agent Modal */}
      <AIAgentChat isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />

      {/* Threat Detail Modal */}
      <DrillDownModal 
        isOpen={!!selectedThreat} 
        onClose={() => setSelectedThreat(null)}
        title={selectedThreat?.name || 'Threat Details'}
      >
        {selectedThreat && <ThreatDetail threat={selectedThreat} />}
      </DrillDownModal>

      {/* Model Detail Modal */}
      <DrillDownModal
        isOpen={!!selectedModel}
        onClose={() => setSelectedModel(null)}
        title={selectedModel?.name || 'Model Details'}
      >
        {selectedModel && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                <p className="text-gray-500 text-sm">Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded text-sm ${
                  selectedModel.status === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {selectedModel.status}
                </span>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                <p className="text-gray-500 text-sm">Risk Tier</p>
                <p className="text-xl font-bold text-white capitalize mt-1">{selectedModel.riskTier}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                <p className="text-gray-500 text-sm">Accuracy</p>
                <p className="text-xl font-bold font-mono mt-1" style={{ color: getScoreColor(selectedModel.accuracy) }}>
                  {selectedModel.accuracy}%
                </p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                <p className="text-gray-500 text-sm">Latency</p>
                <p className="text-xl font-bold text-white font-mono mt-1">{selectedModel.latency}ms</p>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-500 text-sm mb-2">Model Drift</p>
              <div className="flex items-center">
                <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden mr-4">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${selectedModel.driftScore * 20}%`,
                      backgroundColor: selectedModel.driftScore > 3 ? '#ffa502' : '#00ffc8'
                    }}
                  />
                </div>
                <span className={`font-mono ${selectedModel.driftScore > 3 ? 'text-orange-400' : 'text-green-400'}`}>
                  {selectedModel.driftScore}%
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {selectedModel.driftScore > 3 ? 'Warning: Model drift exceeds threshold. Consider retraining.' : 'Model drift within acceptable range.'}
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-500 text-sm">Last Validation</p>
              <p className="text-gray-300 mt-1">{selectedModel.lastValidation}</p>
            </div>
          </div>
        )}
      </DrillDownModal>
    </div>
  );
}
