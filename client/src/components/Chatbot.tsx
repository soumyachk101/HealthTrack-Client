import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
};

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            text: 'Hello! I am your AI Health Assistant. How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        // Preload voices
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Text to Speech Function with Premium Female Voice
    const speak = (text: string) => {
        if (!voiceEnabled) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Get all available voices
        const voices = window.speechSynthesis.getVoices();

        // Priority list of premium female voices (ordered by quality)
        const premiumVoiceNames = [
            'Google UK English Female',           // High quality Google voice
            'Microsoft Aria Online (Natural)',    // Natural sounding Windows 11 voice
            'Microsoft Jenny Online (Natural)',   // Another premium Windows voice  
            'Samantha',                           // MacOS premium voice
            'Karen',                              // Australian accent
            'Victoria',                           // UK accent
            'Microsoft Zira Desktop',             // Standard Windows female voice
            'Microsoft Zira',                     // Fallback Zira
            'Google US English Female',           // US Google voice
            'Fiona',                              // Scottish accent
            'Moira',                              // Irish accent
            'Tessa',                              // South African accent
            'Veena',                              // Indian accent
        ];

        // Find the best available voice from our priority list
        let selectedVoice = null;
        for (const voiceName of premiumVoiceNames) {
            const found = voices.find(v =>
                v.name.toLowerCase().includes(voiceName.toLowerCase()) ||
                v.name === voiceName
            );
            if (found) {
                selectedVoice = found;
                break;
            }
        }

        // Fallback: look for any voice with female-related keywords
        if (!selectedVoice) {
            selectedVoice = voices.find(voice =>
                voice.name.toLowerCase().includes('female') ||
                voice.name.toLowerCase().includes('woman') ||
                voice.name.toLowerCase().includes('girl')
            );
        }

        // Final fallback: any English voice that sounds feminine
        if (!selectedVoice) {
            selectedVoice = voices.find(voice =>
                voice.lang.startsWith('en') &&
                (voice.name.toLowerCase().includes('natural') ||
                    voice.name.toLowerCase().includes('premium'))
            );
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('Using voice:', selectedVoice.name);
        }

        // Optimized settings for attractive, warm female voice
        utterance.pitch = 1.12;      // Slightly higher pitch for feminine tone
        utterance.rate = 1.1;        // Faster, natural conversational speed
        utterance.volume = 0.95;     // Clear but not harsh

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/chatbot/api/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text }),
            });

            if (!response.ok) throw new Error('Server error');

            const data = await response.json();
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: data.response || "I didn't quite catch that.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
            speak(botMessage.text);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: "I'm having trouble connecting. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="pointer-events-auto mb-4 w-[360px] sm:w-[400px] h-[550px] flex flex-col shadow-2xl rounded-2xl bg-white overflow-hidden border border-slate-200"
                    >
                        {/* Clean Header */}
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-base">Health Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            isSpeaking ? "bg-yellow-300 animate-pulse" : "bg-emerald-300"
                                        )} />
                                        <span className="text-xs text-white/80">
                                            {isSpeaking ? "Speaking..." : "Online"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setVoiceEnabled(!voiceEnabled);
                                        if (voiceEnabled) window.speechSynthesis.cancel();
                                    }}
                                    className={cn(
                                        "p-2 rounded-full transition-all",
                                        voiceEnabled
                                            ? "bg-white/20 text-white"
                                            : "text-white/60 hover:text-white hover:bg-white/10"
                                    )}
                                    title={voiceEnabled ? "Voice On" : "Voice Off"}
                                >
                                    {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn("flex", msg.sender === 'user' ? "justify-end" : "justify-start")}
                                >
                                    <div className={cn(
                                        "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                                        msg.sender === 'user'
                                            ? "bg-teal-500 text-white rounded-br-md"
                                            : "bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm"
                                    )}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                        <p className={cn(
                                            "text-[10px] mt-1.5",
                                            msg.sender === 'user' ? "text-teal-100" : "text-slate-400"
                                        )}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-slate-200 shadow-sm">
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                                    className="w-2 h-2 bg-teal-400 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleListening}
                                    className={cn(
                                        "p-2.5 rounded-full transition-all",
                                        isListening
                                            ? "bg-red-500 text-white animate-pulse"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                    )}
                                >
                                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder={isListening ? "Listening..." : "Type your message..."}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 rounded-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-white border border-transparent focus:border-teal-300 transition-all"
                                />
                                <Button
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    onClick={handleSend}
                                    className={cn(
                                        "h-10 w-10 rounded-full transition-all",
                                        input.trim()
                                            ? "bg-teal-500 hover:bg-teal-600 text-white"
                                            : "bg-slate-100 text-slate-400"
                                    )}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-3">
                                AI responses are not medical advice
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "pointer-events-auto h-14 w-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
                    isOpen
                        ? "bg-slate-600 hover:bg-slate-700"
                        : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                )}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <MessageCircle className="h-6 w-6 text-white" />
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
