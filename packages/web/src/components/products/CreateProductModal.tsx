import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { productsApi } from '../../api/products';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSuccess: () => void;
}

export const CreateProductModal = ({ isOpen, onClose, projectId, onSuccess }: CreateProductModalProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Код продукту обов\'язковий');
      return;
    }

    setIsLoading(true);
    try {
      await productsApi.createProduct({
        code: code.trim(),
        projectId,
      });
      
      toast({
        title: 'Успіх',
        description: 'Продукт створено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onSuccess();
      onClose();
      setCode('');
      setError('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Не вдалося створити продукт';
      setError(Array.isArray(message) ? message[0] : message);
      
      toast({
        title: 'Помилка',
        description: Array.isArray(message) ? message[0] : message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Створення продукту</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <FormControl isInvalid={!!error}>
            <FormLabel>Код продукту</FormLabel>
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              placeholder="Введіть код продукту"
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Скасувати
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Створити
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 