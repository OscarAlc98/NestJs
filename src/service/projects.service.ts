import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../interface/project.interface';
import { ProjectDTO } from '../dto/create-project.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
  ) {}

  async createProject(data: ProjectDTO): Promise<Project> {
    const dto = plainToInstance(ProjectDTO, data);
    await validateOrReject(dto); // Valida usando class-validator

    const projectToSave: Partial<Project> = {
      ...dto,
      contractSignedOn: dto.contractSignedOn ? new Date(dto.contractSignedOn) : undefined,
    };

    const newProject = new this.projectModel(projectToSave);
    return newProject.save();
  }

  async getAllProjects(page: number, limit: number): Promise<any[]> {
    const skip = (page - 1) * limit;
    const projects = await this.projectModel.find().sort({ _id: 1 }).skip(skip).limit(limit).exec();
    return projects.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        id: obj._id.toString(),
      };
    });
  }

  async getProject(id: string): Promise<Project | null> {
    const doc = await this.projectModel.findById(id).exec();
    if (!doc) {
      return null;
    }
    return doc.toObject() as Project;
  }

  async updateProject(id: string, updateData: ProjectDTO): Promise<any> {
  const dto = plainToInstance(ProjectDTO, updateData);
  await validateOrReject(dto);

  const projectToUpdate: Partial<Project> = {
    ...dto,
    contractSignedOn: dto.contractSignedOn ? new Date(dto.contractSignedOn) : undefined,
  };

  const updated = await this.projectModel.findByIdAndUpdate(id, projectToUpdate, { new: true });
  if (!updated) throw new NotFoundException(`Project with id ${id} not found`);
  return updated;
}

  async deleteProject(id: string): Promise<any> {
    return this.projectModel.findByIdAndDelete(id);
  }

}
