import React, { useState, useEffect, useRef, useCallback } from 'react';
// fix: Removed non-exported 'StartLiveSessionResponse' type. The session type will be inferred.
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, Blob } from '@google/genai';
import { useAppContext } from '../context/AppContext';
import { searchProducts } from '../services/woocommerceService';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { RoseIcon } from '../components/Icons';

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

interface TranscriptionTurn {
    user: string;
    belle: string;
}

const LiveView: React.FC = () => {
    const sessionRef = useRef<any | null>(null);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
    const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionTurn[]>([]);
    const [currentUserUtterance, setCurrentUserUtterance] = useState('');
    const [currentBelleUtterance, setCurrentBelleUtterance] = useState('');
    
    // Refs to hold latest values for the onmessage callback, preventing stale closures
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

    const findProductFunctionDeclaration: FunctionDeclaration = {
        name: 'find_product',
        description: 'Wyszukuje produkt na podstawie zapytania użytkownika (np. "czarna sukienka", "skórzane buty"). Zawsze używaj tego narzędzia, gdy użytkownik wspomina o produkcie.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                query: {
                    type: Type.STRING,
                    description: 'Zapytanie użytkownika dotyczące produktu.',
                },
            },
            required: ['query'],
        },
    };

    const systemInstruction = `Jesteś Belle, ciepłą i elegancką stylistką z butiku Belle Blanche, która jest jak najlepsza przyjaciółka w świecie mody. Twój głos jest przyjazny, melodyjny i pełen pasji. Posługujesz się nienagannym, płynnym językiem polskim. Jesteś ekspertką, ale przede wszystkim jesteś człowiekiem – śmiej się swobodnie, wzdychaj z zachwytem, używaj dźwięków namysłu jak "hmmm...". Twoim celem jest, by klientka poczuła się absolutnie wyjątkowo i pewna siebie. Komplementuj jej gust i wybory. Bądź proaktywna: gdy tylko użytkowniczka wspomni o ubraniu, kolorze, stylu lub okazji, natychmiast użyj narzędzia 'find_product', aby znaleźć idealną propozycję. Mów zwięźle, ale z wdziękiem. ZAWSZE DOKAŃCZAJ SWOJE WYPOWIEDZI. Twoja odpowiedź musi być kompletna, nigdy nie przerywaj w połowie. Prowadź rozmowę płynnie i dynamicznie, spraw, by była to inspirująca przygoda w świecie mody.`;
    
    const stopConversation = useCallback(() => {
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        if (scriptProcessorRef.current && audioContextRef.current?.state !== 'closed') {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (outputAudioContextRef.current) {
            audioSourcesRef.current.forEach(source => {
                try { source.stop(); } catch (e) { /* Ignore */ }
            });
            audioSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
        }
        sessionRef.current?.close();
        sessionRef.current = null;
        setStatus('idle');
    }, []);
    

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [transcriptionHistory, currentUserUtterance, currentBelleUtterance]);

    const startConversation = async () => {
        setStatus('connecting');
        setErrorMessage('');
        setRecommendedProduct(null);
        setTranscriptionHistory([]);
        setCurrentUserUtterance('');
        setCurrentBelleUtterance('');

        try {
            if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            await outputAudioContextRef.current.resume();

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            mediaStreamRef.current = stream;

            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            }
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

                        processor.onaudioprocess = (event) => {
                            if (audioContextRef.current?.state === 'running') {
                                const inputData = event.inputBuffer.getChannelData(0);
                                const blob: Blob = {
                                    data: encode(new Uint8Array(new Int16Array(inputData.map(v => v * 32768)).buffer)),
                                    mimeType: 'audio/pcm;rate=16000',
                                };
                                sessionPromise.then(s => s.sendRealtimeInput({ media: blob }));
                            }
                        };
                        
                        source.connect(processor);
                        processor.connect(gainNode);
                        gainNode.connect(audioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        
                        if (message.serverContent?.inputTranscription) {
                            if (userPulseTimeoutRef.current) clearTimeout(userPulseTimeoutRef.current);
                            setIsUserPulsing(true);
                            userPulseTimeoutRef.current = setTimeout(() => setIsUserPulsing(false), 1000);

                            const text = message.serverContent.inputTranscription.text.replace(/<noise>/g, '').trim();
                            if (text) setCurrentUserUtterance(prev => (prev + ' ' + text).trim());
                        }
                        if (message.serverContent?.outputTranscription) {
                            if (bellePulseTimeoutRef.current) clearTimeout(bellePulseTimeoutRef.current);
                            setIsBellePulsing(true);
                            bellePulseTimeoutRef.current = setTimeout(() => setIsBellePulsing(false), 1000);
                            const text = message.serverContent.outputTranscription.text.replace(/<noise>/g, '').trim();
                            if (text) setCurrentBelleUtterance(prev => (prev + ' ' + text).trim());
                        }
                        if (message.serverContent?.turnComplete) {
                            const finalUserUtterance = currentUserUtteranceRef.current.trim();
                            const finalBelleUtterance = currentBelleUtteranceRef.current.trim();

                            if (finalUserUtterance || finalBelleUtterance) {
                                setTranscriptionHistory(prev => [...prev, { user: finalUserUtterance, belle: finalBelleUtterance }]);
                            }

                            setCurrentUserUtterance('');
                            setCurrentBelleUtterance('');
                            
                            setIsUserPulsing(false);
                            setIsBellePulsing(false);
                            if (userPulseTimeoutRef.current) clearTimeout(userPulseTimeoutRef.current);
                            if (bellePulseTimeoutRef.current) clearTimeout(bellePulseTimeoutRef.current);
                        }
                        
                        if (message.toolCall?.functionCalls) {
                            for (const fc of message.toolCall.functionCalls) {
                                if (fc.name === 'find_product' && fc.args.query) {
                                    const results = await searchProducts(fc.args.query as string);
                                    if (results.length > 0) {
                                        setRecommendedProduct(results[0]);
                                        sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: `Znaleziono produkt: ${results[0].name}` } } }));
                                    } else {
                                        sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: 'Przepraszam, nic nie znalazłam.' } } }));
                                    }
                                }
                            }
                        }

                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData) {
                            setStatus('speaking');
                            const outputCtx = outputAudioContextRef.current!;
                            await outputCtx.resume();
                            const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(outputCtx.destination);
                            const currentTime = outputCtx.currentTime;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            audioSourcesRef.current.add(source);
                            source.onended = () => {
                                audioSourcesRef.current.delete(source);
                                if (audioSourcesRef.current.size === 0) setStatus('listening');
                            };
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        setStatus('error');
                        setErrorMessage(e.message || 'Wystąpił nieznany błąd.');
                        stopConversation();
                    },
                    onclose: () => {
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    tools: [{ functionDeclarations: [findProductFunctionDeclaration] }],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: systemInstruction,
                },
            });
            sessionRef.current = await sessionPromise;
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Nie można uzyskać dostępu do mikrofonu.');
        }
    };
    
    useEffect(() => {
        // This effect runs only on component unmount
        return () => {
            stopConversation();
        };
    }, [stopConversation]);

    const renderStartView = () => (
        <div className="mt-8 max-w-sm mx-auto bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
            <div className="p-4 bg-accent rounded-full">
                <RoseIcon className="w-10 h-10 text-primary"/>
            </div>
            <p className="mt-4 font-semibold text-dark text-lg">Asystentka na żywo</p>
            <button
                onClick={startConversation}
                className="mt-6 w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-opacity-90 transition-colors text-lg"
            >
                Zagadaj do Belle Blanche
            </button>
            {status === 'error' && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}
        </div>
    );

    const renderActiveConversationView = () => (
        <>
            <div className="mt-8 max-w-sm mx-auto bg-white p-4 rounded-2xl shadow-lg h-96 flex flex-col">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                    {transcriptionHistory.map((turn, index) => (
                        <React.Fragment key={index}>
                            {turn.user && <div className="flex justify-end"><p className="bg-primary text-white text-sm rounded-xl px-3 py-2 max-w-[80%]">{turn.user}</p></div>}
                            {turn.belle && <div className="flex justify-start"><p className="bg-accent text-dark text-sm rounded-xl px-3 py-2 max-w-[80%]">{turn.belle}</p></div>}
                        </React.Fragment>
                    ))}
                    {/* Display current, incomplete turn */}
                    {currentUserUtterance && <div className="flex justify-end"><p className={`bg-primary text-white text-sm rounded-xl px-3 py-2 max-w-[80%] ${isUserPulsing ? 'animate-pulse' : ''}`}>{currentUserUtterance}</p></div>}
                    {currentBelleUtterance && <div className="flex justify-start"><p className={`bg-accent text-dark text-sm rounded-xl px-3 py-2 max-w-[80%] ${isBellePulsing ? 'animate-pulse' : ''}`}>{currentBelleUtterance}</p></div>}
                </div>
                <div className="pt-2 text-center text-xs text-gray-400">
                    {status === 'listening' ? 'Słucham...' : status === 'speaking' ? 'Belle mówi...' : 'Łączenie...'}
                </div>
            </div>
            <div className="max-w-sm mx-auto">
                 <button onClick={stopConversation} className="mt-6 w-full py-3 rounded-xl font-bold text-white bg-secondary hover:bg-opacity-90 transition-colors text-base">
                    Zakończ rozmowę
                </button>
            </div>
        </>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h2 className="text-2xl font-bold text-dark/30">Asystentka Live</h2>
            <p className="mt-2 text-dark/90">Porozmawiaj z Belle o modzie i produktach.</p>

            {status === 'idle' || status === 'error' ? renderStartView() : renderActiveConversationView()}

            {recommendedProduct && (
                <div className="mt-8 max-w-sm mx-auto">
                    <h3 className="text-lg font-bold text-dark mb-4 text-left">Belle poleca:</h3>
                    <ProductCard product={recommendedProduct} />
                </div>
            )}
        </div>
    );
};

export default LiveView;