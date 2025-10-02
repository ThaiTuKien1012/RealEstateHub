import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { ProductCard } from '../components';
import { useFeaturedProducts, useBestSellers } from '../hooks/useProducts';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellersData, isLoading: bestSellersLoading } = useBestSellers();

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {/* Hero Section - Mobile Native */}
      <View style={tw`bg-gray-900 pt-12 pb-8 px-4`}>
        <Text style={tw`text-white text-3xl font-bold text-center mb-3`}>
          Timeless Elegance
        </Text>
        <Text style={tw`text-gray-300 text-base text-center mb-6`}>
          Discover luxury watches
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CatalogTab')}
          style={tw`bg-yellow-600 py-3.5 rounded-xl mx-auto px-16`}
          accessibilityLabel="Shop now"
          accessibilityRole="button"
        >
          <Text style={tw`text-white font-semibold text-base`}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Collection */}
      <View style={tw`py-6`}>
        <View style={tw`px-4 mb-4`}>
          <Text style={tw`text-2xl font-bold mb-1`}>Featured</Text>
          <Text style={tw`text-gray-600 text-sm`}>
            Handpicked timepieces
          </Text>
        </View>

        {featuredLoading ? (
          <ActivityIndicator size="large" color="#d4af37" style={tw`my-8`} />
        ) : (
          <FlatList
            data={featuredData?.data || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={tw`w-64 ml-4 first:ml-4`}>
                <ProductCard product={item} />
              </View>
            )}
            contentContainerStyle={tw`pr-4`}
          />
        )}
      </View>

      {/* Best Sellers */}
      <View style={tw`py-6`}>
        <View style={tw`px-4 mb-4`}>
          <Text style={tw`text-2xl font-bold mb-1`}>Best Sellers</Text>
          <Text style={tw`text-gray-600 text-sm`}>
            Most popular this month
          </Text>
        </View>

        {bestSellersLoading ? (
          <ActivityIndicator size="large" color="#d4af37" style={tw`my-8`} />
        ) : (
          <FlatList
            data={bestSellersData?.data || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={tw`w-64 ml-4 first:ml-4`}>
                <ProductCard product={item} />
              </View>
            )}
            contentContainerStyle={tw`pr-4`}
          />
        )}
      </View>

      {/* Features - Mobile Cards */}
      <View style={tw`bg-gray-50 py-8 px-4 mt-4`}>
        <Text style={tw`text-2xl font-bold text-center mb-6`}>Why Choose Us</Text>
        <View style={tw`gap-4`}>
          <View style={tw`bg-white p-4 rounded-xl items-center`}>
            <Text style={tw`text-3xl mb-2`}>✓</Text>
            <Text style={tw`font-semibold text-base mb-1`}>Authenticity Guaranteed</Text>
            <Text style={tw`text-gray-600 text-center text-sm`}>
              Every watch is certified
            </Text>
          </View>
          <View style={tw`bg-white p-4 rounded-xl items-center`}>
            <Text style={tw`text-3xl mb-2`}>🚚</Text>
            <Text style={tw`font-semibold text-base mb-1`}>Free Shipping</Text>
            <Text style={tw`text-gray-600 text-center text-sm`}>
              Worldwide delivery
            </Text>
          </View>
          <View style={tw`bg-white p-4 rounded-xl items-center`}>
            <Text style={tw`text-3xl mb-2`}>🔒</Text>
            <Text style={tw`font-semibold text-base mb-1`}>Secure Payment</Text>
            <Text style={tw`text-gray-600 text-center text-sm`}>
              Safe transactions
            </Text>
          </View>
        </View>
      </View>

      <View style={tw`h-6`} />
    </ScrollView>
  );
};
