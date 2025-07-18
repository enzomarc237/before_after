# BeforeAfterUI Documentation

Welcome to the comprehensive documentation for BeforeAfterUI, an AI-powered platform for analyzing UI transformations and generating code to achieve desired changes.

## 📚 Documentation Overview

This documentation covers all aspects of the BeforeAfterUI platform, from API usage to SDK integration and service architecture.

### 🔗 Quick Links

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete REST API reference
- **[SDK Documentation](./SDK_DOCUMENTATION.md)** - TypeScript/JavaScript SDK guide
- **[Services Documentation](./SERVICES_DOCUMENTATION.md)** - Backend services and business logic
- **[Implementation Guide](./implementation-guide.md)** - Platform implementation details

## 🚀 Getting Started

### What is BeforeAfterUI?

BeforeAfterUI is an AI-powered platform that helps developers analyze differences between current and target UI states and generates code to achieve the desired transformations. It supports multiple AI providers and frameworks.

### Key Features

- **🔍 AI-Powered Image Analysis**: Compare current and target UI images to identify differences
- **🤖 Multi-Provider AI Support**: OpenAI, Google Gemini, Anthropic Claude, and Azure
- **📦 Tech Stack Detection**: Automatically detect frameworks, languages, and tools from code
- **⚡ Code Generation**: Generate framework-specific code based on UI analysis
- **📁 Project Management**: Organize UI transformation projects with file uploads
- **🔌 Developer-Friendly**: RESTful API and TypeScript SDK

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend/SDK  │ ──▶│   REST API      │ ──▶│  AI Providers   │
│                 │    │                 │    │                 │
│ • Web Apps      │    │ • Projects      │    │ • OpenAI        │
│ • Mobile Apps   │    │ • AI Analysis   │    │ • Google        │
│ • CLI Tools     │    │ • Uploads       │    │ • Anthropic     │
│ • SDK           │    │ • Health Check  │    │ • Azure         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │                 │
                       │ • Projects      │
                       │ • Uploads       │
                       │ • Metadata      │
                       └─────────────────┘
```

## 📖 Documentation Sections

### 1. API Documentation
**[→ View API Documentation](./API_DOCUMENTATION.md)**

Complete reference for the BeforeAfterUI REST API including:
- All endpoints with request/response examples
- Authentication and configuration
- Data models and schemas
- Error handling and status codes
- Interactive Swagger documentation

**Key Endpoints:**
- `GET /health` - Health check
- `POST /projects` - Create projects
- `POST /ai/analyze` - Analyze UI images
- `POST /uploads/images` - Upload files

### 2. SDK Documentation
**[→ View SDK Documentation](./SDK_DOCUMENTATION.md)**

Comprehensive guide for the TypeScript/JavaScript SDK:
- Installation and setup
- Client classes and methods
- TypeScript interfaces
- Usage examples for React, Node.js, and more
- Error handling and configuration

**Quick SDK Example:**
```typescript
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

const client = new BeforeAfterUIClient({
  baseUrl: 'http://localhost:3001/api',
  aiProvider: 'openai',
  apiKey: 'your-api-key'
});

const analysis = await client.ai.analyzeImages({
  currentImage: currentImageFile,
  targetImage: targetImageFile,
  framework: 'React'
});
```

### 3. Services Documentation
**[→ View Services Documentation](./SERVICES_DOCUMENTATION.md)**

Deep dive into backend services and architecture:
- Core service classes and methods
- AI provider implementations
- Database schemas and models
- Utility functions and error handling
- Configuration and environment setup

**Core Services:**
- `ProjectsService` - Project management
- `AiService` - AI analysis orchestration
- `UploadsService` - File upload handling
- `AiModelsService` - Model management

### 4. Implementation Guide
**[→ View Implementation Guide](./implementation-guide.md)**

Platform implementation details and advanced configuration.

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB 4.4+
- AI Provider API keys (OpenAI, Google, etc.)

### Backend Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd backend
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start the development server:**
```bash
npm run start:dev
```

### Frontend/SDK Setup

1. **Install the SDK:**
```bash
npm install beforeafterui-sdk
```

2. **Initialize the client:**
```typescript
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

