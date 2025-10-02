import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Product } from '../types';
import { useWishlist } from '../hooks/useWishlist';
import { useComparison } from '../hooks/useComparison';

interface ProductCardProps {
  product: Product;
  onQuickView?: (productId: string) => void;
  showCompare?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, showCompare }) => {
  const navigation = useNavigation<any>();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const { addItem: addToCompare, removeItem: removeFromCompare, isInComparison, items: compareItems } = useComparison();
  const inComparison = isInComparison(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = () => {
    if (product.stock <= 0) {
      return { label: '⭕ Out of Stock', color: 'bg-red-600', textColor: 'text-white' };
    } else if (product.stock <= 5) {
      return { label: `⚠️ Only ${product.stock} Left`, color: 'bg-orange-500', textColor: 'text-white' };
    } else {
      return { label: '✓ In Stock', color: 'bg-green-600', textColor: 'text-white' };
    }
  };

  const stockStatus = getStockStatus();

  const handleWishlistToggle = (e: any) => {
    e.stopPropagation();
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const handleCompareToggle = () => {
    if (inComparison) {
      removeFromCompare(product.id);
    } else {
      if (compareItems.length < 3) {
        addToCompare(product);
      }
    }
  };

  return (
    <View
      style={[
        tw`bg-white rounded-2xl overflow-hidden`,
        Platform.select({
          ios: {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          android: { elevation: 4 },
          web: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        }),
      ]}
    >
      <TouchableOpacity
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
          <TouchableOpacity
            onPress={handleWishlistToggle}
            style={tw`absolute top-3 right-3 bg-white w-9 h-9 rounded-full items-center justify-center`}
          >
            <Text style={tw`text-xl`}>{inWishlist ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          {product.isBestSeller && (
            <View style={tw`absolute top-3 left-3 bg-yellow-600 px-2.5 py-1.5 rounded-full`}>
              <Text style={tw`text-white text-xs font-bold`}>★ Best</Text>
            </View>
          )}
          {product.originalPrice && (
            <View style={tw`absolute bottom-3 left-3 bg-red-500 px-2.5 py-1.5 rounded-full`}>
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

          <View style={tw`flex-row items-center gap-2 mb-2`}>
            {product.originalPrice && (
              <Text style={tw`text-gray-400 line-through text-xs`}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
            <Text style={tw`text-gray-900 font-bold text-base`}>
              {formatPrice(product.price)}
            </Text>
          </View>

          <View style={[tw`px-2 py-1 rounded-full self-start`, tw`${stockStatus.color}`]}>
            <Text style={[tw`text-xs font-bold`, tw`${stockStatus.textColor}`]}>
              {stockStatus.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={tw`mx-3.5 mb-3.5 gap-2`}>
        {onQuickView && (
          <TouchableOpacity
            onPress={() => onQuickView(product.id)}
            style={tw`bg-gray-900 py-2.5 rounded-xl items-center justify-center`}
            accessibilityLabel="Quick view"
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-xs font-bold`}>👁 Quick View</Text>
          </TouchableOpacity>
        )}
        
        {showCompare && (
          <TouchableOpacity
            onPress={handleCompareToggle}
            style={[
              tw`py-2.5 rounded-xl items-center justify-center border-2`,
              inComparison ? tw`bg-yellow-600 border-yellow-600` : tw`bg-white border-gray-300`,
            ]}
            accessibilityLabel={inComparison ? "Remove from comparison" : "Add to comparison"}
            accessibilityRole="button"
            disabled={!inComparison && compareItems.length >= 3}
          >
            <Text style={[
              tw`text-xs font-bold`,
              inComparison ? tw`text-white` : tw`text-gray-700`,
            ]}>
              {inComparison ? '✓ Compare' : '⊞ Compare'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
