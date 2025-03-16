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
import { useState } from 'react';
import { Product } from '../../types/product';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { code: string }) => Promise<void>;
  product?: Product;
  isLoading?: boolean;
}

export const ProductFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product, 
  isLoading 
}: ProductFormModalProps) => {
  const [code, setCode] = useState(product?.code || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Код продукту обов\'язковий');
      return;
    }

    try {
      await onSubmit({ code: code.trim() });
      setCode('');
      setError(null);
      onClose();
    } catch (error) {
      // Помилка буде оброблена у батьківському компоненті
    }
  };

  const handleClose = () => {
    setCode('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {product ? 'Редагування продукту' : 'Створення продукту'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <FormControl isInvalid={!!error}>
            <FormLabel>Код продукту</FormLabel>
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              placeholder="Введіть код продукту"
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
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
            {product ? 'Зберегти' : 'Створити'}
          </Button>
        </ModalFooter>
      </ModalContent>
 