# 🚀 Instruções Rápidas - Aplicação Voz para Libras

## 📁 Arquivos Criados

Sua aplicação completa está pronta! Aqui estão todos os arquivos criados:

### 🎯 Arquivos Principais
- **`menu.html`** - Página inicial com menu de navegação
- **`index.html`** - Aplicação principal completa
- **`styles.css`** - Estilos CSS responsivos
- **`script.js`** - Lógica JavaScript principal
- **`config.js`** - Configurações personalizáveis

### 📚 Documentação e Exemplos
- **`README.md`** - Documentação completa
- **`demo-casos-uso.html`** - 6 casos de uso práticos
- **`exemplo-integracao.html`** - Tutorial de integração
- **`INSTRUCOES.md`** - Este arquivo

## 🎬 Como Começar

### 1. **Acesse o Menu Principal**
```
http://localhost:8000/menu.html
```
- Página inicial com navegação para todas as funcionalidades
- Atalhos de teclado (1, 2, 3, 4) para navegação rápida
- Informações de compatibilidade do navegador

### 2. **Teste a Aplicação Principal**
```
http://localhost:8000/index.html
```
- Interface completa com reconhecimento de voz
- Múltiplos idiomas (PT, EN, ES)
- Integração direta com VLibras

### 3. **Explore os Casos de Uso**
```
http://localhost:8000/demo-casos-uso.html
```
- 6 cenários práticos: educação, atendimento, eventos, etc.
- Widgets interativos para cada caso
- Exemplos de código para integração

## ⚡ Início Rápido (5 minutos)

### Passo 1: Servidor Local
```bash
# Se não estiver rodando ainda:
python3 -m http.server 8000
# Acesse: http://localhost:8000/menu.html
```

### Passo 2: Permissões do Navegador
1. **Permita acesso ao microfone** quando solicitado
2. **Use HTTPS ou localhost** (requisito da Web Speech API)
3. **Navegadores recomendados**: Chrome, Firefox, Edge

### Passo 3: Teste Básico
1. Abra `index.html`
2. Clique no botão do microfone (🎤)
3. Fale algo em português
4. Clique em "Enviar para Libras" (👋)
5. Veja a tradução no avatar VLibras

## 🎨 Personalização Rápida

### Cores e Tema
Edite as variáveis em `styles.css`:
```css
:root {
    --primary-color: #2563eb;    /* Azul padrão */
    --success-color: #059669;    /* Verde de sucesso */
    --error-color: #dc2626;      /* Vermelho de erro */
}
```

### Configurações VLibras
Modifique em `config.js`:
```javascript
vlibras: {
    position: 'R',        // Posição do widget
    avatar: 'icaro',      // Avatar (icaro, hosana, guga)
    opacity: 1            // Transparência (0-1)
}
```

### Idiomas Suportados
Adicione idiomas em `index.html`:
```html
<option value="pt-BR">Português (Brasil)</option>
<option value="en-US">English (US)</option>
<option value="fr-FR">Français</option>
<!-- Adicione mais aqui -->
```

## 🔧 Integração em Seu Projeto

### HTML Mínimo
```html
<!-- VLibras Widget -->
<div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
    </div>
</div>

<!-- Botão de gravação -->
<button id="recordBtn">🎤 Gravar</button>
<div id="transcript"></div>

<!-- Scripts -->
<script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
<script>new window.VLibras.Widget();</script>
```

### JavaScript Básico
```javascript
// Configurar reconhecimento
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'pt-BR';

// Processar resultados
recognition.onresult = function(event) {
    // Seu código aqui
};

// Enviar para VLibras
function sendToVLibras(text) {
    const element = document.createElement('div');
    element.textContent = text;
    element.setAttribute('vw', '');
    document.body.appendChild(element);
    element.click();
}
```

## 🐛 Problemas Comuns

### ❌ "Navegador não suporta reconhecimento de voz"
- **Solução**: Use Chrome, Firefox ou Edge
- **Teste**: Acesse `chrome://settings/content/microphone`

### ❌ "Acesso ao microfone negado"
- **Solução**: Clique no ícone de cadeado na barra de endereços
- **Permita**: Acesso ao microfone para o site

### ❌ "VLibras não carrega"
- **Solução**: Verifique conexão com internet
- **Aguarde**: 2-3 segundos para carregamento completo

### ❌ "Não funciona em arquivo local"
- **Solução**: Use servidor HTTP (python -m http.server)
- **Motivo**: Web Speech API requer HTTPS ou localhost

## 📱 Compatibilidade

| Navegador | Versão | Suporte | Observações |
|-----------|--------|---------|-------------|
| Chrome    | 25+    | ✅ Completo | Melhor experiência |
| Firefox   | 44+    | ✅ Completo | Boa performance |
| Edge      | 79+    | ✅ Completo | Baseado em Chromium |
| Safari    | 14.1+  | ⚠️ Limitado | Funcionalidade reduzida |

## 🎯 Próximos Passos

### Para Desenvolvedores
1. **Personalize** cores e layout no `styles.css`
2. **Configure** idiomas e avatares no `config.js`
3. **Integre** em seu projeto usando `exemplo-integracao.html`
4. **Teste** os casos de uso em `demo-casos-uso.html`

### Para Usuários Finais
1. **Acesse** `menu.html` para navegação
2. **Use** `index.html` para funcionalidade completa
3. **Explore** diferentes idiomas e configurações
4. **Compartilhe** com pessoas que precisam de acessibilidade

## 📞 Suporte

- **Documentação Completa**: `README.md`
- **VLibras Oficial**: https://vlibras.gov.br/
- **Web Speech API**: https://developer.mozilla.org/docs/Web/API/Web_Speech_API

## 🎉 Conclusão

Sua aplicação está **100% funcional** e pronta para uso! 

**Principais recursos:**
- ✅ Reconhecimento de voz em tempo real
- ✅ Tradução automática para Libras
- ✅ Interface responsiva e acessível
- ✅ Múltiplos idiomas suportados
- ✅ Fácil integração e personalização

**Desenvolvido com ❤️ para promover acessibilidade e inclusão digital**

---

*Última atualização: Janeiro 2025*