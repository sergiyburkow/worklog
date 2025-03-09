import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

interface ButtonProps extends Omit<ChakraButtonProps, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  colorScheme?: string;
  isFullWidth?: boolean;
}

export const Button = ({
  size = 'lg',
  variant = 'solid',
  colorScheme = 'blue',
  isFullWidth = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <ChakraButton
      size={size}
      variant={variant}
      colorScheme={colorScheme}
      w={isFullWidth ? 'full' : undefined}
      fontSize="md"
      borderRadius="md"
      boxShadow="md"
      {...props}
    >
      {children}
    </ChakraButton>
  );
}; 