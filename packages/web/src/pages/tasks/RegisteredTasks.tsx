import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import { DashboardMenu } from '../../components/DashboardMenu';
import { RegisteredTasksTable } from '../../components/tables/RegisteredTasksTable';
import { api } from '../../lib/api';

interface TaskLog {
  id: string;
  task: {
    name: string;
    estimatedTime: number;
    type: 'PRODUCT' | 'GENERAL';
  };
  user: {
    name: string;
  };
  completedAt: string;
  timeSpent?: number;
  product?: {
    code: string;
  };
  statusHistory: Array<{
    status: 'APPROVED' | 'NEEDS_FIXES' | 'ON_HOLD';
    createdAt: string;
  }>;
}

export const RegisteredTasks: React.FC = () => {
  const { projectId, userId } = useParams<{ projectId: string; userId?: string }>();
  const toast = useToast();
  const [productTasks, setProductTasks] = useState<TaskLog[]>([]);
  const [generalTasks, setGeneralTasks] = useState<TaskLog[]>([]);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Fetching tasks for project:', projectId, 'and user:', userId);
        const response = await api.get(`/task-logs/project/${projectId}${userId ? `/user/${userId}` : ''}`);
        console.log('Response data:', response.data);
        const { data } = response;
        
        setProductTasks(data.filter((task: TaskLog) => task.task.type === 'PRODUCT'));
        setGeneralTasks(data.filter((task: TaskLog) => task.task.type === 'GENERAL'));

        // Якщо є userId, отримуємо ім'я користувача
        if (userId && data.length > 0) {
          const userTask = data.find((task: TaskLog) => task.user.name);
          if (userTask) {
            setUserName(userTask.user.name);
          }
        }
      } catch (error) {
        console.error('Помилка при завантаженні задач:', error);
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити зареєстровані задачі',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTasks();
  }, [projectId, userId]);

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <Heading size="lg" mb={6}>
          {userId 
            ? `Зареєстровані задачі: ${userName}`
            : 'Зареєстровані задачі проекту'
          }
        </Heading>

        <Tabs>
          <TabList>
            <Tab>Продуктові задачі</Tab>
            <Tab>Загальні задачі</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <RegisteredTasksTable tasks={productTasks} type="PRODUCT" />
            </TabPanel>
            <TabPanel>
              <RegisteredTasksTable tasks={generalTasks} type="GENERAL" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}; 