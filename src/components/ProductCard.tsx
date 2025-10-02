import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigation = useNavigation<any>();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <TouchableOpacity
      style={tw`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-4`}
      onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
      accessibilityLabel={`View ${product.name} by ${product.brand}`}
      accessibilityRole="button"
    >
      <View style={tw`aspect-square bg-gray-100`}>
        <Image
          source={{ uri: product.images[0] }}
          style={tw`w-full h-full`}
          resizeMode="cover"
          accessibilityLabel={product.name}
        />
        {product.isBestSeller && (
          <View style={tw`absolute top-2 right-2 bg-yellow-600 px-2 py-1 rounded`}>
            <Text style={tw`text-white text-xs font-bold`}>Best Seller</Text>
          </View>
        )}
        {product.originalPrice && (
          <View style={tw`absolute top-2 left-2 bg-red-600 px-2 py-1 rounded`}>
            <Text style={tw`text-white text-xs font-bold`}>Sale</Text>
          </View>
        )}
      </View>

      <View style={tw`p-4`}>
        <Text style={tw`text-gray-500 text-xs uppercase tracking-wide mb-1`}>
          {product.brand}
        </Text>
        <Text 
          style={tw`text-gray-900 font-semibold text-base mb-2`}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View style={tw`flex-row items-center gap-2 mb-2`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-yellow-500 text-sm`}>★</Text>
            <Text style={tw`text-gray-600 text-sm ml-1`}>
              {product.rating} ({product.reviewCount})
            </Text>
          </View>
        </View>

        <View style={tw`flex-row items-center gap-2`}>
          {product.originalPrice && (
            <Text style={tw`text-gray-400 line-through text-sm`}>
              {formatPrice(product.originalPrice)}
            </Text>
          )}
          <Text style={tw`text-gray-900 font-bold text-lg`}>
            {formatPrice(product.price)}
          </Text>
        </View>

        {product.stock < 5 && product.stock > 0 && (
          <Text style={tw`text-orange-600 text-xs mt-2`}>
            Only {product.stock} left in stock
          </Text>
        )}
        {product.stock === 0 && (
          <Text style={tw`text-red-600 text-xs mt-2`}>Out of stock</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
