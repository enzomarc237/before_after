# BeforeAfterUI SDK Documentation

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Client Classes](#client-classes)
   - [BeforeAfterUIClient](#beforeafteruiclient)
   - [ProjectsClient](#projectsclient)
   - [AIAnalysisClient](#aianalysisclient)
   - [UploadsClient](#uploadsclient)
5. [TypeScript Interfaces](#typescript-interfaces)
6. [Usage Examples](#usage-examples)
7. [Error Handling](#error-handling)
8. [Configuration](#configuration)

## Overview

The BeforeAfterUI SDK provides a convenient way to interact with the BeforeAfterUI API from JavaScript/TypeScript applications. It includes full TypeScript support, error handling, and helper methods for common operations.

## Installation

```bash
npm install beforeafterui-sdk
# or
yarn add beforeafterui-sdk
# or
pnpm add beforeafterui-sdk
```

## Quick Start

```typescript
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

// Initialize the client
const client = new BeforeAfterUIClient({
  baseUrl: 'http://localhost:3001/api',
  // Optional: set default AI provider settings
  aiProvider: 'openai',
  apiKey: 'your-openai-api-key'
});

// Create a project
const project = await client.projects.create({
  name: 'My UI Redesign',
  description: 'Modernizing the dashboard',
  techStack: {
    framework: 'React',
    language: 'TypeScript',
    platform: 'web'
  }
});

// Analyze UI differences
const analysis = await client.ai.analyzeImages({
  currentImage: currentImageFile,
  targetImage: targetImageFile,
  projectId: project.id,
  framework: 'React'
});

console.log('Analysis results:', analysis);
```

## Client Classes

### BeforeAfterUIClient

Main client class that provides access to all SDK functionality.

#### Constructor

```typescript
constructor(config: ClientConfig)
```

**Parameters:**
```typescript
interface ClientConfig {
  baseUrl: string;
  timeout?: number; // default: 30000ms
  retries?: number; // default: 3
  aiProvider?: 'openai' | 'google' | 'anthropic' | 'azure';
  apiKey?: string; // Default AI provider API key
  headers?: Record<string, string>; // Additional headers
}
```

**Example:**
```typescript
const client = new BeforeAfterUIClient({
  baseUrl: 'https://api.beforeafterui.com',
  timeout: 60000,
  retries: 3,
  aiProvider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  headers: {
    'User-Agent': 'MyApp/1.0.0'
  }
});
```

#### Properties

- `projects`: ProjectsClient instance
- `ai`: AIAnalysisClient instance
- `uploads`: UploadsClient instance

#### Methods

##### `setApiKey(provider: string, apiKey: string): void`
Set API key for a specific AI provider.

```typescript
client.setApiKey('openai', 'your-openai-key');
client.setApiKey('google', 'your-google-key');
```

##### `getHealth(): Promise<HealthStatus>`
Check API health status.

```typescript
const health = await client.getHealth();
// Returns: { status: 'ok', timestamp: '...', service: '...', version: '...' }
```

---

### ProjectsClient

Handles all project-related operations.

#### Methods

##### `create(data: CreateProjectData): Promise<Project>`
Create a new project.

```typescript
const project = await client.projects.create({
  name: 'E-commerce Redesign',
  description: 'Modernizing the checkout flow',
  techStack: {
    framework: 'Vue',
    language: 'JavaScript',
    platform: 'web'
  },
  status: 'active'
});
```

##### `getAll(options?: GetProjectsOptions): Promise<PaginatedProjects>`
Retrieve all projects with optional filtering.

```typescript
const projects = await client.projects.getAll({
  page: 1,
  limit: 10,
  status: 'active',
  search: 'redesign',
  sortBy: 'updatedAt',
  sortOrder: 'desc'
});

// Returns:
// {
//   data: Project[],
//   total: number,
//   page: number,
//   limit: number
// }
```

##### `getById(id: string): Promise<Project>`
Get a specific project by ID.

```typescript
const project = await client.projects.getById('project_id');
```

##### `update(id: string, data: UpdateProjectData): Promise<Project>`
Update an existing project.

```typescript
const updatedProject = await client.projects.update('project_id', {
  name: 'Updated Project Name',
  status: 'completed'
});
```

##### `delete(id: string): Promise<void>`
Delete a project.

```typescript
await client.projects.delete('project_id');
```

---

### AIAnalysisClient

Handles AI-powered analysis operations.

#### Methods

##### `analyzeImages(options: AnalyzeImagesOptions): Promise<AnalysisResult>`
Analyze UI images to identify differences.

```typescript
interface AnalyzeImagesOptions {
  currentImage: File | Buffer | string; // File, Buffer, or base64 string
  targetImage: File | Buffer | string;
  projectId?: string;
  framework?: string;
  aiProvider?: 'openai' | 'google' | 'anthropic' | 'azure';
  aiModel?: string;
  apiKey?: string; // Override default API key
}

const analysis = await client.ai.analyzeImages({
  currentImage: currentImageFile,
  targetImage: targetImageFile,
  projectId: 'project_id',
  framework: 'React',
  aiProvider: 'openai',
  aiModel: 'gpt-4-vision-preview'
});
```

##### `detectTechStack(codeFiles: CodeFile[]): Promise<TechStackDetection>`
Detect technology stack from code files.

```typescript
interface CodeFile {
  filename: string;
  content: string | Buffer;
}

const detection = await client.ai.detectTechStack([
  { filename: 'package.json', content: packageJsonContent },
  { filename: 'App.tsx', content: appComponentContent },
  { filename: 'styles.css', content: stylesContent }
]);
```

##### `generateCode(options: GenerateCodeOptions): Promise<CodeGeneration>`
Generate code based on analysis results.

```typescript
interface GenerateCodeOptions {
  framework: string;
  description: string;
  targetElement?: string;
  differences?: Difference[];
  aiProvider?: string;
  aiModel?: string;
}

const codeGeneration = await client.ai.generateCode({
  framework: 'React',
  description: 'Update button styling from blue to red',
  differences: analysis.differences
});
```

##### `getAvailableModels(provider?: string): Promise<ModelRegistry>`
Get available AI models.

```typescript
const models = await client.ai.getAvailableModels('openai');
```

##### `testModel(provider: string, model: string, apiKey?: string): Promise<ModelTestResult>`
Test AI model availability.

```typescript
const testResult = await client.ai.testModel('openai', 'gpt-4-vision-preview');
```

---

### UploadsClient

Handles file upload operations.

#### Methods

##### `uploadImage(file: File | Buffer, metadata?: any): Promise<Upload>`
Upload a single image.

```typescript
const upload = await client.uploads.uploadImage(imageFile, {
  projectId: 'project_id',
  imageType: 'current'
});
```

##### `uploadImages(files: (File | Buffer)[], metadata?: any): Promise<MultiUploadResult>`
Upload multiple images.

```typescript
const uploads = await client.uploads.uploadImages([
  currentImageFile,
  targetImageFile
], {
  projectId: 'project_id'
});
```

##### `uploadCodeFiles(files: CodeFile[], metadata?: any): Promise<MultiUploadResult>`
Upload code files for analysis.

```typescript
const uploads = await client.uploads.uploadCodeFiles([
  { filename: 'App.tsx', content: appContent },
  { filename: 'package.json', content: packageContent }
], {
  projectId: 'project_id'
});
```

##### `getProjectUploads(projectId: string): Promise<ProjectUploads>`
Get all uploads for a project.

```typescript
const projectUploads = await client.uploads.getProjectUploads('project_id');
```

##### `deleteUpload(uploadId: string): Promise<void>`
Delete an uploaded file.

```typescript
await client.uploads.deleteUpload('upload_id');
```

## TypeScript Interfaces

### Core Interfaces

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

interface TechStack {
  framework: string;
  language: string;
  platform: 'web' | 'mobile' | 'desktop';
  autoDetected: boolean;
  confidence?: number;
}

interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  type: 'image' | 'code';
  projectId: string;
  imageType?: 'current' | 'target';
  language?: string;
  metadata?: ImageMetadata;
  createdAt: string;
  updatedAt: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  format: string;
}
```

### Analysis Interfaces

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

interface Difference {
  element: string;
  changes: string[];
  description: string;
}

interface TechStackDetection {
  detectedStack: {
    framework: string;
    language: string;
    platform: string;
    confidence: number;
    autoDetected: boolean;
    details: {
      packageManager: string;
      buildTool: string;
      additionalLibraries: string[];
    };
  };
  analysisDetails: {
    filesAnalyzed: number;
    keyIndicators: string[];
  };
}

interface CodeGeneration {
  generatedCode: {
    css: string;
    component: string;
    explanation: string;
  };
  framework: string;
  files: Array<{
    filename: string;
    content: string;
  }>;
}
```

### Utility Interfaces

```typescript
interface PaginatedProjects {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}

interface MultiUploadResult {
  uploads: Upload[];
  totalUploaded: number;
  failed?: Array<{
    filename: string;
    error: string;
  }>;
}

interface ModelRegistry {
  providers: {
    [providerName: string]: {
      models: Array<{
        id: string;
        name: string;
        capabilities: string[];
        maxTokens: number;
        costPer1kTokens?: number;
      }>;
    };
  };
}
```

## Usage Examples

### Complete Workflow Example

```typescript
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

async function completeUIAnalysisWorkflow() {
  // Initialize client
  const client = new BeforeAfterUIClient({
    baseUrl: 'http://localhost:3001/api',
    aiProvider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    // 1. Create a new project
    const project = await client.projects.create({
      name: 'Dashboard Redesign',
      description: 'Modernizing the admin dashboard',
      techStack: {
        framework: 'React',
        language: 'TypeScript',
        platform: 'web'
      }
    });

    console.log('Project created:', project.id);

    // 2. Upload images
    const uploads = await client.uploads.uploadImages([
      currentDashboardImage,
      targetDashboardImage
    ], {
      projectId: project.id
    });

    console.log('Images uploaded:', uploads.totalUploaded);

    // 3. Analyze differences
    const analysis = await client.ai.analyzeImages({
      currentImage: currentDashboardImage,
      targetImage: targetDashboardImage,
      projectId: project.id,
      framework: 'React'
    });

    console.log('Analysis completed:', analysis.analysis.summary);

    // 4. Generate code
    const codeGeneration = await client.ai.generateCode({
      framework: 'React',
      description: 'Update dashboard layout and styling',
      differences: analysis.analysis.differences
    });

    console.log('Code generated:');
    codeGeneration.files.forEach(file => {
      console.log(`${file.filename}:`);
      console.log(file.content);
    });

    // 5. Update project status
    await client.projects.update(project.id, {
      status: 'completed'
    });

  } catch (error) {
    console.error('Workflow failed:', error);
  }
}
```

### React Hook Example

```typescript
import { useState, useCallback } from 'react';
import { BeforeAfterUIClient, Project, AnalysisResult } from 'beforeafterui-sdk';

const client = new BeforeAfterUIClient({
  baseUrl: process.env.REACT_APP_API_URL,
  aiProvider: 'openai',
  apiKey: process.env.REACT_APP_OPENAI_KEY
});

export function useUIAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUI = useCallback(async (
    currentImage: File,
    targetImage: File,
    framework: string
  ): Promise<AnalysisResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await client.ai.analyzeImages({
        currentImage,
        targetImage,
        framework
      });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyzeUI, loading, error };
}

// Usage in component
function UIAnalysisComponent() {
  const { analyzeUI, loading, error } = useUIAnalysis();
  
  const handleAnalysis = async () => {
    const result = await analyzeUI(currentImage, targetImage, 'React');
    if (result) {
      console.log('Analysis result:', result);
    }
  };

  return (
    <div>
      <button onClick={handleAnalysis} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze UI'}
      </button>
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

### Node.js Server Example

```typescript
import express from 'express';
import { BeforeAfterUIClient } from 'beforeafterui-sdk';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const client = new BeforeAfterUIClient({
  baseUrl: 'http://localhost:3001/api',
  aiProvider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/analyze-ui', upload.array('images', 2), async (req, res) => {
  try {
    const [currentImage, targetImage] = req.files as Express.Multer.File[];
    
    if (!currentImage || !targetImage) {
      return res.status(400).json({ error: 'Two images required' });
    }

    const analysis = await client.ai.analyzeImages({
      currentImage: currentImage.buffer,
      targetImage: targetImage.buffer,
      framework: req.body.framework || 'React'
    });

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Error Handling

The SDK provides comprehensive error handling with typed error classes.

### Error Types

```typescript
import { 
  APIError, 
  ValidationError, 
  NetworkError, 
  AuthenticationError 
} from 'beforeafterui-sdk';

try {
  const result = await client.ai.analyzeImages(options);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.details);
  } else if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof APIError) {
    console.error('API error:', error.statusCode, error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Retry Logic

The SDK includes automatic retry logic for transient failures:

```typescript
const client = new BeforeAfterUIClient({
  baseUrl: 'http://localhost:3001/api',
  retries: 3, // Retry failed requests up to 3 times
  timeout: 60000 // 60 second timeout
});
```

### Custom Error Handling

```typescript
client.on('error', (error) => {
  console.error('SDK Error:', error);
  // Send to error tracking service
  errorTracker.captureException(error);
});

client.on('retry', (attempt, error) => {
  console.warn(`Retrying request (attempt ${attempt}):`, error.message);
});
```

## Configuration

### Environment Variables

```bash
# API Configuration
BEFOREAFTERUI_API_URL=http://localhost:3001/api
BEFOREAFTERUI_API_KEY=your_api_key

# AI Provider Keys
OPENAI_API_KEY=your_openai_key
GOOGLE_AI_API_KEY=your_google_key
ANTHROPIC_API_KEY=your_anthropic_key

# SDK Configuration
BEFOREAFTERUI_TIMEOUT=60000
BEFOREAFTERUI_RETRIES=3
BEFOREAFTERUI_LOG_LEVEL=info
```

### Advanced Configuration

```typescript
const client = new BeforeAfterUIClient({
  baseUrl: process.env.BEFOREAFTERUI_API_URL,
  timeout: 60000,
  retries: 3,
  
  // Custom request interceptor
  requestInterceptor: (config) => {
    config.headers['X-Custom-Header'] = 'value';
    return config;
  },
  
  // Custom response interceptor
  responseInterceptor: (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  
  // Custom retry strategy
  retryStrategy: (error, attempt) => {
    // Only retry on network errors
    return error instanceof NetworkError && attempt < 3;
  },
  
  // Logging configuration
  logger: {
    level: 'debug',
    transport: console
  }
});
```

This SDK documentation provides developers with all the tools they need to integrate BeforeAfterUI into their applications, with comprehensive examples, error handling, and configuration options.