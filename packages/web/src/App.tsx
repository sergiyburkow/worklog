import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { LoginPage } from './pages/auth/LoginPage';
import { ProjectsList } from './pages/projects/ProjectsList';
import { Tasks } from './pages/tasks/Tasks';
import { TaskRegister } from './pages/tasks/TaskRegister';
import { RegisteredTasks } from './pages/tasks/RegisteredTasks';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { theme } from './theme';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ClientsList } from './pages/clients/ClientsList';
import { EditClient } from './pages/clients/EditClient';
import { UsersList } from './pages/users/UsersList';
import { ProjectDetails } from './pages/projects/ProjectDetails';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'WORKER', 'GUEST']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                  <ProjectsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/tasks"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'WORKER']}>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/tasks/register/product"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'WORKER']}>
                  <TaskRegister />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/tasks/register/general"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                  <RegisteredTasks />
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
              path="/clients"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                  <ClientsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                  <EditClient />
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
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}
export default App;

