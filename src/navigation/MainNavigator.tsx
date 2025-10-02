import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AdminBottomTabNavigator } from './AdminBottomTabNavigator';

export const MainNavigator: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminBottomTabNavigator />;
  }

  return <BottomTabNavigator />;
};
