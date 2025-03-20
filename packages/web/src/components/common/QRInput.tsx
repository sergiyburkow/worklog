import { Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react';
import { FaQrcode } from 'react-icons/fa';
import { QRScanner } from '../QRScanner';
import { useState } from 'react';

interface QRInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onScanClick?: () => void;
  name?: string;
  isMultiple?: boolean;
  onBlur?: () => void;
  onScan?: (result: string) => void;
}

export const QRInput = ({ 
  value, 
  onChange, 
  placeholder, 
  onScanClick,
  name,
  isMultiple = false,
  onBlur,
  onScan
}: QRInputProps) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleScanClick = () => {
    setShowScanner(true);
    onScanClick?.();
  };

  const handleScan = (result: string) => {
    setShowScanner(false);
    onScan?.(result);
  };

  const handleScanError = (error: any) => {
    console.error('Помилка сканування:', error);
  };

  return (
    <>
      <InputGroup>
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          onBlur={onBlur}
        />
        <InputLeftElement>
          <Icon
            as={FaQrcode}
            cursor="pointer"
            onClick={handleScanClick}
          />
        </InputLeftElement>
      </InputGroup>
      <QRScanner
        onScan={handleScan}
        onError={handleScanError}
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
      />
    </>
  );
}; 