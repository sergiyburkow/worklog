import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { useParams, Link } from 'react-router-dom'
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Text, Select, Button, Table, Thead, Tr, Th, Tbody, Td, Input, Spinner } from '@chakra-ui/react'
import { getDeficitReport, getMovementsReport, getTopDeficitReport, InventoryItem } from '../../api/inventory'

export const ProjectInventoryReports = () => {
  const { projectId } = useParams<{ projectId: string }>()

  // Deficit
  const [defPage, setDefPage] = useState(1)
  const [defPageSize, setDefPageSize] = useState(25)
  const [defTotal, setDefTotal] = useState(0)
  const [defItems, setDefItems] = useState<InventoryItem[]>([])
  const [defLoading, setDefLoading] = useState(false)

  // Movements
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [summary, setSummary] = useState<{ type: 'PURCHASE' | 'PRODUCTION' | 'ADJUSTMENT'; quantity: number }[]>([])
  const [movLoading, setMovLoading] = useState(false)

  // Top deficit
  const [limit, setLimit] = useState(10)
  const [topItems, setTopItems] = useState<InventoryItem[]>([])
  const [topLoading, setTopLoading] = useState(false)

  const loadDeficit = async () => {
    if (!projectId) return
    setDefLoading(true)
    try {
      const data = await getDeficitReport(projectId, { page: defPage, pageSize: defPageSize })
      setDefItems(data.items)
      setDefTotal(data.total || 0)
    } finally {
      setDefLoading(false)
    }
  }

  const loadMovements = async () => {
    if (!projectId) return
    setMovLoading(true)
    try {
      const data = await getMovementsReport(projectId, { from: from || undefined, to: to || undefined })
      setSummary(data.summary)
    } finally {
      setMovLoading(false)
    }
  }

  const loadTop = async () => {
    if (!projectId) return
    setTopLoading(true)
    try {
      const data = await getTopDeficitReport(projectId, { limit })
      setTopItems(data.items)
    } finally {
      setTopLoading(false)
    }
  }

  useEffect(() => { loadDeficit() }, [projectId, defPage, defPageSize])
  useEffect(() => { loadMovements() }, [projectId])
  useEffect(() => { loadTop() }, [projectId, limit])

  return (
    <AdminLayout>
      <Box p={4}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Звіти інвентаря</Heading>
          {projectId && (
            <Button as={Link} to={`/projects/${projectId}/inventory`} variant="outline">До інвентаря</Button>
          )}
        </HStack>
        <Tabs colorScheme="blue">
          <TabList>
            <Tab>Дефіцит</Tab>
            <Tab>Рухи за період</Tab>
            <Tab>ТОП дефіцитних</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <HStack justify="space-between" mb={3}>
                <HStack>
                  <Button size="sm" onClick={() => setDefPage(p => Math.max(1, p - 1))} isDisabled={defPage <= 1}>Назад</Button>
                  <Text fontSize="sm">Сторінка {defPage}</Text>
                  <Button size="sm" onClick={() => setDefPage(p => (p * defPageSize < defTotal ? p + 1 : p))} isDisabled={defPage * defPageSize >= defTotal}>Вперед</Button>
                </HStack>
                <HStack>
                  <Text fontSize="sm">На сторінці</Text>
                  <Select size="sm" value={String(defPageSize)} onChange={(e) => { setDefPage(1); setDefPageSize(Number(e.target.value)) }} w="90px">
                    {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                  </Select>
                  <Text fontSize="sm">з {defTotal}</Text>
                </HStack>
              </HStack>
              {defLoading ? (
                <HStack><Spinner size="sm" /><Text>Завантаження…</Text></HStack>
              ) : defItems.length === 0 ? (
                <Text color="gray.500">Немає дефіцитних позицій</Text>
              ) : (
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Код</Th>
                    <Th>Назва</Th>
                    <Th isNumeric>Поточна</Th>
                    <Th isNumeric>Цільова</Th>
                    <Th isNumeric>Потрібно</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {defItems.map(i => (
                    <Tr key={i.id}>
                      <Td>{i.code}</Td>
                      <Td>{i.name || '-'}</Td>
                      <Td isNumeric>{i.currentQuantity}</Td>
                      <Td isNumeric>{i.targetQuantity ?? '-'}</Td>
                      <Td isNumeric>{i.requiredQuantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              )}
            </TabPanel>
            <TabPanel>
              <HStack mb={3} spacing={3}>
                <Box>
                  <Text fontSize="sm">Від</Text>
                  <Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
                </Box>
                <Box>
                  <Text fontSize="sm">До</Text>
                  <Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
                </Box>
                <Button onClick={loadMovements}>Показати</Button>
              </HStack>
              {movLoading ? (
                <HStack><Spinner size="sm" /><Text>Завантаження…</Text></HStack>
              ) : summary.length === 0 ? (
                <Text color="gray.500">Немає рухів у вибраному періоді</Text>
              ) : (
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Тип</Th>
                    <Th isNumeric>Кількість</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {summary.map(s => (
                    <Tr key={s.type}>
                      <Td>{s.type}</Td>
                      <Td isNumeric>{s.quantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              )}
            </TabPanel>
            <TabPanel>
              <HStack mb={3}>
                <Text fontSize="sm">Ліміт</Text>
                <Select size="sm" w="100px" value={String(limit)} onChange={(e) => setLimit(Number(e.target.value))}>
                  {[5,10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                </Select>
              </HStack>
              {topLoading ? (
                <HStack><Spinner size="sm" /><Text>Завантаження…</Text></HStack>
              ) : topItems.length === 0 ? (
                <Text color="gray.500">Немає дефіцитних позицій</Text>
              ) : (
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Код</Th>
                    <Th>Назва</Th>
                    <Th isNumeric>Поточна</Th>
                    <Th isNumeric>Цільова</Th>
                    <Th isNumeric>Потрібно</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {topItems.map(i => (
                    <Tr key={i.id}>
                      <Td>{i.code}</Td>
                      <Td>{i.name || '-'}</Td>
                      <Td isNumeric>{i.currentQuantity}</Td>
                      <Td isNumeric>{i.targetQuantity ?? '-'}</Td>
                      <Td isNumeric>{i.requiredQuantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </AdminLayout>
  )
}
