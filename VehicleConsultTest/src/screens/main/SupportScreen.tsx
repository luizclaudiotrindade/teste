import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';

type SupportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Support'>;

interface Props {
  navigation: SupportScreenNavigationProp;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ContactOption {
  icon: string;
  title: string;
  subtitle: string;
  action: () => void;
  color: string;
}

const SupportScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const faqItems: FAQItem[] = [
    {
      question: 'Como funciona o sistema de créditos?',
      answer: 'Cada consulta de veículo consome 1 crédito. Os créditos são renovados mensalmente de acordo com seu plano. Créditos não utilizados não acumulam para o próximo mês.',
    },
    {
      question: 'Quais informações são fornecidas na consulta?',
      answer: 'Fornecemos dados completos do veículo incluindo marca, modelo, ano, cor, situação de roubo/furto, restrições judiciais, débitos pendentes, histórico de sinistros e valor FIPE atualizado.',
    },
    {
      question: 'Como posso alterar meu plano?',
      answer: 'Você pode alterar seu plano a qualquer momento através da seção "Planos e Créditos" no seu perfil. As alterações entram em vigor imediatamente.',
    },
    {
      question: 'Os dados são atualizados em tempo real?',
      answer: 'Nossos dados são atualizados diariamente através de fontes oficiais. Algumas informações podem ter até 24 horas de defasagem.',
    },
    {
      question: 'Como funciona o plano para lojistas?',
      answer: 'Planos para lojistas incluem mais consultas, dashboard empresarial, relatórios detalhados e suporte prioritário. Ideal para revendas e concessionárias.',
    },
    {
      question: 'Posso cancelar minha assinatura?',
      answer: 'Sim, você pode cancelar a qualquer momento através da Google Play Store. O cancelamento entra em vigor no próximo ciclo de cobrança.',
    },
  ];

  const contactOptions: ContactOption[] = [
    {
      icon: 'email',
      title: 'Email',
      subtitle: 'suporte@vehicleconsult.com',
      action: () => handleEmailContact(),
      color: theme.colors.primary,
    },
    {
      icon: 'phone',
      title: 'Telefone',
      subtitle: '(11) 99999-9999',
      action: () => handlePhoneContact(),
      color: theme.colors.success,
    },
    {
      icon: 'chat',
      title: 'WhatsApp',
      subtitle: 'Chat direto conosco',
      action: () => handleWhatsAppContact(),
      color: '#25D366',
    },
  ];

  const handleEmailContact = async () => {
    const email = 'suporte@vehicleconsult.com';
    const subject = 'Suporte VehicleConsult';
    const body = `Olá,\n\nPreciso de ajuda com:\n\nDados do usuário:\nEmail: ${user?.email}\nTipo: ${user?.userType}\n\nDescreva seu problema aqui...`;
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o cliente de email');
    }
  };

  const handlePhoneContact = async () => {
    const phoneNumber = 'tel:+5511999999999';
    
    try {
      await Linking.openURL(phoneNumber);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer a ligação');
    }
  };

  const handleWhatsAppContact = async () => {
    const phoneNumber = '5511999999999';
    const message = `Olá! Preciso de ajuda com o VehicleConsult.\n\nDados do usuário:\nEmail: ${user?.email}\nTipo: ${user?.userType}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim()) {
      Alert.alert('Erro', 'Digite sua mensagem');
      return;
    }

    setIsSendingMessage(true);
    
    try {
      // Simular envio de mensagem
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Mensagem Enviada',
        'Sua mensagem foi enviada com sucesso! Nossa equipe responderá em breve.',
        [
          { text: 'OK', onPress: () => setChatMessage('') }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
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
    section: {
      backgroundColor: theme.colors.card,
      margin: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      padding: 16,
      paddingBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionIcon: {
      marginRight: 8,
    },
    contactOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '40',
    },
    contactOptionLast: {
      borderBottomWidth: 0,
    },
    contactIcon: {
      marginRight: 16,
    },
    contactContent: {
      flex: 1,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 2,
    },
    contactSubtitle: {
      fontSize: 14,
      color: theme.colors.text + '60',
    },
    faqItem: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '40',
    },
    faqItemLast: {
      borderBottomWidth: 0,
    },
    faqQuestion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    faqQuestionText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      flex: 1,
      marginRight: 8,
    },
    faqAnswer: {
      padding: 16,
      paddingTop: 0,
      backgroundColor: theme.colors.background + '40',
    },
    faqAnswerText: {
      fontSize: 14,
      color: theme.colors.text + '80',
      lineHeight: 20,
    },
    chatContainer: {
      padding: 16,
    },
    chatInput: {
      marginBottom: 12,
    },
    helpCard: {
      backgroundColor: theme.colors.primary + '10',
      margin: 16,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.primary + '20',
    },
    helpTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
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
          <Text style={styles.title}>Suporte</Text>
          <Text style={styles.subtitle}>
            Estamos aqui para ajudar você
          </Text>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Icon
              name="contact-support"
              size={20}
              color={theme.colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
              Entre em Contato
            </Text>
          </View>
          
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.contactOption,
                index === contactOptions.length - 1 && styles.contactOptionLast,
              ]}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <Icon
                name={option.icon}
                size={24}
                color={option.color}
                style={styles.contactIcon}
              />
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={theme.colors.text + '60'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Chat */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Icon
              name="chat-bubble"
              size={20}
              color={theme.colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
              Envie uma Mensagem
            </Text>
          </View>
          
          <View style={styles.chatContainer}>
            <Input
              label="Sua mensagem"
              placeholder="Descreva como podemos ajudar..."
              value={chatMessage}
              onChangeText={setChatMessage}
              multiline
              numberOfLines={4}
              style={styles.chatInput}
            />
            
            <Button
              title="Enviar Mensagem"
              onPress={handleSendChatMessage}
              loading={isSendingMessage}
              size="large"
            />
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Icon
              name="help-outline"
              size={20}
              color={theme.colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
              Perguntas Frequentes
            </Text>
          </View>
          
          {faqItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.faqItem,
                index === faqItems.length - 1 && styles.faqItemLast,
              ]}
            >
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestionText}>{item.question}</Text>
                <Icon
                  name={expandedFAQ === index ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={theme.colors.text + '60'}
                />
              </TouchableOpacity>
              
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Help Card */}
        <View style={styles.helpCard}>
          <View style={styles.helpTitle}>
            <Icon
              name="info"
              size={20}
              color={theme.colors.primary}
              style={styles.helpIcon}
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.primary }}>
              Horário de Atendimento
            </Text>
          </View>
          <Text style={styles.helpText}>
            Segunda a Sexta: 8h às 18h{'\n'}
            Sábado: 8h às 12h{'\n'}
            Domingo: Fechado{'\n\n'}
            Tempo médio de resposta: 2 horas úteis
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SupportScreen;