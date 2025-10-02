import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const navigation = useNavigation<any>();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price * 23000);
  };

  const calculateDiscount = () => {
    if (product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          tw`bg-white rounded-lg overflow-hidden`,
          Platform.select({
            ios: { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' },
            android: { elevation: 2 },
            web: { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' },
          }),
        ]}
        onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
        activeOpacity={0.7}
      >
        <View style={tw`aspect-square bg-gray-100 relative`}>
          <Image
            source={{ uri: product.images[0] }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
          {product.originalPrice && calculateDiscount() > 0 && (
            <View style={tw`absolute top-1 left-1 bg-[#ee4d2d] px-1.5 py-0.5`}>
              <Text style={tw`text-white text-xs font-bold`}>-{calculateDiscount()}%</Text>
            </View>
          )}
        </View>
        <View style={tw`p-2`}>
          <Text style={tw`text-[#ee4d2d] font-bold text-sm`}>
            {formatPrice(product.price)}
          </Text>
          {product.originalPrice && (
            <Text style={tw`text-gray-400 line-through text-xs`}>
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        tw`bg-white rounded-lg overflow-hidden`,
        Platform.select({
          ios: { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
          android: { elevation: 2 },
          web: { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
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
        {product.originalPrice && calculateDiscount() > 0 && (
          <View style={tw`absolute top-2 left-2 bg-[#ee4d2d] px-2 py-1`}>
            <Text style={tw`text-white text-xs font-bold`}>Giảm {calculateDiscount()}%</Text>
          </View>
        )}
        {product.isBestSeller && (
          <View style={tw`absolute top-2 right-2 bg-yellow-500 px-2 py-1`}>
            <Text style={tw`text-white text-xs font-bold`}>Bán chạy</Text>
          </View>
        )}
      </View>

      <View style={tw`p-2.5`}>
        <Text 
          style={tw`text-gray-900 text-sm mb-1.5`}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View style={tw`flex-row items-center justify-between mb-1.5`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-yellow-500 text-xs`}>★</Text>
            <Text style={tw`text-gray-600 text-xs ml-0.5`}>{product.rating}</Text>
          </View>
          <Text style={tw`text-gray-500 text-xs`}>Đã bán {product.reviewCount}</Text>
        </View>

        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-[#ee4d2d] font-bold text-base`}>
            {formatPrice(product.price)}
          </Text>
          {product.originalPrice && (
            <Text style={tw`text-gray-400 line-through text-xs`}>
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </View>

        {product.stock < 5 && product.stock > 0 && (
          <View style={tw`mt-1.5 bg-orange-50 px-2 py-1 rounded`}>
            <Text style={tw`text-orange-600 text-xs`}>Chỉ còn {product.stock} sản phẩm</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
