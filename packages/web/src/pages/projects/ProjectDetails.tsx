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
  Flex,
  Wrap,
  WrapItem,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { RegisteredTasksTable } from '../../components/tables/RegisteredTasksTable';
import { DeleteIcon, EditIcon, ViewIcon, AddIcon, TimeIcon, SettingsIcon } from '@chakra-ui/icons';
import { TableActions } from '../../components/ui/TableActions';

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
      <Box p={[3, 4, 5]} width="100%">
        <VStack spacing={6} align="stretch" width="100%">
          <Flex 
            direction={['column', 'row']} 
            justify="space-between" 
            align={['start', 'center']}
            gap={4}
          >
            <Heading size={['md', 'lg']}>{project.name}</Heading>
            <Wrap spacing={2}>
              <WrapItem>
                <Badge colorScheme={PROJECT_STATUS_COLORS[project.status]} p={2}>
                  {PROJECT_STATUS_LABELS[project.status]}
                </Badge>
              </WrapItem>
              <WrapItem>
                <Tooltip label="Задачі проекту">
                  <IconButton
                    aria-label="Задачі проекту"
                    icon={<ViewIcon />}
                    colorScheme="purple"
                    size="sm"
                    onClick={() => navigate(`/projects/${id}/tasks`)}
                  />
                </Tooltip>
              </WrapItem>
              <WrapItem>
                <Tooltip label="Редагувати проект">
                  <IconButton
                    aria-label="Редагувати проект"
                    icon={<EditIcon />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => navigate(`/projects/${id}/edit`)}
                  />
                </Tooltip>
              </WrapItem>
            </Wrap>
          </Flex>

          <Card boxShadow="xl">
            <CardHeader py={2} bg="gray.300" textAlign="center">
              <Heading size="xs">Зареєструвати задачу</Heading>
            </CardHeader>
            <CardBody py={3}>
              <Wrap spacing={2} justify="center">
                <WrapItem>
                  <Button
                    leftIcon={<AddIcon boxSize={4} />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => navigate(`/projects/${id}/tasks/register/product`)}
                  >
                    Основна{' '}
                    <Text as="span" ml={1} display={['none', 'none', 'inline-block']}>
                      задача
                    </Text>
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button
                    leftIcon={<TimeIcon boxSize={4} />}
                    colorScheme="orange"
                    size="sm"
                    onClick={() => navigate(`/projects/${id}/tasks/register/general`)}
                  >
                    Загальна{' '}
                    <Text as="span" ml={1} display={['none', 'none', 'inline-block']}>
                      задача
                    </Text>
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button
                    leftIcon={<SettingsIcon boxSize={4} />}
                    colorScheme="cyan"
                    size="sm"
                    onClick={() => navigate(`/projects/${id}/tasks/register/intermediate`)}
                  >
                    Проміжна{' '}
                    <Text as="span" ml={1} display={['none', 'none', 'inline-block']}>
                      задача
                    </Text>
                  </Button>
                </WrapItem>
              </Wrap>
            </CardBody>
          </Card>

          <Grid
            templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
            gap={6}
          >
            <Card>
              <CardHeader py={2} bg="gray.300" textAlign="center">
                <Heading size="xs">Клієнт</Heading>
              </CardHeader>
              <CardBody py={3}>
                <Text textAlign="center">{project.client.name}</Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader py={2} bg="gray.300" textAlign="center">
                <Heading size="xs">Дати</Heading>
              </CardHeader>
              <CardBody py={3}>
                <Text fontSize="sm" textAlign="center">
                  {new Date(project.startDate).toLocaleDateString()} — {new Date(project.deadline).toLocaleDateString()}
                  {project.actualEndDate && ` (завершено: ${new Date(project.actualEndDate).toLocaleDateString()})`}
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader py={2} bg="gray.300" textAlign="center">
                <Heading size="xs">Кількість</Heading>
              </CardHeader>
              <CardBody py={3}>
                <Text textAlign="center">{project.quantity || '-'}</Text>
              </CardBody>
            </Card>
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
              <Flex 
                direction={['column', 'row']} 
                justify="space-between" 
                align={['start', 'center']}
                gap={4}
              >
                <Heading size="md">Учасники проекту</Heading>
                <Button
                  size={['sm', 'md']}
                  colorScheme="blue"
                  onClick={() => navigate(`/projects/${id}/users/add`)}
                >
                  Додати учасника
                </Button>
              </Flex>
            </CardHeader>
            <CardBody overflowX="auto">
              <Table variant="simple" size={['sm', 'md']}>
                <Thead>
                  <Tr>
                    <Th>Ім'я</Th>
                    <Th display={['none', 'table-cell']}>Email</Th>
                    <Th>Роль</Th>
                    <Th>Статус</Th>
                    <Th>Дії</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {project.users.map((user) => (
                    <Tr key={user.userId}>
                      <Td>{user.user.name}</Td>
                      <Td display={['none', 'table-cell']}>{user.user.email}</Td>
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
                          size={['sm', 'md']}
                          isChecked={user.isActive}
                          onChange={() => handleToggleActive(user)}
                          isDisabled={isToggleLoading}
                        />
                      </Td>
                      <Td>
                        <TableActions
                          actions={[
                            {
                              label: 'Видалити',
                              icon: <DeleteIcon boxSize={3} />,
                              colorScheme: 'red',
                              onClick: () => handleDeleteClick(user),
                            }
                          ]}
                          size="xs"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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

        <Modal isOpen={isEditRoleOpen} onClose={onEditRoleClose} size={['full', 'md']}>
          <ModalOverlay />
          <ModalContent margin={[0, 'auto']}>
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