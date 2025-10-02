import React from 'react';
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
        tabBarActiveTintColor: '#d4af37',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#e5e5e5',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 24 }}>🏠</span>
          ),
        }}
      />
      <Tab.Screen 
        name="CatalogTab" 
        component={CatalogScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 24 }}>🔍</span>
          ),
        }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 24 }}>🛒</span>
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={isAuthenticated ? ProfileScreen : ProfileScreen}
        options={{
          tabBarLabel: isAuthenticated ? 'Profile' : 'Login',
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 24 }}>{isAuthenticated ? '👤' : '🔐'}</span>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
