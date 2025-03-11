import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { DashboardMenu } from '../../components/DashboardMenu';
import { api } from '../../lib/api';
import { TaskForm, TaskType } from '../../components/forms/TaskForm';
import { TasksTable } from '../../components/tables/TasksTable';

interface Task {
  id: string;
  code: string;
  name: string;
  description: string;
  estimatedTime: string;
  projectId: string;
  status: TaskStatus;
  type: TaskType;
  complexity: number;
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

interface TaskFormData {
  name: string;
  description: string;
  estimatedTime?: string;
  type: TaskType;
  complexity?: number;
  tags?: string;
}

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
    type: TaskType.PRODUCT,
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
        estimatedTime: formData.type === TaskType.GENERAL ? '0' : formData.estimatedTime,
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
        type: TaskType.PRODUCT,
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

  const productTasks = tasks.filter(task => task.type === TaskType.PRODUCT);
  const generalTasks = tasks.filter(task => task.type === TaskType.GENERAL);

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">Задачі проекту: {projectName}</Heading>
            <Button colorScheme="blue" size="lg" onClick={onOpen}>
              Додати задачу
            </Button>
          </HStack>

          <Heading size="md">Продуктові задачі</Heading>
          <TasksTable 
            tasks={productTasks} 
            title="Продуктові задачі" 
            type={TaskType.PRODUCT} 
          />

          <Heading size="md">Загальні задачі</Heading>
          <TasksTable 
            tasks={generalTasks} 
            title="Загальні задачі" 
            type={TaskType.GENERAL} 
          />
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Додати нову задачу</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaskForm
              formData={formData}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onChange={(data) => setFormData({ ...formData, ...data })}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}; 