/**
 * Configurações da Aplicação Voz para Libras
 * 
 * Este arquivo contém todas as configurações personalizáveis da aplicação.
 * Edite os valores conforme necessário para adaptar à sua implementação.
 */

const VoiceToLibrasConfig = {
    // Configurações do VLibras
    vlibras: {
        // URL base do VLibras
        rootPath: 'https://vlibras.gov.br/app',
        
        // Opacidade do widget (0 a 1)
        opacity: 1,
        
        // Posição do widget ('TL', 'T', 'TR', 'R', 'BR', 'B', 'BL', 'L')
        position: 'R',
        
        // Avatar padrão ('icaro', 'hosana', 'guga', 'random')
        avatar: 'icaro',
        
        // URL de personalização (opcional)
        personalization: null
    },

    // Configurações do reconhecimento de voz
    speechRecognition: {
        // Idioma padrão
        defaultLanguage: 'pt-BR',
        
        // Reconhecimento contínuo
        continuous: true,
        
        // Resultados intermediários
        interimResults: true,
        
        // Número máximo de alternativas
        maxAlternatives: 1,
        
        // Idiomas disponíveis
        supportedLanguages: [
            { code: 'pt-BR', name: 'Português (Brasil)' },
            { code: 'en-US', name: 'English (US)' },
            { code: 'es-ES', name: 'Español' },
            { code: 'fr-FR', name: 'Français' },
            { code: 'it-IT', name: 'Italiano' },
            { code: 'de-DE', name: 'Deutsch' }
        ]
    },

    // Configurações da interface
    ui: {
        // Tema da aplicação ('light', 'dark', 'auto')
        theme: 'light',
        
        // Animações habilitadas
        animations: true,
        
        // Tempo de auto-hide para mensagens (ms)
        messageTimeout: {
            error: 5000,
            success: 3000,
            info: 2000
        },
        
        // Atalhos de teclado habilitados
        keyboardShortcuts: true,
        
        // Feedback sonoro (se disponível)
        soundFeedback: false
    },

    // Configurações de acessibilidade
    accessibility: {
        // Suporte a leitores de tela
        screenReader: true,
        
        // Alto contraste
        highContrast: false,
        
        // Redução de movimento
        reducedMotion: false,
        
        // Tamanho de fonte aumentado
        largeFonts: false
    },

    // Configurações avançadas
    advanced: {
        // Debug mode
        debug: false,
        
        // Timeout para reconhecimento (ms)
        recognitionTimeout: 30000,
        
        // Tentativas de reconexão
        maxRetries: 3,
        
        // Intervalo entre tentativas (ms)
        retryInterval: 1000,
        
        // Cache de resultados
        cacheResults: false,
        
        // Analytics habilitado
        analytics: false
    },

    // Mensagens personalizáveis
    messages: {
        pt: {
            ready: 'Pronto para gravar',
            recording: 'Gravando - Fale agora',
            processing: 'Processando...',
            noSpeech: 'Nenhuma fala detectada. Tente falar mais alto.',
            audioCapture: 'Erro ao capturar áudio. Verifique se o microfone está funcionando.',
            notAllowed: 'Acesso ao microfone negado. Permita o acesso nas configurações do navegador.',
            network: 'Erro de rede. Verifique sua conexão com a internet.',
            serviceNotAllowed: 'Serviço de reconhecimento não permitido.',
            noSupport: 'Seu navegador não suporta reconhecimento de voz.',
            vlibrasNotLoaded: 'VLibras não está carregado. Recarregue a página e tente novamente.',
            noTextToSend: 'Não há texto para enviar ao VLibras. Grave algo primeiro.',
            textSent: 'Texto enviado para o VLibras com sucesso!',
            textCleared: 'Texto limpo',
            placeholder: 'O texto transcrito aparecerá aqui...'
        },
        en: {
            ready: 'Ready to record',
            recording: 'Recording - Speak now',
            processing: 'Processing...',
            noSpeech: 'No speech detected. Try speaking louder.',
            audioCapture: 'Audio capture error. Check if microphone is working.',
            notAllowed: 'Microphone access denied. Allow access in browser settings.',
            network: 'Network error. Check your internet connection.',
            serviceNotAllowed: 'Recognition service not allowed.',
            noSupport: 'Your browser does not support speech recognition.',
            vlibrasNotLoaded: 'VLibras is not loaded. Reload the page and try again.',
            noTextToSend: 'No text to send to VLibras. Record something first.',
            textSent: 'Text sent to VLibras successfully!',
            textCleared: 'Text cleared',
            placeholder: 'Transcribed text will appear here...'
        }
    },

    // Comandos de voz especiais
    voiceCommands: {
        enabled: true,
        commands: {
            clear: ['limpar', 'apagar', 'deletar', 'clear', 'delete'],
            send: ['enviar', 'traduzir', 'libras', 'send', 'translate'],
            stop: ['parar', 'pare', 'stop', 'halt'],
            start: ['iniciar', 'começar', 'start', 'begin']
        }
    },

    // Configurações de performance
    performance: {
        // Debounce para atualizações da UI (ms)
        uiUpdateDebounce: 100,
        
        // Throttle para processamento de resultados (ms)
        resultProcessingThrottle: 50,
        
        // Lazy loading de componentes
        lazyLoading: true,
        
        // Otimizações para dispositivos móveis
        mobileOptimizations: true
    }
};

