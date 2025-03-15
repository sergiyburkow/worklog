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
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { CreateUserModal } from '../../components/users/CreateUserModal';
import { User, UserRole } from '../../types/auth';
import { EditUserForm } from '../../components/users/EditUserForm';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { TableActions } from '../../components/ui/TableActions';
import { useNavigate } from 'react-router-dom';

const USER_ROLE_LABELS: Record<UserRole, string> = {
  'ADMIN': 'Адміністратор',
  'PROJECT_MANAGER': 'Менеджер проекту',
  'WORKER': 'Робітник',
  'GUEST': 'Гість',
};

const USER_ROLE_COLORS: Record<UserRole, string> = {
  'ADMIN': 'red',
  'PROJECT_MANAGER': 'green',
  'WORKER': 'blue',
  'GUEST': 'gray',
};

export const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { 
    isOpen: isCreateOpen, 
    onOpen: onCreateOpen, 
    onClose: onCreateClose 
  } = useDisclosure();
  const { 
    isOpen: isEditOpen, 
    onOpen: onEditOpen, 
    onClose: onEditClose 
  } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

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
    onEditOpen();
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
      setSelectedUser(null);
      onEditClose();
      
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

  const handleEditClose = () => {
    setSelectedUser(null);
    onEditClose();
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
    <AdminLayout>
      <Box width="100%" maxW="100%">
        <Box p={5}>
          <HStack mb={6} justify="space-between" width="100%">
            <Heading>Користувачі</Heading>
            <Button colorScheme="blue" onClick={onCreateOpen}>
              Додати користувача
            </Button>
          </HStack>

          <Box overflowX="auto" width="100%">
            <Table variant="simple" width="100%">
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
                    <Td>{user.name} {user.lastName}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.phone || '-'}</Td>
                    <Td>
                      <Badge colorScheme={USER_ROLE_COLORS[user.role]}>
                        {USER_ROLE_LABELS[user.role]}
                      </Badge>
                    </Td>
                    <Td>
                      <TableActions
                        actions={[
                          {
                            label: 'Редагувати',
                            icon: <EditIcon boxSize={4} />,
                            colorScheme: 'blue',
                            onClick: () => handleEditClick(user),
                          },
                          {
                            label: 'Видалити',
                            icon: <DeleteIcon boxSize={4} />,
                            colorScheme: 'red',
                            onClick: () => handleDeleteClick(user),
                          },
                        ]}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <CreateUserModal
            isOpen={isCreateOpen}
            onClose={onCreateClose}
            onSuccess={fetchUsers}
          />

          {selectedUser && (
            <EditUserForm
              user={selectedUser}
              isOpen={isEditOpen}
              onClose={handleEditClose}
              onSubmit={handleUpdateUser}
              isLoading={isLoading}
            />
          )}

          <ConfirmModal
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            onConfirm={handleDeleteUser}
            title="Видалення користувача"
            message="Ви впевнені, що хочете видалити цього користувача?"
            isLoading={isDeleteLoading}
          />
        </Box>
      </Box>
    </AdminLayout>
  );
}; 