import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Heading, useToast } from '@chakra-ui/react';
import { TaskRegisterForm } from '../../components/forms/TaskRegisterForm';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export const TaskRegister: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user } = useAuth();

  const isProductTask = location.pathname.includes('/register/product');

  if (!projectId || !user) {
    return null;
  }

  const handleSubmit = async (formData: {
    productCode: string;
    taskId: string;
    completedAt: string;
    userId?: string;
    timeSpent?: string;
    hours?: string;
    minutes?: string;
  }) => {
    try {
      const payload = {
        projectId,
        taskId: formData.taskId,
        completedAt: formData.completedAt,
        userId: formData.userId,
        type: isProductTask ? 'PRODUCT' : 'GENERAL',
        ...(isProductTask 
          ? { productCode: formData.productCode }
          : { timeSpent: parseFloat(formData.timeSpent || '0') }
        )
      };

      await api.post('/task-logs/register', payload);
      toast({
        title: 'Успіх',
        description: 'Задачу успішно зареєстровано',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(`/projects/${projectId}`);
    } catch (error: any) {
      console.error('Помилка при реєстрації задачі:', error);
      toast({
        title: 'Помилка',
        description: error.response?.data?.message || 'Не вдалося зареєструвати задачу',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6}>
        {isProductTask ? 'Реєстрація виконаної продуктової задачі' : 'Реєстрація виконаної загальної задачі'}
      </Heading>
      <TaskRegisterForm
        projectId={projectId}
        currentUser={{
          id: user.id,
          role: user.role
        }}
        onSubmit={handleSubmit}
        isProductTask={isProductTask}
      />
    </Container>
  );
}; 