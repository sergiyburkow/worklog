import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Link as ChakraLink,
  Icon,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { EditTaskLogModal } from '../modals/EditTaskLogModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { QaCheck } from '../modals/QaCheck';

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
    id: string;
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
  hiddenColumns?: Array<'taskName' | 'taskType' | 'productCode' | 'assignee' | 'date' | 'quantity' | 'status' | 'actions'>;
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

export const RegisteredTasksTable: React.FC<RegisteredTasksTableProps> = ({ 
  tasks, 
  type, 
  onTaskDeleted, 
  isLoading,
  hiddenColumns = [] 
}) => {
  const { user } = useAuth() || {};
  const toast = useToast();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isQaOpen, onOpen: onQaOpen, onClose: onQaClose } = useDisclosure();
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
              {!hiddenColumns.includes('taskName') && <Th>Назва задачі</Th>}
              {!hiddenColumns.includes('taskType') && <Th>Тип задачі</Th>}
              {type === 'PRODUCT' && !hiddenColumns.includes('productCode') && <Th>Код продукту</Th>}
              {!hiddenColumns.includes('assignee') && <Th>Виконавець</Th>}
              {!hiddenColumns.includes('date') && <Th>Дата виконання</Th>}
              {!hiddenColumns.includes('quantity') && <Th>Кількість</Th>}
              {!hiddenColumns.includes('status') && <Th>Статус</Th>}
              {isAdmin && !hiddenColumns.includes('actions') && <Th>Дії</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => (
              <Tr key={task.id}>
                {!hiddenColumns.includes('taskName') && <Td>{task.task.name}</Td>}
                {!hiddenColumns.includes('taskType') && (
                  <Td>
                    <Badge colorScheme={
                      task.task.type === 'PRODUCT' ? 'blue' :
                      task.task.type === 'INTERMEDIATE' ? 'purple' : 'green'
                    }>
                      {task.task.type === 'PRODUCT' ? 'Продуктова' :
                       task.task.type === 'INTERMEDIATE' ? 'Проміжна' : 'Загальна'}
                    </Badge>
                  </Td>
                )}
                {type === 'PRODUCT' && !hiddenColumns.includes('productCode') && (
                  <Td>
                    {task.product?.code ? (
                      <ChakraLink
                        as={Link}
                        to={`/products/${task.product.id}/logs`}
                        color="blue.500"
                        textDecoration="underline"
                        _hover={{ color: 'blue.600' }}
                      >
                        {task.product.code}
                      </ChakraLink>
                    ) : '-'}
                  </Td>
                )}
                {!hiddenColumns.includes('assignee') && <Td>{task.user.name}</Td>}
                {!hiddenColumns.includes('date') && <Td>{new Date(task.registeredAt).toLocaleString()}</Td>}
                {!hiddenColumns.includes('quantity') && (
                  <Td>
                    {task.task.type === 'INTERMEDIATE' ? `${task.quantity} шт` || '-' : 
                     task.task.type === 'GENERAL' ? `${Number(task.timeSpent || 0).toFixed(2)} год` : '-'}
                  </Td>
                )}
                {!hiddenColumns.includes('status') && (
                  <Td onClick={() => {
                    setSelectedTask(task);
                    onQaOpen();
                  }} style={{ cursor: 'pointer' }}>
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
                )}
                {isAdmin && !hiddenColumns.includes('actions') && (
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
        <>
          <EditTaskLogModal
            isOpen={isEditOpen}
            onClose={() => {
              onEditClose();
              setSelectedTask(null);
            }}
            taskLog={selectedTask}
            onSuccess={handleSuccess}
          />

          <QaCheck
            isOpen={isQaOpen}
            onClose={() => {
              onQaClose();
              setSelectedTask(null);
            }}
            taskName={selectedTask.task.name}
            assigneeName={selectedTask.user.name}
          />
        </>
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