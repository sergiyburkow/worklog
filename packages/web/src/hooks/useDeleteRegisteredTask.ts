import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useDeleteRegisteredTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.delete(`/task-logs/${taskId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registeredTasks'] });
    },
  });
}; 