import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import { RootStackParamList, BottomTabParamList, VehicleQuery } from '../../types';
import { VehicleService } from '../../services/VehicleService';
import Button from '../../components/Button';

type HistoryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'History'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [queries, setQueries] = useState<VehicleQuery[]>([]);
  const [favorites, setFavorites] = useState<VehicleQuery[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        setPage(1);
      } else if (pageNum === 1) {
        setIsLoading(true);
      }

      if (activeTab === 'all') {
        const response = await VehicleService.getQueryHistory(pageNum, 20);
        if (response.success && response.data) {
          if (pageNum === 1) {
            setQueries(response.data);
          } else {
            setQueries(prev => [...prev, ...response.data!]);
          }
          setHasMore(response.data.length === 20);
        }
      } else {
        const response = await VehicleService.getFavorites();
        if (response.success && response.data) {
          setFavorites(response.data);
        }
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadData(1, true);
  };

  const loadMore = () => {
    if (!isLoading && hasMore && activeTab === 'all') {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const handleToggleFavorite = async (query: VehicleQuery) => {
    try {
      const response = await VehicleService.toggleFavorite(query.id, !query.isFavorite);
      if (response.success) {
        // Update local state
        if (activeTab === 'all') {
          setQueries(prev => 
            prev.map(q => 
              q.id === query.id ? { ...q, isFavorite: !q.isFavorite } : q
            )
          );
        } else {
          // Remove from favorites if unfavorited
          setFavorites(prev => prev.filter(f => f.id !== query.id));
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar favorito');
    }
  };

  const handleDeleteQuery = (queryId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta consulta do histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await VehicleService.deleteQuery(queryId);
              if (response.success) {
                setQueries(prev => prev.filter(q => q.id !== queryId));
                setFavorites(prev => prev.filter(f => f.id !== queryId));
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir consulta');
            }
          }
        },
      ]
    );
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderQueryItem = ({ item }: { item: VehicleQuery }) => (
    <TouchableOpacity
      style={styles.queryItem}
      onPress={() => navigation.navigate('VehicleDetails', { vehicle: item.vehicle })}
      activeOpacity={0.7}
    >
      <View style={styles.queryHeader}>
        <View style={styles.plateContainer}>
          <Text style={styles.plate}>{item.vehicle.plate}</Text>
          {item.isFavorite && (
            <Icon
              name="favorite"
              size={16}
              color={theme.colors.error}
              style={styles.favoriteIcon}
            />
          )}
        </View>
        <View style={styles.queryActions}>
          <TouchableOpacity
            onPress={() => handleToggleFavorite(item)}
            style={styles.actionButton}
          >
            <Icon
              name={item.isFavorite ? 'favorite' : 'favorite-border'}
              size={20}
              color={item.isFavorite ? theme.colors.error : theme.colors.text + '60'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteQuery(item.id)}
            style={styles.actionButton}
          >
            <Icon
              name="delete-outline"
              size={20}
              color={theme.colors.text + '60'}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.vehicleInfo}>
        {item.vehicle.brand} {item.vehicle.model} • {item.vehicle.year}
      </Text>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Icon
            name={item.vehicle.status.stolen ? 'warning' : 'check-circle'}
            size={14}
            color={item.vehicle.status.stolen ? theme.colors.error : theme.colors.success}
          />
          <Text style={[
            styles.statusText,
            { color: item.vehicle.status.stolen ? theme.colors.error : theme.colors.success }
          ]}>
            {item.vehicle.status.stolen ? 'Roubo/Furto' : 'Sem Restrições'}
          </Text>
        </View>
        
        <View style={styles.statusItem}>
          <Icon
            name="account-balance-wallet"
            size={14}
            color={theme.colors.text + '60'}
          />
          <Text style={styles.creditsText}>
            {item.creditsUsed} crédito{item.creditsUsed !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      <View style={styles.queryFooter}>
        <Text style={styles.queryDate}>
          {formatDate(item.queryDate)} às {formatTime(item.queryDate)}
        </Text>
        {item.notes && (
          <Icon
            name="note"
            size={14}
            color={theme.colors.text + '60'}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon
        name={activeTab === 'all' ? 'history' : 'favorite-border'}
        size={64}
        color={theme.colors.text + '40'}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'all' ? 'Nenhuma consulta realizada' : 'Nenhum favorito'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'all' 
          ? 'Suas consultas de veículos aparecerão aqui'
          : 'Marque consultas como favoritas para vê-las aqui'
        }
      </Text>
      {activeTab === 'all' && (
        <Button
          title="Fazer Primeira Consulta"
          onPress={() => navigation.navigate('Search')}
          variant="outline"
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      margin: 16,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text + '80',
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    queryItem: {
      backgroundColor: theme.colors.card,
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    queryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    plateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    plate: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      fontFamily: 'monospace',
    },
    favoriteIcon: {
      marginLeft: 8,
    },
    queryActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 4,
    },
    vehicleInfo: {
      fontSize: 14,
      color: theme.colors.text + '80',
      marginBottom: 8,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    creditsText: {
      fontSize: 12,
      color: theme.colors.text + '60',
    },
    queryFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    queryDate: {
      fontSize: 12,
      color: theme.colors.text + '60',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.text + '60',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    emptyButton: {
      minWidth: 200,
    },
  });

  const currentData = activeTab === 'all' ? queries : favorites;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>
          Suas consultas e favoritos
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Todas ({queries.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favoritos ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentData}
        renderItem={renderQueryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HistoryScreen;