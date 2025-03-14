import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
  IconButton,
  HStack,
  Tooltip,
  useToast,
  useDisclosure,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { EditTaskLogModal } from '../modals/EditTaskLogModal';
import { ConfirmModal } from '../ui/ConfirmModal';

interface RegisteredTask {
  id: string;
  task: {
    name: string;
    estimatedTime: number;
    type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
  };
  user: {
    name: string;
  };
  completedAt: string | null;
  registeredAt: string;
  timeSpent?: number;
  quantity?: number;
  product?: {
    code: string;
  };
  statusHistory: Array<{
    status: 'APPROVED' | 'NEEDS_FIXES' | 'ON_HOLD' | 'PENDING';
    createdAt: string;
  }>;
}

interface RegisteredTasksTableProps {
  tasks: RegisteredTask[];
  type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
  onTaskDeleted?: () => void;
  isLoading?: boolean;
}

const STATUS_COLORS = {
  APPROVED: 'green',
  NEEDS_FIXES: 'red',
  ON_HOLD: 'yellow',
  PENDING: 'gray',
};

const STATUS_LABELS = {
  APPROVED: 'Підтверджено',
  NEEDS_FIXES: 'Потребує виправлень',
  ON_HOLD: 'На перевірці',
  PENDING: 'Потребує перевірки',
};

export const RegisteredTasksTable: React.FC<RegisteredTasksTableProps> = ({ tasks, type, onTaskDeleted, isLoading }) => {
  const { user } = useAuth() || {};
  const toast = useToast();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState<RegisteredTask | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const handleDelete = async (taskId: string) => {
    setIsDeleteLoading(true);
    try {
      await api.delete(`/task-logs/${taskId}`);
      toast({
        title: 'Успішно видалено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onTaskDeleted?.();
      onDeleteClose();
    } catch (error) {
      toast({
        title: 'Помилка при видаленні',
        description: 'Не вдалося видалити задачу',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleDeleteClick = (task: RegisteredTask) => {
    setSelectedTask(task);
    onDeleteOpen();
  };

  const handleEdit = (task: RegisteredTask) => {
    setSelectedTask(task);
    onEditOpen();
  };

  const handleSuccess = () => {
    onTaskDeleted?.();
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Назва задачі</Th>
              <Th>Тип задачі</Th>
              {type === 'PRODUCT' && <Th>Код продукту</Th>}
              <Th>Виконавець</Th>
              <Th>Дата виконання</Th>
              <Th>Кількість</Th>
              <Th>Статус</Th>
              {isAdmin && <Th>Дії</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => (
              <Tr key={task.id}>
                <Td>{task.task.name}</Td>
                <Td>
                  <Badge colorScheme={
                    task.task.type === 'PRODUCT' ? 'blue' :
                    task.task.type === 'INTERMEDIATE' ? 'purple' : 'green'
                  }>
                    {task.task.type === 'PRODUCT' ? 'Продуктова' :
                     task.task.type === 'INTERMEDIATE' ? 'Проміжна' : 'Загальна'}
                  </Badge>
                </Td>
                {type === 'PRODUCT' && <Td>{task.product?.code || '-'}</Td>}
                <Td>{task.user.name}</Td>
                <Td>{new Date(task.registeredAt).toLocaleString()}</Td>
                <Td>
                  {task.task.type === 'INTERMEDIATE' ? `${task.quantity} шт` || '-' : 
                   task.task.type === 'GENERAL' ? `${Number(task.timeSpent || 0).toFixed(2)} год` : '-'}
                </Td>
                <Td>
                  {task.completedAt ? (
                    <Badge colorScheme="green">
                      {STATUS_LABELS.APPROVED}
                    </Badge>
                  ) : (
                    <Badge colorScheme={task.statusHistory?.length > 0 
                      ? STATUS_COLORS[task.statusHistory[0].status]
                      : STATUS_COLORS.PENDING
                    }>
                      {task.statusHistory?.length > 0 
                        ? STATUS_LABELS[task.statusHistory[0].status]
                        : STATUS_LABELS.PENDING
                      }
                    </Badge>
                  )}
                </Td>
                {isAdmin && (
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Редагувати">
                        <IconButton
                          aria-label="Редагувати задачу"
                          icon={<FaEdit />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleEdit(task)}
                        />
                      </Tooltip>
                      <Tooltip label="Видалити">
                        <IconButton
                          aria-label="Видалити задачу"
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteClick(task)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                )}
              </Tr>
            ))}
            {tasks.length === 0 && (
              <Tr>
                <Td colSpan={type === 'PRODUCT' ? (isAdmin ? 7 : 6) : (isAdmin ? 6 : 5)}>
                  <Text textAlign="center" color="gray.500">
                    Немає зареєстрованих задач
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {selectedTask && (
        <EditTaskLogModal
          isOpen={isEditOpen}
          onClose={() => {
            onEditClose();
            setSelectedTask(null);
          }}
          taskLog={selectedTask}
          onSuccess={handleSuccess}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={() => selectedTask && handleDelete(selectedTask.id)}
        isLoading={isDeleteLoading}
        title="Видалення задачі"
        message={`Ви впевнені, що хочете видалити задачу "${selectedTask?.task.name}"?`}
      />
    </>
  );
}; 