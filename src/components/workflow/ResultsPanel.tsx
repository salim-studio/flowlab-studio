import { useState } from 'react';
import { X, Table, BarChart3, FileJson, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  result: any;
  nodeLabel: string;
  onClose: () => void;
}

export default function ResultsPanel({ result, nodeLabel, onClose }: ResultsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('table');

  if (!result) return null;

  const isTabular = Array.isArray(result) && result.length > 0 && typeof result[0] === 'object';
  const columns = isTabular ? Object.keys(result[0]) : [];

  return (
    <div 
      className={cn(
        'bg-card border-t border-border transition-all duration-300',
        isExpanded ? 'h-[60vh]' : 'h-64'
      )}
    >
      {/* Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">نتائج: {nodeLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-7">
              <TabsTrigger value="table" className="text-xs px-2 h-5 gap-1">
                <Table className="w-3 h-3" />
                جدول
              </TabsTrigger>
              <TabsTrigger value="json" className="text-xs px-2 h-5 gap-1">
                <FileJson className="w-3 h-3" />
                JSON
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-2.5rem)]">
        {activeTab === 'table' && isTabular ? (
          <ScrollArea className="h-full">
            <UITable>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col} className="text-right">{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.slice(0, 100).map((row: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="text-center text-muted-foreground">{i + 1}</TableCell>
                    {columns.map((col) => (
                      <TableCell key={col} className="text-right font-mono text-xs">
                        {formatValue(row[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </UITable>
            {result.length > 100 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                عرض 100 من {result.length} صف
              </div>
            )}
          </ScrollArea>
        ) : activeTab === 'table' && !isTabular ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            لا يمكن عرض البيانات كجدول
          </div>
        ) : (
          <ScrollArea className="h-full">
            <pre className="p-4 font-mono text-xs" dir="ltr">
              {JSON.stringify(result, null, 2)}
            </pre>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(4);
  }
  if (typeof value === 'boolean') return value ? '✓' : '✗';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
