import { useCallback, useState, useRef, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import WorkflowNode from './WorkflowNode';
import NodePalette from './NodePalette';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';
import ResultsPanel from './ResultsPanel';
import { getNodeDefinition } from '@/data/nodeDefinitions';
import { NodeStatus } from '@/types/workflow';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

function WorkflowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultNode, setResultNode] = useState<Node | null>(null);

  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

  // Handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle pane click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle edge connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [setEdges]
  );

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const definition = getNodeDefinition(type);
      if (!definition) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type: 'workflowNode',
        position,
        data: {
          label: definition.label,
          category: definition.category,
          status: 'idle' as NodeStatus,
          icon: definition.icon,
          inputs: definition.inputs,
          outputs: definition.outputs,
          parameters: definition.parameters.reduce((acc, p) => {
            acc[p.id] = p.value;
            return acc;
          }, {} as Record<string, any>),
        },
      };

      setNodes((nds) => nds.concat(newNode));
      toast.success(`تمت إضافة ${definition.label}`);
    },
    [screenToFlowPosition, setNodes]
  );

  // Handle drag start from palette
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Update node data
  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data };
          }
          return node;
        })
      );
      // Update selected node if it's the one being updated
      setSelectedNode((prev) => (prev?.id === nodeId ? { ...prev, data } : prev));
    },
    [setNodes]
  );

  // Execute single node (simulation)
  const executeNode = useCallback(
    async (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      // Set running status
      updateNodeData(nodeId, { ...node.data, status: 'running' });

      // Simulate execution
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock result
      const mockResult = generateMockResult(node.type || 'unknown');

      // Set success status with result
      updateNodeData(nodeId, {
        ...node.data,
        status: 'success',
        result: mockResult,
      });

      // Show results panel
      setResultNode({ ...node, data: { ...node.data, result: mockResult } });
      setShowResults(true);
      
      toast.success(`تم تنفيذ ${(node.data as any).label}`);
    },
    [nodes, updateNodeData]
  );

  // Execute all nodes
  const executeAll = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error('لا توجد عقد للتنفيذ');
      return;
    }

    setIsRunning(true);

    for (const node of nodes) {
      await executeNode(node.id);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsRunning(false);
    toast.success('تم تنفيذ جميع العقد بنجاح');
  }, [nodes, executeNode]);

  // Stop execution
  const stopExecution = useCallback(() => {
    setIsRunning(false);
    toast.info('تم إيقاف التنفيذ');
  }, []);

  // Save workflow
  const saveWorkflow = useCallback(() => {
    const workflow = {
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('dataflow-workflow', JSON.stringify(workflow));
    toast.success('تم حفظ مسار العمل');
  }, [nodes, edges]);

  // Load workflow
  const loadWorkflow = useCallback(() => {
    const saved = localStorage.getItem('dataflow-workflow');
    if (saved) {
      const workflow = JSON.parse(saved);
      setNodes(workflow.nodes || []);
      setEdges(workflow.edges || []);
      toast.success('تم تحميل مسار العمل');
    } else {
      toast.error('لا يوجد مسار عمل محفوظ');
    }
  }, [setNodes, setEdges]);

  // Export workflow
  const exportWorkflow = useCallback(() => {
    const workflow = {
      version: '1.0',
      name: 'Untitled Workflow',
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير مسار العمل');
  }, [nodes, edges]);

  // Import workflow
  const importWorkflow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workflow = JSON.parse(event.target?.result as string);
            setNodes(workflow.nodes || []);
            setEdges(workflow.edges || []);
            toast.success('تم استيراد مسار العمل');
          } catch {
            toast.error('فشل في قراءة الملف');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  // Clear all
  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setShowResults(false);
    toast.info('تم مسح مسار العمل');
  }, [setNodes, setEdges]);

  // Auto layout (simple grid)
  const autoLayout = useCallback(() => {
    const spacing = { x: 250, y: 120 };
    const columns = 4;

    setNodes((nds) =>
      nds.map((node, i) => ({
        ...node,
        position: {
          x: (i % columns) * spacing.x + 100,
          y: Math.floor(i / columns) * spacing.y + 100,
        },
      }))
    );

    setTimeout(() => fitView({ padding: 0.2 }), 100);
    toast.success('تم ترتيب العقد');
  }, [setNodes, fitView]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Toolbar */}
      <Toolbar
        isRunning={isRunning}
        onExecuteAll={executeAll}
        onStop={stopExecution}
        onSave={saveWorkflow}
        onLoad={loadWorkflow}
        onExport={exportWorkflow}
        onImport={importWorkflow}
        onClear={clearAll}
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onFitView={() => fitView({ padding: 0.2 })}
        onAutoLayout={autoLayout}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Properties Panel (Right side for RTL) */}
        {selectedNode && (
          <div className="w-80 flex-shrink-0">
            <PropertiesPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdateNode={updateNodeData}
              onExecuteNode={executeNode}
            />
          </div>
        )}

        {/* Main Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: 'hsl(217, 91%, 60%)', strokeWidth: 2 },
            }}
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const category = (node.data as any).category;
                const colors: Record<string, string> = {
                  input: 'hsl(217, 91%, 60%)',
                  processing: 'hsl(142, 71%, 45%)',
                  analysis: 'hsl(280, 87%, 65%)',
                  modeling: 'hsl(32, 95%, 55%)',
                  timeseries: 'hsl(190, 95%, 50%)',
                  output: 'hsl(340, 82%, 60%)',
                };
                return colors[category] || '#666';
              }}
              maskColor="rgba(0, 0, 0, 0.8)"
            />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          </ReactFlow>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-muted-foreground">
                <div className="text-6xl mb-4 opacity-20">🔗</div>
                <h3 className="text-xl font-medium mb-2">ابدأ بإنشاء مسار العمل</h3>
                <p className="text-sm">اسحب العقد من اللوحة اليمنى وأفلتها هنا</p>
              </div>
            </div>
          )}
        </div>

        {/* Node Palette (Left side for RTL) */}
        <div className="w-72 flex-shrink-0">
          <NodePalette onDragStart={onDragStart} />
        </div>
      </div>

      {/* Results Panel */}
      {showResults && resultNode && (
        <ResultsPanel
          result={(resultNode.data as any).result}
          nodeLabel={(resultNode.data as any).label}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}

// Mock result generator
function generateMockResult(nodeType: string): any {
  const sampleData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    value: Math.round(Math.random() * 100),
    category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    score: (Math.random() * 10).toFixed(2),
  }));

  if (nodeType.includes('statistics')) {
    return {
      mean: 52.3,
      std: 28.7,
      min: 3,
      max: 98,
      median: 51,
      count: 20,
    };
  }

  if (nodeType.includes('correlation')) {
    return {
      matrix: [
        [1.0, 0.85, -0.32],
        [0.85, 1.0, -0.21],
        [-0.32, -0.21, 1.0],
      ],
      columns: ['value', 'score', 'category_encoded'],
    };
  }

  return sampleData;
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
