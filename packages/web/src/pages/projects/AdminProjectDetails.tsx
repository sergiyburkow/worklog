import { Box, Heading, Card, CardBody, Stack, Text, Badge, Button, HStack, VStack, CardHeader } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { Project } from '../../types/project';
import { format, isToday, parseISO, startOfDay, endOfDay } from 'date-fns';
import { uk } from 'date-fns/locale';
import { TaskRegistrationButtons } from '../../components/buttons/TaskRegistrationButtons';
import { RegisteredTasksTable } from '../../components/tables/RegisteredTasksTable';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { LogsByTasks } from './components/LogsByTasks';
import { Task } from '../../types/task';

interface RegisteredTask {
  id: string;
  task: {
    name: string;
    estimatedTime: number;
    type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
  };
  user: {
    name: string;
  };
  completedAt: string | null;
  registeredAt: string;
  timeSpent?: number;
  quantity?: number;
  product?: {
    id: string;
    code: string;
  };
  statusHistory: Array<{
    status: 'APPROVED' | 'NEEDS_FIXES' | 'ON_HOLD' | 'PENDING';
    createdAt: string;
  }>;
}

interface TaskWithLogs {
  task: Task;
  logsCount: number;
  totalTimeSpent: number;
}

interface LogsByTasksData {
  tasks: TaskWithLogs[];
}

interface ProjectTasksSummary {
  tasks: TaskWithLogs[];
}

interface AdminProjectDetailsProps {
  project: Project;
}

export const AdminProjectDetails = ({ project }: AdminProjectDetailsProps) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<RegisteredTask[]>([]);
  const [taskLogs, setTaskLogs] = useState<LogsByTasksData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const today = new Date();
        const params = new URLSearchParams({
          registeredFrom: startOfDay(today).toISOString(),
          registeredTo: endOfDay(today).toISOString()
        });

        const response = await api.get<RegisteredTask[]>(`/task-logs/project/${project.id}?${params.toString()}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get(`/products/project/${project.id}`);
        setProductsCount(response.data.length);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchTaskLogs = async () => {
      try {
        const response = await api.get<LogsByTasksData>(`/task-logs/project/${project.id}/logsbytasks`);
        setTaskLogs(response.data);
      } catch (error) {
        console.error('Error fetching task logs:', error);
      }
    };

    if (project.id) {
      fetchTasks();
      fetchProducts();
      fetchTaskLogs();
    }
  }, [project.id]);

  const todayTasks = tasks.filter(task => {
    if (!task.registeredAt) return false;
    const taskDate = parseISO(task.registeredAt);
    const today = new Date();
    return taskDate >= startOfDay(today) && taskDate <= endOfDay(today);
  });

  return (
    <Box>
      <HStack justify="space-between" mb={5}>
        <Heading size="lg">{project.name}</Heading>
        <HStack spacing={3}>
          <Button colorScheme='gray' onClick={() => navigate(`/projects/${project.id}/payments`)}>
            Платежі
          </Button>

          <Button colorScheme='green' onClick={() => navigate(`/projects/${project.id}/products`)}>
            Продукти проекту
          </Button>
          <Button colorScheme="orange" onClick={() => navigate(`/projects/${project.id}/tasks`)}>
            Задачі проекту
          </Button>
          <Button colorScheme="blue" onClick={() => navigate(`/projects/${project.id}/edit`)}>
            Редагувати проект
          </Button>
        </HStack>
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
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold">Статус:</Text>
                <Badge colorScheme={project.status === 'IN_PROGRESS' ? 'green' : 'yellow'}>
                  {project.status === 'IN_PROGRESS' ? 'В роботі' : 'Не розпочато'}
                </Badge>
              </HStack>
              
              <HStack justify="space-between">
                <Text fontWeight="bold">Клієнт:</Text>
                <Text>{project.client.name}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="bold">Дата початку:</Text>
                <Text>
                  {format(new Date(project.startDate), 'dd MMMM yyyy', { locale: uk })}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="bold">Дата завершення:</Text>
                <Text>
                  {format(new Date(project.deadline), 'dd MMMM yyyy', { locale: uk })}
                </Text>
              </HStack>

              {project.quantity && (
                <HStack justify="space-between">
                  <Text fontWeight="bold">Кількість:</Text>
                  <Text>{project.quantity} / {productsCount}</Text>
                </HStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        {taskLogs?.tasks && <LogsByTasks tasks={taskLogs.tasks} />}

        <Card>
          <CardBody>
              <HStack justify="space-between">
                <Heading size="md">Зареєстровані задачі</Heading>
                <Button 
                colorScheme="blue"
                onClick={() => navigate(`/projects/${project.id}/tasks/registered`)}
                >Всі задачі</Button>

              </HStack>
            {isLoading ? (
              <Text color="gray.500">Завантаження...</Text>
            ) : (
              <RegisteredTasksTable 
                tasks={todayTasks} 
                type="PRODUCT"
                onTaskDeleted={() => {
                  const fetchTasks = async () => {
                    try {
                      const response = await api.get<RegisteredTask[]>(`/task-logs/project/${project.id}/tasks`);
                      setTasks(response.data);
                    } catch (error) {
                      console.error('Error fetching tasks:', error);
                    }
                  };

                  if (project.id) {
                    fetchTasks();
                  }
                }}
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Учасники проекту</Heading>
            <VStack align="stretch" spacing={3}>
              {project.users.map(user => (
                <HStack key={user.userId} justify="space-between">
                  <Link to={`/projects/${project.id}/users/${user.userId}`}>
                    {user.user.name}
                    {user.user.callSign && <Text as="span" color="gray.500" ml={2}>"{user.user.callSign}"</Text>}
                    {user.user.lastName && <Text as="span" ml={2}>{user.user.lastName}</Text>}
                  </Link>
                  <Badge>{user.role}</Badge>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};