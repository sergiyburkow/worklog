import { Box, Heading, Card, CardBody, Stack, Text, Badge, Button, HStack, VStack, SimpleGrid, Progress } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectStatus } from '../../types/project';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface ProjectManagerDetailsProps {
  project: Project;
}

export const ProjectManagerDetails = ({ project }: ProjectManagerDetailsProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'green';
      case 'NOT_STARTED':
        return 'yellow';
      case 'ON_HOLD':
        return 'orange';
      case 'COMPLETED':
        return 'blue';
      case 'CANCELLED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'В роботі';
      case 'NOT_STARTED':
        return 'Не розпочато';
      case 'ON_HOLD':
        return 'Призупинено';
      case 'COMPLETED':
        return 'Завершено';
      case 'CANCELLED':
        return 'Скасовано';
      default:
        return status;
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={5}>
        <Heading size="lg">{project.name}</Heading>
        <HStack spacing={3}>
          <HStack justify="space-between">
            <Text>
              {format(new Date(project.startDate), 'dd MM yyyy', { locale: uk })}
            </Text>
            <Text>-</Text>
            <Text>
              {format(new Date(project.deadline), 'dd MM yyyy', { locale: uk })}
            </Text>
          </HStack>
          <Badge fontSize="lg" colorScheme={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Badge>
        </HStack>
      </HStack>


        <Stack spacing={5}>
          <Card>
            <CardBody>
            <VStack align="stretch" spacing={4}>
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text>Загальний прогрес</Text>
                    <Text>0%</Text>
                  </HStack>
                  <Progress value={0} size="sm" colorScheme="blue" />
                </Box>
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text>Виконані задачі</Text>
                    <Text>0/0</Text>
                  </HStack>
                  <Progress value={0} size="sm" colorScheme="green" />
                </Box>
              </VStack>

            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Останні зареєстровані роботи</Heading>
              <Text color="gray.500">Немає записів про активність</Text>
            </CardBody>
          </Card>
        </Stack>
    </Box>
  );
}; 