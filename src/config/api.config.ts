import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const getApiUrl = () => {
  if (isWeb && typeof (global as any).window !== 'undefined') {
    const win = (global as any).window;
    const hostname = win.location.hostname;
    const protocol = win.location.protocol;
    return `${protocol}//${hostname}:3000/api`;
  }
  return 'http://localhost:3000/api';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 10000,
};
