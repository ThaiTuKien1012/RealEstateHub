import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { ProductCard } from '../components';
import { useFeaturedProducts, useBestSellers } from '../hooks/useProducts';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Rolex', icon: '⌚', brand: 'ROLEX' },
  { id: '2', name: 'Omega', icon: '🌊', brand: 'OMEGA' },
  { id: '3', name: 'Patek', icon: '💎', brand: 'PATEK PHILIPPE' },
  { id: '4', name: 'Tudor', icon: '👑', brand: 'TUDOR' },
  { id: '5', name: 'Tag Heuer', icon: '🏁', brand: 'TAG HEUER' },
  { id: '6', name: 'Seiko', icon: '🇯🇵', brand: 'GRAND SEIKO' },
  { id: '7', name: 'Cartier', icon: '💍', brand: 'CARTIER' },
  { id: '8', name: 'Xem tất cả', icon: '☰', brand: '' },
];

const banners = [
  { id: '1', title: 'Flash Sale Đồng Hồ Cao Cấp', color: '#ee4d2d' },
  { id: '2', title: 'Miễn Phí Vận Chuyển Toàn Quốc', color: '#f59e0b' },
  { id: '3', title: 'Giảm Đến 30% Bộ Sưu Tập Mới', color: '#3b82f6' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellersData, isLoading: bestSellersLoading } = useBestSellers();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [flashSaleTime, setFlashSaleTime] = useState({ hours: 2, minutes: 15, seconds: 30 });

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(bannerTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    navigation.navigate('CatalogTab', { search: searchQuery });
  };

  const handleCategoryPress = (brand: string) => {
    if (brand) {
      navigation.navigate('CatalogTab', { brand });
    } else {
      navigation.navigate('CatalogTab');
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      {/* Search Bar + Location */}
      <View style={tw`bg-[#ee4d2d] pt-10 pb-3 px-3`}>
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`flex-1 bg-white rounded-sm flex-row items-center px-3 py-2`}>
            <Text style={tw`text-lg mr-2`}>🔍</Text>
            <TextInput
              style={tw`flex-1 text-sm`}
              placeholder="Bạn muốn mua gì..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={tw`ml-3`}>
            <Text style={tw`text-2xl`}>🔔</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={tw`flex-row items-center`}>
          <Text style={tw`text-white text-xs mr-1`}>📍</Text>
          <Text style={tw`text-white text-xs`}>Xem giá tại Hồ Chí Minh</Text>
        </TouchableOpacity>
      </View>

      {/* Banner Slider */}
      <View style={tw`bg-white mb-2`}>
        <View style={[tw`py-16 justify-center items-center`, { backgroundColor: banners[currentBanner].color }]}>
          <Text style={tw`text-white text-lg font-bold text-center px-4`}>
            {banners[currentBanner].title}
          </Text>
        </View>
        <View style={tw`flex-row justify-center py-2`}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                tw`w-1.5 h-1.5 rounded-full mx-1`,
                { backgroundColor: currentBanner === index ? '#ee4d2d' : '#d1d5db' }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Category Icons */}
      <View style={tw`bg-white py-4 px-3 mb-2`}>
        <View style={tw`flex-row flex-wrap`}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={tw`w-1/4 items-center mb-4`}
              onPress={() => handleCategoryPress(cat.brand)}
            >
              <View style={tw`w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mb-1`}>
                <Text style={tw`text-2xl`}>{cat.icon}</Text>
              </View>
              <Text style={tw`text-xs text-center text-gray-700`}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Flash Sale */}
      <View style={tw`bg-white py-4 mb-2`}>
        <View style={tw`flex-row justify-between items-center px-4 mb-3`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-[#ee4d2d] text-lg font-bold mr-2`}>⚡ FLASH SALE</Text>
            <View style={tw`bg-[#ee4d2d] px-2 py-0.5 rounded`}>
              <Text style={tw`text-white text-xs font-bold`}>
                {String(flashSaleTime.hours).padStart(2, '0')}:{String(flashSaleTime.minutes).padStart(2, '0')}:{String(flashSaleTime.seconds).padStart(2, '0')}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('CatalogTab')}>
            <Text style={tw`text-[#ee4d2d] text-sm`}>Xem tất cả →</Text>
          </TouchableOpacity>
        </View>
        
        {featuredLoading ? (
          <ActivityIndicator size="large" color="#ee4d2d" style={tw`my-8`} />
        ) : (
          <FlatList
            data={featuredData?.data?.slice(0, 5) || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={tw`w-36 ml-2 first:ml-4`}>
                <ProductCard product={item} compact />
              </View>
            )}
            contentContainerStyle={tw`pr-2`}
          />
        )}
      </View>

      {/* Gợi Ý Hôm Nay */}
      <View style={tw`bg-white py-4`}>
        <View style={tw`px-4 mb-3`}>
          <Text style={tw`text-[#ee4d2d] text-lg font-bold`}>GỢI Ý HÔM NAY</Text>
        </View>
        
        {bestSellersLoading ? (
          <ActivityIndicator size="large" color="#ee4d2d" style={tw`my-8`} />
        ) : (
          <View style={tw`flex-row flex-wrap px-2`}>
            {bestSellersData?.data?.map((item) => (
              <View key={item.id} style={tw`w-1/2 p-1`}>
                <ProductCard product={item} compact />
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={tw`h-20`} />
    </ScrollView>
  );
};
