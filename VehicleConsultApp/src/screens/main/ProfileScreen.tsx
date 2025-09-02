import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList, BottomTabParamList } from '../../types';
import Button from '../../components/Button';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Profile'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

interface MenuItem {
  icon: string;
  title: string;
  subtitle?: string;
  action: () => void;
  showArrow?: boolean;
  color?: string;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await logout();
            setIsLoggingOut(false);
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Em breve', 'Edição de perfil será implementada em breve');
  };

  const handleChangePassword = () => {
    Alert.alert('Em breve', 'Alteração de senha será implementada em breve');
  };

  const handleNotificationSettings = () => {
    Alert.alert('Em breve', 'Configurações de notificação serão implementadas em breve');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Em breve', 'Política de privacidade será implementada em breve');
  };

  const handleTermsOfService = () => {
    Alert.alert('Em breve', 'Termos de uso serão implementados em breve');
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o VehicleConsult',
      'Versão 1.0.0\n\nApp de consulta veicular completo para Android.\n\nDesenvolvido com React Native e TypeScript.',
      [{ text: 'OK' }]
    );
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'person',
      title: 'Editar Perfil',
      subtitle: 'Alterar dados pessoais',
      action: handleEditProfile,
      showArrow: true,
    },
    {
      icon: 'lock',
      title: 'Alterar Senha',
      subtitle: 'Modificar senha de acesso',
      action: handleChangePassword,
      showArrow: true,
    },
    {
      icon: 'star',
      title: 'Planos e Créditos',
      subtitle: 'Gerenciar assinatura',
      action: () => navigation.navigate('Plans'),
      showArrow: true,
    },
    {
      icon: 'notifications',
      title: 'Notificações',
      subtitle: 'Configurar alertas',
      action: handleNotificationSettings,
      showArrow: true,
    },
    {
      icon: 'support-agent',
      title: 'Suporte',
      subtitle: 'Ajuda e contato',
      action: () => navigation.navigate('Support'),
      showArrow: true,
    },
    {
      icon: 'privacy-tip',
      title: 'Política de Privacidade',
      action: handlePrivacyPolicy,
      showArrow: true,
    },
    {
      icon: 'description',
      title: 'Termos de Uso',
      action: handleTermsOfService,
      showArrow: true,
    },
    {
      icon: 'info',
      title: 'Sobre',
      action: handleAbout,
      showArrow: true,
    },
  ];

  const formatUserType = (userType: string): string => {
    return userType === 'dealer' ? 'Lojista' : 'Pessoa Física';
  };

  const formatCpfCnpj = (cpfCnpj: string): string => {
    const numbers = cpfCnpj.replace(/\D/g, '');
    if (numbers.length === 11) {
      // CPF
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numbers.length === 14) {
      // CNPJ
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cpfCnpj;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    header: {
      padding: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text + '80',
    },
    profileCard: {
      backgroundColor: theme.colors.card,
      margin: 16,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: theme.colors.text + '80',
      marginBottom: 8,
    },
    userType: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      overflow: 'hidden',
    },
    statsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      gap: 16,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.text + '60',
      marginTop: 2,
    },
    section: {
      backgroundColor: theme.colors.card,
      margin: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      padding: 16,
      paddingBottom: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '40',
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      marginRight: 16,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 2,
    },
    menuSubtitle: {
      fontSize: 12,
      color: theme.colors.text + '60',
    },
    menuArrow: {
      marginLeft: 8,
    },
    themeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '40',
    },
    themeToggleContent: {
      flex: 1,
      marginLeft: 16,
    },
    logoutButton: {
      margin: 16,
    },
  });

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>
            Gerencie sua conta e preferências
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? getInitials(user.name) : 'U'}
            </Text>
          </View>
          
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>
          <Text style={styles.userType}>
            {user ? formatUserType(user.userType) : 'Usuário'}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.credits || 0}</Text>
              <Text style={styles.statLabel}>Créditos</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {user?.plan?.name || 'Gratuito'}
              </Text>
              <Text style={styles.statLabel}>Plano</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {user?.cpfCnpj ? formatCpfCnpj(user.cpfCnpj) : '-'}
              </Text>
              <Text style={styles.statLabel}>
                {user?.userType === 'dealer' ? 'CNPJ' : 'CPF'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          {/* Dark Mode Toggle */}
          <View style={styles.themeToggleContainer}>
            <Icon
              name={isDark ? 'dark-mode' : 'light-mode'}
              size={24}
              color={theme.colors.text + '80'}
            />
            <View style={styles.themeToggleContent}>
              <Text style={styles.menuTitle}>Modo Escuro</Text>
              <Text style={styles.menuSubtitle}>
                Alternar entre tema claro e escuro
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ 
                false: theme.colors.border, 
                true: theme.colors.primary + '40' 
              }}
              thumbColor={isDark ? theme.colors.primary : '#FFFFFF'}
            />
          </View>

          {/* Menu Items */}
          {menuItems.slice(0, 4).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === 3 && styles.menuItemLast,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <Icon
                name={item.icon}
                size={24}
                color={item.color || theme.colors.text + '80'}
                style={styles.menuIcon}
              />
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              {item.showArrow && (
                <Icon
                  name="chevron-right"
                  size={20}
                  color={theme.colors.text + '60'}
                  style={styles.menuArrow}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          
          {menuItems.slice(4).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.slice(4).length - 1 && styles.menuItemLast,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <Icon
                name={item.icon}
                size={24}
                color={item.color || theme.colors.text + '80'}
                style={styles.menuIcon}
              />
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              {item.showArrow && (
                <Icon
                  name="chevron-right"
                  size={20}
                  color={theme.colors.text + '60'}
                  style={styles.menuArrow}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <Button
          title="Sair da Conta"
          onPress={handleLogout}
          loading={isLoggingOut}
          variant="outline"
          size="large"
          style={styles.logoutButton}
          textStyle={{ color: theme.colors.error }}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;