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
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { DashboardMenu } from '../../components/DashboardMenu';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

interface Client {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  contactInfo: string | null;
}

export const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити список клієнтів',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEditClick = (client: Client) => {
    navigate(`/clients/${client.id}/edit`);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    onDeleteOpen();
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    setIsDeleteLoading(true);
    try {
      await api.delete(`/clients/${selectedClient.id}`);
      await fetchClients();
      onDeleteClose();
      
      toast({
        title: 'Успіх',
        description: 'Клієнта видалено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити клієнта',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <HStack mb={6} justify="space-between">
          <Heading>Клієнти</Heading>
          <Button
            colorScheme="blue"
            onClick={() => navigate('/clients/new')}
          >
            Додати клієнта
          </Button>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Назва</Th>
              <Th>Опис</Th>
              <Th>Адреса</Th>
              <Th>Контактна інформація</Th>
              <Th>Дії</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client) => (
              <Tr key={client.id}>
                <Td>{client.name}</Td>
                <Td>{client.description || '-'}</Td>
                <Td>{client.address || '-'}</Td>
                <Td>{client.contactInfo || '-'}</Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                    onClick={() => handleEditClick(client)}
                  >
                    Редагувати
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteClick(client)}
                  >
                    Видалити
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleDeleteClient}
          title="Видалення клієнта"
          message={`Ви впевнені, що хочете видалити клієнта "${selectedClient?.name}"?`}
          confirmText="Видалити"
          isLoading={isDeleteLoading}
        />
      </Box>
    </>
  );
}; 