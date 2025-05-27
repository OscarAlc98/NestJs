import { Controller, Post, Get, Body, Put, Param } from '@nestjs/common';
import { ProjectsService } from '../service/projects.service';
import { Project } from '../interface/project.interface';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(@Body() createProjectDto: Project) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get()
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Put(':id')
  updateProject(@Param('id') id: string, @Body() updateProjectDto: Project) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }
}
