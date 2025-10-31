import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartDto } from './dto/create-part.dto';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';

// Simple in-memory cache with TTL
type CacheEntry = { expiresAt: number; data: any };
const cacheStore: Map<string, CacheEntry> = new Map();
const DEFAULT_TTL_MS = 60_000; // 60s

function makeKey(parts: any[]): string {
  return parts.map((p) => (typeof p === 'string' ? p : JSON.stringify(p))).join('|');
}

function cacheGet(key: string): any | undefined {
  const entry = cacheStore.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return undefined;
  }
  return entry.data;
}

function cacheSet(key: string, data: any, ttlMs: number = DEFAULT_TTL_MS): void {
  cacheStore.set(key, { data, expiresAt: Date.now() + ttlMs });
}

function invalidateProjectCache(projectId: string): void {
  const prefix = `inv:${projectId}`;
  for (const k of Array.from(cacheStore.keys())) {
    if (k.includes(prefix)) cacheStore.delete(k);
  }
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string, query: any) {
    const { groupId, search, onlyDeficit } = query || {};
    const page = Math.max(1, parseInt(String(query?.page ?? '1'), 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query?.pageSize ?? '25'), 10) || 25));

    const cacheKey = makeKey(['inv', `inv:${projectId}`, 'list', { groupId, search, onlyDeficit, page, pageSize }]);
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    const where: any = { projectId };
    if (groupId) where.groupId = groupId;
    if (search) {
      where.OR = [
        { code: { contains: String(search), mode: 'insensitive' } },
        { name: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const [total, parts] = await this.prisma.$transaction([
      this.prisma.part.count({ where }),
      this.prisma.part.findMany({
      where,
      include: { group: true },
        orderBy: [{ group: { sortOrder: 'asc' } }, { code: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

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

    const response = {
      projectId,
      items: filtered,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
    cacheSet(cacheKey, response);
    return response;
  }

  async reportDeficit(projectId: string, query?: any) {
    const page = Math.max(1, parseInt(String(query?.page ?? '1'), 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query?.pageSize ?? '25'), 10) || 25));

    const cacheKey = makeKey(['inv', `inv:${projectId}`, 'reportDeficit', { page, pageSize }]);
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    const parts = await this.prisma.part.findMany({
      where: { projectId, isActive: true },
      include: { group: true },
      orderBy: [{ group: { sortOrder: 'asc' } }, { code: 'asc' }],
    });
    const logs = await this.prisma.inventoryLog.groupBy({
      by: ['partId'],
      where: { projectId },
      _sum: { quantity: true },
    });
    const qtyByPart: Record<string, number> = {};
    for (const l of logs) qtyByPart[l.partId] = Number(l._sum.quantity || 0);

    const items = parts.map((p) => {
      const currentQuantity = qtyByPart[p.id] ?? 0;
      const requiredQuantity = Math.max(0, (p.targetQuantity ?? 0) - currentQuantity);
      return {
        id: p.id,
        code: p.code,
        name: p.name,
        group: p.group ? { id: p.group.id, name: p.group.name } : null,
        unit: p.unit,
        targetQuantity: p.targetQuantity ?? null,
        currentQuantity,
        requiredQuantity,
      };
    }).filter(i => i.requiredQuantity > 0);

    const total = items.length;
    const paged = items.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    const response = { projectId, items: paged, page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
    cacheSet(cacheKey, response);
    return response;
  }

  async reportMovements(projectId: string, query?: any) {
    const from = query?.from ? new Date(String(query.from)) : undefined;
    const to = query?.to ? new Date(String(query.to)) : undefined;
    const where: any = { projectId };
    if (from || to) where.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

    const grouped = await this.prisma.inventoryLog.groupBy({
      by: ['type'],
      where,
      _sum: { quantity: true },
    });
    const summary = grouped.map(g => ({ type: g.type, quantity: Number(g._sum.quantity || 0) }));
    return { projectId, from: from?.toISOString() ?? null, to: to?.toISOString() ?? null, summary };
  }

  async reportTopDeficit(projectId: string, query?: any) {
    const limit = Math.min(100, Math.max(1, parseInt(String(query?.limit ?? '10'), 10) || 10));
    const cacheKey = makeKey(['inv', `inv:${projectId}`, 'reportTopDeficit', { limit }]);
    const cached = cacheGet(cacheKey);
    if (cached) return cached;
    const parts = await this.prisma.part.findMany({ where: { projectId, isActive: true }, include: { group: true } });
    const logs = await this.prisma.inventoryLog.groupBy({ by: ['partId'], where: { projectId }, _sum: { quantity: true } });
    const qtyByPart: Record<string, number> = {};
    for (const l of logs) qtyByPart[l.partId] = Number(l._sum.quantity || 0);
    const deficits = parts.map((p) => {
      const currentQuantity = qtyByPart[p.id] ?? 0;
      const requiredQuantity = Math.max(0, (p.targetQuantity ?? 0) - currentQuantity);
      return {
        id: p.id,
        code: p.code,
        name: p.name,
        group: p.group ? { id: p.group.id, name: p.group.name } : null,
        unit: p.unit,
        currentQuantity,
        targetQuantity: p.targetQuantity ?? null,
        requiredQuantity,
      };
    }).filter(i => i.requiredQuantity > 0)
      .sort((a, b) => b.requiredQuantity - a.requiredQuantity)
      .slice(0, limit);
    const response = { projectId, items: deficits, limit };
    cacheSet(cacheKey, response);
    return response;
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
    const res = await this.prisma.inventoryLog.create({
      data: {
        projectId,
        partId,
        type: dto.type,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice !== undefined ? dto.unitPrice : null,
        note: dto.note,
        createdById,
      },
    });
    invalidateProjectCache(projectId);
    return res;
  }

  async getLogs(projectId: string, partId: string, query?: any) {
    const page = Math.max(1, parseInt(String(query?.page ?? '1'), 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query?.pageSize ?? '25'), 10) || 25));
    const where = { projectId, partId };
    const [total, items] = await this.prisma.$transaction([
      this.prisma.inventoryLog.count({ where }),
      this.prisma.inventoryLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
  }

  async updatePart(projectId: string, partId: string, dto: { name?: string; unit?: string; targetQuantity?: number | null; groupId?: string | null; isActive?: boolean }) {
    const part = await this.prisma.part.findFirst({ where: { id: partId, projectId } })
    if (!part) throw new Error('Part not found')
    const res = await this.prisma.part.update({ where: { id: partId }, data: dto })
    invalidateProjectCache(projectId);
    return res
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
