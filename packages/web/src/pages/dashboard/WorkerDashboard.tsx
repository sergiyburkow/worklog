import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody, Progress, HStack, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DashboardMenu } from '../../components/DashboardMenu';

export const WorkerDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <Heading mb={5}>Робоча панель</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={8}>
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
                <StatLabel>Завершені завдання</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Загальний час</StatLabel>
                <StatNumber>0г</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card mb={5}>
          <CardBody>
            <Heading size="md" mb={4}>Поточні проекти</Heading>
            <Text color="gray.500">Немає активних проектів</Text>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Останні активності</Heading>
            <Text color="gray.500">Немає записів про активність</Text>
          </CardBody>
        </Card>
      </Box>
    </>
  );
}; 