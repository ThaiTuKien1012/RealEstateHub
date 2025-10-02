import React, { useState } from 'react';
import { View, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import tw from 'twrnc';

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { width } = Dimensions.get('window');

  return (
    <View style={tw`mb-6`}>
      <View style={tw`aspect-square bg-gray-100 mb-4`}>
        <Image
          source={{ uri: images[selectedIndex] }}
          style={tw`w-full h-full`}
          resizeMode="cover"
          accessibilityLabel={`Product image ${selectedIndex + 1} of ${images.length}`}
        />
      </View>

      {images.length > 1 && (
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedIndex(index)}
              style={[
                tw`mr-2 border-2`,
                selectedIndex === index ? tw`border-yellow-600` : tw`border-gray-300`,
              ]}
              accessibilityLabel={`Select image ${index + 1}`}
              accessibilityRole="button"
            >
              <Image
                source={{ uri: item }}
                style={tw`w-20 h-20`}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={tw`px-4`}
        />
      )}
    </View>
  );
};
