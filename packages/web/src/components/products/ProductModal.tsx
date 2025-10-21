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

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  product?: Product;
  projectId?: string;
  onSuccess: () => void;
}

export const ProductModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  product, 
  projectId, 
  onSuccess 
}: ProductModalProps) => {
  const [code, setCode] = useState(product?.code || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Оновлюємо код при зміні продукту
  useEffect(() => {
    if (product) {
      setCode(product.code);
    } else {
      setCode('');
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Код продукту обов\'язковий');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'create' && projectId) {
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
      } else if (mode === 'edit' && product) {
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
      }
      
      onSuccess();
      onClose();
      setCode('');
      setError('');
    } catch (error: any) {
      const message = error.response?.data?.message || 
        (mode === 'create' ? 'Не вдалося створити продукт' : 'Не вдалося оновити продукт');
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
    setCode(product?.code || '');
    setError('');
    onClose();
  };

  const getTitle = () => {
    return mode === 'create' ? 'Створення продукту' : 'Редагування продукту';
  };

  const getButtonText = () => {
    return mode === 'create' ? 'Створити' : 'Зберегти';
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{getTitle()}</ModalHeader>
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
            {getButtonText()}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
