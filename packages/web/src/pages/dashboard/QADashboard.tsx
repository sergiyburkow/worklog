import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { DashboardMenu } from '../../components/DashboardMenu';

export const QADashboard = () => {
  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <Heading mb={5}>Панель тестування</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={8}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Завдання на тестування</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Знайдені помилки</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Успішні тести</StatLabel>
                <StatNumber>0%</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Черга тестування</Heading>
            <Text color="gray.500">Немає завдань на тестування</Text>
          </CardBody>
        </Card>
      </Box>
    </>
  );
}; 