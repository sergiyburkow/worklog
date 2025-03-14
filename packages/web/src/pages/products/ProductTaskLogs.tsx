import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Card,
  CardBody,
  useToast,
  HStack,
  Text,
} from '@chakra-ui/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { RegisteredTasksTable } from '../../components/tables/RegisteredTasksTable';
import { api } from '../../lib/api';

interface ProductTaskLog {
  id: string;
  task: {
    name: string;
    estimatedTime: number;
    type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
  };
  user: {
    name: string;
  };
  completedAt: string | null;
  registeredAt: string;
  timeSpent?: number;
  quantity?: number;
  product?: {
    id: string;
    code: string;
  };
  statusHistory: Array<{
    status: 'APPROVED' | 'NEEDS_FIXES' | 'ON_HOLD' | 'PENDING';
    createdAt: string;
  }>;
}

export const ProductTaskLogs: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [tasks, setTasks] = useState<ProductTaskLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productInfo, setProductInfo] = useState<{ code: string } | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Отримуємо інформацію про продукт
        const productResponse = await api.get(`/products/${productId}`);
        const product = productResponse.data;
        setProductInfo(product);

        // Отримуємо task logs через проект
        const tasksResponse = await api.get(`/task-logs/project/${product.projectId}`, {
          params: {
            productId: productId
          }
        });
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId, toast]);

  const handleTaskDeleted = () => {
    const fetchTasks = async () => {
      try {
        // Отримуємо інформацію про продукт
        const productResponse = await api.get(`/products/${productId}`);
        const product = productResponse.data;

        // Отримуємо task logs через проект
        const tasksResponse = await api.get(`/task-logs/project/${product.projectId}`, {
          params: {
            productId: productId
          }
        });
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <Card mb={6}>
          <CardBody>
            <HStack justify="space-between" align="center">
              <Box>
                <Heading size="lg" mb={2}>
                  Історія виконання
                </Heading>
                <HStack spacing={2}>
                  <Text fontWeight="bold">Продукт:</Text>
                  <Text color="gray.500">{productInfo?.code || 'Завантаження...'}</Text>
                </HStack>
              </Box>
            </HStack>
          </CardBody>
        </Card>

        <RegisteredTasksTable
          tasks={tasks}
          type="PRODUCT"
          onTaskDeleted={handleTaskDeleted}
          isLoading={isLoading}
          hiddenColumns={['productCode']} // Приховуємо код продукту, бо він вже відображається в заголовку
        />
      </Box>
    </AdminLayout>
  );
}; 