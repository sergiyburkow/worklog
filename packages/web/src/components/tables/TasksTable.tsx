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
} from '@chakra-ui/react';
import { TaskType } from '../forms/TaskForm';

interface Task {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  projectId: string;
  type: TaskType;
  complexity: number;
}

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
}

export const TasksTable = ({ tasks, title, type }: TasksTableProps) => {
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
                  <Button
                    size="sm"
                    colorScheme="teal"
                    mr={2}
                  >
                    Деталі
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}; 