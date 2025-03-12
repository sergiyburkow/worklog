import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Grid,
  GridItem,
  Button,
  TableContainer,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';

enum ProjectStatus {
  PLANNED = 'PLANNED',
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  SHIPPED = 'SHIPPED',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED',
}

enum ProjectUserRole {
  MANAGER = 'MANAGER',
  QA = 'QA',
  ENGINEER = 'ENGINEER',
  PADAWAN = 'PADAWAN',
}

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNED]: 'Планується',
  [ProjectStatus.NEW]: 'Новий',
  [ProjectStatus.IN_PROGRESS]: 'В роботі',
  [ProjectStatus.ON_HOLD]: 'На паузі',
  [ProjectStatus.COMPLETED]: 'Виконаний',
  [ProjectStatus.SHIPPED]: 'Відвантажений',
  [ProjectStatus.REJECTED]: 'Відхилений',
  [ProjectStatus.FINISHED]: 'Завершений',
};

const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNED]: 'gray',
  [ProjectStatus.NEW]: 'blue',
  [ProjectStatus.IN_PROGRESS]: 'green',
  [ProjectStatus.ON_HOLD]: 'yellow',
  [ProjectStatus.COMPLETED]: 'teal',
  [ProjectStatus.SHIPPED]: 'purple',
  [ProjectStatus.REJECTED]: 'red',
  [ProjectStatus.FINISHED]: 'green',
};

const PROJECT_USER_ROLE_LABELS: Record<ProjectUserRole, string> = {
  [ProjectUserRole.MANAGER]: 'Менеджер',
  [ProjectUserRole.QA]: 'Тестувальник',
  [ProjectUserRole.ENGINEER]: 'Інженер',
  [ProjectUserRole.PADAWAN]: 'Падаван',
};

const PROJECT_USER_ROLE_COLORS: Record<ProjectUserRole, string> = {
  [ProjectUserRole.MANAGER]: 'green',
  [ProjectUserRole.QA]: 'purple',
  [ProjectUserRole.ENGINEER]: 'blue',
  [ProjectUserRole.PADAWAN]: 'orange',
};

interface ProjectUser {
  userId: string;
  role: ProjectUserRole;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Project {
  id: string;
  name: string;
  clientId: string;
  client: {
    name: string;
  };
  startDate: string;
  deadline: string;
  actualEndDate: string | null;
  status: ProjectStatus;
  quantity?: number;
  users: ProjectUser[];
}

export const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані проекту',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout>
        <Box p={5} display="flex" justifyContent="center" alignItems="center" minH="300px">
          <Spinner size="xl" />
        </Box>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <Box p={5}>
          <Text>Проект не знайдено</Text>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={5}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg">{project.name}</Heading>
              <Badge colorScheme={PROJECT_STATUS_COLORS[project.status]} fontSize="md" px={3} py={1}>
                {PROJECT_STATUS_LABELS[project.status]}
              </Badge>
          </HStack>
          <HStack spacing={4}>
              <Button
                colorScheme="purple"
                size="lg"
                onClick={() => navigate(`/projects/${id}/tasks`)}
              >
                Задачі проекту
              </Button>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => navigate(`/projects/${id}/tasks/register/product`)}
              >
                Зареєструвати виконання
              </Button>
              <Button
                colorScheme="orange"
                size="lg"
                onClick={() => navigate(`/projects/${id}/tasks/register/general`)}
              >
                Зареєструвати загальну задачу
              </Button>
              <Button
                colorScheme="teal"
                size="lg"
                onClick={() => navigate(`/projects/${id}/tasks/registered`)}
              >
                Зареєстровані задачі
              </Button>
          </HStack>

          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <Card>
                <CardHeader>
                  <Heading size="md">Основна інформація</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Stat>
                      <StatLabel>Клієнт</StatLabel>
                      <StatNumber fontSize="lg">{project.client.name}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Кількість</StatLabel>
                      <StatNumber fontSize="lg">{project.quantity || '-'}</StatNumber>
                    </Stat>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card>
                <CardHeader>
                  <Heading size="md">Терміни</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Stat>
                      <StatLabel>Дата початку</StatLabel>
                      <StatNumber fontSize="lg">
                        {new Date(project.startDate).toLocaleDateString()}
                      </StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Дедлайн</StatLabel>
                      <StatNumber fontSize="lg">
                        {new Date(project.deadline).toLocaleDateString()}
                      </StatNumber>
                    </Stat>
                    {project.actualEndDate && (
                      <Stat>
                        <StatLabel>Фактична дата завершення</StatLabel>
                        <StatNumber fontSize="lg">
                          {new Date(project.actualEndDate).toLocaleDateString()}
                        </StatNumber>
                      </Stat>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Card>
            <CardHeader>
              <Heading size="md">Учасники проекту</Heading>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Ім'я</Th>
                      <Th>Email</Th>
                      <Th>Роль</Th>
                      <Th>Дії</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {project.users.map((user) => (
                      <Tr key={user.userId}>
                        <Td>{user.user.name}</Td>
                        <Td>{user.user.email}</Td>
                        <Td>
                          <Badge colorScheme={PROJECT_USER_ROLE_COLORS[user.role]}>
                            {PROJECT_USER_ROLE_LABELS[user.role]}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="teal"
                              onClick={() => navigate(`/projects/${id}/tasks/registered/user/${user.userId}`)}
                            >
                              Зареєстровані задачі
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </AdminLayout>
  );
}; 