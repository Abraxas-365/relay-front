import { useState, useEffect } from 'react';
import { useWorkflowStore } from '../../stores/workflowStore';
import { X, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Trigger, TriggerType } from '../../types/workflow';

export const TriggerConfig = () => {
  const { workflow, updateTrigger, closeTriggerConfig, isTriggerConfigOpen } = useWorkflowStore();

  const [triggerType, setTriggerType] = useState(workflow?.trigger.type || 'WEBHOOK');
  const [config, setConfig] = useState<any>(workflow?.trigger.config || {});

  useEffect(() => {
    if (workflow?.trigger) {
      setTriggerType(workflow.trigger.type);
      setConfig(workflow.trigger.config || {});
    }
  }, [workflow?.trigger]);

  if (!isTriggerConfigOpen) {
    return null;
  }

  const handleSave = () => {
    const updatedTrigger: Trigger = {
      type: triggerType as any,
      config,
    };
    updateTrigger(updatedTrigger);
    closeTriggerConfig();
  };

  const updateConfigField = (field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderTriggerConfig = () => {
    switch (triggerType) {
      case 'WEBHOOK':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="auth_type">Authentication Type</Label>
              <select
                id="auth_type"
                value={config.auth_type || 'none'}
                onChange={(e) => updateConfigField('auth_type', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="none">None</option>
                <option value="api_key">API Key</option>
                <option value="platform_auth">Platform Auth</option>
              </select>
            </div>

            {config.auth_type === 'api_key' && (
              <div className="space-y-2">
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={config.api_key || ''}
                  onChange={(e) => updateConfigField('api_key', e.target.value)}
                  placeholder="Enter API key"
                />
                <p className="text-xs text-muted-foreground">
                  Clients must send this key in the X-API-Key header or as a Bearer token
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="response_mode">Response Mode</Label>
              <select
                id="response_mode"
                value={config.response_mode || 'async'}
                onChange={(e) => updateConfigField('response_mode', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="async">Async (202 Accepted)</option>
                <option value="sync">Sync (Wait for completion)</option>
              </select>
            </div>

            {config.response_mode === 'sync' && (
              <div className="space-y-2">
                <Label htmlFor="timeout_seconds">Timeout (seconds)</Label>
                <Input
                  id="timeout_seconds"
                  type="number"
                  value={config.timeout_seconds || 30}
                  onChange={(e) => updateConfigField('timeout_seconds', parseInt(e.target.value))}
                  placeholder="30"
                />
              </div>
            )}
          </>
        );

      case 'SCHEDULE':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="schedule_type">Schedule Type</Label>
              <select
                id="schedule_type"
                value={config.schedule_type || 'cron'}
                onChange={(e) => updateConfigField('schedule_type', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="cron">Cron Expression</option>
                <option value="interval">Interval</option>
              </select>
            </div>

            {config.schedule_type === 'cron' && (
              <div className="space-y-2">
                <Label htmlFor="cron_expression">Cron Expression</Label>
                <Input
                  id="cron_expression"
                  value={config.cron_expression || ''}
                  onChange={(e) => updateConfigField('cron_expression', e.target.value)}
                  placeholder="0 9 * * MON"
                />
                <p className="text-xs text-muted-foreground">
                  Example: "0 9 * * MON" = Every Monday at 9 AM
                </p>
              </div>
            )}

            {config.schedule_type === 'interval' && (
              <div className="space-y-2">
                <Label htmlFor="interval_seconds">Interval (seconds)</Label>
                <Input
                  id="interval_seconds"
                  type="number"
                  value={config.interval_seconds || ''}
                  onChange={(e) => updateConfigField('interval_seconds', parseInt(e.target.value))}
                  placeholder="3600"
                />
                <p className="text-xs text-muted-foreground">
                  Number of seconds between executions
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={config.timezone || ''}
                onChange={(e) => updateConfigField('timezone', e.target.value)}
                placeholder="America/New_York"
              />
            </div>
          </>
        );

      case 'CHANNEL_WEBHOOK':
        return (
          <div className="space-y-2">
            <Label htmlFor="channel_ids">Channel IDs (comma-separated)</Label>
            <Textarea
              id="channel_ids"
              value={
                config.filters?.channel_ids ? config.filters.channel_ids.join(', ') : ''
              }
              onChange={(e) =>
                updateConfigField('filters', {
                  channel_ids: e.target.value.split(',').map((id) => id.trim()),
                })
              }
              placeholder="channel-1, channel-2"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              The workflow will only trigger for these channel IDs
            </p>
          </div>
        );

      case 'MANUAL':
        return (
          <div className="text-sm text-muted-foreground">
            This workflow is triggered manually via API call. No additional configuration is
            required.
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-96 border-l border-border bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Trigger Configuration</h3>
              <p className="text-xs text-muted-foreground">Configure how the workflow starts</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={closeTriggerConfig}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Trigger Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trigger_type">Type</Label>
              <select
                id="trigger_type"
                value={triggerType}
                onChange={(e) => {
                  setTriggerType(e.target.value as TriggerType);
                  setConfig({});
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="WEBHOOK">Webhook</option>
                <option value="CHANNEL_WEBHOOK">Channel Webhook</option>
                <option value="SCHEDULE">Schedule</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>

            {renderTriggerConfig()}
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          Save Trigger Configuration
        </Button>
      </div>
    </div>
  );
};
