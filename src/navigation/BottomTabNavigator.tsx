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
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 56,
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          backgroundColor: '#ffffff',
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 26, color: focused ? '#ee4d2d' : '#7a7a7a' }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="CatalogTab" 
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 26, color: focused ? '#ee4d2d' : '#7a7a7a' }}>☰</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen}
        options={{
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 26, color: focused ? '#ee4d2d' : '#7a7a7a' }}>🛒</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 26, color: focused ? '#ee4d2d' : '#7a7a7a' }}>
                {isAuthenticated ? '👤' : '🔐'}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
