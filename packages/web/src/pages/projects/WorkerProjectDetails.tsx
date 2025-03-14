import { Box, Heading, Card, CardBody, Stack, Text, Badge, Button, HStack, VStack, SimpleGrid, Stat, StatLabel, StatNumber, Progress, CardHeader } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectStatus } from '../../types/project';
import { format, isToday } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { RegisteredTasksTable } from '../../components/tables/RegisteredTasksTable';
import { TaskRegistrationButtons } from '../../components/buttons/TaskRegistrationButtons';

interface Task {
  id: string;
  name: string;
  status: string;
  completedAt: string;
  timeSpent: number;
  createdAt: string;
  task: {
    name: string;
    estimatedTime: number;
    type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
  };
  user: {
    name: string;
  };
  registeredAt: string;
  product?: {
    code: string;
  };
  statusHistory: Array<{
    status: 'APPROVED' | 'NEEDS_FIXES' | 'ON_HOLD' | 'PENDING';
    createdAt: string;
  }>;
}

interface WorkerProjectDetailsProps {
  project: Project;
}

export const WorkerProjectDetails = ({ project }: WorkerProjectDetailsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectProgress, setProjectProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    progress: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/projects/${project.id}/tasks/user/${user?.id}`);
        setTasks(response.data);
        
        // Розрахунок прогресу
        const completed = response.data.filter((task: Task) => task.status === 'COMPLETED').length;
        const total = response.data.length;
        setProjectProgress({
          totalTasks: total,
          completedTasks: completed,
          progress: total > 0 ? (completed / total) * 100 : 0
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (project.id && user?.id) {
      fetchTasks();
    }
  }, [project.id, user?.id]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'green';
      case 'NOT_STARTED':
        return 'yellow';
      case 'ON_HOLD':
        return 'orange';
      case 'COMPLETED':
        return 'blue';
      case 'CANCELLED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'В роботі';
      case 'NOT_STARTED':
        return 'Не розпочато';
      case 'ON_HOLD':
        return 'Призупинено';
      case 'COMPLETED':
        return 'Завершено';
      case 'CANCELLED':
        return 'Скасовано';
      default:
        return status;
    }
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}г ${remainingMinutes}хв`;
  };

  const todayTasks = tasks.filter(task => isToday(new Date(task.createdAt)));

  return (
    <Box>
      <HStack justify="space-between" mb={5}>
        <Heading size="lg">{project.name}</Heading>
      </HStack>

        <Stack spacing={5}>
          <Card shadow="xl">
            <CardHeader bg="gray.300" py={2}>
              <Heading size="sm">Зареєструвати роботу</Heading>
            </CardHeader>
            <CardBody>
              <TaskRegistrationButtons projectId={project.id} />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Прогрес проекту</Heading>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text>Загальний прогрес</Text>
                    <Text>{projectProgress.progress.toFixed(0)}%</Text>
                  </HStack>
                  <Progress value={projectProgress.progress} size="sm" colorScheme="blue" />
                </Box>
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text>Виконані задачі</Text>
                    <Text>{projectProgress.completedTasks}/{projectProgress.totalTasks}</Text>
                  </HStack>
                  <Progress 
                    value={(projectProgress.completedTasks / Math.max(projectProgress.totalTasks, 1)) * 100} 
                    size="sm" 
                    colorScheme="green" 
                  />
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Моя статистика</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Stat>
                  <StatLabel>Виконано задач</StatLabel>
                  <StatNumber>{projectProgress.completedTasks}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Загальний час</StatLabel>
                  <StatNumber>
                    {formatTimeSpent(tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0))}
                  </StatNumber>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Сьогоднішні роботи</Heading>
              {isLoading ? (
                <Text color="gray.500">Завантаження...</Text>
              ) : (
                <RegisteredTasksTable 
                  tasks={todayTasks} 
                  type="PRODUCT"
                  onTaskDeleted={() => {
                    // Оновлюємо список задач після видалення
                    const fetchTasks = async () => {
                      try {
                        const response = await api.get(`/projects/${project.id}/tasks/user/${user?.id}`);
                        setTasks(response.data);
                        
                        const completed = response.data.filter((task: Task) => task.status === 'COMPLETED').length;
                        const total = response.data.length;
                        setProjectProgress({
                          totalTasks: total,
                          completedTasks: completed,
                          progress: total > 0 ? (completed / total) * 100 : 0
                        });
                      } catch (error) {
                        console.error('Error fetching tasks:', error);
                      }
                    };

                    if (project.id && user?.id) {
                      fetchTasks();
                    }
                  }}
                />
              )}
            </CardBody>
          </Card>
        </Stack>
    </Box>
  );
}; 