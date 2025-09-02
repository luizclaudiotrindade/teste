import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  secureTextEntry,
  ...props
}) => {
  const { theme } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      minHeight: 48,
    },
    leftIconContainer: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      paddingVertical: 12,
    },
    rightIconContainer: {
      marginLeft: 12,
      padding: 4,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: 4,
    },
  });

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsSecure(!isSecure);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIcon = () => {
    if (secureTextEntry) {
      return isSecure ? 'visibility' : 'visibility-off';
    }
    return rightIcon;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon
              name={leftIcon}
              size={20}
              color={theme.colors.text + '80'}
            />
          </View>
        )}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={theme.colors.text + '60'}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={handleRightIconPress}
            activeOpacity={0.7}
          >
            <Icon
              name={getRightIcon() || 'help'}
              size={20}
              color={theme.colors.text + '80'}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;