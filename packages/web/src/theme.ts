import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      'html, body, #root': {
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
      },
      '#root': {
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
}); 