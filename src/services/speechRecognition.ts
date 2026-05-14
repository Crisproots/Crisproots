// Advanced Speech Recognition Service
export class AdvancedSpeechRecognition {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListening = false;
  private isSupported = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeRecognition();
    }
  }

  private initializeRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
  }

  // Start listening with language support
  async startListening(options: {
    language?: string;
    onResult?: (text: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}): Promise<void> {
    if (!this.isSupported || !this.recognition) {
      options.onError?.('Speech recognition not supported');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    return new Promise((resolve, reject) => {
      // Set language
      this.recognition.lang = this.getLanguageCode(options.language || 'en');

      this.recognition.onstart = () => {
        this.isListening = true;
        options.onStart?.();
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          options.onResult?.(finalTranscript, true);
        } else if (interimTranscript) {
          options.onResult?.(interimTranscript, false);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onerror = (event: any) => {
        const error = `Speech recognition error: ${event.error}`;
        options.onError?.(error);
        this.isListening = false;
        reject(new Error(error));
      };

      this.recognition.onend = () => {
        this.isListening = false;
        options.onEnd?.();
        resolve();
      };

      // Start recognition
      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Check if currently listening
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Check if speech recognition is supported
  isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  // Get language code for speech recognition
  private getLanguageCode(language: string): string {
    const languageCodes: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'pa': 'pa-IN',
      'or': 'or-IN',
      'as': 'as-IN',
      'ml': 'ml-IN'
    };

    return languageCodes[language] || 'en-US';
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    return [
      'en', 'hi', 'bn', 'ta', 'te', 'mr', 
      'gu', 'kn', 'pa', 'or', 'as', 'ml'
    ];
  }

  // Single shot recognition (for quick commands)
  async recognizeOnce(options: {
    language?: string;
    timeout?: number;
  } = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const tempRecognition = new (this.recognition.constructor)();
      tempRecognition.lang = this.getLanguageCode(options.language || 'en');
      tempRecognition.continuous = false;
      tempRecognition.interimResults = false;

      const timeout = setTimeout(() => {
        tempRecognition.stop();
        reject(new Error('Recognition timeout'));
      }, options.timeout || 10000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tempRecognition.onresult = (event: any) => {
        clearTimeout(timeout);
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tempRecognition.onerror = (event: any) => {
        clearTimeout(timeout);
        reject(new Error(`Recognition error: ${event.error}`));
      };

      tempRecognition.start();
    });
  }
}

// Export singleton instance
export const speechRecognition = new AdvancedSpeechRecognition();
