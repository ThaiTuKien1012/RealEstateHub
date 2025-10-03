import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useProducts } from '../../hooks/useProducts';
import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { useQueryClient } from '@tanstack/react-query';

export const AdminProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: productsData, isLoading } = useProducts();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const products = productsData?.data || [];
  const totalProducts = (productsData as any)?.pagination?.total || 0;

  const handleDelete = async (id: number, name: string) => {
    const confirmed = (window as any).confirm(`Bạn có chắc muốn xóa "${name}"?`);
    
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const token = (global as any).localStorage?.getItem('authToken');
      
      console.log('🗑️ Deleting product:', id);
      
      await axios.delete(`${API_CONFIG.BASE_URL}/watches/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      (window as any).alert('✅ Đã xóa sản phẩm thành công!');
    } catch (error: any) {
      console.error('Delete error:', error);
      (window as any).alert('❌ Lỗi: ' + (error.response?.data?.error?.message || 'Không thể xóa sản phẩm'));
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
      <View style={tw`bg-white rounded-3xl p-5 mb-4 border border-gray-100 shadow-sm`}>
        <View style={tw`flex-row items-start`}>
          <View style={tw`relative`}>
            <Image
              source={{ uri: imageUrl }}
              style={tw`w-24 h-24 rounded-2xl`}
            />
            {item.isFeatured && (
              <View style={tw`absolute -top-2 -right-2 bg-yellow-500 rounded-full w-7 h-7 items-center justify-center`}>
                <Text style={tw`text-white text-sm font-bold`}>★</Text>
              </View>
            )}
          </View>
          
          <View style={tw`flex-1 ml-4`}>
            <Text style={tw`font-bold text-lg text-gray-900 mb-1`} numberOfLines={1}>{item.name}</Text>
            <Text style={tw`text-gray-500 text-sm mb-2`}>{item.brand}</Text>
            
            <View style={tw`flex-row items-center gap-3 mb-2`}>
              <Text style={tw`text-blue-600 font-bold text-xl`}>
                ${parseFloat(item.price).toLocaleString()}
              </Text>
              
              <View style={tw`px-2 py-1 rounded-lg ${
                stockStatus === 'out' ? 'bg-red-50' : 
                stockStatus === 'low' ? 'bg-orange-50' : 'bg-green-50'
              }`}>
                <Text style={tw`text-xs font-semibold ${
                  stockStatus === 'out' ? 'text-red-600' : 
                  stockStatus === 'low' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {stockStatus === 'out' ? 'Hết hàng' : 
                   stockStatus === 'low' ? `Còn ${item.stock}` : `${item.stock} sản phẩm`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={tw`flex-row gap-3 mt-4 pt-4 border-t border-gray-100`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProduct', { product: item })}
            style={tw`flex-1 bg-blue-500 py-3.5 rounded-xl flex-row items-center justify-center gap-2`}
            disabled={isDeleting}
          >
            <Text style={tw`text-white text-center font-semibold text-base`}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.name)}
            style={tw`flex-1 ${isDeleting ? 'bg-gray-300' : 'bg-red-500'} py-3.5 rounded-xl flex-row items-center justify-center gap-2`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={tw`text-white text-center font-semibold text-base`}>Xóa</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`bg-white px-4 pt-12 pb-4 border-b border-gray-200`}>
        <Text style={tw`text-3xl font-bold text-gray-900 tracking-wide mb-1`}>Sản phẩm</Text>
        <Text style={tw`text-sm text-gray-500`}>{totalProducts} sản phẩm</Text>
      </View>

      <View style={tw`px-4 py-4 bg-white border-b border-gray-200`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct')}
          style={tw`bg-gray-900 py-4 rounded-xl`}
        >
          <View style={tw`flex-row items-center justify-center gap-2`}>
            <Text style={tw`text-white text-xl`}>+</Text>
            <Text style={tw`text-white text-center font-semibold text-base`}>
              Thêm sản phẩm mới
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-gray-500`}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={tw`px-6 pb-6`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
