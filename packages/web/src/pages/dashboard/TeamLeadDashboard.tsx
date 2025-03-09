import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export const TeamLeadDashboard = () => {
  return (
    <Box p={5}>
      <Heading mb={5}>Панель керування командою</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Члени команди</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Активні завдання</StatLabel>
              <StatNumber>0</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Ефективність команди</StatLabel>
              <StatNumber>0%</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Статус команди</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Розробник</Th>
                <Th>Поточне завдання</Th>
                <Th>Прогрес</Th>
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
  );
}; 