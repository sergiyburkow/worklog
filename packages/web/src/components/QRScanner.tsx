import { useEffect, useRef } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (result: string) => void;
}

export const QRScanner = ({ onScan }: QRScannerProps) => {
  const toast = useToast();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Створюємо сканер
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1,
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_CAMERA,
          Html5QrcodeScanType.SCAN_TYPE_FILE
        ]
      },
      false
    );

    // Налаштовуємо обробники успішного сканування та помилок
    scannerRef.current.render(
      (result) => {
        onScan(result);
        toast({
          title: 'Код зчитано',
          description: 'QR/штрихкод успішно розпізнано',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      (error) => {
        console.error('Помилка сканування:', error);
      }
    );

    // Очищуємо сканер при розмонтуванні компонента
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScan, toast]);

  return (
    <Box>
      <Box id="qr-reader" width="100%" maxW="500px" mx="auto" />
    </Box>
  );
}; 