import React, { useState, useRef } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
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
import { formatDate } from '../utils/date';
import { Payment } from '../types/payment';

interface ProjectPaymentsTableProps {
  payments: Payment[];
  mode?: 'readonly' | 'editable';
  onEdit?: (payment: Payment) => void;
  onDelete?: (paymentId: string) => void;
}

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(amount);
};

export const ProjectPaymentsTable: React.FC<ProjectPaymentsTableProps> = ({ 
  payments, 
  mode = 'readonly',
  onEdit,
  onDelete 
}) => {
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const formatUserName = (user: Payment['user']) => {
    const parts = [user.name];
    if (user.lastName) parts.push(user.lastName);
    if (user.callSign) parts.push(`(${user.callSign})`);
    return parts.join(' ');
  };

  const handleDeleteClick = (payment: Payment) => {
    setPaymentToDelete(payment);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (paymentToDelete && onDelete) {
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
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Отримувач</Th>
              <Th isNumeric>Сума</Th>
              <Th>Дата</Th>
              <Th>Створено</Th>
              {mode === 'editable' && <Th>Дії</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment) => (
              <Tr key={payment.id}>
                <Td>{formatUserName(payment.user)}</Td>
                <Td isNumeric>{formatAmount(payment.amount)}</Td>
                <Td>{formatDate(payment.date)}</Td>
                <Td>
                  <Text fontSize="sm" color="gray.600">
                    {formatUserName(payment.createdBy)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {formatDate(payment.createdAt)}
                  </Text>
                </Td>
                {mode === 'editable' && (
                  <Td>
                    {onEdit && (
                      <IconButton
                        aria-label="Редагувати"
                        icon={<EditIcon />}
                        size="sm"
                        mr={2}
                        onClick={() => onEdit(payment)}
                        colorScheme="blue"
                      />
                    )}
                    {onDelete && (
                      <IconButton
                        aria-label="Видалити"
                        icon={<DeleteIcon />}
                        size="sm"
                        onClick={() => handleDeleteClick(payment)}
                        colorScheme="red"
                      />
                    )}
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {mode === 'editable' && onDelete && (
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
      )}
    </>
  );
};