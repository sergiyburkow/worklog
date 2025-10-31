import { api } from '../lib/api'

export interface InventoryItem {
  id: string
  code: string
  name?: string | null
  unit?: string | null
  targetQuantity?: number | null
  currentQuantity: number
  requiredQuantity: number
  isActive: boolean
  group: { id: string; name: string; sortOrder: number } | null
}

export interface InventoryResponse {
  projectId: string
  items: InventoryItem[]
  page?: number
  pageSize?: number
  total?: number
  totalPages?: number
}

export async function getInventory(projectId: string, params?: Record<string, any>) {
  const res = await api.get<InventoryResponse>(`/projects/${projectId}/inventory`, { params })
  return res.data
}

export async function createPart(projectId: string, data: { name: string; description?: string; unit?: string; targetQuantity?: number; groupId?: string }) {
  const res = await api.post(`/projects/${projectId}/inventory/parts`, data)
  return res.data
}

export type InventoryLogType = 'PURCHASE' | 'PRODUCTION' | 'ADJUSTMENT'

export async function addInventoryLog(projectId: string, partId: string, data: { type: InventoryLogType; quantity: number; unitPrice?: number; note?: string }) {
  const res = await api.post(`/projects/${projectId}/inventory/parts/${partId}/logs`, data)
  return res.data
}

export interface InventoryLogEntry {
  id: string
  type: InventoryLogType
  quantity: number
  unitPrice?: number | null
  note?: string | null
  createdAt: string
}

export interface LogsResponse {
  items: InventoryLogEntry[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export async function getPartLogs(projectId: string, partId: string, params?: Record<string, any>) {
  const res = await api.get<LogsResponse>(`/projects/${projectId}/inventory/parts/${partId}/logs`, { params })
  return res.data
}

export interface PartGroup { id: string; name: string; description?: string | null; sortOrder: number }

export async function getPartGroups(projectId: string) {
  const res = await api.get<{ groups: PartGroup[] }>(`/projects/${projectId}/inventory/groups`)
  return res.data
}

export async function createPartGroup(projectId: string, data: { name: string; description?: string; sortOrder?: number }) {
  const res = await api.post(`/projects/${projectId}/inventory/groups`, data)
  return res.data
}

export async function updatePartGroup(projectId: string, groupId: string, data: { name?: string; description?: string; sortOrder?: number }) {
  const res = await api.post(`/projects/${projectId}/inventory/groups/${groupId}`, data)
  return res.data
}

export async function updatePart(projectId: string, partId: string, data: { targetQuantity?: number | null; name?: string; unit?: string; groupId?: string; isActive?: boolean }) {
  const res = await api.patch(`/projects/${projectId}/inventory/parts/${partId}`, data)
  return res.data
}

export async function getUnits(projectId: string) {
  const res = await api.get<{ units: readonly string[] }>(`/projects/${projectId}/inventory/units`)
  return res.data
}

export async function getDeficitReport(projectId: string, params?: Record<string, any>) {
  const res = await api.get<InventoryResponse>(`/projects/${projectId}/inventory/reports/deficit`, { params })
  return res.data
}

export async function getMovementsReport(projectId: string, params?: { from?: string; to?: string }) {
  const res = await api.get<{ projectId: string; from: string | null; to: string | null; summary: { type: InventoryLogType; quantity: number }[] }>(`/projects/${projectId}/inventory/reports/movements`, { params })
  return res.data
}

export async function getTopDeficitReport(projectId: string, params?: { limit?: number }) {
  const res = await api.get<{ projectId: string; items: InventoryItem[]; limit: number }>(`/projects/${projectId}/inventory/reports/top-deficit`, { params })
  return res.data
}