// Função para aplicar configurações personalizadas
function applyCustomConfig(customConfig) {
    return Object.assign({}, VoiceToLibrasConfig, customConfig);
}

// Função para obter configuração por idioma
function getLocalizedConfig(language = 'pt') {
    const config = { ...VoiceToLibrasConfig };
    if (config.messages[language]) {
        config.currentMessages = config.messages[language];
    } else {
        config.currentMessages = config.messages.pt;
    }
    return config;
}

// Função para validar configurações
function validateConfig(config) {
    const errors = [];
    
    // Validar configurações do VLibras
    if (config.vlibras.opacity < 0 || config.vlibras.opacity > 1) {
        errors.push('VLibras opacity must be between 0 and 1');
    }
    
    const validPositions = ['TL', 'T', 'TR', 'R', 'BR', 'B', 'BL', 'L'];
    if (!validPositions.includes(config.vlibras.position)) {
        errors.push('Invalid VLibras position');
    }
    
    const validAvatars = ['icaro', 'hosana', 'guga', 'random'];
    if (!validAvatars.includes(config.vlibras.avatar)) {
        errors.push('Invalid VLibras avatar');
    }
    
    // Validar idiomas
    const validLanguages = config.speechRecognition.supportedLanguages.map(lang => lang.code);
    if (!validLanguages.includes(config.speechRecognition.defaultLanguage)) {
        errors.push('Default language not in supported languages list');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Função para aplicar tema
function applyTheme(theme) {
    const root = document.documentElement;
    
    switch (theme) {
        case 'dark':
            root.style.setProperty('--background-color', '#1a1a1a');
            root.style.setProperty('--surface-color', '#2d2d2d');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#cccccc');
            root.style.setProperty('--border-color', '#404040');
            break;
            
        case 'high-contrast':
            root.style.setProperty('--primary-color', '#ffff00');
            root.style.setProperty('--background-color', '#000000');
            root.style.setProperty('--surface-color', '#000000');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#ffff00');
            root.style.setProperty('--border-color', '#ffffff');
            break;
            
        case 'light':
        default:
            // Valores padrão já definidos no CSS
            break;
    }
}

// Função para detectar preferências do sistema
function detectSystemPreferences() {
    const preferences = {
        theme: 'light',
        reducedMotion: false,
        highContrast: false
    };
    
    // Detectar tema escuro
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        preferences.theme = 'dark';
    }
    
    // Detectar preferência por movimento reduzido
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        preferences.reducedMotion = true;
    }
    
    // Detectar preferência por alto contraste
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        preferences.highContrast = true;
    }
    
    return preferences;
}

// Função para salvar configurações no localStorage
function saveConfig(config) {
    try {
        localStorage.setItem('voiceToLibrasConfig', JSON.stringify(config));
        return true;
    } catch (error) {
        console.warn('Could not save config to localStorage:', error);
        return false;
    }
}

// Função para carregar configurações do localStorage
function loadConfig() {
    try {
        const saved = localStorage.getItem('voiceToLibrasConfig');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Could not load config from localStorage:', error);
    }
    return null;
}

// Função para resetar configurações
function resetConfig() {
    try {
        localStorage.removeItem('voiceToLibrasConfig');
        return true;
    } catch (error) {
        console.warn('Could not reset config:', error);
        return false;
    }
}

// Exportar configurações e funções utilitárias
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = {
        VoiceToLibrasConfig,
        applyCustomConfig,
        getLocalizedConfig,
        validateConfig,
        applyTheme,
        detectSystemPreferences,
        saveConfig,
        loadConfig,
        resetConfig
    };
} else {
    // Browser
    window.VoiceToLibrasConfig = VoiceToLibrasConfig;
    window.VoiceToLibrasConfigUtils = {
        applyCustomConfig,
        getLocalizedConfig,
        validateConfig,
        applyTheme,
        detectSystemPreferences,
        saveConfig,
        loadConfig,
        resetConfig
    };
}