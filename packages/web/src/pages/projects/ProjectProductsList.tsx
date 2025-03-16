import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Progress,
  IconButton,
  Tooltip,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Button,
  HStack,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { productsApi } from '../../api/products';
import { Product, ProductWithProgress } from '../../types/product';
import { CreateProductModal } from '../../components/products/CreateProductModal';
import { EditProductModal } from '../../components/products/EditProductModal';

export const ProjectProductsList = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [products, setProducts] = useState<ProductWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const toast = useToast();

  const calculateProgress = (product: Product): number => {
    const completedTasks = product.registeredTasks.filter(
      task => task.status === 'COMPLETED'
    ).length;
    
    return product.registeredTasks.length > 0
      ? (completedTasks / product.registeredTasks.length) * 100
      : 0;
  };

  const fetchProducts = async () => {
    if (!projectId) return;
    
    try {
      const response = await productsApi.getProjectProducts(projectId);
      const productsWithProgress = response.data.map(product => ({
        ...product,
        progress: calculateProgress(product)
      }));
      setProducts(productsWithProgress);
      setError(null);
    } catch (error) {
      setError('Не вдалося завантажити список продуктів');
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити список продуктів',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await productsApi.deleteProduct(productId);
      await fetchProducts();
      toast({
        title: 'Успіх',
        description: 'Продукт видалено',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити продукт',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [projectId]);

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="2xl">Продукти проекту</Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Створити продукт
        </Button>
      </HStack>
      
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Код</Th>
            <Th>Дата створення</Th>
            <Th>Відсоток виконання</Th>
            <Th>Дії</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              <Td>{product.code}</Td>
              <Td>
                {format(new Date(product.createdAt), 'dd MMMM yyyy', { locale: uk })}
              </Td>
              <Td>
                <Box>
                  <Progress 
                    value={product.progress} 
                    size="sm" 
                    colorScheme={product.progress === 100 ? 'green' : 'blue'}
                  />
                  <Text mt={1} fontSize="sm">
                    {product.progress.toFixed(0)}% ({product.registeredTasks.filter(t => t.status === 'COMPLETED').length}/{product.registeredTasks.length})
                  </Text>
                </Box>
              </Td>
              <Td>
                <Tooltip label="Редагувати">
                  <IconButton
                    aria-label="Редагувати продукт"
                    icon={<EditIcon />}
                    size="sm"
                    mr={2}
                    onClick={() => setEditingProduct(product)}
                  />
                </Tooltip>
                <Tooltip label="Видалити">
                  <IconButton
                    aria-label="Видалити продукт"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(product.id)}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {projectId && (
        <CreateProductModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          projectId={projectId}
          onSuccess={fetchProducts}
        />
      )}

      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onSuccess={fetchProducts}
        />
      )}
    </Box>
  );
}; 