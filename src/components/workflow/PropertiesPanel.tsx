import { Node } from '@xyflow/react';
import { X, Info, Play, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getNodeDefinition } from '@/data/nodeDefinitions';
import { NodeParameter, NodeStatus } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface PropertiesPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: any) => void;
  onExecuteNode: (nodeId: string) => void;
}

const statusLabels: Record<NodeStatus, { label: string; color: string }> = {
  idle: { label: 'جاهز', color: 'text-muted-foreground' },
  pending: { label: 'في الانتظار', color: 'text-status-pending' },
  running: { label: 'قيد التنفيذ', color: 'text-status-running' },
  success: { label: 'نجح', color: 'text-status-success' },
  error: { label: 'خطأ', color: 'text-status-error' },
  warning: { label: 'تحذير', color: 'text-status-warning' },
};

export default function PropertiesPanel({
  node,
  onClose,
  onUpdateNode,
  onExecuteNode,
}: PropertiesPanelProps) {
  if (!node) return null;

  const nodeData = node.data as any;
  const definition = getNodeDefinition(node.type || '');
  const status = nodeData.status as NodeStatus || 'idle';
  const statusInfo = statusLabels[status];

  const handleParameterChange = (paramId: string, value: any) => {
    const newParams = { ...nodeData.parameters, [paramId]: value };
    onUpdateNode(node.id, { ...nodeData, parameters: newParams });
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold flex-1 text-right">خصائص العقدة</h2>
        </div>
        
        <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', {
              'bg-muted-foreground': status === 'idle',
              'bg-status-pending': status === 'pending',
              'bg-status-running animate-pulse': status === 'running',
              'bg-status-success': status === 'success',
              'bg-status-error': status === 'error',
              'bg-status-warning': status === 'warning',
            })} />
            <span className={cn('text-sm', statusInfo.color)}>{statusInfo.label}</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{nodeData.label}</div>
            <div className="text-xs text-muted-foreground">{node.type}</div>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Node Info */}
          {definition && (
            <div className="bg-secondary/30 rounded-lg p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground text-right">
                {definition.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Parameters Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">المعاملات</h3>
            </div>

            {definition?.parameters.map((param) => (
              <ParameterInput
                key={param.id}
                parameter={param}
                value={nodeData.parameters?.[param.id] ?? param.value}
                onChange={(value) => handleParameterChange(param.id, value)}
              />
            ))}

            {(!definition?.parameters || definition.parameters.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                لا توجد معاملات لهذه العقدة
              </p>
            )}
          </div>

          {/* Results Preview */}
          {nodeData.result && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">النتائج</h3>
                <div className="bg-secondary/50 rounded-lg p-3 font-mono text-xs overflow-auto max-h-48">
                  <pre dir="ltr">{JSON.stringify(nodeData.result, null, 2)}</pre>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <Button
          className="w-full gap-2"
          onClick={() => onExecuteNode(node.id)}
          disabled={status === 'running'}
        >
          <Play className="w-4 h-4" />
          تنفيذ هذه العقدة
        </Button>
      </div>
    </div>
  );
}

interface ParameterInputProps {
  parameter: NodeParameter;
  value: any;
  onChange: (value: any) => void;
}

function ParameterInput({ parameter, value, onChange }: ParameterInputProps) {
  const { id, name, type, options, placeholder, description, required, min, max } = parameter;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center justify-end gap-1">
        {name}
        {required && <span className="text-destructive">*</span>}
      </Label>

      {type === 'string' && (
        <Input
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-secondary border-border text-right"
          dir="auto"
        />
      )}

      {type === 'number' && (
        <Input
          id={id}
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          className="bg-secondary border-border"
          dir="ltr"
        />
      )}

      {type === 'boolean' && (
        <div className="flex items-center justify-end gap-2">
          <Switch
            id={id}
            checked={value ?? false}
            onCheckedChange={onChange}
          />
        </div>
      )}

      {type === 'select' && options && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="اختر..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {type === 'file' && (
        <Input
          id={id}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file.name);
          }}
          className="bg-secondary border-border"
        />
      )}

      {type === 'multiselect' && options && (
        <div className="space-y-2 bg-secondary/50 rounded-lg p-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center justify-end gap-2 cursor-pointer">
              <span className="text-sm">{opt.label}</span>
              <input
                type="checkbox"
                checked={Array.isArray(value) && value.includes(opt.value)}
                onChange={(e) => {
                  const current = Array.isArray(value) ? value : [];
                  if (e.target.checked) {
                    onChange([...current, opt.value]);
                  } else {
                    onChange(current.filter((v: any) => v !== opt.value));
                  }
                }}
                className="rounded border-border"
              />
            </label>
          ))}
        </div>
      )}

      {description && (
        <p className="text-xs text-muted-foreground text-right">{description}</p>
      )}
    </div>
  );
}
