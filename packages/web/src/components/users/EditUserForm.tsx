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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { User, UserRole } from '../../types/auth';
import { GlobalFormWrapper } from '../ui/GlobalFormWrapper';

interface EditUserFormProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface UserUpdateData {
  name?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  phone?: string;
  password?: string;
  callSign?: string;
}

export const EditUserForm = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditUserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [updateData, setUpdateData] = useState<UserUpdateData>({
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    password: '',
    callSign: user.callSign || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(updateData);
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редагування користувача</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <GlobalFormWrapper>
            <form id="editUserForm" onSubmit={handleSubmit} autoComplete="off">
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={updateData.email}
                    onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                    autoComplete="off"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Ім'я</FormLabel>
                  <Input
                    value={updateData.name}
                    onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                    autoComplete="off"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Прізвище</FormLabel>
                  <Input
                    value={updateData.lastName}
                    onChange={(e) => setUpdateData({ ...updateData, lastName: e.target.value })}
                    autoComplete="off"
                    placeholder="Введіть прізвище"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Позивний</FormLabel>
                  <Input
                    value={updateData.callSign}
                    onChange={(e) => setUpdateData({ ...updateData, callSign: e.target.value })}
                    autoComplete="off"
                    placeholder="Введіть позивний"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Телефон</FormLabel>
                  <Input
                    type="tel"
                    value={updateData.phone}
                    onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                    placeholder="+380XXXXXXXXX"
                    autoComplete="off"
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
                      autoComplete="new-password"
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
                    <option value="PROJECT_MANAGER">Менеджер проектів</option>
                    <option value="WORKER">Працівник</option>
                    <option value="GUEST">Гість</option>
                  </Select>
                </FormControl>

                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isLoading}
                  width="100%"
                >
                  Зберегти
                </Button>
              </VStack>
            </form>
          </GlobalFormWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 