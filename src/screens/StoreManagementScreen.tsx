import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import tw from 'twrnc';
import { AdminStore } from '../types';

export const StoreManagementScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<AdminStore | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

  const stores: AdminStore[] = [
    { id: 1, name: 'Luxury Time Hub', owner: 'Mike Johnson', products: 45, sales: 128500, status: 'active' as const, rating: 4.8, logo: 'https://ui-avatars.com/api/?name=LTH&background=3B82F6&color=fff' },
    { id: 2, name: 'Swiss Watch Co.', owner: 'Anna Brown', products: 32, sales: 95200, status: 'active' as const, rating: 4.6, logo: 'https://ui-avatars.com/api/?name=SWC&background=10B981&color=fff' },
    { id: 3, name: 'Premium Timepieces', owner: 'David Lee', products: 18, sales: 0, status: 'pending' as const, rating: 0, logo: 'https://ui-avatars.com/api/?name=PT&background=F59E0B&color=fff' },
    { id: 4, name: 'Classic Watch Store', owner: 'Emma Davis', products: 27, sales: 42300, status: 'suspended' as const, rating: 3.9, logo: 'https://ui-avatars.com/api/?name=CWS&background=EF4444&color=fff' },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { text: 'Active', color: 'bg-green-100 text-green-600' },
      pending: { text: 'Pending', color: 'bg-orange-100 text-orange-600' },
      suspended: { text: 'Suspended', color: 'bg-red-100 text-red-600' },
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const statusFilters = [
    { label: 'All Stores', value: 'all', count: 124 },
    { label: 'Active', value: 'active', count: 98 },
    { label: 'Pending', value: 'pending', count: 18 },
    { label: 'Suspended', value: 'suspended', count: 8 },
  ];

  const storeActions = [
    { label: 'View Products', icon: '⌚', color: 'bg-blue-500' },
    { label: 'View Analytics', icon: '📊', color: 'bg-purple-500' },
    { label: 'Approve Store', icon: '✅', color: 'bg-green-500' },
    { label: 'Suspend Store', icon: '🚫', color: 'bg-red-500' },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-4 py-4 border-b border-gray-100`}>
        <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>Store Management</Text>
        
        <TextInput
          style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 mb-3`}
          placeholder="Search stores or vendors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-4 px-4`}>
          <View style={tw`flex-row gap-2`}>
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setFilterStatus(filter.value as any)}
                style={tw`px-4 py-2 rounded-full ${filterStatus === filter.value ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                <Text style={tw`${filterStatus === filter.value ? 'text-white' : 'text-gray-700'} font-medium`}>
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4 gap-3`}>
          {stores.map((store) => {
            const badge = getStatusBadge(store.status);
            return (
              <TouchableOpacity
                key={store.id}
                onPress={() => setSelectedStore(store)}
                style={tw`bg-white rounded-2xl p-4`}
              >
                <View style={tw`flex-row items-start mb-3`}>
                  <Image source={{ uri: store.logo }} style={tw`w-14 h-14 rounded-xl mr-3`} />
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row items-center gap-2 mb-1`}>
                      <Text style={tw`font-bold text-gray-900 text-base flex-1`} numberOfLines={1}>
                        {store.name}
                      </Text>
                      <View style={tw`px-2 py-0.5 rounded-full ${badge.color}`}>
                        <Text style={tw`text-xs font-semibold`}>{badge.text}</Text>
                      </View>
                    </View>
                    <Text style={tw`text-gray-600 text-sm mb-1`}>👤 {store.owner}</Text>
                    {store.status === 'active' && (
                      <Text style={tw`text-gray-900 font-semibold text-sm`}>
                        ⭐ {store.rating} • {store.products} products
                      </Text>
                    )}
                  </View>
                </View>
                <View style={tw`flex-row items-center justify-between pt-3 border-t border-gray-100`}>
                  <View>
                    {store.status === 'active' && (
                      <Text style={tw`text-gray-900 font-semibold`}>
                        ${store.sales.toLocaleString()} total sales
                      </Text>
                    )}
                    {store.status === 'pending' && (
                      <Text style={tw`text-orange-600 font-semibold`}>Awaiting approval</Text>
                    )}
                    {store.status === 'suspended' && (
                      <Text style={tw`text-red-600 font-semibold`}>Account suspended</Text>
                    )}
                  </View>
                  <Text style={tw`text-blue-600 font-semibold text-sm`}>Manage →</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={selectedStore !== null} animationType="slide" transparent>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10`}>
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>Store Details</Text>
              <TouchableOpacity onPress={() => setSelectedStore(null)}>
                <Text style={tw`text-gray-600 text-2xl`}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`max-h-96`}>
              <View style={tw`items-center mb-6`}>
                <Image source={{ uri: selectedStore?.logo }} style={tw`w-20 h-20 rounded-2xl mb-3`} />
                <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>{selectedStore?.name}</Text>
                <Text style={tw`text-gray-600 text-sm mb-2`}>Owner: {selectedStore?.owner}</Text>
                <View style={tw`px-3 py-1 rounded-full ${getStatusBadge(selectedStore?.status || 'active').color}`}>
                  <Text style={tw`text-xs font-semibold`}>{getStatusBadge(selectedStore?.status || 'active').text}</Text>
                </View>
              </View>

              {selectedStore?.status === 'active' && (
                <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text style={tw`text-gray-600`}>Products</Text>
                    <Text style={tw`text-gray-900 font-semibold`}>{selectedStore?.products}</Text>
                  </View>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text style={tw`text-gray-600`}>Total Sales</Text>
                    <Text style={tw`text-gray-900 font-semibold`}>${selectedStore?.sales.toLocaleString()}</Text>
                  </View>
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`text-gray-600`}>Rating</Text>
                    <Text style={tw`text-gray-900 font-semibold`}>⭐ {selectedStore?.rating}</Text>
                  </View>
                </View>
              )}

              <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3`}>Actions</Text>
              <View style={tw`gap-2`}>
                {storeActions.map((action, index) => (
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
