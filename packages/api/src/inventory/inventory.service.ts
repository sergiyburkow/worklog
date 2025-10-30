import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartDto } from './dto/create-part.dto';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string, query: any) {
    const { groupId, search, onlyDeficit } = query || {};

    const where: any = { projectId };
    if (groupId) where.groupId = groupId;
    if (search) {
      where.OR = [
        { code: { contains: String(search), mode: 'insensitive' } },
        { name: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const parts = await this.prisma.part.findMany({
      where,
      include: { group: true },
      orderBy: [{ group: { sortOrder: 'asc' } }, { code: 'asc' }],
    });

    // Aggregate current quantities per part
    const logs = await this.prisma.inventoryLog.groupBy({
      by: ['partId'],
      where: { projectId },
      _sum: { quantity: true },
    });
    const qtyByPart: Record<string, number> = {};
    for (const l of logs) qtyByPart[l.partId] = Number(l._sum.quantity || 0);

    const items = parts.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      description: (p as any).description ?? null,
      unit: p.unit,
      group: p.group ? { id: p.group.id, name: p.group.name, sortOrder: p.group.sortOrder } : null,
      targetQuantity: p.targetQuantity ?? null,
      currentQuantity: qtyByPart[p.id] ?? 0,
      requiredQuantity: Math.max(0, (p.targetQuantity ?? 0) - (qtyByPart[p.id] ?? 0)),
      isActive: p.isActive,
    }));

    const filtered = String(onlyDeficit) === 'true' ? items.filter(i => i.requiredQuantity > 0) : items;

    return {
      projectId,
      items: filtered,
    };
  }

  async createPart(projectId: string, dto: CreatePartDto) {
    // use stored projectCode or fallback
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    const prefix = (((project as any)?.projectCode) || 'PRJ').toUpperCase();

    // find next numeric suffix within this project for the prefix
    const existing = await this.prisma.part.findMany({ where: { projectId, code: { startsWith: prefix + '-' } }, select: { code: true } });
    let maxNum = 0;
    for (const e of existing) {
      const m = e.code.match(/^.+-(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!isNaN(n)) maxNum = Math.max(maxNum, n);
      }
    }
    const next = maxNum + 1;
    const code = `${prefix}-${String(next).padStart(4, '0')}`;

    const data: any = {
      projectId,
      code,
      name: dto.name,
      unit: dto.unit ?? 'pcs',
      targetQuantity: dto.targetQuantity ?? null,
      isActive: dto.isActive ?? true,
      groupId: dto.groupId,
    };
    if (dto.description !== undefined) data.description = dto.description;
    return this.prisma.part.create({ data });
  }

  async addLog(projectId: string, partId: string, dto: CreateInventoryLogDto, createdById: string) {
    // Ensure part belongs to project
    const part = await this.prisma.part.findFirst({ where: { id: partId, projectId } });
    if (!part) {
      throw new Error('Part does not belong to project');
    }
    return this.prisma.inventoryLog.create({
      data: {
        projectId,
        partId,
        type: dto.type,
        quantity: dto.quantity,
        note: dto.note,
        createdById,
      },
    });
  }

  async getLogs(projectId: string, partId: string) {
    return this.prisma.inventoryLog.findMany({
      where: { projectId, partId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePart(projectId: string, partId: string, dto: { name?: string; unit?: string; targetQuantity?: number | null; groupId?: string | null; isActive?: boolean }) {
    const part = await this.prisma.part.findFirst({ where: { id: partId, projectId } })
    if (!part) throw new Error('Part not found')
    return this.prisma.part.update({ where: { id: partId }, data: dto })
  }

  async listGroups(projectId: string) {
    const groups = await this.prisma.partGroup.findMany({ where: { projectId }, orderBy: { sortOrder: 'asc' } })
    return { groups }
  }

  async createGroup(projectId: string, dto: { name: string; description?: string; sortOrder?: number }) {
    return this.prisma.partGroup.create({ data: { projectId, name: dto.name, description: dto.description, sortOrder: dto.sortOrder ?? 0 } })
  }

  async updateGroup(projectId: string, groupId: string, dto: { name?: string; description?: string; sortOrder?: number }) {
    const group = await this.prisma.partGroup.findFirst({ where: { id: groupId, projectId } })
    if (!group) throw new Error('Group not found')
    return this.prisma.partGroup.update({ where: { id: groupId }, data: dto })
  }
}
