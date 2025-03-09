import { useState } from 'react';
import {
  Box,
  Heading,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { DashboardMenu } from '../../components/DashboardMenu';
import { QRScanner } from '../../components/QRScanner';

interface TaskFormData {
  code: string;
  name: string;
  description: string;
  estimatedTime: string;
}

export const TaskRegister = () => {
  const toast = useToast();
  const [formData, setFormData] = useState<TaskFormData>({
    code: '',
    name: '',
    description: '',
    estimatedTime: '',
  });

  const handleScan = (result: string) => {
    setFormData(prev => ({ ...prev, code: result }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Відправка даних на сервер
      toast({
        title: 'Завдання зареєстровано',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося зареєструвати завдання',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <DashboardMenu />
      <Box p={5}>
        <Heading mb={6}>Реєстрація завдання</Heading>

        <Card>
          <CardBody>
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>Сканування коду</Tab>
                <Tab>Ручне введення</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <QRScanner onScan={handleScan} />
                </TabPanel>
                <TabPanel>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Код завдання</FormLabel>
                        <Input
                          value={formData.code}
                          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                          placeholder="Введіть код завдання"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Назва завдання</FormLabel>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Введіть назву завдання"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Опис</FormLabel>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Введіть опис завдання"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Очікуваний час виконання (годин)</FormLabel>
                        <Input
                          type="number"
                          value={formData.estimatedTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                          placeholder="Введіть очікуваний час"
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        width="100%"
                      >
                        Зареєструвати завдання
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Box>
    </>
  );
}; 