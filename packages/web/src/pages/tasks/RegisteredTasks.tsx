import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  useToast,
  HStack,
  Select,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Card,
  CardBody,
  Icon,
  Button,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import { api } from '../../lib/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { RegisteredTasksTable } from '../../components/tables/RegisteredTasksTable';

interface TaskLog {
  id: string;
  task: {
    name: string;
    estimatedTime: number;
    type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
  };
  user: {
    id: string;
    name: string;
  };
  completedAt: string;
  registeredAt: string;
  timeSpent?: number;
  product?: {
    code: string;
  };
  statusHistory: Array<{
    status: 'APPROVED' | 'NEEDS_FIXES' | 'ON_HOLD';
    createdAt: string;
  }>;
}

interface ProjectUser {
  id: string;
  name: string;
  role: string;
}

const PREDEFINED_RANGES = {
  TODAY: 'Сьогодні',
  YESTERDAY: 'Вчора',
  THIS_WEEK: 'На цьому тижні',
  THIS_MONTH: 'В цьому місяці',
  LAST_MONTH: 'В минулому місяці',
  CUSTOM: 'Обраний період',
} as const;

type PredefinedRange = keyof typeof PREDEFINED_RANGES;

interface Filters {
  type: string;
  userId: string;
  dateFrom: string;
  dateTo: string;
  predefinedRange: PredefinedRange | '';
}

export const RegisteredTasks: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const toast = useToast();
  const [tasks, setTasks] = useState<TaskLog[]>([]);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  
  // Встановлюємо початкові значення для фільтрів
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));
  
  const [filters, setFilters] = useState<Filters>({
    type: '',
    userId: '',
    dateFrom: todayStart.toISOString().split('T')[0],
    dateTo: todayEnd.toISOString().split('T')[0],
    predefinedRange: 'TODAY',
  });

  const handleRangeChange = (range: PredefinedRange | '') => {
    const today = new Date();
    let fromDate = new Date();
    let toDate = new Date();

    switch (range) {
      case 'TODAY':
        fromDate = new Date(today.setHours(0, 0, 0, 0));
        toDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'YESTERDAY':
        fromDate = new Date(today.setDate(today.getDate() - 1));
        fromDate.setHours(0, 0, 0, 0);
        toDate = new Date(today);
        toDate.setHours(23, 59, 59, 999);
        break;
      case 'THIS_WEEK':
        const firstDay = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
        fromDate = new Date(today.setDate(firstDay));
        fromDate.setHours(0, 0, 0, 0);
        toDate = new Date();
        break;
      case 'THIS_MONTH':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date();
        break;
      case 'LAST_MONTH':
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        fromDate = new Date(filters.dateFrom || '');
        toDate = new Date(filters.dateTo || '');
    }

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    setFilters(prev => ({
      ...prev,
      predefinedRange: range,
      dateFrom: !isNaN(fromDate.getTime()) ? formatDate(fromDate) : '',
      dateTo: !isNaN(toDate.getTime()) ? formatDate(toDate) : '',
    }));
  };

  const handleDateChange = (date: string, isStart: boolean) => {
    const newFilters = {
      ...filters,
      [isStart ? 'dateFrom' : 'dateTo']: date,
    };

    // Перевіряємо, чи відповідають дати якомусь з предефайнед періодів
    const today = new Date();
    const selectedFrom = new Date(newFilters.dateFrom);
    const selectedTo = new Date(newFilters.dateTo);
    let matchingRange: PredefinedRange | '' = 'CUSTOM';

    if (!isNaN(selectedFrom.getTime()) && !isNaN(selectedTo.getTime())) {
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
      
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      const startOfWeek = new Date(monday.setHours(0, 0, 0, 0));
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

      if (selectedFrom.getTime() === startOfToday.getTime() && selectedTo.getTime() === endOfToday.getTime()) {
        matchingRange = 'TODAY';
      } else if (selectedFrom.getTime() === startOfYesterday.getTime() && selectedTo.getTime() === endOfYesterday.getTime()) {
        matchingRange = 'YESTERDAY';
      } else if (selectedFrom.getTime() === startOfWeek.getTime() && selectedTo.getTime() >= startOfWeek.getTime()) {
        matchingRange = 'THIS_WEEK';
      } else if (selectedFrom.getTime() === startOfMonth.getTime() && selectedTo.getTime() >= startOfMonth.getTime()) {
        matchingRange = 'THIS_MONTH';
      } else if (selectedFrom.getTime() === startOfLastMonth.getTime() && selectedTo.getTime() === endOfLastMonth.getTime()) {
        matchingRange = 'LAST_MONTH';
      }
    }

    setFilters({
      ...newFilters,
      predefinedRange: matchingRange,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      userId: '',
      dateFrom: todayStart.toISOString().split('T')[0],
      dateTo: todayEnd.toISOString().split('T')[0],
      predefinedRange: 'TODAY',
    });
  };

  // Завантаження задач
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/task-logs/project/${projectId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні задач:', error);
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити зареєстровані задачі',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTasks();
  }, [projectId]);

  // Завантаження користувачів проекту
  useEffect(() => {
    const fetchProjectUsers = async () => {
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
  }, [projectId]);

  const filteredTasks = tasks.filter(task => {
    // Фільтр по типу (показуємо всі, якщо не вибрано конкретний тип)
    if (filters.type && task.task.type !== filters.type) {
      return false;
    }

    // Фільтр по користувачу (показуємо всіх, якщо не вибрано конкретного користувача)
    if (filters.userId && task.user.id !== filters.userId) {
      return false;
    }

    // Фільтр по даті
    const taskDate = new Date(task.registeredAt);
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (taskDate < fromDate) {
        return false;
      }
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      if (taskDate > toDate) {
        return false;
      }
    }

    return true;
  });

  const isFiltersApplied = filters.type || filters.userId || filters.dateFrom || filters.dateTo;

  const hasActiveFilters = filters.type !== '' || 
                          filters.userId !== '' || 
                          (filters.predefinedRange !== 'TODAY' && filters.predefinedRange !== '');

  return (
    <AdminLayout>
      <Box p={4}>
        <Heading size="lg" mb={6}>
          Зареєстровані задачі
        </Heading>

        <Card mb={6}>
          <CardBody>
            <HStack spacing={4} align="flex-end">
              <HStack flex={1} spacing={4}>
                <Icon as={FaFilter} />
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  placeholder="всі задачі"
                  w="200px"
                >
                  <option value="PRODUCT">Продуктові</option>
                  <option value="INTERMEDIATE">Проміжні</option>
                  <option value="GENERAL">Загальні</option>
                </Select>

                <Select
                  value={filters.userId}
                  onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                  placeholder="всі виконавці"
                  w="200px"
                >
                  {projectUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>

                {hasActiveFilters && (
                  <Tooltip label="Очистити фільтри">
                    <IconButton
                      aria-label="Очистити фільтри"
                      icon={<Icon as={MdClear} />}
                      onClick={handleClearFilters}
                      size="md"
                      variant="ghost"
                    />
                  </Tooltip>
                )}
              </HStack>

              <HStack spacing={4}>
                <Select
                  value={filters.predefinedRange}
                  onChange={(e) => handleRangeChange(e.target.value as PredefinedRange | '')}
                >
                  {Object.entries(PREDEFINED_RANGES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>

                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleDateChange(e.target.value, true)}
                />

                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleDateChange(e.target.value, false)}
                />
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        <RegisteredTasksTable tasks={filteredTasks} type={filters.type as any || 'PRODUCT'} />
      </Box>
    </AdminLayout>
  );
}; 