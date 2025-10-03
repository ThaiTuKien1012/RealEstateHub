import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';

export const AddProductScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
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

  const handleSubmit = async () => {
    if (!formData.name || !formData.brand || !formData.price) {
      Alert.alert('Error', 'Please fill in required fields: Name, Brand, Price');
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
        Alert.alert('Success', 'Product added successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      }
    } catch (error: any) {
      console.error('Add product error:', error);
      Alert.alert('Error', error?.response?.data?.error?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-6 py-4 border-b border-gray-200`}>
        <Text style={tw`text-2xl font-bold`}>Add New Product</Text>
      </View>

      <ScrollView style={tw`flex-1 px-6 py-4`}>
        <View style={tw`bg-white rounded-2xl p-6 mb-6`}>
          <Text style={tw`text-lg font-bold mb-4`}>Basic Information</Text>
          
          <Text style={tw`text-sm text-gray-700 mb-2`}>Product Name *</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Rolex Submariner Date"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Brand *</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Rolex"
            value={formData.brand}
            onChangeText={(value) => updateField('brand', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Price (USD) *</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="12500"
            value={formData.price}
            onChangeText={(value) => updateField('price', value)}
            keyboardType="decimal-pad"
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Category</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Luxury, Sports, Dress..."
            value={formData.category}
            onChangeText={(value) => updateField('category', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Stock Quantity</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="10"
            value={formData.stock}
            onChangeText={(value) => updateField('stock', value)}
            keyboardType="number-pad"
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Description</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Product description..."
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={tw`bg-white rounded-2xl p-6 mb-6`}>
          <Text style={tw`text-lg font-bold mb-4`}>Technical Specifications</Text>
          
          <Text style={tw`text-sm text-gray-700 mb-2`}>Movement</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Automatic"
            value={formData.movement}
            onChangeText={(value) => updateField('movement', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Case Material</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Stainless Steel"
            value={formData.caseMaterial}
            onChangeText={(value) => updateField('caseMaterial', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Case Diameter (mm)</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="40"
            value={formData.caseDiameter}
            onChangeText={(value) => updateField('caseDiameter', value)}
            keyboardType="number-pad"
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Strap Material</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Leather, Steel, Rubber..."
            value={formData.strapMaterial}
            onChangeText={(value) => updateField('strapMaterial', value)}
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Water Resistance (meters)</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="300"
            value={formData.waterResistance}
            onChangeText={(value) => updateField('waterResistance', value)}
            keyboardType="number-pad"
          />

          <Text style={tw`text-sm text-gray-700 mb-2`}>Color</Text>
          <TextInput
            style={tw`bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Black, Blue, Silver..."
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
