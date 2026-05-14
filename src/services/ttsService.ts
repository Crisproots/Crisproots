// Advanced TTS Service using Edge-TTS and Web Speech API
export class AdvancedTTSService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  
  // TTS Configuration
  private config = {
    rate: 1.2,      // 20% faster than normal
    volume: 0.9,    // 90% volume
    pitch: 0,       // Default pitch
    voice: 'en-US-JennyNeural'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.initialize();
    }
  }

  private async initialize() {
    if (!this.synth) return;

    // Wait for voices to load
    return new Promise<void>((resolve) => {
      const loadVoices = () => {
        this.voices = this.synth!.getVoices();
        this.isInitialized = true;
        resolve();
      };

      if (this.voices.length > 0) {
        loadVoices();
      } else if (this.synth) {
        this.synth.onvoiceschanged = loadVoices;
      }
    });
  }

  // Get available voices by language
  getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith(language) || 
      voice.lang.includes(language)
    );
  }

  // Get premium neural voices
  getNeuralVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.name.includes('Neural') || 
      voice.name.includes('Jenny') ||
      voice.name.includes('Microsoft') ||
      voice.name.includes('Google')
    );
  }

  // Speak text with advanced options
  async speak(
    text: string, 
    options: {
      language?: string;
      voice?: string;
      rate?: number;
      volume?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: string) => void;
    } = {}
  ): Promise<void> {
    if (!this.synth) {
      options.onError?.('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Wait for initialization
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set configuration
      utterance.rate = options.rate ?? this.config.rate;
      utterance.volume = options.volume ?? this.config.volume;
      utterance.pitch = options.pitch ?? this.config.pitch;

      // Set voice
      if (options.voice || options.language) {
        let selectedVoice: SpeechSynthesisVoice | undefined;
        
        if (options.voice) {
          selectedVoice = this.voices.find(voice => 
            voice.name.includes(options.voice!) ||
            voice.voiceURI.includes(options.voice!)
          );
        }
        
        if (!selectedVoice && options.language) {
          const languageVoices = this.getVoicesByLanguage(options.language);
          // Prefer neural voices
          selectedVoice = languageVoices.find(voice => 
            voice.name.includes('Neural') || voice.name.includes('Jenny')
          ) || languageVoices[0];
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        }
      }

      // Set event handlers
      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const error = `Speech synthesis error: ${event.error}`;
        options.onError?.(error);
        reject(new Error(error));
      };

      // Speak
      if (this.synth) {
        this.synth.speak(utterance);
      }
    });
  }

  // Stop current speech
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Pause speech
  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  // Resume speech
  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  // Check if speaking
  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }

  // Set global configuration
  setConfig(config: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...config };
  }

  // Get current configuration
  getConfig(): typeof this.config {
    return { ...this.config };
  }

  // Get voice information
  getVoiceInfo(): {
    available: number;
    neural: number;
    languages: string[];
    voices: { name: string; lang: string; neural: boolean }[];
  } {
    const neuralVoices = this.getNeuralVoices();
    const languages = [...new Set(this.voices.map(v => v.lang.split('-')[0]))];
    
    return {
      available: this.voices.length,
      neural: neuralVoices.length,
      languages,
      voices: this.voices.map(voice => ({
        name: voice.name,
        lang: voice.lang,
        neural: voice.name.includes('Neural') || voice.name.includes('Jenny')
      }))
    };
  }

  // Text preprocessing for better speech
  preprocessText(text: string): string {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      
      // Replace emojis with descriptions
      .replace(/🌾/g, 'crop')
      .replace(/🚜/g, 'tractor')
      .replace(/🐄/g, 'cow')
      .replace(/🌱/g, 'plant')
      .replace(/🌽/g, 'corn')
      .replace(/🍅/g, 'tomato')
      .replace(/💧/g, 'water')
      .replace(/☀️/g, 'sun')
      .replace(/🌧️/g, 'rain')
      
      // Add pauses for better speech flow
      .replace(/\./g, '. ')
      .replace(/,/g, ', ')
      .replace(/;/g, '; ')
      .replace(/:/g, ': ')
      
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Speak with automatic text preprocessing
  async speakProcessed(
    text: string,
    options: Parameters<typeof this.speak>[1] = {}
  ): Promise<void> {
    const processedText = this.preprocessText(text);
    return this.speak(processedText, options);
  }
}

// Language-specific TTS configurations
export const languageConfigs = {
  'en': {
    voice: 'en-US-JennyNeural',
    rate: 1.2,
    pitch: 0,
    alternatives: ['Microsoft Zira', 'Google US English']
  },
  'hi': {
    voice: 'hi-IN-Swara',
    rate: 1.0,
    pitch: 0.1,
    alternatives: ['Microsoft Hemant', 'Google हिन्दी']
  },
  'bn': {
    voice: 'bn-IN-TanishaaNeural',
    rate: 1.0,
    pitch: 0,
    alternatives: ['Google বাংলা']
  },
  'ta': {
    voice: 'ta-IN-PallaviNeural',
    rate: 1.0,
    pitch: 0,
    alternatives: ['Google தமிழ்']
  },
  'te': {
    voice: 'te-IN-ShrutiNeural',
    rate: 1.0,
    pitch: 0,
    alternatives: ['Google తెలుగు']
  },
  'mr': {
    voice: 'mr-IN-AarohiNeural',
    rate: 1.0,
    pitch: 0,
    alternatives: ['Google मराठी']
  }
};

// Export singleton instance
export const ttsService = new AdvancedTTSService();
