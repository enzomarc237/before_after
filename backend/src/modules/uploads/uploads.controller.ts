import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  UploadedFile, 
  UploadedFiles, 
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: any,
  ) {
    return this.uploadsService.uploadImage(file, metadata);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() metadata: any,
  ) {
    return this.uploadsService.uploadImages(files, metadata);
  }

  @Post('code')
  @UseInterceptors(FilesInterceptor('codeFiles', 20))
  async uploadCodeFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() metadata: any,
  ) {
    return this.uploadsService.uploadCodeFiles(files, metadata);
  }

  @Get('project/:projectId')
  async getProjectUploads(@Param('projectId') projectId: string) {
    return this.uploadsService.getProjectUploads(projectId);
  }

  @Delete(':id')
  async deleteUpload(@Param('id') id: string) {
    return this.uploadsService.deleteUpload(id);
  }
}