import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useAuth } from '../hooks/useAuth';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <Text style={tw`text-6xl mb-6`}>🔐</Text>
        <Text style={tw`text-2xl font-bold mb-2`}>Sign In</Text>
        <Text style={tw`text-gray-600 mb-8 text-center`}>
          Access your account and orders
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Auth')}
          style={tw`bg-yellow-600 py-3.5 px-16 rounded-xl`}
          accessibilityLabel="Sign in"
          accessibilityRole="button"
        >
          <Text style={tw`text-white font-semibold text-base`}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-yellow-600 pt-8 pb-12 px-6 items-center`}>
        <View style={tw`w-20 h-20 bg-white rounded-full items-center justify-center mb-3`}>
          <Text style={tw`text-4xl`}>👤</Text>
        </View>
        <Text style={tw`text-white text-xl font-bold mb-1`}>{user?.name || 'User'}</Text>
        <Text style={tw`text-yellow-100 text-sm`}>{user?.email || ''}</Text>
      </View>

      <View style={tw`px-4 py-6`}>
        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>Quick Actions</Text>
        <View style={tw`bg-white rounded-2xl overflow-hidden mb-6`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CartTab')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="View cart"
            accessibilityRole="button"
          >
            <Text style={tw`text-2xl mr-3`}>🛒</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>View Cart</Text>
            <Text style={tw`text-gray-400`}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CatalogTab')}
            style={tw`flex-row items-center px-4 py-4`}
            accessibilityLabel="Browse catalog"
            accessibilityRole="button"
          >
            <Text style={tw`text-2xl mr-3`}>🔍</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Browse Catalog</Text>
            <Text style={tw`text-gray-400`}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={tw`bg-red-50 py-4 rounded-2xl`}
          accessibilityLabel="Logout"
          accessibilityRole="button"
        >
          <Text style={tw`text-red-600 text-center font-semibold text-base`}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
