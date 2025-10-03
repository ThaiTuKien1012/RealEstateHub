import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useProducts } from '../../hooks/useProducts';
import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { useQueryClient } from '@tanstack/react-query';

declare const window: any;

export const AdminProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: productsData, isLoading } = useProducts();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const products = productsData?.data || [];
  const totalProducts = (productsData as any)?.pagination?.total || 0;

  const handleDelete = async (id: number, name: string) => {
    if (Platform.OS !== 'web') return;
    
    const confirmed = window.confirm(`Bạn có chắc muốn xóa "${name}"?`);
    
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const token = (global as any).localStorage?.getItem('authToken');
      
      console.log('🗑️ Deleting product:', id);
      
      await axios.delete(`${API_CONFIG.BASE_URL}/watches/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      window.alert('✅ Đã xóa sản phẩm thành công!');
    } catch (error: any) {
      console.error('Delete error:', error);
      window.alert('❌ Lỗi: ' + (error.response?.data?.error?.message || 'Không thể xóa sản phẩm'));
    } finally {
      setDeletingId(null);
    }
  };

  const renderProduct = ({ item }: any) => {
    const imageUrl = Array.isArray(item.images) && item.images.length > 0 
      ? item.images[0] 
      : 'https://via.placeholder.com/150';

    const isDeleting = deletingId === item.id;
    const stockStatus = item.stock === 0 ? 'out' : item.stock < 10 ? 'low' : 'in';

    return (
      <View style={tw`bg-white rounded-2xl p-3.5 mb-3 border border-gray-200`}>
        <View style={tw`flex-row items-start mb-2.5`}>
          <View style={tw`relative`}>
            <Image
              source={{ uri: imageUrl }}
              style={tw`w-20 h-20 rounded-xl bg-gray-100`}
            />
            {item.isFeatured && (
              <View style={tw`absolute top-2 left-2 bg-yellow-600 px-2 py-1 rounded-full`}>
                <Text style={tw`text-white text-xs font-bold`}>★</Text>
              </View>
            )}
          </View>
          
          <View style={tw`flex-1 ml-3`}>
            <Text style={tw`text-gray-500 text-xs uppercase tracking-wider mb-1`}>{item.brand}</Text>
            <Text style={tw`text-gray-900 font-semibold text-sm mb-2`} numberOfLines={2}>{item.name}</Text>
            
            <Text style={tw`text-gray-900 font-bold text-base mb-2`}>
              ${parseFloat(item.price).toLocaleString()}
            </Text>
            
            <View style={tw`px-2 py-1 rounded-full self-start ${
              stockStatus === 'out' ? 'bg-red-600' : 
              stockStatus === 'low' ? 'bg-orange-500' : 'bg-green-600'
            }`}>
              <Text style={tw`text-white text-xs font-bold`}>
                {stockStatus === 'out' ? '⭕ Hết hàng' : 
                 stockStatus === 'low' ? `⚠️ Còn ${item.stock}` : `✓ Còn hàng`}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProduct', { product: item })}
            style={tw`flex-1 bg-gray-900 py-2.5 rounded-xl`}
            disabled={isDeleting}
          >
            <Text style={tw`text-white text-center font-bold text-xs`}>✏ Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.name)}
            style={tw`flex-1 ${isDeleting ? 'bg-gray-400' : 'bg-gray-900'} py-2.5 rounded-xl`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={tw`text-white text-center font-bold text-xs`}>🗑 Xóa</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`bg-white px-4 pt-12 pb-3`}>
        <Text style={tw`text-3xl font-bold text-gray-900`}>Sản phẩm</Text>
        <Text style={tw`text-xs text-gray-500 mt-1`}>{totalProducts} sản phẩm</Text>
      </View>

      <View style={tw`bg-white px-4 pb-4 border-b border-gray-200`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct')}
          style={tw`bg-gray-900 py-3 rounded-xl`}
        >
          <View style={tw`flex-row items-center justify-center gap-2`}>
            <Text style={tw`text-white text-lg`}>+</Text>
            <Text style={tw`text-white text-center font-medium text-sm`}>
              Thêm sản phẩm mới
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-gray-500 text-sm`}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={tw`px-4 pt-4 pb-4`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
