import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

export const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState([
    { label: 'Total Products', value: '0', icon: '▣', color: 'bg-blue-500' },
    { label: 'Total Orders', value: '0', icon: '◈', color: 'bg-green-500' },
    { label: 'Total Users', value: '0', icon: '◎', color: 'bg-purple-500' },
    { label: 'Total Revenue', value: '$0', icon: '$', color: 'bg-yellow-500' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = (global as any).localStorage?.getItem('authToken');
      
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get(`${API_CONFIG.BASE_URL}/watches`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_CONFIG.BASE_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_CONFIG.BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const totalProducts = (productsRes.data as any)?.pagination?.total || 0;
      const totalOrders = ordersRes.data?.data?.length || 0;
      const totalUsers = usersRes.data?.data?.length || 0;
      
      const totalRevenue = ordersRes.data?.data?.reduce((sum: number, order: any) => 
        sum + parseFloat(order.total || 0), 0
      ) || 0;

      setStats([
        { label: 'Total Products', value: totalProducts.toString(), icon: '▣', color: 'bg-blue-500' },
        { label: 'Total Orders', value: totalOrders.toLocaleString(), icon: '◈', color: 'bg-green-500' },
        { label: 'Total Users', value: totalUsers.toLocaleString(), icon: '◎', color: 'bg-purple-500' },
        { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: '$', color: 'bg-yellow-500' },
      ]);
    } catch (error) {
      console.error('Fetch dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const token = (global as any).localStorage?.getItem('authToken');
      const response = await axios.get(`${API_CONFIG.BASE_URL}/orders?limit=3`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRecentOrders(response.data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Fetch recent orders error:', error);
    }
  };

  const quickActions = [
    { label: 'Manage Products', icon: '▣', route: 'ProductManagement' },
    { label: 'Manage Orders', icon: '◈', route: 'OrderManagement' },
    { label: 'Manage Users', icon: '◎', route: 'UserManagement' },
    { label: 'Manage Stores', icon: '◇', route: 'StoreManagement' },
    { label: 'Support Tickets', icon: '◐', route: 'SupportManagement' },
    { label: 'Analytics', icon: '■', route: 'Analytics' },
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
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`bg-white px-4 pt-12 pb-4 border-b border-gray-200`}>
        <Text style={tw`text-3xl font-bold text-gray-900 tracking-wide mb-1`}>Dashboard</Text>
        <Text style={tw`text-sm text-gray-500`}>Chào mừng, Administrator</Text>
      </View>

      <View style={tw`px-4 py-6 bg-gray-50`}>
        <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
          {stats.map((stat, index) => (
            <View
              key={index}
              style={tw`flex-1 min-w-[45%] ${stat.color} rounded-2xl p-4`}
            >
              <Text style={tw`text-white text-3xl mb-2`}>{stat.icon}</Text>
              <Text style={tw`text-white text-2xl font-bold mb-1`}>{stat.value}</Text>
              <Text style={tw`text-white text-sm opacity-90`}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-1`}>
          Thao tác nhanh
        </Text>
        <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(action.route)}
              style={tw`flex-1 min-w-[30%] bg-white rounded-2xl p-4 items-center border border-gray-200`}
            >
              <Text style={tw`text-2xl mb-2`}>{action.icon}</Text>
              <Text style={tw`text-gray-900 text-xs font-medium text-center`}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>
          Recent Orders
        </Text>
        <View style={tw`bg-white rounded-2xl overflow-hidden`}>
          {recentOrders.length > 0 ? (
            recentOrders.map((order, index) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => navigation.navigate('OrderManagement')}
                style={tw`p-4 ${index !== recentOrders.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View style={tw`flex-row items-center justify-between mb-2`}>
                  <Text style={tw`font-bold text-gray-900`}>#{order.id}</Text>
                  <Text style={tw`text-gray-900 font-semibold`}>${parseFloat(order.total).toLocaleString()}</Text>
                </View>
                <View style={tw`flex-row items-center justify-between`}>
                  <Text style={tw`text-gray-600`}>{order.userId}</Text>
                  <View style={tw`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    <Text style={tw`text-xs font-semibold capitalize`}>{order.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={tw`p-4`}>
              <Text style={tw`text-gray-500 text-center`}>No recent orders</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
