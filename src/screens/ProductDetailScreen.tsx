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
import { Header, Footer, ProductGallery } from '../components';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
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
      <View style={tw`flex-1 bg-white`}>
        <Header />
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-gray-600 text-lg`}>Product not found</Text>
        </View>
      </View>
    );
  }

  const product = data.data;
  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    navigation.navigate('Cart');
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Header />
      <ScrollView>
        <View style={tw`max-w-7xl mx-auto px-4 py-6 w-full`}>
          <View style={tw`flex-row flex-wrap gap-8`}>
            <View style={tw`flex-1 min-w-[300px]`}>
              <ProductGallery images={product.images} />
            </View>

            <View style={tw`flex-1 min-w-[300px]`}>
              <Text style={tw`text-gray-500 text-sm uppercase tracking-wide mb-2`}>
                {product.brand}
              </Text>
              <Text style={tw`text-3xl font-bold mb-4`}>{product.name}</Text>

              <View style={tw`flex-row items-center gap-4 mb-4`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-yellow-500 text-lg`}>★</Text>
                  <Text style={tw`text-gray-700 ml-1`}>
                    {product.rating} ({product.reviewCount} reviews)
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row items-center gap-3 mb-6`}>
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
                  <Text style={tw`font-semibold mb-2`}>Select Variant:</Text>
                  <View style={tw`flex-row flex-wrap gap-2`}>
                    {product.variants.map(variant => (
                      <TouchableOpacity
                        key={variant.id}
                        onPress={() => setSelectedVariant(variant)}
                        style={[
                          tw`px-4 py-2 border rounded`,
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
                              ? tw`text-yellow-700`
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
                <Text style={tw`font-semibold mb-2`}>Quantity:</Text>
                <View style={tw`flex-row items-center gap-3`}>
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    style={tw`border border-gray-300 rounded w-10 h-10 items-center justify-center`}
                    accessibilityLabel="Decrease quantity"
                    accessibilityRole="button"
                  >
                    <Text style={tw`text-xl`}>-</Text>
                  </TouchableOpacity>
                  <Text style={tw`text-lg font-medium w-12 text-center`}>{quantity}</Text>
                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    style={tw`border border-gray-300 rounded w-10 h-10 items-center justify-center`}
                    accessibilityLabel="Increase quantity"
                    accessibilityRole="button"
                  >
                    <Text style={tw`text-xl`}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {product.stock > 0 ? (
                <TouchableOpacity
                  onPress={handleAddToCart}
                  style={tw`bg-yellow-600 py-4 rounded-lg mb-3`}
                  accessibilityLabel="Add to cart"
                  accessibilityRole="button"
                >
                  <Text style={tw`text-white text-center font-semibold text-lg`}>
                    Add to Cart
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={tw`bg-gray-300 py-4 rounded-lg mb-3`}>
                  <Text style={tw`text-gray-600 text-center font-semibold text-lg`}>
                    Out of Stock
                  </Text>
                </View>
              )}

              {product.stock < 5 && product.stock > 0 && (
                <Text style={tw`text-orange-600 text-sm text-center`}>
                  Only {product.stock} left in stock
                </Text>
              )}
            </View>
          </View>

          <View style={tw`mt-12`}>
            <Text style={tw`text-2xl font-bold mb-4`}>Specifications</Text>
            <View style={tw`bg-gray-50 rounded-lg p-4`}>
              {product.specifications?.map((spec, index) => (
                <View
                  key={index}
                  style={tw`flex-row justify-between py-3 ${
                    index !== 0 ? 'border-t border-gray-200' : ''
                  }`}
                >
                  <Text style={tw`text-gray-600`}>{spec.label}</Text>
                  <Text style={tw`font-medium`}>{spec.value}</Text>
                </View>
              )) || (
                <>
                  <View style={tw`flex-row justify-between py-3`}>
                    <Text style={tw`text-gray-600`}>Movement</Text>
                    <Text style={tw`font-medium capitalize`}>{product.movement}</Text>
                  </View>
                  <View style={tw`flex-row justify-between py-3 border-t border-gray-200`}>
                    <Text style={tw`text-gray-600`}>Case Diameter</Text>
                    <Text style={tw`font-medium`}>{product.caseDiameter}mm</Text>
                  </View>
                  <View style={tw`flex-row justify-between py-3 border-t border-gray-200`}>
                    <Text style={tw`text-gray-600`}>Case Material</Text>
                    <Text style={tw`font-medium`}>{product.caseMaterial}</Text>
                  </View>
                  <View style={tw`flex-row justify-between py-3 border-t border-gray-200`}>
                    <Text style={tw`text-gray-600`}>Strap Material</Text>
                    <Text style={tw`font-medium`}>{product.strapMaterial}</Text>
                  </View>
                  <View style={tw`flex-row justify-between py-3 border-t border-gray-200`}>
                    <Text style={tw`text-gray-600`}>Water Resistance</Text>
                    <Text style={tw`font-medium`}>{product.waterResistance}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
};
