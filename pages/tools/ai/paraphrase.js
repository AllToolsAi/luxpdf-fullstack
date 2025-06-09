import { useState } from 'react';
import { FiRefreshCw, FiCopy, FiDownload } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../..//lib/adsenseConfig';

export default function ParaphraseWriter() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [tone, setTone] = useState('neutral');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleParaphrase = async () => {
        if (!inputText.trim()) return;

        setIsProcessing(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple mock paraphrase - replace with real AI API call
        const paraphrases = {
            formal: `In accordance with the provided text, "${inputText}", the rephrased version maintains the original meaning while employing more sophisticated vocabulary.`,
            casual: `So like, here's another way to say it: "${inputText}" but, you know, more chill.`,
            neutral: `Here's a different way to phrase that: ${inputText}.`
        };

        setOutputText(paraphrases[tone] || paraphrases.neutral);
        setIsProcessing(false);
    };

    const copyToClipboard = () => {
        if (outputText) navigator.clipboard.writeText(outputText);
    };

    const downloadText = () => {
        if (!outputText) return;
        const blob = new Blob([outputText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'paraphrased-text.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Layout>
            <SEO
                title="AI Paraphrase Writer"
                description="Rephrase your text instantly with AI while preserving the original meaning. Choose your tone and get high-quality paraphrased content."
                image="https://yourdomain.com/images/paraphrase-writer-thumbnail.jpg"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_100px] gap-6 max-w-screen-xl mx-auto px-4">
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
                    <main className="space-y-8 max-w-3xl mx-auto">
                        <h1 className="text-4xl font-serif font-bold mb-2 text-center text-primary dark:text-blue-400 flex justify-center items-center space-x-2">
                            <FiRefreshCw size={32} />
                            <span>AI Paraphrase Writer</span>
                        </h1>
                        <p className="text-center text-gray-700 dark:text-gray-300">
                            Rephrase your text while preserving the original meaning
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
                            <div>
                                <label htmlFor="tone-select" className="block mb-1 font-medium text-gray-900 dark:text-gray-200">
                                    Choose Tone
                                </label>
                                <select
                                    id="tone-select"
                                    value={tone}
                                    onChange={e => setTone(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="formal">Formal Tone</option>
                                    <option value="neutral">Neutral Tone</option>
                                    <option value="casual">Casual Tone</option>
                                </select>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 flex flex-col">
                                    <label htmlFor="input-text" className="mb-1 font-medium text-gray-900 dark:text-gray-200">
                                        Original Text
                                    </label>
                                    <textarea
                                        id="input-text"
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        placeholder="Enter text to paraphrase..."
                                        rows={8}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-3 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex flex-col justify-center">
                                    <button
                                        onClick={handleParaphrase}
                                        disabled={isProcessing || !inputText.trim()}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white flex items-center justify-center space-x-2 transition"
                                        aria-label="Generate paraphrased text"
                                    >
                                        {isProcessing ? 'Paraphrasing...' : <>
                                            <FiRefreshCw />
                                            <span>Paraphrase</span>
                                        </>}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Paraphrased Text</h3>
                                    {outputText && (
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={copyToClipboard}
                                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
                                                aria-label="Copy paraphrased text"
                                                type="button"
                                            >
                                                <FiCopy />
                                                <span>Copy</span>
                                            </button>
                                            <button
                                                onClick={downloadText}
                                                className="flex items-center space-x-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-500"
                                                aria-label="Download paraphrased text"
                                                type="button"
                                            >
                                                <FiDownload />
                                                <span>Download</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <textarea
                                    value={outputText}
                                    readOnly
                                    placeholder="Your paraphrased text will appear here..."
                                    rows={8}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-3 resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
                                />
                            </div>
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
