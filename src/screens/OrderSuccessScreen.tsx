import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'twrnc';

export const OrderSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const orderNumber = route.params?.orderNumber || `ORD-${Date.now().toString().slice(-8)}`;
  const total = route.params?.total || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`flex-grow`}>
      <View style={tw`flex-1 items-center justify-center px-6 py-12`}>
        <View style={tw`w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6`}>
          <Text style={tw`text-5xl`}>✓</Text>
        </View>

        <Text style={tw`text-3xl font-bold mb-3 text-center`}>Order Confirmed!</Text>
        <Text style={tw`text-gray-600 text-center mb-8 leading-6`}>
          Thank you for your purchase. Your order has been placed successfully.
        </Text>

        <View style={tw`bg-gray-50 rounded-2xl p-6 w-full mb-8`}>
          <View style={tw`flex-row justify-between mb-3 pb-3 border-b border-gray-200`}>
            <Text style={tw`text-gray-600`}>Order Number</Text>
            <Text style={tw`font-bold text-gray-900`}>{orderNumber}</Text>
          </View>
          <View style={tw`flex-row justify-between mb-3 pb-3 border-b border-gray-200`}>
            <Text style={tw`text-gray-600`}>Total Amount</Text>
            <Text style={tw`font-bold text-yellow-600 text-lg`}>{formatPrice(total)}</Text>
          </View>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`text-gray-600`}>Status</Text>
            <View style={tw`bg-green-100 px-3 py-1 rounded-full`}>
              <Text style={tw`text-green-700 font-semibold text-xs`}>Processing</Text>
            </View>
          </View>
        </View>

        <View style={tw`bg-yellow-50 rounded-2xl p-4 w-full mb-8`}>
          <Text style={tw`text-sm text-gray-700 text-center leading-5`}>
            📧 A confirmation email has been sent to your email address with order details and tracking information.
          </Text>
        </View>

        <View style={tw`w-full gap-3`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
            style={tw`bg-yellow-600 py-4 rounded-xl`}
            accessibilityLabel="Continue shopping"
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-center font-semibold text-base`}>
              Continue Shopping
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'ProfileTab' })}
            style={tw`bg-gray-100 py-4 rounded-xl`}
            accessibilityLabel="View profile"
            accessibilityRole="button"
          >
            <Text style={tw`text-gray-900 text-center font-semibold text-base`}>
              Go to Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
