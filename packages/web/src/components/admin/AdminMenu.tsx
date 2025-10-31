import { Button, Icon, VStack } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUsers, FiFolder, FiBriefcase } from 'react-icons/fi';

export const AdminMenu = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/users', label: 'Користувачі', icon: FiUsers },
    { path: '/projects', label: 'Проекти', icon: FiFolder },
    { path: '/clients', label: 'Клієнти', icon: FiBriefcase },
  ];


  return (
      <VStack spacing={2} align="stretch">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            leftIcon={<Icon as={item.icon} />}
            variant={location.pathname === item.path ? "solid" : "ghost"}
            colorScheme={location.pathname === item.path ? "blue" : "gray"}
            justifyContent={isCollapsed ? "center" : "flex-start"}
            width="100%"
            onClick={() => navigate(item.path)}
            px={isCollapsed ? 2 : 4}
            overflow="hidden"
          >
            {!isCollapsed && item.label}
          </Button>
        ))}
      </VStack>
  );
}; 