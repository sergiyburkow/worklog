import {
  HStack,
  IconButton,
  Tooltip,
  IconButtonProps,
} from '@chakra-ui/react';
import { ReactElement } from 'react';

export interface Action {
  label: string;
  icon: ReactElement;
  onClick: () => void;
  colorScheme?: string;
  isDisabled?: boolean;
  'aria-label'?: string;
  variant?: string;
}

interface TableActionsProps {
  actions: Action[];
  size?: IconButtonProps['size'];
  spacing?: number;
  variant?: string;
}

export const TableActions = ({ 
  actions, 
  size = 'sm', 
  spacing = 1.5, 
  variant = 'ghost' 
}: TableActionsProps) => {
  return (
    <HStack spacing={spacing}>
      {actions.map((action, index) => (
        <Tooltip key={index} label={action.label} fontSize="sm">
          <IconButton
            aria-label={action['aria-label'] || action.label}
            icon={action.icon}
            size={size}
            colorScheme={action.colorScheme}
            onClick={action.onClick}
            isDisabled={action.isDisabled}
            variant={action.variant || variant}
            padding={1.5}
          />
        </Tooltip>
      ))}
    </HStack>
  );
}; 