import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import tw from 'twrnc';

export const Footer: React.FC = () => {
  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={tw`bg-gray-900 mt-16`}>
      <View style={tw`max-w-7xl mx-auto px-4 py-12`}>
        <View style={tw`flex-row flex-wrap justify-between gap-8`}>
          <View style={tw`flex-1 min-w-[200px]`}>
            <Text style={tw`text-white text-xl font-bold mb-4`}>TIMELESS</Text>
            <Text style={tw`text-gray-400 text-sm`}>
              Discover the world's finest luxury watches. Crafted with precision, designed for eternity.
            </Text>
          </View>

          <View style={tw`flex-1 min-w-[150px]`}>
            <Text style={tw`text-white font-semibold mb-3`}>Shop</Text>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text style={tw`text-gray-400 text-sm mb-2`}>All Watches</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text style={tw`text-gray-400 text-sm mb-2`}>Brands</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text style={tw`text-gray-400 text-sm mb-2`}>New Arrivals</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`flex-1 min-w-[150px]`}>
            <Text style={tw`text-white font-semibold mb-3`}>Support</Text>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text style={tw`text-gray-400 text-sm mb-2`}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text style={tw`text-gray-400 text-sm mb-2`}>Shipping Info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text style={tw`text-gray-400 text-sm mb-2`}>Returns</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`border-t border-gray-800 mt-8 pt-8`}>
          <Text style={tw`text-gray-400 text-sm text-center`}>
            © 2025 Timeless Watch Shop. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
};
