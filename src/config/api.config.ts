import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const isDev = process.env.NODE_ENV === 'development' || __DEV__;

export const API_CONFIG = {
  BASE_URL: isWeb && isDev 
    ? 'http://localhost:3000/api'
    : 'http://localhost:3000/api',
  TIMEOUT: 10000,
};
