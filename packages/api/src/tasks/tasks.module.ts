import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskGroupsService } from './task-groups.service';
import { TaskGroupsController } from './task-groups.controller';
import { TaskProjectAccessGuard } from './guards/task-project-access.guard';

@Module({
  controllers: [TasksController, TaskGroupsController],
  providers: [TasksService, TaskGroupsService, TaskProjectAccessGuard],
  exports: [TasksService, TaskGroupsService],
})
export class TasksModule {} 