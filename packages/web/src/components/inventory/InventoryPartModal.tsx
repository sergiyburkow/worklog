import { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, FormControl, FormLabel, Input, FormErrorMessage, HStack } from '@chakra-ui/react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string; unit?: string; targetQuantity?: number; groupId?: string }) => Promise<void>
  groups?: Array<{ id: string; name: string }>
  onCreateGroup?: () => void
}

export const InventoryPartModal = ({ isOpen, onClose, onSubmit, groups = [], onCreateGroup }: Props) => {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('pcs')
  const [targetQuantity, setTargetQuantity] = useState<string>('')
  const [groupId, setGroupId] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Назва обовʼязкова')
      return
    }
    setIsLoading(true)
    try {
      await onSubmit({ name: name.trim(), description: description || undefined, unit: unit.trim(), targetQuantity: targetQuantity ? Number(targetQuantity) : undefined, groupId: groupId || undefined })
      setName(''); setDescription(''); setUnit('pcs'); setTargetQuantity(''); setGroupId(''); setError('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const close = () => { setError(''); onClose() }

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Створення деталі</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!error} mb={3}>
            <FormLabel>Назва</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Назва деталі" />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Одиниця</FormLabel>
            <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: '8px', borderRadius: 4 }}>
              <option value="pcs">шт</option>
              <option value="kg">кг</option>
              <option value="g">г</option>
              <option value="m">м</option>
              <option value="cm">см</option>
              <option value="mm">мм</option>
              <option value="l">л</option>
            </select>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Група</FormLabel>
            <HStack>
              <select value={groupId} onChange={(e) => setGroupId(e.target.value)} style={{ padding: '8px', borderRadius: 4, width: '100%' }}>
                <option value="">Без групи</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              {onCreateGroup && (
                <Button onClick={onCreateGroup} variant="outline" size="sm">Нова</Button>
              )}
            </HStack>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Опис</FormLabel>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опціонально" />
          </FormControl>
          <FormControl>
            <FormLabel>Цільова кількість</FormLabel>
            <Input type="number" min="0" value={targetQuantity} onChange={(e) => setTargetQuantity(e.target.value)} placeholder="Необовʼязково" />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={close}>Скасувати</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>Створити</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
