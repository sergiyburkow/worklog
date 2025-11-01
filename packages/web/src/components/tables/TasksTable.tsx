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
  Icon,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import { Task, TaskType, TASK_TYPE_LABELS, TASK_TYPE_COLORS } from '../../types/task';
import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { useState } from 'react';
import { TaskRecipeViewModal } from '../tasks/TaskRecipeViewModal';

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
  type?: TaskType;
  onDelete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  projectId?: string;
}

export const TasksTable = ({ tasks, title, type, onDelete, onEdit, projectId }: TasksTableProps) => {
  const showEstimatedTime = type ? type === TaskType.PRODUCT : tasks.some(task => task.type === TaskType.PRODUCT);
  const hasProductTasks = tasks.some(task => task.type === TaskType.PRODUCT);
  const [recipeModalTask, setRecipeModalTask] = useState<{ id: string; name?: string } | null>(null);

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
                <Td>
                  <HStack spacing={2}>
                    <Text>{task.name}</Text>
                    {task.hasRecipe && (
                      <Tooltip label="Натисніть, щоб переглянути рецепт" hasArrow>
                        <Badge
                          colorScheme="purple"
                          display="flex"
                          alignItems="center"
                          gap={1}
                          cursor="pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRecipeModalTask({ id: task.id, name: task.name })
                          }}
                        >
                          <Icon as={FaUtensils} boxSize={2.5} />
                          Рецепт
                        </Badge>
                      </Tooltip>
                    )}
                  </HStack>
                </Td>
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
                    <Button as={Link} to={`/tasks/${task.id}/recipe`} size="sm" variant="outline">Рецепт</Button>
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
      <TaskRecipeViewModal
        isOpen={!!recipeModalTask}
        onClose={() => setRecipeModalTask(null)}
        taskId={recipeModalTask?.id || ''}
        projectId={projectId}
        taskName={recipeModalTask?.name}
      />
    </Card>
  );
}; 