import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Header } from '../components';
import { useCart } from '../hooks/useCart';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { getTotal, clearCart } = useCart();
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
    Alert.alert(
      'Order Placed!',
      'Thank you for your order. This is a demo checkout - no payment was processed.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Header />
      <ScrollView>
        <View style={tw`max-w-4xl mx-auto px-4 py-6 w-full`}>
          <Text style={tw`text-3xl font-bold mb-6`}>Checkout</Text>

          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-semibold mb-4`}>Contact Information</Text>
            <TextInput
              style={tw`border border-gray-300 rounded px-4 py-3 mb-3`}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email address"
            />
            <TextInput
              style={tw`border border-gray-300 rounded px-4 py-3`}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              accessibilityLabel="Full name"
            />
          </View>

          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-semibold mb-4`}>Shipping Address</Text>
            <TextInput
              style={tw`border border-gray-300 rounded px-4 py-3 mb-3`}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              accessibilityLabel="Street address"
            />
            <View style={tw`flex-row gap-3`}>
              <TextInput
                style={tw`flex-1 border border-gray-300 rounded px-4 py-3`}
                placeholder="City"
                value={city}
                onChangeText={setCity}
                accessibilityLabel="City"
              />
              <TextInput
                style={tw`w-32 border border-gray-300 rounded px-4 py-3`}
                placeholder="ZIP Code"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                accessibilityLabel="ZIP code"
              />
            </View>
          </View>

          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-semibold mb-4`}>Payment Information</Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
              This is a demo checkout. No real payment will be processed.
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded px-4 py-3 mb-3`}
              placeholder="Card Number (Demo)"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              accessibilityLabel="Card number"
            />
          </View>

          <View style={tw`bg-gray-50 rounded-lg p-6 mb-6`}>
            <Text style={tw`text-xl font-semibold mb-4`}>Order Summary</Text>
            <View style={tw`flex-row justify-between mb-3`}>
              <Text>Subtotal</Text>
              <Text style={tw`font-semibold`}>{formatPrice(getTotal())}</Text>
            </View>
            <View style={tw`flex-row justify-between mb-3`}>
              <Text>Shipping</Text>
              <Text style={tw`font-semibold`}>Free</Text>
            </View>
            <View style={tw`border-t border-gray-200 pt-3 flex-row justify-between`}>
              <Text style={tw`text-lg font-bold`}>Total</Text>
              <Text style={tw`text-lg font-bold`}>{formatPrice(getTotal())}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handlePlaceOrder}
            style={tw`bg-yellow-600 py-4 rounded-lg`}
            accessibilityLabel="Place order"
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-center font-semibold text-lg`}>
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
