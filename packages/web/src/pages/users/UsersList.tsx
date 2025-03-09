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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { User, UserRole } from '../../types/auth';

export const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await api.patch(`/users/${selectedUser.id}`, {
        role: selectedUser.role,
      });
      
      await fetchUsers();
      onClose();
      
      toast({
        title: 'Успіх',
        description: 'Роль користувача оновлено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити роль користувача',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цього користувача?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      await fetchUsers();
      
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
    }
  };

  return (
    <Box p={5}>
      <Heading mb={6}>Управління користувачами</Heading>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Ім'я</Th>
            <Th>Роль</Th>
            <Th>Дії</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.email}</Td>
              <Td>{user.name}</Td>
              <Td>{user.role}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  mr={2}
                  onClick={() => handleEditClick(user)}
                >
                  Редагувати
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Видалити
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редагування ролі користувача</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <FormControl>
                <FormLabel>Роль</FormLabel>
                <Select
                  value={selectedUser.role}
                  onChange={(e) => 
                    setSelectedUser({ 
                      ...selectedUser, 
                      role: e.target.value as UserRole 
                    })
                  }
                >
                  <option value="ADMIN">Адміністратор</option>
                  <option value="PROJECT_MANAGER">Менеджер проекту</option>
                  <option value="ENGINEER">Інженер</option>
                  <option value="QA">Тестувальник</option>
                  <option value="GUEST">Гість</option>
                </Select>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Скасувати
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleRoleChange}
              isLoading={isLoading}
            >
              Зберегти
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}; 