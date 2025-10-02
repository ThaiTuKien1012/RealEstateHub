import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

export const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { items, removeItem, clearWishlist } = useWishlist();
  const addToCart = useCart(state => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    removeItem(product.id);
  };

  if (items.length === 0) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <Text style={tw`text-6xl mb-6`}>❤️</Text>
        <Text style={tw`text-2xl font-bold mb-2`}>No Favorites Yet</Text>
        <Text style={tw`text-gray-600 mb-8 text-center`}>
          Start adding watches you love to your wishlist
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CatalogTab')}
          style={tw`bg-yellow-600 py-3.5 px-12 rounded-xl`}
          accessibilityLabel="Browse catalog"
          accessibilityRole="button"
        >
          <Text style={tw`text-white font-semibold text-base`}>Browse Catalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-4 py-4 border-b border-gray-200 flex-row justify-between items-center`}>
        <Text style={tw`text-xl font-bold`}>My Wishlist ({items.length})</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearWishlist}>
            <Text style={tw`text-red-600 font-medium`}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        contentContainerStyle={tw`px-4 pt-4 pb-6`}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              tw`bg-white rounded-2xl mb-3 overflow-hidden`,
              Platform.select({
                ios: { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
                android: { elevation: 2 },
                web: { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
              }),
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
              style={tw`flex-row`}
            >
              <Image
                source={{ uri: item.images[0] }}
                style={tw`w-28 h-28`}
                resizeMode="cover"
              />
              
              <View style={tw`flex-1 p-3 justify-between`}>
                <View>
                  <Text style={tw`text-gray-500 text-xs uppercase tracking-wider mb-1`}>
                    {item.brand}
                  </Text>
                  <Text style={tw`font-semibold text-base mb-1`} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={tw`text-yellow-600 font-bold text-lg`}>
                    {formatPrice(item.price)}
                  </Text>
                </View>

                <View style={tw`flex-row gap-2 mt-2`}>
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    style={tw`flex-1 bg-yellow-600 py-2.5 rounded-xl`}
                    accessibilityLabel="Add to cart"
                  >
                    <Text style={tw`text-white font-semibold text-center text-sm`}>
                      Add to Cart
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={tw`bg-gray-100 px-4 py-2.5 rounded-xl`}
                    accessibilityLabel="Remove from wishlist"
                  >
                    <Text style={tw`text-gray-600 font-semibold text-sm`}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
