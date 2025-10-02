import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useAuth } from '../hooks/useAuth';

export const AdminSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const adminMenuItems = [
    { icon: '⊞', label: 'Manage Products', route: 'ProductManagement' },
    { icon: '◇', label: 'Manage Stores', route: 'StoreManagement' },
    { icon: '◎', label: 'Support Tickets', route: 'SupportManagement' },
    { icon: '▤', label: 'Analytics', route: 'Analytics' },
  ];

  const settingsItems = [
    { icon: '◉', label: 'Edit Profile', action: () => navigation.navigate('EditProfile') },
    { icon: '◈', label: 'Notifications', action: () => Alert.alert('Notifications', 'Notification settings') },
    { icon: '◆', label: 'Security', action: () => Alert.alert('Security', 'Security settings') },
    { icon: '◐', label: 'Language', action: () => Alert.alert('Language', 'EN - English') },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-gray-900 pt-8 pb-12 px-6 items-center`}>
        <View style={tw`w-20 h-20 bg-gray-700 rounded-full items-center justify-center mb-3`}>
          <Text style={tw`text-4xl text-gray-300`}>◉</Text>
        </View>
        <Text style={tw`text-white text-xl font-bold mb-1`}>{user?.name || 'Admin'}</Text>
        <Text style={tw`text-gray-300 text-sm mb-2`}>{user?.email || ''}</Text>
        <View style={tw`bg-white bg-opacity-20 px-3 py-1 rounded-full`}>
          <Text style={tw`text-white text-xs font-semibold uppercase`}>◆ Administrator</Text>
        </View>
      </View>

      <View style={tw`px-4 py-6`}>
        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>Quick Access</Text>
        <View style={tw`bg-white rounded-2xl overflow-hidden mb-6`}>
          {adminMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.route)}
              style={tw`flex-row items-center px-4 py-4 ${index !== adminMenuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <Text style={tw`text-xl text-gray-700 mr-3`}>{item.icon}</Text>
              <Text style={tw`text-gray-900 font-medium flex-1`}>{item.label}</Text>
              <Text style={tw`text-gray-400`}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>Settings</Text>
        <View style={tw`bg-white rounded-2xl overflow-hidden mb-6`}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.action}
              style={tw`flex-row items-center px-4 py-4 ${index !== settingsItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <Text style={tw`text-xl text-gray-700 mr-3`}>{item.icon}</Text>
              <Text style={tw`text-gray-900 font-medium flex-1`}>{item.label}</Text>
              <Text style={tw`text-gray-400`}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={tw`bg-red-500 py-4 rounded-2xl`}
        >
          <Text style={tw`text-white text-center font-bold text-base`}>Logout</Text>
        </TouchableOpacity>

        <Text style={tw`text-gray-500 text-center text-xs mt-6`}>
          Admin Panel v1.0 • Timeless Watch Shop
        </Text>
      </View>
    </ScrollView>
  );
};
