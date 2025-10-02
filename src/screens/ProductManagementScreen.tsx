import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import tw from 'twrnc';
import { AdminProduct } from '../types';

export const ProductManagementScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_stock'>('all');

  const products: AdminProduct[] = [
    { id: 1, name: 'Rolex Submariner', brand: 'Rolex', price: 12500, stock: 15, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200', status: 'in_stock' as const },
    { id: 2, name: 'Omega Speedmaster', brand: 'Omega', price: 8900, stock: 3, image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=200', status: 'low_stock' as const },
    { id: 3, name: 'TAG Heuer Monaco', brand: 'TAG Heuer', price: 6500, stock: 0, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=200', status: 'out_stock' as const },
  ];

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-600' };
    if (stock <= 5) return { text: `Only ${stock} left`, color: 'bg-orange-100 text-orange-600' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-600' };
  };

  const filterButtons = [
    { label: 'All', value: 'all', count: 156 },
    { label: 'In Stock', value: 'in_stock', count: 132 },
    { label: 'Low Stock', value: 'low_stock', count: 18 },
    { label: 'Out of Stock', value: 'out_stock', count: 6 },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-4 py-4 border-b border-gray-100`}>
        <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>Product Management</Text>
        
        <TextInput
          style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900 mb-3`}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-4 px-4`}>
          <View style={tw`flex-row gap-2`}>
            {filterButtons.map((btn) => (
              <TouchableOpacity
                key={btn.value}
                onPress={() => setFilterStatus(btn.value as any)}
                style={tw`px-4 py-2 rounded-full ${filterStatus === btn.value ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                <Text style={tw`${filterStatus === btn.value ? 'text-white' : 'text-gray-700'} font-medium`}>
                  {btn.label} ({btn.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4 gap-3`}>
          {products.map((product) => {
            const badge = getStockBadge(product.stock);
            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => setSelectedProduct(product)}
                style={tw`bg-white rounded-2xl overflow-hidden`}
              >
                <View style={tw`flex-row`}>
                  <Image source={{ uri: product.image }} style={tw`w-24 h-24`} />
                  <View style={tw`flex-1 p-3`}>
                    <View style={tw`flex-row items-start justify-between mb-1`}>
                      <View style={tw`flex-1 mr-2`}>
                        <Text style={tw`font-bold text-gray-900 text-base`} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <Text style={tw`text-gray-600 text-sm`}>{product.brand}</Text>
                      </View>
                      <Text style={tw`font-bold text-gray-900`}>${product.price.toLocaleString()}</Text>
                    </View>
                    <View style={tw`flex-row items-center justify-between mt-2`}>
                      <View style={tw`px-3 py-1 rounded-full ${badge.color}`}>
                        <Text style={tw`text-xs font-semibold`}>{badge.text}</Text>
                      </View>
                      <View style={tw`flex-row gap-2`}>
                        <TouchableOpacity style={tw`bg-blue-50 rounded-full px-3 py-1`}>
                          <Text style={tw`text-blue-600 font-semibold text-sm`}>✏️ Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tw`bg-red-50 rounded-full px-3 py-1`}>
                          <Text style={tw`text-red-600 font-semibold text-sm`}>🗑️ Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        style={tw`absolute bottom-6 right-6 bg-gray-900 rounded-full w-16 h-16 items-center justify-center`}
        activeOpacity={0.8}
      >
        <Text style={tw`text-white text-3xl`}>+</Text>
      </TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10`}>
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>Add New Product</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={tw`text-gray-600 text-2xl`}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={tw`max-h-96`}>
              <View style={tw`gap-4`}>
                <View>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Product Name</Text>
                  <TextInput style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900`} placeholder="Enter product name" />
                </View>
                <View>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Brand</Text>
                  <TextInput style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900`} placeholder="Enter brand" />
                </View>
                <View style={tw`flex-row gap-3`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Price ($)</Text>
                    <TextInput style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900`} placeholder="0" keyboardType="numeric" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-700 font-medium mb-2`}>Stock</Text>
                    <TextInput style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900`} placeholder="0" keyboardType="numeric" />
                  </View>
                </View>
                <View>
                  <Text style={tw`text-gray-700 font-medium mb-2`}>Image URL</Text>
                  <TextInput style={tw`bg-gray-100 rounded-xl px-4 py-3 text-gray-900`} placeholder="https://..." />
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity style={tw`bg-gray-900 rounded-full py-4 mt-6`}>
              <Text style={tw`text-white text-center font-bold text-base`}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
