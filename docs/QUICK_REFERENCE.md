# BeforeAfterUI Quick Reference

## 🚀 Quick Start Cheat Sheet

### 1. API Setup (30 seconds)
```bash
# Start the backend
cd backend && npm run start:dev

# Health check
curl http://localhost:3001/api/health
```

### 2. SDK Setup (1 minute)
```bash
npm install beforeafterui-sdk
```

```typescript
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

const client = new BeforeAfterUIClient({
  baseUrl: 'http://localhost:3001/api',
  aiProvider: 'openai',
  apiKey: 'your-key'
});
```

### 3. First Analysis (2 minutes)
```typescript
// Analyze UI images
const analysis = await client.ai.analyzeImages({
  currentImage: currentImageFile,
  targetImage: targetImageFile,
  framework: 'React'
});

console.log(analysis.analysis.summary);
```

## 📋 Essential API Endpoints

| Endpoint | Method | Purpose | Example |
|----------|--------|---------|---------|
| `/health` | GET | Check API status | `curl /api/health` |
| `/projects` | POST | Create project | `{"name": "My Project"}` |
| `/ai/analyze` | POST | Analyze UI images | Upload 2 images + metadata |
| `/ai/generate-code` | POST | Generate code | `{"framework": "React", "description": "..."}` |
| `/uploads/images` | POST | Upload images | FormData with images |

## 🔧 Environment Variables

```bash
# Required
MONGODB_URI=mongodb://localhost:27017/beforeafterui
OPENAI_API_KEY=sk-...

# Optional
GOOGLE_AI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
MAX_FILE_SIZE=10485760
```

## 📊 Common Curl Commands

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Create Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "My UI Project", "description": "Test project"}'
```

### Upload Images
```bash
curl -X POST http://localhost:3001/api/uploads/images \
  -F "images=@current.png" \
  -F "images=@target.png" \
  -F 'metadata={"projectId":"PROJECT_ID"}'
```

### Analyze Images
```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -F "images=@current.png" \
  -F "images=@target.png" \
  -F "framework=React" \
  -F "aiProvider=openai"
```

## 💻 SDK Code Snippets

### Project Management
```typescript
// Create project
const project = await client.projects.create({
  name: 'Dashboard Redesign',
  techStack: { framework: 'React', language: 'TypeScript', platform: 'web' }
});

// List projects
const projects = await client.projects.getAll({ page: 1, limit: 10 });

// Update project
await client.projects.update(projectId, { status: 'completed' });
```

### AI Analysis
```typescript
// Analyze UI differences
const analysis = await client.ai.analyzeImages({
  currentImage: file1,
  targetImage: file2,
  framework: 'React',
  aiProvider: 'openai'
});

// Detect tech stack
const detection = await client.ai.detectTechStack([
  { filename: 'package.json', content: packageContent }
]);

// Generate code
const code = await client.ai.generateCode({
  framework: 'React',
  description: 'Update button styling',
  differences: analysis.differences
});
```

### File Uploads
```typescript
// Upload single image
const upload = await client.uploads.uploadImage(imageFile, {
  projectId: 'project-id',
  imageType: 'current'
});

// Upload multiple images
const uploads = await client.uploads.uploadImages([file1, file2], {
  projectId: 'project-id'
});

// Get project uploads
const projectUploads = await client.uploads.getProjectUploads('project-id');
```

## 🐛 Error Handling Patterns

### Try-Catch with Typed Errors
```typescript
import { APIError, ValidationError } from 'beforeafterui-sdk';

