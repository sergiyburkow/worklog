import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, useToast } from '@chakra-ui/react';
import { api } from '../../lib/api';
import { ProjectPaymentsTable } from '../../components/projects/ProjectPaymentsTable';
import { PaymentModal } from '../../components/projects/PaymentModal';
import { Payment } from '../../types/payment';

export const ProjectPayments = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (projectId) {
      fetchPayments();
    }
  }, [projectId]);

  const fetchPayments = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/payments`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити платежі',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreatePayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'user' | 'createdBy' | 'projectId'>) => {
    try {
      await api.post(`/projects/${projectId}/payments`, paymentData);
      toast({
        title: 'Успіх',
        description: 'Платіж успішно створено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsModalOpen(false);
      fetchPayments();
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося створити платіж',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdatePayment = async (paymentId: string, paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'user' | 'createdBy' | 'projectId'>) => {
    try {
      await api.put(`/projects/${projectId}/payments/${paymentId}`, paymentData);
      toast({
        title: 'Успіх',
        description: 'Платіж успішно оновлено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsModalOpen(false);
      setEditingPayment(null);
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити платіж',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await api.delete(`/projects/${projectId}/payments/${paymentId}`);
      toast({
        title: 'Успіх',
        description: 'Платіж успішно видалено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити платіж',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  if (!projectId) {
    return null;
  }

  return (
    <Box p={4}>
      <Box mb={4}>
        <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
          Додати платіж
        </Button>
      </Box>
      <ProjectPaymentsTable
        payments={payments}
        onEdit={handleEditPayment}
        onDelete={handleDeletePayment}
      />
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPayment(null);
        }}
        onSubmit={editingPayment 
          ? (paymentData) => handleUpdatePayment(editingPayment.id, paymentData)
          : handleCreatePayment
        }
        payment={editingPayment}
        projectId={projectId}
      />
    </Box>
  );
}; 