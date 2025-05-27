import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from './controller/projects.controller';
import { ProjectsService } from './service/projects.service';
import { ProjectSchema } from './schema/project.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/USTCourse'),
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class AppModule {}
