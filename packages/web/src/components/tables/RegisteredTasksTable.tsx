import React from 'react';
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
} from '@chakra-ui/react';

interface RegisteredTask {
  id: string;
  task: {
    name: string;
    estimatedTime: number;
  };
  user: {
    name: string;
  };
  completedAt: string | null;
  registeredAt: string;
  timeSpent?: number;
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
  type: 'PRODUCT' | 'GENERAL';
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

export const RegisteredTasksTable: React.FC<RegisteredTasksTableProps> = ({ tasks, type }) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Назва задачі</Th>
            {type === 'PRODUCT' && <Th>Код продукту</Th>}
            <Th>Виконавець</Th>
            <Th>Дата виконання</Th>
            <Th>Оч. час</Th>
            <Th>Витрачений час</Th>
            <Th>Статус</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task.id}>
              <Td>{task.task.name}</Td>
              {type === 'PRODUCT' && <Td>{task.product?.code || '-'}</Td>}
              <Td>{task.user.name}</Td>
              <Td>{new Date(task.registeredAt).toLocaleString()}</Td>
              <Td>{task.task.estimatedTime}г</Td>
              <Td>{task.timeSpent ? `${task.timeSpent}г` : '-'}</Td>
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
            </Tr>
          ))}
          {tasks.length === 0 && (
            <Tr>
              <Td colSpan={type === 'PRODUCT' ? 7 : 6}>
                <Text textAlign="center" color="gray.500">
                  Немає зареєстрованих задач
                </Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}; 