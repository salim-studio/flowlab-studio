import { useState } from 'react';
import { 
  Database, Cog, BarChart3, Brain, Activity, Eye,
  ChevronDown, ChevronRight, Search, GripVertical,
  FileSpreadsheet, FileType, Dices, Filter, Columns3,
  CircleSlash, Scale, Merge, Waypoints, FlaskConical,
  Layers, TrendingUp, GitBranch, CircleDot, Trees,
  CalendarRange, TestTube, Table, LineChart, BarChart,
  FileOutput, ScatterChart
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { nodeCategories, getNodesByCategory, NodeDefinition } from '@/data/nodeDefinitions';

const categoryIcons: Record<string, any> = {
  Database, Cog, BarChart3, Brain, Activity, Eye
};

const nodeIcons: Record<string, any> = {
  FileSpreadsheet, FileType, Database, Dices, Filter, Columns3,
  CircleSlash, Scale, Merge, BarChart3, Waypoints, FlaskConical,
  Layers, TrendingUp, GitBranch, CircleDot, Trees, Activity,
  CalendarRange, TestTube, Table, LineChart, BarChart, FileOutput,
  ScatterChart
};

const categoryColors: Record<string, string> = {
  input: 'text-node-input',
  processing: 'text-node-processing',
  analysis: 'text-node-analysis',
  modeling: 'text-node-modeling',
  timeseries: 'text-node-timeseries',
  output: 'text-node-output',
};

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function NodePalette({ onDragStart }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    nodeCategories.map(c => c.id)
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: getNodesByCategory(category.id).filter(node =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.includes(searchQuery)
    ),
  })).filter(category => category.nodes.length > 0);

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">العُقد المتاحة</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن عقدة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-secondary border-border"
            dir="rtl"
          />
        </div>
      </div>

      {/* Node Categories */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCategories.map(category => {
            const CategoryIcon = categoryIcons[category.icon];
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <div key={category.id} className="mb-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md',
                    'hover:bg-secondary/50 transition-colors',
                    'text-sm font-medium'
                  )}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  {CategoryIcon && (
                    <CategoryIcon className={cn('w-4 h-4', categoryColors[category.id])} />
                  )}
                  <span className="flex-1 text-right">{category.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {category.nodes.length}
                  </span>
                </button>

                {/* Category Nodes */}
                {isExpanded && (
                  <div className="mr-4 mt-1 space-y-1">
                    {category.nodes.map(node => (
                      <NodeItem
                        key={node.type}
                        node={node}
                        onDragStart={onDragStart}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

interface NodeItemProps {
  node: NodeDefinition;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

function NodeItem({ node, onDragStart }: NodeItemProps) {
  const IconComponent = nodeIcons[node.icon];
  const colorClass = categoryColors[node.category];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node.type)}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md cursor-grab',
        'bg-secondary/30 hover:bg-secondary transition-colors',
        'border border-transparent hover:border-border',
        'group'
      )}
    >
      <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      {IconComponent && (
        <IconComponent className={cn('w-4 h-4', colorClass)} />
      )}
      <div className="flex-1 min-w-0 text-right">
        <div className="text-sm font-medium truncate">{node.label}</div>
        <div className="text-xs text-muted-foreground truncate">{node.description}</div>
      </div>
    </div>
  );
}
