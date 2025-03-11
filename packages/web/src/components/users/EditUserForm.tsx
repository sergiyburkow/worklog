import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { User, UserRole } from '../../types/auth';
import { Modal } from '../ui/Modal';

interface EditUserFormProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
  isLoading: boolean;
}

interface UserUpdateData {
  name?: string;
  email?: string;
  role?: UserRole;
  phone?: string;
  password?: string;
}

export const EditUserForm = ({ user, isOpen, onClose, onSubmit, isLoading }: EditUserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [updateData, setUpdateData] = useState<UserUpdateData>({
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Видаляємо порожні поля, крім телефону
    const dataToUpdate = Object.fromEntries(
      Object.entries(updateData).filter(([key, value]) => {
        if (key === 'phone') return true; // Завжди включаємо телефон
        return value !== '';
      })
    );

    await onSubmit(dataToUpdate);
  };

  const footer = (
    <>
      <Button variant="ghost" mr={3} onClick={onClose}>
        Скасувати
      </Button>
      <Button
        type="submit"
        form="editUserForm"
        colorScheme="blue"
        isLoading={isLoading}
      >
        Зберегти зміни
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Редагування користувача"
      size="xl"
      footer={footer}
    >
      <form id="editUserForm" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={updateData.email}
              onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Ім'я</FormLabel>
            <Input
              value={updateData.name}
              onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Телефон</FormLabel>
            <Input
              type="tel"
              value={updateData.phone}
              onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
              placeholder="+380XXXXXXXXX"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Новий пароль</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={updateData.password}
                onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                placeholder="Залиште порожнім, щоб не змінювати"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Роль</FormLabel>
            <Select
              value={updateData.role}
              onChange={(e) => setUpdateData({ ...updateData, role: e.target.value as UserRole })}
            >
              <option value="ADMIN">Адміністратор</option>
              <option value="PROJECT_MANAGER">Менеджер проекту</option>
              <option value="ENGINEER">Інженер</option>
              <option value="QA">Тестувальник</option>
              <option value="GUEST">Гість</option>
            </Select>
          </FormControl>
        </VStack>
      </form>
    </Modal>
  );
}; 