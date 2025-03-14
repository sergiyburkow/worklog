import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody, Progress, HStack, Text, Button, VStack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useAuth } from '../../hooks/useAuth';
import { Project, ProjectStatus } from '../../types/project';

export const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get<Project[]>(`/projects/user/${user?.id}`);
        setProjects(response.data.filter(project => 
          project.status === 'IN_PROGRESS' || project.status === 'NOT_STARTED'
        ));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchProjects();
    }
  }, [user]);

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
    <AdminLayout>
      <Box p={5}>
        <Heading mb={5}>Робоча панель</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={8}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Активні завдання</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Завершені завдання</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Загальний час</StatLabel>
                <StatNumber>0г</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card mb={5}>
          <CardBody>
            <Heading size="md" mb={4}>Поточні проекти</Heading>
            {isLoading ? (
              <Text color="gray.500">Завантаження...</Text>
            ) : projects.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {projects.map((project) => (
                  <Box 
                    key={project.id} 
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="lg"
                    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Heading size="sm">{project.name}</Heading>
                      <Badge colorScheme={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </HStack>
                    {project.deadline && (
                      <Text color="gray.600" fontSize="sm">
                        Дата завершення: {
                          format(new Date(project.deadline), 'dd MMMM yyyy', { locale: uk })
                        }
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">Немає активних проектів</Text>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Останні активності</Heading>
            <Text color="gray.500">Немає записів про активність</Text>
          </CardBody>
        </Card>
      </Box>
    </AdminLayout>
  );
}; 