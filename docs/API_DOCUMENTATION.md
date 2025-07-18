# BeforeAfterUI API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [API Endpoints](#api-endpoints)
   - [Health Check](#health-check)
   - [Projects API](#projects-api)
   - [AI Analysis API](#ai-analysis-api)
   - [AI Models API](#ai-models-api)
   - [Uploads API](#uploads-api)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Usage Examples](#usage-examples)

## Overview

BeforeAfterUI is an AI-powered UI transformation analysis platform that helps developers analyze differences between current and target UI states and generates code to achieve the desired transformations.

### Key Features
- AI-powered image analysis for UI transformation
- Multi-provider AI support (OpenAI, Google, Anthropic)
- Tech stack detection from code files
- Project management with file uploads
- Code generation based on UI differences

## Authentication

Currently, the API does not require authentication. API keys for AI providers should be passed directly in requests or configured via environment variables.

## Base URL

```
Development: http://localhost:3001/api
```

All API endpoints are prefixed with `/api`.

## API Endpoints

### Health Check

#### GET /health
Check the health status of the API service.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "BeforeAfterUI Backend",
  "version": "0.1.0"
}
```

#### GET /health/ping
Simple ping endpoint for basic connectivity testing.

**Response:**
```json
{
  "message": "pong"
}
```

### Projects API

Manage projects for organizing UI transformation analyses.

#### GET /projects
Retrieve all projects with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 10)
- `status` (string, optional): Filter by project status (`active`, `completed`, `archived`)
- `search` (string, optional): Search in project name and description
- `sortBy` (string, optional): Field to sort by
- `sortOrder` (string, optional): Sort order (`asc`, `desc`)

**Response:**
```json
{
  "data": [
    {
      "id": "project_id",
      "name": "My UI Project",
      "description": "Description of the project",
      "techStack": {
        "framework": "React",
        "language": "TypeScript",
        "platform": "web",
        "autoDetected": false,
        "confidence": 0.95
      },
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### GET /projects/:id
Retrieve a specific project by ID.

**Parameters:**
- `id` (string): Project ID

**Response:**
```json
{
  "id": "project_id",
  "name": "My UI Project",
  "description": "Description of the project",
  "techStack": {
    "framework": "React",
    "language": "TypeScript",
    "platform": "web",
    "autoDetected": false,
    "confidence": 0.95
  },
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "My UI Project",
  "description": "Description of the project",
  "techStack": {
    "framework": "React",
    "language": "TypeScript",
    "platform": "web"
  },
  "status": "active"
}
```

**Response:**
```json
{
  "id": "new_project_id",
  "name": "My UI Project",
  "description": "Description of the project",
  "techStack": {
    "framework": "React",
    "language": "TypeScript",
    "platform": "web",
    "autoDetected": false
  },
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /projects/:id
Update an existing project.

**Parameters:**
- `id` (string): Project ID

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "techStack": {
    "framework": "Vue",
    "language": "JavaScript",
    "platform": "web"
  },
  "status": "completed"
}
```

#### DELETE /projects/:id
Delete a project.

**Parameters:**
- `id` (string): Project ID

**Response:** HTTP 204 No Content

### AI Analysis API

Perform AI-powered analysis of UI images and code.

#### POST /ai/analyze
Analyze two images (current and target UI) to identify differences and generate transformation instructions.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `images` (files): Array of exactly 2 image files (current and target UI)
- `projectId` (string, optional): Associated project ID
- `framework` (string, optional): Target framework for analysis
- `aiProvider` (string, optional): AI provider (`openai`, `google`, `anthropic`, `azure`)
- `aiModel` (string, optional): Specific AI model to use
- `apiKey` (string, optional): API key for the AI provider

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -F "images=@current_ui.png" \
  -F "images=@target_ui.png" \
  -F "framework=React" \
  -F "aiProvider=openai"
```

**Response:**
```json
{
  "analysis": {
    "differences": [
      {
        "element": "button",
        "changes": ["color: blue -> red", "padding: 8px -> 12px"],
        "description": "Button color changed from blue to red and padding increased"
      }
    ],
    "summary": "The main changes involve button styling modifications",
    "recommendations": [
      "Update CSS classes for button styling",
      "Consider using CSS variables for consistent theming"
    ]
  },
  "provider": "openai",
  "model": "gpt-4-vision-preview",
  "processingTime": 2.5
}
```

#### POST /ai/detect-stack
Detect technology stack from uploaded code files.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `codeFiles` (files): Array of code files (max 10 files)
- `projectId` (string, optional): Associated project ID

**Response:**
```json
{
  "detectedStack": {
    "framework": "React",
    "language": "TypeScript",
    "platform": "web",
    "confidence": 0.95,
    "autoDetected": true,
    "details": {
      "packageManager": "npm",
      "buildTool": "webpack",
      "additionalLibraries": ["styled-components", "react-router"]
    }
  },
  "analysisDetails": {
    "filesAnalyzed": 5,
    "keyIndicators": [
      "package.json with React dependencies",
      "*.tsx file extensions",
      "import statements for React"
    ]
  }
}
```

#### POST /ai/generate-code
Generate code based on UI analysis results.

**Request Body:**
```json
{
  "framework": "React",
  "description": "Convert button from blue to red with increased padding",
  "targetElement": "button",
  "differences": [
    {
      "element": "button",
      "changes": ["color: blue -> red", "padding: 8px -> 12px"]
    }
  ]
}
```

**Response:**
```json
{
  "generatedCode": {
    "css": ".button { color: red; padding: 12px; }",
    "component": "const Button = () => <button className=\"button\">Click me</button>",
    "explanation": "Updated button styling to use red color and increased padding"
  },
  "framework": "React",
  "files": [
    {
      "filename": "Button.tsx",
      "content": "import React from 'react';\n\nconst Button = () => {\n  return <button className=\"button\">Click me</button>;\n};\n\nexport default Button;"
    },
    {
      "filename": "Button.css",
      "content": ".button {\n  color: red;\n  padding: 12px;\n}"
    }
  ]
}
```

### AI Models API

Manage and test AI provider models.

#### GET /ai/models
Get available AI models for all or specific providers.

**Query Parameters:**
- `provider` (string, optional): Filter by provider (`openai`, `google`, `anthropic`, `azure`)

**Response:**
```json
{
  "providers": {
    "openai": {
      "models": [
        {
          "id": "gpt-4-vision-preview",
          "name": "GPT-4 Vision Preview",
          "capabilities": ["vision", "text"],
          "maxTokens": 4096
        },
        {
          "id": "gpt-4",
          "name": "GPT-4",
          "capabilities": ["text"],
          "maxTokens": 8192
        }
      ]
    },
    "google": {
      "models": [
        {
          "id": "gemini-pro-vision",
          "name": "Gemini Pro Vision",
          "capabilities": ["vision", "text"],
          "maxTokens": 2048
        }
      ]
    }
  }
}
```

#### GET /ai/models/test
Test the availability and functionality of a specific AI model.

**Query Parameters:**
- `provider` (string, required): AI provider
- `model` (string, required): Model ID
- `apiKey` (string, optional): API key to test

**Response:**
```json
{
  "available": true,
  "latency": 1.2,
  "provider": "openai",
  "model": "gpt-4-vision-preview",
  "testResult": {
    "success": true,
    "message": "Model is functioning correctly"
  }
}
```

### Uploads API

Manage file uploads for projects.

#### POST /uploads/image
Upload a single image file.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image` (file): Image file
- `metadata` (object, optional): Additional metadata

**Response:**
```json
{
  "id": "upload_id",
  "filename": "generated_filename.png",
  "originalName": "my_image.png",
  "mimetype": "image/png",
  "size": 1024000,
  "url": "/uploads/images/generated_filename.png",
  "type": "image",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "PNG"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST /uploads/images
Upload multiple image files.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `images` (files): Array of image files (max 10)
- `metadata` (object, optional): Additional metadata

**Response:**
```json
{
  "uploads": [
    {
      "id": "upload_id_1",
      "filename": "generated_filename_1.png",
      "originalName": "image1.png",
      "url": "/uploads/images/generated_filename_1.png",
      "type": "image"
    },
    {
      "id": "upload_id_2",
      "filename": "generated_filename_2.png",
      "originalName": "image2.png",
      "url": "/uploads/images/generated_filename_2.png",
      "type": "image"
    }
  ],
  "totalUploaded": 2
}
```

#### POST /uploads/code
Upload code files for analysis.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `codeFiles` (files): Array of code files (max 20)
- `metadata` (object, optional): Additional metadata

**Response:**
```json
{
  "uploads": [
    {
      "id": "upload_id",
      "filename": "component.tsx",
      "originalName": "Component.tsx",
      "mimetype": "text/plain",
      "size": 2048,
      "url": "/uploads/code/component.tsx",
      "type": "code",
      "language": "typescript"
    }
  ],
  "totalUploaded": 1
}
```

#### GET /uploads/project/:projectId
Get all uploads for a specific project.

**Parameters:**
- `projectId` (string): Project ID

**Response:**
```json
{
  "uploads": [
    {
      "id": "upload_id",
      "filename": "image.png",
      "originalName": "my_image.png",
      "type": "image",
      "url": "/uploads/images/image.png",
      "imageType": "current",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### DELETE /uploads/:id
Delete an uploaded file.

**Parameters:**
- `id` (string): Upload ID

**Response:** HTTP 204 No Content

## Data Models

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  techStack?: TechStack;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

### TechStack
```typescript
interface TechStack {
  framework: string;
  language: string;
  platform: 'web' | 'mobile' | 'desktop';
  autoDetected: boolean;
  confidence?: number;
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
  path: string;
  url: string;
  type: 'image' | 'code';
  projectId: string;
  imageType?: 'current' | 'target';
  language?: string;
  metadata?: ImageMetadata;
  createdAt: Date;
  updatedAt: Date;
}
```

### ImageMetadata
```typescript
interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  format: string;
}
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

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

### Common Error Codes
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

## Usage Examples

### Creating a Complete Workflow

1. **Create a new project:**
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My UI Redesign",
    "description": "Modernizing the login page",
    "techStack": {
      "framework": "React",
      "language": "TypeScript",
      "platform": "web"
    }
  }'
```

2. **Upload current and target UI images:**
```bash
curl -X POST http://localhost:3001/api/uploads/images \
  -F "images=@current_login.png" \
  -F "images=@target_login.png" \
  -F 'metadata={"projectId":"project_id"}'
```

3. **Analyze the differences:**
```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -F "images=@current_login.png" \
  -F "images=@target_login.png" \
  -F "projectId=project_id" \
  -F "framework=React" \
  -F "aiProvider=openai"
```

4. **Generate code based on analysis:**
```bash
curl -X POST http://localhost:3001/api/ai/generate-code \
  -H "Content-Type: application/json" \
  -d '{
    "framework": "React",
    "description": "Update login form styling",
    "differences": [...]
  }'
```

### JavaScript/TypeScript Example

```typescript
// Create a new project
const project = await fetch('http://localhost:3001/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My UI Project',
    techStack: {
      framework: 'React',
      language: 'TypeScript',
      platform: 'web'
    }
  })
}).then(res => res.json());

// Upload images for analysis
const formData = new FormData();
formData.append('images', currentImageFile);
formData.append('images', targetImageFile);
formData.append('projectId', project.id);
formData.append('framework', 'React');

const analysis = await fetch('http://localhost:3001/api/ai/analyze', {
  method: 'POST',
  body: formData
}).then(res => res.json());

console.log('Analysis results:', analysis);
```

## Interactive API Documentation

For interactive API documentation and testing, visit:
```
http://localhost:3001/api/docs
```

This provides a Swagger UI interface where you can explore all endpoints, view request/response schemas, and test API calls directly from your browser.