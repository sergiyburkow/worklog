import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectAccessGuard } from './guards/project-access.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectAccessGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {} 