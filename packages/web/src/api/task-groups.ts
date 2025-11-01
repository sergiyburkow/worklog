import { api } from '../lib/api'

export interface TaskGroup {
  id: string
  name: string
  description?: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  taskCount?: number
}

export interface TaskGroupsResponse {
  groups: TaskGroup[]
}

export async function getTaskGroups(projectId: string): Promise<TaskGroupsResponse> {
  const res = await api.get<TaskGroupsResponse>(`/projects/${projectId}/task-groups`)
  return res.data
}

export async function createTaskGroup(projectId: string, data: { name: string; description?: string; sortOrder?: number }): Promise<TaskGroup> {
  const res = await api.post<TaskGroup>(`/projects/${projectId}/task-groups`, data)
  return res.data
}

export async function updateTaskGroup(projectId: string, groupId: string, data: { name?: string; description?: string; sortOrder?: number }): Promise<TaskGroup> {
  const res = await api.put<TaskGroup>(`/projects/${projectId}/task-groups/${groupId}`, data)
  return res.data
}

export async function deleteTaskGroup(projectId: string, groupId: string): Promise<void> {
  await api.delete(`/projects/${projectId}/task-groups/${groupId}`)
}

