import { Box, Heading, Button, SimpleGrid, Stat, StatLabel, StatNumber, Card, CardBody, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DashboardMenu } from '../../components/DashboardMenu';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <Heading mb={5}>Адміністративна панель</Heading>
        
        <Button
          colorScheme="blue"
          size="lg"
          mb={8}
          onClick={() => navigate('/users')}
        >
          Управління користувачами
        </Button>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Всього користувачів</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Активних проектів</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Завершених проектів</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Клієнтів</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </>
  );
}; 