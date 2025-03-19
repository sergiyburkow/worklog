import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardBody, Heading, Text, VStack, Button, Spinner, HStack, Badge, useToast } from '@chakra-ui/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../lib/api';
import { User } from '../../types/user';
import { Task } from '../../types/task';
import { LogsByTasks } from './components/LogsByTasks';
import { LogsByDays } from './components/LogsByDays';
import { RegisteredTask } from '../../types/task';

interface TaskWithLogs {
  task: Task;
  logsCount: number;
  totalTimeSpent: number;
}

interface ProjectUser {
  user: User;
  role: string;
}

interface LogsByTasksData {
  tasks: TaskWithLogs[];
}

interface LogsByDaysData {
  logs: RegisteredTask[];
}

export const ProjectUserDetails = () => {
  const { projectId, userId } = useParams<{ projectId: string; userId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [projectUser, setProjectUser] = useState<ProjectUser | null>(null);
  const [taskLogs, setTaskLogs] = useState<LogsByTasksData | null>(null);
  const [logsByDays, setLogsByDays] = useState<LogsByDaysData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Отримуємо дані про користувача
        const userResponse = await api.get<ProjectUser>(`/task-logs/project/${projectId}/user/${userId}`);
        setProjectUser(userResponse.data);

        // Отримуємо дані про логи задач
        const logsResponse = await api.get<LogsByTasksData>(`/task-logs/project/${projectId}/logsbytasks`, {
          params: { userId }
        });
        setTaskLogs(logsResponse.data);

        // Отримуємо дані про логи по днях
        const logsByDaysResponse = await api.get<LogsByDaysData>(`/task-logs/project/${projectId}/user/${userId}/logs`);
        setLogsByDays(logsByDaysResponse.data);
      } catch (error) {
        toast({
          title: 'Помилка',
          description: 'Помилка при завантаженні даних',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId && userId) {
      fetchData();
    }
  }, [projectId, userId, toast]);

  return (
    <AdminLayout>
      <Box p={5}>
        <HStack justify="space-between" mb={5}>
          <VStack align="start" spacing={1}>
            <Heading size="lg">
              {projectUser?.user?.name}
              {projectUser?.user?.callSign && <Box as="span" color="gray.500" fontSize="md" ml={2}>"{projectUser.user.callSign}"</Box>}
              {projectUser?.user?.lastName && <Box as="span" ml={2}>{projectUser.user.lastName}</Box>}
            </Heading>
            {projectUser?.role && <Badge>{projectUser.role}</Badge>}
          </VStack>
          <Button onClick={() => navigate(`/projects/${projectId}`)}>
            Повернутися до проекту
          </Button>
        </HStack>

        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <Spinner size="xl" />
          </Box>
        ) : (
          <VStack spacing={6} align="stretch">
            {projectUser?.user?.phone && (
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Телефон:</Text>
                      <Text>{projectUser.user.phone}</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {taskLogs?.tasks && <LogsByTasks tasks={taskLogs.tasks} />}
            {logsByDays?.logs && <LogsByDays logs={logsByDays.logs} />}
          </VStack>
        )}
      </Box>
    </AdminLayout>
  );
}; 