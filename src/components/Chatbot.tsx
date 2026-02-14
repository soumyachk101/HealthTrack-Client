import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
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
            text: 'Hello! I am your HealthTrack+ assistant. How can I help you today?',
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
        } catch {
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
                        className="pointer-events-auto mb-4 w-[360px] sm:w-[400px] h-[600px] flex flex-col shadow-2xl rounded-3xl bg-white overflow-hidden border border-slate-100 ring-1 ring-slate-900/5"
                    >
                        {/* Premium Header */}
                        <div className="bg-slate-900 px-6 py-5 flex items-center justify-between shrink-0 relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg tracking-tight">HealthTrack+</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            isSpeaking ? "bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                                        )} />
                                        <span className="text-xs text-slate-300 font-medium">
                                            {isSpeaking ? "Speaking..." : "AI Assistant Online"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 relative z-10">
                                <button
                                    onClick={() => {
                                        setVoiceEnabled(!voiceEnabled);
                                        if (voiceEnabled) window.speechSynthesis.cancel();
                                    }}
                                    className={cn(
                                        "p-2 rounded-full transition-all duration-200",
                                        voiceEnabled
                                            ? "bg-white/10 text-white hover:bg-white/20"
                                            : "text-slate-400 hover:text-white hover:bg-white/10"
                                    )}
                                    title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
                                >
                                    {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50 scroll-smooth">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn("flex w-full", msg.sender === 'user' ? "justify-end" : "justify-start")}
                                >
                                    <div className={cn(
                                        "flex flex-col gap-1 max-w-[85%]",
                                        msg.sender === 'user' ? "items-end" : "items-start"
                                    )}>
                                        <div className={cn(
                                            "px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
                                            msg.sender === 'user'
                                                ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                                : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm"
                                        )}>
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-400 px-1">
                                            {msg.sender === 'bot' ? 'HealthTrack+ AI • ' : 'You • '}
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start w-full"
                                >
                                    <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{
                                                        y: [0, -6, 0],
                                                        opacity: [0.6, 1, 0.6]
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                                                    className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium text-slate-400">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-white border-t border-slate-100">
                            <div className="relative flex items-center gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleListening}
                                    className={cn(
                                        "p-3 rounded-xl transition-all duration-300 shadow-sm border",
                                        isListening
                                            ? "bg-red-50 border-red-200 text-red-500"
                                            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                    )}
                                >
                                    {isListening ? (
                                        <span className="relative flex h-5 w-5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <MicOff className="relative inline-flex h-5 w-5" />
                                        </span>
                                    ) : (
                                        <Mic className="h-5 w-5" />
                                    )}
                                </motion.button>

                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder={isListening ? "Listening..." : "Tell me what's on your mind..."}
                                        className="w-full pl-5 pr-4 py-3.5 bg-slate-50 border-slate-200 rounded-xl text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={!input.trim() || isLoading}
                                    onClick={handleSend}
                                    className={cn(
                                        "p-3.5 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center",
                                        input.trim()
                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
                                            : "bg-slate-100 text-slate-300 shadow-none cursor-not-allowed"
                                    )}
                                >
                                    <Send className="h-5 w-5" />
                                </motion.button>
                            </div>
                            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                                <div className="h-px w-8 bg-slate-200"></div>
                                <span>HealthTrack+ AI can make mistakes. Verify important info.</span>
                                <div className="h-px w-8 bg-slate-200"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05, rotate: isOpen ? 90 : 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "pointer-events-auto h-16 w-16 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center ring-4 ring-white/20 backdrop-blur-sm",
                    isOpen
                        ? "bg-slate-800 rotate-90"
                        : "bg-gradient-to-tr from-blue-600 to-teal-500 hover:shadow-blue-500/40"
                )}
            >
                {isOpen ? (
                    <X className="h-7 w-7 text-white" />
                ) : (
                    <div className="relative">
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400/80 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400 border-2 border-blue-600"></span>
                        </span>
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
