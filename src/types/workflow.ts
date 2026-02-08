export type NodeCategory = 
  | 'input'
  | 'processing'
  | 'analysis'
  | 'modeling'
  | 'timeseries'
  | 'output';

export type NodeStatus = 
  | 'idle'
  | 'pending'
  | 'running'
  | 'success'
  | 'error'
  | 'warning';

export interface NodeParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'file' | 'multiselect';
  value: any;
  options?: { label: string; value: any }[];
  placeholder?: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export interface NodeDefinition {
  type: string;
  category: NodeCategory;
  label: string;
  description: string;
  icon: string;
  inputs: number;
  outputs: number;
  parameters: NodeParameter[];
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    category: NodeCategory;
    status: NodeStatus;
    parameters: Record<string, any>;
    result?: any;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionResult {
  nodeId: string;
  status: NodeStatus;
  data?: any;
  error?: string;
  executionTime?: number;
}
