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
  Play, Pause, RefreshCw, Filter, Search, Menu, Home, BookOpen, Loader, Rss
} from 'lucide-react';
import WhitepaperTab from './WhitepaperTab';
import InteractiveArchitecture from './InteractiveArchitecture';
import {
  useResilience,
  useThreats,
  useModels,
  useFraud,
  useCompliance,
  useSystemStatus,
  useExternalFeeds,
  useIndustryMetrics
} from './api/useAPI';

// ============================================================================
// DATA MODELS (Now using dynamic API data)
// ============================================================================

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

// Loading Skeleton Component
const LoadingSkeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-800/50 rounded ${className}`} />
);

// Error Display Component
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
    <p className="text-red-400 mb-4">{message || 'Failed to load data'}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);

// Loading Card Component
const LoadingCard = () => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
    <LoadingSkeleton className="h-6 w-32 mb-4" />
    <LoadingSkeleton className="h-10 w-24 mb-2" />
    <LoadingSkeleton className="h-4 w-40" />
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

  const processQueryFallback = (query) => {
    const lowerQuery = query.toLowerCase();

    // Find matching topic
    for (const [key, data] of Object.entries(agentKnowledge)) {
      if (lowerQuery.includes(key) || lowerQuery.includes(key.replace(' ', ''))) {
        return `**${key.charAt(0).toUpperCase() + key.slice(1)}**\n\n${data.definition}\n\n**Payments Context:**\n${data.paymentsContext}\n\n**Key Mitigations:**\n${data.mitigations.map(m => `• ${m}`).join('\n')}\n\n**Relevant Frameworks:** ${data.frameworks.join(', ')}`;
      }
    }

    // Generic response
    return "I can provide detailed information on several AI security topics relevant to payments:\n\n• **Prompt Injection** - LLM manipulation attacks\n• **Model Poisoning** - Training data corruption\n• **Zero Trust** - Identity-first security\n• **Tokenization** - Data protection\n• **Agentic AI** - Autonomous AI risks\n• **DSPM** - Data security posture\n\nWhich topic would you like to explore?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Try to use Claude API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        isDemoMode: data.isDemoMode
      }]);
    } catch (error) {
      console.log('Using fallback response:', error);
      // Fallback to static knowledge base
      const fallbackResponse = processQueryFallback(currentInput);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallbackResponse + '\n\n_Note: Using fallback mode. Configure ANTHROPIC_API_KEY for live responses._',
        isDemoMode: true
      }]);
    } finally {
      setIsTyping(false);
    }
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
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // Fetch data from APIs (polling disabled to prevent lag issues)
  const { data: resilienceData, loading: resilienceLoading, error: resilienceError, refresh: refreshResilience } = useResilience();
  const { data: threatData, loading: threatLoading, error: threatError, refresh: refreshThreats } = useThreats();
  const { data: modelData, loading: modelLoading, error: modelError, refresh: refreshModels } = useModels();
  const { data: fraudData, loading: fraudLoading, error: fraudError } = useFraud(); // No auto-polling
  const { data: complianceData, loading: complianceLoading, error: complianceError, refresh: refreshCompliance } = useCompliance();
  const { data: feedsData, loading: feedsLoading, error: feedsError, refresh: refreshFeeds } = useExternalFeeds();
  const { data: industryData, loading: industryLoading, error: industryError, refresh: refreshIndustry } = useIndustryMetrics();

  // Extract data from API responses with fallbacks
  const resilienceScore = resilienceData?.score || {};
  const timeSeriesData = resilienceData?.timeseries || [];
  const radarData = resilienceData?.radar || [];
  const riskDistribution = resilienceData?.distribution || [];

  const threatVectors = threatData?.threats || [];
  const complianceFrameworks = complianceData?.status || [];
  const aiModelInventory = modelData?.models || [];

  // Real-time fraud metrics
  const fraudMetrics = fraudData?.realtime || {
    transactionsPerSecond: 0,
    fraudAttempts: 0,
    blockedRate: 0,
    totalDecisions: 0,
    humanEscalations: 0
  };

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      resilience: resilienceData,
      threats: threatData,
      compliance: complianceData,
      models: modelData,
      fraud: fraudData
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
    { id: 'feeds', label: 'Intel Feeds', icon: Rss },
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
        
        {/* Overview Tab - Global AI Risk Landscape */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Global AI Risk Landscape</h2>
              <p className="text-gray-400">Industry-wide AI security metrics from authoritative sources (NIST NVD, CISA KEV, GitHub, OWASP)</p>
            </div>

            {/* Top Metrics Row - Real Industry Data */}
            {industryLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </div>
            ) : industryError ? (
              <ErrorDisplay
                message={industryError}
                onRetry={refreshIndustry}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Critical CVEs"
                  value={industryData?.overview?.criticalCVEs || 0}
                  subtitle="Industry-wide (sample)"
                  icon={AlertTriangle}
                  trend={industryData?.overview?.last30Days > 15 ? "up" : "down"}
                  trendValue={`${industryData?.overview?.last30Days || 0} in last 30 days`}
                  color="red"
                />
                <MetricCard
                  title="Actively Exploited"
                  value={industryData?.overview?.activellyExploited || 0}
                  subtitle="CISA KEV Catalog"
                  icon={ShieldCheck}
                  trend="up"
                  trendValue="Real-time from CISA"
                  color="orange"
                />
                <MetricCard
                  title="Avg CVSS Score"
                  value={(industryData?.overview?.avgCVSS || 0).toFixed(1)}
                  subtitle="Industry baseline"
                  icon={BarChart3}
                  trend="stable"
                  trendValue="NVD calculated"
                  color="yellow"
                />
                <MetricCard
                  title="AI-Specific CVEs"
                  value={industryData?.aiSpecificRisks?.totalAICVEs || 0}
                  subtitle="AI/ML vulnerabilities"
                  icon={Cpu}
                  trend="up"
                  trendValue={`${industryData?.aiSpecificRisks?.aiDependencies || 0} dependencies`}
                  color="purple"
                />
              </div>
            )}

            {/* Resilience Scores + Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resilience Gauges */}
              <div className="col-span-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={Target} title="Resilience Index" subtitle="Domain Scores" />
                {resilienceLoading ? (
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <LoadingSkeleton className="w-28 h-28 rounded-full mb-2" />
                        <LoadingSkeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <ResilienceGauge
                      score={resilienceScore.categories?.aiGovernance?.score || 0}
                      label="AI Gov"
                      previousScore={(resilienceScore.categories?.aiGovernance?.score || 0) - (resilienceScore.categories?.aiGovernance?.change || 0)}
                    />
                    <ResilienceGauge
                      score={resilienceScore.categories?.fraudDetection?.score || 0}
                      label="Fraud"
                      previousScore={(resilienceScore.categories?.fraudDetection?.score || 0) - (resilienceScore.categories?.fraudDetection?.change || 0)}
                    />
                    <ResilienceGauge
                      score={resilienceScore.categories?.dataPrivacy?.score || 0}
                      label="Privacy"
                      previousScore={(resilienceScore.categories?.dataPrivacy?.score || 0) - (resilienceScore.categories?.dataPrivacy?.change || 0)}
                    />
                    <ResilienceGauge
                      score={resilienceScore.categories?.operationalResilience?.score || 0}
                      label="Ops"
                      previousScore={(resilienceScore.categories?.operationalResilience?.score || 0) - (resilienceScore.categories?.operationalResilience?.change || 0)}
                    />
                    <ResilienceGauge
                      score={resilienceScore.categories?.supplyChainSecurity?.score || 0}
                      label="Supply"
                      previousScore={(resilienceScore.categories?.supplyChainSecurity?.score || 0) - (resilienceScore.categories?.supplyChainSecurity?.change || 0)}
                    />
                    <ResilienceGauge
                      score={resilienceScore.categories?.compliancePosture?.score || 0}
                      label="Comply"
                      previousScore={(resilienceScore.categories?.compliancePosture?.score || 0) - (resilienceScore.categories?.compliancePosture?.change || 0)}
                    />
                  </div>
                )}
              </div>

              {/* Trend Chart */}
              <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={Activity} title="12-Month Trend" subtitle="Risk Score & Incident Correlation" />
                {resilienceLoading ? (
                  <LoadingSkeleton className="h-[280px] w-full" />
                ) : (
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
                )}
              </div>
            </div>

            {/* Radar + Risk Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={Layers} title="Domain Analysis" subtitle="Capability Radar" />
                {resilienceLoading ? (
                  <LoadingSkeleton className="h-[300px] w-full" />
                ) : (
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
                )}
              </div>

              {/* Risk Distribution */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <SectionHeader icon={PieIcon} title="Risk Distribution" subtitle="By Severity Level" />
                {resilienceLoading ? (
                  <LoadingSkeleton className="h-[300px] w-full" />
                ) : (
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* Threats Tab - Real Threat Intelligence */}
        {activeTab === 'threats' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">AI/ML Threat Intelligence</h2>
              <p className="text-gray-400">Real threat landscape based on OWASP Top 10 for LLMs and live CVE data from NIST NVD</p>
            </div>

            {/* OWASP Top 10 for LLMs - Primary Threat Framework */}
            {feedsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : feedsError ? (
              <ErrorDisplay message={feedsError} onRetry={refreshFeeds} />
            ) : feedsData?.owasp?.data ? (
              <>
                {/* OWASP Top 10 Cards */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">OWASP Top 10 for LLMs (2023)</h3>
                    <a
                      href="https://owasp.org/www-project-top-10-for-large-language-model-applications/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Official Framework
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedsData.owasp.data.map((threat, index) => {
                      const severityColors = {
                        'CRITICAL': 'border-red-500/50 bg-red-500/10',
                        'HIGH': 'border-orange-500/50 bg-orange-500/10',
                        'MEDIUM': 'border-yellow-500/50 bg-yellow-500/10',
                        'LOW': 'border-green-500/50 bg-green-500/10'
                      };

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedThreat(threat)}
                          className={`rounded-lg border ${severityColors[threat.severity]} p-4 hover:scale-[1.02] transition-all cursor-pointer`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-cyan-400 mr-2">#{threat.rank}</span>
                              <span className={`px-2 py-1 rounded text-xs font-bold border ${getRiskBadgeColor(threat.severity)}`}>
                                {threat.severity}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-gray-500">{threat.id}</span>
                          </div>
                          <h4 className="text-white font-semibold mb-2">{threat.name}</h4>
                          <p className="text-gray-400 text-sm line-clamp-3 mb-3">{threat.description}</p>
                          <div className="flex items-center text-xs text-gray-600">
                            <Shield className="w-3 h-3 mr-1" />
                            <span>{threat.cweId}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Industry Threat Statistics */}
                {industryData && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 mr-3">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Critical Severity</h3>
                          <p className="text-sm text-gray-500">OWASP + NVD Combined</p>
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-red-400 font-mono mb-2">
                        {(feedsData.owasp.data.filter(t => t.severity === 'CRITICAL').length || 0) + (industryData.overview?.criticalCVEs || 0)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {feedsData.owasp.data.filter(t => t.severity === 'CRITICAL').length} OWASP + {industryData.overview?.criticalCVEs || 0} CVEs
                      </p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30 mr-3">
                          <ShieldCheck className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Active Exploits</h3>
                          <p className="text-sm text-gray-500">CISA KEV Catalog</p>
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-orange-400 font-mono mb-2">
                        {industryData.overview?.activellyExploited || 0}
                      </p>
                      <p className="text-sm text-gray-500">Known exploited vulnerabilities</p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 mr-3">
                          <Target className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">AI-Specific Risks</h3>
                          <p className="text-sm text-gray-500">LLM Vulnerabilities</p>
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-cyan-400 font-mono mb-2">10</p>
                      <p className="text-sm text-gray-500">OWASP Top 10 for LLMs</p>
                    </div>
                  </div>
                )}

                {/* Threat Severity Distribution Chart */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">OWASP Threat Severity Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={feedsData.owasp.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="rank"
                        stroke="#666"
                        fontSize={11}
                        label={{ value: 'OWASP Rank', position: 'insideBottom', offset: -5, fill: '#666' }}
                      />
                      <YAxis stroke="#666" fontSize={12} hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1f2e',
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                                <p className="text-white font-semibold mb-1">{data.name}</p>
                                <p className="text-sm text-gray-400 mb-1">{data.id}</p>
                                <p className={`text-sm font-bold ${
                                  data.severity === 'CRITICAL' ? 'text-red-400' :
                                  data.severity === 'HIGH' ? 'text-orange-400' :
                                  data.severity === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                                }`}>{data.severity}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="rank" radius={[4, 4, 0, 0]}>
                        {feedsData.owasp.data.map((entry, index) => {
                          const color = entry.severity === 'CRITICAL' ? '#ff4757' :
                                       entry.severity === 'HIGH' ? '#ffa502' :
                                       entry.severity === 'MEDIUM' ? '#ffd93d' : '#6bcf7f';
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No threat intelligence data available</p>
              </div>
            )}
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

            {complianceLoading ? (
              <LoadingSkeleton className="h-96 w-full" />
            ) : complianceError ? (
              <ErrorDisplay message={complianceError} onRetry={refreshCompliance} />
            ) : (
              <>
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
              </>
            )}
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

            {modelLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : modelError ? (
              <ErrorDisplay message={modelError} onRetry={refreshModels} />
            ) : (
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
            )}

            {!modelLoading && !modelError && (
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
            )}
          </div>
        )}

        {/* Intelligence Feeds Tab */}
        {activeTab === 'feeds' && (
          <div className="space-y-6">
            <SectionHeader
              icon={Rss}
              title="External Intelligence Feeds"
              subtitle="Real-time threat intelligence from NIST NVD, CISA KEV, GitHub, and OWASP"
              action={
                <button
                  onClick={refreshFeeds}
                  disabled={feedsLoading}
                  className="flex items-center px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${feedsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              }
            />

            {feedsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LoadingSkeleton className="h-96 w-full rounded-2xl" />
                <LoadingSkeleton className="h-96 w-full rounded-2xl" />
              </div>
            ) : feedsError ? (
              <ErrorDisplay message={feedsError} onRetry={refreshFeeds} />
            ) : (
              <>
                {/* Data Source Indicator */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Info className="w-5 h-5 text-cyan-400 mr-2" />
                      <span className="text-gray-400 text-sm">Data Source:</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          feedsData?.source === 'external' ? 'bg-green-500' :
                          feedsData?.source === 'cache' ? 'bg-yellow-500' : 'bg-orange-500'
                        }`} />
                        <span className="text-sm font-mono text-gray-300">
                          {feedsData?.source === 'external' ? 'Live External APIs' :
                           feedsData?.source === 'cache' ? 'Cached (30min)' : 'Synthetic Fallback'}
                        </span>
                      </div>
                      {feedsData?.timestamp && (
                        <span className="text-xs text-gray-600">
                          Updated: {new Date(feedsData.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* NIST NVD CVE Feed */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-800 bg-black/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 mr-3">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">NIST NVD Vulnerabilities</h3>
                          <p className="text-sm text-gray-500">Latest AI-related CVEs from National Vulnerability Database</p>
                        </div>
                      </div>
                      <a
                        href="https://nvd.nist.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        nvd.nist.gov
                      </a>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {feedsData?.nvd?.length > 0 ? (
                      <div className="divide-y divide-gray-800">
                        {feedsData.nvd.map((cve, index) => {
                          const severityColors = {
                            'CRITICAL': 'bg-red-500/20 text-red-400 border-red-500/50',
                            'HIGH': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
                            'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
                            'LOW': 'bg-green-500/20 text-green-400 border-green-500/50'
                          };

                          return (
                            <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                  <a
                                    href={`https://nvd.nist.gov/vuln/detail/${cve.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                                  >
                                    {cve.id}
                                  </a>
                                  {cve.source && (
                                    <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-500">
                                      {cve.source}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[cve.severity] || severityColors['MEDIUM']}`}>
                                    {cve.severity}
                                  </span>
                                  <span className="font-mono text-sm text-white font-bold">
                                    {cve.score?.toFixed(1) || 'N/A'}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{cve.description}</p>
                              <div className="flex items-center text-xs text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                Published: {new Date(cve.published).toLocaleDateString()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No CVE data available
                      </div>
                    )}
                  </div>
                </div>

                {/* CISA KEV Catalog */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-800 bg-black/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30 mr-3">
                          <ShieldCheck className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">CISA Known Exploited Vulnerabilities</h3>
                          <p className="text-sm text-gray-500">Actively exploited vulnerabilities from CISA KEV Catalog</p>
                        </div>
                      </div>
                      <a
                        href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        cisa.gov/kev
                      </a>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {feedsData?.cisa?.length > 0 ? (
                      <div className="divide-y divide-gray-800">
                        {feedsData.cisa.map((vuln, index) => (
                          <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <a
                                    href={`https://nvd.nist.gov/vuln/detail/${vuln.cveID}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                                  >
                                    {vuln.cveID}
                                  </a>
                                  {vuln.source && (
                                    <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-500">
                                      {vuln.source}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-white mb-1">{vuln.vulnerabilityName}</p>
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                  <span>{vuln.vendorProject}</span>
                                  <span className="mx-2">•</span>
                                  <span>{vuln.product}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{vuln.shortDescription}</p>
                            <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2 mb-2">
                              <p className="text-xs text-orange-400">
                                <span className="font-semibold">Required Action:</span> {vuln.requiredAction}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="w-3 h-3 mr-1" />
                              Added to KEV: {new Date(vuln.dateAdded).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No CISA KEV data available
                      </div>
                    )}
                  </div>
                </div>

                {/* GitHub Security Advisories */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-800 bg-black/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 mr-3">
                          <GitBranch className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">GitHub Security Advisories</h3>
                          <p className="text-sm text-gray-500">High/Critical severity advisories from repository dependencies</p>
                        </div>
                      </div>
                      <a
                        href="https://github.com/advisories"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        github.com/advisories
                      </a>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {feedsData?.github?.data?.length > 0 ? (
                      <div className="divide-y divide-gray-800">
                        {feedsData.github.data.map((advisory, index) => {
                          const severityColors = {
                            'CRITICAL': 'bg-red-500/20 text-red-400 border-red-500/50',
                            'HIGH': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
                            'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
                            'LOW': 'bg-green-500/20 text-green-400 border-green-500/50'
                          };

                          return (
                            <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                  <a
                                    href={`https://github.com/advisories/${advisory.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                                  >
                                    {advisory.id}
                                  </a>
                                  {advisory.cveId && (
                                    <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-500">
                                      {advisory.cveId}
                                    </span>
                                  )}
                                  {advisory.source && (
                                    <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-500">
                                      {advisory.source}
                                    </span>
                                  )}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[advisory.severity] || severityColors['MEDIUM']}`}>
                                  {advisory.severity}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-white mb-1">{advisory.summary}</p>
                              <p className="text-sm text-gray-400 mb-2">{advisory.description}</p>
                              <div className="flex items-center text-xs text-gray-600 space-x-4">
                                <div className="flex items-center">
                                  <Box className="w-3 h-3 mr-1" />
                                  {advisory.ecosystem} / {advisory.package}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(advisory.published).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No GitHub advisories available
                      </div>
                    )}
                  </div>
                </div>

                {/* OWASP Top 10 for LLMs */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-800 bg-black/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 mr-3">
                          <ShieldCheck className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">OWASP Top 10 for LLMs</h3>
                          <p className="text-sm text-gray-500">Critical AI/ML security risks from OWASP Foundation</p>
                        </div>
                      </div>
                      <a
                        href="https://owasp.org/www-project-top-10-for-large-language-model-applications/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        owasp.org/llm-top-10
                      </a>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {feedsData?.owasp?.data?.length > 0 ? (
                      <div className="divide-y divide-gray-800">
                        {feedsData.owasp.data.map((risk, index) => {
                          const severityColors = {
                            'CRITICAL': 'bg-red-500/20 text-red-400 border-red-500/50',
                            'HIGH': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
                            'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
                            'LOW': 'bg-green-500/20 text-green-400 border-green-500/50'
                          };

                          return (
                            <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                  <span className="text-2xl font-bold text-cyan-400 mr-3">#{risk.rank}</span>
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <span className="font-mono text-sm text-cyan-400 mr-2">{risk.id}</span>
                                      <span className="font-semibold text-white">{risk.name}</span>
                                    </div>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[risk.severity]}`}>
                                  {risk.severity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{risk.description}</p>
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 mb-2">
                                <p className="text-xs text-blue-400">
                                  <span className="font-semibold">Impact:</span> {risk.impact}
                                </p>
                              </div>
                              <div className="bg-green-500/10 border border-green-500/30 rounded p-2 mb-2">
                                <p className="text-xs text-green-400">
                                  <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                                </p>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <span className="mr-2">CWE:</span>
                                <span className="font-mono">{risk.cweId}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No OWASP data available
                      </div>
                    )}
                  </div>
                </div>

                {/* CVE Statistics Dashboard */}
                {feedsData?.statistics?.data && (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center mb-6">
                      <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 mr-3">
                        <BarChart3 className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">CVE Industry Statistics</h3>
                        <p className="text-sm text-gray-500">Real-time vulnerability trends from NVD</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                        <p className="text-gray-500 text-sm">Total CVEs (Sample)</p>
                        <p className="text-2xl font-bold text-white font-mono">{feedsData.statistics.data.statistics?.total || 0}</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                        <p className="text-gray-500 text-sm">Last 30 Days</p>
                        <p className="text-2xl font-bold text-orange-400 font-mono">{feedsData.statistics.data.statistics?.recent30Days || 0}</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                        <p className="text-gray-500 text-sm">Avg CVSS Score</p>
                        <p className="text-2xl font-bold text-yellow-400 font-mono">{feedsData.statistics.data.statistics?.avgCVSS || '0.0'}</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                        <p className="text-gray-500 text-sm">Critical</p>
                        <p className="text-2xl font-bold text-red-400 font-mono">{feedsData.statistics.data.statistics?.bySeverity?.CRITICAL || 0}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {Object.entries(feedsData.statistics.data.statistics?.bySeverity || {}).map(([severity, count]) => {
                        const colors = {
                          'CRITICAL': 'bg-red-500',
                          'HIGH': 'bg-orange-500',
                          'MEDIUM': 'bg-yellow-500',
                          'LOW': 'bg-green-500',
                          'UNKNOWN': 'bg-gray-500'
                        };
                        return (
                          <div key={severity} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${colors[severity]} mr-2`} />
                            <span className="text-xs text-gray-400">{severity}: {count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MetricCard
                    title="NVD Vulnerabilities"
                    value={feedsData?.nvd?.data?.length || 0}
                    subtitle="AI-related CVEs"
                    icon={AlertTriangle}
                    color="red"
                  />
                  <MetricCard
                    title="CISA KEV Catalog"
                    value={feedsData?.cisa?.data?.length || 0}
                    subtitle="Actively exploited"
                    icon={ShieldCheck}
                    color="orange"
                  />
                  <MetricCard
                    title="GitHub Advisories"
                    value={feedsData?.github?.data?.length || 0}
                    subtitle="Repository vulnerabilities"
                    icon={GitBranch}
                    color="purple"
                  />
                  <MetricCard
                    title="Feed Status"
                    value={feedsData?.metadata ? 'LIVE' : 'LOADING'}
                    subtitle={feedsData?.metadata?.cacheDuration || 'Fetching data...'}
                    icon={Rss}
                    color="green"
                  />
                </div>
              </>
            )}
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

            {/* Interactive Security Stack */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Server className="w-5 h-5 text-cyan-400 mr-2" />
                Interactive AI Security Stack
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Click and drag to explore • Zoom with scroll • Pan with mouse
              </p>
              <InteractiveArchitecture type="security-stack" />
            </div>

            {/* Interactive Transaction Flow */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Workflow className="w-5 h-5 text-cyan-400 mr-2" />
                Interactive Transaction Processing Flow
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Animated data flows showing real-time transaction processing
              </p>
              <InteractiveArchitecture type="transaction-flow" />
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
