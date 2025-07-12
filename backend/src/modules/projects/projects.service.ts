import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Project, ProjectDocument } from '../../schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) {}
  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort: any = {};
    if (query.sortBy) {
      sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.updatedAt = -1; // Default sort by updated date
    }

    const [projects, total] = await Promise.all([
      this.projectModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.projectModel.countDocuments(filter).exec()
    ]);

    return {
      data: projects,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(createProjectDto: CreateProjectDto) {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();
    
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return updatedProject;
  }

  async remove(id: string) {
    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();
    
    if (!deletedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return { message: 'Project deleted successfully', project: deletedProject };
  }
}