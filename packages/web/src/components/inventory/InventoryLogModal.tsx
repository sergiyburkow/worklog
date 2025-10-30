import { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { type: 'PURCHASE' | 'PRODUCTION' | 'ADJUSTMENT'; quantity: number; note?: string }) => Promise<void>
}

export const InventoryLogModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [type, setType] = useState<'PURCHASE' | 'PRODUCTION' | 'ADJUSTMENT'>('PURCHASE')
  const [quantity, setQuantity] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const q = Number(quantity)
    if (!q || q <= 0) return
    setIsLoading(true)
    try {
      await onSubmit({ type, quantity: q, note: note || undefined })
      setType('PURCHASE'); setQuantity(''); setNote('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const close = () => onClose()

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Додати рух</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Тип</FormLabel>
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="PURCHASE">Закупівля</option>
              <option value="PRODUCTION">Виробництво</option>
              <option value="ADJUSTMENT">Корекція</option>
            </Select>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Кількість</FormLabel>
            <Input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
          </FormControl>
          <FormControl>
            <FormLabel>Коментар</FormLabel>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Опціонально" />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={close}>Скасувати</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>Додати</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
