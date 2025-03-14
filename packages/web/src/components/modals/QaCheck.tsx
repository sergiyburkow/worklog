import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  VStack,
  Button,
  HStack,
  Center,
  Card,
  CardBody,
  Checkbox,
  Textarea,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface QaCheckProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
  assigneeName: string;
}

export const QaCheck: React.FC<QaCheckProps> = ({
  isOpen,
  onClose,
  taskName,
  assigneeName,
}) => {
  const [hasComments, setHasComments] = useState(false);
  const [comments, setComments] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Перевірка якості</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text>
              <strong>Задача:</strong> {taskName}
            </Text>
            <Text>
              <strong>Виконавець:</strong> {assigneeName}
            </Text>

            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Checkbox
                    isChecked={hasComments}
                    onChange={(e) => setHasComments(e.target.checked)}
                  >
                    Є зауваження
                  </Checkbox>

                  {hasComments && (
                    <>
                      <FormControl>
                        <FormLabel>Коментар</FormLabel>
                        <Textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Опишіть зауваження..."
                          rows={4}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Фото</FormLabel>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                        />
                      </FormControl>

                      {selectedFiles && (
                        <Text fontSize="sm" color="gray.500">
                          Обрано файлів: {selectedFiles.length}
                        </Text>
                      )}
                    </>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Center w="100%">
            <HStack spacing={4}>
              <Button
                leftIcon={<FaCheck />}
                colorScheme="green"
                onClick={() => {
                  // TODO: Implement approval logic
                  console.log('Прийняв', {
                    hasComments,
                    comments: hasComments ? comments : null,
                    files: hasComments ? selectedFiles : null,
                  });
                }}
              >
                Прийняв
              </Button>
              <Button
                leftIcon={<FaTimes />}
                colorScheme="red"
                onClick={() => {
                  // TODO: Implement rejection logic
                  console.log('Відхилив', {
                    hasComments,
                    comments: hasComments ? comments : null,
                    files: hasComments ? selectedFiles : null,
                  });
                }}
              >
                Відхилив
              </Button>
            </HStack>
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 