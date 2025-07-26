/**
 * Aplicação de Voz para Libras
 * Integra Web Speech API com VLibras para transcrição de voz e tradução para Libras
 */

class VoiceToLibrasApp {
    constructor() {
        // Elementos do DOM
        this.recordButton = document.getElementById('recordButton');
        this.recordingStatus = document.getElementById('recordingStatus');
        this.transcriptionResult = document.getElementById('transcriptionResult');
        this.languageSelect = document.getElementById('languageSelect');
        this.clearTextButton = document.getElementById('clearText');
        this.sendToVlibrasButton = document.getElementById('sendToVlibras');
        this.errorMessage = document.getElementById('errorMessage');

        // Estado da aplicação
        this.isRecording = false;
        this.recognition = null;
        this.finalTranscript = '';
        this.interimTranscript = '';

        // Inicialização
        this.init();
    }

    /**
     * Inicializa a aplicação
     */
    init() {
        this.checkSpeechRecognitionSupport();
        this.setupEventListeners();
        this.setupSpeechRecognition();
        this.updateUI();
    }

    /**
     * Verifica se o navegador suporta Speech Recognition
     */
    checkSpeechRecognitionSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.showError(
                'Seu navegador não suporta reconhecimento de voz. ' +
                'Por favor, use Chrome, Edge ou Firefox para uma melhor experiência.'
            );
            this.recordButton.disabled = true;
            return false;
        }
        
        return true;
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        // Botão de gravação
        this.recordButton.addEventListener('click', () => {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        });

        // Seleção de idioma
        this.languageSelect.addEventListener('change', () => {
            if (this.recognition) {
                this.recognition.lang = this.languageSelect.value;
            }
        });

        // Botão limpar texto
        this.clearTextButton.addEventListener('click', () => {
            this.clearTranscription();
        });

        // Botão enviar para VLibras
        this.sendToVlibrasButton.addEventListener('click', () => {
            this.sendToVLibras();
        });

        // Atalhos de teclado
        document.addEventListener('keydown', (event) => {
            // Espaço para iniciar/parar gravação
            if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                event.preventDefault();
                if (this.isRecording) {
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            }
            
            // Ctrl+L para limpar texto
            if (event.ctrlKey && event.key === 'l') {
                event.preventDefault();
                this.clearTranscription();
            }
            
            // Ctrl+Enter para enviar ao VLibras
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                this.sendToVLibras();
            }
        });
    }

    /**
     * Configura o Speech Recognition
     */
    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        
        // Configurações do reconhecimento
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.languageSelect.value;
        this.recognition.maxAlternatives = 1;

        // Event listeners do Speech Recognition
        this.recognition.onstart = () => {
            console.log('Reconhecimento de voz iniciado');
            this.isRecording = true;
            this.updateUI();
            this.hideError();
        };

        this.recognition.onresult = (event) => {
            this.processResults(event);
        };

        this.recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            this.handleRecognitionError(event.error);
        };

        this.recognition.onend = () => {
            console.log('Reconhecimento de voz finalizado');
            this.isRecording = false;
            this.updateUI();
        };

        // Eventos adicionais para melhor controle
        this.recognition.onspeechstart = () => {
            console.log('Fala detectada');
        };

        this.recognition.onspeechend = () => {
            console.log('Final da fala detectado');
        };

        this.recognition.onnomatch = () => {
            console.log('Nenhuma correspondência encontrada');
            this.showError('Não foi possível reconhecer o que foi dito. Tente falar mais claramente.');
        };
    }

    /**
     * Inicia a gravação
     */
    startRecording() {
        if (!this.recognition) {
            this.showError('Reconhecimento de voz não está disponível.');
            return;
        }

        try {
            // Limpa transcrições anteriores se necessário
            this.interimTranscript = '';
            
            // Inicia o reconhecimento
            this.recognition.start();
            
        } catch (error) {
            console.error('Erro ao iniciar gravação:', error);
            this.showError('Erro ao iniciar a gravação. Tente novamente.');
        }
    }

    /**
     * Para a gravação
     */
    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
    }

    /**
     * Processa os resultados do reconhecimento de voz
     */
    processResults(event) {
        let interimTranscript = '';
        let finalTranscript = this.finalTranscript;

        // Processa todos os resultados
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Atualiza as transcrições
        this.finalTranscript = finalTranscript;
        this.interimTranscript = interimTranscript;

        // Atualiza a interface
        this.updateTranscriptionDisplay();
        
        // Habilita o botão de enviar se há texto
        this.updateSendButtonState();
    }

    /**
     * Atualiza a exibição da transcrição
     */
    updateTranscriptionDisplay() {
        const finalText = this.finalTranscript.trim();
        const interimText = this.interimTranscript.trim();
        
        if (!finalText && !interimText) {
            this.transcriptionResult.innerHTML = '<p class="placeholder-text">O texto transcrito aparecerá aqui...</p>';
            return;
        }

        let html = '';
        
        if (finalText) {
            html += `<span class="final-text">${this.escapeHtml(finalText)}</span>`;
        }
        
        if (interimText) {
            if (finalText) html += ' ';
            html += `<span class="interim-text">${this.escapeHtml(interimText)}</span>`;
        }

        this.transcriptionResult.innerHTML = html;
        
        // Scroll para o final
        this.transcriptionResult.scrollTop = this.transcriptionResult.scrollHeight;
    }

    /**
     * Limpa a transcrição
     */
    clearTranscription() {
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.updateTranscriptionDisplay();
        this.updateSendButtonState();
        this.hideError();
    }

    /**
     * Envia o texto para o VLibras
     */
    sendToVLibras() {
        const text = this.finalTranscript.trim();
        
        if (!text) {
            this.showError('Não há texto para enviar ao VLibras. Grave algo primeiro.');
            return;
        }

        try {
            // Verifica se o VLibras está disponível
            if (!window.VLibras) {
                this.showError('VLibras não está carregado. Recarregue a página e tente novamente.');
                return;
            }

            // Método para enviar texto ao VLibras
            this.sendTextToVLibras(text);
            
            // Feedback visual
            this.showSuccess('Texto enviado para o VLibras com sucesso!');
            
        } catch (error) {
            console.error('Erro ao enviar texto para VLibras:', error);
            this.showError('Erro ao enviar texto para o VLibras. Tente novamente.');
        }
    }

    /**
     * Envia texto para o VLibras
     */
    sendTextToVLibras(text) {
        try {
            // Cria um elemento temporário com o texto
            const tempElement = document.createElement('div');
            tempElement.textContent = text;
            tempElement.style.position = 'absolute';
            tempElement.style.left = '-9999px';
            tempElement.setAttribute('vw', '');
            
            // Adiciona ao DOM
            document.body.appendChild(tempElement);
            
            // Simula um clique no elemento para ativar o VLibras
            tempElement.click();
            
            // Aguarda um pouco e remove o elemento
            setTimeout(() => {
                if (tempElement.parentNode) {
                    tempElement.parentNode.removeChild(tempElement);
                }
            }, 1000);
            
            // Força a atualização do VLibras se possível
            if (window.VLibras && window.VLibras.Widget) {
                // Tenta forçar a tradução do texto
                const vLibrasWidget = document.querySelector('[vw-plugin-wrapper]');
                if (vLibrasWidget) {
                    // Simula interação com o widget
                    const event = new CustomEvent('vlibras-translate', {
                        detail: { text: text }
                    });
                    document.dispatchEvent(event);
                }
            }
            
        } catch (error) {
            console.error('Erro ao processar texto no VLibras:', error);
            throw error;
        }
    }

    /**
     * Trata erros do reconhecimento de voz
     */
    handleRecognitionError(error) {
        let errorMessage = 'Erro no reconhecimento de voz: ';
        
        switch (error) {
            case 'no-speech':
                errorMessage += 'Nenhuma fala foi detectada. Tente falar mais alto.';
                break;
            case 'audio-capture':
                errorMessage += 'Erro ao capturar áudio. Verifique se o microfone está funcionando.';
                break;
            case 'not-allowed':
                errorMessage += 'Acesso ao microfone negado. Permita o acesso nas configurações do navegador.';
                break;
            case 'network':
                errorMessage += 'Erro de rede. Verifique sua conexão com a internet.';
                break;
            case 'service-not-allowed':
                errorMessage += 'Serviço de reconhecimento não permitido.';
                break;
            default:
                errorMessage += error;
        }
        
        this.showError(errorMessage);
        this.isRecording = false;
        this.updateUI();
    }

    /**
     * Atualiza a interface do usuário
     */
    updateUI() {
        const statusText = this.recordingStatus.querySelector('.status-text');
        
        if (this.isRecording) {
            // Estado de gravação
            this.recordButton.classList.add('recording');
            this.recordButton.querySelector('.record-text').textContent = 'Gravando...';
            this.recordButton.querySelector('.record-icon').textContent = '⏹️';
            this.recordButton.setAttribute('aria-label', 'Parar gravação');
            
            statusText.textContent = 'Gravando - Fale agora';
            statusText.classList.add('recording');
            statusText.classList.remove('processing');
            
        } else {
            // Estado parado
            this.recordButton.classList.remove('recording');
            this.recordButton.querySelector('.record-text').textContent = 'Clique para falar';
            this.recordButton.querySelector('.record-icon').textContent = '🎤';
            this.recordButton.setAttribute('aria-label', 'Iniciar gravação');
            
            statusText.textContent = 'Pronto para gravar';
            statusText.classList.remove('recording', 'processing');
        }
        
        this.updateSendButtonState();
    }

    /**
     * Atualiza o estado do botão de enviar
     */
    updateSendButtonState() {
        const hasText = this.finalTranscript.trim().length > 0;
        this.sendToVlibrasButton.disabled = !hasText;
    }

    /**
     * Mostra mensagem de erro
     */
    showError(message) {
        this.errorMessage.querySelector('.error-text').textContent = message;
        this.errorMessage.style.display = 'flex';
        
        // Auto-hide após 5 segundos
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    /**
     * Esconde mensagem de erro
     */
    hideError() {
        this.errorMessage.style.display = 'none';
    }

    /**
     * Mostra mensagem de sucesso
     */
    showSuccess(message) {
        // Cria elemento de sucesso se não existir
        let successElement = document.getElementById('successMessage');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.id = 'successMessage';
            successElement.className = 'success-message';
            successElement.innerHTML = `
                <span class="success-icon">✅</span>
                <span class="success-text"></span>
            `;
            successElement.style.cssText = `
                background: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 2rem;
                display: none;
                align-items: center;
                gap: 0.75rem;
                color: #166534;
            `;
            this.errorMessage.parentNode.insertBefore(successElement, this.errorMessage);
        }
        
        successElement.querySelector('.success-text').textContent = message;
        successElement.style.display = 'flex';
        
        // Auto-hide após 3 segundos
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }

    /**
     * Escapa HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Utilitários para melhorar a experiência
class VoiceToLibrasUtils {
    /**
     * Detecta se está em dispositivo móvel
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Detecta se está em modo escuro
     */
    static isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Formata texto para melhor exibição
     */
    static formatText(text) {
        return text
            .replace(/\s+/g, ' ') // Remove espaços extras
            .replace(/^\s+|\s+$/g, '') // Remove espaços no início e fim
            .replace(/([.!?])\s*([a-z])/g, '$1 $2'); // Garante espaço após pontuação
    }

    /**
     * Detecta comandos de voz especiais
     */
    static detectVoiceCommands(text) {
        const commands = {
            clear: ['limpar', 'apagar', 'deletar', 'clear'],
            send: ['enviar', 'traduzir', 'libras', 'send'],
            stop: ['parar', 'pare', 'stop']
        };

        const lowerText = text.toLowerCase();
        
        for (const [command, keywords] of Object.entries(commands)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return command;
            }
        }
        
        return null;
    }
}

