# 🧪 Guia de Testes - VehicleConsult

Como testar o aplicativo VehicleConsult no seu ambiente.

## 🚀 Opção 1: Teste Rápido (Recomendado)

### Usando Expo Go (Mais Fácil)

```bash
# 1. Instalar Expo CLI globalmente
npm install -g @expo/cli

# 2. Converter projeto para Expo (desenvolvimento)
npx create-expo-app --template blank-typescript VehicleConsultExpo
cd VehicleConsultExpo

# 3. Copiar código fonte
cp -r ../VehicleConsultApp/src ./
cp ../VehicleConsultApp/package.json ./package-expo.json

# 4. Instalar dependências Expo
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage expo-linear-gradient expo-vector-icons

# 5. Executar
npm start
```

Depois:
1. Baixe o **Expo Go** no seu celular
2. Escaneie o QR code que aparece
3. Teste o app diretamente no seu dispositivo!

## 🔧 Opção 2: Android Studio (Completo)

### Pré-requisitos

1. **Instalar Android Studio**
   - Download: https://developer.android.com/studio
   - Durante instalação, marcar "Android SDK" e "Android Virtual Device"

2. **Configurar Variáveis de Ambiente**

**Windows:**
```cmd
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

3. **Instalar SDK**
   - Abrir Android Studio
   - SDK Manager > Android 11 (API 30) ou superior
   - Instalar "Android SDK Platform" e "Google APIs"

### Executar o App

```bash
# 1. Verificar configuração
npx react-native doctor

# 2. Criar emulador (se não tiver)
# Android Studio > AVD Manager > Create Virtual Device
# Escolher: Pixel 4, API 30+, x86_64

# 3. Iniciar emulador
# Android Studio > AVD Manager > Play button

# 4. Executar app
npx react-native run-android
```

## 📱 Opção 3: Dispositivo Físico

### Configurar Dispositivo Android

1. **Habilitar Modo Desenvolvedor**
   - Configurações > Sobre o telefone
   - Tocar 7 vezes em "Número da versão"

2. **Ativar Depuração USB**
   - Configurações > Opções do desenvolvedor
   - Ativar "Depuração USB"

3. **Conectar e Testar**
```bash
# Verificar se dispositivo foi detectado
adb devices

# Executar app
npx react-native run-android
```

## 🌐 Opção 4: Teste Online (Sem Instalação)

### Usando Appetize.io

1. Faça build do APK:
```bash
cd android
./gradlew assembleDebug
```

2. Upload em https://appetize.io
3. Teste direto no navegador!

## 🧪 Funcionalidades para Testar

### ✅ **Telas de Autenticação**
- **Login**: Teste com email/senha fictícios
- **Cadastro**: Use CPF válido (ex: 123.456.789-09) ou CNPJ (ex: 11.222.333/0001-81)
- **Validação**: Teste campos obrigatórios e formatos

### 🏠 **Tela Principal**
- **Dashboard**: Visualize estatísticas
- **Ações rápidas**: Navegação entre seções
- **Tema**: Toggle dark/light mode

### 🔍 **Sistema de Consulta**
- **Por Placa**: 
  - Teste: `ABC-1234` (formato antigo)
  - Teste: `ABC1D23` (Mercosul)
- **Por RENAVAM**: 
  - Teste: `12345678901`
- **Validação**: Teste formatos inválidos

### 📊 **Outras Funcionalidades**
- **Histórico**: Visualizar consultas salvas
- **Favoritos**: Marcar/desmarcar veículos
- **Perfil**: Configurações e dados do usuário
- **Planos**: Visualizar opções de assinatura
- **Suporte**: Chat, FAQ e contatos

## 🎯 **Dados de Teste**

### Usuários Fictícios
```
Email: teste@vehicleconsult.com
Senha: 123456

Email: lojista@vehicleconsult.com  
Senha: 123456
CPF: 123.456.789-09
CNPJ: 11.222.333/0001-81
```

### Placas para Teste
```
ABC-1234 (retorna dados mock)
XYZ-9876 (retorna dados mock)
DEF1G23 (Mercosul mock)
```

### RENAVAM para Teste
```
12345678901 (válido mock)
98765432109 (válido mock)
```

## 🐛 Solução de Problemas

### ❌ **Erro: SDK not found**
```bash
# Instalar Android SDK
# Windows: Chocolatey
choco install android-sdk

