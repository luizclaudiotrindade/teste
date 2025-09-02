import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Share,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList, Vehicle } from '../../types';
import { VehicleService } from '../../services/VehicleService';
import Button from '../../components/Button';

type VehicleDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VehicleDetails'>;
type VehicleDetailsScreenRouteProp = RouteProp<RootStackParamList, 'VehicleDetails'>;

interface Props {
  navigation: VehicleDetailsScreenNavigationProp;
  route: VehicleDetailsScreenRouteProp;
}

const VehicleDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { vehicle } = route.params;
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    setIsLoading(true);
    try {
      // Implementar lógica para favoritar
      setIsFavorite(!isFavorite);
      // await VehicleService.toggleFavorite(queryId, !isFavorite);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar favorito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareContent = `
🚗 *Consulta Veicular - ${vehicle.plate}*

📋 *Dados do Veículo:*
• Marca: ${vehicle.brand}
• Modelo: ${vehicle.model}
• Ano: ${vehicle.year}
• Cor: ${vehicle.color}
${vehicle.fipeValue ? `• Valor FIPE: R$ ${vehicle.fipeValue.toLocaleString('pt-BR')}` : ''}

🔍 *Situação:*
• Roubo/Furto: ${vehicle.status.stolen ? '❌ SIM' : '✅ NÃO'}
• Restrição Judicial: ${vehicle.status.judicial ? '❌ SIM' : '✅ NÃO'}
• IPVA: ${vehicle.status.ipvaStatus === 'paid' ? '✅ PAGO' : '❌ PENDENTE'}
• Licenciamento: ${vehicle.status.licensingStatus === 'valid' ? '✅ VÁLIDO' : '❌ VENCIDO'}

📱 Consulta realizada pelo app VehicleConsult
      `.trim();

      await Share.share({
        message: shareContent,
        title: `Consulta Veicular - ${vehicle.plate}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const getStatusColor = (status: boolean | string): string => {
    if (typeof status === 'boolean') {
      return status ? theme.colors.error : theme.colors.success;
    }
    
    switch (status) {
      case 'paid':
      case 'valid':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'overdue':
      case 'expired':
        return theme.colors.error;
      default:
        return theme.colors.text;
    }
  };

  const getStatusText = (status: boolean | string): string => {
    if (typeof status === 'boolean') {
      return status ? 'SIM' : 'NÃO';
    }
    
    switch (status) {
      case 'paid':
        return 'PAGO';
      case 'pending':
        return 'PENDENTE';
      case 'overdue':
        return 'EM ATRASO';
      case 'valid':
        return 'VÁLIDO';
      case 'expired':
        return 'VENCIDO';
      default:
        return status.toUpperCase();
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
      backgroundColor: theme.colors.card,
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    plateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    plate: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      fontFamily: 'monospace',
    },
    favoriteButton: {
      padding: 8,
    },
    vehicleInfo: {
      fontSize: 16,
      color: theme.colors.text + '80',
    },
    lastUpdated: {
      fontSize: 12,
      color: theme.colors.text + '60',
      marginTop: 8,
    },
    section: {
      backgroundColor: theme.colors.card,
      margin: 16,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionIcon: {
      marginRight: 8,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '40',
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.text + '80',
      flex: 1,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      textAlign: 'right',
      flex: 1,
    },
    statusValue: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
      flex: 1,
    },
    fipeValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'right',
      flex: 1,
    },
    restrictionItem: {
      backgroundColor: theme.colors.error + '10',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    restrictionType: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.error,
      marginBottom: 4,
    },
    restrictionDescription: {
      fontSize: 12,
      color: theme.colors.text + '80',
    },
    debtItem: {
      backgroundColor: theme.colors.warning + '10',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    debtHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    debtType: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.warning,
    },
    debtValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.warning,
    },
    debtDescription: {
      fontSize: 12,
      color: theme.colors.text + '80',
    },
    emptyState: {
      alignItems: 'center',
      padding: 20,
    },
    emptyIcon: {
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.text + '60',
      textAlign: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
    },
  });

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
          <View style={styles.plateContainer}>
            <Text style={styles.plate}>{vehicle.plate}</Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              activeOpacity={0.7}
            >
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isFavorite ? theme.colors.error : theme.colors.text}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.vehicleInfo}>
            {vehicle.brand} {vehicle.model} • {vehicle.year} • {vehicle.color}
          </Text>
          <Text style={styles.lastUpdated}>
            Última atualização: {formatDate(vehicle.lastUpdated)}
          </Text>
        </View>

        {/* Vehicle Basic Info */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Icon
              name="info"
              size={20}
              color={theme.colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
              Informações Básicas
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Marca</Text>
            <Text style={styles.infoValue}>{vehicle.brand}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Modelo</Text>
            <Text style={styles.infoValue}>{vehicle.model}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ano</Text>
            <Text style={styles.infoValue}>{vehicle.year}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cor</Text>
            <Text style={styles.infoValue}>{vehicle.color}</Text>
          </View>
          
          {vehicle.chassis && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chassi</Text>
              <Text style={styles.infoValue}>{vehicle.chassis}</Text>
            </View>
          )}
          
          {vehicle.fipeValue && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor FIPE</Text>
              <Text style={styles.fipeValue}>
                {formatCurrency(vehicle.fipeValue)}
              </Text>
            </View>
          )}
        </View>

        {/* Vehicle Status */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Icon
              name="security"
              size={20}
              color={theme.colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
              Situação do Veículo
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Roubo/Furto</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(vehicle.status.stolen) }]}>
              {getStatusText(vehicle.status.stolen)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Restrição Judicial</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(vehicle.status.judicial) }]}>
              {getStatusText(vehicle.status.judicial)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IPVA</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(vehicle.status.ipvaStatus) }]}>
              {getStatusText(vehicle.status.ipvaStatus)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Licenciamento</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(vehicle.status.licensingStatus) }]}>
              {getStatusText(vehicle.status.licensingStatus)}
            </Text>
          </View>
        </View>

        {/* Restrictions */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Icon
              name="warning"
              size={20}
              color={theme.colors.error}
              style={styles.sectionIcon}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
              Restrições
            </Text>
          </View>
          
          {vehicle.restrictions && vehicle.restrictions.length > 0 ? (
            vehicle.restrictions.map((restriction, index) => (
              <View key={index} style={styles.restrictionItem}>
                <Text style={styles.restrictionType}>
                  {restriction.type.toUpperCase()}
                </Text>
                <Text style={styles.restrictionDescription}>
                  {restriction.description}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon
                name="check-circle"
                size={32}
                color={theme.colors.success}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                Nenhuma restrição encontrada
              </Text>
            </View>
          )}
        </View>

        {/* Debts */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Icon
              name="account-balance"
              size={20}
              color={theme.colors.warning}
              style={styles.sectionIcon}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
              Débitos
            </Text>
          </View>
          
          {vehicle.debts && vehicle.debts.length > 0 ? (
            vehicle.debts.map((debt, index) => (
              <View key={index} style={styles.debtItem}>
                <View style={styles.debtHeader}>
                  <Text style={styles.debtType}>
                    {debt.type.toUpperCase()}
                  </Text>
                  <Text style={styles.debtValue}>
                    {formatCurrency(debt.value)}
                  </Text>
                </View>
                <Text style={styles.debtDescription}>
                  {debt.description}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon
                name="check-circle"
                size={32}
                color={theme.colors.success}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                Nenhum débito encontrado
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <Button
          title="Compartilhar"
          onPress={handleShare}
          variant="outline"
          size="large"
          style={{ flex: 1 }}
        />
        <Button
          title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          onPress={handleToggleFavorite}
          loading={isLoading}
          variant={isFavorite ? "secondary" : "primary"}
          size="large"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

export default VehicleDetailsScreen;