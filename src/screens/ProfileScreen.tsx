import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Header, Footer } from '../components';
import { useAuth } from '../hooks/useAuth';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Home');
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Header />
      <ScrollView>
        <View style={tw`max-w-4xl mx-auto px-4 py-6 w-full`}>
          <Text style={tw`text-3xl font-bold mb-6`}>My Profile</Text>

          <View style={tw`bg-gray-50 rounded-lg p-6 mb-6`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Account Information</Text>
            <View style={tw`mb-3`}>
              <Text style={tw`text-gray-600 text-sm mb-1`}>Name</Text>
              <Text style={tw`text-gray-900 font-medium`}>{user?.name || 'N/A'}</Text>
            </View>
            <View style={tw`mb-3`}>
              <Text style={tw`text-gray-600 text-sm mb-1`}>Email</Text>
              <Text style={tw`text-gray-900 font-medium`}>{user?.email || 'N/A'}</Text>
            </View>
          </View>

          <View style={tw`bg-gray-50 rounded-lg p-6 mb-6`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Quick Actions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={tw`py-3 border-b border-gray-200`}
              accessibilityLabel="View cart"
              accessibilityRole="button"
            >
              <Text style={tw`text-gray-900`}>View Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Catalog')}
              style={tw`py-3 border-b border-gray-200`}
              accessibilityLabel="Browse catalog"
              accessibilityRole="button"
            >
              <Text style={tw`text-gray-900`}>Browse Catalog</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={tw`bg-red-600 py-3 rounded-lg`}
            accessibilityLabel="Logout"
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-center font-semibold text-lg`}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
};
