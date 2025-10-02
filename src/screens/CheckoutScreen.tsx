import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useCart } from '../hooks/useCart';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { getTotal, clearCart, items } = useCart();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePlaceOrder = () => {
    if (!email || !name || !address || !city || !zipCode) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    const total = getTotal();
    clearCart();
    navigation.navigate('OrderSuccess', { total });
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`pb-32`}>
        <View style={tw`px-4 py-6`}>
          <Text style={tw`text-2xl font-bold mb-6`}>Checkout</Text>

          <View style={tw`bg-white rounded-2xl p-4 mb-4`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Text style={tw`text-2xl mr-2`}>📧</Text>
              <Text style={tw`text-lg font-semibold`}>Contact Information</Text>
            </View>
            <TextInput
              style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3`}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email address"
            />
            <TextInput
              style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              accessibilityLabel="Full name"
            />
          </View>

          <View style={tw`bg-white rounded-2xl p-4 mb-4`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Text style={tw`text-2xl mr-2`}>📍</Text>
              <Text style={tw`text-lg font-semibold`}>Shipping Address</Text>
            </View>
            <TextInput
              style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3`}
              placeholder="Street address"
              value={address}
              onChangeText={setAddress}
              accessibilityLabel="Street address"
            />
            <View style={tw`flex-row gap-3`}>
              <TextInput
                style={tw`flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
                placeholder="City"
                value={city}
                onChangeText={setCity}
                accessibilityLabel="City"
              />
              <TextInput
                style={tw`w-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
                placeholder="ZIP"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                accessibilityLabel="ZIP code"
              />
            </View>
          </View>

          <View style={tw`bg-white rounded-2xl p-4 mb-4`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Text style={tw`text-2xl mr-2`}>💳</Text>
              <Text style={tw`text-lg font-semibold`}>Payment Information</Text>
            </View>
            <View style={tw`bg-blue-50 rounded-xl p-3 mb-3`}>
              <Text style={tw`text-sm text-blue-700 text-center`}>
                ℹ️ Demo mode - No real payment required
              </Text>
            </View>
            <TextInput
              style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
              placeholder="Card number (demo)"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              accessibilityLabel="Card number"
            />
          </View>

          <View style={tw`bg-white rounded-2xl p-4 mb-4`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Order Summary</Text>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-600`}>Items ({items.length})</Text>
              <Text style={tw`font-medium`}>{formatPrice(getTotal())}</Text>
            </View>
            <View style={tw`flex-row justify-between mb-3`}>
              <Text style={tw`text-gray-600`}>Shipping</Text>
              <Text style={tw`font-medium text-green-600`}>Free</Text>
            </View>
            <View style={tw`border-t border-gray-200 pt-3 flex-row justify-between`}>
              <Text style={tw`text-xl font-bold`}>Total</Text>
              <Text style={tw`text-xl font-bold text-yellow-600`}>{formatPrice(getTotal())}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4`}>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          style={tw`bg-yellow-600 py-4 rounded-xl`}
          accessibilityLabel="Place order"
          accessibilityRole="button"
        >
          <Text style={tw`text-white text-center font-bold text-base`}>
            Place Order • {formatPrice(getTotal())}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
