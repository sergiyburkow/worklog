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
  useDisclosure,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { RegisteredTasksTable } from '../../components/tables/RegisteredTasksTable';

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
  isActive: boolean;
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
  const [todayTasks, setTodayTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<ProjectUser | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [isRoleUpdateLoading, setIsRoleUpdateLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ProjectUserRole | null>(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditRoleOpen, onOpen: onEditRoleOpen, onClose: onEditRoleClose } = useDisclosure();
  const toast = useToast();

  const fetchTodayTasks = async () => {
    if (!id) return;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response = await api.get(`/task-logs/project/${id}`, {
        params: {
          startDate: today.toISOString(),
          endDate: new Date().toISOString(),
        },
      });
      setTodayTasks(response.data);
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити задачі за сьогодні',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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

  useEffect(() => {
    Promise.all([fetchProject(), fetchTodayTasks()]);
  }, [id]);

  const handleDeleteClick = (user: ProjectUser) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser || !id) return;

    setIsDeleteLoading(true);
    try {
      await api.delete(`/projects/${id}/users/${selectedUser.userId}`);
      await fetchProject();
      onDeleteClose();
      
      toast({
        title: 'Успіх',
        description: 'Користувача видалено з проекту',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Помилка',
        description: error.response?.data?.message || 'Не вдалося видалити користувача з проекту',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleToggleActive = async (user: ProjectUser) => {
    if (!id) return;

    setIsToggleLoading(true);
    try {
      await api.put(`/projects/${id}/users/${user.userId}/toggle-active`, {
        isActive: !user.isActive
      });
      await fetchProject();
      
      toast({
        title: 'Успіх',
        description: `Користувача ${user.isActive ? 'деактивовано' : 'активовано'}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Помилка',
        description: error.response?.data?.message || 'Не вдалося змінити статус користувача',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsToggleLoading(false);
    }
  };

  const handleEditRoleClick = (user: ProjectUser) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    onEditRoleOpen();
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser || !selectedRole || !id) return;

    setIsRoleUpdateLoading(true);
    try {
      await api.put(`/projects/${id}/users/${selectedUser.userId}/role`, {
        role: selectedRole
      });
      await fetchProject();
      onEditRoleClose();
      
      toast({
        title: 'Успіх',
        description: 'Роль користувача оновлено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Помилка',
        description: error.response?.data?.message || 'Не вдалося оновити роль користувача',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsRoleUpdateLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Box p={8} display="flex" justifyContent="center">
          <Spinner size="xl" />
        </Box>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <Box p={8}>
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
                colorScheme="cyan"
                size="lg"
                onClick={() => navigate(`/projects/${id}/tasks/register/intermediate`)}
              >
                Зареєструвати проміжну задачу
              </Button>
          </HStack>

          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={1}>
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
                <CardBody>
                  <VStack align="stretch" spacing={1}>
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
              <HStack justify="space-between" align="center">
              <Heading size="md">Сьогоднішні задачі</Heading>
              <Button 
                colorScheme="blue" 
                variant="outline"
                onClick={() => navigate(`/projects/${id}/tasks/registered`)}
              >
                Всі зареєстровані задачі
              </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <RegisteredTasksTable 
                tasks={todayTasks} 
                type="PRODUCT" 
                onTaskDeleted={fetchTodayTasks}
              />
            </CardBody>
          </Card>

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
                      <Th>Статус</Th>
                      <Th>Дії</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {project.users.map((user) => (
                      <Tr key={user.userId}>
                        <Td>{user.user.name}</Td>
                        <Td>{user.user.email}</Td>
                        <Td>
                          <Badge
                            colorScheme={PROJECT_USER_ROLE_COLORS[user.role]}
                            cursor="pointer"
                            onClick={() => handleEditRoleClick(user)}
                          >
                            {PROJECT_USER_ROLE_LABELS[user.role]}
                          </Badge>
                        </Td>
                        <Td>
                          <Switch
                            isChecked={user.isActive}
                            onChange={() => handleToggleActive(user)}
                            isDisabled={isToggleLoading}
                          />
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteClick(user)}
                          >
                            Видалити
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </VStack>

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleteLoading}
          title="Видалення учасника"
          message={`Ви впевнені, що хочете видалити користувача ${selectedUser?.user.name} з проекту?`}
        />

        <Modal isOpen={isEditRoleOpen} onClose={onEditRoleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Зміна ролі</ModalHeader>
            <ModalBody>
              <Select
                value={selectedRole || ''}
                onChange={(e) => setSelectedRole(e.target.value as ProjectUserRole)}
              >
                {Object.entries(PROJECT_USER_ROLE_LABELS).map(([role, label]) => (
                  <option key={role} value={role}>
                    {label}
                  </option>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditRoleClose}>
                Скасувати
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleRoleUpdate}
                isLoading={isRoleUpdateLoading}
              >
                Зберегти
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </AdminLayout>
  );
}; 