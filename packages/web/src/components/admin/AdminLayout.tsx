import { Box, Icon, IconButton } from '@chakra-ui/react';
import { AdminMenu } from './AdminMenu';
import { ProjectMenu } from './ProjectMenu';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminMenuCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('adminMenuCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);
  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box width="100%" height="calc(100vh - 70px)" display="flex" flexDirection="column" pt="70px">
      <Box display="flex" flex="1" overflow="hidden">
      <Box 
      position="relative"
      left={0}
      height="calc(100vh - 70px)"
      width={isCollapsed ? "60px" : "250px"}
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      p={4}
      transition="width 0.2s"
      zIndex={1000}
    >
      {projectId && <ProjectMenu isCollapsed={isCollapsed} />}
      {projectId && <Box mt={2} />}
      <AdminMenu isCollapsed={isCollapsed} />
      
      <IconButton
        aria-label="Toggle menu"
        icon={<Icon as={isCollapsed ? FiChevronRight : FiChevronLeft} />}
        size="sm"
        position="absolute"
        right="-16px"
        top="50%"
        transform="translateY(-50%)"
        borderRadius="full"
        onClick={toggleMenu}
        boxShadow="md"
        bg="white"
        _hover={{ bg: "gray.100" }}
        zIndex={1000}
      />
    </Box>
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          transition="all 0.2s"
          bg="gray.50"
          overflow="hidden"
        >
          <Box flex="1" overflow="auto">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}; 