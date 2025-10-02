import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigation.replace('Main', { screen: 'ProfileTab' });
    }
  }, [isAuthenticated, user, navigation]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <Text style={tw`text-6xl mb-4`}>🚫</Text>
        <Text style={tw`text-xl font-bold text-gray-900 mb-2`}>Access Denied</Text>
        <Text style={tw`text-gray-600 text-center`}>
          You need admin privileges to access this page
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};
