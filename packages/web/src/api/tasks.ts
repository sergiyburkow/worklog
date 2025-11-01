import { api } from '../lib/api'
import { Task } from '../types/task'

export interface TaskRecipeOutput { taskId: string; partId: string; perUnit: number }
export interface TaskRecipeConsumption { taskId: string; partId: string; quantityPerUnit: number }

export async function getTask(taskId: string): Promise<Task> {
  const res = await api.get(`/tasks/${taskId}`)
  return res.data
}

export async function getTaskRecipe(taskId: string): Promise<{ projectId: string; outputs: TaskRecipeOutput[]; consumptions: TaskRecipeConsumption[] }> {
  const res = await api.get(`/tasks/${taskId}/recipe`)
  return res.data
}

export async function upsertTaskRecipeOutput(taskId: string, partId: string, perUnit: number) {
  const res = await api.post(`/tasks/${taskId}/recipe/outputs`, { partId, perUnit })
  return res.data
}

export async function deleteTaskRecipeOutput(taskId: string, partId: string) {
  const res = await api.delete(`/tasks/${taskId}/recipe/outputs/${partId}`)
  return res.data
}

export async function upsertTaskRecipeConsumption(taskId: string, partId: string, quantityPerUnit: number) {
  const res = await api.post(`/tasks/${taskId}/recipe/consumptions`, { partId, quantityPerUnit })
  return res.data
}

export async function deleteTaskRecipeConsumption(taskId: string, partId: string) {
  const res = await api.delete(`/tasks/${taskId}/recipe/consumptions/${partId}`)
  return res.data
}



