import { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Settings } from 'react-feather';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';
export default function VoiceStudio() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [voiceModel, setVoiceModel] = useState('professional-male');
    const [effects, setEffects] = useState({
        noiseReduction: true,
        pitchShift: 0,
        reverb: 0.3,
        clarity: 0.8,
    });
    const audioRef = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    // Cleanup URL objects to avoid memory leaks
    useEffect(() => {
        return () => {
            if (audioBlob) URL.revokeObjectURL(audioBlob);
        };
    }, [audioBlob]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => {
                audioChunks.current.push(e.data);
            };

            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
                setAudioBlob(blob);
                audioChunks.current = [];
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            alert('Microphone access denied or not available.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const processAudio = async () => {
        if (!audioBlob) return;

        // Here: simulate AI-enhanced audio processing with effect parameters
        // Replace with your real audio processing or server call
        // NOTE: pitchShift effect should be number, not string
        const pitchShiftValue = Number(effects.pitchShift);

        // Dummy delay to simulate processing
        await new Promise((r) => setTimeout(r, 2000));

        // For demo: just return original audioBlob as "processed"
        alert(`Audio enhanced with pitch shift: ${pitchShiftValue} semitones, noise reduction: ${effects.noiseReduction ? 'ON' : 'OFF'}`);

        // If real processing, you'd setAudioBlob(processedBlob) here
    };

    return (
        <Layout>
            <SEO
                title="AI Voice Studio"
                description="Record, enhance, and process your voice using AI-powered tools with adjustable effects and professional voice models."
                image="https://yourdomain.com/images/voice-studio-thumbnail.jpg"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
                <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[120px_1fr_120px] gap-8">
                    {/* Left Ad */}
                    <aside className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                            aria-label="Advertisement"
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col space-y-8">
                        <h1 className="text-4xl font-bold flex items-center space-x-3 text-primary dark:text-blue-400">
                            <Mic size={36} />
                            <span>AI Voice Studio</span>
                        </h1>

                        <div className="flex flex-col md:flex-row gap-6">
                            <section className="flex flex-col space-y-6 flex-[0.4]">
                                <div>
                                    <label htmlFor="voice-model" className="block mb-2 font-semibold">
                                        Voice Model
                                    </label>
                                    <select
                                        id="voice-model"
                                        value={voiceModel}
                                        onChange={(e) => setVoiceModel(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="professional-male">Professional Male</option>
                                        <option value="professional-female">Professional Female</option>
                                        <option value="custom-voice">Your Custom Voice</option>
                                    </select>
                                </div>

                                <div>
                                    <h2 className="font-semibold mb-3">Audio Effects</h2>

                                    <label className="block mb-1" htmlFor="pitchShift">
                                        Pitch Shift: {effects.pitchShift} semitones
                                    </label>
                                    <input
                                        id="pitchShift"
                                        type="range"
                                        min="-12"
                                        max="12"
                                        step="1"
                                        value={effects.pitchShift}
                                        onChange={(e) =>
                                            setEffects((prev) => ({ ...prev, pitchShift: Number(e.target.value) }))
                                        }
                                        className="w-full"
                                    />

                                    <label className="block mt-4">
                                        <input
                                            type="checkbox"
                                            checked={effects.noiseReduction}
                                            onChange={() =>
                                                setEffects((prev) => ({ ...prev, noiseReduction: !prev.noiseReduction }))
                                            }
                                            className="mr-2"
                                        />
                                        Noise Reduction
                                    </label>
                                </div>
                            </section>

                            <section className="flex flex-col items-center justify-center flex-[0.6] space-y-6">
                                {!isRecording ? (
                                    <button
                                        onClick={startRecording}
                                        className="w-full max-w-xs py-3 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold flex items-center justify-center space-x-2 transition"
                                        aria-label="Start recording audio"
                                        type="button"
                                    >
                                        <Mic size={24} /> <span>Start Recording</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopRecording}
                                        className="w-full max-w-xs py-3 bg-gray-700 hover:bg-gray-800 rounded-full text-white font-semibold flex items-center justify-center space-x-2 transition"
                                        aria-label="Stop recording audio"
                                        type="button"
                                    >
                                        <StopCircle size={24} /> <span>Stop</span>
                                    </button>
                                )}

                                {audioBlob && (
                                    <>
                                        <audio
                                            ref={audioRef}
                                            controls
                                            src={URL.createObjectURL(audioBlob)}
                                            className="w-full rounded-md shadow"
                                            aria-label="Recorded audio playback"
                                        />
                                        <button
                                            onClick={processAudio}
                                            className="w-full max-w-xs py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold flex items-center justify-center space-x-2 transition"
                                            aria-label="Enhance audio with AI"
                                            type="button"
                                        >
                                            <Settings size={20} /> <span>Enhance with AI</span>
                                        </button>
                                    </>
                                )}
                            </section>
                        </div>
                    </main>

                    {/* Right Ad */}
                    <aside className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                            aria-label="Advertisement"
                        />
                    </aside>
                </div>
            </section>
        </Layout>
    );
}
