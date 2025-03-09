import { Box, Heading, Text, Card, CardBody, VStack, Button } from '@chakra-ui/react';
import { DashboardMenu } from '../../components/DashboardMenu';

export const GuestDashboard = () => {
  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <Heading mb={5}>Гостьова панель</Heading>
        
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Ласкаво просимо до WorkLog!</Heading>
              <Text>
                Ви увійшли як гість. У вас є обмежений доступ до системи.
                Для отримання повного доступу зверніться до адміністратора.
              </Text>
              <Text color="gray.600">
                Як гість, ви можете:
              </Text>
              <Box pl={4}>
                <Text>• Переглядати загальну інформацію</Text>
                <Text>• Змінювати свій пароль</Text>
                <Text>• Оновлювати свій профіль</Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </>
  );
}; 