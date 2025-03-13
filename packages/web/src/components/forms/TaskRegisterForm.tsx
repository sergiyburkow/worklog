import React, { useState, useEffect, useRef } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Button,
  HStack,
  Text,
  Box,
  useToast,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Icon,
} from '@chakra-ui/react';
import { FaQrcode, FaTimes } from 'react-icons/fa';
import { api } from '../../lib/api';
import { QRScanner } from '../QRScanner';

interface Task {
  id: string;
  name: string;
  estimatedTime: string;
  type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
}

interface ProjectUser {
  id: string;
  name: string;
  role: string;
}

interface TaskLogFormData {
  productCode: string;
  taskId: string;
  registeredAt: string;
  userId?: string;
  timeSpent?: string;
  hours?: string;
  minutes?: string;
  quantity?: string;
}

interface TaskRegisterFormProps {
  onSubmit: (data: TaskLogFormData) => Promise<void>;
  isLoading?: boolean;
  projectId: string;
  currentUser: {
    id: string;
    role: 'ADMIN' | 'PROJECT_MANAGER' | 'WORKER' | 'GUEST';
  };
  isProductTask: boolean;
  taskType: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
}

export const TaskRegisterForm: React.FC<TaskRegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  projectId,
  currentUser,
  isProductTask,
  taskType,
}) => {
  const toast = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [productExists, setProductExists] = useState<boolean | null>(null);
  const [isCheckingProduct, setIsCheckingProduct] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const parseInputDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return formatDateForInput(date);
  };

  const [formData, setFormData] = useState<TaskLogFormData>({
    productCode: '',
    taskId: '',
    registeredAt: formatDateForInput(new Date()),
    userId: ['ADMIN', 'PROJECT_MANAGER'].includes(currentUser.role) ? undefined : currentUser.id,
    timeSpent: '',
    hours: '',
    minutes: '',
    quantity: '',
  });

  // Завантаження задач при ініціалізації
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/tasks`);
        const filteredTasks = response.data.filter((task: Task) => task.type === taskType);
        setTasks(filteredTasks);
      } catch (error) {
        console.error('Помилка при завантаженні задач:', error);
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити список задач',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTasks();
  }, [projectId, taskType]);

  // Завантаження користувачів проекту
  useEffect(() => {
    const fetchProjectUsers = async () => {
      if (!['ADMIN', 'PROJECT_MANAGER'].includes(currentUser.role)) return;

      try {
        const response = await api.get(`/projects/${projectId}/users`);
        setProjectUsers(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні користувачів:', error);
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити список користувачів',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchProjectUsers();
  }, [projectId, currentUser.role]);

  const checkProduct = async (code: string) => {
    if (!code.trim()) {
      setProductExists(null);
      return;
    }

    setIsCheckingProduct(true);
    try {
      // Розділяємо коди продуктів та видаляємо дублікати
      const productCodes = [...new Set(
        code
          .split(/[\s,]+/)
          .map(code => code.trim())
          .filter(code => code.length > 0)
      )];

      // Перевіряємо кожен код
      const checkPromises = productCodes.map(code =>
        api.get(`/projects/${projectId}/products/${code}`)
          .then(() => true)
          .catch((error: any) => {
            if (error.response?.status === 404) {
              return false;
            }
            throw error;
          })
      );

      const results = await Promise.all(checkPromises);
      setProductExists(results.every(result => result));
    } catch (error) {
      console.error('Помилка при перевірці продукту:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося перевірити наявність продукту',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setProductExists(null);
    } finally {
      setIsCheckingProduct(false);
    }
  };

  const handleScan = async (decodedText: string) => {
    // Додаємо новий код до існуючих
    const currentCodes = formData.productCode.trim();
    const newProductCode = currentCodes
      ? `${currentCodes}, ${decodedText}`
      : decodedText;

    setFormData(prev => ({ ...prev, productCode: newProductCode }));
    await checkProduct(newProductCode);
    console.log('newProductCode', newProductCode);
  };

  const handleScanError = (error: any) => {
    // Ігноруємо помилку, якщо це просто не знайдено код
    if (error?.includes('NotFoundException')) {
      return;
    }
    
    console.error('Помилка сканування:', error);
    toast({
      title: 'Помилка',
      description: error,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCheckingProduct) {
      toast({
        title: 'Зачекайте',
        description: 'Перевірка наявності продукту...',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const date = new Date(formData.registeredAt);
      const formattedData = {
        ...formData,
        registeredAt: date.toISOString(),
      };
      
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Помилка при відправці форми:', error);
    }
  };

  const handleProductCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, productCode: value }));
    if (!value) {
      setProductExists(null);
    }
  };

  const handleClearProductCodes = () => {
    setFormData(prev => ({ ...prev, productCode: '' }));
    setProductExists(null);
  };

  const handleProductCodeBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim()) {
      await checkProduct(value);
    }
  };

  const handleTimeChange = (field: 'hours' | 'minutes', value: string) => {
    let numValue = parseInt(value) || 0;
    
    // Обмеження значень
    if (field === 'hours') {
      numValue = Math.max(0, numValue);
    } else {
      numValue = Math.max(0, Math.min(59, numValue));
    }

    const newFormData = {
      ...formData,
      [field]: numValue.toString(),
    };

    // Конвертація в десяткове представлення
    const hours = parseInt(newFormData.hours || '0');
    const minutes = parseInt(newFormData.minutes || '0');
    const timeSpent = (hours + minutes / 60).toFixed(2);

    setFormData({
      ...newFormData,
      timeSpent,
    });
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      quantity: numValue.toString(),
    }));
  };

  const canSelectUser = ['ADMIN', 'PROJECT_MANAGER'].includes(currentUser.role);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    try {
      const formattedDate = parseInputDate(value);
      setFormData(prev => ({ ...prev, registeredAt: formattedDate }));
    } catch (error) {
      console.error('Error formatting date:', error);
      toast({
        title: 'Помилка',
        description: 'Невірний формат дати',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6}>
        {isProductTask && (
          <FormControl isInvalid={productExists === false}>
            <FormLabel>Код продукту</FormLabel>
            <InputGroup>
              <Input
                value={formData.productCode}
                onChange={handleProductCodeChange}
                placeholder="Введіть код продукту (можна ввести декілька через кому)"
                onBlur={() => checkProduct(formData.productCode)}
                disabled={isCheckingProduct}
              />
              <InputRightElement width="4.5rem">
                <HStack spacing="1">
                  {formData.productCode && (
                    <Icon
                      as={FaTimes}
                      cursor="pointer"
                      onClick={handleClearProductCodes}
                      color="gray.400"
                    />
                  )}
                  <Icon
                    as={FaQrcode}
                    cursor="pointer"
                    onClick={() => setShowScanner(true)}
                    color="gray.400"
                  />
                </HStack>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {productExists === false ? 'Один або декілька кодів продуктів не існують' : ''}
            </FormErrorMessage>
          </FormControl>
        )}

        <FormControl isRequired>
          <FormLabel>Виконана задача</FormLabel>
          <Select
            value={formData.taskId}
            onChange={(e) => setFormData(prev => ({ ...prev, taskId: e.target.value }))}
            placeholder="Виберіть задачу"
          >
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.name} (Оч. час: {task.estimatedTime}г)
              </option>
            ))}
          </Select>
          {tasks.length === 0 && (
            <Text color="gray.500" mt={2} fontSize="sm">
              {taskType === 'PRODUCT' 
                ? 'Немає доступних продуктових задач' 
                : taskType === 'INTERMEDIATE'
                ? 'Немає доступних проміжних задач'
                : 'Немає доступних загальних задач'
              }
            </Text>
          )}
        </FormControl>

        {taskType === 'INTERMEDIATE' ? (
          <FormControl isRequired>
            <FormLabel>Кількість</FormLabel>
            <Input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="Введіть кількість"
            />
          </FormControl>
        ) : !isProductTask && (
          <FormControl isRequired>
            <FormLabel>Витрачений час</FormLabel>
            <HStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Години</FormLabel>
                <Input
                  type="number"
                  min="0"
                  value={formData.hours}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                  placeholder="0"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Хвилини</FormLabel>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={formData.minutes}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                  placeholder="0"
                />
              </FormControl>
            </HStack>
          </FormControl>
        )}

        {canSelectUser && (
          <FormControl isRequired>
            <FormLabel>Виконавець</FormLabel>
            <Select
              value={formData.userId}
              onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="Виберіть виконавця"
            >
              {projectUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </Select>
            {projectUsers.length === 0 && (
              <Text color="gray.500" mt={2} fontSize="sm">
                Немає доступних користувачів
              </Text>
            )}
          </FormControl>
        )}

        <FormControl isRequired>
          <FormLabel>Дата та час виконання</FormLabel>
          <Input
            type="datetime-local"
            value={formData.registeredAt}
            onChange={handleDateChange}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="100%"
          isLoading={isLoading}
          disabled={
            (isProductTask && !formData.productCode) || 
            !formData.taskId || 
            isCheckingProduct || 
            (canSelectUser && !formData.userId) ||
            (!isProductTask && (!formData.hours && !formData.minutes))
          }
        >
          Зареєструвати виконання
        </Button>
      </VStack>

      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScan}
        onError={handleScanError}
      />
    </form>
  );
}; 