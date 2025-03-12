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
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { TaskType } from '../forms/TaskForm';
import { Task } from '../../types/task';

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

  return (
    <Card>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Назва</Th>
              <Th>Складність</Th>
              {showEstimatedTime && <Th>Оч. час</Th>}
              <Th>Дії</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => (
              <Tr key={task.id}>
                <Td>{task.name}</Td>
                <Td>
                  <Badge colorScheme={getComplexityColor(task.complexity)}>
                    {getComplexityLabel(task.complexity)} ({task.complexity})
                  </Badge>
                </Td>
                {showEstimatedTime && <Td>{task.estimatedTime} хв.</Td>}
                <Td>
                  <HStack spacing={2}>
                    {onEdit && (
                      <IconButton
                        aria-label="Редагувати задачу"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="teal"
                        onClick={() => onEdit(task)}
                      />
                    )}
                    {onDelete && (
                      <IconButton
                        aria-label="Видалити задачу"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => onDelete(task)}
                      />
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