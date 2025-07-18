# Backend Services Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Services](#core-services)
   - [ProjectsService](#projectsservice)
   - [AiService](#aiservice)
   - [AiModelsService](#aimodelsservice)
   - [UploadsService](#uploadsservice)
3. [AI Providers](#ai-providers)
   - [OpenAI Provider](#openai-provider)
   - [Google Provider](#google-provider)
   - [Anthropic Provider](#anthropic-provider)
4. [Database Schemas](#database-schemas)
5. [Utility Functions](#utility-functions)
6. [Error Handling](#error-handling)

## Overview

The backend services layer implements the core business logic for the BeforeAfterUI application. The architecture follows NestJS patterns with dependency injection, modular design, and separation of concerns.

## Core Services

### ProjectsService

**Location:** `backend/src/modules/projects/projects.service.ts`

Manages project lifecycle operations including creation, retrieval, updates, and deletion.

#### Methods

##### `findAll(query: any): Promise<PaginatedResponse<Project>>`
Retrieves all projects with support for filtering, pagination, and sorting.

**Parameters:**
- `query.page` (number): Page number (default: 1)
- `query.limit` (number): Items per page (default: 10)
- `query.status` (string): Filter by project status
- `query.search` (string): Search in name and description
- `query.sortBy` (string): Field to sort by
- `query.sortOrder` (string): Sort direction ('asc' or 'desc')

**Returns:**
```typescript
{
  data: Project[];
  total: number;
  page: number;
  limit: number;
}
```

**Example Usage:**
```typescript
const projectsService = new ProjectsService(projectModel);
const result = await projectsService.findAll({
  page: 1,
  limit: 10,
  status: 'active',
  search: 'UI redesign'
});
```

##### `findOne(id: string): Promise<Project>`
Retrieves a single project by ID.

**Parameters:**
- `id` (string): Project ID

**Returns:** Project object or throws NotFoundException

**Example Usage:**
```typescript
const project = await projectsService.findOne('project_id_123');
```

##### `create(createProjectDto: CreateProjectDto): Promise<Project>`
Creates a new project.

**Parameters:**
- `createProjectDto`: Project creation data

**Returns:** Created project object

**Example Usage:**
```typescript
const newProject = await projectsService.create({
  name: 'My New Project',
  description: 'Project description',
  techStack: {
    framework: 'React',
    language: 'TypeScript',
    platform: 'web'
  }
});
```

##### `update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project>`
Updates an existing project.

**Parameters:**
- `id` (string): Project ID
- `updateProjectDto`: Updated project data

**Returns:** Updated project object

##### `remove(id: string): Promise<void>`
Deletes a project by ID.

**Parameters:**
- `id` (string): Project ID

---

### AiService

**Location:** `backend/src/modules/ai/ai.service.ts`

Orchestrates AI-powered analysis operations including image analysis, tech stack detection, and code generation.

#### Methods

##### `analyzeImages(files: Express.Multer.File[], analyzeDto: AnalyzeImagesDto): Promise<AnalysisResult>`
Analyzes two UI images to identify differences and transformation requirements.

**Parameters:**
- `files`: Array of exactly 2 image files (current and target UI)
- `analyzeDto`: Analysis configuration including AI provider and model preferences

**Returns:**
```typescript
{
  analysis: {
    differences: Array<{
      element: string;
      changes: string[];
      description: string;
    }>;
    summary: string;
    recommendations: string[];
  };
  provider: string;
  model: string;
  processingTime: number;
}
```

**Example Usage:**
```typescript
const aiService = new AiService(openaiProvider, googleProvider, anthropicProvider);
const result = await aiService.analyzeImages(
  [currentImageFile, targetImageFile],
  {
    framework: 'React',
    aiProvider: 'openai',
    aiModel: 'gpt-4-vision-preview'
  }
);
```

##### `detectTechStack(files: Express.Multer.File[]): Promise<TechStackDetectionResult>`
Analyzes code files to detect the technology stack and project structure.

**Parameters:**
- `files`: Array of code files (max 10 files)

**Returns:**
```typescript
{
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
```

##### `generateCode(generateCodeDto: GenerateCodeDto): Promise<CodeGenerationResult>`
Generates code based on UI analysis results and specified framework.

**Parameters:**
- `generateCodeDto`: Code generation parameters including framework, description, and differences

**Returns:**
```typescript
{
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

---

### AiModelsService

**Location:** `backend/src/modules/ai/ai-models.service.ts`

Manages AI model availability, configuration, and testing across different providers.

#### Methods

##### `getAvailableModels(provider?: string): Promise<ModelRegistry>`
Retrieves available AI models for all or specific providers.

**Parameters:**
- `provider` (optional): Filter by specific provider

**Returns:**
```typescript
{
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

##### `testModelAvailability(provider: string, model: string, apiKey?: string): Promise<ModelTestResult>`
Tests the availability and functionality of a specific AI model.

**Parameters:**
- `provider`: AI provider name
- `model`: Model ID
- `apiKey` (optional): API key for testing

**Returns:**
```typescript
{
  available: boolean;
  latency: number;
  provider: string;
  model: string;
  testResult: {
    success: boolean;
    message: string;
    error?: string;
  };
}
```

---

### UploadsService

**Location:** `backend/src/modules/uploads/uploads.service.ts`

Handles file upload operations including image processing, metadata extraction, and file management.

#### Methods

##### `uploadImage(file: Express.Multer.File, metadata: any): Promise<Upload>`
Uploads and processes a single image file.

**Parameters:**
- `file`: Image file to upload
- `metadata`: Additional metadata for the upload

**Returns:** Upload object with processed image metadata

##### `uploadImages(files: Express.Multer.File[], metadata: any): Promise<MultiUploadResult>`
Uploads and processes multiple image files.

**Parameters:**
- `files`: Array of image files (max 10)
- `metadata`: Additional metadata for the uploads

**Returns:**
```typescript
{
  uploads: Upload[];
  totalUploaded: number;
  failed?: Array<{
    filename: string;
    error: string;
  }>;
}
```

##### `uploadCodeFiles(files: Express.Multer.File[], metadata: any): Promise<MultiUploadResult>`
Uploads code files for analysis.

**Parameters:**
- `files`: Array of code files (max 20)
- `metadata`: Additional metadata

##### `getProjectUploads(projectId: string): Promise<ProjectUploadsResult>`
Retrieves all uploads associated with a specific project.

**Parameters:**
- `projectId`: Project ID

**Returns:**
```typescript
{
  uploads: Upload[];
  total: number;
  byType: {
    images: Upload[];
    code: Upload[];
  };
}
```

##### `deleteUpload(id: string): Promise<void>`
Deletes an uploaded file and its associated data.

**Parameters:**
- `id`: Upload ID

---

## AI Providers

### OpenAI Provider

**Location:** `backend/src/modules/ai/providers/openai.provider.ts`

Implements OpenAI GPT-4 Vision and text models for image analysis and code generation.

#### Key Methods

##### `analyzeImages(currentImage: Buffer, targetImage: Buffer, framework?: string, model?: string, apiKey?: string): Promise<AnalysisResult>`
Analyzes UI images using OpenAI's vision models.

**Features:**
- Supports GPT-4 Vision Preview and GPT-4V models
- Optimized prompts for UI transformation analysis
- Automatic image encoding and compression
- Error handling and retry logic

##### `generateCode(prompt: string, framework: string, model?: string): Promise<CodeResult>`
Generates code using OpenAI's text models.

**Features:**
- Framework-specific code generation
- Structured output parsing
- Token usage tracking
- Rate limiting handling

#### Configuration

```typescript
// Environment variables
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORG_ID=your_organization_id (optional)

// Available models
const OPENAI_MODELS = {
  'gpt-4-vision-preview': {
    capabilities: ['vision', 'text'],
    maxTokens: 4096,
    costPer1kTokens: 0.01
  },
  'gpt-4': {
    capabilities: ['text'],
    maxTokens: 8192,
    costPer1kTokens: 0.03
  }
};
```

---

### Google Provider

**Location:** `backend/src/modules/ai/providers/google.provider.ts`

Implements Google Gemini models for multi-modal AI analysis.

#### Key Methods

##### `analyzeImages(currentImage: Buffer, targetImage: Buffer, framework?: string, model?: string, apiKey?: string): Promise<AnalysisResult>`
Analyzes UI images using Google's Gemini Pro Vision.

**Features:**
- Gemini Pro Vision model integration
- Advanced image understanding capabilities
- Optimized for UI element detection
- Batch processing support

#### Configuration

```typescript
// Environment variables
GOOGLE_AI_API_KEY=your_google_ai_api_key

// Available models
const GOOGLE_MODELS = {
  'gemini-pro-vision': {
    capabilities: ['vision', 'text'],
    maxTokens: 2048,
    costPer1kTokens: 0.00025
  },
  'gemini-pro': {
    capabilities: ['text'],
    maxTokens: 4096,
    costPer1kTokens: 0.0005
  }
};
```

---

### Anthropic Provider

**Location:** `backend/src/modules/ai/providers/anthropic.provider.ts`

Implements Anthropic Claude models for AI analysis and code generation.

#### Key Methods

##### `analyzeImages(currentImage: Buffer, targetImage: Buffer, framework?: string, model?: string, apiKey?: string): Promise<AnalysisResult>`
Analyzes UI images using Claude's vision capabilities.

**Features:**
- Claude-3 Vision model support
- High-quality reasoning for UI transformations
- Detailed explanation generation
- Ethical AI considerations

#### Configuration

```typescript
// Environment variables
ANTHROPIC_API_KEY=your_anthropic_api_key

// Available models
const ANTHROPIC_MODELS = {
  'claude-3-opus-20240229': {
    capabilities: ['vision', 'text'],
    maxTokens: 4096,
    costPer1kTokens: 0.015
  },
  'claude-3-sonnet-20240229': {
    capabilities: ['vision', 'text'],
    maxTokens: 4096,
    costPer1kTokens: 0.003
  }
};
```

---

## Database Schemas

### Project Schema

**Location:** `backend/src/schemas/project.schema.ts`

```typescript
@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: TechStackSchema })
  techStack?: TechStack;

  @Prop({ default: 'active', enum: ['active', 'completed', 'archived'] })
  status: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}
```

#### TechStack Sub-Schema

```typescript
@Schema()
export class TechStack {
  @Prop({ required: true })
  framework: string;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true, enum: ['web', 'mobile', 'desktop'] })
  platform: string;

  @Prop({ default: false })
  autoDetected: boolean;

  @Prop()
  confidence?: number;
}
```

### Upload Schema

**Location:** `backend/src/schemas/upload.schema.ts`

```typescript
@Schema({ timestamps: true })
export class Upload {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ['image', 'code'] })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ enum: ['current', 'target'] })
  imageType?: string;

  @Prop()
  language?: string;

  @Prop({ type: ImageMetadataSchema })
  metadata?: ImageMetadata;
}
```

#### ImageMetadata Sub-Schema

```typescript
@Schema()
export class ImageMetadata {
  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  format: string;
}
```

---

## Utility Functions

### Image Processing

**Location:** Various utility files

#### `processImageMetadata(buffer: Buffer): Promise<ImageMetadata>`
Extracts metadata from image files including dimensions, format, and file size.

#### `compressImage(buffer: Buffer, options: CompressionOptions): Promise<Buffer>`
Compresses images for optimal processing while maintaining quality.

#### `validateImageFormat(mimetype: string): boolean`
Validates that uploaded files are supported image formats.

### File Management

#### `generateUniqueFilename(originalName: string): string`
Generates unique filenames to prevent conflicts.

#### `sanitizeFilename(filename: string): string`
Sanitizes filenames to ensure filesystem compatibility.

#### `getFileExtension(filename: string): string`
Extracts file extensions for processing logic.

### Tech Stack Detection

#### `analyzePackageJson(content: string): TechStackInfo`
Analyzes package.json files to determine framework and dependencies.

#### `detectLanguageFromExtension(filename: string): string`
Determines programming language from file extensions.

#### `extractImportStatements(content: string, language: string): string[]`
Extracts import/require statements to identify used libraries.

---

## Error Handling

### Custom Exceptions

#### `ProjectNotFoundException`
Thrown when a requested project cannot be found.

```typescript
export class ProjectNotFoundException extends NotFoundException {
  constructor(projectId: string) {
    super(`Project with ID ${projectId} not found`);
  }
}
```

#### `InvalidAIProviderException`
Thrown when an unsupported AI provider is specified.

```typescript
export class InvalidAIProviderException extends BadRequestException {
  constructor(provider: string) {
    super(`AI provider '${provider}' is not supported`);
  }
}
```

#### `FileUploadException`
Thrown when file upload operations fail.

```typescript
export class FileUploadException extends BadRequestException {
  constructor(message: string, details?: any) {
    super({
      message: `File upload failed: ${message}`,
      details
    });
  }
}
```

### Error Response Format

All services follow a consistent error response format:

```typescript
{
  statusCode: number;
  message: string;
  error: string;
  details?: any;
  timestamp: string;
  path: string;
}
```

### Logging

Services use NestJS's built-in logging system with structured logging:

```typescript
this.logger.log('Project created successfully', { projectId, userId });
this.logger.error('AI analysis failed', { error: error.message, provider });
this.logger.warn('API rate limit approaching', { provider, remainingRequests });
```

---

## Service Configuration

### Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/beforeafterui

# AI Providers
OPENAI_API_KEY=your_openai_key
GOOGLE_AI_API_KEY=your_google_key
ANTHROPIC_API_KEY=your_anthropic_key

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB
MAX_FILES_PER_REQUEST=20

# Server
PORT=3001
NODE_ENV=development
```

### Module Configuration

Each service is configured through its respective module:

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema }
    ]),
    ConfigModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
```

This documentation provides comprehensive coverage of all backend services, their methods, configurations, and usage patterns. Each service is designed to be modular, testable, and maintainable while following NestJS best practices.