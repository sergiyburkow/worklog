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

import { RegisteredTask } from '../../types/task';

import { ProjectUser } from '../../types/project-user';

const PREDEFINED_RANGES = {
  ALL_TIME: 'За весь час',
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
  const [tasks, setTasks] = useState<RegisteredTask[]>([]);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  
  // Встановлюємо початкові значення для фільтрів
  const today = new Date();
  const weekStart = startOfWeek(today, { locale: uk });
  const todayEnd = endOfDay(today);
  
  const [filters, setFilters] = useState<Filters>({
    type: '',
    userId: '',
    dateFrom: format(weekStart, 'yyyy-MM-dd'),
    dateTo: format(todayEnd, 'yyyy-MM-dd'),
    predefinedRange: 'THIS_WEEK',
  });

  const handleRangeChange = (range: PredefinedRange | '') => {
    const today = new Date();
    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    switch (range) {
      case 'ALL_TIME':
        // Не встановлюємо дати для фільтрації за весь час
        break;
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

    const newFilters = {
      ...filters,
      predefinedRange: range,
      dateFrom: fromDate ? format(fromDate, 'yyyy-MM-dd') : '',
      dateTo: toDate ? format(toDate, 'yyyy-MM-dd') : '',
    };
    setFilters(newFilters);
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

    const finalFilters = {
      ...newFilters,
      predefinedRange: matchingRange,
    };
    setFilters(finalFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      userId: '',
      dateFrom: format(weekStart, 'yyyy-MM-dd'),
      dateTo: format(todayEnd, 'yyyy-MM-dd'),
      predefinedRange: 'THIS_WEEK',
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
        if (filters.dateFrom && filters.predefinedRange !== 'ALL_TIME') {
          const fromDate = startOfDay(parseISO(filters.dateFrom));
          params.append('registeredFrom', fromDate.toISOString());
        }
        if (filters.dateTo && filters.predefinedRange !== 'ALL_TIME') {
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
                  onChange={(e) => {
                    const newFilters = { ...filters, type: e.target.value };
                    setFilters(newFilters);
                  }}
                  placeholder="всі задачі"
                  w="200px"
                >
                  <option value="PRODUCT">Продуктові</option>
                  <option value="INTERMEDIATE">Проміжні</option>
                  <option value="GENERAL">Загальні</option>
                </Select>

                <Select
                  value={filters.userId}
                  onChange={(e) => {
                    const newFilters = { ...filters, userId: e.target.value };
                    setFilters(newFilters);
                  }}
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