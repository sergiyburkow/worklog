import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  Button, 
  useToast, 
  Card, 
  CardBody,
  VStack
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { UserRole } from '../../types/auth';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setUserData(response.data);
      } catch (error) {
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані користувача',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setIsLoading(true);
    try {
      await api.patch(`/users/${id}`, userData);
      toast({
        title: 'Успіх',
        description: 'Дані користувача оновлено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/dashboard');
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

  if (!userData) {
    return null;
  }

  return (
    <Box p={5}>
      <Card>
        <CardBody>
          <Heading mb={6}>Редагування користувача</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={userData.email}
                  isReadOnly
                />
              </FormControl>

              <FormControl>
                <FormLabel>Ім'я</FormLabel>
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Роль</FormLabel>
                <Select
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value as UserRole })}
                >
                  <option value="ADMIN">Адміністратор</option>
                  <option value="PROJECT_MANAGER">Менеджер проекту</option>
                  <option value="ENGINEER">Інженер</option>
                  <option value="QA">Тестувальник</option>
                  <option value="GUEST">Гість</option>
                </Select>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                mt={4}
              >
                Зберегти зміни
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}; 