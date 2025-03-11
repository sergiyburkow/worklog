import {
  Box,
  Container,
  Stack,
  Text,
  VStack,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { LoginCredentials } from '../../types/auth';
import { FormInput, Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Невірний формат email')
    .required('Email обов\'язковий'),
  password: Yup.string()
    .min(6, 'Пароль має бути не менше 6 символів')
    .required('Пароль обов\'язковий'),
});

const initialValues: LoginCredentials = {
  email: '',
  password: '',
};

export const LoginPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values: LoginCredentials, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const response = await authService.login(values);
      
      login(response.user);
      
      toast({
        title: 'Успішний вхід',
        description: `Ласкаво просимо, ${response.user.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Помилка входу',
        description: error.response?.data?.message || 'Перевірте ваші дані та спробуйте знову',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex 
      minWidth="100vw"
      minHeight="100vh"
      direction="column"
      align="center"
      justify="center"
      bg="gray.50"
      backgroundImage="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      p={4}
    >
      <Container maxW="md" centerContent>
        <VStack 
          spacing={8} 
          bg="white" 
          p={{ base: 6, md: 8 }}
          borderRadius="xl" 
          boxShadow="xl"
          w="full"
          maxW="450px"
          transition="all 0.3s ease-in-out"
          _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
        >
          <VStack spacing={3} textAlign="center" w="full">
            <Box 
              w="80px" 
              h="80px" 
              bg="blue.500" 
              borderRadius="full" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              mb={2}
            >
              <Text fontSize="2xl" fontWeight="bold" color="white">
                WL
              </Text>
            </Box>
            <Text 
              fontSize="3xl" 
              fontWeight="bold" 
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
            >
              Worklog
            </Text>
            <Text color="gray.600" fontSize="lg">
              Увійдіть у свій обліковий запис
            </Text>
          </VStack>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Stack spacing={6} w="full">
                  <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Введіть ваш email"
                    icon={<FiMail color="gray.300" />}
                    isRequired
                  />

                  <FormInput
                    name="password"
                    label="Пароль"
                    type="password"
                    placeholder="Введіть ваш пароль"
                    icon={<FiLock color="gray.300" />}
                    isRequired
                  />

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Вхід..."
                    isFullWidth
                  >
                    Увійти
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </VStack>
      </Container>
    </Flex>
  );
}; 