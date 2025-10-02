import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import tw from 'twrnc';
import { ProductCard, FilterPanel } from '../components';
import { useProductSearch } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { Filter } from '../types';
import { FILTERS_DEFAULT, SORT_OPTIONS } from '../constants';

export const CatalogScreen: React.FC = () => {
  const [filters, setFilters] = useState<Partial<Filter>>(FILTERS_DEFAULT);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  const debouncedSearch = useDebounce(searchQuery, 500);

  const searchFilters = {
    ...filters,
    searchQuery: debouncedSearch,
  };

  const { data, isLoading } = useProductSearch(searchFilters, page, 12);

  const handleFilterChange = (newFilters: Partial<Filter>) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setPage(1);
  };

  const sortedProducts = React.useMemo(() => {
    if (!data?.data) return [];
    const products = [...data.data];

    switch (sortBy) {
      case 'price-asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return products.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating':
        return products.sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  }, [data?.data, sortBy]);

  const activeFilterCount = 
    (filters.brands?.length || 0) +
    (filters.movements?.length || 0) +
    (filters.materials?.length || 0);

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Search Bar - Mobile */}
      <View style={tw`bg-white px-4 pt-3 pb-2 border-b border-gray-100`}>
        <TextInput
          style={tw`bg-gray-100 rounded-xl px-4 py-3 text-base`}
          placeholder="Search watches..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          accessibilityLabel="Search watches"
        />
      </View>

      {/* Filters - Mobile */}
      <View style={tw`flex-row px-4 py-3 gap-3`}>
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={tw`flex-row items-center justify-center px-5 py-2.5 bg-gray-900 rounded-xl flex-1`}
          accessibilityLabel={`Open filters. ${activeFilterCount} filters active`}
          accessibilityRole="button"
        >
          <Text style={tw`text-white font-medium mr-2`}>🎛️ Filter</Text>
          {activeFilterCount > 0 && (
            <View style={tw`bg-yellow-600 rounded-full w-5 h-5 items-center justify-center`}>
              <Text style={tw`text-white text-xs font-bold`}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-1`}>
          {SORT_OPTIONS.slice(0, 3).map(option => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSortBy(option.value)}
              style={[
                tw`px-4 py-2.5 rounded-xl mr-2`,
                sortBy === option.value ? tw`bg-yellow-600` : tw`bg-gray-100`,
              ]}
              accessibilityLabel={`Sort by ${option.label}`}
              accessibilityRole="button"
            >
              <Text
                style={[
                  tw`text-sm font-medium`,
                  sortBy === option.value ? tw`text-white` : tw`text-gray-700`,
                ]}
              >
                {option.label.replace('Price: ', '')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`px-4 pt-4 pb-2`}>
          {data && (
            <Text style={tw`text-gray-600 text-sm`}>
              {data.total} {data.total === 1 ? 'watch' : 'watches'}
            </Text>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#d4af37" style={tw`mt-12`} />
        ) : (
          <>
            <FlatList
              data={sortedProducts}
              numColumns={2}
              key="catalog-grid"
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={tw`w-1/2 px-2 mb-3`}>
                  <ProductCard product={item} />
                </View>
              )}
              contentContainerStyle={tw`px-2`}
              ListEmptyComponent={
                <View style={tw`py-16 px-4`}>
                  <Text style={tw`text-gray-500 text-center text-base`}>
                    No watches found
                  </Text>
                </View>
              }
            />

            {data && data.totalPages > 1 && (
              <View style={tw`flex-row justify-center gap-3 my-6 px-4`}>
                {page > 1 && (
                  <TouchableOpacity
                    onPress={() => setPage(page - 1)}
                    style={tw`px-6 py-2.5 bg-gray-100 rounded-xl`}
                    accessibilityLabel="Previous page"
                    accessibilityRole="button"
                  >
                    <Text style={tw`font-medium`}>← Prev</Text>
                  </TouchableOpacity>
                )}
                
                <View style={tw`px-4 py-2.5 bg-yellow-600 rounded-xl`}>
                  <Text style={tw`text-white font-medium`}>
                    {page} / {data.totalPages}
                  </Text>
                </View>

                {page < data.totalPages && (
                  <TouchableOpacity
                    onPress={() => setPage(page + 1)}
                    style={tw`px-6 py-2.5 bg-gray-100 rounded-xl`}
                    accessibilityLabel="Next page"
                    accessibilityRole="button"
                  >
                    <Text style={tw`font-medium`}>Next →</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View style={tw`h-6`} />
          </>
        )}
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      </Modal>
    </View>
  );
};
