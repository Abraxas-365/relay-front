import { useState, useEffect } from 'react';
import { useWorkflowStore } from '../../stores/workflowStore';
import { nodeMetadata } from '../../lib/utils';
import { X, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import * as Icons from 'lucide-react';

export const NodeConfigPanel = () => {
  const { selectedNodeId, workflow, updateNode, deleteNode, closeConfigPanel } =
    useWorkflowStore();

  const [config, setConfig] = useState<any>({});

  const selectedNode = selectedNodeId && workflow?.nodes[selectedNodeId];
  const metadata = selectedNode ? nodeMetadata[selectedNode.type] : null;

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.config || {});
    }
  }, [selectedNode]);

  if (!selectedNodeId || !selectedNode || !metadata) {
    return null;
  }

  const IconComponent = (Icons as any)[metadata.icon] || Icons.Box;

  const handleSave = () => {
    updateNode(selectedNodeId, config);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this node?')) {
      deleteNode(selectedNodeId);
    }
  };

  const updateConfigField = (field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Render different configuration fields based on node type
  const renderConfigFields = () => {
    switch (selectedNode.type) {
      case 'HTTP':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <select
                id="method"
                value={config.method || 'GET'}
                onChange={(e) => updateConfigField('method', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={config.url || ''}
                onChange={(e) => updateConfigField('url', e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headers">Headers (JSON)</Label>
              <Textarea
                id="headers"
                value={config.headers ? JSON.stringify(config.headers, null, 2) : '{}'}
                onChange={(e) => {
                  try {
                    updateConfigField('headers', JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='{"Content-Type": "application/json"}'
                rows={4}
              />
            </div>

            {(config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') && (
              <div className="space-y-2">
                <Label htmlFor="body">Body (JSON)</Label>
                <Textarea
                  id="body"
                  value={config.body ? JSON.stringify(config.body, null, 2) : '{}'}
                  onChange={(e) => {
                    try {
                      updateConfigField('body', JSON.parse(e.target.value));
                    } catch (err) {
                      // Invalid JSON, don't update
                    }
                  }}
                  placeholder='{"key": "value"}'
                  rows={6}
                />
              </div>
            )}
          </>
        );

      case 'CONDITION':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="condition_type">Condition Type</Label>
              <select
                id="condition_type"
                value={config.condition_type || 'equals'}
                onChange={(e) => updateConfigField('condition_type', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="exists">Exists</option>
                <option value="regex">Regex</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">Field Path</Label>
              <Input
                id="field"
                value={config.field || ''}
                onChange={(e) => updateConfigField('field', e.target.value)}
                placeholder="trigger.body.status"
              />
            </div>

            {(config.condition_type === 'equals' || config.condition_type === 'contains') && (
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={config.value || ''}
                  onChange={(e) => updateConfigField('value', e.target.value)}
                  placeholder="expected value"
                />
              </div>
            )}
          </>
        );

      case 'TRANSFORM':
        return (
          <div className="space-y-2">
            <Label htmlFor="mappings">Mappings (JSON)</Label>
            <Textarea
              id="mappings"
              value={config.mappings ? JSON.stringify(config.mappings, null, 2) : '{}'}
              onChange={(e) => {
                try {
                  updateConfigField('mappings', JSON.parse(e.target.value));
                } catch (err) {
                  // Invalid JSON
                }
              }}
              placeholder='{"newField": "trigger.body.oldField"}'
              rows={10}
            />
            <p className="text-xs text-muted-foreground">
              Map new field names to CEL expressions
            </p>
          </div>
        );

      case 'AI_AGENT':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={config.provider || 'openai'}
                onChange={(e) => updateConfigField('provider', e.target.value)}
                placeholder="openai"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={config.model || 'gpt-4'}
                onChange={(e) => updateConfigField('model', e.target.value)}
                placeholder="gpt-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="system_prompt">System Prompt</Label>
              <Textarea
                id="system_prompt"
                value={config.system_prompt || ''}
                onChange={(e) => updateConfigField('system_prompt', e.target.value)}
                placeholder="You are a helpful assistant..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">User Prompt</Label>
              <Textarea
                id="prompt"
                value={config.prompt || ''}
                onChange={(e) => updateConfigField('prompt', e.target.value)}
                placeholder="{{trigger.body.message}}"
                rows={4}
              />
            </div>
          </>
        );

      case 'DELAY':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={config.duration || ''}
                onChange={(e) => updateConfigField('duration', e.target.value)}
                placeholder="10s, 5m, 1h"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Examples: 10s (10 seconds), 5m (5 minutes), 1h (1 hour)
            </p>
          </>
        );

      case 'EMAIL':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                type="email"
                value={config.from || ''}
                onChange={(e) => updateConfigField('from', e.target.value)}
                placeholder="sender@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To (comma-separated)</Label>
              <Input
                id="to"
                value={Array.isArray(config.to) ? config.to.join(', ') : ''}
                onChange={(e) =>
                  updateConfigField(
                    'to',
                    e.target.value.split(',').map((email) => email.trim())
                  )
                }
                placeholder="recipient@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={config.subject || ''}
                onChange={(e) => updateConfigField('subject', e.target.value)}
                placeholder="Email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_type">Body Type</Label>
              <select
                id="body_type"
                value={config.body_type || 'text'}
                onChange={(e) => updateConfigField('body_type', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="text">Plain Text</option>
                <option value="html">HTML</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text_body">Body</Label>
              <Textarea
                id="text_body"
                value={config.text_body || config.html_body || ''}
                onChange={(e) => {
                  const field = config.body_type === 'html' ? 'html_body' : 'text_body';
                  updateConfigField(field, e.target.value);
                }}
                placeholder="Email content"
                rows={8}
              />
            </div>
          </>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="config">Configuration (JSON)</Label>
            <Textarea
              id="config"
              value={JSON.stringify(config, null, 2)}
              onChange={(e) => {
                try {
                  setConfig(JSON.parse(e.target.value));
                } catch (err) {
                  // Invalid JSON
                }
              }}
              rows={15}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Edit the configuration as JSON. See documentation for available fields.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-96 border-l border-border bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded"
              style={{
                backgroundColor: `${metadata.color}20`,
                color: metadata.color,
              }}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">{metadata.label}</h3>
              <p className="text-xs text-muted-foreground">{metadata.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={closeConfigPanel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Node Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">{renderConfigFields()}</CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
