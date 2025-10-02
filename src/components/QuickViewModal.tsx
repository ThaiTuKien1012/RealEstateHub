import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { Product } from '../types';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

interface QuickViewModalProps {
  visible: boolean;
  productId: string | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  visible,
  productId,
  onClose,
}) => {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useProduct(productId || '');
  const addItem = useCart(state => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const product = data?.data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, undefined);
      onClose();
    }
  };

  const handleViewFullDetails = () => {
    if (product) {
      onClose();
      navigation.navigate('ProductDetail', { id: product.id });
    }
  };

  if (!visible || !productId) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/50 justify-end`}>
        <View
          style={[
            tw`bg-white rounded-t-3xl max-h-4/5`,
            Platform.select({
              ios: {
                boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
              },
              android: { elevation: 8 },
              web: {
                boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
              },
            }),
          ]}
        >
          <View style={tw`flex-row items-center justify-between px-5 py-4 border-b border-gray-100`}>
            <Text style={tw`text-lg font-bold text-gray-900`}>Quick View</Text>
            <TouchableOpacity
              onPress={onClose}
              style={tw`w-10 h-10 items-center justify-center`}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Text style={tw`text-2xl text-gray-600`}>✕</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={tw`py-24`}>
              <ActivityIndicator size="large" color="#d4af37" />
            </View>
          ) : product ? (
            <ScrollView style={tw`flex-1`}>
              <Image
                source={{ uri: product.images[0] }}
                style={tw`w-full h-64 bg-gray-100`}
                resizeMode="cover"
              />

              <View style={tw`p-5`}>
                <Text style={tw`text-gray-500 text-xs uppercase tracking-wider mb-1`}>
                  {product.brand}
                </Text>
                <Text style={tw`text-gray-900 font-bold text-xl mb-3`}>
                  {product.name}
                </Text>

                <View style={tw`flex-row items-center mb-4`}>
                  <Text style={tw`text-yellow-500 text-lg`}>★</Text>
                  <Text style={tw`text-gray-600 text-sm ml-1`}>
                    {product.rating} ({product.reviewCount} reviews)
                  </Text>
                </View>

                <View style={tw`flex-row items-center gap-3 mb-5`}>
                  {product.originalPrice && (
                    <Text style={tw`text-gray-400 line-through text-base`}>
                      {formatPrice(product.originalPrice)}
                    </Text>
                  )}
                  <Text style={tw`text-gray-900 font-bold text-2xl`}>
                    {formatPrice(product.price)}
                  </Text>
                </View>

                <View style={tw`bg-gray-50 rounded-xl p-4 mb-5`}>
                  <Text style={tw`text-gray-700 font-semibold mb-3`}>Specifications</Text>
                  <View style={tw`gap-2`}>
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`text-gray-600 text-sm`}>Movement</Text>
                      <Text style={tw`text-gray-900 text-sm font-medium`}>{product.movement}</Text>
                    </View>
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`text-gray-600 text-sm`}>Case Material</Text>
                      <Text style={tw`text-gray-900 text-sm font-medium`}>{product.caseMaterial}</Text>
                    </View>
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`text-gray-600 text-sm`}>Diameter</Text>
                      <Text style={tw`text-gray-900 text-sm font-medium`}>{product.caseDiameter}</Text>
                    </View>
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`text-gray-600 text-sm`}>Water Resistance</Text>
                      <Text style={tw`text-gray-900 text-sm font-medium`}>{product.waterResistance}</Text>
                    </View>
                  </View>
                </View>

                {product.variants && product.variants.length > 0 && (
                  <View style={tw`mb-5`}>
                    <Text style={tw`text-gray-700 font-semibold mb-3`}>
                      {product.variants[0].type}
                    </Text>
                    <View style={tw`flex-row flex-wrap gap-2`}>
                      {product.variants.map((variant) => (
                        <TouchableOpacity
                          key={variant.value}
                          onPress={() => setSelectedVariant(variant.value)}
                          style={[
                            tw`px-4 py-2.5 rounded-xl border-2`,
                            selectedVariant === variant.value
                              ? tw`border-yellow-600 bg-yellow-50`
                              : tw`border-gray-200 bg-white`,
                          ]}
                        >
                          <Text
                            style={[
                              tw`text-sm font-medium`,
                              selectedVariant === variant.value
                                ? tw`text-yellow-700`
                                : tw`text-gray-700`,
                            ]}
                          >
                            {variant.value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={tw`mb-5`}>
                  <Text style={tw`text-gray-700 font-semibold mb-3`}>Quantity</Text>
                  <View style={tw`flex-row items-center gap-3`}>
                    <TouchableOpacity
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                      style={tw`w-10 h-10 bg-gray-100 rounded-xl items-center justify-center`}
                      accessibilityLabel="Decrease quantity"
                    >
                      <Text style={tw`text-xl font-bold text-gray-700`}>−</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-lg font-semibold text-gray-900 min-w-10 text-center`}>
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      style={tw`w-10 h-10 bg-gray-100 rounded-xl items-center justify-center`}
                      accessibilityLabel="Increase quantity"
                    >
                      <Text style={tw`text-xl font-bold text-gray-700`}>+</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-sm text-gray-500 ml-2`}>
                      {product.stock} in stock
                    </Text>
                  </View>
                </View>

                <View style={tw`flex-row gap-3 mb-6`}>
                  <TouchableOpacity
                    onPress={handleAddToCart}
                    style={tw`flex-1 bg-yellow-600 py-4 rounded-xl items-center justify-center`}
                    accessibilityLabel="Add to cart"
                    accessibilityRole="button"
                    disabled={product.stock === 0}
                  >
                    <Text style={tw`text-white font-bold text-base`}>
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleViewFullDetails}
                  style={tw`border-2 border-gray-900 py-4 rounded-xl items-center justify-center mb-4`}
                  accessibilityLabel="View full details"
                  accessibilityRole="button"
                >
                  <Text style={tw`text-gray-900 font-bold text-base`}>View Full Details</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
