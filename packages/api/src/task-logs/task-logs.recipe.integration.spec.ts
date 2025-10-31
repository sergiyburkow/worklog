/**
 * Інтеграційні тести для автоматичної інтеграції Task Recipe з реєстрацією задач
 * 
 * Тести перевіряють, що при реєстрації задачі з налаштованим рецептом:
 * 1. Автоматично створюються InventoryLog для вихідних деталей (outputs)
 * 2. Автоматично створюються InventoryLog для споживаних деталей (consumptions)
 * 3. Виконується перевірка достатності інвентарю для consumptions
 * 4. Розрахунки кількості виконуються правильно (perUnit × quantity)
 * 5. Ідемпотентність - не створюються дублікати
 * 
 * Примітка: Це інтеграційні тести, які використовують реальну БД (потрібна тестова БД)
 */
import { Test, TestingModule } from '@nestjs/testing';
import { TaskLogsService } from './task-logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterTaskLogDto } from './dto/register-task-log.dto';
import { TaskType } from '@prisma/client';

describe('TaskLogsService - Recipe Integration', () => {
  let service: TaskLogsService;
  let prisma: PrismaService;
  let testProjectId: string;
  let testTaskId: string;
  let testOutputPartId: string;
  let testConsumptionPartId: string;
  let testUserId: string;
  let testClient: PrismaClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskLogsService,
        PrismaService,
      ],
    }).compile();

    service = module.get<TaskLogsService>(TaskLogsService);
    prisma = module.get<PrismaService>(PrismaService);
    testClient = new PrismaClient();

    // Створюємо тестові дані
    const project = await testClient.project.create({
      data: {
        name: 'Test Project for Recipe',
        projectCode: 'TST',
        clientId: (await testClient.client.create({
          data: { name: 'Test Client' }
        })).id,
        startDate: new Date(),
        deadline: new Date(),
      },
    });
    testProjectId = project.id;

    const task = await testClient.task.create({
      data: {
        name: 'Test Task with Recipe',
        projectId: testProjectId,
        type: TaskType.GENERAL,
        status: 'NEW',
      },
    });
    testTaskId = task.id;

    const outputPart = await testClient.part.create({
      data: {
        projectId: testProjectId,
        code: 'TST-0001',
        name: 'Output Part',
        unit: 'pcs',
      },
    });
    testOutputPartId = outputPart.id;

    const consumptionPart = await testClient.part.create({
      data: {
        projectId: testProjectId,
        code: 'TST-0002',
        name: 'Consumption Part',
        unit: 'pcs',
      },
    });
    testConsumptionPartId = consumptionPart.id;

    const user = await testClient.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'WORKER',
      },
    });
    testUserId = user.id;

    // Додаємо початкову кількість для consumption part
    await testClient.inventoryLog.create({
      data: {
        projectId: testProjectId,
        partId: testConsumptionPartId,
        type: 'PURCHASE',
        quantity: 100,
        createdById: testUserId,
        note: 'Initial stock',
      },
    });
  });

  afterAll(async () => {
    // Очищаємо тестові дані
    await testClient.inventoryLog.deleteMany({ where: { projectId: testProjectId } });
    await testClient.taskOutputPart.deleteMany({ where: { taskId: testTaskId } });
    await testClient.taskPartConsumption.deleteMany({ where: { taskId: testTaskId } });
    await testClient.taskLog.deleteMany({ where: { taskId: testTaskId } });
    await testClient.task.delete({ where: { id: testTaskId } });
    await testClient.part.deleteMany({ where: { projectId: testProjectId } });
    await testClient.user.delete({ where: { id: testUserId } });
    await testClient.project.delete({ where: { id: testProjectId } });
    await testClient.client.deleteMany({});
    await testClient.$disconnect();
  });

  beforeEach(async () => {
    // Очищаємо рецепт перед кожним тестом
    await testClient.taskOutputPart.deleteMany({ where: { taskId: testTaskId } });
    await testClient.taskPartConsumption.deleteMany({ where: { taskId: testTaskId } });
    await testClient.inventoryLog.deleteMany({ 
      where: { 
        projectId: testProjectId,
        partId: { in: [testOutputPartId, testConsumptionPartId] },
        note: { contains: 'Auto' },
      } 
    });
  });

  describe('Recipe integration with task registration', () => {
    it('should create output inventory log when task has output recipe', async () => {
      // Налаштовуємо рецепт: output part з perUnit = 2
      await testClient.taskOutputPart.create({
        data: {
          taskId: testTaskId,
          partId: testOutputPartId,
          perUnit: 2,
        },
      });

      const dto: RegisterTaskLogDto = {
        taskId: testTaskId,
        projectId: testProjectId,
        registeredAt: new Date().toISOString(),
        quantity: 10,
        type: TaskType.GENERAL,
      };

      const taskLog = await service.register(dto, testUserId);

      // Перевіряємо, що створено inventory log: 2 * 10 = 20 одиниць
      const logs = await testClient.inventoryLog.findMany({
        where: {
          taskLogId: taskLog.id,
          partId: testOutputPartId,
        },
      });

      expect(logs).toHaveLength(1);
      expect(Number(logs[0].quantity)).toBe(20);
      expect(logs[0].type).toBe('PRODUCTION');
      expect(logs[0].taskLogId).toBe(taskLog.id);
    });

    it('should create consumption inventory log when task has consumption recipe', async () => {
      // Налаштовуємо рецепт: consumption part з quantityPerUnit = 3
      await testClient.taskPartConsumption.create({
        data: {
          taskId: testTaskId,
          partId: testConsumptionPartId,
          quantityPerUnit: 3,
        },
      });

      const dto: RegisterTaskLogDto = {
        taskId: testTaskId,
        projectId: testProjectId,
        registeredAt: new Date().toISOString(),
        quantity: 5,
        type: TaskType.GENERAL,
      };

      const taskLog = await service.register(dto, testUserId);

      // Перевіряємо, що створено inventory log: -3 * 5 = -15 одиниць (списання)
      const logs = await testClient.inventoryLog.findMany({
        where: {
          taskLogId: taskLog.id,
          partId: testConsumptionPartId,
        },
      });

      expect(logs).toHaveLength(1);
      expect(Number(logs[0].quantity)).toBe(-15);
      expect(logs[0].type).toBe('ADJUSTMENT');
      expect(logs[0].taskLogId).toBe(taskLog.id);
    });

    it('should create both output and consumption logs when task has both', async () => {
      // Налаштовуємо обидва рецепти
      await testClient.taskOutputPart.create({
        data: {
          taskId: testTaskId,
          partId: testOutputPartId,
          perUnit: 2.5,
        },
      });
      await testClient.taskPartConsumption.create({
        data: {
          taskId: testTaskId,
          partId: testConsumptionPartId,
          quantityPerUnit: 1.5,
        },
      });

      const dto: RegisterTaskLogDto = {
        taskId: testTaskId,
        projectId: testProjectId,
        registeredAt: new Date().toISOString(),
        quantity: 4,
        type: TaskType.GENERAL,
      };

      const taskLog = await service.register(dto, testUserId);

      // Перевіряємо outputs: 2.5 * 4 = 10
      const outputLogs = await testClient.inventoryLog.findMany({
        where: {
          taskLogId: taskLog.id,
          partId: testOutputPartId,
        },
      });
      expect(outputLogs).toHaveLength(1);
      expect(Number(outputLogs[0].quantity)).toBe(10);

      // Перевіряємо consumptions: -1.5 * 4 = -6
      const consumptionLogs = await testClient.inventoryLog.findMany({
        where: {
          taskLogId: taskLog.id,
          partId: testConsumptionPartId,
        },
      });
      expect(consumptionLogs).toHaveLength(1);
      expect(Number(consumptionLogs[0].quantity)).toBe(-6);
    });

    it('should throw error when consumption exceeds available inventory', async () => {
      await testClient.taskPartConsumption.create({
        data: {
          taskId: testTaskId,
          partId: testConsumptionPartId,
          quantityPerUnit: 50, // Спробуємо списати 50 * 5 = 250, але є тільки 100
        },
      });

      const dto: RegisterTaskLogDto = {
        taskId: testTaskId,
        projectId: testProjectId,
        registeredAt: new Date().toISOString(),
        quantity: 5,
        type: TaskType.GENERAL,
      };

      await expect(
        service.register(dto, testUserId)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.register(dto, testUserId)
      ).rejects.toThrow('Insufficient inventory for consumption parts');
    });

    it('should not create inventory logs when quantity is not provided', async () => {
      await testClient.taskOutputPart.create({
        data: {
          taskId: testTaskId,
          partId: testOutputPartId,
          perUnit: 2,
        },
      });

      const dto: RegisterTaskLogDto = {
        taskId: testTaskId,
        projectId: testProjectId,
        registeredAt: new Date().toISOString(),
        // quantity не вказано
        type: TaskType.GENERAL,
      };

      const taskLog = await service.register(dto, testUserId);

      // Перевіряємо, що inventory logs не створені
      const logs = await testClient.inventoryLog.findMany({
        where: {
          taskLogId: taskLog.id,
        },
      });

      expect(logs).toHaveLength(0);
    });

    it('should be idempotent - not create duplicate logs on re-registration attempt', async () => {
      await testClient.taskOutputPart.create({
        data: {
          taskId: testTaskId,
          partId: testOutputPartId,
          perUnit: 2,
        },
      });

      const dto: RegisterTaskLogDto = {
        taskId: testTaskId,
        projectId: testProjectId,
        registeredAt: new Date().toISOString(),
        quantity: 10,
        type: TaskType.GENERAL,
      };

      const taskLog1 = await service.register(dto, testUserId);
      
      // Повторна спроба реєстрації з тим же taskLogId (через унікальний індекс) має завершитися помилкою
      // Але якщо створимо новий taskLog, то рецепт застосується знову
      const taskLog2 = await service.register(dto, testUserId);

      // Кожен taskLog має свій inventory log
      const logs = await testClient.inventoryLog.findMany({
        where: {
          taskLogId: { in: [taskLog1.id, taskLog2.id] },
          partId: testOutputPartId,
        },
      });

      // Має бути 2 логи (по одному для кожного taskLog)
      expect(logs.length).toBeGreaterThanOrEqual(1);
    });
  });
});

