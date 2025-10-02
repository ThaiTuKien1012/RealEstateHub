import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useCart } from '../hooks/useCart';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <Text style={tw`text-6xl mb-6`}>🛒</Text>
        <Text style={tw`text-2xl font-bold mb-2`}>Cart Empty</Text>
        <Text style={tw`text-gray-600 mb-8 text-center`}>
          Start adding luxury watches
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CatalogTab')}
          style={tw`bg-yellow-600 py-3.5 px-12 rounded-xl`}
          accessibilityLabel="Continue shopping"
          accessibilityRole="button"
        >
          <Text style={tw`text-white font-semibold text-base`}>Browse Catalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <FlatList
        data={items}
        contentContainerStyle={tw`px-4 pt-4 pb-32`}
        keyExtractor={(item, index) => `${item.product.id}-${item.selectedVariant?.id || 'default'}-${index}`}
        renderItem={({ item }) => {
          const itemPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
          return (
            <View style={tw`bg-white rounded-2xl p-4 mb-3 flex-row`}>
              <Image
                source={{ uri: item.product.images[0] }}
                style={tw`w-20 h-20 rounded-xl`}
                resizeMode="cover"
              />
              
              <View style={tw`flex-1 ml-3`}>
                <Text style={tw`font-semibold text-base mb-0.5`} numberOfLines={1}>{item.product.name}</Text>
                <Text style={tw`text-gray-600 text-xs mb-2`}>{item.product.brand}</Text>
                {item.selectedVariant && (
                  <Text style={tw`text-gray-500 text-xs mb-2`}>
                    {item.selectedVariant.name}
                  </Text>
                )}
                
                <View style={tw`flex-row items-center justify-between mt-auto`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                      style={tw`bg-gray-100 rounded-lg w-7 h-7 items-center justify-center`}
                      accessibilityLabel="Decrease quantity"
                      accessibilityRole="button"
                    >
                      <Text style={tw`font-bold`}>-</Text>
                    </TouchableOpacity>
                    <Text style={tw`w-6 text-center font-medium`}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                      style={tw`bg-gray-100 rounded-lg w-7 h-7 items-center justify-center`}
                      accessibilityLabel="Increase quantity"
                      accessibilityRole="button"
                    >
                      <Text style={tw`font-bold`}>+</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={tw`font-bold text-base`}>
                    {formatPrice(itemPrice * item.quantity)}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => removeItem(item.product.id, item.selectedVariant?.id)}
                style={tw`ml-2`}
                accessibilityLabel="Remove from cart"
                accessibilityRole="button"
              >
                <Text style={tw`text-red-500 text-lg`}>×</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Bottom Summary - Fixed */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4`}>
        <View style={tw`flex-row justify-between mb-3`}>
          <Text style={tw`text-base`}>Subtotal</Text>
          <Text style={tw`text-base font-semibold`}>{formatPrice(getTotal())}</Text>
        </View>
        <View style={tw`flex-row justify-between mb-4`}>
          <Text style={tw`text-base`}>Shipping</Text>
          <Text style={tw`text-base font-semibold text-green-600`}>Free</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Checkout')}
          style={tw`bg-yellow-600 py-4 rounded-xl`}
          accessibilityLabel="Proceed to checkout"
          accessibilityRole="button"
        >
          <Text style={tw`text-white text-center font-bold text-base`}>
            Checkout • {formatPrice(getTotal())}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
