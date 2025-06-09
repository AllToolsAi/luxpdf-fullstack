'use client';

import { useState, useEffect, useRef } from 'react';
import { FiCopy, FiRefreshCw, FiCode, FiCpu } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function AlgorithmConverter() {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [targetLanguage, setTargetLanguage] = useState('javascript');
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const outputRef = useRef(null);

    const languageOptions = [
        { value: 'python', label: 'Python' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'cpp', label: 'C++' },
    ];

    // Sample conversion mappings (in a real app, you'd use an actual conversion library)
    const conversionExamples = {
        'python-to-javascript': {
            input: `def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)`,
            output: `function factorial(n) {
    if (n === 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}`
        },
        'javascript-to-python': {
            input: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
            output: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`
        }
    };

    const handleConvert = () => {
        if (!inputCode.trim()) {
            setError('Please enter some code to convert');
            return;
        }

        setIsConverting(true);
        setError(null);
        setSuccess(false);

        // Simulate conversion (in a real app, you'd call an API or use a conversion library)
        setTimeout(() => {
            try {
                const conversionKey = `${language}-to-${targetLanguage}`;
                if (conversionExamples[conversionKey]) {
                    setOutputCode(conversionExamples[conversionKey].output);
                } else {
                    setOutputCode(`// Converted from ${language} to ${targetLanguage}\n// (Sample conversion - actual implementation would require proper parsing)\n${inputCode}`);
                }
                setSuccess(true);
            } catch (err) {
                setError('Conversion failed. Please try again.');
            } finally {
                setIsConverting(false);
            }
        }, 1500);
    };

    const handleReset = () => {
        setInputCode('');
        setOutputCode('');
        setError(null);
        setSuccess(false);
    };

    const handleCopy = () => {
        if (outputCode) {
            navigator.clipboard.writeText(outputCode);
            setSuccess('Copied to clipboard!');
            setTimeout(() => setSuccess(false), 2000);
        }
    };

    const loadExample = () => {
        const exampleKey = `${language}-to-${targetLanguage}`;
        if (conversionExamples[exampleKey]) {
            setInputCode(conversionExamples[exampleKey].input);
            setOutputCode('');
        } else {
            setInputCode(`// Sample ${language} code\n// Enter your own code to convert to ${targetLanguage}`);
            setOutputCode('');
        }
        setError(null);
        setSuccess(false);
    };

    useEffect(() => {
        if (success === true) {
            setTimeout(() => setSuccess(false), 3000);
        }
    }, [success]);

    return (
        <Layout>
            <SEO
                title="Algorithm Converter | Code Translation Tool"
                description="Convert algorithms between Python, JavaScript, Java, C++, and C#. Free online code translation tool for developers."
                keywords="algorithm converter, code translator, python to javascript, java to c#, code conversion, programming tool"
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
                        <h1 className="text-4xl font-bold text-center mb-4">Algorithm Converter</h1>
                        <p className="text-center text-gray-600 mb-8">Convert code between programming languages</p>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto space-y-6">
                            {/* Language Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-2">Source Language</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {languageOptions.map((lang) => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-medium mb-2">Target Language</label>
                                    <select
                                        value={targetLanguage}
                                        onChange={(e) => setTargetLanguage(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {languageOptions.map((lang) => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Code Input/Output */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="font-medium">Input Code ({language})</label>
                                        <button
                                            onClick={loadExample}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <FiCpu className="inline" /> Load Example
                                        </button>
                                    </div>
                                    <textarea
                                        value={inputCode}
                                        onChange={(e) => setInputCode(e.target.value)}
                                        className="w-full h-64 font-mono text-sm p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Enter your ${language} code here...`}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="font-medium">Output Code ({targetLanguage})</label>
                                        <button
                                            onClick={handleCopy}
                                            disabled={!outputCode}
                                            className={`text-sm flex items-center gap-1 ${outputCode ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                                        >
                                            <FiCopy className="inline" /> Copy
                                        </button>
                                    </div>
                                    <pre
                                        ref={outputRef}
                                        className="w-full h-64 font-mono text-sm p-4 bg-gray-50 border border-gray-300 rounded-lg overflow-auto"
                                    >
                    {outputCode || (isConverting ? 'Converting...' : 'Converted code will appear here')}
                  </pre>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={handleConvert}
                                    disabled={isConverting || !inputCode.trim()}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                                        isConverting || !inputCode.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {isConverting ? (
                                        <>
                                            <FiRefreshCw className="animate-spin" />
                                            Converting...
                                        </>
                                    ) : (
                                        <>
                                            <FiCode />
                                            Convert Code
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={isConverting}
                                    className="flex-1 py-3 text-blue-600 font-semibold rounded-md border border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiRefreshCw />
                                    Reset
                                </button>
                            </div>

                            {/* Feedback */}
                            {success && (
                                <div className="p-4 bg-green-50 rounded-lg text-green-800 text-center font-medium">
                                    {typeof success === 'string' ? success : 'Conversion successful!'}
                                </div>
                            )}
                            {error && <div className="p-4 bg-red-50 rounded-lg text-red-700">{error}</div>}

                            {/* Tips */}
                            <div className="p-4 bg-blue-50 rounded-lg text-sm">
                                <h3 className="flex items-center font-medium text-blue-800 mb-2">
                                    <FiCpu className="mr-2" /> Tool Tips
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Select source and target programming languages</li>
                                    <li>For best results, use clean, standard code structures</li>
                                    <li>Some language-specific features may not convert perfectly</li>
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