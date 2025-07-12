import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

// Temporary in-memory storage (will be replaced with database)
let projects: any[] = [];
let nextId = 1;

@Injectable()
export class ProjectsService {
  async findAll(query: any) {
    let filteredProjects = [...projects];

    // Apply filters
    if (query.status) {
      filteredProjects = filteredProjects.filter(p => p.status === query.status);
    }

    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (query.sortBy) {
      filteredProjects.sort((a, b) => {
        const aValue = a[query.sortBy];
        const bValue = b[query.sortBy];
        
        if (query.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return {
      data: filteredProjects,
      total: filteredProjects.length,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
    };
  }

  async findOne(id: string) {
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(createProjectDto: CreateProjectDto) {
    const newProject = {
      id: nextId.toString(),
      ...createProjectDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    nextId++;
    projects.push(newProject);
    
    return newProject;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateProjectDto,
      updatedAt: new Date(),
    };

    return projects[projectIndex];
  }

  async remove(id: string) {
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const deletedProject = projects.splice(projectIndex, 1)[0];
    return { message: 'Project deleted successfully', project: deletedProject };
  }
}