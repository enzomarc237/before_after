# BeforeAfterUI - AI-Powered UI Transformation Assistant

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

## 🎯 Overview

BeforeAfterUI is an AI-powered web application that helps developers transform their current UI to match target designs across any technology stack. Using advanced computer vision and code analysis, it provides intelligent transformation guidance for React, Vue, Angular, Flutter, and more.

## ✨ Features

### Core Functionality
- **🔍 AI Visual Analysis**: Advanced computer vision to analyze UI screenshots
- **🎨 Design Comparison**: Intelligent diff detection between current and target designs
- **🤖 Multi-Provider AI**: Support for OpenAI, Google Gemini, Anthropic Claude, and Azure
- **📱 Universal Framework Support**: Works with React, Vue, Angular, Flutter, React Native, and more
- **💡 Smart Code Suggestions**: Framework-specific code generation and recommendations

### Technology Stack Detection
- **Manual Selection**: Choose your tech stack explicitly
- **Auto-Detection**: AI analyzes uploaded code to identify frameworks
- **Hybrid Mode**: AI detection with user confirmation

### Project Management
- **📁 Project Organization**: Create and manage multiple UI transformation projects
- **📸 Image Management**: Upload and organize current screenshots and target mockups
- **📊 Progress Tracking**: Monitor transformation progress with detailed analytics
- **🔄 Iteration Support**: Track multiple rounds of improvements

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AI Provider API key (OpenAI, Google, Anthropic, or Azure)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/beforeafterui.git
   cd beforeafterui
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Configuration

1. **Navigate to Settings** (`/settings`)
2. **Select your AI provider** (OpenAI, Google, Anthropic, or Azure)
3. **Choose your preferred model**
4. **Add your API key**
5. **Save configuration**

## 📖 Usage Guide

### Creating Your First Project

1. **Create New Project**
   - Click "New Project" from the dashboard
   - Enter project name and description
   - Select or let AI detect your technology stack

2. **Upload Images**
   - Upload current UI screenshots
   - Upload target design mockups
   - Organize images by type (current vs target)

3. **Run AI Analysis**
   - Navigate to the Compare page
   - Select images to compare
   - Click "Start Analysis"
   - Review AI-generated differences and suggestions

4. **Apply Suggestions**
   - Copy generated code snippets
   - Apply changes to your codebase
   - Upload new screenshots to track progress

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **UI Components**: Custom component library
- **File Handling**: React Dropzone

### Backend (Planned)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB
- **File Storage**: AWS S3 / Local storage
- **Authentication**: Auth0

### AI Integration
- **Providers**: OpenAI, Google Gemini, Anthropic Claude, Azure OpenAI
- **Vision Models**: GPT-4o, Gemini Pro Vision, Claude 3.5 Sonnet
- **Code Models**: GPT-4, Gemini Pro, Claude 3.5 Sonnet

## 📁 Project Structure

```
beforeafterui/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── store/           # Zustand state management
│   │   ├── types/           # TypeScript type definitions
│   │   └── lib/             # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # NestJS backend (in development)
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── common/          # Shared utilities
│   │   └── main.ts
│   └── package.json
├── docs/                    # Technical documentation
└── README.md
```

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js config
- **Prettier**: Code formatting (planned)
- **Husky**: Git hooks for quality checks (planned)

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:

```env
# AI Provider Settings (stored in browser localStorage)
# No server-side environment variables needed for AI keys
```

### AI Provider Setup

#### OpenAI
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Recommended models: GPT-4o, GPT-4o Mini

#### Google Gemini
1. Get API key from [Google AI Studio](https://makersuite.google.com/)
2. Recommended models: Gemini 1.5 Pro, Gemini 1.5 Flash

#### Anthropic Claude
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Recommended models: Claude 3.5 Sonnet, Claude 3 Opus

#### Azure OpenAI
1. Set up Azure OpenAI service
2. Get endpoint and API key
3. Deploy GPT-4o or GPT-4 Turbo models

## 📊 Current Status

### ✅ Completed Features
- [x] Project management system
- [x] File upload and image handling
- [x] AI provider configuration
- [x] Basic UI comparison interface
- [x] Mock analysis results
- [x] Responsive design
- [x] TypeScript implementation

### 🔄 In Progress
- [ ] Backend API development
- [ ] Real AI integration
- [ ] Database implementation
- [ ] User authentication

### 📋 Planned Features
- [ ] Real-time collaboration
- [ ] Batch processing
- [ ] Advanced analytics
- [ ] Plugin system
- [ ] Mobile app

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT models
- Google for Gemini models
- Anthropic for Claude models
- Vercel for Next.js
- Tailwind CSS team
- React community

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/beforeafterui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/beforeafterui/discussions)

---

**Built with ❤️ by the BeforeAfterUI team**