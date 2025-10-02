import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import tw from 'twrnc';
import { Filter } from '../types';
import { BRANDS, MOVEMENTS, MATERIALS } from '../constants';

interface FilterPanelProps {
  filters: Partial<Filter>;
  onFilterChange: (filters: Partial<Filter>) => void;
  onClose?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<Partial<Filter>>(filters);

  const toggleBrand = (brand: string) => {
    const brands = localFilters.brands || [];
    const newBrands = brands.includes(brand)
      ? brands.filter(b => b !== brand)
      : [...brands, brand];
    setLocalFilters({ ...localFilters, brands: newBrands });
  };

  const toggleMovement = (movement: 'automatic' | 'quartz' | 'mechanical') => {
    const movements = localFilters.movements || [];
    const newMovements = movements.includes(movement)
      ? movements.filter(m => m !== movement)
      : [...movements, movement];
    setLocalFilters({ ...localFilters, movements: newMovements });
  };

  const toggleMaterial = (material: string) => {
    const materials = localFilters.materials || [];
    const newMaterials = materials.includes(material)
      ? materials.filter(m => m !== material)
      : [...materials, material];
    setLocalFilters({ ...localFilters, materials: newMaterials });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    onClose?.();
  };

  const resetFilters = () => {
    const emptyFilters: Partial<Filter> = {
      brands: [],
      movements: [],
      materials: [],
      priceRange: [0, 50000],
      diameterRange: [30, 50],
      colors: [],
      searchQuery: '',
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <View style={tw`bg-white h-full`}>
      <View style={tw`p-4 border-b border-gray-200 flex-row justify-between items-center`}>
        <Text style={tw`text-xl font-bold`}>Filters</Text>
        <TouchableOpacity onPress={resetFilters} accessibilityLabel="Reset all filters" accessibilityRole="button">
          <Text style={tw`text-yellow-600 font-medium`}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-3`}>Brand</Text>
          <View style={tw`flex-row flex-wrap gap-2`}>
            {BRANDS.map(brand => (
              <TouchableOpacity
                key={brand}
                onPress={() => toggleBrand(brand)}
                style={[
                  tw`px-3 py-2 rounded-full border`,
                  (localFilters.brands || []).includes(brand)
                    ? tw`bg-yellow-600 border-yellow-600`
                    : tw`bg-white border-gray-300`,
                ]}
                accessibilityLabel={`Filter by ${brand}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: (localFilters.brands || []).includes(brand) }}
              >
                <Text
                  style={[
                    tw`text-sm`,
                    (localFilters.brands || []).includes(brand)
                      ? tw`text-white`
                      : tw`text-gray-700`,
                  ]}
                >
                  {brand}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-3`}>Movement</Text>
          <View style={tw`flex-row flex-wrap gap-2`}>
            {MOVEMENTS.map(movement => (
              <TouchableOpacity
                key={movement}
                onPress={() => toggleMovement(movement)}
                style={[
                  tw`px-3 py-2 rounded-full border`,
                  (localFilters.movements || []).includes(movement)
                    ? tw`bg-yellow-600 border-yellow-600`
                    : tw`bg-white border-gray-300`,
                ]}
                accessibilityLabel={`Filter by ${movement} movement`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: (localFilters.movements || []).includes(movement) }}
              >
                <Text
                  style={[
                    tw`text-sm capitalize`,
                    (localFilters.movements || []).includes(movement)
                      ? tw`text-white`
                      : tw`text-gray-700`,
                  ]}
                >
                  {movement}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-3`}>Material</Text>
          <View style={tw`flex-row flex-wrap gap-2`}>
            {MATERIALS.map(material => (
              <TouchableOpacity
                key={material}
                onPress={() => toggleMaterial(material)}
                style={[
                  tw`px-3 py-2 rounded-full border`,
                  (localFilters.materials || []).includes(material)
                    ? tw`bg-yellow-600 border-yellow-600`
                    : tw`bg-white border-gray-300`,
                ]}
                accessibilityLabel={`Filter by ${material}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: (localFilters.materials || []).includes(material) }}
              >
                <Text
                  style={[
                    tw`text-sm`,
                    (localFilters.materials || []).includes(material)
                      ? tw`text-white`
                      : tw`text-gray-700`,
                  ]}
                >
                  {material}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-semibold mb-3`}>Price Range</Text>
          
          <View style={tw`flex-row flex-wrap gap-2 mb-4`}>
            {[
              { label: 'Under $5K', range: [0, 5000] },
              { label: '$5K - $10K', range: [5000, 10000] },
              { label: '$10K - $20K', range: [10000, 20000] },
              { label: '$20K+', range: [20000, 50000] },
            ].map(preset => {
              const isSelected = localFilters.priceRange?.[0] === preset.range[0] && 
                                 localFilters.priceRange?.[1] === preset.range[1];
              return (
                <TouchableOpacity
                  key={preset.label}
                  onPress={() => setLocalFilters({ ...localFilters, priceRange: preset.range as [number, number] })}
                  style={[
                    tw`px-3 py-2 rounded-full border`,
                    isSelected
                      ? tw`bg-yellow-600 border-yellow-600`
                      : tw`bg-white border-gray-300`,
                  ]}
                >
                  <Text
                    style={[
                      tw`text-sm`,
                      isSelected ? tw`text-white` : tw`text-gray-700`,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={tw`text-sm text-gray-600 mb-2`}>Or set custom range:</Text>
          <View style={tw`flex-row gap-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Min ($)</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg px-3 py-2 bg-white`}
                keyboardType="numeric"
                placeholder="0"
                value={localFilters.priceRange?.[0]?.toString() || ''}
                onChangeText={(text) => {
                  const min = text ? parseInt(text) || 0 : 0;
                  const max = localFilters.priceRange?.[1] || 50000;
                  setLocalFilters({ ...localFilters, priceRange: [min, max] });
                }}
                accessibilityLabel="Minimum price"
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Max ($)</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg px-3 py-2 bg-white`}
                keyboardType="numeric"
                placeholder="50000"
                value={localFilters.priceRange?.[1]?.toString() || ''}
                onChangeText={(text) => {
                  const max = text ? parseInt(text) || 50000 : 50000;
                  const min = localFilters.priceRange?.[0] || 0;
                  setLocalFilters({ ...localFilters, priceRange: [min, max] });
                }}
                accessibilityLabel="Maximum price"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={tw`p-4 border-t border-gray-200`}>
        <TouchableOpacity
          onPress={applyFilters}
          style={tw`bg-yellow-600 py-3 rounded-lg`}
          accessibilityLabel="Apply filters"
          accessibilityRole="button"
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            Apply Filters
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
