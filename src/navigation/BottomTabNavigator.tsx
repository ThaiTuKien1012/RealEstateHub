import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, CatalogScreen, CartScreen, ProfileScreen } from '../screens';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => {
  const itemCount = useCart(state => state.getItemCount());
  const { isAuthenticated } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ee4d2d',
        tabBarInactiveTintColor: '#7a7a7a',
        tabBarStyle: {
          height: 60,
          paddingTop: 4,
          paddingBottom: 4,
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
          marginTop: -2,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, color: focused ? '#ee4d2d' : '#7a7a7a' }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="CatalogTab" 
        component={CatalogScreen}
        options={{
          tabBarLabel: 'Danh mục',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, color: focused ? '#ee4d2d' : '#7a7a7a' }}>☰</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen}
        options={{
          tabBarLabel: 'Giỏ hàng',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, color: focused ? '#ee4d2d' : '#7a7a7a' }}>🛒</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={isAuthenticated ? ProfileScreen : ProfileScreen}
        options={{
          tabBarLabel: isAuthenticated ? 'Tài khoản' : 'Đăng nhập',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, color: focused ? '#ee4d2d' : '#7a7a7a' }}>
                {isAuthenticated ? '👤' : '🔐'}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
