import { useState, useEffect, useMemo } from 'react';
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
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Icon,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { TaskForm } from '../../components/forms/TaskForm';
import { TasksTable } from '../../components/tables/TasksTable';
import { TaskGroupModal } from '../../components/tasks/TaskGroupModal';
import { Task, TaskType, TaskStatus } from '../../types/task';
import { getTaskGroups, createTaskGroup, updateTaskGroup, deleteTaskGroup, TaskGroup } from '../../api/task-groups';

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
  groupId?: string | null;
}

export const Tasks = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [editingGroup, setEditingGroup] = useState<TaskGroup | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
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
    groupId: null,
  });

  const fetchTaskGroups = async () => {
    if (!projectId) return;
    try {
      const data = await getTaskGroups(projectId);
      setTaskGroups(data.groups);
    } catch (error) {
      console.error('Failed to fetch task groups:', error);
    }
  };

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
    fetchTaskGroups();
  }, [projectId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/tasks', {
        ...formData,
        projectId,
        estimatedTime: formData.type === TaskType.GENERAL ? '0' : formData.estimatedTime,
        cost: formData.cost || 0,
        groupId: formData.groupId || undefined,
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
        groupId: null,
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
      cost: task.cost !== undefined && task.cost !== null ? Number(task.cost) : undefined,
      groupId: task.group?.id || null,
    });
    onEditOpen();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit) return;
    
    setIsLoading(true);

    try {
      const payload: any = {
        name: formData.name,
        description: formData.description || null,
        type: formData.type,
        estimatedTime: formData.type === TaskType.GENERAL ? '0' : (formData.estimatedTime || null),
        cost: formData.cost !== undefined && !isNaN(formData.cost) ? formData.cost : 0,
      };
      
      // Додаємо опціональні поля явно
      if (formData.complexity !== undefined) {
        payload.complexity = formData.complexity;
      }
      if (formData.tags !== undefined) {
        payload.tags = formData.tags || null;
      }
      
      // groupId завжди передаємо (null або string)
      payload.groupId = formData.groupId || null;
      
      const response = await api.put(`/tasks/${taskToEdit.id}`, payload);
      console.log('Update response:', response.data); // Для дебагу

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
        groupId: null,
      });
      setTaskToEdit(null);

      // Закриваємо модальне вікно
      onEditClose();

      // Оновлюємо список завдань та груп
      await fetchTasks();
      await fetchTaskGroups();
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

  // Фільтрація задач по групі (типи не фільтруємо)
  const filteredTasks = (() => {
    let filtered = [...tasks];
    
    if (selectedGroupId) {
      if (selectedGroupId === 'none') {
        filtered = filtered.filter(task => !task.group);
      } else {
        filtered = filtered.filter(task => task.group?.id === selectedGroupId);
      }
    }
    
    return filtered;
  })();

  // Групування задач для Accordion
  const groupTasksByGroup = (taskList: Task[]) => {
    const grouped: Record<string, Task[]> = {};
    const noGroup: Task[] = [];

    taskList.forEach(task => {
      if (task.group) {
        const groupId = task.group.id;
        if (!grouped[groupId]) {
          grouped[groupId] = [];
        }
        grouped[groupId].push(task);
      } else {
        noGroup.push(task);
      }
    });

    // Сортуємо задачі в кожній групі за назвою
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => a.name.localeCompare(b.name));
    });
    noGroup.sort((a, b) => a.name.localeCompare(b.name));

    return { grouped, noGroup };
  };

  // Обчислюємо defaultIndex для відкриття всіх акордіонів
  const accordionDefaultIndex = useMemo(() => {
    const { grouped, noGroup } = groupTasksByGroup(filteredTasks);
    const sortedGroupIds = Object.keys(grouped).sort((a, b) => {
      const groupA = taskGroups.find(g => g.id === a);
      const groupB = taskGroups.find(g => g.id === b);
      if (!groupA || !groupB) return 0;
      return groupA.sortOrder - groupB.sortOrder || groupA.name.localeCompare(groupB.name);
    });
    const totalSections = sortedGroupIds.length + (noGroup.length > 0 ? 1 : 0);
    return Array.from({ length: totalSections }, (_, i) => i);
  }, [filteredTasks, taskGroups]);

  const handleGroupSubmit = async (data: { name: string; description?: string; sortOrder?: number }) => {
    if (!projectId) return;
    
    try {
      if (editingGroup) {
        await updateTaskGroup(projectId, editingGroup.id, data);
        toast({
          title: 'Успіх',
          description: 'Групу оновлено',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createTaskGroup(projectId, data);
        toast({
          title: 'Успіх',
          description: 'Групу створено',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      await fetchTaskGroups();
      setEditingGroup(null);
      setIsGroupModalOpen(false);
    } catch (error) {
      toast({
        title: 'Помилка',
        description: editingGroup ? 'Не вдалося оновити групу' : 'Не вдалося створити групу',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!projectId) return;
    
    try {
      await deleteTaskGroup(projectId, groupId);
      toast({
        title: 'Успіх',
        description: 'Групу видалено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await fetchTaskGroups();
      await fetchTasks(); // Оновлюємо задачі, щоб прибрати видалену групу
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити групу',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AdminLayout>
      <Box p={5}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">Задачі проекту: {projectName}</Heading>
            <HStack>
              <Menu>
                <MenuButton as={Button} variant="outline" size="lg">
                  Управління групами
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => { setEditingGroup(null); setIsGroupModalOpen(true); }}>
                    Створити групу
                  </MenuItem>
                  {taskGroups.map(group => (
                    <MenuItem key={group.id}>
                      <HStack width="100%" justify="space-between">
                        <Text>{group.name}</Text>
                        <HStack>
                          <Button 
                            size="xs" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingGroup(group);
                              setIsGroupModalOpen(true);
                            }}
                          >
                            Редагувати
                          </Button>
                          <Button 
                            size="xs" 
                            colorScheme="red" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Видалити групу "${group.name}"?`)) {
                                handleDeleteGroup(group.id);
                              }
                            }}
                          >
                            Видалити
                          </Button>
                        </HStack>
                      </HStack>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Button colorScheme="blue" size="lg" onClick={onCreateOpen}>
                Додати задачу
              </Button>
            </HStack>
          </HStack>

          <Card>
            <CardBody>
              <HStack spacing={4}>
                <FormControl width="300px">
                  <FormLabel>Фільтр по групі</FormLabel>
                  <Select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    placeholder="Всі задачі"
                  >
                    <option value="">Всі задачі</option>
                    <option value="none">Без групи</option>
                    {taskGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
            </CardBody>
          </Card>

          <Heading size="md">Задачі</Heading>
          {filteredTasks.length === 0 ? (
            <Text color="gray.500">Немає задач</Text>
          ) : (
            <Accordion allowMultiple defaultIndex={accordionDefaultIndex}>
              {(() => {
                const { grouped, noGroup } = groupTasksByGroup(filteredTasks);
                const sortedGroupIds = Object.keys(grouped).sort((a, b) => {
                  const groupA = taskGroups.find(g => g.id === a);
                  const groupB = taskGroups.find(g => g.id === b);
                  if (!groupA || !groupB) return 0;
                  return groupA.sortOrder - groupB.sortOrder || groupA.name.localeCompare(groupB.name);
                });

                return (
                  <>
                    {sortedGroupIds.map(groupId => {
                      const group = taskGroups.find(g => g.id === groupId);
                      const groupTasks = grouped[groupId];
                      return (
                        <AccordionItem key={groupId}>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <Text fontWeight="bold">{group?.name || 'Невідома група'}</Text>
                              <Text fontSize="sm" color="gray.500">{groupTasks.length} задач(и)</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <TasksTable
                              tasks={groupTasks}
                              title=""
                              type={undefined}
                              onDelete={handleDeleteClick}
                              onEdit={handleEditClick}
                              projectId={projectId}
                            />
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    })}
                    {noGroup.length > 0 && (
                      <AccordionItem>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">Без групи</Text>
                            <Text fontSize="sm" color="gray.500">{noGroup.length} задач(и)</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <TasksTable
                            tasks={noGroup}
                            title=""
                            type={undefined}
                            onDelete={handleDeleteClick}
                            onEdit={handleEditClick}
                            projectId={projectId}
                          />
                        </AccordionPanel>
                      </AccordionItem>
                    )}
                  </>
                );
              })()}
            </Accordion>
          )}
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
              groups={taskGroups}
              onCreateGroup={() => {
                onCreateClose();
                setEditingGroup(null);
                setIsGroupModalOpen(true);
              }}
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
              groups={taskGroups}
              onCreateGroup={() => {
                onEditClose();
                setEditingGroup(null);
                setIsGroupModalOpen(true);
              }}
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

      <TaskGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroup(null);
        }}
        initial={editingGroup ? { name: editingGroup.name, description: editingGroup.description || undefined, sortOrder: editingGroup.sortOrder } : undefined}
        onSubmit={handleGroupSubmit}
      />
    </AdminLayout>
  );
}; 