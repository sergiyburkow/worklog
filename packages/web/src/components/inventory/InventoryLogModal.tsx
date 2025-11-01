import { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, FormControl, FormLabel, Input, Textarea, Select, Text } from '@chakra-ui/react'
import { useAuth } from '../../contexts/AuthContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { type: 'PURCHASE' | 'PRODUCTION' | 'ADJUSTMENT'; quantity: number; unitPrice?: number; note?: string; createdAt?: string }) => Promise<void>
  partName?: string
}

export const InventoryLogModal = ({ isOpen, onClose, onSubmit, partName }: Props) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [type, setType] = useState<'PURCHASE' | 'PRODUCTION' | 'ADJUSTMENT'>('PURCHASE')
  const [quantity, setQuantity] = useState<string>('')
  const [unitPrice, setUnitPrice] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const q = Number(quantity)
    if (!q || q <= 0) return
    const price = unitPrice ? Number(unitPrice) : undefined
    if (price !== undefined && (isNaN(price) || price < 0)) return
    
    // Валідація дати (тільки для адмінів)
    let customDate: string | undefined = undefined
    if (isAdmin && createdAt) {
      const date = new Date(createdAt)
      if (isNaN(date.getTime())) {
        return // Невалідна дата
      }
      customDate = date.toISOString()
    }
    
    setIsLoading(true)
    try {
      await onSubmit({ 
        type, 
        quantity: q, 
        unitPrice: price, 
        note: note || undefined,
        createdAt: customDate
      })
      setType('PURCHASE'); setQuantity(''); setUnitPrice(''); setNote(''); setCreatedAt('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const close = () => {
    setType('PURCHASE'); setQuantity(''); setUnitPrice(''); setNote(''); setCreatedAt('')
    onClose()
  }

  const showPriceField = type === 'PURCHASE'
  const totalPrice = quantity && unitPrice ? (Number(quantity) * Number(unitPrice)).toFixed(2) : null

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Додати рух</ModalHeader>
        {partName && (
          <Text px={6} pb={2} fontSize="sm" color="gray.600">
            {partName}
          </Text>
        )}
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
            <Input type="number" min="0" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
          </FormControl>
          {showPriceField && (
            <FormControl mb={3}>
              <FormLabel>Ціна за одиницю, ₴</FormLabel>
              <Input 
                type="number" 
                min="0" 
                step="0.01" 
                value={unitPrice} 
                onChange={(e) => setUnitPrice(e.target.value)} 
                placeholder="0.00" 
              />
              {totalPrice && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Загальна вартість: {totalPrice} ₴
                </Text>
              )}
            </FormControl>
          )}
          {isAdmin && (
            <FormControl mb={3}>
              <FormLabel>Дата реєстрації (опціонально)</FormLabel>
              <Input 
                type="datetime-local" 
                value={createdAt} 
                onChange={(e) => setCreatedAt(e.target.value)} 
                placeholder="Залиште порожнім для поточної дати"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Тільки для адміністраторів. Якщо не вказано, використовується поточна дата.
              </Text>
            </FormControl>
          )}
          <FormControl>
            <FormLabel>Коментар</FormLabel>
            <Textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="Опціонально" 
              rows={3}
              resize="vertical"
            />
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
