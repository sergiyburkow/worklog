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
}

export async function getInventory(projectId: string, params?: Record<string, string>) {
  const res = await api.get<InventoryResponse>(`/projects/${projectId}/inventory`, { params })
  return res.data
}

export async function createPart(projectId: string, data: { name: string; description?: string; unit?: string; targetQuantity?: number; groupId?: string }) {
  const res = await api.post(`/projects/${projectId}/inventory/parts`, data)
  return res.data
}

export type InventoryLogType = 'PURCHASE' | 'PRODUCTION' | 'ADJUSTMENT'

export async function addInventoryLog(projectId: string, partId: string, data: { type: InventoryLogType; quantity: number; note?: string }) {
  const res = await api.post(`/projects/${projectId}/inventory/parts/${partId}/logs`, data)
  return res.data
}

export interface InventoryLogEntry {
  id: string
  type: InventoryLogType
  quantity: number
  note?: string | null
  createdAt: string
}

export async function getPartLogs(projectId: string, partId: string) {
  const res = await api.get<{ logs: InventoryLogEntry[] }>(`/projects/${projectId}/inventory/parts/${partId}/logs`)
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
