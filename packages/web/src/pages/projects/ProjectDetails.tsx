import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Spinner, Text, Button } from '@chakra-ui/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../lib/api';
import { Project } from '../../types/project';
import { useAuth } from '../../hooks/useAuth';
import { AdminProjectDetails } from './AdminProjectDetails';
import { ProjectManagerDetails } from './ProjectManagerDetails';
import { WorkerProjectDetails } from './WorkerProjectDetails';

export const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get<Project>(`/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Помилка при завантаженні проекту');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const renderProjectDetails = () => {
    if (!project) return null;

    // Знаходимо роль користувача в проекті
    const userProjectRole = project.users.find(u => u.userId === user?.id)?.role;

    // Якщо користувач адмін, показуємо адмін view незалежно від ролі в проекті
    if (user?.role === 'ADMIN') {
      return <AdminProjectDetails project={project} />;
    }

    // Для інших користувачів показуємо view відповідно до їх ролі в проекті
    switch (userProjectRole) {
      case 'MANAGER':
        return <WorkerProjectDetails project={project} />;
//        return <ProjectManagerDetails project={project} />;
      case 'ENGINEER':
      case 'QA':
      case 'PADAWAN':
        return <WorkerProjectDetails project={project} />;
      default:
        return <Text>У вас немає доступу до перегляду деталей проекту</Text>;
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <Box p={5}>
          <Text color="red.500">{error}</Text>
          <Button mt={4} onClick={() => navigate('/dashboard')}>
            Повернутися до дашборду
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={5}>
        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <Spinner size="xl" />
          </Box>
        ) : (
          renderProjectDetails()
        )}
      </Box>
    </AdminLayout>
  );
}; 