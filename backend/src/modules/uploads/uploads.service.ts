import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Temporary in-memory storage (will be replaced with database)
let uploads: any[] = [];
let nextId = 1;

@Injectable()
export class UploadsService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, metadata: any) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.isValidImageType(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    const filename = this.generateFilename(file.originalname);
    const filepath = path.join(this.uploadDir, filename);

    // Save file to disk
    fs.writeFileSync(filepath, file.buffer);

    const upload = {
      id: nextId.toString(),
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: filepath,
      url: `/api/uploads/files/${filename}`,
      type: 'image',
      projectId: metadata.projectId,
      imageType: metadata.imageType, // 'current' or 'target'
      uploadedAt: new Date(),
    };

    nextId++;
    uploads.push(upload);

    return upload;
  }

  async uploadImages(files: Express.Multer.File[], metadata: any) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map(file => 
      this.uploadImage(file, metadata)
    );

    const results = await Promise.all(uploadPromises);
    return { uploads: results, count: results.length };
  }

  async uploadCodeFiles(files: Express.Multer.File[], metadata: any) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const codeUploads = [];

    for (const file of files) {
      if (!this.isValidCodeFileType(file.originalname)) {
        continue; // Skip invalid files
      }

      const filename = this.generateFilename(file.originalname);
      const filepath = path.join(this.uploadDir, filename);

      // Save file to disk
      fs.writeFileSync(filepath, file.buffer);

      const upload = {
        id: nextId.toString(),
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: filepath,
        url: `/api/uploads/files/${filename}`,
        type: 'code',
        projectId: metadata.projectId,
        language: this.detectLanguage(file.originalname),
        uploadedAt: new Date(),
      };

      nextId++;
      uploads.push(upload);
      codeUploads.push(upload);
    }

    return { uploads: codeUploads, count: codeUploads.length };
  }

  async getProjectUploads(projectId: string) {
    const projectUploads = uploads.filter(upload => upload.projectId === projectId);
    
    return {
      images: projectUploads.filter(u => u.type === 'image'),
      codeFiles: projectUploads.filter(u => u.type === 'code'),
      total: projectUploads.length,
    };
  }

  async deleteUpload(id: string) {
    const uploadIndex = uploads.findIndex(u => u.id === id);
    if (uploadIndex === -1) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }

    const upload = uploads[uploadIndex];
    
    // Delete file from disk
    if (fs.existsSync(upload.path)) {
      fs.unlinkSync(upload.path);
    }

    uploads.splice(uploadIndex, 1);
    
    return { message: 'Upload deleted successfully', upload };
  }

  private isValidImageType(mimetype: string): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(mimetype);
  }

  private isValidCodeFileType(filename: string): boolean {
    const validExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.vue', '.dart', '.swift', '.kt', 
      '.java', '.py', '.css', '.scss', '.html', '.json', '.xml'
    ];
    const extension = path.extname(filename).toLowerCase();
    return validExtensions.includes(extension);
  }

  private generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const extension = path.extname(originalName);
    return `${timestamp}_${random}${extension}`;
  }

  private detectLanguage(filename: string): string {
    const extension = path.extname(filename).toLowerCase();
    const languageMap: Record<string, string> = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.vue': 'vue',
      '.dart': 'dart',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.java': 'java',
      '.py': 'python',
      '.css': 'css',
      '.scss': 'scss',
      '.html': 'html',
    };
    return languageMap[extension] || 'unknown';
  }
}