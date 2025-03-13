import React from 'react';
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
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';

interface EditTaskLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskLog: {
    id: string;
    registeredAt: string;
    timeSpent?: number;
    product?: {
      code: string;
    };
    task: {
      type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
    };
  };
  onSuccess: () => void;
}

interface FormData {
  registeredAt: string;
  timeSpent: number;
  productCode?: string;
}

export const EditTaskLogModal: React.FC<EditTaskLogModalProps> = ({
  isOpen,
  onClose,
  taskLog,
  onSuccess,
}) => {
  const toast = useToast();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      registeredAt: new Date(taskLog.registeredAt).toISOString().slice(0, 16),
      timeSpent: taskLog.timeSpent,
      productCode: taskLog.product?.code,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/task-logs/${taskLog.id}`, {
        registeredAt: data.registeredAt,
        timeSpent: Number(data.timeSpent),
        ...(taskLog.task.type === 'PRODUCT' && { productCode: data.productCode }),
      });

      toast({
        title: 'Успішно оновлено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Помилка при оновленні',
        description: 'Не вдалося оновити запис',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редагування запису</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Дата виконання</FormLabel>
                <Input
                  type="datetime-local"
                  {...register('registeredAt')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Витрачений час (години)</FormLabel>
                <Input
                  type="number"
                  step="0.25"
                  {...register('timeSpent')}
                />
              </FormControl>
              {taskLog.task.type === 'PRODUCT' && (
                <FormControl>
                  <FormLabel>Код продукту</FormLabel>
                  <Input {...register('productCode')} />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Скасувати
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
            >
              Зберегти
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 