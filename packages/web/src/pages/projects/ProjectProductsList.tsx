import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, SearchIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { productsApi } from '../../api/products';
import { Product, ProductWithProgress } from '../../types/product';
import { CreateProductModal } from '../../components/products/CreateProductModal';
import { EditProductModal } from '../../components/products/EditProductModal';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { QRInput } from '../../components/common/QRInput';
import { QRScanner } from '../../components/QRScanner';

export const ProjectProductsList = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [products, setProducts] = useState<ProductWithProgress[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const toast = useToast();

  const calculateProgress = (product: Product): number => {
    const completedTasks = product.taskLogs.filter(
      task => task.status === 'COMPLETED'
    ).length;
    
    return product.taskLogs.length > 0
      ? (completedTasks / product.taskLogs.length) * 100
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
      console.error('Error fetching products:', error);
      setError('Не вдалося завантажити список продуктів');
      toast({
        title: 'Помилка',
        description: error instanceof Error ? error.message : 'Не вдалося завантажити список продуктів',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
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

  const handleScan = (result: string) => {
    setSearchQuery(result);
    setShowScanner(false);
    toast({
      title: 'Успіх',
      description: 'Код продукту відскановано',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleScanError = (error: any) => {
    console.error('Помилка сканування:', error);
  };

  useEffect(() => {
    fetchProducts();
  }, [projectId]);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  return (
    <AdminLayout>

    <Box>
      {isLoading ? (
        <Center h="200px">
          <Spinner />
        </Center>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <>
          <HStack mb={4} justify="space-between">
            <Text fontSize="xl" fontWeight="bold">
              Продукти проекту
            </Text>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Додати продукт
            </Button>
          </HStack>
          <Box mb={4}>
            <QRInput
              placeholder="Пошук за кодом продукту"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onScan={handleScan}
            />
          </Box>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Код</Th>
                <Th>Дата створення</Th>
                <Th>Прогрес</Th>
                <Th>Дії</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map((product) => (
                <Tr key={product.id}>
                  <Td>
                    <Link
                      to={`/products/${product.id}/logs`}
                      style={{
                        color: 'var(--chakra-colors-blue-500)',
                        textDecoration: 'underline'
                      }}
                    >
                      {product.code}
                    </Link>
                  </Td>
                  <Td>
                    {format(new Date(product.createdAt), 'dd MMMM yyyy', {
                      locale: uk,
                    })}
                  </Td>
                  <Td>
                    <VStack align="stretch" spacing={2}>
                      <Progress value={product.taskLogs.length / 8 * 100} size="sm" />
                      <Box fontSize="sm">
                        {product.taskLogs.map((taskLog) => (
                          <HStack key={taskLog.id} spacing={2} mb={1}>
                            <Badge
                              colorScheme={taskLog.status === 'COMPLETED' ? 'green' : 'gray'}
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              {taskLog.status === 'COMPLETED' ? (
                                <CheckIcon boxSize={3} />
                              ) : (
                                <CloseIcon boxSize={3} />
                              )}
                              {taskLog.task.name || `Завдання ${taskLog.id}`}
                            </Badge>
                          </HStack>
                        ))}
                      </Box>
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Редагувати">
                        <IconButton
                          aria-label="Редагувати"
                          icon={<EditIcon />}
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        />
                      </Tooltip>
                      <Tooltip label="Видалити">
                        <IconButton
                          aria-label="Видалити"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(product.id)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
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
    </AdminLayout>
  );
}; 