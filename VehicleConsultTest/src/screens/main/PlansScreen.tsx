import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList, UserPlan } from '../../types';
import Button from '../../components/Button';

type PlansScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Plans'>;

interface Props {
  navigation: PlansScreenNavigationProp;
}

interface PlanOption extends UserPlan {
  popular?: boolean;
  savings?: string;
}

const PlansScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const individualPlans: PlanOption[] = [
    {
      id: 'free',
      name: 'Gratuito',
      type: 'free',
      creditsLimit: 5,
      price: 0,
      features: [
        '5 consultas por mês',
        'Dados básicos do veículo',
        'Situação de roubo/furto',
        'Status IPVA básico',
      ],
      isActive: true,
    },
    {
      id: 'basic',
      name: 'Básico',
      type: 'basic',
      creditsLimit: 50,
      price: 19.90,
      features: [
        '50 consultas por mês',
        'Dados completos do veículo',
        'Histórico de sinistros',
        'Restrições detalhadas',
        'Valor FIPE atualizado',
        'Suporte prioritário',
      ],
      isActive: false,
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      type: 'premium',
      creditsLimit: 200,
      price: 49.90,
      features: [
        '200 consultas por mês',
        'Todos os recursos do Básico',
        'Relatórios em PDF',
        'Histórico ilimitado',
        'Alertas de mudanças',
        'API de integração',
      ],
      isActive: false,
      savings: '37% OFF',
    },
  ];

  const dealerPlans: PlanOption[] = [
    {
      id: 'dealer-basic',
      name: 'Lojista Básico',
      type: 'basic',
      creditsLimit: 500,
      price: 99.90,
      features: [
        '500 consultas por mês',
        'Dashboard empresarial',
        'Relatórios detalhados',
        'Exportação de dados',
        'Múltiplos usuários (até 3)',
        'Suporte dedicado',
      ],
      isActive: false,
    },
    {
      id: 'dealer-premium',
      name: 'Lojista Premium',
      type: 'premium',
      creditsLimit: 2000,
      price: 299.90,
      features: [
        '2000 consultas por mês',
        'Todos os recursos do Básico',
        'API completa',
        'Integração com sistemas',
        'Usuários ilimitados',
        'Consultoria especializada',
      ],
      isActive: false,
      popular: true,
      savings: '50% OFF',
    },
    {
      id: 'dealer-enterprise',
      name: 'Empresarial',
      type: 'enterprise',
      creditsLimit: 10000,
      price: 999.90,
      features: [
        'Consultas ilimitadas',
        'Todos os recursos Premium',
        'SLA garantido',
        'Customizações',
        'Treinamento da equipe',
        'Gerente de conta dedicado',
      ],
      isActive: false,
    },
  ];

  useEffect(() => {
    if (user?.plan) {
      setSelectedPlan(user.plan.id);
    }
  }, [user]);

  const getCurrentPlans = (): PlanOption[] => {
    return user?.userType === 'dealer' ? dealerPlans : individualPlans;
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    const plan = getCurrentPlans().find(p => p.id === selectedPlan);
    if (!plan) return;

    if (plan.type === 'free') {
      Alert.alert('Plano Gratuito', 'Você já está no plano gratuito!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Aqui você implementaria a integração com Google Play Billing
      Alert.alert(
        'Em breve',
        'A funcionalidade de pagamento será implementada em breve com Google Play Billing.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const renderPlan = (plan: PlanOption, index: number) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.selectedPlanCard,
        plan.popular && styles.popularPlanCard,
      ]}
      onPress={() => handleSelectPlan(plan.id)}
      activeOpacity={0.7}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MAIS POPULAR</Text>
        </View>
      )}
      
      {plan.savings && (
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsText}>{plan.savings}</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.planPrice}>
            {plan.price === 0 ? 'Grátis' : formatPrice(plan.price)}
          </Text>
          {plan.price > 0 && (
            <Text style={styles.priceSubtext}>/mês</Text>
          )}
        </View>
      </View>

      <View style={styles.creditsInfo}>
        <Icon
          name="account-balance-wallet"
          size={16}
          color={theme.colors.primary}
        />
        <Text style={styles.creditsText}>
          {plan.creditsLimit === 10000 ? 'Ilimitadas' : plan.creditsLimit} consultas
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, featureIndex) => (
          <View key={featureIndex} style={styles.featureItem}>
            <Icon
              name="check"
              size={16}
              color={theme.colors.success}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {selectedPlan === plan.id && (
        <View style={styles.selectedIndicator}>
          <Icon
            name="radio-button-checked"
            size={20}
            color={theme.colors.primary}
          />
        </View>
      )}
      
      {selectedPlan !== plan.id && (
        <View style={styles.unselectedIndicator}>
          <Icon
            name="radio-button-unchecked"
            size={20}
            color={theme.colors.text + '40'}
          />
        </View>
      )}
    </TouchableOpacity>
  );

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
    currentPlanCard: {
      backgroundColor: theme.colors.card,
      margin: 16,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    currentPlanTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    currentPlanInfo: {
      fontSize: 14,
      color: theme.colors.text + '80',
    },
    plansContainer: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    planCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: theme.colors.border,
      position: 'relative',
    },
    selectedPlanCard: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    popularPlanCard: {
      borderColor: theme.colors.success,
    },
    popularBadge: {
      position: 'absolute',
      top: -8,
      left: 20,
      backgroundColor: theme.colors.success,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    popularText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    savingsBadge: {
      position: 'absolute',
      top: -8,
      right: 20,
      backgroundColor: theme.colors.warning,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    savingsText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    planName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    planPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    priceSubtext: {
      fontSize: 12,
      color: theme.colors.text + '60',
    },
    creditsInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    creditsText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
    },
    featuresContainer: {
      marginBottom: 16,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureIcon: {
      marginRight: 12,
    },
    featureText: {
      fontSize: 14,
      color: theme.colors.text + '80',
      flex: 1,
    },
    selectedIndicator: {
      position: 'absolute',
      top: 20,
      right: 20,
    },
    unselectedIndicator: {
      position: 'absolute',
      top: 20,
      right: 20,
    },
    subscribeButton: {
      margin: 16,
    },
    footer: {
      padding: 16,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: theme.colors.text + '60',
      textAlign: 'center',
      lineHeight: 18,
    },
  });

  const currentPlans = getCurrentPlans();
  const selectedPlanData = currentPlans.find(p => p.id === selectedPlan);

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
          <Text style={styles.title}>Planos e Créditos</Text>
          <Text style={styles.subtitle}>
            Escolha o melhor plano para suas necessidades
          </Text>
        </View>

        {user?.plan && (
          <View style={styles.currentPlanCard}>
            <Text style={styles.currentPlanTitle}>Plano Atual</Text>
            <Text style={styles.currentPlanInfo}>
              {user.plan.name} • {user.credits} créditos restantes
            </Text>
          </View>
        )}

        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>
            Planos {user?.userType === 'dealer' ? 'para Lojistas' : 'Individuais'}
          </Text>
          
          {currentPlans.map(renderPlan)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            • Todos os planos incluem suporte via chat{'\n'}
            • Cancele a qualquer momento{'\n'}
            • Pagamento seguro via Google Play
          </Text>
        </View>
      </ScrollView>

      <Button
        title={
          selectedPlanData?.type === 'free' 
            ? 'Plano Atual' 
            : `Assinar ${selectedPlanData?.name || ''}`
        }
        onPress={handleSubscribe}
        loading={isLoading}
        disabled={selectedPlanData?.type === 'free'}
        size="large"
        style={styles.subscribeButton}
      />
    </View>
  );
};

export default PlansScreen;