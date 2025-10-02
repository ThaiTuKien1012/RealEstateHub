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
        tabBarActiveTintColor: '#1a1a1a',
        tabBarInactiveTintColor: '#999999',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
          marginTop: 2,
        },
        tabBarStyle: {
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          backgroundColor: '#ffffff',
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, color }}>⌂</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="CatalogTab" 
        component={CatalogScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, color }}>☰</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, color }}>◫</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: isAuthenticated ? 'Profile' : 'Login',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, color }}>
                {isAuthenticated ? '◉' : '◉'}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
