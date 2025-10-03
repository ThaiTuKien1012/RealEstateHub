import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Image, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { AdminUser } from '../types';

export const UserManagementScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [filterRole, setFilterRole] = useState<'all' | 'customer' | 'admin' | 'vendor'>('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = (global as any).localStorage?.getItem('authToken');
      const response = await axios.get(`${API_CONFIG.BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const apiUsers = response.data.data.map((u: any) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role || 'customer',
          orders: 0,
          spent: 0,
          joined: new Date(u.createdAt).toISOString().split('T')[0],
          avatar: `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=3B82F6&color=fff`
        }));
        setUsers(apiUsers);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      customer: { text: 'Customer', color: 'bg-blue-100 text-blue-600' },
      admin: { text: 'Admin', color: 'bg-purple-100 text-purple-600' },
      vendor: { text: 'Vendor', color: 'bg-green-100 text-green-600' },
    };
    return badges[role as keyof typeof badges] || badges.customer;
  };

  const roleFilters = [
    { label: 'All Users', value: 'all', count: 3892 },
    { label: 'Customers', value: 'customer', count: 3756 },
    { label: 'Admins', value: 'admin', count: 12 },
    { label: 'Vendors', value: 'vendor', count: 124 },
  ];

  const userActions = [
    { label: 'View Orders', icon: '📦', color: 'bg-blue-500' },
    { label: 'Send Email', icon: '✉️', color: 'bg-purple-500' },
    { label: 'Edit User', icon: '✏️', color: 'bg-green-500' },
    { label: 'Suspend Account', icon: '🚫', color: 'bg-red-500' },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-4 py-4 border-b border-gray-100`}>
        <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>User Management</Text>
        
        <TextInput
          style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 mb-3`}
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-4 px-4`}>
          <View style={tw`flex-row gap-2`}>
            {roleFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setFilterRole(filter.value as any)}
                style={tw`px-4 py-2 rounded-full ${filterRole === filter.value ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                <Text style={tw`${filterRole === filter.value ? 'text-white' : 'text-gray-700'} font-medium`}>
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4 gap-3`}>
          {users.map((user) => {
            const badge = getRoleBadge(user.role);
            return (
              <TouchableOpacity
                key={user.id}
                onPress={() => setSelectedUser(user)}
                style={tw`bg-white rounded-2xl p-4`}
              >
                <View style={tw`flex-row items-center mb-3`}>
                  <Image source={{ uri: user.avatar }} style={tw`w-12 h-12 rounded-full mr-3`} />
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row items-center gap-2 mb-1`}>
                      <Text style={tw`font-bold text-gray-900 text-base`}>{user.name}</Text>
                      <View style={tw`px-2 py-0.5 rounded-full ${badge.color}`}>
                        <Text style={tw`text-xs font-semibold`}>{badge.text}</Text>
                      </View>
                    </View>
                    <Text style={tw`text-gray-600 text-sm`}>{user.email}</Text>
                  </View>
                </View>
                <View style={tw`flex-row items-center justify-between pt-3 border-t border-gray-100`}>
                  <View>
                    <Text style={tw`text-gray-500 text-xs mb-1`}>Joined {user.joined}</Text>
                    {user.role === 'customer' && (
                      <Text style={tw`text-gray-900 font-semibold text-sm`}>
                        {user.orders} orders • ${user.spent.toLocaleString()}
                      </Text>
                    )}
                  </View>
                  <Text style={tw`text-blue-600 font-semibold text-sm`}>Manage →</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={selectedUser !== null} animationType="slide" transparent>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10`}>
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>User Details</Text>
              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Text style={tw`text-gray-600 text-2xl`}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`max-h-96`}>
              <View style={tw`items-center mb-6`}>
                <Image source={{ uri: selectedUser?.avatar }} style={tw`w-20 h-20 rounded-full mb-3`} />
                <Text style={tw`text-gray-900 font-bold text-lg`}>{selectedUser?.name}</Text>
                <Text style={tw`text-gray-600 text-sm mb-2`}>{selectedUser?.email}</Text>
                <View style={tw`px-3 py-1 rounded-full ${getRoleBadge(selectedUser?.role || 'customer').color}`}>
                  <Text style={tw`text-xs font-semibold`}>{getRoleBadge(selectedUser?.role || 'customer').text}</Text>
                </View>
              </View>

              {selectedUser?.role === 'customer' && (
                <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text style={tw`text-gray-600`}>Total Orders</Text>
                    <Text style={tw`text-gray-900 font-semibold`}>{selectedUser?.orders}</Text>
                  </View>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text style={tw`text-gray-600`}>Total Spent</Text>
                    <Text style={tw`text-gray-900 font-semibold`}>${selectedUser?.spent.toLocaleString()}</Text>
                  </View>
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`text-gray-600`}>Joined</Text>
                    <Text style={tw`text-gray-900 font-semibold`}>{selectedUser?.joined}</Text>
                  </View>
                </View>
              )}

              <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3`}>Actions</Text>
              <View style={tw`gap-2`}>
                {userActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={tw`${action.color} rounded-xl py-3 px-4 flex-row items-center`}
                  >
                    <Text style={tw`text-white text-xl mr-3`}>{action.icon}</Text>
                    <Text style={tw`text-white font-semibold flex-1`}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
