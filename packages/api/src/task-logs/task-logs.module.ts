import { Module } from '@nestjs/common';
import { TaskLogsController } from './task-logs.controller';
import { TaskLogsService } from './task-logs.service';

@Module({
  controllers: [TaskLogsController],
  providers: [TaskLogsService],
})
export class TaskLogsModule {} 