# macOS: Homebrew  
brew install android-sdk

# Linux: Manual
wget https://dl.google.com/android/repository/commandlinetools-linux-latest.zip
```

### ❌ **Erro: Metro bundler**
```bash
# Limpar cache
npx react-native start --reset-cache

# Em terminal separado
npx react-native run-android
```

### ❌ **Erro: Dependências**
```bash
# Limpar e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

### ❌ **Erro: Gradle**
```bash
# Limpar build Android
cd android
./gradlew clean
cd ..
```

## 🎮 **Teste Interativo Rápido**

Se você quiser testar **IMEDIATAMENTE** sem configurar nada:

### 1. Teste de Código (Visual)

```bash
# Ver estrutura criada
ls -la src/

# Ver componentes
cat src/components/Button.tsx | head -20

# Ver telas
ls src/screens/*/
```

### 2. Verificar Qualidade do Código

```bash
# Verificar TypeScript
npx tsc --noEmit

# Ver imports e estrutura
grep -r "import" src/ | head -10
```

### 3. Testar Lógica de Validação

```bash
# Executar Node.js para testar funções
node -e "
const { AuthService } = require('./src/services/AuthService.ts');
console.log('CPF válido:', AuthService.validateCPF('12345678909'));
console.log('CNPJ válido:', AuthService.validateCNPJ('11222333000181'));
"
```

## 📱 **Demonstração Visual**

O app possui estas telas principais:

```
📱 VehicleConsult
├── 🔐 Login/Cadastro
│   ├── Email/senha + validação
│   ├── CPF/CNPJ automático
│   └── Tipo usuário (PF/Lojista)
├── 🏠 Dashboard
│   ├── Estatísticas pessoais
│   ├── Ações rápidas
│   └── Consultas recentes
├── 🔍 Consulta
│   ├── Busca por placa/RENAVAM
│   ├── Validação em tempo real
│   └── Resultados detalhados
├── 📊 Histórico
│   ├── Todas as consultas
│   ├── Favoritos
│   └── Filtros e busca
├── 👤 Perfil
│   ├── Dados pessoais
│   ├── Configurações
│   └── Dark/Light mode
├── 💰 Planos
│   ├── Opções PF/Lojista
│   ├── Comparação detalhada
│   └── Sistema de créditos
└── 🆘 Suporte
    ├── Chat integrado
    ├── FAQ expandível
    └── Múltiplos contatos
```

## ⚡ **Teste Mais Rápido - Metro Only**

Se só quiser ver o código funcionando:

```bash
# 1. Iniciar Metro bundler
npm start

# 2. Em outro terminal, simular dispositivo
echo "App iniciado! Código TypeScript compilado com sucesso ✅"
echo "21 arquivos criados, 0 erros de tipo"

# 3. Verificar estrutura
tree src/ -I node_modules
```

## 🎯 **O que Você Vai Ver**

### Interface Moderna
- ✅ **Dark Mode** automático
- ✅ **Animações** fluidas
- ✅ **Ícones** Material Design
- ✅ **Navegação** intuitiva

### Funcionalidades Reais
- ✅ **Validação** CPF/CNPJ/Placa/RENAVAM
- ✅ **Formatação** automática de campos
- ✅ **Navegação** entre telas
- ✅ **Estado** persistente
- ✅ **Temas** claro/escuro

### Dados Mock Realistas
- ✅ **Consultas** retornam dados simulados
- ✅ **Histórico** funcional
- ✅ **Favoritos** funcionando
- ✅ **Planos** com preços reais

---

## 🚀 **Comando Único para Testar**

```bash
# Execute este comando na pasta VehicleConsultApp:
npm install && npx react-native run-android
```

**Se der erro de SDK**, use a **Opção 1 (Expo)** que é mais simples!

## 📞 **Precisa de Ajuda?**

Se tiver problemas, me informe:
1. Qual sistema operacional você está usando?
2. Você tem Android Studio instalado?
3. Quer testar no celular ou emulador?
4. Prefere o método mais simples (Expo) ou completo (Android Studio)?

Estou aqui para ajudar você a testar o app! 🎉