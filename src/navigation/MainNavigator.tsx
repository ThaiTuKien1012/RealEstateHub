import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AdminBottomTabNavigator } from './AdminBottomTabNavigator';

export const MainNavigator: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (user?.role === 'admin') {
    return <AdminBottomTabNavigator key="admin" />;
  }

  return <BottomTabNavigator key={isAuthenticated ? 'customer' : 'guest'} />;
};
