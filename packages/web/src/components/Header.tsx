import {
  Box,
  Flex,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import { UserRole } from '../types/user';

const ROLE_LABELS: Record<UserRole, string> = {
  'ADMIN': 'Адміністратор',
  'PROJECT_MANAGER': 'Менеджер проектів',
  'WORKER': 'Працівник'
};

export function Header() {
  const navigate = useNavigate();
  const auth = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (!auth?.user) return null;

  return (
    <Box 
      as="header" 
      position="sticky" 
      top={0} 
      zIndex={1000}
      bg={bgColor} 
      borderBottom="1px" 
      borderColor={borderColor}
      px={4}
      py={2}
    >
      <Flex justify="space-between" align="center" maxW="1280px" mx="auto">
        <Text
          fontSize="xl"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => navigate('/dashboard')}
        >
          WorkLog
        </Text>

        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            rightIcon={<Avatar size="sm" name={auth.user.name} />}
          >
            <Box textAlign="left">
              <Text fontWeight="medium">{auth.user.name}</Text>
              <Text fontSize="sm" color="gray.600">
                {ROLE_LABELS[auth.user.role] || 'Невідома роль'}
              </Text>
            </Box>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate('/profile')}>
              Мій профіль
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Вийти
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
} 