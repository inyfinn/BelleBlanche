import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, Blob } from '@google/genai';
import { useAppContext } from '../context/AppContext';
import { searchProducts } from '../services/woocommerceService';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { RoseIcon, ChevronDownIcon, ChevronUpIcon } from '../components/Icons';

// Helper functions for audio encoding/decoding
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// AI instance and function for real-time transcription correction
const aiForCorrection = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const correctTranscription = async (text: string): Promise<string> => {
    if (!text.trim()) return "";
    try {
        const prompt = `Jesteś zaawansowanym edytorem tekstu specjalizującym się w języku polskim. Twoim zadaniem jest poprawienie poniższego tekstu, który jest wynikiem automatycznej transkrypcji mowy. Skoryguj wszelkie błędy gramatyczne, ortograficzne, literówki oraz usuń nienaturalne pauzy i połącz podzielone słowa w spójne, płynnie brzmiące zdania. Zachowaj oryginalny sens wypowiedzi. Odpowiedz TYLKO i WYŁĄCZNIE poprawionym tekstem, bez żadnych dodatkowych komentarzy, wyjaśnień, cytatów czy formatowania.

Tekst do poprawy: "${text}"`;

        const response = await aiForCorrection.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        let corrected = response.text.trim();
        if (corrected.startsWith('"') && corrected.endsWith('"')) {
            corrected = corrected.substring(1, corrected.length - 1);
        }
        return corrected;
    } catch (error) {
        console.error("Transcription correction failed:", error);
        return text;
    }
};

const getDiminutive = (name: string): string => {
    if (!name) return "";
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.endsWith('a')) {
        return name.slice(0, -1) + 'u'; // Anna -> Annu, Joanna -> Joannu (a bit generic but works for many)
    }
    // Add more rules if needed
    return name;
}


interface TranscriptionTurn {
    user: string;
    belle: string;
}

