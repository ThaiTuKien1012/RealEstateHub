import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import tw from 'twrnc';
import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';

export const AddProductScreen: React.FC = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    category: '',
    movement: '',
    caseMaterial: '',
    caseDiameter: '',
    strapMaterial: '',
    waterResistance: '',
    color: '',
    stock: '',
    images: '',
    isFeatured: false,
    isBestSeller: false,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a valid number (0 or greater)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      setErrorMessage('Please fix the errors below');
      return;
    }

    setLoading(true);
    try {
      const token = (global as any).localStorage?.getItem('authToken');
      
      const imagesArray = formData.images 
        ? formData.images.split(',').map(url => url.trim()).filter(url => url)
        : [];

      const productData = {
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        description: formData.description || null,
        category: formData.category || null,
        movement: formData.movement || null,
        caseMaterial: formData.caseMaterial || null,
        caseDiameter: formData.caseDiameter ? parseInt(formData.caseDiameter) : null,
        strapMaterial: formData.strapMaterial || null,
        waterResistance: formData.waterResistance ? parseInt(formData.waterResistance) : null,
        color: formData.color || null,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        images: imagesArray,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
      };

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/watches`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccessMessage('✅ Product added successfully!');
        
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });
        queryClient.invalidateQueries({ queryKey: ['bestsellers'] });
        
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      }
    } catch (error: any) {
      console.error('Add product error:', error);
      setErrorMessage(error?.response?.data?.error?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-6 py-4 border-b border-gray-200`}>
        <Text style={tw`text-2xl font-bold`}>Add New Product</Text>
      </View>

      {successMessage && (
        <View style={tw`bg-green-50 border border-green-200 mx-6 mt-4 px-4 py-3 rounded-xl`}>
          <Text style={tw`text-green-800 font-semibold text-center`}>{successMessage}</Text>
        </View>
      )}

      {errorMessage && (
        <View style={tw`bg-red-50 border border-red-200 mx-6 mt-4 px-4 py-3 rounded-xl`}>
          <Text style={tw`text-red-800 font-semibold text-center`}>{errorMessage}</Text>
        </View>
      )}

      <ScrollView style={tw`flex-1 px-6 py-4`}>
        <View style={tw`bg-white rounded-2xl p-6 mb-6`}>
          <Text style={tw`text-lg font-bold mb-4`}>Basic Information</Text>
          
          <Text style={tw`text-sm text-gray-700 mb-2`}>Product Name *</Text>
          <TextInput
            style={tw`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3`}
            placeholder="Rolex Submariner Date"
            placeholderTextColor="#9CA3AF"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
          />
          {errors.name && <Text style={tw`text-red-500 text-xs mt-1 mb-3`}>{errors.name}</Text>}
          {!errors.name && <View style={tw`mb-4`} />}

          <Text style={tw`text-sm text-gray-700 mb-2`}>Brand *</Text>
          <TextInput
            style={tw`bg-gray-50 border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3`}
            placeholder="Rolex"
            placeholderTextColor="#9CA3AF"
            value={formData.brand}
            onChangeText={(value) => updateField('brand', value)}
          />
          {errors.brand && <Text style={tw`text-red-500 text-xs mt-1 mb-3`}>{errors.brand}</Text>}
          {!errors.brand && <View style={tw`mb-4`} />}

          <Text style={tw`text-sm text-gray-700 mb-2`}>Price (USD) *</Text>
          <TextInput
            style={tw`bg-gray-50 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3`}
            placeholder="12500"
            placeholderTextColor="#9CA3AF"
            value={formData.price}
            onChangeText={(value) => updateField('price', value)}
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={tw`text-red-500 text-xs mt-1 mb-3`}>{errors.price}</Text>}
          {!errors.price && <View style={tw`mb-4`} />}

          <Text style={tw`text-sm text-gray-700 mb-2`}>Category *</Text>
          <TextInput
            style={tw`bg-gray-50 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3`}
            placeholder="Luxury, Sports, Dress..."
            placeholderTextColor="#9CA3AF"
            value={formData.category}
            onChangeText={(value) => updateField('category', value)}
          />
          {errors.category && <Text style={tw`text-red-500 text-xs mt-1 mb-3`}>{errors.category}</Text>}
          {!errors.category && <View style={tw`mb-4`} />}

          <Text style={tw`text-sm text-gray-700 mb-2`}>Stock Quantity *</Text>
          <TextInput
            style={tw`bg-gray-50 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3`}
            placeholder="10"
            placeholderTextColor="#9CA3AF"
            value={formData.stock}
            onChangeText={(value) => updateField('stock', value)}
            keyboardType="number-pad"
          />
          {errors.stock && <Text style={tw`text-red-500 text-xs mt-1 mb-3`}>{errors.stock}</Text>}
          {!errors.stock && <View style={tw`mb-4`} />}

          <Text style={tw`text-sm text-gray-700 mb-2`}>Description *</Text>
          <TextInput
            style={tw`bg-gray-50 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3`}
            placeholder="Product description..."
            placeholderTextColor="#9CA3AF"
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && <Text style={tw`text-red-500 text-xs mt-1 mb-3`}>{errors.description}</Text>}
          {!errors.description && <View style={tw`mb-4`} />}
        </View>

        <View style={tw`bg-white rounded-2xl p-6 mb-6`}>
          <Text style={tw`text-lg font-bold mb-4`}>Technical Specifications</Text>
          
          <Text style={tw`text-sm text-gray-700 mb-2`}>Movement</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Automatic"
            placeholderTextColor="#9CA3AF"
            value={formData.movement}
            onChangeText={(value) => updateField('movement', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Case Material</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Stainless Steel"
            placeholderTextColor="#9CA3AF"
            value={formData.caseMaterial}
            onChangeText={(value) => updateField('caseMaterial', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Case Diameter (mm)</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="40"
            placeholderTextColor="#9CA3AF"
            value={formData.caseDiameter}
            onChangeText={(value) => updateField('caseDiameter', value)}
            keyboardType="number-pad"
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Strap Material</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Leather, Steel, Rubber..."
            placeholderTextColor="#9CA3AF"
            value={formData.strapMaterial}
            onChangeText={(value) => updateField('strapMaterial', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Water Resistance (meters)</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="300"
            placeholderTextColor="#9CA3AF"
            value={formData.waterResistance}
            onChangeText={(value) => updateField('waterResistance', value)}
            keyboardType="number-pad"
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Color</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Black, Blue, Silver..."
            placeholderTextColor="#9CA3AF"
            value={formData.color}
            onChangeText={(value) => updateField('color', value)}
          />
        </View>

        <View style={tw`bg-white rounded-2xl p-6 mb-6`}>
          <Text style={tw`text-lg font-bold mb-4`}>Images & Settings</Text>
          
          <Text style={tw`text-sm text-gray-700 mb-2`}>Image URLs (comma separated)</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            placeholderTextColor="#9CA3AF"
            value={formData.images}
            onChangeText={(value) => updateField('images', value)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-sm text-gray-700`}>Featured Product</Text>
            <Switch
              value={formData.isFeatured}
              onValueChange={(value) => updateField('isFeatured', value)}
            />
          </View>

          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-sm text-gray-700`}>Best Seller</Text>
            <Switch
              value={formData.isBestSeller}
              onValueChange={(value) => updateField('isBestSeller', value)}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          style={tw`bg-yellow-600 py-4 rounded-xl mb-6`}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-bold text-lg`}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`bg-gray-200 py-4 rounded-xl mb-10`}
        >
          <Text style={tw`text-gray-700 text-center font-bold text-lg`}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
