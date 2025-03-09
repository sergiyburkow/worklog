import { ChakraProvider as ChakraUIProvider } from '@chakra-ui/react';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function ChakraProvider({ children }: Props) {
  return (
    <ChakraUIProvider>
      {children}
    </ChakraUIProvider>
  );
} 