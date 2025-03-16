import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import { formatDate } from '../utils/date';

interface Payment {
  id: string;
  userId: string;
  projectId: string;
  createdById: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    lastName: string | null;
    callSign: string | null;
  };
  createdBy: {
    id: string;
    name: string;
    lastName: string | null;
    callSign: string | null;
  };
}

interface ProjectPaymentsTableProps {
  payments: Payment[];
}

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(amount);
};

export const ProjectPaymentsTable: React.FC<ProjectPaymentsTableProps> = ({ payments }) => {
  const formatUserName = (user: Payment['user']) => {
    const parts = [user.name];
    if (user.lastName) parts.push(user.lastName);
    if (user.callSign) parts.push(`(${user.callSign})`);
    return parts.join(' ');
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Отримувач</Th>
            <Th isNumeric>Сума</Th>
            <Th>Дата</Th>
            <Th>Створено</Th>
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
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}; 