import { Box, Heading, Button, Text, HStack, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProjectCard, Project } from '../../components/ProjectCard';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        const response = await api.get('/projects');
        const projects = response.data.filter((project: Project) => 
          ['NEW', 'IN_PROGRESS', 'ON_HOLD'].includes(project.status)
        );
        setActiveProjects(projects);
      } catch (error) {
        console.error('Помилка при завантаженні проектів:', error);
      }
    };

    fetchActiveProjects();
  }, []);

  return (
    <AdminLayout>
      <Box p={5}>
        <Heading mb={5}>Адміністративна панель</Heading>
        
        <HStack spacing={4} mb={8}>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/users')}
          >
            Управління користувачами
          </Button>
          <Button
            colorScheme="green"
            size="lg"
            onClick={() => navigate('/projects')}
          >
            Управління проектами
          </Button>
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => navigate('/clients')}
          >
            Управління клієнтами
          </Button>
        </HStack>

        <Box mb={8}>
          <Heading size="md" mb={4}>Активні проекти</Heading>
          <Flex overflowX="auto" pb={4}>
            <HStack spacing={4}>
              {activeProjects.length > 0 ? (
                activeProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  />
                ))
              ) : (
                <Text color="gray.500">Немає активних проектів</Text>
              )}
            </HStack>
          </Flex>
        </Box>
      </Box>
    </AdminLayout>
  );
}; 