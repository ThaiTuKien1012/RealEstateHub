import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useAuth } from '../hooks/useAuth';

export const AuthScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login, register, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    console.log('🔐 Login attempt:', { email, password: '***', isLoginMode });
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      if (isLoginMode) {
        console.log('📤 Calling login API...');
        await login(email, password);
        console.log('✅ Login successful!');
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('Main', { screen: 'HomeTab' });
      } else {
        console.log('📤 Calling register API...');
        await register(email, password, name);
        console.log('✅ Register successful!');
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Main', { screen: 'HomeTab' });
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error response:', error?.response?.data);
      Alert.alert('Error', error?.response?.data?.message || error?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`flex-grow`}>
        <View style={tw`flex-1 items-center justify-center px-6 py-12`}>
          <View style={tw`w-16 h-16 bg-yellow-600 rounded-full items-center justify-center mb-6`}>
            <Text style={tw`text-3xl`}>🔐</Text>
          </View>
          
          <Text style={tw`text-3xl font-bold mb-2 text-center`}>
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={tw`text-gray-600 mb-8 text-center`}>
            {isLoginMode ? 'Sign in to continue' : 'Join our luxury watch community'}
          </Text>

          <View style={tw`w-full bg-white rounded-2xl p-6 mb-6`}>
            {!isLoginMode && (
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4`}
                placeholder="Full name"
                value={name}
                onChangeText={setName}
                accessibilityLabel="Full name"
              />
            )}

            <TextInput
              style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4`}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email address"
            />

            <TextInput
              style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6`}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              accessibilityLabel="Password"
            />

          <TouchableOpacity
            onPress={async () => {
              try {
                await login('admin@watchshop.com', 'Admin123!@#');
                navigation.navigate('Main', { screen: 'HomeTab' });
              } catch (error) {
                Alert.alert('Error', 'Admin login failed');
              }
            }}
            style={tw`bg-blue-600 py-4 rounded-xl mb-3`}
            disabled={isLoading}
            accessibilityLabel="Quick admin login"
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-center font-bold text-lg`}>
              👨‍💼 Login as ADMIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              try {
                await login('demo1@watchshop.com', 'Demo123!@#');
                navigation.navigate('Main', { screen: 'HomeTab' });
              } catch (error) {
                Alert.alert('Error', 'Customer login failed');
              }
            }}
            style={tw`bg-green-600 py-4 rounded-xl mb-4`}
            disabled={isLoading}
            accessibilityLabel="Quick customer login"
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-center font-bold text-lg`}>
              👤 Login as CUSTOMER
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
};
