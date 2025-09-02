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
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList, BottomTabParamList, Vehicle } from '../../types';
import { VehicleService } from '../../services/VehicleService';
import Button from '../../components/Button';
import Input from '../../components/Input';

type SearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Search'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  
  const [searchType, setSearchType] = useState<'plate' | 'renavam'>('plate');
  const [plate, setPlate] = useState('');
  const [renavam, setRenavam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{plate?: string; renavam?: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {plate?: string; renavam?: string} = {};
    
    if (searchType === 'plate') {
      if (!plate.trim()) {
        newErrors.plate = 'Placa é obrigatória';
      } else if (!VehicleService.isValidPlate(plate)) {
        newErrors.plate = 'Placa inválida';
      }
    } else {
      if (!renavam.trim()) {
        newErrors.renavam = 'RENAVAM é obrigatório';
      } else if (!VehicleService.isValidRenavam(renavam)) {
        newErrors.renavam = 'RENAVAM inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkCredits = (): boolean => {
    if (!user || user.credits <= 0) {
      Alert.alert(
        'Créditos Insuficientes',
        'Você não possui créditos suficientes para fazer uma consulta. Deseja adquirir mais créditos?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ver Planos', onPress: () => navigation.navigate('Plans') },
        ]
      );
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    if (!validateForm() || !checkCredits()) return;
    
    setIsLoading(true);
    
    try {
      const searchParams = searchType === 'plate' 
        ? { plate: plate.trim().toUpperCase() }
        : { renavam: renavam.trim() };
      
      const response = await VehicleService.searchVehicle(searchParams);
      
      if (response.success && response.data) {
        // Deduct credit
        if (user) {
          updateUser({ credits: user.credits - 1 });
        }
        
        // Save query to history
        await VehicleService.saveQuery(response.data);
        
        // Navigate to vehicle details
        navigation.navigate('VehicleDetails', { vehicle: response.data });
      } else {
        Alert.alert('Erro', response.error || 'Veículo não encontrado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlateChange = (value: string) => {
    const formatted = VehicleService.formatPlate(value);
    setPlate(formatted);
  };

  const handleRenavamChange = (value: string) => {
    const formatted = VehicleService.formatRenavam(value);
    setRenavam(formatted);
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
    creditsCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      margin: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    creditsIcon: {
      marginRight: 12,
    },
    creditsInfo: {
      flex: 1,
    },
    creditsTitle: {
      fontSize: 14,
      color: theme.colors.text + '80',
      marginBottom: 4,
    },
    creditsValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    creditsButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    searchTypeContainer: {
      padding: 20,
    },
    searchTypeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    searchTypeButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    searchTypeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    searchTypeButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    searchTypeButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginLeft: 8,
    },
    searchTypeButtonTextActive: {
      color: theme.colors.primary,
    },
    formContainer: {
      padding: 20,
    },
    inputContainer: {
      marginBottom: 24,
    },
    helpCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      margin: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    helpTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    helpIcon: {
      marginRight: 8,
    },
    helpText: {
      fontSize: 14,
      color: theme.colors.text + '80',
      lineHeight: 20,
    },
    exampleText: {
      fontSize: 12,
      color: theme.colors.text + '60',
      marginTop: 8,
      fontStyle: 'italic',
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
        <View style={styles.header}>
          <Text style={styles.title}>Consulta Veicular</Text>
          <Text style={styles.subtitle}>
            Busque informações completas do veículo
          </Text>
        </View>

        <View style={styles.creditsCard}>
          <Icon
            name="account-balance-wallet"
            size={24}
            color={theme.colors.primary}
            style={styles.creditsIcon}
          />
          <View style={styles.creditsInfo}>
            <Text style={styles.creditsTitle}>Créditos disponíveis</Text>
            <Text style={styles.creditsValue}>
              {user?.credits || 0} consultas
            </Text>
          </View>
          <Button
            title="+ Créditos"
            onPress={() => navigation.navigate('Plans')}
            variant="outline"
            size="small"
            style={styles.creditsButton}
          />
        </View>

        <View style={styles.searchTypeContainer}>
          <Text style={styles.searchTypeTitle}>Tipo de busca</Text>
          <View style={styles.searchTypeButtons}>
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'plate' && styles.searchTypeButtonActive,
              ]}
              onPress={() => setSearchType('plate')}
              activeOpacity={0.7}
            >
              <Icon
                name="directions-car"
                size={20}
                color={searchType === 'plate' ? theme.colors.primary : theme.colors.text}
              />
              <Text
                style={[
                  styles.searchTypeButtonText,
                  searchType === 'plate' && styles.searchTypeButtonTextActive,
                ]}
              >
                Placa
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'renavam' && styles.searchTypeButtonActive,
              ]}
              onPress={() => setSearchType('renavam')}
              activeOpacity={0.7}
            >
              <Icon
                name="confirmation-number"
                size={20}
                color={searchType === 'renavam' ? theme.colors.primary : theme.colors.text}
              />
              <Text
                style={[
                  styles.searchTypeButtonText,
                  searchType === 'renavam' && styles.searchTypeButtonTextActive,
                ]}
              >
                RENAVAM
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            {searchType === 'plate' ? (
              <Input
                label="Placa do veículo"
                placeholder="ABC-1234 ou ABC1D23"
                value={plate}
                onChangeText={handlePlateChange}
                error={errors.plate}
                autoCapitalize="characters"
                leftIcon="directions-car"
                maxLength={8}
              />
            ) : (
              <Input
                label="RENAVAM"
                placeholder="12345678901"
                value={renavam}
                onChangeText={handleRenavamChange}
                error={errors.renavam}
                keyboardType="numeric"
                leftIcon="confirmation-number"
                maxLength={14}
              />
            )}
          </View>

          <Button
            title="Consultar Veículo"
            onPress={handleSearch}
            loading={isLoading}
            size="large"
          />
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpTitle}>
            <Icon
              name="help-outline"
              size={20}
              color={theme.colors.primary}
              style={styles.helpIcon}
            />
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
              Informações da Consulta
            </Text>
          </View>
          <Text style={styles.helpText}>
            Nossa consulta fornece informações sobre:
            {'\n'}• Dados do veículo (marca, modelo, ano, cor)
            {'\n'}• Situação de roubo/furto
            {'\n'}• Restrições judiciais e administrativas
            {'\n'}• Débitos pendentes (IPVA, multas, licenciamento)
            {'\n'}• Histórico de sinistros
            {'\n'}• Valor FIPE atualizado
          </Text>
          <Text style={styles.exampleText}>
            {searchType === 'plate' 
              ? 'Exemplo de placa: ABC-1234 (padrão antigo) ou ABC1D23 (Mercosul)'
              : 'Exemplo de RENAVAM: 12345678901 (11 dígitos)'
            }
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;