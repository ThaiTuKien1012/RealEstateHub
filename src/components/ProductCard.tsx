import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
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
      style={[
        tw`bg-white rounded-2xl overflow-hidden`,
        Platform.select({
          ios: tw`shadow-lg`,
          android: { elevation: 4 },
          web: tw`shadow-md`,
        }),
      ]}
      onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
      accessibilityLabel={`View ${product.name} by ${product.brand}`}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <View style={tw`aspect-square bg-gray-100 relative`}>
        <Image
          source={{ uri: product.images[0] }}
          style={tw`w-full h-full`}
          resizeMode="cover"
          accessibilityLabel={product.name}
        />
        {product.isBestSeller && (
          <View style={tw`absolute top-3 right-3 bg-yellow-600 px-2.5 py-1.5 rounded-full`}>
            <Text style={tw`text-white text-xs font-bold`}>★ Best</Text>
          </View>
        )}
        {product.originalPrice && (
          <View style={tw`absolute top-3 left-3 bg-red-500 px-2.5 py-1.5 rounded-full`}>
            <Text style={tw`text-white text-xs font-bold`}>Sale</Text>
          </View>
        )}
      </View>

      <View style={tw`p-3.5`}>
        <Text style={tw`text-gray-500 text-xs uppercase tracking-wider mb-1`}>
          {product.brand}
        </Text>
        <Text 
          style={tw`text-gray-900 font-semibold text-sm mb-2.5`}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`text-yellow-500 text-base`}>★</Text>
          <Text style={tw`text-gray-600 text-xs ml-1`}>
            {product.rating} • {product.reviewCount} reviews
          </Text>
        </View>

        <View style={tw`flex-row items-center gap-2`}>
          {product.originalPrice && (
            <Text style={tw`text-gray-400 line-through text-xs`}>
              {formatPrice(product.originalPrice)}
            </Text>
          )}
          <Text style={tw`text-gray-900 font-bold text-base`}>
            {formatPrice(product.price)}
          </Text>
        </View>

        {product.stock < 5 && product.stock > 0 && (
          <Text style={tw`text-orange-600 text-xs mt-2`}>
            Only {product.stock} left
          </Text>
        )}
        {product.stock === 0 && (
          <Text style={tw`text-red-600 text-xs mt-2 font-medium`}>Out of stock</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
