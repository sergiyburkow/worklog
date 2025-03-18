import { Card, CardBody, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';
import { Task, TaskType, TASK_TYPE_LABELS } from '../../../types/task';

interface TaskWithLogs {
  task: Task;
  logsCount: number;
  totalTimeSpent: number;
  quantity?: number;
}

interface LogsByTasksProps {
  tasks: TaskWithLogs[];
}

export const LogsByTasks = ({ tasks }: LogsByTasksProps) => {

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardBody>
        <Heading size="md" mb={4}>Задачі та реєстрації</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Назва задачі</Th>
              <Th>Тип</Th>
              <Th isNumeric>Кількість реєстрацій</Th>
              <Th isNumeric>Загальний час (год)</Th>
              <Th isNumeric>Кількість</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map(({ task, logsCount, totalTimeSpent, quantity }) => {
              return (
                <Tr key={task.id}>
                  <Td>{task.name}</Td>
                  <Td>
                    <Badge colorScheme={task.type === TaskType.PRODUCT ? 'blue' : task.type === TaskType.GENERAL ? 'orange' : 'cyan'}>
                      {TASK_TYPE_LABELS[task.type]}
                    </Badge>
                  </Td>
                  <Td isNumeric>{logsCount}</Td>
                  <Td isNumeric>{totalTimeSpent}</Td>
                  <Td isNumeric>{task.type === TaskType.INTERMEDIATE ? quantity : '-'}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}; 