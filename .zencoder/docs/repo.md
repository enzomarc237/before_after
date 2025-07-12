# BeforeAfterUI Repository Information

## Repository Summary

BeforeAfterUI is an AI-powered web application that helps developers transform their current UI to match target designs across any technology stack. It uses advanced computer vision and code analysis to provide intelligent transformation guidance for various frameworks including React, Vue, Angular, Flutter, and more.

## Repository Structure

- **frontend/**: Next.js frontend application with React 19 and TypeScript
- **backend/**: NestJS backend API with TypeScript
- **docs/**: Technical documentation
- **.github/**: GitHub configuration files
- **.zencoder/**: Documentation and configuration files

## Projects

### Frontend Application

**Configuration File**: frontend/package.json

#### Language & Runtime

**Language**: TypeScript
**Framework**: Next.js 15 with React 19
**Build System**: Next.js build system
**Package Manager**: npm

#### Dependencies

**Main Dependencies**:

- next: 15.3.5
- react: ^19.0.0
- react-dom: ^19.0.0
- @tanstack/react-query: ^5.83.0
- axios: ^1.10.0
- react-dropzone: ^14.3.8
- react-hook-form: ^7.60.0
- zod: ^4.0.5
- zustand: ^5.0.6

**Development Dependencies**:

- typescript: ^5
- eslint: ^9
- tailwindcss: ^4

#### Build & Installation

```bash
cd frontend
npm install
npm run dev     # Development server with Turbopack
npm run build   # Production build
npm run start   # Start production server
```

### Backend API

**Configuration File**: backend/package.json

#### Language & Runtime

**Language**: TypeScript
**Framework**: NestJS 11
**Build System**: TypeScript compiler
**Package Manager**: npm

#### Dependencies

**Main Dependencies**:

- @nestjs/common: ^11.1.3
- @nestjs/core: ^11.1.3
- @nestjs/mongoose: ^11.0.3
- @nestjs/platform-express: ^11.1.3
- @nestjs/swagger: ^11.2.0
- mongoose: ^8.16.3
- @anthropic-ai/sdk: ^0.56.0
- @google/generative-ai: ^0.24.1
- openai: ^5.9.0

**Development Dependencies**:

- @nestjs/cli: ^11.0.7
- typescript: ^5.8.3
- ts-node: ^10.9.2
- nodemon: ^3.1.10

#### Build & Installation

```bash
cd backend
npm install
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run start:dev    # Start development server
npm run start:watch  # Start development server with auto-reload
```

#### Main Components

- **Projects Module**: Manages UI transformation projects
- **AI Module**: Handles AI provider integrations (OpenAI, Google Gemini, Anthropic Claude)
- **Uploads Module**: Manages file uploads and image processing
- **Health Controller**: API health check endpoint

## Architecture

### Frontend Architecture

- **App Router**: Next.js app directory structure
- **Components**: Reusable UI components
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS v4
- **API Integration**: Axios with React Query

### Backend Architecture

- **NestJS Modules**: Feature-based modular architecture
- **MongoDB**: Database for project and user data
- **Swagger**: API documentation at /api/docs
- **AI Integration**: Multiple AI provider SDKs
- **File Handling**: Multer for file uploads

## Configuration

### Environment Variables

- Frontend: Stored in browser localStorage for AI provider settings
- Backend: MongoDB connection, port settings, and API keys in .env file

### AI Provider Support

- OpenAI (GPT-4o, GPT-4o Mini)
- Google Gemini (Gemini 1.5 Pro, Gemini 1.5 Flash)
- Anthropic Claude (Claude 3.5 Sonnet, Claude 3 Opus)
- Azure OpenAI (GPT-4o, GPT-4 Turbo)

## Development Status

- Frontend: Basic UI implemented with mock data
- Backend: Core API structure implemented
- In Progress: Real AI integration, database implementation, user authentication
