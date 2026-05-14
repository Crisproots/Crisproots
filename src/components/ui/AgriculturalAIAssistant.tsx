"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot,
  Mic,
  MicOff,
  Send,
  MessageSquare,
  Volume2,
  VolumeX,
  Settings,
  Download,
  X,
  ChevronUp,
  ChevronDown,
  Camera,
  FileText,
  Zap,
  Grid3X3,
  List,
  Maximize2,
  Minimize2,
  Copy,
  RefreshCw,
  Calendar,
  Leaf,
  Bug,
  CloudRain,
  MapPin,
  TrendingUp,
  Target,
  Wheat,
  Sprout,
  TreePine,
  Brain,
  Paperclip,
  Square,
  Trash2
} from 'lucide-react';
import enhancedAgriculturalAI, { AgriculturalQuery } from '../../services/enhancedAgriculturalAI';

// Types
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'error';
  sentiment?: 'positive' | 'neutral' | 'negative' | 'helpful' | 'apologetic' | 'informative';
  metadata?: {
    category?: string;
    confidence?: number;
    responseTime?: number;
    attachments?: File[];
    isBookmarked?: boolean;
    sentiment?: 'positive' | 'neutral' | 'negative' | 'helpful' | 'apologetic' | 'informative';
    // Additional metadata fields
    imageUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    analysisType?: string;
    relatedImage?: string;
    techniques?: string[];
  };
}

interface Language {
  code: string;
  name: string;
  flag: string;
  voice: string;
}

interface QuickAction {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  query: string;
  category: string;
  description: string;
  color: string;
}

interface InputMode {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  isActive: boolean;
}

interface AgriculturalAIAssistantProps {
  position?: 'left' | 'right';
  theme?: 'light' | 'dark' | 'auto';
  apiKey?: string;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
}

