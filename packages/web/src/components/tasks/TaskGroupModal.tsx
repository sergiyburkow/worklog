import { useEffect, useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string; sortOrder?: number }) => Promise<void>
  initial?: { name: string; description?: string; sortOrder?: number }
}

export const TaskGroupModal = ({ isOpen, onClose, onSubmit, initial }: Props) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setDescription(initial.description || '')
      setSortOrder(String(initial.sortOrder ?? 0))
    } else {
      setName('')
      setDescription('')
      setSortOrder('0')
    }
  }, [initial, isOpen])

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await onSubmit({ 
        name: name.trim(), 
        description: description || undefined, 
        sortOrder: Number(sortOrder) || 0 
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initial ? 'Редагувати групу задач' : 'Створити групу задач'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Назва</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Назва групи" />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Опис</FormLabel>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Опис групи (опціонально)"
              rows={3}
              resize="vertical"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Порядок сортування</FormLabel>
            <Input 
              type="number" 
              min="0" 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)} 
              placeholder="0"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Скасувати</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
            {initial ? 'Зберегти' : 'Створити'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

