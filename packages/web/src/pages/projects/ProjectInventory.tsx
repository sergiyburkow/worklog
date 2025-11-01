import { useEffect, useState } from 'react'
import { Box, Heading, Button, HStack, useToast, Card, CardHeader, CardBody, Collapse, Icon, Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner, Text, Select, Input, VStack, Switch } from '@chakra-ui/react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ChevronDownIcon, ChevronUpIcon, AddIcon } from '@chakra-ui/icons'
import { useParams, Link } from 'react-router-dom'
import { InventoryPartModal } from '../../components/inventory/InventoryPartModal'
import { InventoryLogModal } from '../../components/inventory/InventoryLogModal'
import { InventoryLogsDrawer } from '../../components/inventory/InventoryLogsDrawer'
import { InventoryPartGroupModal } from '../../components/inventory/InventoryPartGroupModal'
import { addInventoryLog, createPart, getInventory, getPartGroups, createPartGroup, updatePartGroup, updatePart, PartGroup, getUnits } from '../../api/inventory'

interface InventoryItem {
  id: string
  code: string
  name?: string | null
  unit?: string | null
  targetQuantity?: number | null
  currentQuantity: number
  requiredQuantity: number
  isActive: boolean
  group: { id: string; name: string; sortOrder: number } | null
}

// Response type is provided by API client wrapper

