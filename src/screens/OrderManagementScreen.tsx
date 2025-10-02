import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import tw from 'twrnc';
import { AdminOrder } from '../types';

export const OrderManagementScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  const orders: AdminOrder[] = [
    { id: '#1234', customer: 'John Doe', email: 'john@example.com', total: 2500, status: 'pending' as const, items: 2, date: '2025-10-01' },
    { id: '#1235', customer: 'Jane Smith', email: 'jane@example.com', total: 5800, status: 'delivered' as const, items: 1, date: '2025-09-28' },
    { id: '#1236', customer: 'Mike Johnson', email: 'mike@example.com', total: 3200, status: 'processing' as const, items: 3, date: '2025-10-02' },
    { id: '#1237', customer: 'Sarah Williams', email: 'sarah@example.com', total: 8900, status: 'shipped' as const, items: 1, date: '2025-09-30' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-600',
      processing: 'bg-blue-100 text-blue-600',
      shipped: 'bg-purple-100 text-purple-600',
      delivered: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const statusOptions = [
    { label: 'All Orders', value: 'all', count: 1247 },
    { label: 'Pending', value: 'pending', count: 45 },
    { label: 'Processing', value: 'processing', count: 132 },
    { label: 'Shipped', value: 'shipped', count: 89 },
    { label: 'Delivered', value: 'delivered', count: 967 },
    { label: 'Cancelled', value: 'cancelled', count: 14 },
  ];

  const updateOrderStatus = [
    { label: 'Mark as Processing', status: 'processing', color: 'bg-blue-500' },
    { label: 'Mark as Shipped', status: 'shipped', color: 'bg-purple-500' },
    { label: 'Mark as Delivered', status: 'delivered', color: 'bg-green-500' },
    { label: 'Cancel Order', status: 'cancelled', color: 'bg-red-500' },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-4 py-4 border-b border-gray-100`}>
        <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>Order Management</Text>
        
        <TextInput
          style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 mb-3`}
          placeholder="Search by order ID or customer..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-4 px-4`}>
          <View style={tw`flex-row gap-2`}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setFilterStatus(option.value as any)}
                style={tw`px-4 py-2 rounded-full ${filterStatus === option.value ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                <Text style={tw`${filterStatus === option.value ? 'text-white' : 'text-gray-700'} font-medium`}>
                  {option.label} ({option.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4 gap-3`}>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => setSelectedOrder(order)}
              style={tw`bg-white rounded-2xl p-4`}
            >
              <View style={tw`flex-row items-center justify-between mb-3`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-gray-900 text-base mb-1`}>{order.id}</Text>
                  <Text style={tw`text-gray-600 text-sm`}>{order.customer}</Text>
                  <Text style={tw`text-gray-500 text-xs`}>{order.email}</Text>
                </View>
                <View style={tw`items-end`}>
                  <Text style={tw`font-bold text-gray-900 text-lg mb-1`}>${order.total.toLocaleString()}</Text>
                  <View style={tw`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    <Text style={tw`text-xs font-semibold capitalize`}>{order.status}</Text>
                  </View>
                </View>
              </View>
              <View style={tw`flex-row items-center justify-between pt-3 border-t border-gray-100`}>
                <Text style={tw`text-gray-600 text-sm`}>
                  {order.items} item{order.items > 1 ? 's' : ''} • {order.date}
                </Text>
                <Text style={tw`text-blue-600 font-semibold text-sm`}>View Details →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={selectedOrder !== null} animationType="slide" transparent>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10`}>
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>Order {selectedOrder?.id}</Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Text style={tw`text-gray-600 text-2xl`}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`max-h-96`}>
              <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                <Text style={tw`text-gray-600 text-sm mb-1`}>Customer</Text>
                <Text style={tw`text-gray-900 font-bold text-base mb-2`}>{selectedOrder?.customer}</Text>
                <Text style={tw`text-gray-600 text-sm`}>{selectedOrder?.email}</Text>
              </View>

              <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <Text style={tw`text-gray-600`}>Order Date</Text>
                  <Text style={tw`text-gray-900 font-semibold`}>{selectedOrder?.date}</Text>
                </View>
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <Text style={tw`text-gray-600`}>Items</Text>
                  <Text style={tw`text-gray-900 font-semibold`}>{selectedOrder?.items}</Text>
                </View>
                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-gray-600`}>Total</Text>
                  <Text style={tw`text-gray-900 font-bold text-lg`}>${selectedOrder?.total.toLocaleString()}</Text>
                </View>
              </View>

              <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3`}>Update Status</Text>
              <View style={tw`gap-2`}>
                {updateOrderStatus.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={tw`${action.color} rounded-xl py-3 px-4`}
                  >
                    <Text style={tw`text-white font-semibold text-center`}>{action.label}</Text>
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
