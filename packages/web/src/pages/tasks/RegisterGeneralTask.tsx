import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const RegisterGeneralTask = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post(`/projects/${projectId}/tasks`, {
        ...formData,
        type: 'GENERAL',
      });

      toast({
        title: 'Успіх',
        description: 'Загальну задачу створено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate(`/projects/${projectId}/tasks`);
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося створити загальну задачу',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Box p={5}>
        <VStack spacing={6} align="stretch" maxW="container.md" mx="auto">
          <Heading size="lg">Реєстрація загальної задачі</Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Назва задачі</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Опис</FormLabel>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </FormControl>

              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                width="100%"
              >
                Створити
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </AdminLayout>
  );
}; 