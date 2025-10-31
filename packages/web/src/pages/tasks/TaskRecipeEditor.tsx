import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Box, Heading, HStack, VStack, Table, Thead, Tr, Th, Tbody, Td, Button, Input, Text, Select, FormControl, FormLabel, FormErrorMessage, Badge, Alert, AlertIcon, Collapse, IconButton, Card, CardBody, UnorderedList, ListItem } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from '@chakra-ui/icons'
import { getTaskRecipe, upsertTaskRecipeOutput, deleteTaskRecipeOutput, upsertTaskRecipeConsumption, deleteTaskRecipeConsumption } from '../../api/tasks'
import { getInventory, InventoryItem } from '../../api/inventory'

export const TaskRecipeEditor = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const [projectId, setProjectId] = useState<string | null>(null)
  const [outputs, setOutputs] = useState<{ partId: string; perUnit: number }[]>([])
  const [consumptions, setConsumptions] = useState<{ partId: string; quantityPerUnit: number }[]>([])
  const [newOutput, setNewOutput] = useState<{ partId: string; perUnit: string }>({ partId: '', perUnit: '' })
  const [newConsumption, setNewConsumption] = useState<{ partId: string; quantityPerUnit: string }>({ partId: '', quantityPerUnit: '' })
  const [parts, setParts] = useState<InventoryItem[]>([])
  const [outputSearch, setOutputSearch] = useState('')
  const [consumptionSearch, setConsumptionSearch] = useState('')
  const [errors, setErrors] = useState<{ output?: string; consumption?: string }>({})
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  const load = async () => {
    if (!taskId) return
    try {
      setLoading(true)
      const data = await getTaskRecipe(taskId)
      setProjectId(data.projectId)
      setOutputs(data.outputs.map(o => ({ partId: o.partId, perUnit: Number(o.perUnit) as unknown as number })))
      setConsumptions(data.consumptions.map(c => ({ partId: c.partId, quantityPerUnit: Number(c.quantityPerUnit) as unknown as number })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [taskId])
  useEffect(() => {
    const fetchParts = async () => {
      if (!projectId) return
      try {
        const data = await getInventory(projectId, { page: 1, pageSize: 1000 })
        setParts(data.items)
      } catch (error) {
        console.error('Помилка завантаження деталей:', error)
      }
    }
    fetchParts()
  }, [projectId])

  // Фільтровані списки деталей для пошуку
  const filteredOutputParts = useMemo(() => {
    const searchLower = outputSearch.toLowerCase()
    return parts.filter(p => 
      p.code.toLowerCase().includes(searchLower) || 
      (p.name?.toLowerCase().includes(searchLower) ?? false)
    )
  }, [parts, outputSearch])

  const filteredConsumptionParts = useMemo(() => {
    const searchLower = consumptionSearch.toLowerCase()
    return parts.filter(p => 
      p.code.toLowerCase().includes(searchLower) || 
      (p.name?.toLowerCase().includes(searchLower) ?? false)
    )
  }, [parts, consumptionSearch])

  const getPartDisplay = (partId: string) => {
    const part = parts.find(p => p.id === partId)
    if (!part) return { code: '-', name: '-' }
    return { code: part.code, name: part.name || '-' }
  }

  const validatePerUnit = (value: string): boolean => {
    const num = Number(value)
    return !isNaN(num) && num > 0
  }

  return (
    <AdminLayout>
      <Box p={4}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Рецепт задачі</Heading>
          {projectId && (
            <Button as={Link} to={`/projects/${projectId}/tasks`} variant="outline">До задач</Button>
          )}
        </HStack>

        <Card mb={6} bg="blue.50" borderColor="blue.200">
          <CardBody>
            <HStack justify="space-between" mb={2}>
              <HStack spacing={2}>
                <InfoIcon color="blue.500" />
                <Heading size="sm" color="blue.700">Як працює рецепт задачі?</Heading>
              </HStack>
              <IconButton
                aria-label={showInfo ? 'Приховати' : 'Показати'}
                icon={showInfo ? <ChevronUpIcon /> : <ChevronDownIcon />}
                size="sm"
                variant="ghost"
                onClick={() => setShowInfo(!showInfo)}
              />
            </HStack>
            <Collapse in={showInfo} animateOpacity>
              <VStack align="stretch" spacing={3} mt={2}>
                <Text fontSize="sm" color="blue.700">
                  <strong>Рецепт задачі</strong> визначає автоматичні зміни інвентарю при реєстрації виконання задачі:
                </Text>
                
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" color="blue.700" mb={1}>
                    Вихідні деталі (що виробляється):
                  </Text>
                  <UnorderedList fontSize="sm" color="blue.600" pl={4} spacing={1}>
                    <ListItem>Деталі, які додаються до інвентарю при виконанні задачі</ListItem>
                    <ListItem>Кількість = <code>perUnit × quantity задачі</code></ListItem>
                    <ListItem>Приклад: Якщо perUnit = 2, а виконано 10 одиниць задачі, то додасться 20 деталей</ListItem>
                  </UnorderedList>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="semibold" color="blue.700" mb={1}>
                    Споживані деталі (що витрачається):
                  </Text>
                  <UnorderedList fontSize="sm" color="blue.600" pl={4} spacing={1}>
                    <ListItem>Деталі, які списуються з інвентарю при виконанні задачі</ListItem>
                    <ListItem>Кількість = <code>quantityPerUnit × quantity задачі</code></ListItem>
                    <ListItem>Система перевіряє достатність інвентарю перед списанням</ListItem>
                    <ListItem>Приклад: Якщо quantityPerUnit = 3, а виконано 5 одиниць задачі, то спишеся 15 деталей</ListItem>
                  </UnorderedList>
                </Box>

                <Alert status="info" size="sm" borderRadius="md">
                  <AlertIcon />
                  <VStack align="stretch" spacing={1}>
                    <Text fontSize="sm" fontWeight="semibold">Приклад використання:</Text>
                    <Text fontSize="xs">
                      Задача "Збірка виробу": споживає 2 гвинти (consumption) та 1 корпус (consumption), 
                      виробляє 1 готовий виріб (output). При реєстрації 10 одиниць задачі автоматично: 
                      списується 20 гвинтів і 10 корпусів, додається 10 готових виробів.
                    </Text>
                  </VStack>
                </Alert>
              </VStack>
            </Collapse>
          </CardBody>
        </Card>

        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading size="md" mb={3}>Вихідні деталі (що виробляється)</Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>
              Деталі, які будуть додані до інвентарю при реєстрації виконання задачі
            </Text>
            <VStack spacing={3} mb={3} align="stretch">
              <FormControl>
                <FormLabel fontSize="sm">Пошук деталі</FormLabel>
                <Input 
                  placeholder="Введіть код або назву для пошуку..." 
                  value={outputSearch} 
                  onChange={(e) => setOutputSearch(e.target.value)}
                />
              </FormControl>
              <HStack spacing={3} align="flex-end">
                <FormControl isRequired isInvalid={!!errors.output}>
                  <FormLabel fontSize="sm">Деталь</FormLabel>
                  <Select
                    placeholder="Оберіть деталь"
                    value={newOutput.partId}
                    onChange={(e) => {
                      setNewOutput({ ...newOutput, partId: e.target.value })
                      setErrors({ ...errors, output: undefined })
                    }}
                  >
                    {filteredOutputParts
                      .filter(p => !outputs.some(o => o.partId === p.id))
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.code} - {p.name || 'Без назви'}
                        </option>
                      ))}
                  </Select>
                  <FormErrorMessage>{errors.output}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.output && newOutput.perUnit !== ''}>
                  <FormLabel fontSize="sm">На одиницю</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={newOutput.perUnit}
                    onChange={(e) => {
                      setNewOutput({ ...newOutput, perUnit: e.target.value })
                      setErrors({ ...errors, output: undefined })
                    }}
                  />
                </FormControl>
                <Button
                  onClick={async () => {
                    if (!taskId) return
                    const error: string[] = []
                    if (!newOutput.partId) error.push('Оберіть деталь')
                    if (!validatePerUnit(newOutput.perUnit)) error.push('Кількість повинна бути більше 0')
                    if (error.length > 0) {
                      setErrors({ ...errors, output: error.join(', ') })
                      return
                    }
                    const per = Number(newOutput.perUnit)
                    await upsertTaskRecipeOutput(taskId, newOutput.partId, per)
                    setNewOutput({ partId: '', perUnit: '' })
                    setOutputSearch('')
                    setErrors({ ...errors, output: undefined })
                    load()
                  }}
                >
                  Додати
                </Button>
              </HStack>
            </VStack>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Код</Th>
                  <Th>Назва</Th>
                  <Th isNumeric>На одиницю</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {outputs.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center" color="gray.500">
                      Немає вихідних деталей
                    </Td>
                  </Tr>
                ) : (
                  outputs.map(o => {
                    const part = getPartDisplay(o.partId)
                    return (
                      <Tr key={o.partId}>
                        <Td>
                          <Text fontWeight="medium">{part.code}</Text>
                        </Td>
                        <Td>{part.name}</Td>
                        <Td isNumeric>{o.perUnit}</Td>
                        <Td>
                          <Button size="sm" colorScheme="red" onClick={async () => { if (!taskId) return; await deleteTaskRecipeOutput(taskId, o.partId); load() }}>Видалити</Button>
                        </Td>
                      </Tr>
                    )
                  })
                )}
              </Tbody>
            </Table>
          </Box>

          <Box>
            <Heading size="md" mb={3}>Споживані деталі (що витрачається)</Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>
              Деталі, які будуть списані з інвентарю при реєстрації виконання задачі
            </Text>
            <VStack spacing={3} mb={3} align="stretch">
              <FormControl>
                <FormLabel fontSize="sm">Пошук деталі</FormLabel>
                <Input 
                  placeholder="Введіть код або назву для пошуку..." 
                  value={consumptionSearch} 
                  onChange={(e) => setConsumptionSearch(e.target.value)}
                />
              </FormControl>
              <HStack spacing={3} align="flex-end">
                <FormControl isRequired isInvalid={!!errors.consumption}>
                  <FormLabel fontSize="sm">Деталь</FormLabel>
                  <Select
                    placeholder="Оберіть деталь"
                    value={newConsumption.partId}
                    onChange={(e) => {
                      setNewConsumption({ ...newConsumption, partId: e.target.value })
                      setErrors({ ...errors, consumption: undefined })
                    }}
                  >
                    {filteredConsumptionParts
                      .filter(p => !consumptions.some(c => c.partId === p.id))
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.code} - {p.name || 'Без назви'} (на складі: {p.currentQuantity})
                        </option>
                      ))}
                  </Select>
                  <FormErrorMessage>{errors.consumption}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.consumption && newConsumption.quantityPerUnit !== ''}>
                  <FormLabel fontSize="sm">На одиницю</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={newConsumption.quantityPerUnit}
                    onChange={(e) => {
                      setNewConsumption({ ...newConsumption, quantityPerUnit: e.target.value })
                      setErrors({ ...errors, consumption: undefined })
                    }}
                  />
                </FormControl>
                <Button
                  onClick={async () => {
                    if (!taskId) return
                    const error: string[] = []
                    if (!newConsumption.partId) error.push('Оберіть деталь')
                    if (!validatePerUnit(newConsumption.quantityPerUnit)) error.push('Кількість повинна бути більше 0')
                    if (error.length > 0) {
                      setErrors({ ...errors, consumption: error.join(', ') })
                      return
                    }
                    const q = Number(newConsumption.quantityPerUnit)
                    await upsertTaskRecipeConsumption(taskId, newConsumption.partId, q)
                    setNewConsumption({ partId: '', quantityPerUnit: '' })
                    setConsumptionSearch('')
                    setErrors({ ...errors, consumption: undefined })
                    load()
                  }}
                >
                  Додати
                </Button>
              </HStack>
            </VStack>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Код</Th>
                  <Th>Назва</Th>
                  <Th isNumeric>Поточна к-сть</Th>
                  <Th isNumeric>На одиницю</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {consumptions.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center" color="gray.500">
                      Немає споживаних деталей
                    </Td>
                  </Tr>
                ) : (
                  consumptions.map(c => {
                    const part = parts.find(p => p.id === c.partId)
                    const partDisplay = getPartDisplay(c.partId)
                    const currentQty = part?.currentQuantity ?? 0
                    const willConsume = c.quantityPerUnit // на одиницю задачі
                    const isLowStock = currentQty < willConsume * 10 // попередження якщо менше ніж на 10 одиниць
                    return (
                      <Tr key={c.partId}>
                        <Td>
                          <Text fontWeight="medium">{partDisplay.code}</Text>
                        </Td>
                        <Td>{partDisplay.name}</Td>
                        <Td isNumeric>
                          <HStack justify="flex-end" spacing={2}>
                            <Text>{currentQty}</Text>
                            {isLowStock && (
                              <Badge colorScheme="orange" fontSize="xs">Мало</Badge>
                            )}
                          </HStack>
                        </Td>
                        <Td isNumeric>{c.quantityPerUnit}</Td>
                        <Td>
                          <Button size="sm" colorScheme="red" onClick={async () => { if (!taskId) return; await deleteTaskRecipeConsumption(taskId, c.partId); load() }}>Видалити</Button>
                        </Td>
                      </Tr>
                    )
                  })
                )}
              </Tbody>
            </Table>
            {consumptions.some(c => {
              const part = parts.find(p => p.id === c.partId)
              return part && part.currentQuantity < c.quantityPerUnit * 5
            }) && (
              <Alert status="warning" mt={3}>
                <AlertIcon />
                Увага: Деякі деталі мають недостатню кількість на складі для виконання задачі
              </Alert>
            )}
          </Box>
        </VStack>
      </Box>
    </AdminLayout>
  )
}





