import { useEffect, useState } from 'react'
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton, VStack, HStack, Badge, Text, Spinner } from '@chakra-ui/react'
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

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !partId) return
      setLoading(true)
      try {
        const data = await getPartLogs(projectId, partId)
        setLogs(data.logs || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isOpen, partId, projectId])

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
              {logs.map((l) => (
                <HStack key={l.id} justify="space-between">
                  <Badge>
                    {l.type}
                  </Badge>
                  <Text>+{l.quantity}</Text>
                  <Text fontSize="sm" color="gray.500">{new Date(l.createdAt).toLocaleString()}</Text>
                </HStack>
              ))}
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
