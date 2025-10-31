import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskProjectAccessGuard } from './guards/task-project-access.guard';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskProjectAccessGuard],
  exports: [TasksService],
})
export class TasksModule {} 