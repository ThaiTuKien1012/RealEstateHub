import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useProducts } from '../../hooks/useProducts';

export const AdminProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: productsData, isLoading } = useProducts();

  const products = productsData?.data || [];
  const totalProducts = (productsData as any)?.pagination?.total || 0;

  const renderProduct = ({ item }: any) => {
    const imageUrl = Array.isArray(item.images) && item.images.length > 0 
      ? item.images[0] 
      : 'https://via.placeholder.com/150';

    return (
      <View style={tw`bg-white rounded-2xl p-4 mb-3 flex-row`}>
        <Image
          source={{ uri: imageUrl }}
          style={tw`w-20 h-20 rounded-xl`}
        />
        <View style={tw`flex-1 ml-4`}>
          <Text style={tw`font-bold text-base`} numberOfLines={1}>{item.name}</Text>
          <Text style={tw`text-gray-600 text-sm`}>{item.brand}</Text>
          <Text style={tw`text-yellow-600 font-bold text-base mt-1`}>
            ${parseFloat(item.price).toLocaleString()}
          </Text>
          <Text style={tw`text-gray-500 text-xs mt-1`}>
            Stock: {item.stock} | {item.isFeatured ? '⭐ Featured' : ''}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-6 py-4 border-b border-gray-200`}>
        <Text style={tw`text-2xl font-bold`}>Products Management</Text>
        <Text style={tw`text-gray-600 mt-1`}>{totalProducts} products</Text>
      </View>

      <View style={tw`px-6 py-4`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct')}
          style={tw`bg-yellow-600 py-4 rounded-xl mb-4`}
        >
          <Text style={tw`text-white text-center font-bold text-lg`}>
            ➕ Add New Product
          </Text>
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
