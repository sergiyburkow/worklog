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

const USER_ROLE_LABELS: Record<string, string> = {
  'ADMIN': 'Адміністратор',
  'PROJECT_MANAGER': 'Менеджер проектів',
  'WORKER': 'Працівник',
  'GUEST': 'Гість',
};

interface CreateUserData {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  callSign: string;
}

export const CreateUserModal = ({ isOpen, onClose, onSuccess }: CreateUserModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<CreateUserData>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'WORKER',
    callSign: '',
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
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 'WORKER',
        callSign: '',
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
        <form onSubmit={handleSubmit} autoComplete="off">
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
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Прізвище</FormLabel>
                <Input
                  value={userData.lastName}
                  onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  placeholder="Введіть прізвище"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Позивний</FormLabel>
                <Input
                  value={userData.callSign}
                  onChange={(e) => setUserData({ ...userData, callSign: e.target.value })}
                  placeholder="Введіть позивний"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="Введіть email"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Пароль</FormLabel>
                <Input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  placeholder="Введіть пароль"
                  autoComplete="new-password"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Телефон</FormLabel>
                <Input
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  placeholder="Введіть номер телефону"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
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