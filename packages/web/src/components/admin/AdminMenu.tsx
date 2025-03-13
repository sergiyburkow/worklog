import { Box, Button, Icon, VStack, IconButton } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUsers, FiFolder, FiBriefcase, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export const AdminMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminMenuCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('adminMenuCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const menuItems = [
    { path: '/users', label: 'Користувачі', icon: FiUsers },
    { path: '/projects', label: 'Проекти', icon: FiFolder },
    { path: '/clients', label: 'Клієнти', icon: FiBriefcase },
  ];

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box 
      position="relative"
      left={0}
      height="calc(100vh - 70px)"
      width={isCollapsed ? "60px" : "250px"}
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      p={4}
      transition="width 0.2s"
      zIndex={1000}
    >
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
      
      <IconButton
        aria-label="Toggle menu"
        icon={<Icon as={isCollapsed ? FiChevronRight : FiChevronLeft} />}
        size="sm"
        position="absolute"
        right="-16px"
        top="50%"
        transform="translateY(-50%)"
        borderRadius="full"
        onClick={toggleMenu}
        boxShadow="md"
        bg="white"
        _hover={{ bg: "gray.100" }}
        zIndex={1000}
      />
    </Box>
  );
}; 