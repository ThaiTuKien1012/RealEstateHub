import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Product } from '../types';
import { useWishlist } from '../hooks/useWishlist';
import { useComparison } from '../hooks/useComparison';

interface ProductListItemProps {
  product: Product;
  onQuickView?: (productId: string) => void;
  showCompare?: boolean;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product, onQuickView, showCompare }) => {
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
        tw`bg-white rounded-2xl overflow-hidden mb-3`,
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
        style={tw`flex-row`}
        onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
        accessibilityLabel={`View ${product.name} by ${product.brand}`}
        accessibilityRole="button"
        activeOpacity={0.7}
      >
        <View style={tw`w-32 h-32 bg-gray-100 relative`}>
          <Image
            source={{ uri: product.images[0] }}
            style={tw`w-full h-full`}
            resizeMode="cover"
            accessibilityLabel={product.name}
          />
          {product.isBestSeller && (
            <View style={tw`absolute top-2 left-2 bg-yellow-600 px-2 py-1 rounded-full`}>
              <Text style={tw`text-white text-xs font-bold`}>★</Text>
            </View>
          )}
          {product.originalPrice && (
            <View style={tw`absolute bottom-2 left-2 bg-red-500 px-2 py-1 rounded-full`}>
              <Text style={tw`text-white text-xs font-bold`}>Sale</Text>
            </View>
          )}
        </View>

        <View style={tw`flex-1 p-4 justify-between`}>
          <View>
            <Text style={tw`text-gray-500 text-xs uppercase tracking-wider mb-1`}>
              {product.brand}
            </Text>
            <Text 
              style={tw`text-gray-900 font-semibold text-base mb-2`}
              numberOfLines={2}
            >
              {product.name}
            </Text>

            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-yellow-500 text-sm`}>★</Text>
              <Text style={tw`text-gray-600 text-xs ml-1`}>
                {product.rating} • {product.reviewCount} reviews
              </Text>
            </View>

            <Text style={tw`text-gray-600 text-xs mb-2`} numberOfLines={2}>
              {product.movement} • {product.caseMaterial}
            </Text>
          </View>

          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-2`}>
              {product.originalPrice && (
                <Text style={tw`text-gray-400 line-through text-xs`}>
                  {formatPrice(product.originalPrice)}
                </Text>
              )}
              <Text style={tw`text-gray-900 font-bold text-lg`}>
                {formatPrice(product.price)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleWishlistToggle}
              style={tw`bg-gray-100 w-9 h-9 rounded-full items-center justify-center`}
            >
              <Text style={tw`text-lg`}>{inWishlist ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
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

      <View style={tw`mx-4 mb-4 gap-2 flex-row`}>
        {onQuickView && (
          <TouchableOpacity
            onPress={() => onQuickView(product.id)}
            style={tw`flex-1 bg-gray-900 py-2 rounded-lg items-center justify-center`}
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
              tw`flex-1 py-2 rounded-lg items-center justify-center border-2`,
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
