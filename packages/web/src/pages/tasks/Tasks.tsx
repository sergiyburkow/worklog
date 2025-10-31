import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { TaskForm } from '../../components/forms/TaskForm';
import { TasksTable } from '../../components/tables/TasksTable';
import { Task, TaskType, TaskStatus } from '../../types/task';

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
  quantity?: number;
  product?: string;
  cost?: number;
}

export const Tasks = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const toast = useToast();
  const { 
    isOpen: isCreateOpen, 
    onOpen: onCreateOpen, 
    onClose: onCreateClose 
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    type: TaskType.PRODUCT,
  });

  const fetchTasks = async () => {
    if (!projectId) {
      toast({
        title: 'Помилка',
        description: 'ID проекту не знайдено',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/projects');
      return;
    }

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
      navigate('/projects');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/tasks', {
        ...formData,
        projectId,
        estimatedTime: formData.type === TaskType.GENERAL ? '0' : formData.estimatedTime,
        cost: formData.cost || 0
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
      onCreateClose();

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

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setFormData({
      name: task.name,
      description: task.description || '',
      type: task.type,
      estimatedTime: task.estimatedTime,
      complexity: task.complexity,
      tags: task.tags,
      product: task.product,
      quantity: task.quantity,
      cost: task.cost
    });
    onEditOpen();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit) return;
    
    setIsLoading(true);

    try {
      await api.put(`/tasks/${taskToEdit.id}`, {
        ...formData,
        projectId,
        estimatedTime: formData.type === TaskType.GENERAL ? '0' : formData.estimatedTime,
        cost: formData.cost || 0
      });

      toast({
        title: 'Успіх',
        description: 'Завдання оновлено',
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
      setTaskToEdit(null);

      // Закриваємо модальне вікно
      onEditClose();

      // Оновлюємо список завдань
      await fetchTasks();
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити завдання',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await api.delete(`/tasks/${taskToDelete.id}`);
      
      toast({
        title: 'Успіх',
        description: 'Завдання видалено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      await fetchTasks();
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити завдання',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setTaskToDelete(null);
      onDeleteClose();
    }
  };

  const productTasks = tasks.filter(task => task.type === TaskType.PRODUCT);
  const generalTasks = tasks.filter(task => task.type === TaskType.GENERAL);
  const intermediateTasks = tasks.filter(task => task.type === TaskType.INTERMEDIATE);

  return (
    <AdminLayout>
      <Box p={5}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">Задачі проекту: {projectName}</Heading>
            <Button colorScheme="blue" size="lg" onClick={onCreateOpen}>
              Додати задачу
            </Button>
          </HStack>

          <Heading size="md">Продуктові задачі</Heading>
          <TasksTable 
            tasks={productTasks} 
            title="Продуктові задачі" 
            type={TaskType.PRODUCT}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
            projectId={projectId}
          />

          <Heading size="md">Проміжні задачі</Heading>
          <TasksTable 
            tasks={intermediateTasks} 
            title="Проміжні задачі" 
            type={TaskType.INTERMEDIATE}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
            projectId={projectId}
          />

          <Heading size="md">Загальні задачі</Heading>
          <TasksTable 
            tasks={generalTasks} 
            title="Загальні задачі" 
            type={TaskType.GENERAL}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
            projectId={projectId}
          />
        </VStack>
      </Box>

      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Додати нову задачу</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaskForm
              formData={formData}
              isLoading={isLoading}
              onSubmit={handleCreateSubmit}
              onChange={(data) => setFormData({ ...formData, ...data })}
              onCancel={onCreateClose}
              submitButtonText="Додати завдання"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редагувати задачу</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaskForm
              formData={formData}
              isLoading={isLoading}
              onSubmit={handleEditSubmit}
              onChange={(data) => setFormData({ ...formData, ...data })}
              onCancel={onEditClose}
              submitButtonText="Зберегти зміни"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Видалити задачу</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Ви впевнені, що хочете видалити цю задачу?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Скасувати
            </Button>
            <Button colorScheme="red" onClick={handleDeleteConfirm} isLoading={isLoading}>
              Видалити
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
}; 