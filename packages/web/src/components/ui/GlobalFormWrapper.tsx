import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface GlobalFormWrapperProps extends BoxProps {
  children: ReactNode;
}

export const GlobalFormWrapper = ({ children, ...props }: GlobalFormWrapperProps) => {
  return (
    <Box
      width="100%"
      maxW="800px"
      mx="auto"
      p={8}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
      {...props}
    >
      {children}
    </Box>
  );
}; 