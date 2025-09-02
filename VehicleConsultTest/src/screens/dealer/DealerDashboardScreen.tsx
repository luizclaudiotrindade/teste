import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList, BottomTabParamList, DealerReport, VehicleQuery } from '../../types';
import Button from '../../components/Button';

type DealerDashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Dashboard'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: DealerDashboardScreenNavigationProp;
}

interface DashboardStat {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const DealerDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('month');
  const [recentQueries, setRecentQueries] = useState<VehicleQuery[]>([]);
  
  const [stats, setStats] = useState<DashboardStat[]>([
    {
      title: 'Consultas Hoje',
      value: '12',
      icon: 'search',
      color: theme.colors.primary,
      trend: { value: '+15%', isPositive: true },
    },
    {
      title: 'Consultas Mês',
      value: '324',
      icon: 'analytics',
      color: theme.colors.success,
      trend: { value: '+8%', isPositive: true },
    },
    {
      title: 'Créditos Restantes',
      value: user?.credits?.toString() || '0',
      icon: 'account-balance-wallet',
      color: theme.colors.warning,
    },
    {
      title: 'Economia Gerada',
      value: 'R$ 2.450',
      icon: 'savings',
      color: theme.colors.accent,
      trend: { value: '+12%', isPositive: true },
    },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      // Carregar dados do dashboard
      // Aqui você faria chamadas para APIs específicas do dashboard
      
      // Simular carregamento de consultas recentes
      const mockQueries: VehicleQuery[] = [
        {
          id: '1',
          userId: user?.id || '',
          vehicle: {
            plate: 'ABC-1234',
            brand: 'VOLKSWAGEN',
            model: 'GOL',
            year: 2020,
            color: 'BRANCO',
            status: {
              stolen: false,
              judicial: false,
              ipvaStatus: 'paid',
              licensingStatus: 'valid',
            },
            restrictions: [],
            debts: [],
            accidents: [],
            lastUpdated: new Date(),
          },
          queryDate: new Date(),
          isFavorite: false,
          creditsUsed: 1,
        },
        // Adicionar mais consultas mock...
      ];
      
      setRecentQueries(mockQueries);
    } catch (error) {
      console.log('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleExportReport = () => {
    Alert.alert(
      'Exportar Relatório',
      'Escolha o formato para exportação:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'PDF', onPress: () => exportReport('pdf') },
        { text: 'Excel', onPress: () => exportReport('excel') },
      ]
    );
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    Alert.alert(
      'Em breve',
      `Exportação em ${format.toUpperCase()} será implementada em breve`
    );
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPeriodLabel = (period: string): string => {
    switch (period) {
      case 'today': return 'Hoje';
      case 'week': return 'Semana';
      case 'month': return 'Mês';
      default: return 'Mês';
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
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      margin: 16,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    activePeriodButton: {
      backgroundColor: theme.colors.primary,
    },
    periodButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text + '80',
    },
    activePeriodButtonText: {
      color: '#FFFFFF',
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 16,
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    statIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statIcon: {
      marginRight: 8,
    },
    statTitle: {
      fontSize: 12,
      color: theme.colors.text + '80',
      fontWeight: '500',
    },
    statTrend: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    section: {
      backgroundColor: theme.colors.card,
      margin: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '40',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionIcon: {
      marginRight: 8,
    },
    exportButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    queryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '40',
    },
    queryItemLast: {
      borderBottomWidth: 0,
    },
    queryInfo: {
      flex: 1,
    },
    queryPlate: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      fontFamily: 'monospace',
    },
    queryDetails: {
      fontSize: 14,
      color: theme.colors.text + '80',
      marginTop: 2,
    },
    queryDate: {
      fontSize: 12,
      color: theme.colors.text + '60',
    },
    queryStatus: {
      marginLeft: 12,
    },
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.text + '60',
      textAlign: 'center',
      marginBottom: 16,
    },
    quickActions: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
    },
    quickActionButton: {
      flex: 1,
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard Lojista</Text>
          <Text style={styles.subtitle}>
            Acompanhe suas consultas e relatórios
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['today', 'week', 'month'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.activePeriodButtonText,
                ]}
              >
                {getPeriodLabel(period)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statIconContainer}>
                  <Icon
                    name={stat.icon}
                    size={20}
                    color={stat.color}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </View>
                {stat.trend && (
                  <Text
                    style={[
                      styles.statTrend,
                      { color: stat.trend.isPositive ? theme.colors.success : theme.colors.error },
                    ]}
                  >
                    {stat.trend.value}
                  </Text>
                )}
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Recent Queries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Icon
                name="history"
                size={20}
                color={theme.colors.primary}
                style={styles.sectionIcon}
              />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
                Consultas Recentes
              </Text>
            </View>
            <Button
              title="Exportar"
              onPress={handleExportReport}
              variant="outline"
              size="small"
              style={styles.exportButton}
            />
          </View>

          {recentQueries.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon
                name="search-off"
                size={48}
                color={theme.colors.text + '40'}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                Nenhuma consulta realizada ainda
              </Text>
              <Button
                title="Fazer Consulta"
                onPress={() => navigation.navigate('Search')}
                variant="outline"
              />
            </View>
          ) : (
            recentQueries.slice(0, 5).map((query, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.queryItem,
                  index === Math.min(4, recentQueries.length - 1) && styles.queryItemLast,
                ]}
                onPress={() => navigation.navigate('VehicleDetails', { vehicle: query.vehicle })}
                activeOpacity={0.7}
              >
                <View style={styles.queryInfo}>
                  <Text style={styles.queryPlate}>{query.vehicle.plate}</Text>
                  <Text style={styles.queryDetails}>
                    {query.vehicle.brand} {query.vehicle.model} • {query.vehicle.year}
                  </Text>
                  <Text style={styles.queryDate}>
                    {formatDate(query.queryDate)}
                  </Text>
                </View>
                <View style={styles.queryStatus}>
                  <Icon
                    name={query.vehicle.status.stolen ? 'warning' : 'check-circle'}
                    size={20}
                    color={query.vehicle.status.stolen ? theme.colors.error : theme.colors.success}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="Nova Consulta"
            onPress={() => navigation.navigate('Search')}
            variant="primary"
            size="large"
            style={styles.quickActionButton}
          />
          <Button
            title="Ver Relatórios"
            onPress={() => navigation.navigate('History')}
            variant="outline"
            size="large"
            style={styles.quickActionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DealerDashboardScreen;