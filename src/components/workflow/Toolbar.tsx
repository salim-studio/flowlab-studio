import { 
  Play, Square, Save, FolderOpen, Download, Upload,
  Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Trash2,
  LayoutGrid, Settings, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  isRunning: boolean;
  onExecuteAll: () => void;
  onStop: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onAutoLayout: () => void;
}

export default function Toolbar({
  isRunning,
  onExecuteAll,
  onStop,
  onSave,
  onLoad,
  onExport,
  onImport,
  onClear,
  onZoomIn,
  onZoomOut,
  onFitView,
  onAutoLayout,
}: ToolbarProps) {
  return (
    <div className="h-12 bg-card border-b border-border flex items-center px-4 gap-1">
      {/* Logo & Title */}
      <div className="flex items-center gap-3 pl-4 border-l border-border ml-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-none">DataFlow Pro</h1>
          <p className="text-xs text-muted-foreground">تحليل البيانات البصري</p>
        </div>
      </div>

      <Separator orientation="vertical" className="h-6 mx-2" />

      {/* Execution Controls */}
      <ToolbarButton
        icon={isRunning ? Square : Play}
        label={isRunning ? 'إيقاف' : 'تنفيذ الكل'}
        onClick={isRunning ? onStop : onExecuteAll}
        variant={isRunning ? 'destructive' : 'default'}
        className={cn(!isRunning && 'bg-status-success hover:bg-status-success/80 text-primary-foreground')}
      />

      <Separator orientation="vertical" className="h-6 mx-2" />

      {/* File Operations */}
      <ToolbarButton icon={Save} label="حفظ" onClick={onSave} />
      <ToolbarButton icon={FolderOpen} label="فتح" onClick={onLoad} />
      <ToolbarButton icon={Download} label="تصدير" onClick={onExport} />
      <ToolbarButton icon={Upload} label="استيراد" onClick={onImport} />

      <Separator orientation="vertical" className="h-6 mx-2" />

      {/* View Controls */}
      <ToolbarButton icon={ZoomIn} label="تكبير" onClick={onZoomIn} />
      <ToolbarButton icon={ZoomOut} label="تصغير" onClick={onZoomOut} />
      <ToolbarButton icon={Maximize2} label="ملاءمة" onClick={onFitView} />
      <ToolbarButton icon={LayoutGrid} label="ترتيب تلقائي" onClick={onAutoLayout} />

      <Separator orientation="vertical" className="h-6 mx-2" />

      {/* Clear */}
      <ToolbarButton icon={Trash2} label="مسح الكل" onClick={onClear} variant="ghost" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Help */}
      <ToolbarButton icon={HelpCircle} label="مساعدة" onClick={() => {}} variant="ghost" />
    </div>
  );
}

interface ToolbarButtonProps {
  icon: any;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'ghost' | 'destructive';
  className?: string;
}

function ToolbarButton({ icon: Icon, label, onClick, variant = 'ghost', className }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          onClick={onClick}
          className={cn('h-8 w-8', className)}
        >
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
