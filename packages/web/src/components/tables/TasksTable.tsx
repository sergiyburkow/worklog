import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Card,
  CardBody,
  HStack,
} from '@chakra-ui/react';
import { Task, TaskType, TASK_TYPE_LABELS, TASK_TYPE_COLORS } from '../../types/task';

const getComplexityColor = (complexity: number): string => {
  if (complexity <= 3) return 'green';
  if (complexity <= 6) return 'yellow';
  return 'red';
};

const getComplexityLabel = (complexity: number): string => {
  if (complexity <= 3) return 'Легка';
  if (complexity <= 6) return 'Середня';
  return 'Складна';
};

interface TasksTableProps {
  tasks: Task[];
  title: string;
  type: TaskType;
  onDelete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
}

export const TasksTable = ({ tasks, title, type, onDelete, onEdit }: TasksTableProps) => {
  const showEstimatedTime = type === TaskType.PRODUCT;
  const hasProductTasks = tasks.some(task => task.type === TaskType.PRODUCT);

  return (
    <Card>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Назва</Th>
              <Th>Тип</Th>
              {showEstimatedTime && <Th>Продукт</Th>}
              <Th>Опис</Th>
              <Th>Вартість</Th>
              <Th>Дії</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => (
              <Tr key={task.id}>
                <Td>{task.name}</Td>
                <Td>
                  <Badge colorScheme={TASK_TYPE_COLORS[task.type]}>
                    {TASK_TYPE_LABELS[task.type]}
                  </Badge>
                </Td>
                {showEstimatedTime && (
                  <Td>{task.type === TaskType.PRODUCT ? task.product : '-'}</Td>
                )}
                <Td>{task.description || '-'}</Td>
                <Td>{task.cost ? `${task.cost} грн` : '-'}</Td>
                <Td>
                  <HStack spacing={2}>
                    {onEdit && (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => onEdit(task)}
                      >
                        Редагувати
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => onDelete(task)}
                      >
                        Видалити
                      </Button>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}; 