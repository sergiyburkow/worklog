import { useEffect, useState } from 'react'
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton, VStack, HStack, Badge, Text, Spinner, Button } from '@chakra-ui/react'
import { getPartLogs, InventoryLogEntry } from '../../api/inventory'

interface Props {
  isOpen: boolean
  onClose: () => void
  projectId: string
  partId: string
}

export const InventoryLogsDrawer = ({ isOpen, onClose, projectId, partId }: Props) => {
  const [logs, setLogs] = useState<InventoryLogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(25)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !partId) return
      setLoading(true)
      try {
        const data = await getPartLogs(projectId, partId, { page, pageSize })
        setLogs(data.items || [])
        setTotal(data.total || 0)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isOpen, partId, projectId, page, pageSize])

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Логи рухів</DrawerHeader>
        <DrawerBody>
          {loading ? (
            <HStack><Spinner size="sm" /><Text>Завантаження…</Text></HStack>
          ) : logs.length === 0 ? (
            <Text color="gray.500">Немає записів</Text>
          ) : (
            <VStack align="stretch" spacing={3}>
              {logs.map((l) => {
                const totalPrice = l.unitPrice && l.quantity ? (Number(l.unitPrice) * Number(l.quantity)).toFixed(2) : null
                return (
                  <VStack key={l.id} align="stretch" spacing={1} p={2} borderWidth={1} borderRadius="md">
                    <HStack justify="space-between">
                      <Badge colorScheme={l.type === 'PURCHASE' ? 'green' : l.type === 'PRODUCTION' ? 'blue' : 'gray'}>
                        {l.type === 'PURCHASE' ? 'Закупівля' : l.type === 'PRODUCTION' ? 'Виробництво' : 'Корекція'}
                      </Badge>
                      <Text fontSize="sm" color="gray.500">{new Date(l.createdAt).toLocaleString()}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Кількість: {l.quantity}</Text>
                      {l.unitPrice && (
                        <VStack align="end" spacing={0}>
                          <Text fontSize="sm">Ціна: {Number(l.unitPrice).toFixed(2)} ₴</Text>
                          {totalPrice && (
                            <Text fontSize="sm" fontWeight="bold" color="green.600">Загалом: {totalPrice} ₴</Text>
                          )}
                        </VStack>
                      )}
                    </HStack>
                    {l.note && (
                      <Text fontSize="sm" color="gray.600" fontStyle="italic">{l.note}</Text>
                    )}
                  </VStack>
                )
              })}
              <HStack justify="space-between" pt={2}>
                <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} isDisabled={page <= 1}>Назад</Button>
                <Text fontSize="sm">Сторінка {page}</Text>
                <Button size="sm" onClick={() => setPage(p => (p * pageSize < total ? p + 1 : p))} isDisabled={page * pageSize >= total}>Вперед</Button>
              </HStack>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
