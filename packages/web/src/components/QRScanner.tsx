import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Box, VStack, Portal, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Button, useToast } from '@chakra-ui/react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError, isOpen, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<'environment' | 'user'>('environment');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const qrReaderElement = document.getElementById('qr-reader');
        if (qrReaderElement) {
          initScanner();
        } else {
          console.error('QR reader element not found');
          handleError('Failed to initialize scanner: QR reader element not found');
        }
      }, 300);

      return () => clearTimeout(timer);
    }

    return () => {
      stopScanning();
      if (scannerRef.current) {
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  const checkBrowserSupport = async () => {
    // Перевіряємо чи ми в безпечному контексті (HTTPS або localhost)
    const isSecureContext = window.isSecureContext;
    if (!isSecureContext) {
      throw new Error('Камера доступна тільки в безпечному контексті (HTTPS або localhost)');
    }

    // Перевіряємо підтримку getUserMedia
    const getUserMedia = navigator.mediaDevices?.getUserMedia || 
                        (navigator as any).getUserMedia ||
                        (navigator as any).webkitGetUserMedia ||
                        (navigator as any).mozGetUserMedia;

    if (!getUserMedia) {
      throw new Error('Ваш браузер не підтримує доступ до камери. Спробуйте використати Chrome, Firefox або Safari');
    }

    // Перевіряємо доступні пристрої
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('Відсутні відео пристрої');
      }
    } catch (error) {
      console.error('Error checking devices:', error);
      // Продовжуємо виконання, оскільки enumerateDevices може не підтримуватися
    }
  };

  const initScanner = async () => {
    try {
      if (scannerRef.current) {
        await stopScanning();
      }

      await checkBrowserSupport();

      scannerRef.current = new Html5Qrcode('qr-reader', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODABAR,
          Html5QrcodeSupportedFormats.ITF
        ],
        verbose: true
      });

      await startScanning();
    } catch (error) {
      console.error('Error initializing scanner:', error);
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    console.error('Scanner error:', error);
    const errorMessage = error?.message || 'Помилка сканування';
    
    let description = 'Спробуйте оновити сторінку або перевірити налаштування браузера';
    
    if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
      description = 'Будь ласка, надайте дозвіл на використання камери в налаштуваннях браузера';
    } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('DevicesNotFoundError')) {
      description = 'Камера не знайдена. Перевірте підключення камери та спробуйте ще раз';
    } else if (errorMessage.includes('NotReadableError') || errorMessage.includes('TrackStartError')) {
      description = 'Камера зайнята іншим додатком. Закрийте інші додатки, що використовують камеру';
    } else if (errorMessage.includes('безпечному контексті')) {
      description = 'Для використання камери потрібно відкрити сайт через HTTPS або localhost';
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

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      const config = {
        fps: 10,
        qrbox: { width: 400, height: 150 },
        aspectRatio: 2.0
      };

      const facingMode = isIOS ? 'environment' : currentCamera;

      await scannerRef.current.start(
        { facingMode },
        config,
        (decodedText) => {
          onScan(decodedText);
          onClose();
        },
        (errorMessage) => {
          if (!errorMessage.includes('NotFoundException')) {
            handleError(errorMessage);
          }
        }
      );
      setIsScanning(true);
    } catch (err) {
      handleError(err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const switchCamera = async () => {
    try {
      await stopScanning();
      setCurrentCamera(prev => prev === 'environment' ? 'user' : 'environment');
      await startScanning();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Portal>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Сканування коду</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box width="100%" height="400px" position="relative" ref={containerRef}>
              <div id="qr-reader" style={{ width: '100%', height: '100%' }}></div>
              {isIOS && (
                <Box 
                  position="absolute" 
                  top={0} 
                  left={0} 
                  right={0} 
                  p={4} 
                  bg="rgba(0,0,0,0.7)" 
                  color="white"
                  textAlign="center"
                >
                  <Text mb={2}>
                    {currentCamera === 'environment' 
                      ? 'Використовується задня камера' 
                      : 'Використовується фронтальна камера'}
                  </Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={switchCamera}
                  >
                    Перемкнути камеру
                  </Button>
                </Box>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Portal>
  );
}; 