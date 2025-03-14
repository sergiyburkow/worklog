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
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  subMonths,
  format,
  parseISO,
  isEqual,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds
} from 'date-fns';
import { uk } from 'date-fns/locale';

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
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  
  const [filters, setFilters] = useState<Filters>({
    type: '',
    userId: '',
    dateFrom: format(todayStart, 'yyyy-MM-dd'),
    dateTo: format(todayEnd, 'yyyy-MM-dd'),
    predefinedRange: 'TODAY',
  });

  const handleRangeChange = (range: PredefinedRange | '') => {
    const today = new Date();
    let fromDate: Date;
    let toDate: Date;

    switch (range) {
      case 'TODAY':
        fromDate = startOfDay(today);
        toDate = endOfDay(today);
        break;
      case 'YESTERDAY':
        const yesterday = subMonths(today, 0);
        yesterday.setDate(yesterday.getDate() - 1);
        fromDate = startOfDay(yesterday);
        toDate = endOfDay(yesterday);
        break;
      case 'THIS_WEEK':
        fromDate = startOfWeek(today, { locale: uk });
        toDate = endOfDay(today);
        break;
      case 'THIS_MONTH':
        fromDate = startOfMonth(today);
        toDate = endOfDay(today);
        break;
      case 'LAST_MONTH':
        const lastMonth = subMonths(today, 1);
        fromDate = startOfMonth(lastMonth);
        toDate = endOfMonth(lastMonth);
        break;
      default:
        fromDate = parseISO(filters.dateFrom || format(today, 'yyyy-MM-dd'));
        toDate = parseISO(filters.dateTo || format(today, 'yyyy-MM-dd'));
        toDate = endOfDay(toDate);
    }

    setFilters(prev => ({
      ...prev,
      predefinedRange: range,
      dateFrom: format(fromDate, 'yyyy-MM-dd'),
      dateTo: format(toDate, 'yyyy-MM-dd'),
    }));
  };

  const handleDateChange = (date: string, isStart: boolean) => {
    const newFilters = {
      ...filters,
      [isStart ? 'dateFrom' : 'dateTo']: date,
    };

    const today = new Date();
    const selectedFrom = parseISO(newFilters.dateFrom);
    const selectedTo = parseISO(newFilters.dateTo);
    let matchingRange: PredefinedRange | '' = 'CUSTOM';

    if (selectedFrom && selectedTo) {
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);
      
      const yesterday = subMonths(today, 0);
      yesterday.setDate(yesterday.getDate() - 1);
      const startOfYesterday = startOfDay(yesterday);
      const endOfYesterday = endOfDay(yesterday);
      
      const startOfThisWeek = startOfWeek(today, { locale: uk });
      const startOfThisMonth = startOfMonth(today);
      
      const lastMonth = subMonths(today, 1);
      const startOfLastMonth = startOfMonth(lastMonth);
      const endOfLastMonth = endOfMonth(lastMonth);

      if (isEqual(selectedFrom, startOfToday) && isEqual(selectedTo, endOfToday)) {
        matchingRange = 'TODAY';
      } else if (isEqual(selectedFrom, startOfYesterday) && isEqual(selectedTo, endOfYesterday)) {
        matchingRange = 'YESTERDAY';
      } else if (isEqual(selectedFrom, startOfThisWeek)) {
        matchingRange = 'THIS_WEEK';
      } else if (isEqual(selectedFrom, startOfThisMonth)) {
        matchingRange = 'THIS_MONTH';
      } else if (isEqual(selectedFrom, startOfLastMonth) && isEqual(selectedTo, endOfLastMonth)) {
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
      dateFrom: format(todayStart, 'yyyy-MM-dd'),
      dateTo: format(todayEnd, 'yyyy-MM-dd'),
      predefinedRange: 'TODAY',
    });
  };

  // Завантаження задач
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams();
        
        if (filters.type) {
          params.append('type', filters.type);
        }
        if (filters.userId) {
          params.append('userId', filters.userId);
        }
        if (filters.dateFrom) {
          const fromDate = startOfDay(parseISO(filters.dateFrom));
          params.append('registeredFrom', fromDate.toISOString());
        }
        if (filters.dateTo) {
          const toDate = endOfDay(parseISO(filters.dateTo));
          params.append('registeredTo', toDate.toISOString());
        }

        const response = await api.get(`/task-logs/project/${projectId}?${params.toString()}`);
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
  }, [projectId, filters]);

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

        <RegisteredTasksTable tasks={tasks} type={filters.type as any || 'PRODUCT'} />
      </Box>
    </AdminLayout>
  );
}; 