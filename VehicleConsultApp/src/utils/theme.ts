import { Theme } from '../types';

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    card: '#F8F9FA',
    text: '#1C1C1E',
    border: '#E5E5EA',
    notification: '#FF3B30',
    surface: '#FFFFFF',
    accent: '#5856D6',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    notification: '#FF453A',
    surface: '#1C1C1E',
    accent: '#5E5CE6',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
  },
};

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};