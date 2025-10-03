import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainNavigator } from './MainNavigator';
import { AdminRouteGuard } from '../components';
import { 
  ProductDetailScreen, 
  CheckoutScreen, 
  AuthScreen, 
  EditProfileScreen, 
  WishlistScreen, 
  OrderSuccessScreen, 
  CompareScreen,
  AdminDashboardScreen,
  OrderManagementScreen,
  UserManagementScreen,
  StoreManagementScreen,
  SupportManagementScreen
} from '../screens';
import { AdminProductsScreen } from '../screens/admin/AdminProductsScreen';
import { AddProductScreen } from '../screens/admin/AddProductScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#1a1a1a',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={MainNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen}
          options={{ title: 'Product Details' }}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{ title: 'Edit Profile' }}
        />
        <Stack.Screen 
          name="Wishlist" 
          component={WishlistScreen}
          options={{ title: 'My Wishlist' }}
        />
        <Stack.Screen 
          name="OrderSuccess" 
          component={OrderSuccessScreen}
          options={{ 
            title: 'Order Confirmed',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="Compare" 
          component={CompareScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          options={{ title: 'Admin Dashboard' }}
        >
          {() => <AdminRouteGuard><AdminDashboardScreen /></AdminRouteGuard>}
        </Stack.Screen>
        <Stack.Screen 
          name="ProductManagement" 
          options={{ title: 'Manage Products' }}
        >
          {() => <AdminRouteGuard><AdminProductsScreen /></AdminRouteGuard>}
        </Stack.Screen>
        <Stack.Screen 
          name="OrderManagement" 
          options={{ title: 'Manage Orders' }}
        >
          {() => <AdminRouteGuard><OrderManagementScreen /></AdminRouteGuard>}
        </Stack.Screen>
        <Stack.Screen 
          name="UserManagement" 
          options={{ title: 'Manage Users' }}
        >
          {() => <AdminRouteGuard><UserManagementScreen /></AdminRouteGuard>}
        </Stack.Screen>
        <Stack.Screen 
          name="StoreManagement" 
          options={{ title: 'Manage Stores' }}
        >
          {() => <AdminRouteGuard><StoreManagementScreen /></AdminRouteGuard>}
        </Stack.Screen>
        <Stack.Screen 
          name="SupportManagement" 
          options={{ title: 'Support Tickets' }}
        >
          {() => <AdminRouteGuard><SupportManagementScreen /></AdminRouteGuard>}
        </Stack.Screen>
        <Stack.Screen 
          name="Analytics" 
          options={{ title: 'Analytics' }}
        >
          {() => <AdminRouteGuard><AdminDashboardScreen /></AdminRouteGuard>}
        </Stack.Screen>
        <Stack.Screen 
          name="AdminProducts" 
          options={{ title: 'Manage Products' }}
        >
          {() => <AdminRouteGuard><AdminProductsScreen /></AdminRouteGuard>}
        </Stack.Screen>
        <Stack.Screen 
          name="AddProduct" 
          component={AddProductScreen}
          options={{ title: 'Add New Product' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
