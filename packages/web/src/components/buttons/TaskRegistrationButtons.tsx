import { Button, HStack, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AddIcon, SettingsIcon, InfoIcon, ViewIcon } from '@chakra-ui/icons';

interface TaskRegistrationButtonsProps {
  projectId: string;
}

export const TaskRegistrationButtons = ({ projectId }: TaskRegistrationButtonsProps) => {
  const navigate = useNavigate();

  return (  
    <HStack spacing={2} justify="center">
      <Button
        leftIcon={<AddIcon display={{ base: 'none', sm: 'inline' }} />}
        colorScheme="blue"
        onClick={() => navigate(`/projects/${projectId}/tasks/register/product`)}
        size={{ base: 'sm', md: 'md' }}
        >
        <Box as="span">
          Основна
          <Box as="span" display={{ base: 'none', md: 'inline' }}> задача</Box>
        </Box>
      </Button>
      <Button
        leftIcon={<SettingsIcon display={{ base: 'none', sm: 'inline' }} />}
        colorScheme="purple"
        onClick={() => navigate(`/projects/${projectId}/tasks/register/intermediate`)}
        size={{ base: 'sm', md: 'md' }}
        >
        <Box as="span">
          Проміжна
          <Box as="span" display={{ base: 'none', md: 'inline' }}> задача</Box>
        </Box>
      </Button>
      <Button
        leftIcon={<InfoIcon display={{ base: 'none', sm: 'inline' }} />}
        colorScheme="green"
        onClick={() => navigate(`/projects/${projectId}/tasks/register/general`)}
          size={{ base: 'sm', md: 'md' }}
      >
        <Box as="span">
          Загальна
          <Box as="span" display={{ base: 'none', md: 'inline' }}> задача</Box>
        </Box>
      </Button>
    </HStack>
  );
}; 