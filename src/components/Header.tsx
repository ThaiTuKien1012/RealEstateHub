import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  showSearch?: boolean;
  onSearchChange?: (text: string) => void;
  searchValue?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  showSearch = false, 
  onSearchChange,
  searchValue = ''
}) => {
  const navigation = useNavigation<any>();
  const itemCount = useCart(state => state.getItemCount());
  const { isAuthenticated, user } = useAuth();

  return (
    <View style={tw`bg-white border-b border-gray-200`}>
      <View style={tw`px-4 py-3 flex-row items-center justify-between max-w-7xl mx-auto w-full`}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
          accessibilityLabel="Go to home"
          accessibilityRole="button"
        >
          <Text style={tw`text-2xl font-bold text-gray-900`}>TIMELESS</Text>
        </TouchableOpacity>

        <View style={tw`flex-row items-center gap-4`}>
          {showSearch && Platform.OS === 'web' && (
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-4 py-2 w-64`}
              placeholder="Search watches..."
              value={searchValue}
              onChangeText={onSearchChange}
              accessibilityLabel="Search watches"
            />
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'CatalogTab' })}
            style={tw`px-3 py-2`}
            accessibilityLabel="Browse catalog"
            accessibilityRole="button"
          >
            <Text style={tw`text-gray-700 font-medium`}>Catalog</Text>
          </TouchableOpacity>

          {isAuthenticated ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Main', { screen: 'ProfileTab' })}
              style={tw`px-3 py-2`}
              accessibilityLabel={`Profile: ${user?.name}`}
              accessibilityRole="button"
            >
              <Text style={tw`text-gray-700 font-medium`}>
                {user?.name?.split(' ')[0] || 'Profile'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Auth')}
              style={tw`px-3 py-2`}
              accessibilityLabel="Login or sign up"
              accessibilityRole="button"
            >
              <Text style={tw`text-gray-700 font-medium`}>Login</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'CartTab' })}
            style={tw`relative px-3 py-2`}
            accessibilityLabel={`Shopping cart with ${itemCount} items`}
            accessibilityRole="button"
          >
            <Text style={tw`text-gray-700 font-medium`}>Cart</Text>
            {itemCount > 0 && (
              <View style={tw`absolute -top-1 -right-1 bg-yellow-600 rounded-full w-5 h-5 items-center justify-center`}>
                <Text style={tw`text-white text-xs font-bold`}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && Platform.OS !== 'web' && (
        <View style={tw`px-4 pb-3`}>
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-2 w-full`}
            placeholder="Search watches..."
            value={searchValue}
            onChangeText={onSearchChange}
            accessibilityLabel="Search watches"
          />
        </View>
      )}
    </View>
  );
};
