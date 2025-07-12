# Contributing to BeforeAfterUI

Thank you for your interest in contributing to BeforeAfterUI! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- AI Provider API key (for testing)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/beforeafterui.git
   cd beforeafterui
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Individual features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add or update tests
chore: maintenance tasks
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow code style guidelines
   - Add tests if applicable
   - Update documentation

3. **Test Your Changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🎯 Areas for Contribution

### High Priority
- [ ] Backend API development (NestJS)
- [ ] Real AI provider integrations
- [ ] Database implementation (MongoDB)
- [ ] User authentication system
- [ ] File storage (AWS S3/local)

### Medium Priority
- [ ] Advanced UI components
- [ ] Performance optimizations
- [ ] Additional AI providers
- [ ] Mobile app (React Native)
- [ ] Plugin system

### Low Priority
- [ ] Documentation improvements
- [ ] Code refactoring
- [ ] Additional tests
- [ ] Accessibility improvements
- [ ] Internationalization

## 🛠️ Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` types when possible
- Use meaningful variable names

### React/Next.js
- Use functional components with hooks
- Implement proper error boundaries
- Follow Next.js best practices
- Use TypeScript for all components

### Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use semantic HTML elements

### State Management
- Use Zustand for global state
- Keep state minimal and normalized
- Implement proper error handling
- Use TypeScript for store definitions

## 🧪 Testing Guidelines

### Frontend Testing
```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Build check
npm run build
```

### Code Quality
- Ensure TypeScript compilation passes
- Fix all ESLint errors
- Test on multiple screen sizes
- Verify accessibility standards

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include usage examples
- Update README for new features

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify authentication requirements
- Provide error code explanations

## 🐛 Bug Reports

### Before Reporting
1. Check existing issues
2. Reproduce the bug
3. Test on latest version
4. Gather system information

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96]
- Node.js: [e.g., 18.0.0]
- Version: [e.g., 0.1.0]

**Screenshots**
If applicable
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches considered

**Additional Context**
Any other relevant information
```

## 🔒 Security

### Reporting Security Issues
- **DO NOT** open public issues for security vulnerabilities
- Email security concerns to: security@beforeafterui.com
- Include detailed description and steps to reproduce
- Allow time for investigation before public disclosure

### Security Guidelines
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all user inputs
- Follow OWASP security guidelines
- Keep dependencies updated

## 📄 License

By contributing to BeforeAfterUI, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone.

### Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Enforcement
Instances of abusive behavior may be reported to the project maintainers.

## 📞 Getting Help

- **Documentation**: Check the [docs/](./docs/) directory
- **Issues**: Search existing [GitHub Issues](https://github.com/yourusername/beforeafterui/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/beforeafterui/discussions)
- **Discord**: Join our community server (link coming soon)

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub releases for major features

Thank you for contributing to BeforeAfterUI! 🚀