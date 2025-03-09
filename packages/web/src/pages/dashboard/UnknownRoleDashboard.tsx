import { Box, Heading, Text, Card, CardBody, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { DashboardMenu } from '../../components/DashboardMenu';

export const UnknownRoleDashboard = () => {
  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <Heading mb={5}>Помилка доступу</Heading>
        
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          mb={5}
          borderRadius="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Невідома роль користувача
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Ваша роль в системі не визначена або не підтримується.
            Будь ласка, зверніться до адміністратора системи для вирішення проблеми.
          </AlertDescription>
        </Alert>

        <Card>
          <CardBody>
            <Text>
              Якщо ви бачите це повідомлення, це може означати:
            </Text>
            <Box pl={4} mt={4}>
              <Text>• Ваш обліковий запис ще не налаштований</Text>
              <Text>• Виникла помилка при призначенні ролі</Text>
              <Text>• Ваша роль була видалена або змінена</Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </>
  );
}; 