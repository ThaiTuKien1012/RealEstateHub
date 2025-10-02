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
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { ProductCard, ProductListItem, FilterPanel, QuickViewModal } from '../components';
import { useProductSearch } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { useComparison } from '../hooks/useComparison';
import { useSavedFilters } from '../hooks/useSavedFilters';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { Filter } from '../types';
import { FILTERS_DEFAULT, SORT_OPTIONS } from '../constants';

type ViewMode = 'grid' | 'list';

export const CatalogScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [filters, setFilters] = useState<Partial<Filter>>(FILTERS_DEFAULT);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const { items: compareItems } = useComparison();
  const { savedFilters, addFilter, removeFilter, loadFilter } = useSavedFilters();
  const { items: recentlyViewed } = useRecentlyViewed();

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

  const handleSaveFilter = () => {
    setFilterName('');
    setShowSaveFilterModal(true);
  };

  const confirmSaveFilter = () => {
    if (filterName && filterName.trim()) {
      addFilter(filterName.trim(), { ...filters, searchQuery: debouncedSearch });
      setShowSaveFilterModal(false);
      setFilterName('');
    }
  };

  const handleLoadFilter = (filterId: string) => {
    const savedFilter = loadFilter(filterId);
    if (savedFilter) {
      setFilters(savedFilter);
      setSearchQuery(savedFilter.searchQuery || '');
      setPage(1);
      setShowSavedFilters(false);
    }
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

      {/* Filters & View Mode - Mobile */}
      <View style={tw`px-4 py-3 gap-3`}>
        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={tw`flex-row items-center justify-center px-4 py-2.5 bg-gray-900 rounded-xl flex-1`}
            accessibilityLabel={`Open filters. ${activeFilterCount} filters active`}
            accessibilityRole="button"
          >
            <Text style={tw`text-white font-medium mr-1 text-sm`}>⚙ Filter</Text>
            {activeFilterCount > 0 && (
              <View style={tw`bg-yellow-600 rounded-full w-5 h-5 items-center justify-center`}>
                <Text style={tw`text-white text-xs font-bold`}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveFilter}
            style={tw`px-3 py-2.5 bg-yellow-600 rounded-xl`}
            accessibilityLabel="Save current filter"
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-sm`}>💾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowSavedFilters(true)}
            style={tw`px-3 py-2.5 bg-gray-200 rounded-xl`}
            accessibilityLabel="Load saved filter"
            accessibilityRole="button"
          >
            <Text style={tw`text-gray-700 text-sm`}>📋</Text>
          </TouchableOpacity>

          <View style={tw`flex-row bg-gray-100 rounded-xl p-1 gap-1`}>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={[
                tw`px-3 py-2 rounded-lg`,
                viewMode === 'grid' ? tw`bg-white` : tw``,
              ]}
              accessibilityLabel="Grid view"
              accessibilityRole="button"
            >
              <Text style={tw`text-base`}>⊞</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={[
                tw`px-3 py-2 rounded-lg`,
                viewMode === 'list' ? tw`bg-white` : tw``,
              ]}
              accessibilityLabel="List view"
              accessibilityRole="button"
            >
              <Text style={tw`text-base`}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        {recentlyViewed.length > 0 && (
          <View style={tw`py-4 border-b border-gray-100`}>
            <Text style={tw`px-4 text-lg font-bold mb-3`}>📖 Recently Viewed</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`px-2`}>
              {recentlyViewed.slice(0, 5).map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
                  style={tw`w-36 mr-3 bg-white rounded-xl overflow-hidden border border-gray-200`}
                >
                  <Image
                    source={{ uri: product.images[0] }}
                    style={tw`w-full h-36 bg-gray-100`}
                    resizeMode="cover"
                  />
                  <View style={tw`p-2`}>
                    <Text style={tw`text-gray-500 text-xs uppercase`} numberOfLines={1}>
                      {product.brand}
                    </Text>
                    <Text style={tw`text-gray-900 font-semibold text-sm`} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={tw`text-gray-900 font-bold text-sm mt-1`}>
                      ${product.price.toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
            {viewMode === 'grid' ? (
              <FlatList
                data={sortedProducts}
                numColumns={2}
                key="catalog-grid"
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={tw`w-1/2 px-2 mb-3`}>
                    <ProductCard product={item} onQuickView={setQuickViewProductId} showCompare />
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
            ) : (
              <FlatList
                data={sortedProducts}
                key="catalog-list"
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProductListItem product={item} onQuickView={setQuickViewProductId} showCompare />}
                contentContainerStyle={tw`px-4`}
                ListEmptyComponent={
                  <View style={tw`py-16 px-4`}>
                    <Text style={tw`text-gray-500 text-center text-base`}>
                      No watches found
                    </Text>
                  </View>
                }
              />
            )}

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

      <QuickViewModal
        visible={!!quickViewProductId}
        productId={quickViewProductId}
        onClose={() => setQuickViewProductId(null)}
      />

      <Modal
        visible={showSavedFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSavedFilters(false)}
      >
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl max-h-96`}>
            <View style={tw`p-4 border-b border-gray-200 flex-row justify-between items-center`}>
              <Text style={tw`text-xl font-bold`}>Saved Filters</Text>
              <TouchableOpacity onPress={() => setShowSavedFilters(false)}>
                <Text style={tw`text-gray-500 text-2xl`}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`max-h-80`}>
              {savedFilters.length === 0 ? (
                <View style={tw`p-8 items-center`}>
                  <Text style={tw`text-gray-500 text-center`}>
                    No saved filters yet.{'\n'}Save your current filter to quick access later.
                  </Text>
                </View>
              ) : (
                savedFilters.map((saved) => (
                  <View
                    key={saved.id}
                    style={tw`px-4 py-3 border-b border-gray-100 flex-row items-center justify-between`}
                  >
                    <TouchableOpacity
                      onPress={() => handleLoadFilter(saved.id)}
                      style={tw`flex-1`}
                    >
                      <Text style={tw`text-base font-medium mb-1`}>{saved.name}</Text>
                      <Text style={tw`text-xs text-gray-500`}>
                        {saved.filters.brands?.length || 0} brands • {saved.filters.movements?.length || 0} movements
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Delete Filter',
                          `Are you sure you want to delete "${saved.name}"?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => removeFilter(saved.id) },
                          ]
                        );
                      }}
                      style={tw`ml-3 p-2`}
                    >
                      <Text style={tw`text-red-500 text-lg`}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSaveFilterModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSaveFilterModal(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-6`}>
          <View style={tw`bg-white rounded-2xl p-6 w-full max-w-md`}>
            <Text style={tw`text-xl font-bold mb-4`}>Save Filter</Text>
            <Text style={tw`text-gray-600 mb-3`}>Enter a name for this filter:</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base`}
              placeholder="e.g., Luxury Rolex Watches"
              value={filterName}
              onChangeText={setFilterName}
              autoFocus
              onSubmitEditing={confirmSaveFilter}
            />
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                onPress={() => setShowSaveFilterModal(false)}
                style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
              >
                <Text style={tw`text-center font-semibold text-gray-700`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmSaveFilter}
                style={[tw`flex-1 bg-yellow-600 py-3 rounded-xl`, !filterName.trim() && tw`opacity-50`]}
                disabled={!filterName.trim()}
              >
                <Text style={tw`text-center font-semibold text-white`}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {compareItems.length > 0 && (
        <View style={tw`absolute bottom-0 left-0 right-0 bg-yellow-600 px-5 py-4`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={tw`text-white font-bold text-base`}>
                {compareItems.length} {compareItems.length === 1 ? 'Product' : 'Products'} Selected
              </Text>
              <Text style={tw`text-yellow-100 text-xs`}>
                {compareItems.length < 3 ? `Add ${3 - compareItems.length} more to compare` : 'Ready to compare'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Compare')}
              style={tw`bg-white px-6 py-3 rounded-xl`}
              disabled={compareItems.length < 2}
            >
              <Text style={tw`text-yellow-600 font-bold text-sm`}>
                Compare →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