try {
  const result = await client.ai.analyzeImages(options);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.details);
  } else if (error instanceof APIError) {
    console.error('API error:', error.statusCode, error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### React Error Boundary
```typescript
function useUIAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (current: File, target: File) => {
    setLoading(true);
    setError(null);
    
    try {
      return await client.ai.analyzeImages({ currentImage: current, targetImage: target });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
}
```

## 🔍 Data Model Cheat Sheet

### Project
```typescript
{
  id: string;
  name: string;
  description?: string;
  techStack?: {
    framework: string;
    language: string;
    platform: 'web' | 'mobile' | 'desktop';
    autoDetected: boolean;
    confidence?: number;
  };
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}
```

### Analysis Result
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

### Upload
```typescript
{
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  type: 'image' | 'code';
  projectId: string;
  imageType?: 'current' | 'target';
  metadata?: {
    width: number;
    height: number;
    format: string;
  };
}
```

## ⚡ Performance Tips

### 1. Image Optimization
```typescript
// Compress images before upload
const compressedImage = await compressImage(originalImage, {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8
});
```

### 2. Batch Operations
```typescript
// Upload multiple files at once
const uploads = await client.uploads.uploadImages(imageFiles, metadata);

// Use Promise.all for parallel operations
const [projects, uploads] = await Promise.all([
  client.projects.getAll(),
  client.uploads.getProjectUploads(projectId)
]);
```

### 3. Caching
```typescript
// Cache analysis results
const cacheKey = `analysis-${imageHash1}-${imageHash2}`;
let analysis = cache.get(cacheKey);

if (!analysis) {
  analysis = await client.ai.analyzeImages(options);
  cache.set(cacheKey, analysis, { ttl: 3600 });
}
```

## 🎯 Framework-Specific Examples

### React Component
```typescript
import { useState } from 'react';
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

function UIAnalyzer() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async (currentImage: File, targetImage: File) => {
    setLoading(true);
    try {
      const result = await client.ai.analyzeImages({
        currentImage,
        targetImage,
        framework: 'React'
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={e => handleFileUpload(e, 'current')} />
      <input type="file" onChange={e => handleFileUpload(e, 'target')} />
      <button onClick={() => handleAnalysis(current, target)} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze UI'}
      </button>
      {analysis && <div>{analysis.analysis.summary}</div>}
    </div>
  );
}
```

### Vue.js Component
```vue
<template>
  <div>
    <input type="file" @change="handleCurrentImage" />
    <input type="file" @change="handleTargetImage" />
    <button @click="analyzeUI" :disabled="loading">
      {{ loading ? 'Analyzing...' : 'Analyze UI' }}
    </button>
    <div v-if="analysis">{{ analysis.analysis.summary }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

const client = new BeforeAfterUIClient({ baseUrl: '/api' });
const loading = ref(false);
const analysis = ref(null);
const currentImage = ref(null);
const targetImage = ref(null);

const analyzeUI = async () => {
  if (!currentImage.value || !targetImage.value) return;
  
  loading.value = true;
  try {
    analysis.value = await client.ai.analyzeImages({
      currentImage: currentImage.value,
      targetImage: targetImage.value,
      framework: 'Vue'
    });
  } catch (error) {
    console.error('Analysis failed:', error);
  } finally {
    loading.value = false;
  }
};
</script>
```

### Node.js Express Route
```typescript
import express from 'express';
import multer from 'multer';
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const client = new BeforeAfterUIClient({ baseUrl: 'http://localhost:3001/api' });

app.post('/analyze', upload.array('images', 2), async (req, res) => {
  try {
    const [currentImage, targetImage] = req.files;
    
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
```

## 🔍 Testing Examples

### Unit Test
```typescript
import { BeforeAfterUIClient } from 'beforeafterui-sdk';

describe('BeforeAfterUI SDK', () => {
  let client: BeforeAfterUIClient;

  beforeEach(() => {
    client = new BeforeAfterUIClient({
      baseUrl: 'http://localhost:3001/api'
    });
  });

  it('should create a project', async () => {
    const project = await client.projects.create({
      name: 'Test Project',
      techStack: {
        framework: 'React',
        language: 'TypeScript',
        platform: 'web'
      }
    });

    expect(project.name).toBe('Test Project');
    expect(project.id).toBeDefined();
  });
});
```

### Integration Test
```bash
# Test API health
curl -f http://localhost:3001/api/health || exit 1

# Test project creation
PROJECT_ID=$(curl -s -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project"}' | jq -r '.id')

echo "Created project: $PROJECT_ID"
```

## 📚 Useful Resources

### Links
- **Swagger UI**: `http://localhost:3001/api/docs`
- **API Documentation**: `./API_DOCUMENTATION.md`
- **SDK Documentation**: `./SDK_DOCUMENTATION.md`
- **Services Documentation**: `./SERVICES_DOCUMENTATION.md`

### AI Provider Documentation
- **OpenAI**: https://platform.openai.com/docs
- **Google AI**: https://ai.google.dev/docs
- **Anthropic**: https://docs.anthropic.com

### Supported File Types
- **Images**: PNG, JPEG, WebP, GIF
- **Code**: JavaScript, TypeScript, CSS, HTML, JSON, Markdown

### Rate Limits
- **OpenAI**: 3 RPM (requests per minute) for free tier
- **Google**: 2 RPM for free tier  
- **Anthropic**: 5 RPM for free tier

---

## 🚨 Troubleshooting

### Common Issues

#### "Connection refused"
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Start backend if not running
cd backend && npm run start:dev
```

#### "Invalid API key"
```bash
# Check environment variables
echo $OPENAI_API_KEY

# Set API key
export OPENAI_API_KEY=sk-your-key-here
```

#### "File too large"
```typescript
// Check file size before upload
if (file.size > 10 * 1024 * 1024) { // 10MB
  throw new Error('File too large');
}
```

#### "Analysis timeout"
```typescript
// Increase timeout
const client = new BeforeAfterUIClient({
  baseUrl: 'http://localhost:3001/api',
  timeout: 120000 // 2 minutes
});
```

This quick reference provides essential information for rapid development and troubleshooting with BeforeAfterUI.