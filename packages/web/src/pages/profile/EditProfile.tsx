import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Container,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { UserRole } from '../../types/user';

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Адміністратор',
  PROJECT_MANAGER: 'Менеджер проектів',
  WORKER: 'Працівник',
};

export const EditProfile = () => {
  const auth = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: auth?.user?.name || '',
    lastName: auth?.user?.lastName || '',
    email: auth?.user?.email || '',
    phone: auth?.user?.phone || '',
    callSign: auth?.user?.callSign || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.user) return;
    
    setIsLoading(true);

    try {
      // Перевіряємо, чи співпадають паролі
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast({
          title: 'Помилка',
          description: 'Нові паролі не співпадають',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const updateData = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        callSign: formData.callSign,
        ...(formData.currentPassword && formData.newPassword ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        } : {}),
      };

      const updatedUser = await userService.updateProfile(updateData);
      auth.updateUser(updatedUser);

      toast({
        title: 'Успіх',
        description: 'Профіль успішно оновлено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Очищаємо поля паролів
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Помилка при оновленні профілю:', error);
      const errorMessage = error.response?.data?.message || 'Не вдалося оновити профіль';
      toast({
        title: 'Помилка',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!auth?.user) {
    return null;
  }

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Редагування профілю</Heading>
        
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Роль</FormLabel>
              <Badge colorScheme="blue" fontSize="md" p={2}>
                {ROLE_LABELS[auth.user.role]}
              </Badge>
            </FormControl>

            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Ім'я</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Прізвище</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
                <FormLabel>Позивний</FormLabel>
                <Input
                  name="callSign"
                  value={formData.callSign}
                  onChange={handleChange}
                />
              </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormControl>

              <FormControl>
                <FormLabel>Телефон</FormLabel>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormControl>

            <Heading size="md" mt={4}>Зміна паролю</Heading>

            <FormControl>
              <FormLabel>Поточний пароль</FormLabel>
              <Input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Новий пароль</FormLabel>
              <Input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Підтвердження нового паролю</FormLabel>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormControl>

            <Button
              mt={4}
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              loadingText="Збереження..."
            >
              Зберегти зміни
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}; 