import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import { 
  FileSpreadsheet, FileType, Database, Dices, Filter, Columns3, 
  CircleSlash, Scale, Merge, BarChart3, Waypoints, FlaskConical,
  Layers, TrendingUp, GitBranch, CircleDot, Trees, Activity,
  CalendarRange, TestTube, Table, LineChart, BarChart, FileOutput,
  ScatterChart, Play, CheckCircle, XCircle, Loader2, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeCategory, NodeStatus } from '@/types/workflow';

const iconMap: Record<string, any> = {
  FileSpreadsheet, FileType, Database, Dices, Filter, Columns3,
  CircleSlash, Scale, Merge, BarChart3, Waypoints, FlaskConical,
  Layers, TrendingUp, GitBranch, CircleDot, Trees, Activity,
  CalendarRange, TestTube, Table, LineChart, BarChart, FileOutput,
  ScatterChart
};

const categoryStyles: Record<NodeCategory, { border: string; bg: string; icon: string }> = {
  input: {
    border: 'border-node-input',
    bg: 'bg-node-input-bg',
    icon: 'text-node-input',
  },
  processing: {
    border: 'border-node-processing',
    bg: 'bg-node-processing-bg',
    icon: 'text-node-processing',
  },
  analysis: {
    border: 'border-node-analysis',
    bg: 'bg-node-analysis-bg',
    icon: 'text-node-analysis',
  },
  modeling: {
    border: 'border-node-modeling',
    bg: 'bg-node-modeling-bg',
    icon: 'text-node-modeling',
  },
  timeseries: {
    border: 'border-node-timeseries',
    bg: 'bg-node-timeseries-bg',
    icon: 'text-node-timeseries',
  },
  output: {
    border: 'border-node-output',
    bg: 'bg-node-output-bg',
    icon: 'text-node-output',
  },
};

const statusIcons: Record<NodeStatus, JSX.Element | null> = {
  idle: null,
  pending: <Play className="w-3 h-3 text-status-pending" />,
  running: <Loader2 className="w-3 h-3 text-status-running animate-spin" />,
  success: <CheckCircle className="w-3 h-3 text-status-success" />,
  error: <XCircle className="w-3 h-3 text-status-error" />,
  warning: <AlertTriangle className="w-3 h-3 text-status-warning" />,
};

export interface WorkflowNodeData {
  label: string;
  category: NodeCategory;
  status: NodeStatus;
  icon?: string;
  inputs?: number;
  outputs?: number;
  parameters?: Record<string, any>;
  result?: any;
}

interface WorkflowNodeProps {
  data: WorkflowNodeData;
  selected?: boolean;
}

function WorkflowNode({ data, selected }: WorkflowNodeProps) {
  const { label, category, status, icon, inputs = 1, outputs = 1 } = data;
  const styles = categoryStyles[category];
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <div
      className={cn(
        'relative px-4 py-3 rounded-lg border-2 shadow-node min-w-[160px] transition-all duration-200 node-appear',
        styles.bg,
        styles.border,
        selected && 'ring-2 ring-primary shadow-node-hover',
        status === 'running' && 'node-running'
      )}
    >
      {/* Input Handles */}
      {inputs > 0 && (
        <>
          {Array.from({ length: inputs }).map((_, i) => (
            <Handle
              key={`input-${i}`}
              type="target"
              position={Position.Left}
              id={`input-${i}`}
              style={{ top: `${((i + 1) / (inputs + 1)) * 100}%` }}
            />
          ))}
        </>
      )}

      {/* Node Content */}
      <div className="flex items-center gap-3">
        {IconComponent && (
          <div className={cn('p-2 rounded-md bg-background/30', styles.icon)}>
            <IconComponent className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground truncate">
              {label}
            </span>
            {statusIcons[status]}
          </div>
          <span className="text-xs text-muted-foreground capitalize">
            {category === 'timeseries' ? 'السلاسل الزمنية' : 
             category === 'input' ? 'إدخال' :
             category === 'processing' ? 'معالجة' :
             category === 'analysis' ? 'تحليل' :
             category === 'modeling' ? 'نمذجة' :
             category === 'output' ? 'إخراج' : category}
          </span>
        </div>
      </div>

      {/* Output Handles */}
      {outputs > 0 && (
        <>
          {Array.from({ length: outputs }).map((_, i) => (
            <Handle
              key={`output-${i}`}
              type="source"
              position={Position.Right}
              id={`output-${i}`}
              style={{ top: `${((i + 1) / (outputs + 1)) * 100}%` }}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default memo(WorkflowNode);
