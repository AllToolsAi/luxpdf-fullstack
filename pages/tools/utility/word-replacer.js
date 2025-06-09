'use client';

import { useState, useRef } from 'react';
import { FiRefreshCw, FiCopy, FiFileText } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function WordReplacer() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [isCaseSensitive, setIsCaseSensitive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const outputRef = useRef(null);

    const handleReplace = () => {
        if (!inputText.trim()) {
            setError('Please enter some text to process');
            return;
        }

        if (!findText.trim()) {
            setError('Please enter text to find');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setSuccess(false);

        try {
            const regex = new RegExp(
                isCaseSensitive ? findText : findText,
                isCaseSensitive ? 'g' : 'gi'
            );
            const replaced = inputText.replace(regex, replaceText);
            setOutputText(replaced);
            setSuccess(true);
        } catch (err) {
            setError('Invalid search pattern. Please check your input.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setInputText('');
        setOutputText('');
        setFindText('');
        setReplaceText('');
        setError(null);
        setSuccess(false);
    };

    const handleCopy = () => {
        if (outputText) {
            navigator.clipboard.writeText(outputText);
            setSuccess('Copied to clipboard!');
            setTimeout(() => setSuccess(false), 2000);
        }
    };

    const loadExample = () => {
        setInputText('The quick brown fox jumps over the lazy dog.\nThis is an example text for demonstration purposes.');
        setFindText('fox');
        setReplaceText('cat');
        setError(null);
        setSuccess(false);
    };

    return (
        <Layout>
            <SEO
                title="Word Replacer | Text Processing Tool"
                description="Free online tool to find and replace words in text. Supports case-sensitive replacement and bulk text processing."
                keywords="word replacer, find and replace, text processing, text editor, bulk replace"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
                }}
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">Word Replacer</h1>
                        <p className="text-center text-gray-600 mb-8">Find and replace words in your text</p>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto space-y-6">
                            {/* Find/Replace Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-2">Find</label>
                                    <input
                                        type="text"
                                        value={findText}
                                        onChange={(e) => setFindText(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Text to find"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-2">Replace With</label>
                                    <input
                                        type="text"
                                        value={replaceText}
                                        onChange={(e) => setReplaceText(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Replacement text"
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="caseSensitive"
                                    checked={isCaseSensitive}
                                    onChange={(e) => setIsCaseSensitive(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="caseSensitive" className="ml-2 text-sm font-medium text-gray-700">
                                    Case-sensitive
                                </label>
                            </div>

                            {/* Text Areas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="font-medium">Input Text</label>
                                        <button
                                            onClick={loadExample}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <FiFileText className="inline" /> Load Example
                                        </button>
                                    </div>
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        className="w-full h-64 font-mono text-sm p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your text here..."
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="font-medium">Output Text</label>
                                        <button
                                            onClick={handleCopy}
                                            disabled={!outputText}
                                            className={`text-sm flex items-center gap-1 ${outputText ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                                        >
                                            <FiCopy className="inline" /> Copy
                                        </button>
                                    </div>
                                    <textarea
                                        ref={outputRef}
                                        value={outputText}
                                        readOnly
                                        className="w-full h-64 font-mono text-sm p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none"
                                        placeholder="Replaced text will appear here..."
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleReplace}
                                    disabled={isProcessing || !inputText.trim() || !findText.trim()}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
                                        isProcessing || !inputText.trim() || !findText.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Replace Text'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 text-blue-600 font-semibold rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    <FiRefreshCw className="inline mr-2 -mt-1" />
                                    Reset
                                </button>
                            </div>

                            {/* Feedback */}
                            {success && (
                                <div className="p-4 bg-green-50 rounded-lg text-green-800 text-center font-medium">
                                    {typeof success === 'string' ? success : 'Text replaced successfully!'}
                                </div>
                            )}
                            {error && <div className="p-4 bg-red-50 rounded-lg text-red-700">{error}</div>}

                            {/* Tips */}
                            <div className="p-4 bg-blue-50 rounded-lg text-sm">
                                <h3 className="flex items-center font-medium text-blue-800 mb-2">
                                    <FiFileText className="mr-2" /> Tool Tips
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Enter the text you want to find and its replacement</li>
                                    <li>Toggle case-sensitivity if needed</li>
                                    <li>Works with large blocks of text</li>
                                </ul>
                            </div>

                            {/* AdSense */}
                            <div className="p-4 bg-gray-100 rounded-lg text-center">
                                <ins
                                    className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client={adsenseConfig.client}
                                    data-ad-slot={adsenseConfig.slot}
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"
                                ></ins>
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </Layout>
    );
}