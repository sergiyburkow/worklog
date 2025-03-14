import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Portal, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError, isOpen, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isModalReady, setIsModalReady] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsModalReady(true);
      }, 100);
    } else {
      setIsModalReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isModalReady) {
      initScanner();
    }
    return () => {
      stopScanning();
    };
  }, [isModalReady]);

  const initScanner = () => {
    try {
      console.log('Initializing scanner...');
      
      // Створюємо сканер з базовими налаштуваннями
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10,
          qrbox: 180
        },
        false // verbose mode
      );

      scannerRef.current = scanner;

      // Функція успішного сканування
      const onScanSuccess = (decodedText: string) => {
        console.log("Barcode detected:", decodedText);
        onScan(decodedText);
        onClose();
      };

      // Функція обробки помилок
      const onScanError = (errorMessage: string) => {
        console.error('Scanning error:', errorMessage);
        handleError(errorMessage);
      };

      // Рендеримо сканер
      scanner.render(onScanSuccess, onScanError);
      console.log('Scanner initialized successfully');
    } catch (error) {
      console.error('Failed to initialize scanner:', error);
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    console.error('Scanner error:', error);
    const errorMessage = error?.message || error?.toString() || 'Помилка сканування';
    
    let description = 'Спробуйте оновити сторінку або перевірити налаштування браузера';
    
    if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
      description = 'Будь ласка, надайте дозвіл на використання камери в налаштуваннях браузера';
    } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('DevicesNotFoundError')) {
      description = 'Камера не знайдена. Перевірте підключення камери та спробуйте ще раз';
    } else if (errorMessage.includes('NotReadableError') || errorMessage.includes('TrackStartError')) {
      description = 'Камера зайнята іншим додатком. Закрийте інші додатки, що використовують камеру';
    } else if (errorMessage.includes('No MultiFormat Readers')) {
      return;
    }

    toast({
      title: 'Помилка сканування',
      description: `${description}\nДеталі: ${errorMessage}`,
      status: 'error',
      duration: 7000,
      isClosable: true,
    });

    onError(errorMessage);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  return (
    <Portal>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent maxW="90vw">
          <ModalHeader>Сканування штрих-коду</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box 
              width="100%" 
              height="70vh"
              position="relative"
              overflow="hidden"
              borderRadius="md"
              backgroundColor="black"
            >
              <div id="reader" style={{ width: '100%', height: '100%' }} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Portal>
  );
}; 