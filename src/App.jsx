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

const frameworkResources = {
  'NIST AI RMF': {
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    summary: 'Govern, Map, Measure, and Manage the lifecycle of AI risk with concrete controls for explainability, robustness, and accountability.'
  },
  'MITRE ATLAS': {
    url: 'https://atlas.mitre.org/',
    summary: 'Adversary tactics and techniques for machine learning systems mapped to concrete detections and mitigations.'
  },
  'OWASP Top 10 for LLM': {
    url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
    summary: 'Community curated list of the most common LLM application weaknesses with recommended remediations.'
  },
  'NIST SP 800-207': {
    url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final',
    summary: 'Zero Trust Architecture principles for identity-first security and continuous verification.'
  }
};

const architectureInsights = {
  presentation: {
    title: 'Presentation Layer',
    details: 'Edge hardening for APIs, TLS termination, bot defense, and session security. Ideal for WAF policy tuning and anomaly detection.',
    bestPractices: ['mTLS between gateway and services', 'Runtime API threat detection', 'Rate limiting per tenant', 'Security headers and CSP']
  },
  orchestration: {
    title: 'AI Orchestration',
    details: 'Model routing, registry governance, and guardrails that enforce safety policies before and after inference.',
    bestPractices: ['Model version pinning', 'Guardrail policies per use-case', 'Isolation for tool execution', 'Strong audit logging']
  },
  inference: {
    title: 'Inference Layer',
    details: 'LLM and ML serving surfaces that need isolation, GPU access control, and content moderation.',
    bestPractices: ['Dedicated service accounts per model', 'Prompt and output filtering', 'Runtime jailbreak detection', 'GPU telemetry baselines']
  },
  data: {
    title: 'Data Layer',
    details: 'Token vaults, vector stores, and DSPM controls to keep sensitive training and inference data locked down.',
    bestPractices: ['Attribute-based access control', 'Field-level encryption', 'Secrets rotation and vaulting', 'Data lineage and retention policies']
  },
  security: {
    title: 'Security Fabric',
    details: 'Zero Trust controls, SIEM/SOAR automation, and policy enforcement that stitches the stack together.',
    bestPractices: ['Continuous verification', 'Playbooks for AI-specific alerts', 'Centralized detections mapped to MITRE ATLAS', 'Least privilege service meshes']
  }
};

