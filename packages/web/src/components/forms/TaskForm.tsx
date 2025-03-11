import { FormEvent } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

export enum TaskType {
  PRODUCT = 'PRODUCT',
  GENERAL = 'GENERAL'
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  [TaskType.PRODUCT]: 'Продуктове',
  [TaskType.GENERAL]: 'Загальне'
};

export interface TaskFormData {
  name: string;
  description: string;
  estimatedTime?: string;
  type: TaskType;
  complexity?: number;
  tags?: string;
}

interface TaskFormProps {
  formData: TaskFormData;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onChange: (data: Partial<TaskFormData>) => void;
  onCancel: () => void;
}

export const TaskForm = ({ formData, isLoading, onSubmit, onChange, onCancel }: TaskFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <ModalBody>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Назва завдання</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Введіть назву завдання"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Опис</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Введіть опис завдання"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Тип завдання</FormLabel>
            <Select
              value={formData.type}
              onChange={(e) => {
                const newType = e.target.value as TaskType;
                onChange({ 
                  type: newType,
                  // Очищаємо estimatedTime якщо тип змінено на GENERAL
                  ...(newType === TaskType.GENERAL && { estimatedTime: undefined })
                });
              }}
            >
              {Object.entries(TASK_TYPE_LABELS).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Складність</FormLabel>
            <Input
              type="number"
              min={1}
              max={10}
              value={formData.complexity || ''}
              onChange={(e) => onChange({ 
                complexity: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              placeholder="Від 1 до 10"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Теги</FormLabel>
            <Input
              value={formData.tags || ''}
              onChange={(e) => onChange({ tags: e.target.value })}
              placeholder="Введіть теги через кому"
            />
          </FormControl>

          {formData.type === TaskType.PRODUCT && (
            <FormControl isRequired>
              <FormLabel>Очікуваний час виконання (хвилин)</FormLabel>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={formData.estimatedTime || ''}
                onChange={(e) => onChange({ estimatedTime: e.target.value })}
                placeholder="Введіть очікуваний час"
              />
            </FormControl>
          )}
        </VStack>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onCancel}>
          Скасувати
        </Button>
        <Button type="submit" colorScheme="blue" isLoading={isLoading}>
          Додати завдання
        </Button>
      </ModalFooter>
    </form>
  );
}; 