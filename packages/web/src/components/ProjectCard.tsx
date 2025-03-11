import { Card, CardBody, Heading, Text, Badge } from '@chakra-ui/react';

export interface Project {
  id: string;
  name: string;
  client: {
    name: string;
  };
  status: string;
  deadline: string;
}

const PROJECT_STATUS_COLORS: Record<string, string> = {
  PLANNED: 'gray',
  NEW: 'blue',
  IN_PROGRESS: 'green',
  ON_HOLD: 'yellow',
  COMPLETED: 'teal',
  SHIPPED: 'purple',
  REJECTED: 'red',
  FINISHED: 'green',
};

const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNED: 'Планується',
  NEW: 'Новий',
  IN_PROGRESS: 'В роботі',
  ON_HOLD: 'На паузі',
  COMPLETED: 'Виконаний',
  SHIPPED: 'Відвантажений',
  REJECTED: 'Відхилений',
  FINISHED: 'Завершений',
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <Card 
      minW="300px"
      cursor="pointer"
      onClick={onClick}
      _hover={{ transform: 'translateY(-2px)', transition: 'transform 0.2s' }}
    >
      <CardBody>
        <Heading size="sm" mb={2}>{project.name}</Heading>
        <Text color="gray.600" mb={2}>
          Клієнт: {project.client.name}
        </Text>
        <Text color="gray.600" mb={2}>
          Дедлайн: {new Date(project.deadline).toLocaleDateString()}
        </Text>
        <Badge colorScheme={PROJECT_STATUS_COLORS[project.status]}>
          {PROJECT_STATUS_LABELS[project.status]}
        </Badge>
      </CardBody>
    </Card>
  );
}; 