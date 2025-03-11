import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  HStack,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { DashboardMenu } from '../../components/DashboardMenu';
import { CreateUserModal } from '../../components/users/CreateUserModal';
import { User, UserRole } from '../../types/auth';
import { EditUserForm } from '../../components/users/EditUserForm';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

const USER_ROLE_LABELS: Record<UserRole, string> = {
  'ADMIN': 'Адміністратор',
  'PROJECT_MANAGER': 'Менеджер проекту',
  'ENGINEER': 'Інженер',
  'QA': 'QA інженер',
  'GUEST': 'Гість',
};

const USER_ROLE_COLORS: Record<UserRole, string> = {
  'ADMIN': 'red',
  'PROJECT_MANAGER': 'green',
  'ENGINEER': 'blue',
  'QA': 'purple',
  'GUEST': 'gray',
};

export const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити список користувачів',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const handleUpdateUser = async (userData: any) => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await api.put(`/users/${selectedUser.id}`, userData);
      await fetchUsers();
      onClose();
      
      toast({
        title: 'Успіх',
        description: 'Дані користувача оновлено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити дані користувача',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsDeleteLoading(true);
    try {
      await api.delete(`/users/${selectedUser.id}`);
      await fetchUsers();
      onDeleteClose();
      
      toast({
        title: 'Успіх',
        description: 'Користувача видалено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити користувача',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <HStack mb={6} justify="space-between">
          <Heading>Користувачі</Heading>
          <Button
            colorScheme="blue"
            onClick={onOpen}
          >
            Додати користувача
          </Button>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Ім'я</Th>
              <Th>Email</Th>
              <Th>Телефон</Th>
              <Th>Роль</Th>
              <Th>Дії</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phone || '-'}</Td>
                <Td>
                  <Badge colorScheme={USER_ROLE_COLORS[user.role]}>
                    {USER_ROLE_LABELS[user.role]}
                  </Badge>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleEditClick(user)}
                  >
                    Редагувати
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Видалити
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <CreateUserModal
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={fetchUsers}
        />

        {selectedUser && (
          <EditUserForm
            user={selectedUser}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleUpdateUser}
            isLoading={isLoading}
          />
        )}

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleDeleteUser}
          title="Видалення користувача"
          message={`Ви впевнені, що хочете видалити користувача ${selectedUser?.name}?`}
          confirmText="Видалити"
          isLoading={isDeleteLoading}
        />
      </Box>
    </>
  );
}; 