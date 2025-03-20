import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Button,
  HStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Icon,
  Box,
  Wrap,
  WrapItem,
  Tag,
  TagCloseButton,
  InputLeftElement,
} from '@chakra-ui/react';
import { api } from '../../lib/api';
import { FaQrcode } from 'react-icons/fa';
import { QRScanner } from '../QRScanner';
import { QRInput } from '../common/QRInput';

interface Task {
  id: string;
  name: string;
  estimatedTime: string;
  type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
}

interface ProjectUser {
  id: string;
  name: string;
  lastName: string;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [isCheckingProduct, setIsCheckingProduct] = useState(false);
  const [productCodes, setProductCodes] = useState<string[]>([]);
  const [productStatuses, setProductStatuses] = useState<Record<string, boolean>>({});

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
    userId: currentUser.id,
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

  const removeProductCode = (codeToRemove: string) => {
    // Видаляємо код зі списку
    const updatedCodes = productCodes.filter(code => code.trim() !== codeToRemove.trim());
    setProductCodes(updatedCodes);

    // Оновлюємо значення в інпуті
    const updatedInputValue = updatedCodes.length > 0 ? updatedCodes.join(', ') : '';
    setFormData(prev => ({
      ...prev,
      productCode: updatedInputValue
    }));

    // Видаляємо статус
    setProductStatuses(prev => {
      const newStatuses = { ...prev };
      delete newStatuses[codeToRemove];
      return newStatuses;
    });
  };

  const checkProduct = async (code: string) => {
    if (!code.trim()) return;

    setIsCheckingProduct(true);
    try {
      const response = await api.get(`/products/check/${code}/project/${projectId}`, {
        params: {
          taskId: formData.taskId || undefined
        }
      });
      
      if (response.data.status === 'ERROR') {
        removeProductCode(code);

        toast({
          title: 'Помилка',
          description: 'Цей продукт вже зареєстрований для цієї задачі',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setProductStatuses(prev => ({
        ...prev,
        [code]: response.data.status === 'EXISTS'
      }));
    } catch (error: any) {
      setProductStatuses(prev => ({
        ...prev,
        [code]: false
      }));
      
      if (error.response?.status === 403) {
        toast({
          title: 'Помилка',
          description: 'У вас немає доступу до цього проекту',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsCheckingProduct(false);
    }
  };

  const handleScan = async (result: string) => {
    // Перевіряємо чи код вже є в списку
    if (productCodes.includes(result)) {
      toast({
        title: 'Увага',
        description: 'Цей код вже додано',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await checkProduct(result);
    setProductCodes(prev => [...prev, result]);
    setFormData(prev => ({ 
      ...prev, 
      productCode: [...productCodes, result].join(', ') 
    }));
    toast({
      title: 'Успіх',
      description: 'Код продукту додано',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleScanError = (error: any) => {
    console.error('Помилка сканування:', error);
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
    
    // Оновлюємо значення в інпуті
    setFormData(prev => ({ ...prev, productCode: value }));
    
    // Розбиваємо введений текст на окремі коди
    const newCodes = value
      .split(/[,\s]+/) // Розділяємо по комі або пробілу
      .map(code => code.trim()) // Прибираємо пробіли
      .filter(code => code.length > 0); // Видаляємо пусті значення
    
    // Оновлюємо список кодів
    setProductCodes(newCodes);
    
    // Перевіряємо нові коди
    newCodes.forEach(code => {
      if (!productStatuses.hasOwnProperty(code)) {
        checkProduct(code);
      }
    });
  };

  const handleRemoveCode = (codeToRemove: string) => {
    removeProductCode(codeToRemove);
  };

  const handleProductCodeBlur = async () => {
    // Перевіряємо всі коди при втраті фокусу
    for (const code of productCodes) {
      if (!productStatuses.hasOwnProperty(code)) {
        await checkProduct(code);
      }
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

  const handleTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const taskId = e.target.value;
    setFormData(prev => ({ ...prev, taskId }));
    
    // Перевіряємо всі продукти заново при зміні задачі
    if (productCodes.length > 0) {
      productCodes.forEach(code => checkProduct(code));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6}>

        <FormControl isRequired>
          <FormLabel>Задача</FormLabel>
          <Select
            value={formData.taskId}
            onChange={handleTaskChange}
            placeholder="Оберіть задачу"
          >
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.name}
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
                  {user.name} {user.lastName} ({user.role})
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

        {isProductTask && (
          <FormControl>
            <FormLabel>Код продукту</FormLabel>
            <QRInput
              value={formData.productCode}
              onChange={handleProductCodeChange}
              onBlur={handleProductCodeBlur}
              onScan={handleScan}
              placeholder="Введіть коди продуктів через кому або пробіл"
            />
            {productCodes.length > 0 && (
              <Box mt={2}>
                <Text fontSize="sm" mb={2}>Додані коди:</Text>
                <Wrap spacing={2}>
                  {productCodes.map(code => (
                    <WrapItem key={code}>
                      <Tag 
                        size="md" 
                        variant="subtle" 
                        colorScheme={productStatuses[code] === false ? "orange" : "blue"}
                      >
                        {code}
                        <TagCloseButton onClick={() => handleRemoveCode(code)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
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