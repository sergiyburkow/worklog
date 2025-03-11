import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  HStack,
  Textarea,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { DashboardMenu } from '../../components/DashboardMenu';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { GlobalFormWrapper } from '../../components/ui/GlobalFormWrapper';

interface ClientData {
  name: string;
  description: string;
  address: string;
  contactInfo: string;
}

export const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    description: '',
    address: '',
    contactInfo: '',
  });

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/clients/${id}`);
        const client = response.data;
        setClientData({
          name: client.name || '',
          description: client.description || '',
          address: client.address || '',
          contactInfo: client.contactInfo || '',
        });
      } catch (error) {
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані клієнта',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchClient();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (id) {
        await api.put(`/clients/${id}`, clientData);
      } else {
        await api.post('/clients', clientData);
      }

      toast({
        title: 'Успіх',
        description: id ? 'Клієнта оновлено' : 'Клієнта створено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/clients');
    } catch (error) {
      toast({
        title: 'Помилка',
        description: id ? 'Не вдалося оновити клієнта' : 'Не вдалося створити клієнта',
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
        <Heading mb={6}>{id ? 'Редагування клієнта' : 'Новий клієнт'}</Heading>
        <GlobalFormWrapper>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Назва</FormLabel>
                <Input
                  value={clientData.name}
                  onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Опис</FormLabel>
                <Textarea
                  value={clientData.description}
                  onChange={(e) => setClientData({ ...clientData, description: e.target.value })}
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Адреса</FormLabel>
                <Input
                  value={clientData.address}
                  onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Контактна інформація</FormLabel>
                <Textarea
                  value={clientData.contactInfo}
                  onChange={(e) => setClientData({ ...clientData, contactInfo: e.target.value })}
                  rows={3}
                  placeholder="Телефони, email, контактні особи тощо"
                />
              </FormControl>

              <HStack spacing={4} justify="flex-end">
                <Button variant="ghost" onClick={() => navigate('/clients')}>
                  Скасувати
                </Button>
                <Button
                  mt={4}
                  colorScheme="blue"
                  type="submit"
                  isLoading={isLoading}
                  width="100%"
                >
                  {id ? 'Зберегти' : 'Створити'}
                </Button>
              </HStack>
            </VStack>
          </form>
        </GlobalFormWrapper>
      </Box>
    </AdminLayout>
  );
}; 