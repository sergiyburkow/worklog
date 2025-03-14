import { Button, HStack, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AddIcon, SettingsIcon, InfoIcon } from '@chakra-ui/icons';

interface TaskRegistrationButtonsProps {
  projectId: string;
}

export const TaskRegistrationButtons = ({ projectId }: TaskRegistrationButtonsProps) => {
  const navigate = useNavigate();

  return (
    <HStack spacing={4} justify="center">
      <Button
        leftIcon={<AddIcon />}
        colorScheme="blue"
        onClick={() => navigate(`/projects/${projectId}/tasks/product/register`)}
      >
        <Box as="span">
          Основна
          <Box as="span" display={{ base: 'none', md: 'inline' }}> задача</Box>
        </Box>
      </Button>
      <Button
        leftIcon={<SettingsIcon />}
        colorScheme="purple"
        onClick={() => navigate(`/projects/${projectId}/tasks/intermediate/register`)}
      >
        <Box as="span">
          Проміжна
          <Box as="span" display={{ base: 'none', md: 'inline' }}> задача</Box>
        </Box>
      </Button>
      <Button
        leftIcon={<InfoIcon />}
        colorScheme="green"
        onClick={() => navigate(`/projects/${projectId}/tasks/general/register`)}
      >
        <Box as="span">
          Загальна
          <Box as="span" display={{ base: 'none', md: 'inline' }}> задача</Box>
        </Box>
      </Button>
    </HStack>
  );
}; 