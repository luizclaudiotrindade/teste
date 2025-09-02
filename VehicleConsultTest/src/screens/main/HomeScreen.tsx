import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList, BottomTabParamList, VehicleQuery } from '../../types';
import { VehicleService } from '../../services/VehicleService';
import Button from '../../components/Button';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface QuickStat {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [recentQueries, setRecentQueries] = useState<VehicleQuery[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<QuickStat[]>([
    { title: 'Créditos', value: '0', icon: 'account-balance-wallet', color: theme.colors.primary },
    { title: 'Consultas', value: '0', icon: 'search', color: theme.colors.success },
    { title: 'Favoritos', value: '0', icon: 'favorite', color: theme.colors.error },
    { title: 'Plano', value: 'Gratuito', icon: 'star', color: theme.colors.warning },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Update stats with user data
      if (user) {
        const newStats = [...stats];
        newStats[0].value = user.credits.toString();
        newStats[3].value = user.plan?.name || 'Gratuito';
        setStats(newStats);
      }

      // Load recent queries
      const response = await VehicleService.getQueryHistory(1, 5);
      if (response.success && response.data) {
        setRecentQueries(response.data);
        
        // Update query count
        const newStats = [...stats];
        newStats[1].value = response.data.length.toString();
        setStats(newStats);
      }

      // Load favorites count
      const favoritesResponse = await VehicleService.getFavorites();
      if (favoritesResponse.success && favoritesResponse.data) {
        const newStats = [...stats];
        newStats[2].value = favoritesResponse.data.length.toString();
        setStats(newStats);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'search':
        navigation.navigate('Search');
        break;
      case 'history':
        navigation.navigate('History');
        break;
      case 'plans':
        navigation.navigate('Plans');
        break;
      case 'support':
        navigation.navigate('Support');
        break;
    }
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
      padding: 20,
      paddingTop: 40,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    subGreeting: {
      fontSize: 16,
      color: theme.colors.text + '80',
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 20,
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
      marginBottom: 8,
    },
    statIcon: {
      marginRight: 8,
    },
    statTitle: {
      fontSize: 14,
      color: theme.colors.text + '80',
      fontWeight: '500',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    quickActionsContainer: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    quickActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    quickActionCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      textAlign: 'center',
    },
    recentContainer: {
      padding: 20,
    },
    recentItem: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    recentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    recentPlate: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    recentDate: {
      fontSize: 12,
      color: theme.colors.text + '60',
    },
    recentInfo: {
      fontSize: 14,
      color: theme.colors.text + '80',
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
          <Text style={styles.greeting}>
            Olá, {user?.name?.split(' ')[0] || 'Usuário'}!
          </Text>
          <Text style={styles.subGreeting}>
            {user?.userType === 'dealer' ? 'Painel do Lojista' : 'Como podemos ajudar hoje?'}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Icon
                  name={stat.icon}
                  size={20}
                  color={stat.color}
                  style={styles.statIcon}
                />
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('search')}
              activeOpacity={0.7}
            >
              <Icon
                name="search"
                size={32}
                color={theme.colors.primary}
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionText}>Nova Consulta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('history')}
              activeOpacity={0.7}
            >
              <Icon
                name="history"
                size={32}
                color={theme.colors.success}
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionText}>Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('plans')}
              activeOpacity={0.7}
            >
              <Icon
                name="star"
                size={32}
                color={theme.colors.warning}
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionText}>Planos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('support')}
              activeOpacity={0.7}
            >
              <Icon
                name="support-agent"
                size={32}
                color={theme.colors.accent}
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionText}>Suporte</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Consultas Recentes</Text>
          
          {recentQueries.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon
                name="search-off"
                size={48}
                color={theme.colors.text + '40'}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                Você ainda não fez nenhuma consulta.{'\n'}
                Que tal começar agora?
              </Text>
              <Button
                title="Fazer Primeira Consulta"
                onPress={() => navigation.navigate('Search')}
                variant="outline"
              />
            </View>
          ) : (
            recentQueries.map((query, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => navigation.navigate('VehicleDetails', { vehicle: query.vehicle })}
                activeOpacity={0.7}
              >
                <View style={styles.recentHeader}>
                  <Text style={styles.recentPlate}>
                    {query.vehicle.plate}
                  </Text>
                  <Text style={styles.recentDate}>
                    {formatDate(query.queryDate)}
                  </Text>
                </View>
                <Text style={styles.recentInfo}>
                  {query.vehicle.brand} {query.vehicle.model} • {query.vehicle.year}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;