import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AdminGuard } from '../auth/admin.guard';
import { TaskRecipeOutputDto, TaskRecipeConsumptionDto, TaskRecipeResponseDto } from './dto/recipe.dto';
import { TaskProjectAccessGuard } from './guards/task-project-access.guard';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: 201, description: 'Task has been created' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('project/:id')
  @ApiOperation({ summary: 'Get tasks by project id' })
  @ApiResponse({ status: 200, description: 'Return tasks by project id' })
  findByProject(@Param('id') id: string) {
    return this.tasksService.findByProject(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  @ApiResponse({ status: 200, description: 'Return task by id' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task has been updated' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task has been deleted' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  // Recipe endpoints (ADMIN only for mutating operations)
  @Get(':taskId/recipe')
  @ApiOperation({ 
    summary: 'Отримати рецепт задачі (вихідні та споживані деталі)',
    description: 'Повертає повну інформацію про рецепт задачі, включаючи список деталей, які виробляються (outputs) та споживаються (consumptions) при виконанні задачі. Рецепт використовується для автоматичного управління інвентарем під час реєстрації виконання задачі.'
  })
  @ApiParam({ name: 'taskId', description: 'ID задачі', example: '550e8400-e29b-41d4-a716-446655440003' })
  @ApiResponse({ 
    status: 200, 
    description: 'Рецепт задачі успішно отримано',
    type: TaskRecipeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Задачу не знайдено' })
  @UseGuards(TaskProjectAccessGuard)
  getRecipe(@Param('taskId') taskId: string) {
    return this.tasksService.getRecipe(taskId)
  }

  @Post(':taskId/recipe/outputs')
  @UseGuards(AdminGuard, TaskProjectAccessGuard)
  @ApiOperation({ 
    summary: 'Додати або оновити вихідну деталь в рецепті задачі',
    description: 'Додає або оновлює деталь, яка виробляється при виконанні задачі. Якщо деталь вже існує в рецепті, оновлює значення perUnit. При реєстрації задачі з quantity, до інвентарю автоматично додається perUnit × quantity одиниць цієї деталі.'
  })
  @ApiParam({ name: 'taskId', description: 'ID задачі', example: '550e8400-e29b-41d4-a716-446655440003' })
  @ApiBody({ type: TaskRecipeOutputDto })
  @ApiResponse({ status: 200, description: 'Вихідна деталь успішно додана або оновлена' })
  @ApiResponse({ status: 400, description: 'Невірні дані (partId не належить проекту задачі)' })
  @ApiResponse({ status: 404, description: 'Задачу або деталь не знайдено' })
  upsertOutput(@Param('taskId') taskId: string, @Body() dto: TaskRecipeOutputDto) {
    return this.tasksService.addOutput(taskId, dto)
  }

  @Delete(':taskId/recipe/outputs/:partId')
  @UseGuards(AdminGuard, TaskProjectAccessGuard)
  @ApiOperation({ 
    summary: 'Видалити вихідну деталь з рецепта задачі',
    description: 'Видаляє деталь зі списку вихідних деталей рецепта. Після видалення ця деталь більше не буде автоматично додаватися до інвентарю при реєстрації виконання задачі.'
  })
  @ApiParam({ name: 'taskId', description: 'ID задачі', example: '550e8400-e29b-41d4-a716-446655440003' })
  @ApiParam({ name: 'partId', description: 'ID деталі для видалення', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Вихідна деталь успішно видалена' })
  @ApiResponse({ status: 404, description: 'Задачу або деталь не знайдено' })
  removeOutput(@Param('taskId') taskId: string, @Param('partId') partId: string) {
    return this.tasksService.removeOutput(taskId, partId)
  }

  @Post(':taskId/recipe/consumptions')
  @UseGuards(AdminGuard, TaskProjectAccessGuard)
  @ApiOperation({ 
    summary: 'Додати або оновити споживану деталь в рецепті задачі',
    description: 'Додає або оновлює деталь, яка споживається при виконанні задачі. Якщо деталь вже існує в рецепті, оновлює значення quantityPerUnit. При реєстрації задачі з quantity, з інвентарю автоматично спишеться quantityPerUnit × quantity одиниць цієї деталі. Система перевіряє достатність інвентарю перед списанням.'
  })
  @ApiParam({ name: 'taskId', description: 'ID задачі', example: '550e8400-e29b-41d4-a716-446655440003' })
  @ApiBody({ type: TaskRecipeConsumptionDto })
  @ApiResponse({ status: 200, description: 'Споживана деталь успішно додана або оновлена' })
  @ApiResponse({ status: 400, description: 'Невірні дані (partId не належить проекту задачі)' })
  @ApiResponse({ status: 404, description: 'Задачу або деталь не знайдено' })
  upsertConsumption(@Param('taskId') taskId: string, @Body() dto: TaskRecipeConsumptionDto) {
    return this.tasksService.addConsumption(taskId, dto)
  }

  @Delete(':taskId/recipe/consumptions/:partId')
  @UseGuards(AdminGuard, TaskProjectAccessGuard)
  @ApiOperation({ 
    summary: 'Видалити споживану деталь з рецепта задачі',
    description: 'Видаляє деталь зі списку споживаних деталей рецепта. Після видалення ця деталь більше не буде автоматично списуватися з інвентарю при реєстрації виконання задачі.'
  })
  @ApiParam({ name: 'taskId', description: 'ID задачі', example: '550e8400-e29b-41d4-a716-446655440003' })
  @ApiParam({ name: 'partId', description: 'ID деталі для видалення', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiResponse({ status: 200, description: 'Споживана деталь успішно видалена' })
  @ApiResponse({ status: 404, description: 'Задачу або деталь не знайдено' })
  removeConsumption(@Param('taskId') taskId: string, @Param('partId') partId: string) {
    return this.tasksService.removeConsumption(taskId, partId)
  }
} 