# Guia de Deploy - VehicleConsult

Este guia detalha como preparar e publicar o aplicativo VehicleConsult na Google Play Store.

## 📋 Pré-requisitos

- Android Studio instalado
- JDK 11 ou superior
- Node.js 16+ e npm
- Conta de desenvolvedor na Google Play Console
- Keystore de produção gerado

## 🔧 Preparação do Ambiente

### 1. Configuração do Ambiente

```bash
# Instalar dependências
npm install

# Verificar configuração do React Native
npx react-native doctor

# Limpar cache (se necessário)
npm start -- --reset-cache
```

### 2. Configuração das Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas configurações
nano .env
```

## 🔐 Geração de Keystore de Produção

### 1. Criar Keystore

```bash
# Navegar para pasta android/app
cd android/app

# Gerar keystore
keytool -genkeypair -v -storetype PKCS12 -keystore vehicleconsult-release-key.keystore -alias vehicleconsult-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Preencher informações solicitadas:
# - Nome e sobrenome: VehicleConsult
# - Unidade organizacional: VehicleConsult Team  
# - Organização: VehicleConsult
# - Cidade: São Paulo
# - Estado: SP
# - País: BR
```

### 2. Configurar Gradle

Edite `android/gradle.properties`:

```properties
VEHICLECONSULT_UPLOAD_STORE_FILE=vehicleconsult-release-key.keystore
VEHICLECONSULT_UPLOAD_KEY_ALIAS=vehicleconsult-key-alias
VEHICLECONSULT_UPLOAD_STORE_PASSWORD=sua_senha_do_keystore
VEHICLECONSULT_UPLOAD_KEY_PASSWORD=sua_senha_da_chave
```

### 3. Configurar build.gradle

Adicione em `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('VEHICLECONSULT_UPLOAD_STORE_FILE')) {
                storeFile file(VEHICLECONSULT_UPLOAD_STORE_FILE)
                storePassword VEHICLECONSULT_UPLOAD_STORE_PASSWORD
                keyAlias VEHICLECONSULT_UPLOAD_KEY_ALIAS
                keyPassword VEHICLECONSULT_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

## 🎨 Recursos Visuais

### 1. Ícones do App

Substitua os ícones em `android/app/src/main/res/`:

```
mipmap-hdpi/ic_launcher.png (72x72)
mipmap-mdpi/ic_launcher.png (48x48)
mipmap-xhdpi/ic_launcher.png (96x96)
mipmap-xxhdpi/ic_launcher.png (144x144)
mipmap-xxxhdpi/ic_launcher.png (192x192)
```

### 2. Ícones Adaptativos (Android 8+)

```
mipmap-hdpi/ic_launcher_foreground.png (162x162)
mipmap-mdpi/ic_launcher_foreground.png (108x108)
mipmap-xhdpi/ic_launcher_foreground.png (216x216)
mipmap-xxhdpi/ic_launcher_foreground.png (324x324)
mipmap-xxxhdpi/ic_launcher_foreground.png (432x432)
```

### 3. Feature Graphic

Crie uma imagem 1024x500 px para a Play Store.

### 4. Screenshots

Capture telas em diferentes dispositivos:
- Telefones: 1080x1920, 1440x2560
- Tablets: 1200x1920, 1600x2560

## 🚀 Build de Produção

### 1. Limpar Projeto

```bash
# Limpar builds anteriores
cd android
./gradlew clean

# Voltar para raiz
cd ..
```

### 2. Gerar APK de Release

```bash
cd android
./gradlew assembleRelease
```

APK gerado em: `android/app/build/outputs/apk/release/app-release.apk`

### 3. Gerar AAB (Recomendado para Play Store)

```bash
cd android
./gradlew bundleRelease
```

AAB gerado em: `android/app/build/outputs/bundle/release/app-release.aab`

## 🧪 Testes de Produção

### 1. Instalar APK de Release

```bash
# Instalar no dispositivo
adb install android/app/build/outputs/apk/release/app-release.apk
```

### 2. Testes Essenciais

- [ ] Login/cadastro funcionando
- [ ] Consultas de veículos
- [ ] Navegação entre telas
- [ ] Modo escuro/claro
- [ ] Rotação de tela
- [ ] Performance geral
- [ ] Consumo de bateria
- [ ] Uso de memória

### 3. Teste em Diferentes Dispositivos

- Android 8.0 (API 26)
- Android 9.0 (API 28)
- Android 10 (API 29)
- Android 11 (API 30)
- Android 12+ (API 31+)

## 📱 Configuração da Play Store

### 1. Informações do App

```
Nome: VehicleConsult
Nome curto: VehicleConsult
Descrição: Consulta veicular completa e confiável para Android
```

### 2. Categoria e Tags

```
Categoria: Ferramentas
Tags: consulta veicular, placa, renavam, detran, fipe, carros
```

### 3. Classificação de Conteúdo

- Público: 3+ anos
- Conteúdo: Informativo
- Sem violência, drogas ou conteúdo adulto

### 4. Política de Privacidade

URL: `https://vehicleconsult.com/privacy`

### 5. Informações de Contato

```
Email: suporte@vehicleconsult.com
Telefone: +55 11 99999-9999
Website: https://vehicleconsult.com
```

## 💰 Configuração de Billing

### 1. Configurar Produtos

Na Google Play Console:

1. Monetização > Produtos
2. Criar produtos de assinatura:
   - `basic_plan_monthly` - R$ 19,90/mês
   - `premium_plan_monthly` - R$ 49,90/mês
   - `dealer_basic_monthly` - R$ 99,90/mês
   - `dealer_premium_monthly` - R$ 299,90/mês
   - `dealer_enterprise_monthly` - R$ 999,90/mês

### 2. Configurar Ofertas

- Período de teste gratuito: 7 dias
- Desconto para novos usuários: 50% no primeiro mês

## 🔍 Otimização para ASO

### 1. Título Otimizado

"VehicleConsult - Consulta Veicular Completa"

### 2. Descrição Curta

"Consulte informações completas de veículos por placa ou RENAVAM. Dados oficiais, valor FIPE, débitos e muito mais!"

### 3. Palavras-chave

```
consulta veicular, placa, renavam, detran, fipe, carros, veículos, 
débitos, ipva, multas, roubo furto, lojista, concessionária
```

### 4. Screenshots com Texto

- Tela de consulta: "Consulta rápida por placa"
- Resultados: "Informações completas e confiáveis"
- Dashboard: "Relatórios para lojistas"
- Planos: "Planos flexíveis para todos"

## 📊 Analytics e Monitoramento

### 1. Firebase Analytics

```javascript
// Implementar eventos importantes
analytics().logEvent('vehicle_search', {
  search_type: 'plate',
  user_type: 'individual'
});
```

### 2. Crashlytics

```javascript
// Configurar relatórios de crash
crashlytics().recordError(error);
```

### 3. Performance Monitoring

```javascript
// Monitorar performance de APIs
const trace = perf().newTrace('vehicle_api_call');
trace.start();
// ... fazer chamada API
trace.stop();
```

## 🚀 Processo de Publicação

### 1. Upload do AAB

1. Play Console > Produção > Criar nova versão
2. Upload do arquivo AAB
3. Preencher notas da versão

### 2. Notas da Versão

```
Versão 1.0.0 - Lançamento inicial

🚗 Funcionalidades principais:
• Consulta por placa e RENAVAM
• Informações completas do veículo
• Histórico e favoritos
• Planos para pessoa física e lojistas
• Interface moderna com modo escuro

🔒 Segurança:
• Dados criptografados
• Autenticação segura
• Conformidade com LGPD

📱 Compatibilidade:
• Android 8.0 ou superior
• Suporte a tablets
• Interface responsiva
```

### 3. Revisão e Publicação

1. Revisar todas as informações
2. Enviar para revisão
3. Aguardar aprovação (1-3 dias)
4. Publicar quando aprovado

## 🔄 Atualizações Futuras

### 1. Versionamento

```
Formato: MAJOR.MINOR.PATCH
Exemplo: 1.0.0 → 1.0.1 (correção) → 1.1.0 (nova funcionalidade)
```

### 2. Processo de Atualização

```bash
# Atualizar versionCode e versionName
# android/app/build.gradle

# Gerar novo AAB
./gradlew bundleRelease

# Upload na Play Console
```

### 3. Testes A/B

- Testar diferentes layouts
- Otimizar fluxo de conversão
- Melhorar retenção de usuários

## 🛠️ Solução de Problemas

### 1. Problemas Comuns

**Build falha:**
```bash
# Limpar cache
./gradlew clean
rm -rf node_modules
npm install
```

**Keystore não encontrado:**
```bash
# Verificar caminho do keystore
ls -la android/app/vehicleconsult-release-key.keystore
```

**Erro de assinatura:**
```bash
# Verificar configurações no gradle.properties
cat android/gradle.properties
```

### 2. Logs de Debug

```bash
# Logs do dispositivo
adb logcat | grep VehicleConsult

# Logs do build
./gradlew bundleRelease --debug
```

## ✅ Checklist Final

### Antes da Publicação

- [ ] Todas as funcionalidades testadas
- [ ] Screenshots atualizadas
- [ ] Descrição otimizada
- [ ] Política de privacidade publicada
- [ ] Termos de uso publicados
- [ ] Keystore seguro e backup feito
- [ ] Versão final testada em dispositivos reais
- [ ] Performance otimizada
- [ ] Tamanho do APK/AAB aceitável (<50MB)
- [ ] Conformidade com políticas da Play Store

### Pós-Publicação

- [ ] Monitorar reviews e ratings
- [ ] Acompanhar analytics
- [ ] Responder comentários
- [ ] Planejar próximas atualizações
- [ ] Monitorar crashes e erros

---

## 📞 Suporte

Para dúvidas sobre o deploy:
- Email: dev@vehicleconsult.com
- Documentação: https://vehicleconsult.com/docs
- GitHub Issues: https://github.com/vehicleconsult/app/issues

Boa sorte com a publicação! 🚀