# Relay Workflow Builder

A powerful visual workflow builder for creating automation workflows with triggers, nodes, and integrations.

## Features

- 🎨 **Visual Workflow Editor** - Drag-and-drop interface powered by React Flow
- 🔌 **40+ Node Types** - Including AI agents, HTTP requests, conditions, loops, transformations, and more
- ⚡ **Multiple Trigger Types** - Webhook, Schedule, Channel Webhook, and Manual triggers
- 🎯 **Node Categories**:
  - **Action** - Console log, set context, delays
  - **Agent** - AI agents with memory and tool support
  - **Integration** - HTTP, Email, SMS, Cloud Storage, HubSpot, etc.
  - **Logic** - Conditions, switches, loops, error handlers
  - **Data** - Transform, filter, merge, validate, SQL
  - **Communication** - Send messages through various channels

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Flow** - Visual workflow editor
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Input, etc.)
│   ├── workflow/        # Workflow-specific components
│   │   ├── WorkflowCanvas.tsx    # Main canvas with React Flow
│   │   ├── NodePalette.tsx       # Node library sidebar
│   │   ├── NodeConfigPanel.tsx   # Node configuration panel
│   │   ├── TriggerConfig.tsx     # Trigger configuration
│   │   └── Toolbar.tsx           # Top toolbar
│   └── nodes/           # Custom node components
│       ├── TriggerNode.tsx
│       └── WorkflowNode.tsx
├── stores/              # Zustand stores
│   └── workflowStore.ts
├── types/               # TypeScript type definitions
│   └── workflow.ts
├── lib/                 # Utilities and helpers
│   └── utils.ts
├── api/                 # API integration
│   └── workflows.ts
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Usage

### Creating a Workflow

1. Click "New Workflow" in the toolbar
2. Enter a workflow name and select a trigger type
3. Click "Create"

### Adding Nodes

1. Browse the Node Library on the left sidebar
2. Click on any node to add it to the canvas
3. Drag nodes to position them
4. Connect nodes by dragging from the output handle (right) to the input handle (left) of another node

### Configuring Nodes

1. Click on any node to select it
2. The configuration panel will open on the right
3. Fill in the required fields based on the node type
4. Click "Save Changes"

### Configuring Triggers

1. Click the settings icon next to the workflow name
2. Configure trigger-specific settings (auth, schedule, etc.)
3. Click "Save Trigger Configuration"

### Saving Workflows

- The "Save" button in the canvas will be enabled when you make changes
- Click "Save" to persist your workflow (requires backend API)

## Node Types

### Action Nodes
- **Action** - Console log, set context
- **Delay** - Pause workflow execution

### Agent Nodes
- **AI Agent** - Execute conversational AI with tools and memory
- **Agent: Create Session** - Create conversation sessions
- **Agent: Add Message** - Add messages to sessions
- **Agent: Get Messages** - Retrieve conversation history
- And more...

### Integration Nodes
- **HTTP Request** - Make API calls
- **Email** - Send emails
- **Cloud Storage** - GCS, S3, Azure
- **File Storage** - SharePoint, Google Drive
- **HubSpot** - CRM integration
- **Speech-to-Text** / **Text-to-Speech**
- **Video Generation** / **Image Generation**

### Logic Nodes
- **Condition** - Conditional branching
- **Switch** - Multi-way branching
- **Loop** - Iterate over arrays
- **Error Handler** - Catch and handle errors
- **Merge** - Combine data from multiple nodes
- **Sub-Workflow** - Execute another workflow

### Data Nodes
- **Transform** - Remap and reshape data
- **Filter** - Filter arrays
- **Validate** - Validate data schemas
- **SQL** - Execute database queries
- **Buffer** - Collect and batch messages

### Communication Nodes
- **Send Message** - Send through configured channels
- **Webhook Wait** - Pause and wait for webhook

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## API Integration

The app includes API integration in `src/api/workflows.ts` with the following methods:

- `getWorkflows(tenantId)` - Get all workflows
- `getWorkflow(workflowId)` - Get specific workflow
- `createWorkflow(workflow)` - Create new workflow
- `updateWorkflow(workflowId, workflow)` - Update workflow
- `deleteWorkflow(workflowId)` - Delete workflow
- `triggerWorkflow(workflowId, data)` - Trigger workflow execution

## Development

### Adding New Node Types

1. Add the node type to `src/types/workflow.ts`
2. Add node metadata to `src/lib/utils.ts`
3. Add node-specific configuration fields to `src/components/workflow/NodeConfigPanel.tsx`

### Customizing Styles

The app uses Tailwind CSS with a custom color scheme defined in `src/index.css`. Modify the CSS variables to change the theme.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
