import type { Workflow } from '../types/workflow';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.lub.marketing/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Default tenant ID - you can make this dynamic later
const DEFAULT_TENANT_ID = 'default-tenant';

// Helper function to get headers
const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    'Authorization': `Bearer ${API_KEY}`,
  };
};

export const workflowsApi = {
  // Get all workflows for a tenant
  async getWorkflows(tenantId: string = DEFAULT_TENANT_ID): Promise<Workflow[]> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch workflows');
    const data = await response.json();
    return data.items || [];
  },

  // Get a specific workflow by ID
  async getWorkflow(workflowId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows/${workflowId}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch workflow');
    return response.json();
  },

  // Get workflow by name
  async getWorkflowByName(name: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows/name/${encodeURIComponent(name)}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch workflow');
    return response.json();
  },

  // Create a new workflow
  async createWorkflow(workflow: Workflow, tenantId: string = DEFAULT_TENANT_ID): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workflow),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create workflow');
    }
    const data = await response.json();
    return data.workflow;
  },

  // Update an existing workflow
  async updateWorkflow(workflowId: string, workflow: Partial<Workflow>, tenantId: string = DEFAULT_TENANT_ID): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows/${workflowId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(workflow),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update workflow');
    }
    return response.json();
  },

  // Activate a workflow
  async activateWorkflow(workflowId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows/${workflowId}/activate`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to activate workflow');
  },

  // Deactivate a workflow
  async deactivateWorkflow(workflowId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows/${workflowId}/deactivate`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to deactivate workflow');
  },

  // Delete a workflow
  async deleteWorkflow(workflowId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows/${workflowId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete workflow');
  },

  // Execute/trigger a workflow
  async triggerWorkflow(workflowId: string, data: any, tenantId: string = DEFAULT_TENANT_ID): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        trigger_data: data,
        metadata: {
          source: 'manual',
          timestamp: new Date().toISOString(),
        },
      }),
    });
    if (!response.ok) throw new Error('Failed to trigger workflow');
    return response.json();
  },

  // Validate a workflow
  async validateWorkflow(workflow: Partial<Workflow>): Promise<{ is_valid: boolean; errors: string[]; warnings: string[] }> {
    const response = await fetch(`${API_BASE_URL}/workflows/validate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workflow),
    });
    if (!response.ok) throw new Error('Failed to validate workflow');
    return response.json();
  },

  // Test a workflow
  async testWorkflow(workflow: Partial<Workflow>, tenantId: string = DEFAULT_TENANT_ID): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}/workflows/test`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workflow),
    });
    if (!response.ok) throw new Error('Failed to test workflow');
    return response.json();
  },

  // Get available node types
  async getNodeTypes(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nodes/types`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch node types');
    return response.json();
  },

  // Get available trigger types
  async getTriggerTypes(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/triggers/types`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch trigger types');
    return response.json();
  },
};
