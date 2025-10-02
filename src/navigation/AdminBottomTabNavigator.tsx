import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import tw from 'twrnc';
import { AdminDashboardScreen, OrderManagementScreen, UserManagementScreen, AdminSettingsScreen } from '../screens';

const Tab = createBottomTabNavigator();

export const AdminBottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a1a1a',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: tw`bg-white border-t border-gray-200`,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={tw`text-xs ${focused ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Dashboard
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Text style={tw`text-xl`}>{focused ? '📊' : '📈'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrderManagementScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={tw`text-xs ${focused ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Orders
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Text style={tw`text-xl`}>{focused ? '📦' : '📋'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="UsersTab"
        component={UserManagementScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={tw`text-xs ${focused ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Users
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Text style={tw`text-xl`}>{focused ? '👥' : '👤'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={AdminSettingsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={tw`text-xs ${focused ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Settings
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Text style={tw`text-xl`}>{focused ? '⚙️' : '⚙'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
