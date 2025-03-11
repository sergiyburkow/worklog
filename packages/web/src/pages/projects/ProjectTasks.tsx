import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Card,
  CardBody,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { DashboardMenu } from '../../components/DashboardMenu';
import { api } from '../../lib/api';
import { TaskForm, TaskFormData, TaskType, TASK_TYPE_LABELS } from '../../components/forms/TaskForm';

interface Task {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  projectId: string;
  createdAt: string;
  status: TaskStatus;
  type: TaskType;
  complexity?: number;
  tags?: string;
}

enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.NEW]: 'Нове',
  [TaskStatus.IN_PROGRESS]: 'В роботі',
  [TaskStatus.COMPLETED]: 'Завершено',
  [TaskStatus.ON_HOLD]: 'На паузі',
};

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.NEW]: 'blue',
  [TaskStatus.IN_PROGRESS]: 'green',
  [TaskStatus.COMPLETED]: 'gray',
  [TaskStatus.ON_HOLD]: 'yellow',
};

export const Tasks = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    estimatedTime: '',
    type: TaskType.GENERAL,
    complexity: undefined,
    tags: ''
  });

  const fetchTasks = async () => {
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/projects/${projectId}/tasks`),
      ]);
      setProjectName(projectResponse.data.name);
      setTasks(tasksResponse.data);
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити дані',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/tasks', {
        ...formData,
        projectId,
      });

      toast({
        title: 'Успіх',
        description: 'Завдання створено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Очищаємо форму
      setFormData({
        name: '',
        description: '',
        estimatedTime: '',
        type: TaskType.GENERAL,
        complexity: undefined,
        tags: ''
      });

      // Закриваємо модальне вікно
      onClose();

      // Оновлюємо список завдань
      await fetchTasks();
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося створити завдання',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (data: Partial<TaskFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">Завдання проекту: {projectName}</Heading>
            <Button colorScheme="blue" size="lg" onClick={onOpen}>
              Додати задачу
            </Button>
          </HStack>

          <Card>
            <CardBody>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Назва</Th>
                      <Th>Тип</Th>
                      <Th>Статус</Th>
                      <Th>Складність</Th>
                      <Th>Оч. час</Th>
                      <Th>Теги</Th>
                      <Th>Створено</Th>
                      <Th>Дії</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tasks.map((task) => (
                      <Tr key={task.id}>
                        <Td>{task.name}</Td>
                        <Td>{TASK_TYPE_LABELS[task.type]}</Td>
                        <Td>
                          <Badge colorScheme={TASK_STATUS_COLORS[task.status]}>
                            {TASK_STATUS_LABELS[task.status]}
                          </Badge>
                        </Td>
                        <Td>{task.complexity || '-'}</Td>
                        <Td>{task.estimatedTime}г</Td>
                        <Td>{task.tags || '-'}</Td>
                        <Td>{new Date(task.createdAt).toLocaleDateString()}</Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="teal"
                            mr={2}
                          >
                            Деталі
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
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Додати нове завдання</ModalHeader>
          <ModalCloseButton />
          <TaskForm
            formData={formData}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            onCancel={onClose}
          />
        </ModalContent>
      </Modal>
    </>
  );
}; 