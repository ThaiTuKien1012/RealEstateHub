import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import tw from 'twrnc';
import { Header, Footer, ProductCard, FilterPanel } from '../components';
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
      <Header 
        showSearch 
        onSearchChange={handleSearchChange}
        searchValue={searchQuery}
      />

      <View style={tw`flex-row border-b border-gray-200 px-4 py-3 gap-4`}>
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={tw`flex-row items-center px-4 py-2 border border-gray-300 rounded-lg`}
          accessibilityLabel={`Open filters. ${activeFilterCount} filters active`}
          accessibilityRole="button"
        >
          <Text style={tw`text-gray-700 mr-2`}>Filters</Text>
          {activeFilterCount > 0 && (
            <View style={tw`bg-yellow-600 rounded-full w-5 h-5 items-center justify-center`}>
              <Text style={tw`text-white text-xs font-bold`}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SORT_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSortBy(option.value)}
              style={[
                tw`px-4 py-2 rounded-lg mr-2`,
                sortBy === option.value ? tw`bg-yellow-600` : tw`bg-gray-100`,
              ]}
              accessibilityLabel={`Sort by ${option.label}`}
              accessibilityRole="button"
            >
              <Text
                style={[
                  tw`text-sm`,
                  sortBy === option.value ? tw`text-white` : tw`text-gray-700`,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={tw`flex-1`}>
        <View style={tw`max-w-7xl mx-auto px-4 py-6 w-full`}>
          {data && (
            <Text style={tw`text-gray-600 mb-4`}>
              {data.total} {data.total === 1 ? 'watch' : 'watches'} found
            </Text>
          )}

          {isLoading ? (
            <ActivityIndicator size="large" color="#d4af37" style={tw`mt-8`} />
          ) : (
            <>
              <FlatList
                data={sortedProducts}
                numColumns={2}
                key="catalog-grid"
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={tw`w-1/2 p-2`}>
                    <ProductCard product={item} />
                  </View>
                )}
                ListEmptyComponent={
                  <View style={tw`py-12`}>
                    <Text style={tw`text-gray-500 text-center text-lg`}>
                      No watches found matching your criteria
                    </Text>
                  </View>
                }
              />

              {data && data.totalPages > 1 && (
                <View style={tw`flex-row justify-center gap-2 my-8`}>
                  {page > 1 && (
                    <TouchableOpacity
                      onPress={() => setPage(page - 1)}
                      style={tw`px-4 py-2 border border-gray-300 rounded`}
                      accessibilityLabel="Previous page"
                      accessibilityRole="button"
                    >
                      <Text>Previous</Text>
                    </TouchableOpacity>
                  )}
                  
                  <Text style={tw`px-4 py-2`}>
                    Page {page} of {data.totalPages}
                  </Text>

                  {page < data.totalPages && (
                    <TouchableOpacity
                      onPress={() => setPage(page + 1)}
                      style={tw`px-4 py-2 border border-gray-300 rounded`}
                      accessibilityLabel="Next page"
                      accessibilityRole="button"
                    >
                      <Text>Next</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          )}
        </View>
        <Footer />
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
