import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { PMDashboard } from './PMDashboard';
import { WorkerDashboard } from './WorkerDashboard';
import { GuestDashboard } from './GuestDashboard';
import { UnknownRoleDashboard } from './UnknownRoleDashboard';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || !user.id) {
    return null;
  }

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'PROJECT_MANAGER':
      return <PMDashboard />;
    case 'WORKER':
      return <WorkerDashboard />;
    case 'GUEST':
      return <GuestDashboard />;
    default:
      return <UnknownRoleDashboard />;
  }
}; 