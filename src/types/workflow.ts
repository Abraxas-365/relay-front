// Base Types
export type NodeType =
  | 'ACTION'
  | 'AI_AGENT'
  | 'AGENT_ADD_MESSAGE'
  | 'AGENT_CLEANUP_SESSIONS'
  | 'AGENT_CLEAR_MEMORY'
  | 'AGENT_CREATE_SESSION'
  | 'AGENT_DELETE_MESSAGES'
  | 'AGENT_GET_MESSAGES'
  | 'AGENT_MESSAGE_STATS'
  | 'AGENT_UPDATE_SESSION_CONTEXT'
  | 'BUFFER'
  | 'CLOUD_STORAGE'
  | 'CONDITION'
  | 'DELAY'
  | 'EMAIL'
  | 'ERROR_HANDLER'
  | 'FILE_STORAGE'
  | 'FILTER'
  | 'HTTP'
  | 'HTTP_RESPONSE'
  | 'HUBSPOT'
  | 'LOOP'
  | 'MERGE'
  | 'NANO_BANANA'
  | 'SEND_MESSAGE'
  | 'SPEECH_TO_TEXT'
  | 'SQL'
  | 'SUB_WORKFLOW'
  | 'SWITCH'
  | 'TEXT_TO_SPEECH'
  | 'TRANSFORM'
  | 'VALIDATE'
  | 'VIDEO_GENERATION'
  | 'WEBHOOK_WAIT';

export type TriggerType = 'WEBHOOK' | 'CHANNEL_WEBHOOK' | 'SCHEDULE' | 'MANUAL';

export type ChannelType = 'WHATSAPP' | 'INSTAGRAM' | 'TELEGRAM' | 'EMAIL' | 'SMS' | 'WEBCHAT';

export type CredentialType =
  | 'API_KEY'
  | 'BEARER_TOKEN'
  | 'OAUTH2'
  | 'BASIC_AUTH'
  | 'DATABASE'
  | 'SMTP'
  | 'AWS';

export type ToolType = 'HTTP' | 'CALENDLY' | 'WORKFLOW_TRIGGER' | 'INTERNAL';

// Trigger Configurations
export interface WebhookTriggerConfig {
  auth_type: 'none' | 'api_key' | 'platform_auth';
  api_key?: string;
  response_mode?: 'async' | 'sync';
  timeout_seconds?: number;
}

export interface ChannelWebhookTriggerConfig {
  filters: {
    channel_ids: string[];
  };
}

export interface ScheduleTriggerConfig {
  schedule_type: 'cron' | 'interval';
  cron_expression?: string;
  interval_seconds?: number;
  timezone?: string;
}

export type TriggerConfig =
  | WebhookTriggerConfig
  | ChannelWebhookTriggerConfig
  | ScheduleTriggerConfig
  | Record<string, never>;

export interface Trigger {
  type: TriggerType;
  config?: TriggerConfig;
}

// Node Configurations
export interface ActionNodeConfig {
  action: 'console_log' | 'set_context';
  message?: string;
  print_input?: boolean;
  context?: Record<string, any>;
}

export interface AIAgentNodeConfig {
  provider: string;
  model: string;
  system_prompt: string;
  prompt?: string;
  credential_id?: string;
  use_memory?: boolean;
  conversation_id?: string;
  tools?: string[];
  max_auto_iterations?: number;
  temperature?: number;
  max_tokens?: number;
}

export interface HTTPNodeConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  credential_id?: string;
  success_codes?: number[];
}

export interface ConditionNodeConfig {
  condition_type: 'contains' | 'equals' | 'exists' | 'regex';
  field: string;
  value?: any;
  case_insensitive?: boolean;
}

export interface DelayNodeConfig {
  duration?: string;
  duration_ms?: number;
  duration_seconds?: number;
}

export interface TransformNodeConfig {
  mappings: Record<string, string>;
}

export interface FilterNodeConfig {
  items: string;
  condition: string;
  output_mode?: 'matching' | 'non_matching' | 'both' | 'count';
  item_var?: string;
  limit?: number;
}

export interface LoopNodeConfig {
  iterate_over: string;
  item_var: string;
  body_node: string;
  max_iterations?: number;
}

export interface SwitchNodeConfig {
  field: string;
  cases: Record<string, string>;
}

export interface SQLNodeConfig {
  database_engine: 'postgres' | 'mysql' | 'sqlserver' | 'sqlite';
  credential_id: string;
  query: string;
  parameters?: Record<string, any>;
  output_format?: 'array' | 'first' | 'count' | 'values';
}

export interface EmailNodeConfig {
  credential_id: string;
  to: string[];
  from: string;
  subject: string;
  body_type?: 'text' | 'html';
  text_body?: string;
  html_body?: string;
  attachments?: Array<{
    filename: string;
    content_base64: string;
    content_type: string;
  }>;
}

export interface SendMessageNodeConfig {
  channel_id: string;
  recipient_id: string;
  message_type: 'text' | 'template';
  text?: string;
  template_id?: string;
  variables?: Record<string, any> | any[];
}

export type NodeConfig =
  | ActionNodeConfig
  | AIAgentNodeConfig
  | HTTPNodeConfig
  | ConditionNodeConfig
  | DelayNodeConfig
  | TransformNodeConfig
  | FilterNodeConfig
  | LoopNodeConfig
  | SwitchNodeConfig
  | SQLNodeConfig
  | EmailNodeConfig
  | SendMessageNodeConfig
  | Record<string, any>;

export interface WorkflowNode {
  id: string;
  type: NodeType;
  config: NodeConfig;
  next?: string | string[];
  position?: { x: number; y: number };
}

// Workflow
export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  tenant_id?: string;
  trigger: Trigger;
  nodes: Record<string, WorkflowNode>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Channel
export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  provider: string;
  config: Record<string, any>;
  tenant_id: string;
  is_active: boolean;
}

// Credential
export interface Credential {
  id: string;
  name: string;
  type: CredentialType;
  data: Record<string, any>;
  tenant_id: string;
}

// Tool
export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  source: 'agent' | 'context';
  context_path?: string;
}

export interface Tool {
  id: string;
  name: string;
  type: ToolType;
  description: string;
  parameters: ToolParameter[];
  config: Record<string, any>;
  tenant_id: string;
}

// Node Metadata for UI
export interface NodeMetadata {
  type: NodeType;
  label: string;
  description: string;
  category: 'action' | 'agent' | 'integration' | 'logic' | 'data' | 'communication';
  icon: string;
  color: string;
}

// UI State
export interface WorkflowEditorState {
  workflow: Workflow | null;
  selectedNodeId: string | null;
  isConfigPanelOpen: boolean;
  isDirty: boolean;
}
