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

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/projects"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                  <ProjectsList />
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
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
