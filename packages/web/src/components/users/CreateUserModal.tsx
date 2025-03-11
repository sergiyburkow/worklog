import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { api } from '../../lib/api';
import { UserRole } from '../../types/auth';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const USER_ROLE_LABELS: Record<UserRole, string> = {
  'ADMIN': 'Адміністратор',
  'PROJECT_MANAGER': 'Менеджер проекту',
  'ENGINEER': 'Інженер',
  'QA': 'QA інженер',
  'GUEST': 'Гість',
};

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

export const CreateUserModal = ({ isOpen, onClose, onSuccess }: CreateUserModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'ENGINEER',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/users', userData);
      
      toast({
        title: 'Успіх',
        description: 'Користувача створено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onSuccess();
      onClose();
      setUserData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'ENGINEER',
      });
    } catch (error: any) {
      toast({
        title: 'Помилка',
        description: error.response?.data?.message || 'Не вдалося створити користувача',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Створення нового користувача</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Ім'я</FormLabel>
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  placeholder="Введіть ім'я"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="Введіть email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Пароль</FormLabel>
                <Input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  placeholder="Введіть пароль"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Телефон</FormLabel>
                <Input
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  placeholder="Введіть номер телефону"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Роль</FormLabel>
                <Select
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value as UserRole })}
                >
                  {Object.entries(USER_ROLE_LABELS).map(([role, label]) => (
                    <option key={role} value={role}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Скасувати
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
            >
              Створити
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 