import { useState } from 'react';
import { nodesByCategory } from '../../lib/utils';
import type { NodeType } from '../../types/workflow';
import { useWorkflowStore } from '../../stores/workflowStore';
import * as Icons from 'lucide-react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Search } from 'lucide-react';

export const NodePalette = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { addNode } = useWorkflowStore();

  const handleNodeClick = (nodeType: NodeType) => {
    // Add node at a default position (user can move it later)
    const position = {
      x: Math.random() * 300 + 250,
      y: Math.random() * 300 + 100,
    };
    addNode(nodeType, position);
  };

  const filteredCategories = Object.entries(nodesByCategory).reduce(
    (acc, [category, nodes]) => {
      const filtered = nodes.filter(
        (node) =>
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, typeof nodesByCategory[string]>
  );

  const categoryColors: Record<string, string> = {
    action: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    agent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    integration: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    logic: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    data: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    communication: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  };

  return (
    <div className="w-80 border-r border-border bg-background overflow-y-auto">
      <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
        <h2 className="text-lg font-semibold mb-3">Node Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(filteredCategories).map(([category, nodes]) => (
          <div key={category}>
            <div
              className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded inline-block mb-2 ${
                categoryColors[category] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </div>
            <div className="space-y-2">
              {nodes.map((node) => {
                const IconComponent = (Icons as any)[node.icon] || Icons.Box;
                return (
                  <Card
                    key={node.type}
                    className="p-3 cursor-pointer hover:border-primary hover:shadow-md transition-all"
                    onClick={() => handleNodeClick(node.type)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded flex-shrink-0"
                        style={{
                          backgroundColor: `${node.color}20`,
                          color: node.color,
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{node.label}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {node.description}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
