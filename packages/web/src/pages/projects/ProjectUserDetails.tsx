import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardBody, CardHeader, Text, VStack, useToast, Heading } from '@chakra-ui/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../lib/api';
import { LogsByTasks } from './components/LogsByTasks';
import { LogsByDays } from './components/LogsByDays';
import { formatCurrency } from '../../utils/format';
import { TaskWithLogs } from '../../types/task';
import { RegisteredTask } from '../../types/task';

interface ProjectUser {
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    lastName: string | null;
    callSign: string | null;
    email: string;
    phone: string | null;
  };
}

interface TaskLogsResponse {
  tasks: TaskWithLogs[];
}

interface LogsByDaysResponse {
  logs: RegisteredTask[];
}

export const ProjectUserDetails = () => {
  const { projectId, userId } = useParams<{ projectId: string; userId: string }>();
  const [projectUser, setProjectUser] = useState<ProjectUser | null>(null);
  const [taskLogs, setTaskLogs] = useState<TaskLogsResponse | null>(null);
  const [logsByDays, setLogsByDays] = useState<LogsByDaysResponse | null>(null);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const toast = useToast();

  useEffect(() => {
    if (projectId && userId) {
      fetchData();
    }
  }, [projectId, userId]);

  const fetchData = async () => {
    try {
      const [userResponse, logsResponse, logsByDaysResponse, paymentsResponse] = await Promise.all([
        api.get<ProjectUser>(`/task-logs/project/${projectId}/user/${userId}`),
        api.get<TaskLogsResponse>(`/task-logs/project/${projectId}/logsbytasks`, {
          params: { userId }
        }),
        api.get<LogsByDaysResponse>(`/task-logs/project/${projectId}/user/${userId}/logs`),
        api.get<number>(`/projects/${projectId}/users/${userId}/payments/sum`)
      ]);

      setProjectUser(userResponse.data);
      setTaskLogs(logsResponse.data);
      setLogsByDays(logsByDaysResponse.data);
      setTotalPayments(paymentsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити дані',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const totalCost = taskLogs?.tasks.reduce((sum, task) => sum + task.totalCost, 0) || 0;

  return (
    <AdminLayout>
      <Box p={4}>
        {projectUser && (
          <VStack spacing={6} align="stretch">
            {projectUser.user.phone && (
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

            {taskLogs?.tasks && (
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Загальна вартість:</Text>
                      <Text>
                        {formatCurrency(totalCost)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Сума платежів:</Text>
                      <Text color="green.500">
                        {formatCurrency(totalPayments)}
                      </Text>
                    </Box>
                    {(totalCost - totalPayments) && (
                    <Box>
                    <Text fontWeight="bold">Різниця (борг):</Text>
                    <Text color="red.500">
                      {formatCurrency(
                        totalCost - totalPayments
                      )}
                    </Text>
                  </Box>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardBody>
              {taskLogs?.tasks && <LogsByTasks tasks={taskLogs.tasks} />}
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
              <Heading size="md">Реєстрації по днях</Heading>
              </CardHeader>
              <CardBody>
              {logsByDays?.logs && <LogsByDays logs={logsByDays.logs} />}
              </CardBody>
            </Card>
          </VStack>
        )}
      </Box>
    </AdminLayout>
  );
}; 