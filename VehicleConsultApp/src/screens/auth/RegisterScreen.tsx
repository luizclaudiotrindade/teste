import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types';
import { AuthService } from '../../services/AuthService';
import Button from '../../components/Button';
import Input from '../../components/Input';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpfCnpj: '',
    userType: 'individual' as 'individual' | 'dealer',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }
    
    if (!formData.cpfCnpj) {
      newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
    } else {
      const cleanCpfCnpj = formData.cpfCnpj.replace(/\D/g, '');
      if (cleanCpfCnpj.length === 11) {
        if (!AuthService.validateCPF(cleanCpfCnpj)) {
          newErrors.cpfCnpj = 'CPF inválido';
        }
      } else if (cleanCpfCnpj.length === 14) {
        if (!AuthService.validateCNPJ(cleanCpfCnpj)) {
          newErrors.cpfCnpj = 'CNPJ inválido';
        }
      } else {
        newErrors.cpfCnpj = 'CPF/CNPJ inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      
      if (!response.success) {
        Alert.alert('Erro', response.error || 'Erro ao criar conta');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCpfCnpjChange = (value: string) => {
    const formatted = AuthService.formatCpfCnpj(value);
    setFormData({ ...formData, cpfCnpj: formatted });
    
    // Auto-detect user type based on length
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      setFormData(prev => ({ ...prev, cpfCnpj: formatted, userType: 'individual' }));
    } else {
      setFormData(prev => ({ ...prev, cpfCnpj: formatted, userType: 'dealer' }));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    content: {
      padding: 24,
      paddingTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text + '80',
      textAlign: 'center',
      marginBottom: 32,
    },
    form: {
      marginBottom: 24,
    },
    userTypeContainer: {
      marginBottom: 16,
    },
    userTypeLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 12,
    },
    userTypeButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    userTypeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
    },
    userTypeButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    userTypeButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    userTypeButtonTextActive: {
      color: theme.colors.primary,
    },
    terms: {
      fontSize: 12,
      color: theme.colors.text + '80',
      textAlign: 'center',
      lineHeight: 18,
      marginTop: 16,
    },
    termsLink: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para começar
          </Text>

          <View style={styles.form}>
            <Input
              label="Nome completo"
              placeholder="Digite seu nome"
              value={formData.name}
              onChangeText={(name) => setFormData({ ...formData, name })}
              error={errors.name}
              leftIcon="person"
            />

            <Input
              label="Email"
              placeholder="Digite seu email"
              value={formData.email}
              onChangeText={(email) => setFormData({ ...formData, email })}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
            />

            <Input
              label="CPF/CNPJ"
              placeholder="Digite seu CPF ou CNPJ"
              value={formData.cpfCnpj}
              onChangeText={handleCpfCnpjChange}
              error={errors.cpfCnpj}
              keyboardType="numeric"
              leftIcon="badge"
            />

            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeLabel}>Tipo de usuário</Text>
              <View style={styles.userTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    formData.userType === 'individual' && styles.userTypeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, userType: 'individual' })}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      formData.userType === 'individual' && styles.userTypeButtonTextActive,
                    ]}
                  >
                    Pessoa Física
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    formData.userType === 'dealer' && styles.userTypeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, userType: 'dealer' })}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      formData.userType === 'dealer' && styles.userTypeButtonTextActive,
                    ]}
                  >
                    Lojista
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={formData.password}
              onChangeText={(password) => setFormData({ ...formData, password })}
              error={errors.password}
              secureTextEntry
              leftIcon="lock"
            />

            <Input
              label="Confirmar senha"
              placeholder="Digite novamente sua senha"
              value={formData.confirmPassword}
              onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
              error={errors.confirmPassword}
              secureTextEntry
              leftIcon="lock"
            />

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              loading={isLoading}
              size="large"
            />

            <Text style={styles.terms}>
              Ao criar uma conta, você aceita nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;