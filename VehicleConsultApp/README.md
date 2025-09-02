# VehicleConsult - App de Consulta Veicular

Um aplicativo completo de consulta veicular para Android, desenvolvido em React Native com TypeScript.

## 🚗 Sobre o App

O VehicleConsult é uma solução moderna e completa para consulta de informações veiculares, oferecendo funcionalidades tanto para usuários individuais quanto para lojistas (B2B).

### ✨ Funcionalidades Principais

- **Consulta Completa**: Busca por placa ou RENAVAM
- **Informações Detalhadas**: 
  - Dados básicos do veículo (marca, modelo, ano, cor)
  - Situação de roubo/furto
  - Restrições judiciais e administrativas
  - Débitos pendentes (IPVA, multas, licenciamento)
  - Histórico de sinistros
  - Valor FIPE atualizado

- **Autenticação Segura**: Login com email/senha e social login (Google/Facebook)
- **Perfis Diferenciados**: Usuários individuais e lojistas
- **Sistema de Créditos**: Planos flexíveis de consulta
- **Histórico e Favoritos**: Salve e organize suas consultas
- **Dashboard Lojista**: Relatórios e análises para empresas
- **Dark Mode**: Interface moderna com tema claro/escuro
- **Suporte Integrado**: Chat e múltiplos canais de contato

## 🛠️ Tecnologias Utilizadas

- **React Native 0.81.1** com TypeScript
- **React Navigation 6** para navegação
- **Context API** para gerenciamento de estado
- **AsyncStorage** e **Encrypted Storage** para persistência
- **React Native Paper** e **React Native Elements** para UI
- **Vector Icons** para ícones
- **Axios** para requisições HTTP
- **Firebase** (preparado para autenticação e push notifications)

## 📱 Compatibilidade

- **Android**: 8.0 (API 26) ou superior
- **Arquiteturas**: arm64-v8a, armeabi-v7a, x86, x86_64
- **Tamanho**: ~25MB (APK)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+
- React Native CLI
- Android Studio
- JDK 11

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/VehicleConsultApp.git

# Entre no diretório
cd VehicleConsultApp

# Instale as dependências
npm install

# Para Android
npx react-native run-android
```

### Build para Produção

```bash
# Gerar APK de release
cd android
./gradlew assembleRelease

# Gerar AAB (Android App Bundle) para Play Store
./gradlew bundleRelease
```

## 📦 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Context providers (Auth, Theme)
├── hooks/              # Custom hooks
├── navigation/         # Configuração de navegação
├── screens/            # Telas do app
│   ├── auth/          # Telas de autenticação
│   ├── main/          # Telas principais
│   └── dealer/        # Telas específicas de lojistas
├── services/           # Serviços e APIs
├── types/              # Definições TypeScript
└── utils/              # Utilitários e helpers
```

## 🔧 Configuração de APIs

### APIs Gratuitas Integradas

O app está preparado para integrar com APIs gratuitas de consulta veicular. Para implementar:

1. Edite `src/services/VehicleService.ts`
2. Adicione suas chaves de API no arquivo `.env`
3. Configure os endpoints nas constantes do serviço

### APIs Pagas (Futuro)

O sistema está estruturado para facilmente integrar APIs pagas como:
- Consulta DETRAN
- Base de dados de seguradoras
- Informações de leilões
- Recall de fábrica

## 🎨 Personalização

### Tema e Cores

Edite `src/utils/theme.ts` para personalizar:
- Cores primárias e secundárias
- Tipografia
- Espaçamentos
- Modo escuro/claro

### Ícones e Imagens

- Substitua os ícones em `android/app/src/main/res/`
- Adicione seu logo em `assets/images/`
- Configure o splash screen em `android/app/src/main/res/drawable/`

## 📊 Planos de Assinatura

### Pessoa Física
- **Gratuito**: 5 consultas/mês
- **Básico**: R$ 19,90 - 50 consultas/mês
- **Premium**: R$ 49,90 - 200 consultas/mês

### Lojistas
- **Básico**: R$ 99,90 - 500 consultas/mês
- **Premium**: R$ 299,90 - 2000 consultas/mês
- **Empresarial**: R$ 999,90 - Consultas ilimitadas

## 🔒 Segurança

- Autenticação JWT
- Criptografia de dados sensíveis
- Armazenamento seguro (Encrypted Storage)
- Validação de entrada (CPF/CNPJ)
- Proteção contra ataques comuns

## 📱 Publicação na Play Store

### Checklist

- [x] Ícones em todas as resoluções
- [x] Screenshots para diferentes telas
- [x] Descrição otimizada para SEO
- [x] Política de privacidade
- [x] Termos de uso
- [x] Build assinado (release)
- [x] Testes em diferentes dispositivos
- [x] Configuração de billing (Google Play)

### Comandos de Build

```bash
# Gerar keystore de produção
keytool -genkey -v -keystore vehicleconsult-release-key.keystore -alias vehicleconsult -keyalg RSA -keysize 2048 -validity 10000

# Build de produção
cd android && ./gradlew bundleRelease
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: suporte@vehicleconsult.com
- **WhatsApp**: (11) 99999-9999
- **Website**: https://vehicleconsult.com

## 🎯 Roadmap

- [ ] Integração com Google Pay/Apple Pay
- [ ] Notificações push personalizadas
- [ ] Widget para tela inicial
- [ ] Modo offline básico
- [ ] Integração com redes sociais
- [ ] Sistema de indicações
- [ ] API pública para desenvolvedores
- [ ] Versão para iOS

---

Desenvolvido com ❤️ usando React Native + TypeScript