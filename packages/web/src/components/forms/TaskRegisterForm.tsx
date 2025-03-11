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
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../../lib/api';
import { FaQrcode } from 'react-icons/fa';

interface Task {
  id: string;
  name: string;
  estimatedTime: string;
  type: 'PRODUCT' | 'GENERAL';
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
}

interface TaskRegisterFormProps {
  onSubmit: (data: TaskLogFormData) => Promise<void>;
  isLoading?: boolean;
  projectId: string;
  currentUser: {
    id: string;
    role: 'ADMIN' | 'PROJECT_MANAGER' | 'ENGINEER' | 'QA' | 'GUEST';
  };
  isProductTask: boolean;
}

export const TaskRegisterForm: React.FC<TaskRegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  projectId,
  currentUser,
  isProductTask,
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

  const [formData, setFormData] = useState<TaskLogFormData>({
    productCode: '',
    taskId: '',
    registeredAt: formatDateForInput(new Date()),
    userId: ['ADMIN', 'PROJECT_MANAGER'].includes(currentUser.role) ? undefined : currentUser.id,
    timeSpent: '',
    hours: '',
    minutes: '',
  });

  // Завантаження задач при ініціалізації
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/tasks`);
        const filteredTasks = response.data.filter((task: Task) => 
          isProductTask ? task.type === 'PRODUCT' : task.type === 'GENERAL'
        );
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
  }, [projectId, isProductTask]);

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
      await api.get(`/projects/${projectId}/products/${code}`);
      setProductExists(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setProductExists(false);
      } else {
        console.error('Помилка при перевірці продукту:', error);
        toast({
          title: 'Помилка',
          description: 'Не вдалося перевірити наявність продукту',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setProductExists(null);
      }
    } finally {
      setIsCheckingProduct(false);
    }
  };

  useEffect(() => {
    if (showScanner) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        /* verbose= */ false
      );

      scannerRef.current.render(async (decodedText) => {
        setFormData(prev => ({ ...prev, productCode: decodedText }));
        setShowScanner(false);
        await checkProduct(decodedText);
        toast({
          title: 'Успіх',
          description: 'Код продукту відскановано',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }, (error) => {
        console.error(error);
        toast({
          title: 'Помилка',
          description: 'Помилка при скануванні коду',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [showScanner, toast]);

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
      // Перевіряємо вхідну дату
      console.log('Original date:', formData.registeredAt);
      const date = new Date(formData.registeredAt);
      console.log('Date object:', date);
      const isoString = date.toISOString();
      console.log('ISO string:', isoString);

      const formattedData = {
        ...formData,
        registeredAt: isoString,
      };
      
      console.log('Sending data:', formattedData);
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

  const canSelectUser = ['ADMIN', 'PROJECT_MANAGER'].includes(currentUser.role);

  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('New date value:', value);
    setFormData(prev => ({ ...prev, registeredAt: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6}>
        {isProductTask && (
          <FormControl isRequired>
            <FormLabel>Код продукту</FormLabel>
            <InputGroup>
              <Input
                value={formData.productCode}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, productCode: value }));
                  checkProduct(value);
                }}
                onBlur={handleProductCodeBlur}
                placeholder="Введіть або відскануйте код продукту"
                isInvalid={productExists === false}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={toggleScanner}>
                  <Icon as={FaQrcode} />
                </Button>
              </InputRightElement>
            </InputGroup>
            {productExists === false && (
              <FormErrorMessage>
                Продукт з таким кодом не знайдено
              </FormErrorMessage>
            )}
            {showScanner && (
              <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                <div id="qr-reader" style={{ width: '100%' }}></div>
              </Box>
            )}
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
              {isProductTask ? 'Немає доступних продуктових задач' : 'Немає доступних загальних задач'}
            </Text>
          )}
        </FormControl>

        {!isProductTask && (
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
    </form>
  );
}; 