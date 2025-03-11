import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export const AdminRoute = () => {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}; 