import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody, Progress, HStack, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DashboardMenu } from '../../components/DashboardMenu';

export const EngineerDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <Heading mb={5}>Інженерна панель</Heading>
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
            <Heading size="md" mb={4}>Поточний проект</Heading>
            <Box mb={4}>
              <HStack justify="space-between" mb={2}>
                <Text>Прогрес</Text>
                <Text>0%</Text>
              </HStack>
              <Progress value={0} />
            </Box>
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text color="gray.500">Дедлайн</Text>
                <Text>-</Text>
              </Box>
              <Box>
                <Text color="gray.500">Витрачено часу</Text>
                <Text>0г / 0г</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Мої завдання на сьогодні</Heading>
            <Text color="gray.500">Немає активних завдань</Text>
          </CardBody>
        </Card>
      </Box>
    </>
  );
}; 