import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useComparison } from '../hooks/useComparison';

export const CompareScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { items, removeItem, clearAll } = useComparison();

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
        <View style={tw`flex-row items-center justify-between px-5 py-4 border-b border-gray-100`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`w-10 h-10 items-center justify-center`}
          >
            <Text style={tw`text-2xl`}>←</Text>
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-gray-900`}>Compare Watches</Text>
          <View style={tw`w-10`} />
        </View>

        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Text style={tw`text-6xl mb-4`}>⊞</Text>
          <Text style={tw`text-gray-900 text-xl font-bold mb-2`}>No Products to Compare</Text>
          <Text style={tw`text-gray-500 text-center mb-6`}>
            Add products from the catalog to compare their features and specifications
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'Shop' })}
            style={tw`bg-yellow-600 px-8 py-3.5 rounded-xl`}
          >
            <Text style={tw`text-white font-bold text-base`}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const comparisonRows = [
    { label: 'Price', key: 'price', format: formatPrice },
    { label: 'Brand', key: 'brand' },
    { label: 'Movement', key: 'movement' },
    { label: 'Case Material', key: 'caseMaterial' },
    { label: 'Case Diameter', key: 'caseDiameter' },
    { label: 'Water Resistance', key: 'waterResistance' },
    { label: 'Strap Material', key: 'strapMaterial' },
    { label: 'Rating', key: 'rating', format: (val: number) => `${val} ★` },
    { label: 'Reviews', key: 'reviewCount' },
    { label: 'Stock', key: 'stock', format: (val: number) => val === 0 ? 'Out of Stock' : `${val} available` },
  ];

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center justify-between px-5 py-4 border-b border-gray-100`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`w-10 h-10 items-center justify-center`}
        >
          <Text style={tw`text-2xl`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-900`}>
          Compare ({items.length})
        </Text>
        <TouchableOpacity
          onPress={clearAll}
          style={tw`px-3 py-1.5`}
        >
          <Text style={tw`text-red-600 font-medium text-sm`}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={tw`p-4`}>
          <View style={tw`flex-row gap-3 mb-4`}>
            {items.map((product) => (
              <View key={product.id} style={tw`w-48`}>
                <View style={tw`bg-gray-100 rounded-2xl overflow-hidden mb-3`}>
                  <Image
                    source={{ uri: product.images[0] }}
                    style={tw`w-48 h-48`}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeItem(product.id)}
                    style={tw`absolute top-2 right-2 bg-white w-8 h-8 rounded-full items-center justify-center`}
                  >
                    <Text style={tw`text-red-600 text-lg`}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={tw`text-gray-900 font-bold text-base mb-1`} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={tw`text-gray-500 text-xs uppercase mb-2`}>
                  {product.brand}
                </Text>
              </View>
            ))}
          </View>

          {comparisonRows.map((row) => (
            <View key={row.key} style={tw`border-b border-gray-100 py-3`}>
              <Text style={tw`text-gray-700 font-semibold text-sm mb-2`}>
                {row.label}
              </Text>
              <View style={tw`flex-row gap-3`}>
                {items.map((product) => {
                  const value = (product as any)[row.key];
                  const displayValue = row.format ? row.format(value) : value;
                  return (
                    <View key={product.id} style={tw`w-48`}>
                      <Text style={tw`text-gray-900 text-sm`}>{displayValue}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}

          <View style={tw`flex-row gap-3 mt-6`}>
            {items.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
                style={tw`w-48 bg-gray-900 py-3 rounded-xl items-center`}
              >
                <Text style={tw`text-white font-bold text-sm`}>View Details</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
