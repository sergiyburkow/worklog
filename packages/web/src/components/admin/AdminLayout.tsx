import { Box } from '@chakra-ui/react';
import { AdminMenu } from './AdminMenu';
import { useState, useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminMenuCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('adminMenuCollapsed');
      setIsMenuCollapsed(saved ? JSON.parse(saved) : false);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Box width="100%" height="calc(100vh - 70px)" display="flex" pt="70px">
      <AdminMenu />
      <Box
        flex="1"
        transition="all 0.2s"
        bg="gray.50"
        overflow="auto"
      >
        {children}
      </Box>
    </Box>
  );
}; 