import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Select,
  HStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { DashboardMenu } from '../../components/DashboardMenu';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { GlobalFormWrapper } from '../../components/ui/GlobalFormWrapper';

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

enum ProjectUserRole {
  MANAGER = 'MANAGER',
  QA = 'QA',
  ENGINEER = 'ENGINEER',
  PADAWAN = 'PADAWAN',
}

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
}

interface ProjectData {
  name: string;
  clientId: string;
  startDate: string;
  deadline: string;
  projectUsers: ProjectUser[];
  status: ProjectStatus;
  quantity?: number;
}

interface Client {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  lastName?: string;
  callSign?: string;
}

// Функція форматування імені користувача
const formatUserName = (user: User) => {
  const parts = [user.name];
  
  if (user.callSign) {
    parts.splice(1, 0, `"${user.callSign}"`);
  }
  
  if (user.lastName) {
    parts.push(user.lastName);
  }
  
  return parts.join(' ');
};

export const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    clientId: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date().toISOString().split('T')[0],
    projectUsers: [],
    status: ProjectStatus.PLANNED,
    quantity: undefined,
  });
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<ProjectUserRole>(ProjectUserRole.ENGINEER);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, usersResponse] = await Promise.all([
          api.get('/clients'),
          api.get('/users'),
        ]);
        
        setClients(clientsResponse.data);
        setUsers(usersResponse.data);

        if (id) {
          const projectResponse = await api.get(`/projects/${id}`);
          const project = projectResponse.data;
          setProjectData({
            name: project.name,
            clientId: project.clientId,
            startDate: project.startDate.split('T')[0],
            deadline: project.deadline.split('T')[0],
            projectUsers: project.users.map((u: any) => ({
              userId: u.userId,
              role: u.role,
            })),
            status: project.status as ProjectStatus,
            quantity: project.quantity,
          });
          
          // Оновити список користувачів з даними проекту
          const projectUsers = project.users.map((pu: any) => ({
            id: pu.user.id,
            name: pu.user.name,
            lastName: pu.user.lastName,
            callSign: pu.user.callSign,
          }));
          setUsers(prevUsers => {
            // Об'єднати користувачів з проекту з загальним списком
            const existingUserIds = new Set(prevUsers.map(u => u.id));
            const newUsers = projectUsers.filter(pu => !existingUserIds.has(pu.id));
            return [...prevUsers, ...newUsers];
          });
        }
      } catch (error) {
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (id) {
        await api.put(`/projects/${id}`, projectData);
      } else {
        await api.post('/projects', projectData);
      }

      toast({
        title: 'Успіх',
        description: id ? 'Проект оновлено' : 'Проект створено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/projects');
    } catch (error) {
      toast({
        title: 'Помилка',
        description: id ? 'Не вдалося оновити проект' : 'Не вдалося створити проект',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    if (!selectedUser) return;

    setProjectData(prev => ({
      ...prev,
      projectUsers: [
        ...prev.projectUsers,
        { userId: selectedUser, role: selectedRole },
      ],
    }));

    setSelectedUser('');
  };

  const handleRemoveUser = (userId: string) => {
    setProjectData(prev => ({
      ...prev,
      projectUsers: prev.projectUsers.filter(u => u.userId !== userId),
    }));
  };

  return (
    <AdminLayout>
      <Box p={5}>
        <Heading mb={6}>{id ? 'Редагування проекту' : 'Новий проект'}</Heading>
        <GlobalFormWrapper>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Назва проекту</FormLabel>
                <Input
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Кількість шт</FormLabel>
                <Input
                  type="number"
                  min={0}
                  value={projectData.quantity || ''}
                  onChange={(e) => setProjectData({ 
                    ...projectData, 
                    quantity: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  placeholder="Введіть кількість"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Клієнт</FormLabel>
                <Select
                  value={projectData.clientId}
                  onChange={(e) => setProjectData({ ...projectData, clientId: e.target.value })}
                >
                  <option value="">Оберіть клієнта</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Дата початку</FormLabel>
                <Input
                  type="date"
                  value={projectData.startDate}
                  onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Дедлайн</FormLabel>
                <Input
                  type="date"
                  value={projectData.deadline}
                  onChange={(e) => setProjectData({ ...projectData, deadline: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Статус</FormLabel>
                <Select
                  value={projectData.status}
                  onChange={(e) => setProjectData({ ...projectData, status: e.target.value as ProjectStatus })}
                >
                  {Object.entries(PROJECT_STATUS_LABELS).map(([status, label]) => (
                    <option key={status} value={status}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Учасники проекту</FormLabel>
                <HStack>
                  <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    placeholder="Оберіть користувача"
                  >
                    {users
                      .filter(user => !projectData.projectUsers.some(pu => pu.userId === user.id))
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {formatUserName(user)}
                        </option>
                      ))}
                  </Select>
                  <Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as ProjectUserRole)}
                  >
                    {Object.entries(PROJECT_USER_ROLE_LABELS).map(([role, label]) => (
                      <option key={role} value={role}>
                        {label}
                      </option>
                    ))}
                  </Select>
                  <Button onClick={handleAddUser}>
                    Додати
                  </Button>
                </HStack>
              </FormControl>

              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Ім'я</Th>
                    <Th>Роль</Th>
                    <Th>Дії</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {projectData.projectUsers.map((projectUser) => {
                    const user = users.find(u => u.id === projectUser.userId);
                    return (
                      <Tr key={projectUser.userId}>
                        <Td>{user ? formatUserName(user) : 'Невідомий користувач'}</Td>
                        <Td>
                          <Badge colorScheme={PROJECT_USER_ROLE_COLORS[projectUser.role]}>
                            {PROJECT_USER_ROLE_LABELS[projectUser.role]}
                          </Badge>
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleRemoveUser(projectUser.userId)}
                          >
                            Видалити
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>

              <HStack spacing={4} justify="flex-end">
                <Button variant="ghost" onClick={() => navigate('/projects')}>
                  Скасувати
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isLoading}
                  width="100%"
                >
                  {id ? 'Зберегти' : 'Створити'}
                </Button>
              </HStack>
            </VStack>
          </form>
        </GlobalFormWrapper>
      </Box>
    </AdminLayout>
  );
}; 