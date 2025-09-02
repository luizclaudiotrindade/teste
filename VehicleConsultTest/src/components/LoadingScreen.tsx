import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {
      marginTop: 20,
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
};

export default LoadingScreen;