import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const InteractiveArchitecture = ({ type = 'security-stack' }) => {
  // Security Stack Diagram
  const securityStackNodes = [
    // Presentation Layer
    {
      id: 'api-gateway',
      type: 'default',
      position: { x: 250, y: 0 },
      data: { label: '🌐 API Gateway' },
      style: { background: '#00ffc820', border: '2px solid #00ffc8', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'waf',
      type: 'default',
      position: { x: 50, y: 0 },
      data: { label: '🛡️ WAF' },
      style: { background: '#00ffc820', border: '2px solid #00ffc8', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'load-balancer',
      type: 'default',
      position: { x: 450, y: 0 },
      data: { label: '⚖️ Load Balancer' },
      style: { background: '#00ffc820', border: '2px solid #00ffc8', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },

    // Orchestration Layer
    {
      id: 'agent-router',
      type: 'default',
      position: { x: 250, y: 120 },
      data: { label: '🤖 Agent Router' },
      style: { background: '#1e90ff20', border: '2px solid #1e90ff', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'model-registry',
      type: 'default',
      position: { x: 50, y: 120 },
      data: { label: '📋 Model Registry' },
      style: { background: '#1e90ff20', border: '2px solid #1e90ff', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'guardrails',
      type: 'default',
      position: { x: 450, y: 120 },
      data: { label: '🚧 Guardrails' },
      style: { background: '#1e90ff20', border: '2px solid #1e90ff', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },

    // Inference Layer
    {
      id: 'llm-cluster',
      type: 'default',
      position: { x: 150, y: 240 },
      data: { label: '🧠 LLM Cluster' },
      style: { background: '#8b5cf620', border: '2px solid #8b5cf6', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'ml-models',
      type: 'default',
      position: { x: 350, y: 240 },
      data: { label: '🔮 ML Models' },
      style: { background: '#8b5cf620', border: '2px solid #8b5cf6', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },

    // Data Layer
    {
      id: 'token-vault',
      type: 'default',
      position: { x: 50, y: 360 },
      data: { label: '🔐 Token Vault' },
      style: { background: '#ffa50220', border: '2px solid #ffa502', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'dspm',
      type: 'default',
      position: { x: 250, y: 360 },
      data: { label: '📊 DSPM' },
      style: { background: '#ffa50220', border: '2px solid #ffa502', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'encryption',
      type: 'default',
      position: { x: 450, y: 360 },
      data: { label: '🔒 Encryption' },
      style: { background: '#ffa50220', border: '2px solid #ffa502', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },

    // Security Fabric
    {
      id: 'zero-trust',
      type: 'default',
      position: { x: 100, y: 480 },
      data: { label: '🎯 Zero Trust' },
      style: { background: '#ff475720', border: '2px solid #ff4757', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'siem',
      type: 'default',
      position: { x: 300, y: 480 },
      data: { label: '👁️ SIEM' },
      style: { background: '#ff475720', border: '2px solid #ff4757', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    },
    {
      id: 'soar',
      type: 'default',
      position: { x: 500, y: 480 },
      data: { label: '⚡ SOAR' },
      style: { background: '#ff475720', border: '2px solid #ff4757', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '10px' }
    }
  ];

  const securityStackEdges = [
    // Presentation to Orchestration
    { id: 'e1', source: 'waf', target: 'agent-router', animated: true, style: { stroke: '#00ffc8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00ffc8' } },
    { id: 'e2', source: 'api-gateway', target: 'agent-router', animated: true, style: { stroke: '#00ffc8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00ffc8' } },
    { id: 'e3', source: 'load-balancer', target: 'agent-router', animated: true, style: { stroke: '#00ffc8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00ffc8' } },

    // Orchestration connections
    { id: 'e4', source: 'agent-router', target: 'model-registry', style: { stroke: '#1e90ff' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#1e90ff' } },
    { id: 'e5', source: 'agent-router', target: 'guardrails', style: { stroke: '#1e90ff' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#1e90ff' } },

    // Orchestration to Inference
    { id: 'e6', source: 'agent-router', target: 'llm-cluster', animated: true, style: { stroke: '#1e90ff' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
    { id: 'e7', source: 'agent-router', target: 'ml-models', animated: true, style: { stroke: '#1e90ff' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },

    // Inference to Data
    { id: 'e8', source: 'llm-cluster', target: 'token-vault', style: { stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ffa502' } },
    { id: 'e9', source: 'llm-cluster', target: 'dspm', style: { stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ffa502' } },
    { id: 'e10', source: 'ml-models', target: 'dspm', style: { stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ffa502' } },
    { id: 'e11', source: 'ml-models', target: 'encryption', style: { stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ffa502' } },

    // Data to Security Fabric
    { id: 'e12', source: 'token-vault', target: 'zero-trust', style: { stroke: '#ffa502' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ff4757' } },
    { id: 'e13', source: 'dspm', target: 'siem', style: { stroke: '#ffa502' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ff4757' } },
    { id: 'e14', source: 'encryption', target: 'soar', style: { stroke: '#ffa502' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ff4757' } }
  ];

  // Transaction Flow Diagram
  const transactionFlowNodes = [
    {
      id: 'transaction',
      position: { x: 50, y: 150 },
      data: { label: '💳 Transaction' },
      style: { background: '#00ffc820', border: '2px solid #00ffc8', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '12px' }
    },
    {
      id: 'auth',
      position: { x: 200, y: 150 },
      data: { label: '🔐 Authentication' },
      style: { background: '#1e90ff20', border: '2px solid #1e90ff', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '12px' }
    },
    {
      id: 'fraud-check',
      position: { x: 400, y: 150 },
      data: { label: '🛡️ Fraud Detection' },
      style: { background: '#8b5cf620', border: '2px solid #8b5cf6', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '12px' }
    },
    {
      id: 'ai-analysis',
      position: { x: 300, y: 50 },
      data: { label: '🤖 AI Analysis' },
      style: { background: '#ffa50220', border: '2px solid #ffa502', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '12px' }
    },
    {
      id: 'risk-score',
      position: { x: 300, y: 250 },
      data: { label: '⚠️ Risk Scoring' },
      style: { background: '#ff475720', border: '2px solid #ff4757', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '12px' }
    },
    {
      id: 'decision',
      position: { x: 600, y: 150 },
      data: { label: '✅ Decision' },
      style: { background: '#2ed57320', border: '2px solid #2ed573', color: '#fff', fontWeight: 'bold', borderRadius: '12px', padding: '12px' }
    }
  ];

  const transactionFlowEdges = [
    { id: 'tf1', source: 'transaction', target: 'auth', animated: true, style: { stroke: '#00ffc8', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00ffc8' } },
    { id: 'tf2', source: 'auth', target: 'fraud-check', animated: true, style: { stroke: '#1e90ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#1e90ff' } },
    { id: 'tf3', source: 'fraud-check', target: 'ai-analysis', style: { stroke: '#8b5cf6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
    { id: 'tf4', source: 'fraud-check', target: 'risk-score', style: { stroke: '#8b5cf6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
    { id: 'tf5', source: 'ai-analysis', target: 'decision', animated: true, style: { stroke: '#ffa502', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ffa502' } },
    { id: 'tf6', source: 'risk-score', target: 'decision', animated: true, style: { stroke: '#ff4757', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ff4757' } }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(
    type === 'security-stack' ? securityStackNodes : transactionFlowNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    type === 'security-stack' ? securityStackEdges : transactionFlowEdges
  );

  return (
    <div style={{ height: type === 'security-stack' ? 600 : 400, width: '100%', background: '#0a0f1a', borderRadius: '12px', border: '1px solid #1f2937' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
        style={{ background: '#0a0f1a' }}
      >
        <Background
          color="#00ffc815"
          gap={20}
          size={1}
          style={{ background: '#0a0f1a' }}
        />
        <Controls
          style={{
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            button: { background: '#374151', border: 'none', color: '#fff' }
          }}
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.style?.border?.includes('#00ffc8')) return '#00ffc8';
            if (node.style?.border?.includes('#1e90ff')) return '#1e90ff';
            if (node.style?.border?.includes('#8b5cf6')) return '#8b5cf6';
            if (node.style?.border?.includes('#ffa502')) return '#ffa502';
            if (node.style?.border?.includes('#ff4757')) return '#ff4757';
            return '#2ed573';
          }}
          style={{
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px'
          }}
          maskColor="rgba(10, 15, 26, 0.6)"
        />
      </ReactFlow>
    </div>
  );
};

export default InteractiveArchitecture;
