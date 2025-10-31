import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ProjectsList } from './pages/projects/ProjectsList';
import { ProjectDetails } from './pages/projects/ProjectDetails';
import { EditProject } from './pages/projects/EditProject';
import { Tasks } from './pages/tasks/Tasks';
import { TaskRegister } from './pages/tasks/TaskRegister';
import { RegisteredTasks } from './pages/tasks/RegisteredTasks';
import { ClientsList } from './pages/clients/ClientsList';
import { EditClient } from './pages/clients/EditClient';
import { UsersList } from './pages/users/UsersList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductTaskLogs } from './pages/products/ProductTaskLogs';
import { ProjectProductsList } from './pages/projects/ProjectProductsList';
import { ProjectInventory } from './pages/projects/ProjectInventory';
import { ProjectInventoryReports } from './pages/projects/ProjectInventoryReports';
import { TaskRecipeEditor } from './pages/tasks/TaskRecipeEditor';
import { ProjectUserDetails } from './pages/projects/ProjectUserDetails';
import { ProjectPayments } from './pages/projects/ProjectPayments';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
              path="/projects/new"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                  <EditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'WORKER', 'GUEST']}>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
              <Route
                path="/projects/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                    <EditProject />
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
                path="/projects/:projectId/tasks/register/intermediate"
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
                path="/projects/:projectId/products"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                    <ProjectProductsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId/inventory"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                    <ProjectInventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId/inventory/reports"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                    <ProjectInventoryReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:taskId/recipe"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                    <TaskRecipeEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:productId/logs"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                    <ProductTaskLogs />
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
              path="/clients/new"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                  <EditClient />
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
              <Route
                path="/projects/:projectId/users/:userId"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                    <ProjectUserDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId/payments"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER']}>
                    <ProjectPayments />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;

