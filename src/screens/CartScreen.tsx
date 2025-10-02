import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Header, Footer } from '../components';
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
      <View style={tw`flex-1 bg-white`}>
        <Header />
        <View style={tw`flex-1 items-center justify-center px-4`}>
          <Text style={tw`text-2xl font-bold mb-2`}>Your cart is empty</Text>
          <Text style={tw`text-gray-600 mb-6 text-center`}>
            Start adding some amazing watches to your collection
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Catalog')}
            style={tw`bg-yellow-600 py-3 px-8 rounded-lg`}
            accessibilityLabel="Continue shopping"
            accessibilityRole="button"
          >
            <Text style={tw`text-white font-semibold`}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <Header />
      <ScrollView>
        <View style={tw`max-w-6xl mx-auto px-4 py-6 w-full`}>
          <Text style={tw`text-3xl font-bold mb-6`}>Shopping Cart</Text>

          <FlatList
            data={items}
            scrollEnabled={false}
            keyExtractor={(item, index) => `${item.product.id}-${item.selectedVariant?.id || 'default'}-${index}`}
            renderItem={({ item }) => {
              const itemPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
              return (
                <View style={tw`flex-row border-b border-gray-200 py-4`}>
                  <Image
                    source={{ uri: item.product.images[0] }}
                    style={tw`w-24 h-24 rounded`}
                    resizeMode="cover"
                  />
                  
                  <View style={tw`flex-1 ml-4`}>
                    <Text style={tw`font-semibold text-lg mb-1`}>{item.product.name}</Text>
                    <Text style={tw`text-gray-600 text-sm mb-2`}>{item.product.brand}</Text>
                    {item.selectedVariant && (
                      <Text style={tw`text-gray-600 text-sm mb-2`}>
                        Variant: {item.selectedVariant.name}
                      </Text>
                    )}
                    
                    <View style={tw`flex-row items-center justify-between mt-2`}>
                      <View style={tw`flex-row items-center gap-2`}>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                          style={tw`border border-gray-300 rounded w-8 h-8 items-center justify-center`}
                          accessibilityLabel="Decrease quantity"
                          accessibilityRole="button"
                        >
                          <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={tw`w-8 text-center`}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                          style={tw`border border-gray-300 rounded w-8 h-8 items-center justify-center`}
                          accessibilityLabel="Increase quantity"
                          accessibilityRole="button"
                        >
                          <Text>+</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <Text style={tw`font-bold text-lg`}>
                        {formatPrice(itemPrice * item.quantity)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeItem(item.product.id, item.selectedVariant?.id)}
                      style={tw`mt-2`}
                      accessibilityLabel="Remove from cart"
                      accessibilityRole="button"
                    >
                      <Text style={tw`text-red-600 text-sm`}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          <View style={tw`mt-8 bg-gray-50 rounded-lg p-6`}>
            <View style={tw`flex-row justify-between mb-4`}>
              <Text style={tw`text-lg`}>Subtotal</Text>
              <Text style={tw`text-lg font-semibold`}>{formatPrice(getTotal())}</Text>
            </View>
            <View style={tw`flex-row justify-between mb-4`}>
              <Text style={tw`text-lg`}>Shipping</Text>
              <Text style={tw`text-lg font-semibold`}>Free</Text>
            </View>
            <View style={tw`border-t border-gray-200 pt-4 flex-row justify-between`}>
              <Text style={tw`text-xl font-bold`}>Total</Text>
              <Text style={tw`text-xl font-bold`}>{formatPrice(getTotal())}</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Checkout')}
              style={tw`bg-yellow-600 py-4 rounded-lg mt-6`}
              accessibilityLabel="Proceed to checkout"
              accessibilityRole="button"
            >
              <Text style={tw`text-white text-center font-semibold text-lg`}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
};
