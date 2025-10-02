import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated, logout } = useAuth();
  const wishlistCount = useWishlist(state => state.items.length);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <View style={tw`w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6`}>
          <Text style={tw`text-4xl text-gray-600`}>◉</Text>
        </View>
        <Text style={tw`text-2xl font-bold mb-2`}>Sign In</Text>
        <Text style={tw`text-gray-600 mb-8 text-center`}>
          Access your account and orders
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Auth')}
          style={tw`bg-yellow-600 py-3.5 px-16 rounded-xl`}
          accessibilityLabel="Sign in"
          accessibilityRole="button"
        >
          <Text style={tw`text-white font-semibold text-base`}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-yellow-600 pt-8 pb-12 px-6 items-center`}>
        <View style={tw`w-20 h-20 bg-white rounded-full items-center justify-center mb-3`}>
          <Text style={tw`text-4xl text-gray-700`}>◉</Text>
        </View>
        <Text style={tw`text-white text-xl font-bold mb-1`}>{user?.name || 'User'}</Text>
        <Text style={tw`text-yellow-100 text-sm`}>{user?.email || ''}</Text>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={tw`mt-4 bg-white px-6 py-2.5 rounded-xl`}
          accessibilityLabel="Edit profile"
          accessibilityRole="button"
        >
          <Text style={tw`text-yellow-600 font-semibold`}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`px-4 py-6`}>
        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>My Account</Text>
        <View style={tw`bg-white rounded-2xl overflow-hidden mb-6`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Wishlist')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="View wishlist"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>♡</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>My Wishlist</Text>
            {wishlistCount > 0 && (
              <View style={tw`bg-yellow-600 px-2 py-1 rounded-full mr-2`}>
                <Text style={tw`text-white text-xs font-bold`}>{wishlistCount}</Text>
              </View>
            )}
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'CartTab' })}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="View cart"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>◫</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>My Cart</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Order History', 'View your past orders')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Order history"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>⊞</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Order History</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Addresses', 'Manage your shipping addresses')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Saved addresses"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>⌂</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Saved Addresses</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Payment Methods', 'Manage your payment cards')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Payment methods"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>▭</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Payment Methods</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Rewards', 'Your points: 1,250')}
            style={tw`flex-row items-center px-4 py-4`}
            accessibilityLabel="Rewards and points"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>★</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Rewards & Points</Text>
            <View style={tw`bg-yellow-100 px-2 py-1 rounded-full mr-2`}>
              <Text style={tw`text-yellow-700 text-xs font-bold`}>1,250</Text>
            </View>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>Settings</Text>
        <View style={tw`bg-white rounded-2xl overflow-hidden mb-6`}>
          <TouchableOpacity
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Account settings"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>⚙</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Settings</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <View style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}>
            <Text style={tw`text-xl text-gray-700 mr-3`}>○</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d1d5db', true: '#fbbf24' }}
              thumbColor={notifications ? '#d97706' : '#9ca3af'}
            />
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('Language', 'English, Tiếng Việt')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Language settings"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>◐</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Language</Text>
            <Text style={tw`text-gray-500 mr-2`}>English</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <View style={tw`flex-row items-center px-4 py-4`}>
            <Text style={tw`text-xl text-gray-700 mr-3`}>◑</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#d1d5db', true: '#374151' }}
              thumbColor={darkMode ? '#111827' : '#9ca3af'}
            />
          </View>
        </View>

        <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>Support & More</Text>
        <View style={tw`bg-white rounded-2xl overflow-hidden mb-6`}>
          <TouchableOpacity
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Help center"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>?</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Help Center</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Contact Support', 'Email: support@timeless.com\nPhone: 1-800-WATCH')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Contact support"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>✉</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Contact Support</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Rate App', 'Thank you for your feedback!')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Rate app"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>☆</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Rate App</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Refer a Friend', 'Share your referral code: WATCH2025')}
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-100`}
            accessibilityLabel="Refer a friend"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>⇄</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>Refer a Friend</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center px-4 py-4`}
            accessibilityLabel="About"
            accessibilityRole="button"
          >
            <Text style={tw`text-xl text-gray-700 mr-3`}>i</Text>
            <Text style={tw`text-gray-900 font-medium flex-1`}>About</Text>
            <Text style={tw`text-gray-500 mr-2`}>v1.0.0</Text>
            <Text style={tw`text-gray-400`}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={tw`bg-red-50 py-4 rounded-2xl mb-8`}
          accessibilityLabel="Logout"
          accessibilityRole="button"
        >
          <Text style={tw`text-red-600 text-center font-semibold text-base`}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
