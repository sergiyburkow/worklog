import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const PMDashboard = () => {
  return (
    <AdminLayout>
      <Box p={5}>
        <Heading mb={5}>Панель менеджера проектів</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={8}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Активні проекти</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Завершені проекти</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Команда</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Поточні проекти</Heading>
            <Text color="gray.500">Немає активних проектів</Text>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Останні активності</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Проект</Th>
                  <Th>Завдання</Th>
                  <Th>Виконавець</Th>
                  <Th>Статус</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>-</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                </Tr>
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Box>
    </AdminLayout>
  );
}; 