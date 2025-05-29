import { Controller, Post, Get, Body, Put, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import { ProjectsService } from '../service/projects.service';
import { ProjectDTO } from 'src/dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(@Body() createProjectDto: ProjectDTO) {
    console.log('DTO recibido:', createProjectDto);
    return this.projectsService.createProject(createProjectDto);
  }

  @Get()
  async getAllProjects(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.projectsService.getAllProjects(page, limit);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    const project = await this.projectsService.getProject(id);
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }
    return project;
  }

  @Put(':id')
  updateProject(@Param('id') id: string, @Body() updateProjectDto: ProjectDTO) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string) {
  console.log('ID recibido en DELETE:', id);  
  return this.projectsService.deleteProject(id);
}

}