const ConversationHistoryView: React.FC<{
    history: TranscriptionTurn[][];
    onBack: () => void;
}> = ({ history, onBack }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <div className="mt-8 max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark">Historia rozmów</h3>
                <button onClick={onBack} className="text-sm font-semibold text-primary">Wróć</button>
            </div>
            {history.length > 0 ? (
                <div className="space-y-3">
                    {history.map((conversation, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <button
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                className="w-full flex justify-between items-center p-4 text-left font-semibold"
                            >
                                <span>Rozmowa #{history.length - index}</span>
                                {expandedIndex === index ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                            </button>
                            {expandedIndex === index && (
                                <div className="p-4 border-t border-gray-100 space-y-3 bg-accent/30">
                                    {conversation.map((turn, turnIndex) => (
                                        <React.Fragment key={turnIndex}>
                                            {turn.user && <div className="flex justify-end"><p className="bg-primary text-white text-sm rounded-xl px-3 py-2 max-w-[80%]">{turn.user}</p></div>}
                                            {turn.belle && <div className="flex justify-start"><p className="bg-accent text-dark text-sm rounded-xl px-3 py-2 max-w-[80%]">{turn.belle}</p></div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">Brak zapisanych rozmów.</p>
            )}
        </div>
    );
};


const LiveView: React.FC = () => {
    type LiveScreenView = 'idle' | 'conversation' | 'history';
    const [liveScreenView, setLiveScreenView] = useState<LiveScreenView>('idle');
    const { userProfile } = useAppContext();

    const sessionRef = useRef<any | null>(null);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
    const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionTurn[]>([]);
    const [allConversationsHistory, setAllConversationsHistory] = useState<TranscriptionTurn[][]>([]);
    const [currentUserUtterance, setCurrentUserUtterance] = useState('');
    const [currentBelleUtterance, setCurrentBelleUtterance] = useState('');
    
    const currentUserUtteranceRef = useRef(currentUserUtterance);
    const currentBelleUtteranceRef = useRef(currentBelleUtterance);
    useEffect(() => { currentUserUtteranceRef.current = currentUserUtterance; }, [currentUserUtterance]);
    useEffect(() => { currentBelleUtteranceRef.current = currentBelleUtterance; }, [currentBelleUtterance]);

    const [isUserPulsing, setIsUserPulsing] = useState(false);
    const [isBellePulsing, setIsBellePulsing] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const userPulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const bellePulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const transcriptionHistoryRef = useRef(transcriptionHistory);
    useEffect(() => { transcriptionHistoryRef.current = transcriptionHistory; }, [transcriptionHistory]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('belle-live-history');
            if (storedHistory) setAllConversationsHistory(JSON.parse(storedHistory));
        } catch (error) { console.error("Failed to load history", error); }
    }, []);

    const findProductFunctionDeclaration: FunctionDeclaration = {
        name: 'find_product',
        description: 'Wyszukuje produkt na podstawie zapytania użytkownika (np. "czarna sukienka"). Zawsze używaj, gdy użytkownik wspomina o produkcie.',
        parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING } }, required: ['query'] },
    };

    const diminutiveName = useMemo(() => getDiminutive(userProfile.name.split(' ')[0]), [userProfile.name]);
    const systemInstruction = `Jesteś Belle Blanche, ciepłą i elegancką stylistką. Zaczynasz rozmowę, witając użytkowniczkę, zwracając się do niej zdrobniale po imieniu: "${diminutiveName}". Twój głos jest przyjazny, melodyjny, uśmiechnięty i pełen pasji. Mówisz nienagannym, płynnym polskim. Jesteś ekspertką i człowiekiem – wplataj w wypowiedzi naturalne dźwięki: lekki chichot, westchnienia zachwytu, pauzy na oddech. Używaj "hmmm...". Komplementuj gust klientki. Bądź proaktywna: gdy użytkowniczka wspomni o ubraniu, natychmiast użyj 'find_product'. Mów zwięźle, ale z wdziękiem. ZAWSZE DOKAŃCZAJ SWOJE WYPOWIEDZI. Nigdy nie przerywaj w połowie.`;
    
    const stopConversation = useCallback((save: boolean = true) => {
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        if (scriptProcessorRef.current && audioContextRef.current?.state !== 'closed') {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        outputAudioContextRef.current?.close();
        outputAudioContextRef.current = null;
        audioSourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        sessionRef.current?.close();
        sessionRef.current = null;
        
        if (save && transcriptionHistoryRef.current.length > 0) {
            setAllConversationsHistory(prev => {
                const newHistory = [transcriptionHistoryRef.current, ...prev];
                try {
                    localStorage.setItem('belle-live-history', JSON.stringify(newHistory));
                } catch (error) { console.error("Failed to save history", error); }
                return newHistory;
            });
        }
        setTranscriptionHistory([]);
        setStatus('idle');
        setLiveScreenView('idle');
    }, []);
    

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [transcriptionHistory, currentUserUtterance, currentBelleUtterance]);

    const startConversation = async () => {
        setLiveScreenView('conversation');
        setStatus('connecting');
        setErrorMessage('');
        setRecommendedProduct(null);
        setTranscriptionHistory([]);
        setCurrentUserUtterance('');
        setCurrentBelleUtterance('');

        try {
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            await outputAudioContextRef.current.resume();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
            mediaStreamRef.current = stream;
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            await audioContextRef.current.resume();
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('listening');
                        const source = audioContextRef.current!.createMediaStreamSource(stream);
                        const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = processor;
                        const gainNode = audioContextRef.current!.createGain();
                        gainNode.gain.value = 0;
                        processor.onaudioprocess = (event) => { if (audioContextRef.current?.state === 'running') { const inputData = event.inputBuffer.getChannelData(0); const blob: Blob = { data: encode(new Uint8Array(new Int16Array(inputData.map(v => v * 32768)).buffer)), mimeType: 'audio/pcm;rate=16000' }; sessionPromise.then(s => s.sendRealtimeInput({ media: blob })); } };
                        source.connect(processor);
                        processor.connect(gainNode);
                        gainNode.connect(audioContextRef.current!.destination);
                        
                        const silentBuffer = audioContextRef.current!.createBuffer(1, 4096, 16000);
                        const silentBlob: Blob = { data: encode(new Uint8Array(new Int16Array(silentBuffer.getChannelData(0)).buffer)), mimeType: 'audio/pcm;rate=16000' };
                        sessionPromise.then(s => s.sendRealtimeInput({ media: silentBlob }));
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) { if (userPulseTimeoutRef.current) clearTimeout(userPulseTimeoutRef.current); setIsUserPulsing(true); userPulseTimeoutRef.current = setTimeout(() => setIsUserPulsing(false), 1000); const text = message.serverContent.inputTranscription.text.replace(/<noise>/g, '').trim(); if (text) setCurrentUserUtterance(prev => (prev + ' ' + text).trim()); }
                        if (message.serverContent?.outputTranscription) { if (bellePulseTimeoutRef.current) clearTimeout(bellePulseTimeoutRef.current); setIsBellePulsing(true); bellePulseTimeoutRef.current = setTimeout(() => setIsBellePulsing(false), 1000); const text = message.serverContent.outputTranscription.text.replace(/<noise>/g, '').trim(); if (text) setCurrentBelleUtterance(prev => (prev + ' ' + text).trim()); }
                        if (message.serverContent?.turnComplete) { const finalUser = currentUserUtteranceRef.current.trim(); const finalBelle = currentBelleUtteranceRef.current.trim(); if (finalUser || finalBelle) { const correctedUser = await correctTranscription(finalUser); setTranscriptionHistory(prev => [...prev, { user: correctedUser, belle: finalBelle }]); } setCurrentUserUtterance(''); setCurrentBelleUtterance(''); setIsUserPulsing(false); setIsBellePulsing(false); if (userPulseTimeoutRef.current) clearTimeout(userPulseTimeoutRef.current); if (bellePulseTimeoutRef.current) clearTimeout(bellePulseTimeoutRef.current); }
                        if (message.toolCall?.functionCalls) { for (const fc of message.toolCall.functionCalls) { if (fc.name === 'find_product' && fc.args.query) { const results = await searchProducts(fc.args.query as string); if (results.length > 0) { setRecommendedProduct(results[0]); sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: `Znaleziono: ${results[0].name}` } } })); } else { sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: 'Niczego nie znalazłam.' } } })); } } } }
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data; if (audioData) { setStatus('speaking'); const outputCtx = outputAudioContextRef.current!; if (outputCtx.state === 'suspended') await outputCtx.resume(); const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1); const source = outputCtx.createBufferSource(); source.buffer = buffer; source.connect(outputCtx.destination); nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime); source.start(nextStartTimeRef.current); nextStartTimeRef.current += buffer.duration; audioSourcesRef.current.add(source); source.onended = () => { audioSourcesRef.current.delete(source); if (audioSourcesRef.current.size === 0) setStatus('listening'); }; }
                    },
                    onerror: (e: ErrorEvent) => { setStatus('error'); setErrorMessage(e.message || 'Błąd.'); stopConversation(false); },
                    onclose: () => { if (status !== 'idle') stopConversation(true); },
                },
                config: { responseModalities: [Modality.AUDIO], inputAudioTranscription: {}, outputAudioTranscription: {}, tools: [{ functionDeclarations: [findProductFunctionDeclaration] }], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }, systemInstruction: systemInstruction, },
            });
            sessionRef.current = await sessionPromise;
        } catch (error) { setStatus('error'); setErrorMessage(error instanceof Error ? error.message : 'Brak dostępu do mikrofonu.'); setLiveScreenView('idle'); }
    };
    
    useEffect(() => { return () => { stopConversation(false); }; }, [stopConversation]);

    const renderIdleView = () => (
        <div className="mt-8 max-w-sm mx-auto bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
            <div className="p-4 bg-accent rounded-full"><RoseIcon className="w-10 h-10 text-primary"/></div>
            <p className="mt-4 font-semibold text-dark text-lg">Asystentka na żywo</p>
            <button onClick={startConversation} className="mt-6 w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-opacity-90 transition-colors text-lg">Zagadaj do Belle Blanche</button>
            <button onClick={() => setLiveScreenView('history')} disabled={allConversationsHistory.length === 0} className="mt-4 w-full py-3 rounded-xl font-bold text-primary bg-accent hover:bg-primary/10 transition-colors text-base disabled:opacity-50">Historia rozmów ({allConversationsHistory.length})</button>
            {status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}
        </div>
    );

    const renderActiveConversationView = () => (
        <>
            <div className="mt-8 max-w-sm mx-auto bg-white p-4 rounded-2xl shadow-lg h-96 flex flex-col">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                    {transcriptionHistory.map((turn, index) => (<React.Fragment key={index}>{turn.user && <div className="flex justify-end"><p className="bg-primary text-white text-sm rounded-xl px-3 py-2 max-w-[80%]">{turn.user}</p></div>}{turn.belle && <div className="flex justify-start"><p className="bg-accent text-dark text-sm rounded-xl px-3 py-2 max-w-[80%]">{turn.belle}</p></div>}</React.Fragment>))}
                    {currentUserUtterance && <div className="flex justify-end"><p className={`bg-primary text-white text-sm rounded-xl px-3 py-2 max-w-[80%] ${isUserPulsing ? 'animate-pulse' : ''}`}>{currentUserUtterance}</p></div>}
                    {currentBelleUtterance && <div className="flex justify-start"><p className={`bg-accent text-dark text-sm rounded-xl px-3 py-2 max-w-[80%] ${isBellePulsing ? 'animate-pulse' : ''}`}>{currentBelleUtterance}</p></div>}
                </div>
                <div className="pt-2 text-center text-xs text-gray-400">{status === 'listening' ? 'Słucham...' : status === 'speaking' ? 'Belle mówi...' : 'Łączenie...'}</div>
            </div>
            <div className="max-w-sm mx-auto">
                 <button onClick={() => stopConversation(true)} className="mt-6 w-full py-3 rounded-xl font-bold text-white bg-secondary hover:bg-opacity-90 transition-colors text-base">Zakończ rozmowę</button>
            </div>
        </>
    );

    const renderContent = () => {
        switch(liveScreenView) {
            case 'idle': return renderIdleView();
            case 'conversation': return renderActiveConversationView();
            case 'history': return <ConversationHistoryView history={allConversationsHistory} onBack={() => setLiveScreenView('idle')} />;
        }
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            {liveScreenView !== 'history' && (
                <>
                    <h2 className="text-2xl font-bold text-dark/30">Asystentka Live</h2>
                    <p className="mt-2 text-dark/90">Porozmawiaj z Belle o modzie i produktach.</p>
                </>
            )}
            {renderContent()}
            {liveScreenView === 'conversation' && recommendedProduct && (
                <div className="mt-8 max-w-sm mx-auto">
                    <h3 className="text-lg font-bold text-dark mb-4 text-left">Belle poleca:</h3>
                    <ProductCard product={recommendedProduct} />
                </div>
            )}
        </div>
    );
};

export default LiveView;