const client = new BeforeAfterUIClient({
  baseUrl: 'http://localhost:3001/api'
});
```

## 🌟 Common Use Cases

### 1. UI Redesign Analysis
Analyze differences between current and target UI designs:

```typescript
// Upload and analyze UI images
const analysis = await client.ai.analyzeImages({
  currentImage: currentDesign,
  targetImage: targetDesign,
  framework: 'React'
});

// Generate code based on analysis
const code = await client.ai.generateCode({
  framework: 'React',
  description: 'Update button styling',
  differences: analysis.differences
});
```

### 2. Tech Stack Detection
Detect technology stack from existing code:

```typescript
const detection = await client.ai.detectTechStack([
  { filename: 'package.json', content: packageContent },
  { filename: 'App.tsx', content: appContent }
]);

console.log('Detected:', detection.detectedStack);
```

### 3. Project Management
Organize UI transformation projects:

```typescript
// Create a project
const project = await client.projects.create({
  name: 'Mobile App Redesign',
  techStack: {
    framework: 'React Native',
    language: 'TypeScript',
    platform: 'mobile'
  }
});

// Upload project assets
await client.uploads.uploadImages([...images], {
  projectId: project.id
});
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/beforeafterui

# AI Providers
OPENAI_API_KEY=your_openai_key
GOOGLE_AI_API_KEY=your_google_key
ANTHROPIC_API_KEY=your_anthropic_key

# Server Configuration
PORT=3001
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads
```

### AI Provider Setup

#### OpenAI
```bash
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-... # Optional
```

#### Google AI
```bash
GOOGLE_AI_API_KEY=AIza...
```

#### Anthropic
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

## 📊 API Reference Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/projects` | GET | List projects |
| `/projects` | POST | Create project |
| `/projects/:id` | GET | Get project |
| `/projects/:id` | PUT | Update project |
| `/projects/:id` | DELETE | Delete project |
| `/ai/analyze` | POST | Analyze UI images |
| `/ai/detect-stack` | POST | Detect tech stack |
| `/ai/generate-code` | POST | Generate code |
| `/ai/models` | GET | List AI models |
| `/ai/models/test` | GET | Test AI model |
| `/uploads/image` | POST | Upload single image |
| `/uploads/images` | POST | Upload multiple images |
| `/uploads/code` | POST | Upload code files |
| `/uploads/project/:id` | GET | Get project uploads |
| `/uploads/:id` | DELETE | Delete upload |

## 🔍 Interactive Documentation

Access the interactive Swagger documentation at:
```
http://localhost:3001/api/docs
```

This provides a live interface to explore and test all API endpoints.

## 📝 Data Models

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  techStack?: TechStack;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}
```

### Analysis Result
```typescript
interface AnalysisResult {
  analysis: {
    differences: Difference[];
    summary: string;
    recommendations: string[];
  };
  provider: string;
  model: string;
  processingTime: number;
}
```

### Upload
```typescript
interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  type: 'image' | 'code';
  projectId: string;
  createdAt: string;
}
```

## 🚨 Error Handling

All APIs return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

Common status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Add comprehensive tests
- Update documentation
- Use conventional commit messages
- Ensure code passes linting

## 📞 Support

### Documentation Issues
If you find issues with this documentation:
1. Check existing GitHub issues
2. Create a new issue with the "documentation" label
3. Provide specific details about the problem

### API Issues
For API-related problems:
1. Check the health endpoint: `GET /health`
2. Review error responses for details
3. Consult the troubleshooting section

### SDK Issues
For SDK-related problems:
1. Ensure you're using the latest version
2. Check your configuration
3. Review the error handling documentation

## 📋 Changelog

See [CHANGELOG.md](../CHANGELOG.md) for version history and updates.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

---

**Last Updated:** January 2024  
**Documentation Version:** 1.0.0  
**API Version:** 0.1.0

For the most up-to-date information, always refer to the interactive API documentation at `/api/docs` when running the server.