// Inicialização da aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando aplicação Voz para Libras...');
    
    // Verifica se todos os elementos necessários estão presentes
    const requiredElements = [
        'recordButton',
        'recordingStatus', 
        'transcriptionResult',
        'languageSelect',
        'clearText',
        'sendToVlibras',
        'errorMessage'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('Elementos obrigatórios não encontrados:', missingElements);
        return;
    }
    
    // Inicializa a aplicação
    window.voiceToLibrasApp = new VoiceToLibrasApp();
    
    console.log('Aplicação inicializada com sucesso!');
});

// Verifica se o VLibras foi carregado
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!window.VLibras) {
            console.warn('VLibras não foi carregado corretamente');
            const errorMsg = document.getElementById('errorMessage');
            if (errorMsg) {
                errorMsg.querySelector('.error-text').textContent = 
                    'VLibras não foi carregado. Algumas funcionalidades podem não funcionar.';
                errorMsg.style.display = 'flex';
            }
        } else {
            console.log('VLibras carregado com sucesso');
        }
    }, 2000);
});

// Service Worker para funcionalidade offline (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration.scope);
            })
            .catch(error => {
                console.log('Falha ao registrar Service Worker:', error);
            });
    });
}

// Exporta para uso global se necessário
window.VoiceToLibrasApp = VoiceToLibrasApp;
window.VoiceToLibrasUtils = VoiceToLibrasUtils;