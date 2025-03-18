import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Badge,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { api } from '../../lib/api';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { AdminLayout } from '../../components/admin/AdminLayout';
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
}

export const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити список проектів',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project: Project) => {
    navigate(`/projects/${project.id}/edit`);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    onDeleteOpen();
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    setIsDeleteLoading(true);
    try {
      await api.delete(`/projects/${selectedProject.id}`);
      await fetchProjects();
      onDeleteClose();
      
      toast({
        title: 'Успіх',
        description: 'Проект видалено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити проект',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    return PROJECT_STATUS_COLORS[status];
  };

  return (
    <AdminLayout>
      <Box p={5} width="100%">
        <HStack mb={6} justify="space-between" width="100%">
          <Heading>Проекти</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/projects/new')}>
            Додати проект
          </Button>
        </HStack>

        <Box overflowX="auto" width="100%">
          <Table variant="simple" width="100%">
            <Thead>
              <Tr>
                <Th>Назва</Th>
                <Th>Клієнт</Th>
                <Th>Кількість</Th>
                <Th>Дата початку</Th>
                <Th>Дедлайн</Th>
                <Th>Статус</Th>
                <Th>Дії</Th>
              </Tr>
            </Thead>
            <Tbody>
              {projects.map((project) => (
                <Tr key={project.id}>
                  <Td>
                    <Link
                      to={`/projects/${project.id}`}
                      style={{
                        color: 'var(--chakra-colors-blue-500)',
                        textDecoration: 'underline'
                      }}
                    >
                      {project.name}
                    </Link>
                  </Td>
                  <Td>{project.client.name}</Td>
                  <Td>{project.quantity || '-'}</Td>
                  <Td>{new Date(project.startDate).toLocaleDateString()}</Td>
                  <Td>{new Date(project.deadline).toLocaleDateString()}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(project.status)}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>
                  </Td>
                  <Td>
                    <TableActions
                      actions={[
                        {
                          label: 'Деталі',
                          icon: <ViewIcon boxSize={4} />,
                          colorScheme: 'teal',
                          onClick: () => navigate(`/projects/${project.id}`),
                        },
                        {
                          label: 'Редагувати',
                          icon: <EditIcon boxSize={4} />,
                          colorScheme: 'blue',
                          onClick: () => handleEditClick(project),
                        },
                        {
                          label: 'Видалити',
                          icon: <DeleteIcon boxSize={4} />,
                          colorScheme: 'red',
                          onClick: () => handleDeleteClick(project),
                        },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleDeleteProject}
          title="Видалення проекту"
          message={`Ви впевнені, що хочете видалити проект "${selectedProject?.name}"?`}
          confirmText="Видалити"
          isLoading={isDeleteLoading}
        />
      </Box>
    </AdminLayout>
  );
}; 