import { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Box,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { getTaskRecipe } from '../../api/tasks'
import { getInventory, InventoryItem } from '../../api/inventory'

interface Props {
  isOpen: boolean
  onClose: () => void
  taskId: string
  projectId?: string
  taskName?: string
}

export const TaskRecipeViewModal = ({ isOpen, onClose, taskId, projectId, taskName }: Props) => {
  const [loading, setLoading] = useState(false)
  const [outputs, setOutputs] = useState<{ partId: string; perUnit: number }[]>([])
  const [consumptions, setConsumptions] = useState<{ partId: string; quantityPerUnit: number }[]>([])
  const [parts, setParts] = useState<InventoryItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && taskId) {
      loadRecipe()
    } else {
      // Скидаємо дані при закритті
      setOutputs([])
      setConsumptions([])
      setError(null)
    }
  }, [isOpen, taskId])

  useEffect(() => {
    if (projectId && isOpen) {
      loadParts()
    }
  }, [projectId, isOpen])

  const loadRecipe = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTaskRecipe(taskId)
      setOutputs(data.outputs.map(o => ({ partId: o.partId, perUnit: Number(o.perUnit) })))
      setConsumptions(data.consumptions.map(c => ({ partId: c.partId, quantityPerUnit: Number(c.quantityPerUnit) })))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не вдалося завантажити рецепт')
    } finally {
      setLoading(false)
    }
  }

  const loadParts = async () => {
    if (!projectId) return
    try {
      const data = await getInventory(projectId, { page: 1, pageSize: 1000 })
      setParts(data.items)
    } catch (err) {
      console.error('Помилка завантаження деталей:', err)
    }
  }

  const getPartDisplay = (partId: string) => {
    const part = parts.find(p => p.id === partId)
    if (!part) return { code: '-', name: '-' }
    return { code: part.code, name: part.name || '-' }
  }

  const hasRecipe = outputs.length > 0 || consumptions.length > 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Рецепт задачі{taskName && `: ${taskName}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Box textAlign="center" py={8}>
              <Spinner size="xl" />
              <Text mt={4}>Завантаження рецепта...</Text>
            </Box>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : !hasRecipe ? (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">Рецепт не налаштовано</Text>
              {projectId && (
                <Button as={Link} to={`/tasks/${taskId}/recipe`} mt={4} colorScheme="blue">
                  Налаштувати рецепт
                </Button>
              )}
            </Box>
          ) : (
            <VStack align="stretch" spacing={6}>
              {outputs.length > 0 && (
                <Box>
                  <Heading size="sm" mb={3}>
                    Вихідні деталі (що виробляється)
                  </Heading>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Код</Th>
                        <Th>Назва</Th>
                        <Th isNumeric>На одиницю</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {outputs.map(o => {
                        const part = getPartDisplay(o.partId)
                        return (
                          <Tr key={o.partId}>
                            <Td>
                              <Text fontWeight="medium">{part.code}</Text>
                            </Td>
                            <Td>{part.name}</Td>
                            <Td isNumeric>{o.perUnit}</Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </Box>
              )}

              {consumptions.length > 0 && (
                <Box>
                  <Heading size="sm" mb={3}>
                    Споживані деталі (що витрачається)
                  </Heading>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Код</Th>
                        <Th>Назва</Th>
                        <Th isNumeric>Поточна к-сть</Th>
                        <Th isNumeric>На одиницю</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {consumptions.map(c => {
                        const part = parts.find(p => p.id === c.partId)
                        const partDisplay = getPartDisplay(c.partId)
                        const currentQty = part?.currentQuantity ?? 0
                        const isLowStock = currentQty < c.quantityPerUnit * 10
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
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Закрити
          </Button>
          {projectId && hasRecipe && (
            <Button as={Link} to={`/tasks/${taskId}/recipe`} colorScheme="blue">
              Редагувати рецепт
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

