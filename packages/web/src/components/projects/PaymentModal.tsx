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
  VStack,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Payment } from '../../types/payment';
import { ProjectUser } from '../../types/project-user';
import { api } from '../../lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'user' | 'createdBy' | 'projectId'>) => Promise<void>;
  payment?: Payment | null;
  projectId: string;
}

export const PaymentModal = ({ isOpen, onClose, onSubmit, payment, projectId }: PaymentModalProps) => {
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    date: '',
  });
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchProjectUsers();
    }
  }, [isOpen, projectId]);

  useEffect(() => {
    if (payment) {
      setFormData({
        userId: payment.userId,
        amount: payment.amount.toString(),
        date: new Date(payment.date).toISOString().split('T')[0],
      });
    } else {
      resetForm();
    }
  }, [payment]);

  const resetForm = () => {
    setFormData({
      userId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const fetchProjectUsers = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching users for project:', projectId);
      const response = await api.get(`/projects/${projectId}/users`);
      console.log('Users response:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching project users:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити користувачів проекту',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        userId: formData.userId,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
        createdById: formData.userId,
      });
      resetForm();
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося зберегти платіж',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{payment ? 'Редагувати платіж' : 'Додати платіж'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Користувач</FormLabel>
                <Select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Оберіть користувача"
                  isDisabled={isLoading}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {`${user.name} ${user.lastName || ''} ${user.callSign ? `(${user.callSign})` : ''}`}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Сума</FormLabel>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Введіть суму"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Дата</FormLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Скасувати
            </Button>
            <Button colorScheme="blue" type="submit">
              {payment ? 'Оновити' : 'Додати'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 