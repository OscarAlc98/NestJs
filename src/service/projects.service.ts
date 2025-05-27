import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../interface/project.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
  ) {}

  async createProject(data: Project): Promise<Project> {
    const newProject = new this.projectModel(data);
    return newProject.save();
  }

  async getAllProjects(): Promise<any[]> {
  const projects = await this.projectModel.find().exec();
  return projects.map(p => {
    const obj = p.toObject();
    return {
      ...obj,
      id: obj._id.toString(),
    };
  });
}

async updateProject(id: string, updateData: Project): Promise<any> {
  return this.projectModel.findByIdAndUpdate(id, updateData, { new: true });
}


}
