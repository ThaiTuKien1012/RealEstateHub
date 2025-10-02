import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { ProductCard } from '../components';
import { useFeaturedProducts, useBestSellers } from '../hooks/useProducts';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

const brands = [
  { id: '1', name: 'Rolex' },
  { id: '2', name: 'Omega' },
  { id: '3', name: 'Patek Philippe' },
  { id: '4', name: 'Tudor' },
  { id: '5', name: 'Cartier' },
  { id: '6', name: 'Tag Heuer' },
];

const priceRanges = [
  { id: '1', label: 'Under $5K', min: 0, max: 5000 },
  { id: '2', label: '$5K - $10K', min: 5000, max: 10000 },
  { id: '3', label: '$10K - $20K', min: 10000, max: 20000 },
  { id: '4', label: '$20K+', min: 20000, max: 999999 },
];

const banners = [
  { id: '1', title: 'New Collection 2025', subtitle: 'Discover the latest timepieces', color: '#1f2937' },
  { id: '2', title: 'Limited Edition', subtitle: 'Exclusive watches available now', color: '#7c3aed' },
  { id: '3', title: 'Free Worldwide Shipping', subtitle: 'On all orders over $1,000', color: '#059669' },
];

const testimonials = [
  { id: '1', name: 'James Wilson', review: 'Exceptional service and authentic products. My Rolex arrived perfectly packaged.', rating: 5, watch: 'Submariner' },
  { id: '2', name: 'Sarah Chen', review: 'Best luxury watch shopping experience. Highly recommend!', rating: 5, watch: 'Speedmaster' },
  { id: '3', name: 'Michael Brown', review: 'Outstanding collection and professional staff. Will buy again.', rating: 5, watch: 'Nautilus' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellersData, isLoading: bestSellersLoading } = useBestSellers();
  const recentlyViewed = useRecentlyViewed(state => state.items);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('CatalogTab', { search: searchQuery });
    }
  };

  const handleBrandFilter = (brand: string) => {
    navigation.navigate('CatalogTab', { brand: brand.toUpperCase() });
  };

  const handlePriceFilter = (min: number, max: number) => {
    navigation.navigate('CatalogTab', { minPrice: min, maxPrice: max });
  };

  const handleNewsletterSignup = () => {
    if (email.trim()) {
      Alert.alert('Success!', `Thank you for subscribing! We'll send updates to ${email}`);
      setEmail('');
    }
  };

  const limitedProducts = featuredData?.data?.filter(p => p.stock < 5) || [];
  const newArrivals = bestSellersData?.data?.slice(0, 4) || [];

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {/* Logo */}
      <View style={tw`bg-white px-4 pt-12 pb-3 items-center`}>
        <Text style={tw`text-3xl font-bold text-gray-900 tracking-wider`}>TIMELESS</Text>
        <Text style={tw`text-xs text-gray-500 mt-1 tracking-widest uppercase`}>Luxury Watches</Text>
      </View>

      {/* Search Bar */}
      <View style={tw`bg-white px-4 pb-4 border-b border-gray-200`}>
        <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 py-3`}>
          <Text style={tw`text-gray-400 text-lg mr-2`}>🔍</Text>
          <TextInput
            style={tw`flex-1 text-base`}
            placeholder="Search watches, brands, models..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {/* Banner Slider */}
      <View style={tw`h-48`}>
        <View 
          style={[
            tw`h-full justify-center items-center px-4`,
            { backgroundColor: banners[currentBanner].color }
          ]}
        >
          <Text style={tw`text-white text-2xl font-bold mb-2 text-center`}>
            {banners[currentBanner].title}
          </Text>
          <Text style={tw`text-white text-sm text-center`}>
            {banners[currentBanner].subtitle}
          </Text>
        </View>
        <View style={tw`absolute bottom-4 w-full flex-row justify-center`}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                tw`w-2 h-2 rounded-full mx-1`,
                { backgroundColor: currentBanner === index ? 'white' : 'rgba(255,255,255,0.5)' }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Brand Categories */}
      <View style={tw`py-6 px-4`}>
        <Text style={tw`text-xl font-bold mb-4`}>Shop by Brand</Text>
        <View style={tw`flex-row flex-wrap gap-2`}>
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              onPress={() => handleBrandFilter(brand.name)}
              style={tw`bg-gray-100 px-4 py-2 rounded-full`}
            >
              <Text style={tw`font-medium`}>{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Price Range Filters */}
      <View style={tw`py-6 px-4 bg-gray-50`}>
        <Text style={tw`text-xl font-bold mb-4`}>Shop by Price</Text>
        <View style={tw`flex-row flex-wrap gap-2`}>
          {priceRanges.map((range) => (
            <TouchableOpacity
              key={range.id}
              onPress={() => handlePriceFilter(range.min, range.max)}
              style={tw`bg-white border border-gray-300 px-4 py-2 rounded-lg`}
            >
              <Text style={tw`font-medium`}>{range.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* New Arrivals */}
      <View style={tw`py-6`}>
        <View style={tw`px-4 mb-4 flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-2xl font-bold mb-1`}>New Arrivals</Text>
            <Text style={tw`text-gray-600 text-sm`}>Latest collection</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('CatalogTab')}>
            <Text style={tw`text-yellow-600 font-medium`}>View All →</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={newArrivals}
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
      </View>

      {/* Limited Edition */}
      {limitedProducts.length > 0 && (
        <View style={tw`py-6 bg-gray-900`}>
          <View style={tw`px-4 mb-4`}>
            <Text style={tw`text-2xl font-bold mb-1 text-white`}>💎 Limited Edition</Text>
            <Text style={tw`text-gray-300 text-sm`}>Exclusive & Rare Timepieces</Text>
          </View>

          <FlatList
            data={limitedProducts}
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
        </View>
      )}

      {/* Featured Collection */}
      <View style={tw`py-6`}>
        <View style={tw`px-4 mb-4`}>
          <Text style={tw`text-2xl font-bold mb-1`}>Featured</Text>
          <Text style={tw`text-gray-600 text-sm`}>Handpicked timepieces</Text>
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
          <Text style={tw`text-gray-600 text-sm`}>Most popular this month</Text>
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

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <View style={tw`py-6 bg-gray-50`}>
          <View style={tw`px-4 mb-4`}>
            <Text style={tw`text-2xl font-bold mb-1`}>Recently Viewed</Text>
            <Text style={tw`text-gray-600 text-sm`}>Continue shopping</Text>
          </View>

          <FlatList
            data={recentlyViewed}
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
        </View>
      )}

      {/* Customer Reviews */}
      <View style={tw`py-8 bg-yellow-50`}>
        <Text style={tw`text-2xl font-bold text-center mb-6 px-4`}>What Our Customers Say</Text>
        <FlatList
          data={testimonials}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tw`w-80 ml-4 first:ml-4 bg-white rounded-2xl p-6`}>
              <View style={tw`flex-row mb-3`}>
                {[...Array(item.rating)].map((_, i) => (
                  <Text key={i} style={tw`text-yellow-500 text-lg`}>★</Text>
                ))}
              </View>
              <Text style={tw`text-gray-700 mb-4 leading-6`}>"{item.review}"</Text>
              <View>
                <Text style={tw`font-bold text-gray-900`}>{item.name}</Text>
                <Text style={tw`text-gray-500 text-sm`}>Purchased: {item.watch}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={tw`pr-4`}
        />
      </View>

      {/* Newsletter Signup */}
      <View style={tw`py-12 px-4 bg-gray-900`}>
        <Text style={tw`text-white text-2xl font-bold text-center mb-2`}>
          Join Our Newsletter
        </Text>
        <Text style={tw`text-gray-300 text-center mb-6`}>
          Get 10% off your first order + exclusive deals
        </Text>
        <View style={tw`flex-row gap-2`}>
          <TextInput
            style={tw`flex-1 bg-white rounded-xl px-4 py-3 text-base`}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity
            onPress={handleNewsletterSignup}
            style={tw`bg-yellow-600 px-6 py-3 rounded-xl justify-center`}
          >
            <Text style={tw`text-white font-bold`}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features - Mobile Cards */}
      <View style={tw`bg-gray-50 py-8 px-4`}>
        <Text style={tw`text-2xl font-bold text-center mb-6`}>Why Choose Us</Text>
        <View style={tw`gap-4`}>
          <View style={tw`bg-white p-4 rounded-xl items-center`}>
            <Text style={tw`text-3xl mb-2`}>✓</Text>
            <Text style={tw`font-semibold text-base mb-1`}>Authenticity Guaranteed</Text>
            <Text style={tw`text-gray-600 text-center text-sm`}>Every watch is certified</Text>
          </View>
          <View style={tw`bg-white p-4 rounded-xl items-center`}>
            <Text style={tw`text-3xl mb-2`}>🚚</Text>
            <Text style={tw`font-semibold text-base mb-1`}>Free Shipping</Text>
            <Text style={tw`text-gray-600 text-center text-sm`}>Worldwide delivery</Text>
          </View>
          <View style={tw`bg-white p-4 rounded-xl items-center`}>
            <Text style={tw`text-3xl mb-2`}>🔒</Text>
            <Text style={tw`font-semibold text-base mb-1`}>Secure Payment</Text>
            <Text style={tw`text-gray-600 text-center text-sm`}>Safe transactions</Text>
          </View>
        </View>
      </View>

      <View style={tw`h-20`} />
    </ScrollView>
  );
};
