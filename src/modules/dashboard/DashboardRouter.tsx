import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MasterDashboardPage } from './MasterDashboardPage';
import { StaffDashboardPage } from './StaffDashboardPage';

export const DashboardRouter: React.FC = () => {
  const { isMaster } = useAuth();
  return isMaster ? <MasterDashboardPage /> : <StaffDashboardPage />;
};
