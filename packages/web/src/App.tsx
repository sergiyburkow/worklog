import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Container, Box } from '@chakra-ui/react';
import { theme } from './theme';
import { LoginPage } from './pages/auth/LoginPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { TaskRegister } from './pages/tasks/TaskRegister';
import { Tasks } from './pages/tasks/Tasks';
import { UsersList } from './pages/users/UsersList';
import { ProjectsList } from './pages/projects/ProjectsList';
import { EditProject } from './pages/projects/EditProject';
import { ClientsList } from './pages/clients/ClientsList';
import { EditClient } from './pages/clients/EditClient';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectDetails } from './pages/projects/ProjectDetails';
import { RegisteredTasks } from './pages/tasks/RegisteredTasks';

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Box bg="gray.50" minH="100vh" py={4}>
            <Container 
              maxW="1280px" 
              p={0} 
              mx="auto" 
              bg="white"
              boxShadow="sm"
              borderRadius="lg"
              overflow="hidden"
            >
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route 
                  path="/tasks/register" 
                  element={
                    <ProtectedRoute allowedRoles={['WORKER', 'PROJECT_MANAGER', 'ADMIN']}>
                      <TaskRegister />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:id/tasks" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                      <Tasks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/tasks/register/product" 
                  element={
                    <ProtectedRoute allowedRoles={['WORKER', 'PROJECT_MANAGER', 'ADMIN']}>
                      <TaskRegister />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/tasks/register/general" 
                  element={
                    <ProtectedRoute allowedRoles={['WORKER', 'PROJECT_MANAGER', 'ADMIN']}>
                      <TaskRegister />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/tasks/registered" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                      <RegisteredTasks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:projectId/tasks/registered/user/:userId" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                      <RegisteredTasks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <UsersList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <ProjectsList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:id/edit" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <EditProject />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <ProjectDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/new" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <EditProject />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/clients" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <ClientsList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/clients/:id/edit" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <EditClient />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/clients/new" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <EditClient />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}
