import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import tw from 'twrnc';
import { AdminDashboardScreen, OrderManagementScreen, UserManagementScreen, AdminSettingsScreen } from '../screens';
import { AdminProductsScreen } from '../screens/admin/AdminProductsScreen';

const Tab = createBottomTabNavigator();

export const AdminBottomTabNavigator: React.FC = () => {
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
        name="DashboardTab"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>◧</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={AdminProductsScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>◫</Text>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrderManagementScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>☰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="UsersTab"
        component={UserManagementScreen}
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>◉</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={AdminSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>⚙</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
