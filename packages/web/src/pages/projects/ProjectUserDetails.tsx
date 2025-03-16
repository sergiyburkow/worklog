import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardBody, Heading, Text, VStack, Button, Spinner, HStack, Badge, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../lib/api';
import { User } from '../../types/user';
import { Task, TaskType, TASK_TYPE_LABELS } from '../../types/task';

interface TaskWithLogs {
  task: Task;
  logsCount: number;
  totalTimeSpent: number;
}

export const ProjectUserDetails = () => {
  const { projectId, userId } = useParams<{ projectId: string; userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskWithLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userResponse, tasksResponse, logsResponse] = await Promise.all([
          api.get<User>(`/users/${userId}`),
          api.get<Task[]>(`/tasks/project/${projectId}`),
          api.get<Array<{ taskId: string; logsCount: number; timeSpent: number }>>(`/task-logs/project/${projectId}/user/${userId}/summary`)
        ]);

        setUser(userResponse.data);

        // Створюємо мапу для логів по задачам
        const logsMap = logsResponse.data.reduce((acc, log) => {
          acc[log.taskId] = {
            count: log.logsCount,
            totalTime: log.timeSpent
          };
          return acc;
        }, {} as Record<string, { count: number; totalTime: number }>);

        // Комбінуємо задачі з їх логами
        const tasksWithLogs = tasksResponse.data.map(task => ({
          task,
          logsCount: logsMap[task.id]?.count || 0,
          totalTimeSpent: logsMap[task.id]?.totalTime || 0
        }));

        setTasks(tasksWithLogs);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Помилка при завантаженні даних');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId && userId) {
      fetchData();
    }
  }, [projectId, userId]);

  if (error) {
    return (
      <AdminLayout>
        <Box p={5}>
          <Text color="red.500">{error}</Text>
          <Button mt={4} onClick={() => navigate(`/projects/${projectId}`)}>
            Повернутися до проекту
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={5}>
        <HStack justify="space-between" mb={5}>
          <Heading size="lg">Деталі учасника проекту</Heading>
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
            {user && (
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Ім'я:</Text>
                      <Text>{user.name}</Text>
                    </Box>

                    {user.lastName && (
                      <Box>
                        <Text fontWeight="bold">Прізвище:</Text>
                        <Text>{user.lastName}</Text>
                      </Box>
                    )}

                    {user.phone && (
                      <Box>
                        <Text fontWeight="bold">Телефон:</Text>
                        <Text>{user.phone}</Text>
                      </Box>
                    )}

                    {user.callSign && (
                      <Box>
                        <Text fontWeight="bold">Позивний:</Text>
                        <Text>{user.callSign}</Text>
                      </Box>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardBody>
                <Heading size="md" mb={4}>Задачі та реєстрації</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Назва задачі</Th>
                      <Th>Тип</Th>
                      <Th isNumeric>Кількість реєстрацій</Th>
                      <Th isNumeric>Загальний час (год)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tasks.map(({ task, logsCount, totalTimeSpent }) => (
                      <Tr key={task.id}>
                        <Td>{task.name}</Td>
                        <Td>
                          <Badge colorScheme={task.type === TaskType.PRODUCT ? 'blue' : task.type === TaskType.GENERAL ? 'orange' : 'cyan'}>
                            {TASK_TYPE_LABELS[task.type]}
                          </Badge>
                        </Td>
                        <Td isNumeric>{logsCount}</Td>
                        <Td isNumeric>{totalTimeSpent}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </VStack>
        )}
      </Box>
    </AdminLayout>
  );
}; 