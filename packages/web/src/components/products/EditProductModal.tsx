import { useState, useEffect } from 'react';
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
import { Product } from '../../types/product';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess: () => void;
}

export const EditProductModal = ({ isOpen, onClose, product, onSuccess }: EditProductModalProps) => {
  const [code, setCode] = useState(product.code);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setCode(product.code);
  }, [product]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Код продукту обов\'язковий');
      return;
    }

    setIsLoading(true);
    try {
      await productsApi.updateProduct(product.id, {
        code: code.trim(),
      });
      
      toast({
        title: 'Успіх',
        description: 'Продукт оновлено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Не вдалося оновити продукт';
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
    setCode(product.code);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редагування продукту</ModalHeader>
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
            Зберегти
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 