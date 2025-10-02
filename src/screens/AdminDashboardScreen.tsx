import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

export const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const stats = [
    { label: 'Total Products', value: '156', icon: '⌚', color: 'bg-blue-500' },
    { label: 'Total Orders', value: '1,247', icon: '📦', color: 'bg-green-500' },
    { label: 'Total Users', value: '3,892', icon: '👥', color: 'bg-purple-500' },
    { label: 'Total Revenue', value: '$284K', icon: '💰', color: 'bg-yellow-500' },
  ];

  const recentOrders = [
    { id: '#1234', customer: 'John Doe', total: '$2,500', status: 'pending' },
    { id: '#1235', customer: 'Jane Smith', total: '$5,800', status: 'delivered' },
    { id: '#1236', customer: 'Mike Johnson', total: '$3,200', status: 'processing' },
  ];

  const quickActions = [
    { label: 'Manage Products', icon: '⌚', route: 'ProductManagement' },
    { label: 'Manage Orders', icon: '📦', route: 'OrderManagement' },
    { label: 'Manage Users', icon: '👥', route: 'UserManagement' },
    { label: 'Manage Stores', icon: '🏪', route: 'StoreManagement' },
    { label: 'Support Tickets', icon: '💬', route: 'SupportManagement' },
    { label: 'Analytics', icon: '📊', route: 'Analytics' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`px-4 py-6`}>
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>Admin Dashboard</Text>
          <Text style={tw`text-gray-600`}>Welcome back, Administrator</Text>
        </View>

        <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
          {stats.map((stat, index) => (
            <View
              key={index}
              style={tw`flex-1 min-w-[45%] ${stat.color} rounded-2xl p-4`}
            >
              <Text style={tw`text-3xl mb-2`}>{stat.icon}</Text>
              <Text style={tw`text-white text-2xl font-bold mb-1`}>{stat.value}</Text>
              <Text style={tw`text-white text-sm opacity-90`}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>
          Quick Actions
        </Text>
        <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(action.route)}
              style={tw`flex-1 min-w-[30%] bg-white rounded-2xl p-4 items-center`}
            >
              <Text style={tw`text-3xl mb-2`}>{action.icon}</Text>
              <Text style={tw`text-gray-900 text-sm font-medium text-center`}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>
          Recent Orders
        </Text>
        <View style={tw`bg-white rounded-2xl overflow-hidden`}>
          {recentOrders.map((order, index) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => navigation.navigate('OrderManagement')}
              style={tw`p-4 ${index !== recentOrders.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={tw`font-bold text-gray-900`}>{order.id}</Text>
                <Text style={tw`text-gray-900 font-semibold`}>{order.total}</Text>
              </View>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-gray-600`}>{order.customer}</Text>
                <View style={tw`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  <Text style={tw`text-xs font-semibold capitalize`}>{order.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
