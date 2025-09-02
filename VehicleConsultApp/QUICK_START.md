# 🚀 Quick Start - VehicleConsult

Guia rápido para executar o projeto localmente.

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Android Studio configurado
- JDK 11 instalado
- Dispositivo Android ou emulador

## ⚡ Execução Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Executar no Android
npx react-native run-android

# 3. (Opcional) Iniciar Metro separadamente
npm start
```

## 🔧 Configuração Inicial

### 1. Configurar Ambiente

```bash
# Verificar configuração do React Native
npx react-native doctor

# Se houver problemas, seguir instruções exibidas
```

### 2. Configurar Emulador Android

1. Abrir Android Studio
2. AVD Manager > Create Virtual Device
3. Escolher Pixel 4 (ou similar)
4. System Image: API 30+ (Android 11+)
5. Iniciar emulador

### 3. Configurar Dispositivo Físico

1. Habilitar "Opções de Desenvolvedor" no Android
2. Ativar "Depuração USB"
3. Conectar via USB
4. Verificar: `adb devices`

## 🎯 Funcionalidades Testáveis

### ✅ Sem Backend

- [x] Navegação entre telas
- [x] Tema claro/escuro
- [x] Interface responsiva
- [x] Validação de formulários
- [x] Animações e transições
- [x] Consulta mock (dados simulados)

### 🔄 Com Backend (Implementar)

- [ ] Autenticação real
- [ ] Consultas de API reais
- [ ] Sincronização de dados
- [ ] Notificações push
- [ ] Pagamentos (Google Play Billing)

## 📱 Telas Implementadas

### 🔐 Autenticação
- **Login**: Email/senha + validação
- **Cadastro**: CPF/CNPJ, tipo de usuário

### 🏠 Principais
- **Home**: Dashboard com estatísticas
- **Consulta**: Busca por placa/RENAVAM
- **Histórico**: Consultas salvas e favoritos
- **Perfil**: Configurações e conta

### 💼 Lojista (B2B)
- **Dashboard**: Métricas empresariais
- **Relatórios**: Exportação de dados

### ⚙️ Extras
- **Planos**: Assinaturas e créditos
- **Suporte**: Chat e FAQ
- **Detalhes**: Informações completas do veículo

## 🎨 Personalização

### Cores e Tema

Edite `src/utils/theme.ts`:

```typescript
export const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',    // Azul principal
    success: '#34C759',    // Verde
    error: '#FF3B30',      // Vermelho
    warning: '#FF9500',    // Laranja
    // ... outras cores
  },
};
```

### Dados Mock

Edite `src/services/VehicleService.ts`:

```typescript
const mockVehicle: Vehicle = {
  plate: 'ABC-1234',
  brand: 'VOLKSWAGEN',
  model: 'GOL',
  year: 2020,
  // ... personalizar dados
};
```

## 🔧 Scripts Úteis

```bash
# Limpar cache
npm start -- --reset-cache

# Limpar build Android
cd android && ./gradlew clean && cd ..

# Reinstalar dependências
rm -rf node_modules && npm install

# Verificar tipos TypeScript
npx tsc --noEmit

# Executar linter
npm run lint

# Executar testes
npm test
```

## 🐛 Solução de Problemas

### Metro bundler não inicia
```bash
npx react-native start --reset-cache
```

### Erro de build Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Erro de dependências
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Erro de permissões (Linux/Mac)
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) node_modules
```

## 📊 Estrutura do Projeto

```
VehicleConsultApp/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Context API (Auth, Theme)
│   ├── navigation/     # Configuração de rotas
│   ├── screens/        # Telas do app
│   ├── services/       # APIs e serviços
│   ├── types/          # Tipos TypeScript
│   └── utils/          # Utilitários
├── android/            # Projeto Android nativo
├── assets/             # Imagens e recursos
└── docs/               # Documentação
```

## 🚀 Próximos Passos

1. **Integrar APIs Reais**
   - Configurar backend
   - Implementar autenticação JWT
   - Conectar APIs de consulta veicular

2. **Implementar Pagamentos**
   - Google Play Billing
   - Gerenciamento de assinaturas

3. **Adicionar Push Notifications**
   - Firebase Cloud Messaging
   - Notificações personalizadas

4. **Otimizar Performance**
   - Lazy loading
   - Cache inteligente
   - Otimização de imagens

5. **Testes Automatizados**
   - Unit tests
   - Integration tests
   - E2E tests

## 📞 Suporte

- **Documentação Completa**: `README.md`
- **Deploy**: `DEPLOYMENT_GUIDE.md`
- **Políticas**: `PRIVACY_POLICY.md` e `TERMS_OF_SERVICE.md`

---

**Desenvolvido com ❤️ usando React Native + TypeScript**

Bom desenvolvimento! 🎉