export const ProjectInventory = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const toast = useToast()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(25)
  const [total, setTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isListOpen, setIsListOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [onlyDeficit, setOnlyDeficit] = useState(false)
  const [groupId, setGroupId] = useState<string>('')
  const [isPartModalOpen, setIsPartModalOpen] = useState(false)
  const [logPartId, setLogPartId] = useState<string | null>(null)
  const [viewLogsPartId, setViewLogsPartId] = useState<string | null>(null)
  const [partGroups, setPartGroups] = useState<PartGroup[]>([])
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<PartGroup | null>(null)
  const [qtyDraft, setQtyDraft] = useState<Record<string, string>>({})
  const [units, setUnits] = useState<readonly string[] | null>(null)
  const qtyTimersRef = (typeof window !== 'undefined' ? (window as any) : {}) as { _invQtyTimers?: Record<string, any> }
  if (!qtyTimersRef._invQtyTimers) qtyTimersRef._invQtyTimers = {}
  
  const fetchInventory = async () => {
    if (!projectId) return
    try {
      setIsLoading(true)
      const params: Record<string, any> = { page, pageSize }
      if (search) params.search = search
      if (onlyDeficit) params.onlyDeficit = 'true'
      if (groupId) params.groupId = groupId
      const data = await getInventory(projectId, params)
      setItems(data.items)
      setTotal(data.total || 0)
    } catch (error) {
      toast({ title: 'Помилка', description: 'Не вдалося завантажити інвентар', status: 'error', duration: 3000, isClosable: true })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
    const fetchGroups = async () => {
      if (!projectId) return
      try {
        const data = await getPartGroups(projectId)
        setPartGroups(data.groups)
      } catch {}
    }
    fetchGroups()
    const fetchUnits = async () => {
      if (!projectId) return
      try {
        const data = await getUnits(projectId)
        setUnits(data.units)
      } catch {}
    }
    fetchUnits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  useEffect(() => {
    fetchInventory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  const groupsView = (() => {
    const map = new Map<string, { id: string; name: string; sortOrder: number; items: InventoryItem[] }>()
    const ungrouped: InventoryItem[] = []
    for (const item of items) {
      if (item.group) {
        const key = item.group.id
        if (!map.has(key)) map.set(key, { id: item.group.id, name: item.group.name, sortOrder: item.group.sortOrder, items: [] })
        map.get(key)!.items.push(item)
      } else {
        ungrouped.push(item)
      }
    }
    const grouped = Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    if (ungrouped.length) grouped.push({ id: 'ungrouped', name: 'Без групи', sortOrder: 9999, items: ungrouped })
    return grouped
  })()

  const handleCreatePart = async (data: { name: string; unit?: string; targetQuantity?: number }) => {
    if (!projectId) return
    try {
      await createPart(projectId, data)
      toast({ title: 'Створено', description: 'Деталь додано', status: 'success', duration: 2500, isClosable: true })
      fetchInventory()
    } catch (e) {
      toast({ title: 'Помилка', description: 'Не вдалося створити деталь', status: 'error', duration: 3000, isClosable: true })
    }
  }

  const handleAddLog = async (partId: string, data: { type: 'PURCHASE' | 'PRODUCTION' | 'ADJUSTMENT'; quantity: number; unitPrice?: number; note?: string }) => {
    if (!projectId) return
    try {
      await addInventoryLog(projectId, partId, data)
      toast({ title: 'Додано', description: 'Рух зареєстровано', status: 'success', duration: 2500, isClosable: true })
      setLogPartId(null)
      fetchInventory()
    } catch (e) {
      toast({ title: 'Помилка', description: 'Не вдалося додати рух', status: 'error', duration: 3000, isClosable: true })
    }
  }

  return (
    <AdminLayout>
      <Box p={4}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Інвентар</Heading>
          <HStack>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => setIsPartModalOpen(true)}>
              Додати позицію
            </Button>
            <Button onClick={fetchInventory} isDisabled={isLoading}>Оновити</Button>
            <Button variant="outline" onClick={() => setIsGroupModalOpen(true)}>Нова група</Button>
            {projectId && (
              <Button as={Link} to={`/projects/${projectId}/inventory/reports`} variant="outline" colorScheme="teal">
                Звіти
              </Button>
            )}
          </HStack>
        </HStack>

        <Card mb={4}>
          <CardHeader py={2}>
            <Heading size="sm">Фільтри</Heading>
          </CardHeader>
          <CardBody>
            <HStack spacing={3} align="flex-end">
              <VStack align="stretch" spacing={1} w="320px">
                <Text fontSize="sm">Пошук</Text>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Код або назва" />
              </VStack>
              <VStack align="stretch" spacing={1} w="220px">
                <Text fontSize="sm">Група</Text>
                <Select value={groupId} onChange={(e) => setGroupId(e.target.value)} placeholder="Всі групи">
                  {partGroups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </Select>
              </VStack>
              <VStack align="stretch" spacing={1}>
                <Text fontSize="sm">Дії з групою</Text>
                <HStack>
                  <Button variant="outline" onClick={() => { setEditingGroup(null); setIsGroupModalOpen(true) }}>Нова</Button>
                  <Button variant="outline" onClick={() => {
                    const g = partGroups.find(pg => pg.id === groupId)
                    if (g) { setEditingGroup(g); setIsGroupModalOpen(true) }
                  }} isDisabled={!groupId}>Редагувати</Button>
                </HStack>
              </VStack>
              <VStack align="stretch" spacing={1}>
                <Text fontSize="sm">Дефіцитні</Text>
                <Button variant={onlyDeficit ? 'solid' : 'outline'} colorScheme="red" onClick={() => setOnlyDeficit(!onlyDeficit)}>
                  {onlyDeficit ? 'Лише дефіцитні' : 'Всі'}
                </Button>
              </VStack>
              <Button onClick={fetchInventory} isLoading={isLoading}>Застосувати</Button>
            </HStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            cursor="pointer"
            onClick={() => setIsListOpen((v) => !v)}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={2}
            bg="gray.50"
          >
            <Heading size="sm">Список позицій</Heading>
            <Icon as={isListOpen ? ChevronUpIcon : ChevronDownIcon} />
          </CardHeader>
          <Collapse in={isListOpen}>
            <CardBody>
              {isLoading ? (
                <HStack><Spinner size="sm" /><Text>Завантаження…</Text></HStack>
              ) : groupsView.length === 0 ? (
                'Поки що немає позицій інвентарю'
              ) : (
                <VStack align="stretch" spacing={6}>
                  {groupsView.map((g) => (
                    <Box key={g.id}>
                      <Heading size="sm" mb={2}>{g.name}</Heading>
                      <Table size="sm" variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Код</Th>
                            <Th>Назва</Th>
                            <Th>Одиниця</Th>
                            <Th>Група</Th>
                            <Th isNumeric>Поточна</Th>
                            <Th isNumeric>Цільова</Th>
                            <Th isNumeric>Потрібно</Th>
                            <Th>Статус</Th>
                            <Th>Дії</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {g.items.map((it) => (
                            <Tr key={it.id}>
                              <Td>{it.code}</Td>
                              <Td>{it.name || '-'}</Td>
                              <Td>
                                <Select
                                  size="sm"
                                  value={it.unit || ''}
                                  onChange={async (e) => {
                                    if (!projectId) return
                                    await updatePart(projectId, it.id, { unit: e.target.value || undefined })
                                    fetchInventory()
                                  }}
                                >
                                  {(units || ['pcs','kg','g','m','cm','mm','l']).map(u => (
                                    <option key={u} value={u}>{u}</option>
                                  ))}
                                </Select>
                              </Td>
                              <Td>
                                <Select
                                  size="sm"
                                  value={it.group?.id || ''}
                                  onChange={async (e) => {
                                    if (!projectId) return
                                    const newGroupId = e.target.value || undefined
                                    await updatePart(projectId, it.id, { groupId: newGroupId as any })
                                    fetchInventory()
                                  }}
                                >
                                  <option value="">Без групи</option>
                                  {partGroups.map(pg => (
                                    <option key={pg.id} value={pg.id}>{pg.name}</option>
                                  ))}
                                </Select>
                              </Td>
                              <Td isNumeric>{it.currentQuantity}</Td>
                              <Td isNumeric>
                                <Input
                                  size="sm"
                                  type="number"
                                  min={0}
                                  value={qtyDraft[it.id] ?? (it.targetQuantity ?? '')}
                                  onChange={(e) => {
                                    const v = e.target.value
                                    setQtyDraft(prev => ({ ...prev, [it.id]: v }))
                                    if (qtyTimersRef._invQtyTimers![it.id]) clearTimeout(qtyTimersRef._invQtyTimers![it.id])
                                    qtyTimersRef._invQtyTimers![it.id] = setTimeout(async () => {
                                      const num = v === '' ? null : Number(v)
                                      if (Number.isNaN(num) || (typeof num === 'number' && num < 0)) return
                                      if (!projectId) return
                                      await updatePart(projectId, it.id, { targetQuantity: num })
                                      fetchInventory()
                                    }, 600)
                                  }}
                                  onBlur={async () => {
                                    const v = qtyDraft[it.id]
                                    if (v === undefined) return
                                    const num = v === '' ? null : Number(v)
                                    if (!projectId || Number.isNaN(num) || (typeof num === 'number' && num < 0)) return
                                    await updatePart(projectId, it.id, { targetQuantity: num })
                                    fetchInventory()
                                  }}
                                  placeholder="-"
                                />
                              </Td>
                              <Td isNumeric>
                                {it.requiredQuantity > 0 ? (
                                  <Badge colorScheme='red'>{it.requiredQuantity}</Badge>
                                ) : (
                                  <Badge colorScheme='green'>0</Badge>
                                )}
                              </Td>
                              <Td>
                                <HStack>
                                  <Switch
                                    size="sm"
                                    isChecked={it.isActive}
                                    onChange={async (e) => {
                                      if (!projectId) return
                                      await updatePart(projectId, it.id, { isActive: e.target.checked })
                                      fetchInventory()
                                    }}
                                  />
                                  {it.isActive ? <Badge colorScheme='green'>Активна</Badge> : <Badge>Неактивна</Badge>}
                                </HStack>
                              </Td>
                              <Td>
                                <HStack>
                                  <Button size="xs" variant="outline" onClick={() => setLogPartId(it.id)}>Додати</Button>
                                  <Button size="xs" variant="outline" onClick={() => setViewLogsPartId(it.id)}>Логи</Button>
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  ))}
                </VStack>
              )}
            </CardBody>
          </Collapse>
        </Card>

        <HStack justify="space-between" mt={4}>
          <HStack>
            <Button size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} isDisabled={page <= 1}>Назад</Button>
            <Text fontSize="sm">Сторінка {page}</Text>
            <Button size="sm" onClick={() => setPage((p) => (p * pageSize < total ? p + 1 : p))} isDisabled={page * pageSize >= total}>Вперед</Button>
          </HStack>
          <HStack>
            <Text fontSize="sm">На сторінці</Text>
            <Select size="sm" value={String(pageSize)} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }} w="90px">
              {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </Select>
            <Text fontSize="sm">з {total}</Text>
          </HStack>
        </HStack>

        <InventoryPartModal
          isOpen={isPartModalOpen}
          onClose={() => setIsPartModalOpen(false)}
          onSubmit={async (d) => handleCreatePart(d)}
          groups={partGroups.map(g => ({ id: g.id, name: g.name }))}
          onCreateGroup={() => setIsGroupModalOpen(true)}
        />

        <InventoryLogModal
          isOpen={!!logPartId}
          onClose={() => setLogPartId(null)}
          onSubmit={async (d) => { if (logPartId) await handleAddLog(logPartId, d) }}
          partName={logPartId ? (() => {
            const part = items.find(it => it.id === logPartId)
            return part ? `${part.code}${part.name ? ` - ${part.name}` : ''}` : undefined
          })() : undefined}
        />

        {projectId && (
          <InventoryLogsDrawer
            isOpen={!!viewLogsPartId}
            onClose={() => setViewLogsPartId(null)}
            projectId={projectId}
            partId={viewLogsPartId || ''}
          />
        )}

        <InventoryPartGroupModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          initial={editingGroup ? { name: editingGroup.name, description: editingGroup.description || undefined, sortOrder: editingGroup.sortOrder } : undefined}
          onSubmit={async (d) => {
            if (!projectId) return
            if (editingGroup) {
              await updatePartGroup(projectId, editingGroup.id, d)
            } else {
              await createPartGroup(projectId, d)
            }
            const data = await getPartGroups(projectId)
            setPartGroups(data.groups)
            setEditingGroup(null)
          }}
        />
      </Box>
    </AdminLayout>
  )
}
