import { Card, CardBody, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Tfoot } from '@chakra-ui/react';
import { Task, TaskType, TASK_TYPE_LABELS, TaskWithLogs } from '../../../types/task';

interface LogsByTasksProps {
  tasks: TaskWithLogs[];
}

export const LogsByTasks = ({ tasks }: LogsByTasksProps) => {

  if (!tasks || tasks.length === 0) {
    return null;
  }

  const totalCost = tasks.reduce((sum, task) => sum + task.totalCost, 0);

  return (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Назва задачі</Th>
              <Th>Тип</Th>
              <Th isNumeric>Кількість реєстрацій</Th>
              <Th isNumeric>Загальний час (год)</Th>
              <Th isNumeric>Кількість</Th>
              <Th isNumeric>Сумарна вартість</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map(({ task, logsCount, totalTimeSpent, quantity, totalCost }) => {
              return (
                <Tr key={task.id}>
                  <Td>{task.name}</Td>
                  <Td>
                    <Badge colorScheme={task.type === TaskType.PRODUCT ? 'blue' : task.type === TaskType.GENERAL ? 'orange' : 'cyan'}>
                      {TASK_TYPE_LABELS[task.type]}
                    </Badge>
                  </Td>
                  <Td isNumeric>{logsCount}</Td>
                  <Td isNumeric>{totalTimeSpent ?? '-'}</Td>
                  <Td isNumeric>{task.type === TaskType.INTERMEDIATE ? quantity : '-'}</Td>
                  <Td isNumeric>
                    {new Intl.NumberFormat('uk-UA', {
                      style: 'currency',
                      currency: 'UAH',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(totalCost)}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Всього</Th>
              <Th></Th>
              <Th></Th>
              <Th></Th>
              <Th></Th>
              <Th isNumeric>
                {new Intl.NumberFormat('uk-UA', {
                  style: 'currency',
                  currency: 'UAH',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totalCost)}
              </Th>
            </Tr>
          </Tfoot>
        </Table>
  );
}; 