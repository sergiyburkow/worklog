import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState, useRef } from 'react';
import { Payment } from '../../types/payment';

interface ProjectPaymentsTableProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
}

export const ProjectPaymentsTable = ({ payments, onEdit, onDelete }: ProjectPaymentsTableProps) => {
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const handleDeleteClick = (payment: Payment) => {
    setPaymentToDelete(payment);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (paymentToDelete) {
      try {
        await onDelete(paymentToDelete.id);
        onClose();
        setPaymentToDelete(null);
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
    }
  };

  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Користувач</Th>
            <Th>Сума</Th>
            <Th>Дата</Th>
            <Th>Створено</Th>
            <Th>Створив</Th>
            <Th>Дії</Th>
          </Tr>
        </Thead>
        <Tbody>
          {payments.map((payment) => (
            <Tr key={payment.id}>
              <Td>{`${payment.user.name} ${payment.user.lastName || ''}`}</Td>
              <Td>{payment.amount}</Td>
              <Td>{new Date(payment.date).toLocaleDateString()}</Td>
              <Td>{new Date(payment.createdAt).toLocaleDateString()}</Td>
              <Td>{`${payment.createdBy.name} ${payment.createdBy.lastName || ''}`}</Td>
              <Td>
                <IconButton
                  aria-label="Редагувати"
                  icon={<EditIcon />}
                  size="sm"
                  mr={2}
                  onClick={() => onEdit(payment)}
                  colorScheme="blue"
                />
                <IconButton
                  aria-label="Видалити"
                  icon={<DeleteIcon />}
                  size="sm"
                  onClick={() => handleDeleteClick(payment)}
                  colorScheme="red"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Видалити платіж
            </AlertDialogHeader>

            <AlertDialogBody>
              Ви впевнені, що хочете видалити цей платіж? Ця дія незворотна.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Скасувати
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Видалити
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}; 