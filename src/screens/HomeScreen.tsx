import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Header, Footer, ProductCard } from '../components';
import { useFeaturedProducts, useBestSellers } from '../hooks/useProducts';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellersData, isLoading: bestSellersLoading } = useBestSellers();

  return (
    <View style={tw`flex-1 bg-white`}>
      <Header />
      <ScrollView>
        <View style={tw`bg-gray-900 py-20 px-4`}>
          <View style={tw`max-w-4xl mx-auto`}>
            <Text style={tw`text-white text-4xl md:text-5xl font-bold text-center mb-4`}>
              Timeless Elegance
            </Text>
            <Text style={tw`text-gray-300 text-lg text-center mb-8`}>
              Discover the world's finest luxury watches
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Catalog')}
              style={tw`bg-yellow-600 py-3 px-8 rounded-lg self-center`}
              accessibilityLabel="Shop now"
              accessibilityRole="button"
            >
              <Text style={tw`text-white font-semibold text-lg`}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`max-w-7xl mx-auto px-4 py-12 w-full`}>
          <Text style={tw`text-3xl font-bold mb-2`}>Featured Collection</Text>
          <Text style={tw`text-gray-600 mb-6`}>
            Handpicked timepieces for the discerning collector
          </Text>

          {featuredLoading ? (
            <ActivityIndicator size="large" color="#d4af37" />
          ) : (
            <FlatList
              data={featuredData?.data || []}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={tw`w-72 mr-4`}>
                  <ProductCard product={item} />
                </View>
              )}
            />
          )}
        </View>

        <View style={tw`max-w-7xl mx-auto px-4 py-12 w-full`}>
          <Text style={tw`text-3xl font-bold mb-2`}>Best Sellers</Text>
          <Text style={tw`text-gray-600 mb-6`}>
            Our most popular watches this month
          </Text>

          {bestSellersLoading ? (
            <ActivityIndicator size="large" color="#d4af37" />
          ) : (
            <FlatList
              data={bestSellersData?.data || []}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={tw`w-72 mr-4`}>
                  <ProductCard product={item} />
                </View>
              )}
            />
          )}
        </View>

        <View style={tw`bg-gray-100 py-16 px-4`}>
          <View style={tw`max-w-4xl mx-auto`}>
            <Text style={tw`text-3xl font-bold text-center mb-8`}>Why Choose Us</Text>
            <View style={tw`flex-row flex-wrap justify-around gap-8`}>
              <View style={tw`items-center flex-1 min-w-[200px]`}>
                <Text style={tw`text-4xl mb-2`}>✓</Text>
                <Text style={tw`font-semibold text-lg mb-2`}>Authenticity Guaranteed</Text>
                <Text style={tw`text-gray-600 text-center text-sm`}>
                  Every watch is certified authentic
                </Text>
              </View>
              <View style={tw`items-center flex-1 min-w-[200px]`}>
                <Text style={tw`text-4xl mb-2`}>🚚</Text>
                <Text style={tw`font-semibold text-lg mb-2`}>Free Shipping</Text>
                <Text style={tw`text-gray-600 text-center text-sm`}>
                  Worldwide delivery on all orders
                </Text>
              </View>
              <View style={tw`items-center flex-1 min-w-[200px]`}>
                <Text style={tw`text-4xl mb-2`}>🔒</Text>
                <Text style={tw`font-semibold text-lg mb-2`}>Secure Payment</Text>
                <Text style={tw`text-gray-600 text-center text-sm`}>
                  Safe and encrypted transactions
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
};
