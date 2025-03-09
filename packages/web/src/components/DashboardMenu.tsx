import { Box, Flex, Button, Text, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';

export const DashboardMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box 
      as="nav" 
      bg="white" 
      py={4} 
      px={6} 
      borderBottom="1px" 
      borderColor="gray.200"
      mb={6}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Text fontSize="xl" fontWeight="bold">
          WorkLog
        </Text>

        <Menu>
          <MenuButton>
            <Flex align="center" gap={2}>
              <Avatar size="sm" name={user?.name} />
              <Box>
                <Text fontWeight="medium">{user?.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {user?.role}
                </Text>
              </Box>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleLogout}>
              Вийти
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}; 