import type { Workflow } from '../types/workflow';

// API base URL - update this with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const workflowsApi = {
  // Get all workflows for a tenant
  async getWorkflows(tenantId: string): Promise<Workflow[]> {
    const response = await fetch(`${API_BASE_URL}/workflows?tenant_id=${tenantId}`);
    if (!response.ok) throw new Error('Failed to fetch workflows');
    return response.json();
  },

  // Get a specific workflow by ID
  async getWorkflow(workflowId: string): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}`);
    if (!response.ok) throw new Error('Failed to fetch workflow');
    return response.json();
  },

  // Create a new workflow
  async createWorkflow(workflow: Workflow): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    });
    if (!response.ok) throw new Error('Failed to create workflow');
    return response.json();
  },

  // Update an existing workflow
  async updateWorkflow(workflowId: string, workflow: Workflow): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    });
    if (!response.ok) throw new Error('Failed to update workflow');
    return response.json();
  },

  // Delete a workflow
  async deleteWorkflow(workflowId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete workflow');
  },

  // Test/trigger a workflow
  async triggerWorkflow(workflowId: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to trigger workflow');
    return response.json();
  },
};
