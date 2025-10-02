import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { ProductGallery } from '../components';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useWishlist } from '../hooks/useWishlist';
import { ProductVariant } from '../types';

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;
  const { data, isLoading } = useProduct(id);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart(state => state.addItem);
  const addToRecentlyViewed = useRecentlyViewed(state => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (data?.data) {
      addToRecentlyViewed(data.data);
    }
  }, [data, addToRecentlyViewed]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  if (!data?.data) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Product not found</Text>
      </View>
    );
  }

  const product = data.data;
  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);
  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    navigation.navigate('Main', { screen: 'CartTab' });
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-32`}>
        <ProductGallery images={product.images} />

        <View style={tw`px-4 py-6`}>
          <View style={tw`flex-row items-start justify-between mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-500 text-sm uppercase tracking-wide mb-1`}>
                {product.brand}
              </Text>
              <Text style={tw`text-2xl font-bold mb-2`}>{product.name}</Text>
            </View>
            <TouchableOpacity
              onPress={handleWishlistToggle}
              style={tw`bg-gray-100 w-12 h-12 rounded-full items-center justify-center ml-3`}
            >
              <Text style={tw`text-2xl`}>{inWishlist ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`flex-row items-center mb-4`}>
            <Text style={tw`text-yellow-500 text-lg`}>★</Text>
            <Text style={tw`text-gray-700 ml-1`}>
              {product.rating} ({product.reviewCount} reviews)
            </Text>
          </View>

          <View style={tw`flex-row items-center gap-3 mb-4`}>
            {product.originalPrice && (
              <Text style={tw`text-gray-400 line-through text-xl`}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
            <Text style={tw`text-3xl font-bold`}>
              {formatPrice(currentPrice)}
            </Text>
          </View>

          <Text style={tw`text-gray-700 leading-6 mb-6`}>
            {product.description}
          </Text>

          {product.variants && product.variants.length > 0 && (
            <View style={tw`mb-6`}>
              <Text style={tw`font-semibold mb-3`}>Select Variant</Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {product.variants.map(variant => (
                  <TouchableOpacity
                    key={variant.id}
                    onPress={() => setSelectedVariant(variant)}
                    style={[
                      tw`px-4 py-2.5 border rounded-xl`,
                      selectedVariant?.id === variant.id
                        ? tw`border-yellow-600 bg-yellow-50`
                        : tw`border-gray-300`,
                    ]}
                    accessibilityLabel={`Select ${variant.name}`}
                    accessibilityRole="button"
                  >
                    <Text
                      style={
                        selectedVariant?.id === variant.id
                          ? tw`text-yellow-700 font-medium`
                          : tw`text-gray-700`
                      }
                    >
                      {variant.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={tw`mb-6`}>
            <Text style={tw`font-semibold mb-3`}>Quantity</Text>
            <View style={tw`flex-row items-center gap-3`}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={tw`bg-gray-100 rounded-xl w-12 h-12 items-center justify-center`}
                accessibilityLabel="Decrease quantity"
                accessibilityRole="button"
              >
                <Text style={tw`text-xl font-bold`}>-</Text>
              </TouchableOpacity>
              <Text style={tw`text-lg font-medium w-12 text-center`}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={tw`bg-gray-100 rounded-xl w-12 h-12 items-center justify-center`}
                accessibilityLabel="Increase quantity"
                accessibilityRole="button"
              >
                <Text style={tw`text-xl font-bold`}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`bg-gray-50 rounded-2xl p-4 mb-6`}>
            <Text style={tw`text-lg font-semibold mb-3`}>Specifications</Text>
            {product.specifications?.map((spec, index) => (
              <View
                key={index}
                style={tw`flex-row justify-between py-2 ${
                  index !== 0 ? 'border-t border-gray-200' : ''
                }`}
              >
                <Text style={tw`text-gray-600`}>{spec.label}</Text>
                <Text style={tw`font-medium`}>{spec.value}</Text>
              </View>
            )) || (
              <>
                <View style={tw`flex-row justify-between py-2`}>
                  <Text style={tw`text-gray-600`}>Movement</Text>
                  <Text style={tw`font-medium capitalize`}>{product.movement}</Text>
                </View>
                <View style={tw`flex-row justify-between py-2 border-t border-gray-200`}>
                  <Text style={tw`text-gray-600`}>Case Diameter</Text>
                  <Text style={tw`font-medium`}>{product.caseDiameter}mm</Text>
                </View>
                <View style={tw`flex-row justify-between py-2 border-t border-gray-200`}>
                  <Text style={tw`text-gray-600`}>Case Material</Text>
                  <Text style={tw`font-medium`}>{product.caseMaterial}</Text>
                </View>
                <View style={tw`flex-row justify-between py-2 border-t border-gray-200`}>
                  <Text style={tw`text-gray-600`}>Strap Material</Text>
                  <Text style={tw`font-medium`}>{product.strapMaterial}</Text>
                </View>
                <View style={tw`flex-row justify-between py-2 border-t border-gray-200`}>
                  <Text style={tw`text-gray-600`}>Water Resistance</Text>
                  <Text style={tw`font-medium`}>{product.waterResistance}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4`}>
        {product.stock > 0 ? (
          <TouchableOpacity
            onPress={handleAddToCart}
            style={tw`bg-yellow-600 py-4 rounded-xl`}
            accessibilityLabel="Add to cart"
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-center font-bold text-base`}>
              Add to Cart • {formatPrice(currentPrice * quantity)}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={tw`bg-gray-300 py-4 rounded-xl`}>
            <Text style={tw`text-gray-600 text-center font-semibold text-base`}>
              Out of Stock
            </Text>
          </View>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <Text style={tw`text-orange-600 text-sm text-center mt-2`}>
            ⚠️ Only {product.stock} left in stock
          </Text>
        )}
      </View>
    </View>
  );
};
