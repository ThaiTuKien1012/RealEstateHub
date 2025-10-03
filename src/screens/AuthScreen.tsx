import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    console.log('🔐 Login attempt:', { email, password: '***', isLoginMode });
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      if (isLoginMode) {
        console.log('📤 Calling login API...');
        await login(email, password);
        console.log('✅ Login successful!');
        navigation.navigate('Main', { screen: 'HomeTab' });
      } else {
        console.log('📤 Calling register API...');
        await register(email, password, name);
        console.log('✅ Register successful!');
        navigation.navigate('Main', { screen: 'HomeTab' });
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error response:', error?.response?.data);
      const errorMsg = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setErrorMessage(errorMsg);
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
              style={tw`bg-gray-50 border ${errorMessage ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 ${errorMessage ? 'mb-2' : 'mb-6'}`}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage('');
              }}
              secureTextEntry
              accessibilityLabel="Password"
            />

            {errorMessage ? (
              <View style={tw`mb-4 px-1`}>
                <Text style={tw`text-red-600 text-sm`}>* Sai mật khẩu hoặc tài khoản</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleSubmit}
              style={tw`bg-gray-900 py-4 rounded-xl mb-4`}
              disabled={isLoading}
              accessibilityLabel={isLoginMode ? 'Sign in' : 'Create account'}
              accessibilityRole="button"
            >
              <Text style={tw`text-white text-center font-bold text-base`}>
                {isLoading ? 'Đang tải...' : (isLoginMode ? 'Đăng nhập' : 'Tạo tài khoản')}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setIsLoginMode(!isLoginMode)}
            style={tw`mt-4`}
            accessibilityLabel={isLoginMode ? 'Switch to register' : 'Switch to login'}
            accessibilityRole="button"
          >
            <Text style={tw`text-gray-600 text-center`}>
              {isLoginMode ? (
                <>Chưa có tài khoản? <Text style={tw`text-gray-900 font-bold`}>Đăng ký</Text></>
              ) : (
                <>Đã có tài khoản? <Text style={tw`text-gray-900 font-bold`}>Đăng nhập</Text></>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