const securityNews = [
  {
    title: 'MITRE updates ATLAS with new prompt-injection mitigations',
    source: 'MITRE',
    link: 'https://atlas.mitre.org/news',
    summary: 'Latest Atlas techniques now include jailbreak protections and sandboxing detections for LLM-enabled apps.',
    time: '2h ago'
  },
  {
    title: 'NIST AI RMF adds sector-specific guidance for payments',
    source: 'NIST',
    link: 'https://www.nist.gov/itl/ai-risk-management-framework',
    summary: 'New implementation profiles outline data minimization and tokenization best practices for regulated workloads.',
    time: '6h ago'
  },
  {
    title: 'CISA publishes alert on adversarial ML against fraud models',
    source: 'CISA',
    link: 'https://www.cisa.gov/news-events/alerts',
    summary: 'Guidance highlights monitoring for drift, shadow models, and rapid rollback when adversarial inputs are detected.',
    time: 'Today'
  }
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

const getAtlasMapping = (item) => {
  const title = item?.title?.toLowerCase() || item?.id?.toLowerCase() || '';
  if (title.includes('prompt')) return 'MITRE ATLAS: AML.T0027 (Prompt Injection)';
  if (title.includes('data poisoning') || title.includes('poison')) return 'MITRE ATLAS: AML.T0011 (Data Poisoning)';
  if (title.includes('model theft') || title.includes('exfiltration')) return 'MITRE ATLAS: AML.T0004 (Model Exfiltration)';
  return 'Mapped to MITRE ATLAS library of adversarial ML techniques';
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
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(architectureInsights.presentation);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Filter states for AI Vulnerabilities
  const [vulnSearchTerm, setVulnSearchTerm] = useState('');
  const [vulnSeverityFilter, setVulnSeverityFilter] = useState('all');
  const [vulnCategoryFilter, setVulnCategoryFilter] = useState('all');
  const [vulnExploitFilter, setVulnExploitFilter] = useState('all');

  // Filter states for Compliance Frameworks
  const [frameworkSearchTerm, setFrameworkSearchTerm] = useState('');
  const [frameworkPriorityFilter, setFrameworkPriorityFilter] = useState('all');
  const [frameworkCategoryFilter, setFrameworkCategoryFilter] = useState('all');
  const [frameworkStatusFilter, setFrameworkStatusFilter] = useState('all');

  // Filter states for Threat Intel
  const [threatSearchTerm, setThreatSearchTerm] = useState('');
  const [threatSeverityFilter, setThreatSeverityFilter] = useState('all');
  const [threatCategoryFilter, setThreatCategoryFilter] = useState('all');

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
  const complianceFrameworks = complianceData?.frameworks || [];
  const complianceSummary = complianceData?.summary || {};
  const complianceCategories = complianceData?.categories || [];
  const aiVulnerabilities = modelData?.vulnerabilities || [];
  const vulnerabilityCategories = modelData?.categories || [];
  const vulnerabilitySummary = modelData?.summary || {};

  const overviewMetricDetails = {
    'Critical CVEs': {
      description: 'Snapshot of severe vulnerabilities impacting AI supply chain components. Drill down to align patching to NIST AI RMF Manage (3.2).',
      mapping: 'MITRE ATLAS coverage for dependency exploits.',
      link: 'https://nvd.nist.gov/vuln'
    },
    'Actively Exploited': {
      description: 'Signals from CISA KEV to prioritize hotfixes and compensating controls.',
      mapping: 'Map detections to MITRE ATT&CK / ATLAS for incident response playbooks.',
      link: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'
    },
    'Avg CVSS Score': {
      description: 'Baseline severity across observed vulnerabilities. Use to benchmark risk appetite and SLAs.',
      mapping: 'Supports NIST AI RMF Measure (2.6) risk quantification.',
      link: 'https://www.first.org/cvss/'
    },
    'AI-Specific CVEs': {
      description: 'Issues affecting models, vector stores, and AI dependencies.',
      mapping: 'MITRE ATLAS emerging techniques for LLM and ML systems.',
      link: 'https://atlas.mitre.org'
    }
  };

  // Real-time fraud metrics
  const fraudMetrics = fraudData?.realtime || {
    transactionsPerSecond: 0,
    fraudAttempts: 0,
    blockedRate: 0,
    totalDecisions: 0,
    humanEscalations: 0
  };

  // Filtered data for AI Vulnerabilities
  const filteredVulnerabilities = aiVulnerabilities.filter(vuln => {
    const matchesSearch = vulnSearchTerm === '' ||
      vuln.title.toLowerCase().includes(vulnSearchTerm.toLowerCase()) ||
      vuln.description.toLowerCase().includes(vulnSearchTerm.toLowerCase()) ||
      vuln.id.toLowerCase().includes(vulnSearchTerm.toLowerCase());

    const matchesSeverity = vulnSeverityFilter === 'all' || vuln.severity === vulnSeverityFilter;
    const matchesCategory = vulnCategoryFilter === 'all' || vuln.category === vulnCategoryFilter;
    const matchesExploit = vulnExploitFilter === 'all' ||
      (vulnExploitFilter === 'yes' && vuln.exploitAvailable) ||
      (vulnExploitFilter === 'no' && !vuln.exploitAvailable);

    return matchesSearch && matchesSeverity && matchesCategory && matchesExploit;
  });

  // Filtered data for Compliance Frameworks
  const filteredFrameworks = complianceFrameworks.filter(framework => {
    const matchesSearch = frameworkSearchTerm === '' ||
      framework.framework.toLowerCase().includes(frameworkSearchTerm.toLowerCase()) ||
      framework.description.toLowerCase().includes(frameworkSearchTerm.toLowerCase()) ||
      framework.owner.toLowerCase().includes(frameworkSearchTerm.toLowerCase());

    const matchesPriority = frameworkPriorityFilter === 'all' || framework.priority === frameworkPriorityFilter;
    const matchesCategory = frameworkCategoryFilter === 'all' || framework.category === frameworkCategoryFilter;
    const matchesStatus = frameworkStatusFilter === 'all' || framework.status === frameworkStatusFilter;

    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  // Filtered data for Threats (OWASP)
  const owaspThreats = feedsData?.owasp?.data || [];
  const filteredThreats = owaspThreats.filter(threat => {
    const matchesSearch = threatSearchTerm === '' ||
      threat.name.toLowerCase().includes(threatSearchTerm.toLowerCase()) ||
      threat.description.toLowerCase().includes(threatSearchTerm.toLowerCase()) ||
      (threat.mitigation && threat.mitigation.toLowerCase().includes(threatSearchTerm.toLowerCase()));

    const matchesSeverity = threatSeverityFilter === 'all' || threat.severity === threatSeverityFilter;
    const matchesCategory = threatCategoryFilter === 'all' ||
      (threat.category && threat.category === threatCategoryFilter);

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const handleExport = () => {
    const exportData = {
      // Export Metadata
      metadata: {
        exportDate: new Date().toISOString(),
        exportVersion: '3.0',
        dashboardName: 'ARPRI AI Risk & Payment Risk Intelligence Dashboard',
        generatedBy: 'ARPRI Dashboard v3.0',
        dataTimestamp: new Date().toISOString()
      },

      // Executive Summary
      executiveSummary: {
        totalVulnerabilities: vulnerabilitySummary.total || 0,
        criticalVulnerabilities: vulnerabilitySummary.critical || 0,
        exploitableVulnerabilities: vulnerabilitySummary.exploitable || 0,
        totalFrameworks: complianceSummary.totalFrameworks || 0,
        activeFrameworks: complianceSummary.activeFrameworks || 0,
        averageCompliance: complianceSummary.averageCoverage || 0,
        totalControls: complianceSummary.totalControls || 0,
        implementedControls: complianceSummary.implementedControls || 0,
        totalFindings: complianceSummary.totalFindings || 0,
        resilienceScore: resilienceScore.overall || 0,
        fraudMetrics: {
          transactionsPerSecond: fraudMetrics.transactionsPerSecond,
          fraudAttempts: fraudMetrics.fraudAttempts,
          blockedRate: fraudMetrics.blockedRate
        }
      },

      // Filtered Data (if filters are active)
      filters: {
        vulnerabilities: {
          applied: vulnSearchTerm || vulnSeverityFilter !== 'all' || vulnCategoryFilter !== 'all' || vulnExploitFilter !== 'all',
          searchTerm: vulnSearchTerm,
          severity: vulnSeverityFilter,
          category: vulnCategoryFilter,
          exploit: vulnExploitFilter,
          resultsCount: filteredVulnerabilities.length,
          totalCount: aiVulnerabilities.length
        },
        frameworks: {
          applied: frameworkSearchTerm || frameworkPriorityFilter !== 'all' || frameworkCategoryFilter !== 'all' || frameworkStatusFilter !== 'all',
          searchTerm: frameworkSearchTerm,
          priority: frameworkPriorityFilter,
          category: frameworkCategoryFilter,
          status: frameworkStatusFilter,
          resultsCount: filteredFrameworks.length,
          totalCount: complianceFrameworks.length
        },
        threats: {
          applied: threatSearchTerm || threatSeverityFilter !== 'all',
          searchTerm: threatSearchTerm,
          severity: threatSeverityFilter,
          resultsCount: filteredThreats.length,
          totalCount: owaspThreats.length
        }
      },

      // Detailed Data
      aiVulnerabilities: {
        summary: vulnerabilitySummary,
        categories: vulnerabilityCategories,
        vulnerabilities: filteredVulnerabilities.length > 0 ? filteredVulnerabilities : aiVulnerabilities,
        filterApplied: filteredVulnerabilities.length !== aiVulnerabilities.length
      },

      complianceFrameworks: {
        summary: complianceSummary,
        categories: complianceCategories,
        frameworks: filteredFrameworks.length > 0 ? filteredFrameworks : complianceFrameworks,
        filterApplied: filteredFrameworks.length !== complianceFrameworks.length
      },

      threatIntelligence: {
        source: 'OWASP Top 10 for LLM + NIST NVD',
        threats: filteredThreats.length > 0 ? filteredThreats : owaspThreats,
        filterApplied: filteredThreats.length !== owaspThreats.length,
        industryMetrics: industryData?.overview || {}
      },

      resilienceMetrics: {
        score: resilienceScore,
        timeseries: timeSeriesData,
        radar: radarData,
        distribution: riskDistribution
      },

      fraudDetection: fraudData,

      externalFeeds: {
        nvd: feedsData?.nvd || [],
        cisa: feedsData?.cisa || [],
        mitre: feedsData?.mitre || [],
        github: feedsData?.github || []
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    const filterSuffix = (filteredVulnerabilities.length !== aiVulnerabilities.length ||
                         filteredFrameworks.length !== complianceFrameworks.length ||
                         filteredThreats.length !== owaspThreats.length) ? '-filtered' : '';
    a.download = `arpri-dashboard-export-${timestamp}${filterSuffix}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'threats', label: 'Threat Intel', icon: AlertTriangle },
    { id: 'compliance', label: 'Frameworks', icon: ShieldCheck },
    { id: 'models', label: 'AI Vulnerabilities', icon: AlertTriangle },
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
                  onClick={() => setSelectedMetric('Critical CVEs')}
                />
                <MetricCard
                  title="Actively Exploited"
                  value={industryData?.overview?.activellyExploited || 0}
                  subtitle="CISA KEV Catalog"
                  icon={ShieldCheck}
                  trend="up"
                  trendValue="Real-time from CISA"
                  color="orange"
                  onClick={() => setSelectedMetric('Actively Exploited')}
                />
                <MetricCard
                  title="Avg CVSS Score"
                  value={(industryData?.overview?.avgCVSS || 0).toFixed(1)}
                  subtitle="Industry baseline"
                  icon={BarChart3}
                  trend="stable"
                  trendValue="NVD calculated"
                  color="yellow"
                  onClick={() => setSelectedMetric('Avg CVSS Score')}
                />
                <MetricCard
                  title="AI-Specific CVEs"
                  value={industryData?.aiSpecificRisks?.totalAICVEs || 0}
                  subtitle="AI/ML vulnerabilities"
                  icon={Cpu}
                  trend="up"
                  trendValue={`${industryData?.aiSpecificRisks?.aiDependencies || 0} dependencies`}
                  color="purple"
                  onClick={() => setSelectedMetric('AI-Specific CVEs')}
                />
              </div>
            )}

            {selectedMetric && (
              <Modal title={selectedMetric} onClose={() => setSelectedMetric(null)}>
                <div className="space-y-3">
                  <p className="text-sm text-gray-300">{overviewMetricDetails[selectedMetric]?.description}</p>
                  <div className="bg-black/30 border border-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Framework Mapping</p>
                    <p className="text-sm text-cyan-300">{overviewMetricDetails[selectedMetric]?.mapping}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <a
                      href={overviewMetricDetails[selectedMetric]?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open source link
                    </a>
                    <span className="text-[11px] text-gray-500">Dive deeper into this metric</span>
                  </div>
                </div>
              </Modal>
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

                  {/* Filter Controls */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Search */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Search</label>
                        <input
                          type="text"
                          value={threatSearchTerm}
                          onChange={(e) => setThreatSearchTerm(e.target.value)}
                          placeholder="Search threats..."
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {/* Severity Filter */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Severity</label>
                        <select
                          value={threatSeverityFilter}
                          onChange={(e) => setThreatSeverityFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="all">All Severities</option>
                          <option value="CRITICAL">Critical</option>
                          <option value="HIGH">High</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="LOW">Low</option>
                        </select>
                      </div>

                      {/* Category Filter - Placeholder for future use */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Results</label>
                        <div className="flex items-center h-10 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                          <span className="text-sm text-gray-400">
                            Showing {filteredThreats.length} of {owaspThreats.length}
                          </span>
                          {(threatSearchTerm || threatSeverityFilter !== 'all') && (
                            <button
                              onClick={() => {
                                setThreatSearchTerm('');
                                setThreatSeverityFilter('all');
                              }}
                              className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredThreats.length === 0 ? (
                      <div className="col-span-full bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                        <p className="text-gray-400">No threats match your filters</p>
                      </div>
                    ) : (
                      filteredThreats.map((threat, index) => {
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
                    })
                    )}
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
              title="Compliance Framework Tracker"
              subtitle="AI governance, regulatory compliance, and security standards monitoring"
              action={
                <button
                  onClick={refreshCompliance}
                  disabled={complianceLoading}
                  className="flex items-center px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${complianceLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              }
            />

            {/* Summary Stats */}
            {!complianceLoading && !complianceError && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Total Frameworks</span>
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{complianceSummary.totalFrameworks || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {complianceSummary.activeFrameworks || 0} active, {complianceSummary.inProgressFrameworks || 0} in progress
                  </div>
                </div>
                <div className="bg-gray-900/50 border border-green-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Controls Implemented</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-400">{complianceSummary.implementedControls || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    of {complianceSummary.totalControls || 0} total ({complianceSummary.controlsPercentage || 0}%)
                  </div>
                </div>
                <div className="bg-gray-900/50 border border-cyan-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Average Coverage</span>
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">{complianceSummary.averageCoverage || 0}%</div>
                  <div className="text-xs text-gray-500 mt-1">Across all frameworks</div>
                </div>
                <div className="bg-gray-900/50 border border-orange-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Total Findings</span>
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-orange-400">{complianceSummary.totalFindings || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {complianceSummary.criticalFrameworks || 0} critical frameworks
                  </div>
                </div>
              </div>
            )}

            {complianceLoading ? (
              <LoadingSkeleton className="h-96 w-full" />
            ) : complianceError ? (
              <ErrorDisplay message={complianceError} onRetry={refreshCompliance} />
            ) : (
              <>
                {/* Filter Controls */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Search</label>
                      <input
                        type="text"
                        value={frameworkSearchTerm}
                        onChange={(e) => setFrameworkSearchTerm(e.target.value)}
                        placeholder="Search frameworks..."
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Priority Filter */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Priority</label>
                      <select
                        value={frameworkPriorityFilter}
                        onChange={(e) => setFrameworkPriorityFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Category</label>
                      <select
                        value={frameworkCategoryFilter}
                        onChange={(e) => setFrameworkCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="AI Governance">AI Governance</option>
                        <option value="AI Regulation">AI Regulation</option>
                        <option value="AI Security">AI Security</option>
                        <option value="Payment Security">Payment Security</option>
                        <option value="Data Privacy">Data Privacy</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Financial Compliance">Financial Compliance</option>
                        <option value="Information Security">Information Security</option>
                        <option value="Service Organization">Service Organization</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Status</label>
                      <select
                        value={frameworkStatusFilter}
                        onChange={(e) => setFrameworkStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="in-progress">In Progress</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  {/* Results count */}
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Showing {filteredFrameworks.length} of {complianceFrameworks.length} frameworks
                    </span>
                    {(frameworkSearchTerm || frameworkPriorityFilter !== 'all' || frameworkCategoryFilter !== 'all' || frameworkStatusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setFrameworkSearchTerm('');
                          setFrameworkPriorityFilter('all');
                          setFrameworkCategoryFilter('all');
                          setFrameworkStatusFilter('all');
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Framework Cards */}
                <div className="space-y-4">
                  {filteredFrameworks.length === 0 ? (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                      <p className="text-gray-400">No frameworks match your filters</p>
                    </div>
                  ) : (
                    filteredFrameworks.map((framework, index) => {
                    const priorityColors = {
                      critical: { border: 'border-red-500/50', bg: 'bg-red-500/5', badge: 'bg-red-500/20 text-red-400' },
                      high: { border: 'border-orange-500/50', bg: 'bg-orange-500/5', badge: 'bg-orange-500/20 text-orange-400' },
                      medium: { border: 'border-yellow-500/50', bg: 'bg-yellow-500/5', badge: 'bg-yellow-500/20 text-yellow-400' }
                    };
                    const colors = priorityColors[framework.priority] || priorityColors.medium;
                    const statusColors = {
                      active: 'bg-green-500/20 text-green-400',
                      'in-progress': 'bg-blue-500/20 text-blue-400',
                      pending: 'bg-gray-500/20 text-gray-400'
                    };

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedFramework(framework)}
                        className={`rounded-xl border ${colors.border} ${colors.bg} p-5 transition-all hover:scale-[1.01] cursor-pointer`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <ShieldCheck className="w-5 h-5 text-cyan-400 mr-2" />
                              <h3 className="text-lg font-semibold text-white">{framework.framework}</h3>
                              <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold uppercase ${colors.badge}`}>
                                {framework.priority}
                              </span>
                              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold uppercase ${statusColors[framework.status]}`}>
                                {framework.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mb-2">
                              <span className="px-3 py-1 rounded-lg text-xs bg-purple-500/20 text-purple-300">
                                {framework.category}
                              </span>
                              <span className="text-sm text-gray-400">{framework.description}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Control Implementation</div>
                            <div className="flex items-center mb-1">
                              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                                <div
                                  className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                                  style={{ width: `${framework.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-mono text-cyan-400">{framework.progress}%</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {framework.implementedControls} of {framework.totalControls} controls
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Coverage</div>
                            <div className="flex items-center mb-1">
                              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${framework.coverage}%`, backgroundColor: getScoreColor(framework.coverage) }}
                                />
                              </div>
                              <span className="text-sm font-mono text-white">{framework.coverage}%</span>
                            </div>
                            <div className="text-xs text-gray-600">Framework compliance</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Findings</div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`text-xl font-bold ${framework.findings > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                                {framework.findings}
                              </span>
                              <span className="text-sm text-gray-500">open issues</span>
                            </div>
                            <div className="text-xs text-gray-600">Owner: {framework.owner}</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-2">Key Requirements:</div>
                          <div className="flex flex-wrap gap-2">
                            {framework.keyRequirements?.map((req, idx) => (
                              <span key={idx} className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Last Audit: {framework.lastAudit}</span>
                            <span>Next Audit: {framework.nextAudit} ({framework.daysUntilAudit} days)</span>
                          </div>
                          <span className="text-[11px] text-cyan-300 flex items-center">
                            <ExternalLink className="w-3 h-3 mr-1" /> Click to expand
                          </span>
                        </div>
                      </div>
                    );
                  })
                  )}
                </div>

                {selectedFramework && (
                  <Modal title={selectedFramework.framework} onClose={() => setSelectedFramework(null)}>
                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm">{selectedFramework.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                          <p className="text-xs text-gray-500 mb-2">Alignment</p>
                          <p className="text-sm text-gray-200">Priority: {selectedFramework.priority?.toUpperCase()}</p>
                          <p className="text-sm text-gray-200">Status: {selectedFramework.status}</p>
                          <p className="text-xs text-gray-500 mt-1">Coverage: {selectedFramework.coverage}%</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                          <p className="text-xs text-gray-500 mb-2">Key Controls</p>
                          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            {(selectedFramework.keyRequirements || []).map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                            {selectedFramework.keyRequirements?.length === 0 && (
                              <li>Map this framework to data protection, access control, and incident response runbooks.</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                        <p className="text-xs text-gray-500 mb-2">Reference & Mapping</p>
                        <p className="text-sm text-gray-300 mb-2">{frameworkResources[selectedFramework.framework]?.summary || 'Use this framework to align AI controls with sector obligations and map findings to audits.'}</p>
                        <a
                          href={frameworkResources[selectedFramework.framework]?.url || frameworkResources['NIST AI RMF'].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-cyan-300 text-sm hover:text-cyan-200"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {frameworkResources[selectedFramework.framework]?.url || 'Open NIST AI RMF'}
                        </a>
                      </div>
                    </div>
                  </Modal>
                )}

                {/* Category Breakdown Chart */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Coverage by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={complianceCategories} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" stroke="#666" domain={[0, 100]} />
                      <YAxis type="category" dataKey="category" stroke="#666" width={150} fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1f2e',
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="coverage" fill="#06b6d4" name="Coverage %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        )}

        {/* AI Models Tab */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <SectionHeader
              icon={AlertTriangle}
              title="AI Vulnerability Database"
              subtitle="OWASP Top 10 for LLM, CVEs, and AI/ML security threats"
              action={
                <button
                  onClick={refreshModels}
                  disabled={modelLoading}
                  className="flex items-center px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${modelLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              }
            />

            {/* Summary Stats */}
            {!modelLoading && !modelError && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Total Vulnerabilities</span>
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{vulnerabilitySummary.total || 0}</div>
                </div>
                <div className="bg-gray-900/50 border border-red-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Critical</span>
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-red-400">{vulnerabilitySummary.critical || 0}</div>
                </div>
                <div className="bg-gray-900/50 border border-orange-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">High Severity</span>
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-orange-400">{vulnerabilitySummary.high || 0}</div>
                </div>
                <div className="bg-gray-900/50 border border-yellow-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Exploitable</span>
                    <Activity className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{vulnerabilitySummary.exploitable || 0}</div>
                </div>
              </div>
            )}

            {modelLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : modelError ? (
              <ErrorDisplay message={modelError} onRetry={refreshModels} />
            ) : (
              <>
                {/* Filter Controls */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                      <label className="block text-xs text-gray-500 mb-2">Search</label>
                      <input
                        type="text"
                        value={vulnSearchTerm}
                        onChange={(e) => setVulnSearchTerm(e.target.value)}
                        placeholder="Search by title, ID, or description..."
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Severity Filter */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Severity</label>
                      <select
                        value={vulnSeverityFilter}
                        onChange={(e) => setVulnSeverityFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Category</label>
                      <select
                        value={vulnCategoryFilter}
                        onChange={(e) => setVulnCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="OWASP Top 10 for LLM">OWASP Top 10 for LLM</option>
                        <option value="CVE">CVE</option>
                        <option value="Adversarial ML">Adversarial ML</option>
                        <option value="Privacy Attack">Privacy Attack</option>
                        <option value="MITRE ATLAS">MITRE ATLAS</option>
                      </select>
                    </div>

                    {/* Exploit Filter */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Exploit Available</label>
                      <select
                        value={vulnExploitFilter}
                        onChange={(e) => setVulnExploitFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="all">All</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  {/* Results count */}
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Showing {filteredVulnerabilities.length} of {aiVulnerabilities.length} vulnerabilities
                    </span>
                    {(vulnSearchTerm || vulnSeverityFilter !== 'all' || vulnCategoryFilter !== 'all' || vulnExploitFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setVulnSearchTerm('');
                          setVulnSeverityFilter('all');
                          setVulnCategoryFilter('all');
                          setVulnExploitFilter('all');
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Vulnerability Cards */}
                <div className="space-y-4">
                  {filteredVulnerabilities.length === 0 ? (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                      <p className="text-gray-400">No vulnerabilities match your filters</p>
                    </div>
                  ) : (
                    filteredVulnerabilities.map((vuln, index) => {
                    const severityColors = {
                      critical: { border: 'border-red-500/50', bg: 'bg-red-500/10', text: 'text-red-400', badge: 'bg-red-500/20' },
                      high: { border: 'border-orange-500/50', bg: 'bg-orange-500/10', text: 'text-orange-400', badge: 'bg-orange-500/20' },
                      medium: { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', text: 'text-yellow-400', badge: 'bg-yellow-500/20' },
                      low: { border: 'border-green-500/50', bg: 'bg-green-500/10', text: 'text-green-400', badge: 'bg-green-500/20' }
                    };
                    const colors = severityColors[vuln.severity] || severityColors.medium;

                    return (
                      <div
                        key={index}
                        className={`rounded-xl border ${colors.border} ${colors.bg} p-5 transition-all hover:scale-[1.01]`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <AlertTriangle className={`w-5 h-5 ${colors.text} mr-2`} />
                              <h3 className="text-lg font-semibold text-white">{vuln.title}</h3>
                              {vuln.exploitAvailable && (
                                <span className="ml-2 px-2 py-1 rounded text-xs bg-red-500/30 text-red-300 border border-red-500/50">
                                  Exploit Available
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mb-3">
                              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${colors.badge} ${colors.text} uppercase`}>
                                {vuln.severity}
                              </span>
                              <span className="px-3 py-1 rounded-lg text-xs bg-gray-800 text-gray-300">
                                CVSS: {vuln.cvss}
                              </span>
                              <span className="px-3 py-1 rounded-lg text-xs bg-purple-500/20 text-purple-300">
                                {vuln.category}
                              </span>
                              <span className="text-xs text-gray-500">{vuln.id}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4">{vuln.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Affected Systems:</div>
                            <div className="flex flex-wrap gap-2">
                              {vuln.affectedSystems?.map((sys, idx) => (
                                <span key={idx} className="px-2 py-1 rounded text-xs bg-gray-800 text-cyan-300">
                                  {sys}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Patches/Mitigations:</div>
                            <p className="text-sm text-gray-400">{vuln.patches}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500">
                              Discovered: {vuln.discovered}
                            </span>
                            <span className="text-xs text-gray-500">
                              Last Updated: {vuln.lastUpdated}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-cyan-400 font-mono">{getAtlasMapping(vuln)}</span>
                            <span className="px-2 py-1 rounded text-[11px] bg-gray-800 text-gray-300">Click to drill down</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                  )}
                </div>

                {selectedVulnerability && (
                  <Modal title={selectedVulnerability.title} onClose={() => setSelectedVulnerability(null)}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getRiskBadgeColor(selectedVulnerability.severity?.toUpperCase?.() || selectedVulnerability.severity || 'MEDIUM')}`}>
                          {selectedVulnerability.severity}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300">
                          {selectedVulnerability.category}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300">CVSS {selectedVulnerability.cvss}</span>
                      </div>

                      <p className="text-gray-300 text-sm leading-relaxed">{selectedVulnerability.description}</p>

                      <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">MITRE ATLAS Mapping</p>
                        <p className="text-sm text-cyan-300">{getAtlasMapping(selectedVulnerability)}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                          <p className="text-xs text-gray-500 mb-2">Impacted Assets</p>
                          <div className="flex flex-wrap gap-2">
                            {(selectedVulnerability.affectedSystems || ['Inference API', 'Vector store', 'Model registry']).map((sys, idx) => (
                              <span key={idx} className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-200">{sys}</span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                          <p className="text-xs text-gray-500 mb-2">NIST AI RMF</p>
                          <p className="text-sm text-gray-300">Govern 1.3, Map 1.5, Measure 2.6, Manage 3.2</p>
                          <p className="text-xs text-gray-500 mt-1">Align mitigations to risk lifecycle activities.</p>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                        <p className="text-xs text-gray-500 mb-2">Recommended Actions</p>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                          <li>Enable guardrails and output filters for unsafe generations.</li>
                          <li>Instrument runtime detections and send signals to SIEM/SOAR.</li>
                          <li>Validate training and inference inputs for adversarial content.</li>
                        </ul>
                      </div>

                      {selectedVulnerability.references && selectedVulnerability.references.length > 0 && (
                        <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                          <p className="text-xs text-gray-500 mb-2">References</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedVulnerability.references.map((ref, idx) => (
                              <span key={idx} className="text-xs text-cyan-400 font-mono">{ref}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Modal>
                )}

                {/* Category Statistics */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Vulnerabilities by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vulnerabilityCategories} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" stroke="#666" />
                      <YAxis type="category" dataKey="category" stroke="#666" width={150} fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1f2e',
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                      <Bar dataKey="high" stackId="a" fill="#f97316" name="High" />
                      <Bar dataKey="medium" stackId="a" fill="#eab308" name="Medium" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
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

                {/* Curated Security News */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-800 bg-black/30 flex items-center justify-between">
                    <div className="flex items-center">
                      <Rss className="w-5 h-5 text-cyan-400 mr-2" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">AI Security Newswire</h3>
                        <p className="text-sm text-gray-500">Latest headlines mapped to MITRE ATLAS and NIST AI RMF</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">Updated continuously</span>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {securityNews.map((item, idx) => (
                      <div key={idx} className="p-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="text-sm text-cyan-300 font-semibold">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.source} • {item.time}</p>
                          </div>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 flex items-center"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" /> View
                          </a>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{item.summary}</p>
                        <div className="flex flex-wrap gap-2 text-[11px] text-cyan-200">
                          <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30">MITRE ATLAS</span>
                          <span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/30">NIST AI RMF</span>
                          <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30">Threat intel</span>
                        </div>
                      </div>
                    ))}
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

            {/* Layer drill-down */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
                    <Target className="w-5 h-5 text-cyan-400 mr-2" />
                    Clickable stack overview
                  </h3>
                  <p className="text-sm text-gray-400">Select a layer to review why it matters and what to harden.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                {architectureLayers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(architectureInsights[layer.id])}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedLayer?.title === architectureInsights[layer.id].title
                        ? 'border-cyan-500/60 bg-cyan-500/10 shadow'
                        : 'border-gray-800 hover:border-cyan-500/40 hover:bg-white/5'
                    }`}
                    style={{ boxShadow: selectedLayer?.title === architectureInsights[layer.id].title ? `0 0 10px ${layer.color}` : 'none' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">{layer.name}</span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                    </div>
                    <p className="text-xs text-gray-400">{architectureInsights[layer.id].details}</p>
                  </button>
                ))}
              </div>

              {selectedLayer && (
                <div className="bg-black/30 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-500">Importance</p>
                      <p className="text-lg text-white font-semibold">{selectedLayer.title}</p>
                    </div>
                    <span className="text-xs text-cyan-300">Mapped to MITRE ATLAS & NIST AI RMF</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{selectedLayer.details}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLayer.bestPractices.map((practice, idx) => (
                      <span key={idx} className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-200 border border-gray-700">
                        {practice}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
