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
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { TableActions, Action } from '../../components/ui/TableActions';

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
    <AdminLayout>
      <Box width="100%" maxW="100%">
        <Box p={5}>
          <HStack mb={6} justify="space-between" width="100%">
            <Heading>Клієнти</Heading>
            <Button colorScheme="blue" onClick={() => navigate('/clients/new')}>
              Додати клієнта
            </Button>
          </HStack>

          <Box overflowX="auto" width="100%">
            <Table variant="simple" width="100%">
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
                      <TableActions
                        actions={[
                          {
                            label: 'Редагувати',
                            icon: <EditIcon boxSize={4} />,
                            colorScheme: 'blue',
                            onClick: () => handleEditClick(client),
                          },
                          {
                            label: 'Видалити',
                            icon: <DeleteIcon boxSize={4} />,
                            colorScheme: 'red',
                            onClick: () => handleDeleteClick(client),
                          },
                        ]}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

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
      </Box>
    </AdminLayout>
  );
}; 