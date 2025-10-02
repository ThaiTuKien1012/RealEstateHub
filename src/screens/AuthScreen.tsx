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
    try {
      if (isLoginMode) {
        await login(email, password);
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('Main', { screen: 'HomeTab' });
      } else {
        await register(email, password, name);
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Main', { screen: 'HomeTab' });
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
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
            onPress={handleSubmit}
            style={tw`bg-yellow-600 py-3 rounded-lg mb-4`}
            disabled={isLoading}
            accessibilityLabel={isLoginMode ? 'Login' : 'Sign up'}
            accessibilityRole="button"
          >
            <Text style={tw`text-white text-center font-semibold text-lg`}>
              {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsLoginMode(!isLoginMode)}
            accessibilityLabel={isLoginMode ? 'Switch to sign up' : 'Switch to login'}
            accessibilityRole="button"
          >
            <Text style={tw`text-yellow-600 text-center`}>
              {isLoginMode
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
};
