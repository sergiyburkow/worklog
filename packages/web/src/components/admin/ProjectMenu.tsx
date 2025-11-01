import { 
  Box,
  Button, 
  Heading, 
  HStack, 
  VStack, 
  Spinner, 
  Text, 
  IconButton,
  Icon
} from '@chakra-ui/react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { AddIcon, SettingsIcon, InfoIcon } from '@chakra-ui/icons';
import { FiDollarSign, FiPackage, FiList, FiBox, FiHome, FiCheckCircle } from 'react-icons/fi';

interface ProjectMenuProps {
  isCollapsed: boolean;
}

export const ProjectMenu = ({ isCollapsed }: ProjectMenuProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [projectName, setProjectName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjectName = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProjectName(response.data.name);
      } catch (error) {
        console.error('Error fetching project:', error);
        setProjectName('Проєкт');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectName();
  }, [projectId]);

  if (!projectId) return null;

  return (
    <VStack spacing={2} align="stretch" width="100%">
      {/* Назва проєкту */}
      {isLoading ? (
        <HStack>
          <Spinner size="sm" />
          <Text>Завантаження...</Text>
        </HStack>
      ) : (
        <Heading size="md" color="blue.600" px={isCollapsed ? 2 : 4}>
          {!isCollapsed ? (projectName || 'Проєкт') : ''}
        </Heading>
      )}

      {/* Три кнопки для реєстрації задач */}
      <HStack spacing={2} justify="center" px={isCollapsed ? 2 : 4}>
        <IconButton
          aria-label="Реєстрація основної задачі"
          icon={<AddIcon />}
          colorScheme="blue"
          onClick={() => navigate(`/projects/${projectId}/tasks/register/product`)}
          size="sm"
          width="32px"
          height="32px"
        />
        <IconButton
          aria-label="Реєстрація проміжної задачі"
          icon={<SettingsIcon />}
          colorScheme="purple"
          onClick={() => navigate(`/projects/${projectId}/tasks/register/intermediate`)}
          size="sm"
          width="32px"
          height="32px"
        />
        <IconButton
          aria-label="Реєстрація загальної задачі"
          icon={<InfoIcon />}
          colorScheme="green"
          onClick={() => navigate(`/projects/${projectId}/tasks/register/general`)}
          size="sm"
          width="32px"
          height="32px"
        />
      </HStack>

      {/* Розділитель перед AdminMenu */}
      <Box 
        borderTop="1px" 
        borderColor="gray.200" 
        mt={2}
        pt={2}
      />

      {/* Дублювання меню з шапки: Платежі, Продукти, Задачі, Склад */}
      <VStack spacing={2} align="stretch">
          {[
            { path: `/projects/${projectId}`, label: 'Деталі проекту', icon: FiHome, exact: true },
            { path: `/projects/${projectId}/payments`, label: 'Платежі', icon: FiDollarSign },
            { path: `/projects/${projectId}/products`, label: 'Продукти', icon: FiPackage },
            { path: `/projects/${projectId}/tasks`, label: 'Задачі', icon: FiList },
            { path: `/projects/${projectId}/tasks/registered`, label: 'Зареєстровані задачі', icon: FiCheckCircle },
            { path: `/projects/${projectId}/inventory`, label: 'Склад', icon: FiBox },
          ].map((item) => {
            // Для точного співпадіння (exact: true)
            if (item.exact) {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  leftIcon={<Icon as={item.icon} />}
                  variant={isActive ? "solid" : "ghost"}
                  colorScheme={isActive ? "blue" : "gray"}
                  justifyContent={isCollapsed ? "center" : "flex-start"}
                  width="100%"
                  onClick={() => navigate(item.path)}
                  px={isCollapsed ? 2 : 4}
                  overflow="hidden"
                >
                  {!isCollapsed && item.label}
                </Button>
              );
            }
            
            // Для звичайних шляхів - перевіряємо точне співпадіння або що шлях починається з item.path
            // Але якщо є дочірній шлях у меню, який активний, то базовий не підсвічується
            // Наприклад: /tasks не має підсвічуватись коли ми на /tasks/registered
            
            // Список усіх шляхів у меню (виключаємо exact шляхи)
            const allMenuPaths = [
              `/projects/${projectId}/payments`,
              `/projects/${projectId}/products`,
              `/projects/${projectId}/tasks`,
              `/projects/${projectId}/tasks/registered`,
              `/projects/${projectId}/inventory`,
            ];
            
            // Перевіряємо чи є дочірній шлях у меню, який відповідає поточному location
            const activeChildPath = allMenuPaths.find(otherPath => 
              otherPath !== item.path && 
              otherPath.startsWith(item.path + '/') && 
              location.pathname.startsWith(otherPath)
            );
            
            // Активний, якщо:
            // 1. Точне співпадіння з item.path
            // 2. Або шлях починається з item.path, але немає активного дочірнього шляху
            const isActive = location.pathname === item.path || 
              (location.pathname.startsWith(item.path + '/') && !activeChildPath);
            
            return (
              <Button
                key={item.path}
                leftIcon={<Icon as={item.icon} />}
                variant={isActive ? "solid" : "ghost"}
                colorScheme={isActive ? "blue" : "gray"}
                justifyContent={isCollapsed ? "center" : "flex-start"}
                width="100%"
                onClick={() => navigate(item.path)}
                px={isCollapsed ? 2 : 4}
                overflow="hidden"
              >
                {!isCollapsed && item.label}
              </Button>
            );
          })}
      </VStack>
      
      {/* Розділитель перед AdminMenu */}
      <Box 
        borderTop="1px" 
        borderColor="gray.200" 
        mt={2}
        pt={2}
      />
    </VStack>
  );
};