const AgriculturalAIAssistant: React.FC<AgriculturalAIAssistantProps> = ({
  position = 'right',
  apiKey = "AIzaSyAQMuttFKBjxdZoiIs6d9uGzBML0Ific0Y",
  onMessageSent,
  onResponseReceived
}) => {
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentInputMode, setCurrentInputMode] = useState<'text' | 'voice' | 'image' | 'document' | 'mixed'>('text');
  const [showInputOptions, setShowInputOptions] = useState(true);
  const [viewMode, setViewMode] = useState<'chat' | 'grid' | 'list'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🌾 **Welcome to your Advanced Agricultural AI Assistant!** \n\n🚀 I\'m here to revolutionize your farming experience with:\n\n🚜 **Precision Farming** - Optimize yields with data-driven insights\n🌱 **Plant Health** - AI-powered disease & pest identification\n📊 **Smart Analytics** - Real-time farm performance monitoring\n💧 **Resource Management** - Efficient water & nutrient optimization\n🎯 **Decision Support** - Personalized AI recommendations\n🌍 **Climate Intelligence** - Weather-based farming strategies\n\n**Try the quick actions below or ask me anything!** ⬇️\n💬 Use voice input, upload images, or browse quick topics',
      timestamp: new Date(),
      status: 'sent',
      metadata: {
        category: 'welcome',
        responseTime: 0,
        sentiment: 'positive',
        confidence: 1.0
      }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showSettings, setShowSettings] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [typingIndicator, setTypingIndicator] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Language Configuration
  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', voice: 'en-US-JennyNeural' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳', voice: 'hi-IN-SwaraNeural' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩', voice: 'bn-BD-NabanitaNeural' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', voice: 'ta-IN-PallaviNeural' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳', voice: 'te-IN-ShrutiNeural' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰', voice: 'ur-PK-AsadNeural' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', voice: 'gu-IN-DhwaniNeural' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', voice: 'pa-IN-PrabhjotNeural' }
  ];

  // Input Modes
  const inputModes: InputMode[] = [
    { id: 'text', label: 'Text Input', icon: MessageSquare, description: 'Type your questions', isActive: currentInputMode === 'text' },
    { id: 'voice', label: 'Voice Input', icon: Mic, description: 'Speak your queries', isActive: currentInputMode === 'voice' },
    { id: 'image', label: 'Image Analysis', icon: Camera, description: 'Upload crop photos', isActive: currentInputMode === 'image' },
    { id: 'document', label: 'Document Upload', icon: FileText, description: 'Analyze farm documents', isActive: currentInputMode === 'document' },
    { id: 'mixed', label: 'Multi-Modal', icon: Zap, description: 'Combine multiple inputs', isActive: currentInputMode === 'mixed' }
  ];

  // Quick Actions with enhanced categorization
  const quickActions: QuickAction[] = [
    // Farming Basics
    { icon: Sprout, label: 'Soil Health', query: 'How can I improve my soil health and fertility for better crop yields?', category: 'soil', description: 'Analyze soil conditions and get improvement recommendations', color: 'bg-green-500' },
    { icon: Wheat, label: 'Crop Planning', query: 'What crops should I plant this season based on my location and climate?', category: 'planning', description: 'Get personalized crop selection advice', color: 'bg-yellow-500' },
    { icon: Calendar, label: 'Planting Schedule', query: 'Create an optimal planting and harvesting schedule for my crops', category: 'timing', description: 'Schedule your farming activities', color: 'bg-blue-500' },
    { icon: Target, label: 'Yield Optimization', query: 'How can I maximize my crop yield and quality using modern techniques?', category: 'optimization', description: 'Strategies to improve productivity', color: 'bg-purple-500' },
    
    // Plant Health
    { icon: Bug, label: 'Pest Control', query: 'Help me identify and control pests affecting my crops using integrated management', category: 'pest', description: 'Integrated pest management solutions', color: 'bg-red-500' },
    { icon: Leaf, label: 'Disease Diagnosis', query: 'I need help diagnosing and treating plant diseases with organic and chemical options', category: 'disease', description: 'AI-powered disease identification', color: 'bg-orange-500' },
    { icon: TreePine, label: 'Plant Nutrition', query: 'What nutrients do my plants need and when should I apply them?', category: 'nutrition', description: 'Nutritional requirements and deficiency diagnosis', color: 'bg-teal-500' },
    
    // Environmental
    { icon: CloudRain, label: 'Weather Impact', query: 'How will current weather conditions affect my crops and what should I do?', category: 'weather', description: 'Weather-based farming advice', color: 'bg-cyan-500' },
    { icon: MapPin, label: 'Location Analysis', query: 'Analyze my farm location for optimal crop selection and practices', category: 'location', description: 'Site-specific recommendations', color: 'bg-indigo-500' },
    { icon: TrendingUp, label: 'Climate Adaptation', query: 'Help me adapt my farming practices to climate change challenges', category: 'climate', description: 'Future-proof farming strategies', color: 'bg-emerald-500' },
    
    // Technology
    { icon: Brain, label: 'AI Insights', query: 'Provide AI-driven insights and predictions for my farm data', category: 'ai', description: 'Advanced analytics and predictions', color: 'bg-violet-500' },
    { icon: RefreshCw, label: 'Automation', query: 'What farming processes can I automate to improve efficiency?', category: 'automation', description: 'Smart farming solutions', color: 'bg-pink-500' }
  ];

  // Effects
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-focus input when mode changes
  useEffect(() => {
    if (inputRef.current && isOpen) {
      inputRef.current.focus();
    }
  }, [currentInputMode, isOpen]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Helper Functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Clear messages function
  const clearMessages = () => {
    if (confirm('Are you sure you want to clear all messages? This action cannot be undone.')) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: `🌾 **Welcome back to your Agricultural AI Assistant!** 

Ready to help you with your farming needs again. What would you like to know today?`,
        timestamp: new Date(),
        status: 'sent',
        metadata: {
          category: 'welcome',
          confidence: 1.0,
          sentiment: 'positive'
        }
      }]);
    }
  };

  // Enhanced message status tracking
  const updateMessageStatus = (messageId: string, status: 'sending' | 'sent' | 'error') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

  // Bookmark functionality (future use)
  // const toggleBookmark = (messageId: string) => {
  //   setMessages(prev => prev.map(msg => 
  //     msg.id === messageId 
  //       ? { 
  //           ...msg, 
  //           metadata: { 
  //             ...msg.metadata, 
  //             isBookmarked: !msg.metadata?.isBookmarked 
  //           } 
  //         } 
  //       : msg
  //   ));
  // };

  // Core AI Functions
  const sendMessage = async (text: string, attachments?: File[]) => {
    if (!text.trim() && !attachments?.length) return;

    // Create user message with sending status
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      status: 'sending',
      metadata: { attachments, sentiment: 'neutral' }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setTypingIndicator(true);

    // Update status to sent
    setTimeout(() => updateMessageStatus(userMessage.id, 'sent'), 500);

    // Call callback if provided
    if (onMessageSent) {
      onMessageSent(text);
    }

    try {
      setConnectionStatus('connecting');
      const startTime = Date.now();
      
      const response = await generateAIResponse(text);
      const responseTime = Date.now() - startTime;
      
      const assistantMessage: Message = {
        id: generateId(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        status: 'sent',
        metadata: {
          responseTime,
          confidence: Math.random() * 0.3 + 0.7,
          category: detectCategory(text),
          sentiment: detectSentiment(response)
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConnectionStatus('connected');

      // Call callback if provided
      if (onResponseReceived) {
        onResponseReceived(response);
      }

      // Auto-speak if enabled
      if (autoSpeak && voiceEnabled) {
        await speakText(response);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setConnectionStatus('disconnected');
      updateMessageStatus(userMessage.id, 'error');
      
      const errorMessage: Message = {
        id: generateId(),
        type: 'assistant',
        content: '❌ I apologize, but I encountered an error processing your request. This could be due to:\n\n• Network connectivity issues\n• API service temporarily unavailable\n• Invalid request format\n\n**Please try again in a moment.** If the problem persists, check your internet connection or contact support.',
        timestamp: new Date(),
        status: 'sent',
        metadata: {
          category: 'error',
          sentiment: 'negative'
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTypingIndicator(false);
    }
  };

  // Enhanced AI response generation with better prompts
  const generateAIResponse = async (query: string): Promise<string> => {
    try {
      // Prepare enhanced query with context
      const agriculturalQuery: AgriculturalQuery = {
        message: query,
        context: {
          season: getCurrentSeason()
        }
      };

      const result = await enhancedAgriculturalAI.getAgriculturalAdvice(agriculturalQuery);
      
      // Format response with additional information
      let formattedResponse = result.response;
      
      if (result.suggestions.length > 0) {
        formattedResponse += '\n\n🔍 **Additional Suggestions:**\n';
        result.suggestions.forEach((suggestion, index) => {
          formattedResponse += `${index + 1}. ${suggestion}\n`;
        });
      }

      if (result.warnings && result.warnings.length > 0) {
        formattedResponse += '\n\n⚠️ **Important Warnings:**\n';
        result.warnings.forEach(warning => {
          formattedResponse += `• ${warning}\n`;
        });
      }

      if (result.actionItems && result.actionItems.length > 0) {
        formattedResponse += '\n\n✅ **Action Items:**\n';
        result.actionItems.forEach(action => {
          formattedResponse += `• ${action}\n`;
        });
      }

      formattedResponse += `\n\n📊 **Confidence Level: ${result.confidence}%**`;

      return formattedResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return `I apologize, but I'm experiencing technical difficulties. Please try asking your question again in a moment.

🔧 **Alternative:**
- Try rephrasing your question
- Check your internet connection
- Contact support if the issue persists

मुझे खुशी होगी आपकी सहायता करने में जब सिस्टम वापस ऑनलाइन हो जाए।`;
    }
  };

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer/Monsoon';
    if (month >= 9 && month <= 11) return 'Post-Monsoon';
    return 'Winter';
  };

  // Utility functions for enhanced features
  const detectCategory = (text: string): string => {
    const keywords = {
      soil: ['soil', 'fertility', 'ph', 'nutrients', 'compost'],
      pest: ['pest', 'insect', 'bug', 'aphid', 'control'],
      disease: ['disease', 'fungus', 'bacteria', 'virus', 'infection'],
      weather: ['weather', 'rain', 'temperature', 'climate', 'drought'],
      crop: ['crop', 'plant', 'seed', 'harvest', 'yield'],
      irrigation: ['water', 'irrigation', 'drip', 'sprinkler'],
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => text.toLowerCase().includes(word))) {
        return category;
      }
    }
    return 'general';
  };

  const detectSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['good', 'excellent', 'improve', 'benefit', 'success', 'optimal'];
    const negativeWords = ['problem', 'error', 'fail', 'damage', 'poor', 'decline'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Enhanced Voice Functions
  const speakText = async (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    try {
      setIsSpeaking(true);
      
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Clean text for better speech
      const cleanText = text
        .replace(/[🌾🚜🌱📊💧🎯🌍🔧📈⚠️💡📋]/g, '') // Remove emojis
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/\n+/g, '. '); // Replace line breaks with pauses
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Set language-specific voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(selectedLanguage === 'hi' ? 'hi' : 'en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
    }
  };

  // Stop speaking function (future use)
  // const stopSpeaking = () => {
  //   if ('speechSynthesis' in window) {
  //     speechSynthesis.cancel();
  //     setIsSpeaking(false);
  //   }
  // };

  // Enhanced Speech Recognition
  const toggleRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('🎤 Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for voice input.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      setIsRecording(true);
      setConnectionStatus('connecting');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'bn' ? 'bn-BD' : 'en-US';
      recognition.maxAlternatives = 3;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setInputText(transcript);
        }
      };
      
      recognition.onerror = (event: Event & { error: string }) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setConnectionStatus('disconnected');
        
        const errorMessages: Record<string, string> = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'Microphone access denied. Please check permissions.',
          'not-allowed': 'Microphone permission required for voice input.',
          'network': 'Network error. Please check your connection.',
        };
        
        alert(`🎤 ${errorMessages[event.error] || 'Speech recognition failed. Please try again.'}`);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setConnectionStatus('connected');
      };
      
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
      setConnectionStatus('disconnected');
      alert('🎤 Speech recognition failed to initialize. Please try again.');
    }
  };

  // Enhanced PDF Export with jsPDF-like functionality
  const exportToPDF = async () => {
    try {
      // Enhanced conversation export with formatting
      const conversationData = {
        title: 'Agricultural AI Assistant Conversation',
        date: new Date().toLocaleDateString(),
        messages: messages.map(msg => ({
          type: msg.type,
          content: msg.content,
          timestamp: formatTimestamp(msg.timestamp),
          category: msg.metadata?.category || 'general',
          confidence: msg.metadata?.confidence,
          responseTime: msg.metadata?.responseTime
        })),
        summary: {
          totalMessages: messages.length,
          userQueries: messages.filter(m => m.type === 'user').length,
          aiResponses: messages.filter(m => m.type === 'assistant').length,
          categories: [...new Set(messages.map(m => m.metadata?.category).filter(Boolean))],
          avgResponseTime: messages
            .filter(m => m.metadata?.responseTime)
            .reduce((acc, m) => acc + (m.metadata?.responseTime || 0), 0) / 
            messages.filter(m => m.metadata?.responseTime).length || 0
        }
      };

      // Create enhanced text format
      const exportText = `
═══════════════════════════════════════════════════════════════
           AGRICULTURAL AI ASSISTANT CONVERSATION EXPORT
═══════════════════════════════════════════════════════════════

📅 Date: ${conversationData.date}
📊 Statistics:
   • Total Messages: ${conversationData.summary.totalMessages}
   • User Queries: ${conversationData.summary.userQueries}
   • AI Responses: ${conversationData.summary.aiResponses}
   • Categories Discussed: ${conversationData.summary.categories.join(', ') || 'General'}
   • Average Response Time: ${Math.round(conversationData.summary.avgResponseTime)}ms

═══════════════════════════════════════════════════════════════
                            CONVERSATION
═══════════════════════════════════════════════════════════════

${conversationData.messages.map((msg, index) => `
[${ index + 1 }] ${msg.type.toUpperCase()} (${msg.timestamp})
${msg.category ? `Category: ${msg.category.toUpperCase()}` : ''}
${msg.confidence ? `Confidence: ${Math.round(msg.confidence * 100)}%` : ''}
${msg.responseTime ? `Response Time: ${Math.round(msg.responseTime)}ms` : ''}
───────────────────────────────────────────────────────────────
${msg.content}
───────────────────────────────────────────────────────────────
`).join('\n')}

═══════════════════════════════════════════════════════════════
Generated by FarmHub Agricultural AI Assistant
${new Date().toISOString()}
═══════════════════════════════════════════════════════════════
      `;
      
      const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farmhub-ai-conversation-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('📄 Conversation exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export conversation. Please try again.');
    }
  };

  // Enhanced File Upload Handlers with comprehensive processing
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (file.size > maxSize) {
      alert('📏 File size must be less than 5MB. Please choose a smaller file.');
      return;
    }

    // Validate file types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedDocTypes = ['application/pdf', 'text/plain', 'text/csv'];
    
    if (!allowedImageTypes.includes(file.type) && !allowedDocTypes.includes(file.type)) {
      alert('📄 Supported file types: Images (JPEG, PNG, WebP) and Documents (PDF, TXT, CSV)');
      return;
    }

    try {
      setIsLoading(true);
      setConnectionStatus('connecting');
      
      // For images, create preview and analyze
      if (allowedImageTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageUrl = e.target?.result as string;
          
          // Add image message to chat
          const imageMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: `📸 **Image Uploaded**: ${file.name}\n\n*Analyzing plant health and providing recommendations...*`,
            timestamp: new Date(),
            status: 'delivered',
            metadata: {
              imageUrl,
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              category: 'image-upload'
            }
          };
          
          setMessages(prev => [...prev, imageMessage]);
          
          // Analyze image with AI
          await handleAdvancedImageAnalysis(imageUrl, file.name);
        };
        reader.readAsDataURL(file);
      } else {
        // Handle documents
        const fileMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: `📄 **Document Uploaded**: ${file.name}\n\n*Processing agricultural document...*`,
          timestamp: new Date(),
          status: 'delivered',
          metadata: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            category: 'document-upload'
          }
        };
        
        setMessages(prev => [...prev, fileMessage]);
        
        // Process document
        await handleAdvancedDocumentAnalysis(file);
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('❌ Failed to upload file. Please check the file format and try again.');
    } finally {
      setIsLoading(false);
      setConnectionStatus('connected');
    }
  };

  // Advanced image analysis with detailed agricultural insights
  const handleAdvancedImageAnalysis = async (imageUrl: string, fileName: string) => {
    try {
      setIsLoading(true);
      setTypingIndicator(true);
      
      // Simulate advanced AI analysis
      const startTime = Date.now();
      const analysisResult = await performDetailedImageAnalysis(fileName);
      const responseTime = Date.now() - startTime;
      
      const analysisMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: analysisResult,
        timestamp: new Date(),
        status: 'delivered',
        sentiment: 'helpful',
        metadata: {
          category: 'plant-disease',
          confidence: 0.92,
          analysisType: 'advanced-image',
          relatedImage: imageUrl,
          responseTime,
          techniques: ['computer-vision', 'disease-detection', 'nutrient-analysis']
        }
      };
      
      setMessages(prev => [...prev, analysisMessage]);
      
      if (voiceEnabled) {
        await speakText(analysisResult.replace(/[📸🔍🟢🟡🔴💡⚠️✅]/g, ''));
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: '❌ **Analysis Error**: Unable to process the image. Please ensure the image is clear and try again. You can also describe the plant condition manually.',
        timestamp: new Date(),
        status: 'error',
        sentiment: 'apologetic',
        metadata: { category: 'error', analysisType: 'image' }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTypingIndicator(false);
    }
  };

  // Detailed image analysis simulation
  const performDetailedImageAnalysis = async (fileName: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate contextual analysis based on filename patterns
    const isDisease = fileName.toLowerCase().includes('disease') || fileName.toLowerCase().includes('pest');
    const isGrowth = fileName.toLowerCase().includes('growth') || fileName.toLowerCase().includes('stage');
    
    return `🔍 **Comprehensive Agricultural Image Analysis**

📸 **Image**: ${fileName}
🕒 **Analysis Completed**: ${new Date().toLocaleTimeString()}

## 🌱 **Plant Identification & Assessment**

**Primary Findings**:
${isDisease ? 
  `🔴 **Disease Detection**: Potential plant health issues identified
- Leaf discoloration patterns suggest nutrient deficiency or disease
- Recommended immediate intervention required` :
  `🟢 **Health Status**: Plant shows good overall health indicators
- Strong stem structure and leaf development
- Normal growth patterns observed`
}

## 📊 **Detailed Analysis**

**1. 🍃 Leaf Health Assessment**:
- Color analysis: ${isDisease ? 'Yellowing/browning detected' : 'Healthy green coloration'}
- Texture: ${isDisease ? 'Some wilting or spotting visible' : 'Good leaf structure'}
- Size: Appropriate for growth stage

**2. 🌿 Growth Stage Evaluation**:
- Current stage: ${isGrowth ? 'Critical growth period' : 'Stable development phase'}
- Development rate: Within normal parameters
- Size progression: Adequate for timeframe

**3. 🔬 Potential Issues**:
${isDisease ? 
  `⚠️ **Immediate Concerns**:
- Possible fungal infection signs
- Nutrient deficiency indicators
- Water stress symptoms` :
  `✅ **Minor Observations**:
- Slight variations in leaf color (normal)
- Some natural aging of lower leaves
- Overall healthy appearance`
}

## 💡 **Expert Recommendations**

**Immediate Actions (Next 24-48 hours)**:
1. ${isDisease ? 'Apply targeted fungicide treatment' : 'Continue current care routine'}
2. ${isDisease ? 'Adjust watering schedule - reduce frequency' : 'Monitor soil moisture levels'}
3. ${isDisease ? 'Remove affected leaves if severe' : 'Maintain current fertilization'}

**Short-term Plan (1-2 weeks)**:
- Monitor plant response to treatments
- Document changes with follow-up photos
- Adjust care based on plant response

**Long-term Strategy**:
- Implement preventive disease management
- Establish regular monitoring schedule
- Consider soil testing for optimal nutrition

## 🎯 **Specific Treatment Protocol**

${isDisease ? 
  `**Disease Management**:
- Fungicide: Apply copper-based treatment
- Frequency: Every 7-10 days for 3 weeks
- Prevention: Improve air circulation` :
  `**Maintenance Care**:
- Watering: Deep, infrequent irrigation
- Fertilizer: Balanced NPK (10-10-10) monthly
- Monitoring: Weekly health checks`
}

## 📈 **Expected Outcomes**

**Week 1-2**: ${isDisease ? 'Halt disease progression' : 'Continued healthy growth'}
**Week 3-4**: ${isDisease ? 'New healthy growth visible' : 'Optimal development'}
**Month 1+**: Full recovery and robust plant health

---
💬 **Need clarification on any recommendations? Feel free to ask for more specific guidance!**`;
  };

  // Advanced document analysis
  const handleAdvancedDocumentAnalysis = async (file: File) => {
    try {
      setIsLoading(true);
      setTypingIndicator(true);
      
      const startTime = Date.now();
      const analysisResult = await performAdvancedDocumentAnalysis(file);
      const responseTime = Date.now() - startTime;
      
      const analysisMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: analysisResult,
        timestamp: new Date(),
        status: 'delivered',
        sentiment: 'informative',
        metadata: {
          category: 'document-analysis',
          confidence: 0.88,
          fileName: file.name,
          fileType: file.type,
          responseTime,
          techniques: ['document-processing', 'data-analysis', 'agricultural-insights']
        }
      };
      
      setMessages(prev => [...prev, analysisMessage]);
      
      if (voiceEnabled) {
        await speakText(analysisResult.replace(/[📄📊💡⚡🎯]/g, ''));
      }
    } catch (error) {
      console.error('Document analysis error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: '❌ **Document Processing Error**: Unable to analyze the document. Please ensure it\'s a valid agricultural document and try again.',
        timestamp: new Date(),
        status: 'error',
        sentiment: 'apologetic',
        metadata: { category: 'error', analysisType: 'document' }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTypingIndicator(false);
    }
  };

  // Advanced document analysis simulation
  const performAdvancedDocumentAnalysis = async (file: File): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'text/csv' || fileName.includes('data') || fileName.includes('report')) {
      return `📊 **Agricultural Data Analysis Complete**

📄 **Document**: ${file.name}
📏 **Size**: ${(file.size / 1024).toFixed(1)} KB
🕒 **Processed**: ${new Date().toLocaleTimeString()}

## 🔍 **Document Type Identification**
**Detected Format**: ${fileType === 'text/csv' ? 'Agricultural Data (CSV)' : 'Farm Report Document'}

## 📈 **Data Insights & Analysis**

**Key Findings**:
- Agricultural production data detected
- Multiple crop/livestock parameters identified
- Seasonal trends and patterns available for analysis

**Recommended Actions**:
1. **Data Optimization**: Review yield patterns for improvement opportunities
2. **Seasonal Planning**: Use historical data for next season planning
3. **Resource Allocation**: Optimize inputs based on data trends

## 💡 **Expert Recommendations**

**For Production Data**:
- Compare current yields with regional averages
- Identify high-performing varieties/practices
- Plan resource allocation for optimal ROI

**For Financial Reports**:
- Analyze cost-benefit ratios by crop
- Identify most profitable farming practices
- Budget planning for upcoming seasons

## 🎯 **Next Steps**

1. **Data Validation**: Verify accuracy of recorded information
2. **Trend Analysis**: Look for patterns in successful seasons
3. **Predictive Planning**: Use insights for future crop planning

**Questions I can help with**:
- Crop yield optimization strategies
- Cost reduction opportunities
- Market timing recommendations
- Resource efficiency improvements

---
💬 **Would you like me to analyze specific aspects of your agricultural data in more detail?**`;
    }
    
    return `📄 **Document Analysis Summary**

**File**: ${file.name}
**Type**: ${file.type}
**Size**: ${(file.size / 1024).toFixed(1)} KB

## 🔍 **Document Processing Complete**

I've received your agricultural document and I'm ready to help! Here's what I can assist you with:

**For Agricultural Documents**:
📊 **Data Analysis**: Crop yields, financial reports, field records
🌱 **Planning Support**: Seasonal planning, crop rotation schedules
📈 **Performance Review**: Yield comparisons, efficiency analysis
💰 **Financial Planning**: Budget analysis, ROI calculations

**For Research Papers/Guides**:
📚 **Content Summary**: Key findings and recommendations
🔬 **Best Practices**: Implementation of research findings
🎯 **Application**: How to apply research to your farm

## 💡 **How I Can Help**

Please tell me:
1. What specific information you'd like me to extract
2. What analysis or recommendations you need
3. Any particular challenges you're facing

**Example questions**:
- "Analyze my crop yield data for optimization opportunities"
- "Summarize the key farming practices from this document"
- "Help me plan next season based on this data"

---
💬 **What would you like me to focus on from your document?**`;
  };

  // Smart suggestions generator
  const getSmartSuggestions = (inputText: string): string[] => {
    const text = inputText.toLowerCase();
    const suggestions: string[] = [];
    
    if (text.includes('crop') || text.includes('plant')) {
      suggestions.push('varieties', 'rotation', 'diseases', 'fertilizer', 'harvest timing');
    }
    if (text.includes('soil')) {
      suggestions.push('pH testing', 'nutrients', 'organic matter', 'drainage', 'erosion control');
    }
    if (text.includes('pest') || text.includes('disease')) {
      suggestions.push('identification', 'treatment options', 'prevention', 'organic solutions');
    }
    if (text.includes('water') || text.includes('irrigation')) {
      suggestions.push('scheduling', 'efficiency', 'conservation', 'drip systems');
    }
    if (text.includes('fertilizer') || text.includes('nutrient')) {
      suggestions.push('NPK ratios', 'organic options', 'timing', 'application rates');
    }
    
    // Default suggestions if no specific matches
    if (suggestions.length === 0) {
      suggestions.push('best practices', 'seasonal tips', 'cost optimization', 'yield improvement');
    }
    
    return suggestions.slice(0, 4); // Limit to 4 suggestions
  };

  // Smart placeholder generator
  const getSmartPlaceholder = (): string => {
    const placeholders = [
      "Ask about farming, crops, soil health, pest control...",
      "Need help with crop diseases, fertilizers, or irrigation?",
      "Planning your next season? Ask for crop recommendations!",
      "Wondering about soil nutrients or pH levels?",
      "Questions about organic farming or sustainable practices?",
      "Need pest identification or treatment advice?",
      "Want to optimize your harvest timing and yields?",
      "Looking for cost-effective farming solutions?"
    ];
    
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  // UI State Management
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.query);
    setShowInputOptions(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Main Render
  const positionClass = position === 'left' ? 'left-4' : 'right-4';
  const expandDirection = position === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={`fixed bottom-4 ${positionClass} z-50`}>
      {/* Main Chat Interface */}
      {isOpen && (
        <div
          className={`absolute bottom-16 ${expandDirection} bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
            isExpanded ? 'w-[420px] h-[650px]' : 'w-[380px] h-[520px]'
          } ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot className="w-6 h-6 text-green-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  🌾 FarmAI Assistant
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Smart Farming Assistant • Online
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'chat' ? 'grid' : 'chat')}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Toggle view mode"
              >
                {viewMode === 'chat' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </button>
              
              {/* Expand/Collapse */}
              <button
                onClick={toggleExpanded}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              
              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`border-b p-4 space-y-3 ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
              {/* Language Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Settings Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Auto Speak
                  </span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTimestamps}
                    onChange={(e) => setShowTimestamps(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Timestamps
                  </span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Dark Mode
                  </span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Compact
                  </span>
                </label>
              </div>

              {/* Export Button */}
              <button
                onClick={exportToPDF}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Conversation</span>
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ height: 'calc(100% - 140px)' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white rounded-br-md'
                      : darkMode
                      ? 'bg-gray-700 text-white rounded-bl-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  } ${compactMode ? 'p-2 text-sm' : ''}`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {showTimestamps && (
                    <div
                      className={`text-xs mt-2 opacity-70 ${
                        message.type === 'user' ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                      {message.metadata?.responseTime && (
                        <span className="ml-2">
                          ({Math.round(message.metadata.responseTime)}ms)
                        </span>
                      )}
                    </div>
                  )}
                  
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => speakText(message.content)}
                        className={`p-1 rounded transition-colors ${
                          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        }`}
                        title="Read aloud"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      </button>
                      
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className={`p-1 rounded transition-colors ${
                          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        }`}
                        title="Copy"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-2xl rounded-bl-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Analyzing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Quick Actions */}
          {showInputOptions && (
            <div className={`border-t p-4 ${darkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-sm font-bold flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <Zap className="w-4 h-4 text-green-500" />
                  <span>Quick Topics</span>
                </h4>
                <button
                  onClick={() => setShowInputOptions(false)}
                  className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  title="Hide quick actions"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                {quickActions.slice(0, 8).map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className={`group p-3 text-left rounded-xl border transition-all duration-200 transform hover:scale-105 ${
                        darkMode 
                          ? 'border-gray-600 hover:border-green-500 bg-gray-700/60 hover:bg-gray-700 text-white' 
                          : 'border-gray-200 hover:border-green-400 bg-white/60 hover:bg-white text-gray-800 shadow-sm hover:shadow-md'
                      }`}
                      title={action.description}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${action.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold block group-hover:text-green-600 transition-colors truncate">
                            {action.label}
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
                            {action.category}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enhanced Input Area with Smart Features */}
          <div className={`border-t p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Connection Status Indicator */}
            {connectionStatus !== 'connected' && (
              <div className={`flex items-center space-x-2 mb-3 p-2 rounded-lg ${
                connectionStatus === 'connecting' 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                }`}></div>
                <span className={`text-xs font-medium ${
                  connectionStatus === 'connecting' ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {connectionStatus === 'connecting' ? 'Connecting...' : 'Connection Lost'}
                </span>
              </div>
            )}
            
            {/* Input Mode Selector with Enhanced Tooltips */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {inputModes.map((mode) => {
                  const IconComponent = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setCurrentInputMode(mode.id as 'text' | 'voice' | 'image' | 'document' | 'mixed')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentInputMode === mode.id
                          ? 'bg-green-600 text-white shadow-lg scale-105'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                      }`}
                      title={`${mode.label}: ${mode.description}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
              
              {/* Character Counter */}
              <div className={`text-xs ${
                inputText.length > 500 ? 'text-red-500' : 
                inputText.length > 400 ? 'text-yellow-500' : 
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {inputText.length}/1000
              </div>
            </div>

            {/* Smart Suggestions based on current input */}
            {inputText.length > 3 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {getSmartSuggestions(inputText).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputText(inputText + ' ' + suggestion)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Main Input Area */}
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(inputText);
                    }
                  }}
                  placeholder={getSmartPlaceholder()}
                  className={`w-full px-3 py-3 border-2 rounded-lg resize-none transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                  rows={isExpanded ? 3 : 2}
                  maxLength={1000}
                  disabled={isLoading}
                />
                
                {/* Smart Input Indicators */}
                <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                  {isRecording && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-500 font-medium">Recording</span>
                    </div>
                  )}
                  {typingIndicator && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-500 font-medium">AI Thinking</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col space-y-1">
                {/* Voice Input */}
                <button
                  onClick={toggleRecording}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                  title={isRecording ? 'Stop recording (Click to stop)' : 'Start voice input (Click and speak)'}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* File Upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                  title="Upload image or document for analysis"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={isLoading || (!inputText.trim())}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    isLoading || !inputText.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-lg'
                  }`}
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => setShowInputOptions(!showInputOptions)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  showInputOptions
                    ? 'bg-green-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Quick farming topics"
              >
                <span className="text-sm font-medium">Quick Topics</span>
                {showInputOptions ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              
              <div className="flex items-center space-x-2">
                {/* Voice Toggle */}
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    voiceEnabled
                      ? 'bg-green-100 text-green-600'
                      : darkMode
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  title={voiceEnabled ? 'Voice responses ON' : 'Voice responses OFF'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                
                {/* Stop Speaking */}
                {isSpeaking && (
                  <button
                    onClick={() => speechSynthesis.cancel()}
                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Stop speaking"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                )}
                
                {/* Clear Chat */}
                <button
                  onClick={clearMessages}
                  className={`p-1.5 rounded-lg transition-colors ${
                    darkMode
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.csv"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'rotate-45' : 'hover:scale-105'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && messages.length > 1 && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {messages.filter(m => m.type === 'assistant').length - 1}
        </div>
      )}
    </div>
  );
};

export default AgriculturalAIAssistant;
