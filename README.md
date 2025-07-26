# 🎤👋 Aplicação Voz para Libras

Uma aplicação web moderna que integra reconhecimento de voz com tradução para Libras usando VLibras. Permite que usuários falem no microfone e vejam a tradução em tempo real através do avatar 3D da plataforma VLibras.

## ✨ Funcionalidades

- **🎙️ Reconhecimento de Voz**: Captura áudio do microfone e converte para texto em tempo real
- **🌐 Múltiplos Idiomas**: Suporte para Português (Brasil), Inglês (EUA) e Espanhol
- **👋 Integração VLibras**: Tradução automática para Libras com avatar 3D
- **📱 Design Responsivo**: Interface adaptável para desktop e dispositivos móveis
- **♿ Acessibilidade**: Suporte completo a leitores de tela e navegação por teclado
- **⌨️ Atalhos de Teclado**: Controles rápidos para melhor experiência do usuário

## 🚀 Como Usar

### 1. Configuração Inicial

1. **Clone ou baixe os arquivos** da aplicação
2. **Abra o arquivo `index.html`** em um navegador moderno (Chrome, Firefox, Edge)
3. **Permita o acesso ao microfone** quando solicitado pelo navegador

### 2. Operação Básica

1. **Clique no botão do microfone** (🎤) para iniciar a gravação
2. **Fale claramente** no microfone
3. **Veja o texto sendo transcrito** em tempo real
4. **Clique em "Enviar para Libras"** (👋) para ver a tradução
5. **Use "Limpar Texto"** (🗑️) para começar novamente

### 3. Atalhos de Teclado

- **Espaço**: Iniciar/parar gravação
- **Ctrl + L**: Limpar texto
- **Ctrl + Enter**: Enviar para VLibras

## 🛠️ Tecnologias Utilizadas

### Front-end
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design moderno com variáveis CSS e Grid/Flexbox
- **JavaScript ES6+**: Lógica da aplicação com classes e módulos

### APIs e Bibliotecas
- **Web Speech API**: Reconhecimento de voz nativo do navegador
- **VLibras Widget**: Tradução para Libras (https://vlibras.gov.br/)
- **Google Fonts**: Tipografia Inter para melhor legibilidade

## 📋 Requisitos do Sistema

### Navegadores Suportados
- ✅ **Chrome 25+** (Recomendado)
- ✅ **Firefox 44+**
- ✅ **Edge 79+**
- ✅ **Safari 14.1+** (funcionalidade limitada)

### Requisitos Técnicos
- **Conexão com Internet**: Necessária para VLibras e reconhecimento de voz
- **Microfone**: Dispositivo de entrada de áudio funcional
- **HTTPS**: Requerido para Web Speech API (ou localhost para desenvolvimento)

## 🔧 Instalação e Configuração

### Opção 1: Uso Direto (Recomendado)
```bash
# 1. Clone ou baixe os arquivos
git clone [URL_DO_REPOSITORIO]

# 2. Navegue até o diretório
cd aplicacao-voz-libras

# 3. Abra index.html no navegador
# Ou use um servidor local simples:
python -m http.server 8000
# Acesse: http://localhost:8000
```

### Opção 2: Servidor Web
```bash
# Para desenvolvimento com Node.js
npx serve .
# Ou
npx http-server .

# Para PHP
php -S localhost:8000

# Para Python
python -m http.server 8000
```

## 📁 Estrutura do Projeto

```
aplicacao-voz-libras/
├── index.html          # Página principal
├── styles.css          # Estilos da aplicação
├── script.js           # Lógica JavaScript
├── README.md           # Documentação
└── assets/             # Recursos adicionais (opcional)
    ├── icons/
    └── images/
```

## 🎨 Personalização

### Cores e Temas
Edite as variáveis CSS em `styles.css`:

```css
:root {
    --primary-color: #2563eb;      /* Cor principal */
    --primary-hover: #1d4ed8;      /* Cor hover */
    --success-color: #059669;      /* Cor de sucesso */
    --error-color: #dc2626;        /* Cor de erro */
    --background-color: #f8fafc;   /* Fundo */
    --surface-color: #ffffff;      /* Superfícies */
}
```

### Configuração do VLibras
Modifique a inicialização no `index.html`:

```javascript
new window.VLibras.Widget({
    rootPath: 'https://vlibras.gov.br/app',
    opacity: 1,
    position: 'R',
    avatar: 'icaro'
});
```

### Idiomas Disponíveis
Adicione novos idiomas no `index.html`:

```html
<select id="languageSelect" class="language-select">
    <option value="pt-BR">Português (Brasil)</option>
    <option value="en-US">English (US)</option>
    <option value="es-ES">Español</option>
    <option value="fr-FR">Français</option>
    <!-- Adicione mais idiomas aqui -->
</select>
```

## 🐛 Solução de Problemas

### Problemas Comuns

**1. Microfone não funciona**
- Verifique as permissões do navegador
- Teste em `chrome://settings/content/microphone`
- Certifique-se de que está usando HTTPS ou localhost

**2. VLibras não carrega**
- Verifique a conexão com internet
- Aguarde alguns segundos para carregamento
- Recarregue a página se necessário

**3. Reconhecimento de voz não funciona**
- Use Chrome ou Firefox (melhor suporte)
- Fale mais claramente e próximo ao microfone
- Verifique se não há ruído de fundo

**4. Texto não é enviado para VLibras**
- Aguarde o VLibras carregar completamente
- Verifique se há texto transcrito
- Tente recarregar a página

### Códigos de Erro

| Erro | Causa | Solução |
|------|-------|---------|
| `not-allowed` | Permissão negada | Permitir acesso ao microfone |
| `no-speech` | Nenhuma fala detectada | Falar mais alto ou próximo |
| `network` | Erro de rede | Verificar conexão |
| `audio-capture` | Problema com microfone | Testar microfone |

## 🔒 Segurança e Privacidade

- **Dados Locais**: O texto transcrito é processado localmente
- **APIs Externas**: VLibras e Google Speech (para reconhecimento)
- **Sem Armazenamento**: Nenhum dado é salvo permanentemente
- **HTTPS**: Requerido para funcionalidades de microfone

## 🤝 Contribuindo

### Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Diretrizes
- Siga os padrões de código existentes
- Adicione comentários para código complexo
- Teste em múltiplos navegadores
- Mantenha a acessibilidade

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **VLibras**: Plataforma de tradução para Libras do Governo Federal
- **Web Speech API**: Tecnologia de reconhecimento de voz dos navegadores
- **Comunidade**: Desenvolvedores que contribuem para acessibilidade web

## 📞 Suporte

Para dúvidas ou problemas:

1. **Documentação**: Consulte este README
2. **Issues**: Abra uma issue no repositório
3. **VLibras**: Documentação oficial em https://vlibras.gov.br/

## 🔄 Atualizações

### Versão 1.0.0 (Atual)
- ✅ Reconhecimento de voz básico
- ✅ Integração com VLibras
- ✅ Interface responsiva
- ✅ Múltiplos idiomas
- ✅ Atalhos de teclado

### Próximas Versões
- 🔄 Melhorias na precisão do reconhecimento
- 🔄 Mais opções de personalização
- 🔄 Suporte offline
- 🔄 Histórico de transcrições
- 🔄 Exportação de texto

---

**Desenvolvido com ❤️ para promover acessibilidade e inclusão digital**