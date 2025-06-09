'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FiCopy, FiSun, FiMoon, FiMaximize2, FiMinimize2, FiRefreshCw } from 'react-icons/fi';
import { format } from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserPostcss from 'prettier/parser-postcss';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

const languageOptions = [
    { value: 'babel', label: 'JavaScript / TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
];

const parserMap = {
    babel: 'babel',
    html: 'html',
    css: 'css',
    json: 'json',
};

const pluginsMap = {
    babel: parserBabel,
    html: parserHtml,
    css: parserPostcss,
    json: parserBabel,
};

export default function CodeFormatter() {
    const [inputCode, setInputCode] = useState(`// Paste your code here...\nfunction example() {\n  const message = "Hello world";\n  console.log(message);\n}`);
    const [formattedCode, setFormattedCode] = useState('');
    const [language, setLanguage] = useState('babel');
    const [darkMode, setDarkMode] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);

    // Formatting options
    const [options, setOptions] = useState({
        semicolons: true,
        singleQuotes: false,
        tabWidth: 2,
        printWidth: 80,
    });

    const formatCode = useCallback(() => {
        if (!inputCode.trim()) {
            setFormattedCode('');
            setError(null);
            return;
        }
        try {
            const formatted = format(inputCode, {
                parser: parserMap[language],
                plugins: [pluginsMap[language]],
                semi: options.semicolons,
                singleQuote: options.singleQuotes,
                tabWidth: options.tabWidth,
                printWidth: options.printWidth,
            });
            setFormattedCode(formatted);
            setError(null);
        } catch (err) {
            setError(`Formatting failed: ${err.message}`);
        }
    }, [inputCode, language, options]);

    // Reset input and output
    const handleReset = () => {
        setInputCode(`// Paste your code here...\nfunction example() {\n  // Your code here\n}`);
        setFormattedCode('');
        setError(null);
    };

    // Copy formatted code
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formattedCode);
            setError('Code copied to clipboard!');
            setTimeout(() => setError(null), 2000);
        } catch {
            setError('Failed to copy code');
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.().catch(err => setError('Fullscreen error: ' + err.message));
        } else {
            document.exitFullscreen?.().catch(err => setError('Fullscreen error: ' + err.message));
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => formatCode(), 500);
        return () => clearTimeout(handler);
    }, [inputCode, language, options, formatCode]);

    useEffect(() => {
        const onFull = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFull);
        return () => document.removeEventListener('fullscreenchange', onFull);
    }, []);

    return (
        <Layout>
            <SEO
                title="Advanced Code Formatter | JavaScript, HTML, CSS, TypeScript"
                description="Professional code formatting tool powered by Prettier. Format and beautify your JavaScript, HTML, CSS, TypeScript and JSON code."
                keywords="code formatter, prettier online, javascript formatter, html formatter, css formatter, code beautifier"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
            />

            <section className={`py-16 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-[80vh]`}>
                <div className="max-w-7xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">Code Formatter</h1>
                    <p className="text-center text-gray-400">Format and beautify your code instantly</p>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className={`px-3 py-1 border rounded ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                            {languageOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`px-3 py-1 border rounded transition ${darkMode ? 'bg-gray-800 border-gray-700 text-yellow-300' : 'bg-gray-200 border-gray-300 text-gray-700'}`}
                                aria-label="Toggle Dark Mode"
                            >
                                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                            </button>

                            <button
                                onClick={handleCopy}
                                disabled={!formattedCode}
                                className="px-4 py-1 bg-blue-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
                            >
                                <FiCopy /> Copy
                            </button>

                            <button
                                onClick={handleReset}
                                className="px-4 py-1 bg-red-600 text-white rounded flex items-center gap-2"
                            >
                                <FiRefreshCw /> Reset
                            </button>

                            <button
                                onClick={toggleFullscreen}
                                className="px-4 py-1 bg-gray-600 text-white rounded flex items-center gap-2"
                            >
                                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={`p-3 rounded ${error.includes('failed') || error.includes('Failed') ? 'bg-red-700 text-red-100' : 'bg-green-700 text-green-100'}`}>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Formatting Options</h2>
                            <div className={`grid grid-cols-2 gap-4 p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={options.semicolons}
                                        onChange={() => setOptions(o => ({ ...o, semicolons: !o.semicolons }))}
                                        className="rounded"
                                    />
                                    Semicolons
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={options.singleQuotes}
                                        onChange={() => setOptions(o => ({ ...o, singleQuotes: !o.singleQuotes }))}
                                        className="rounded"
                                    />
                                    Single Quotes
                                </label>

                                <label className="flex items-center gap-2">
                                    <span className="w-24">Tab Width:</span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={8}
                                        value={options.tabWidth}
                                        onChange={e => setOptions(o => ({ ...o, tabWidth: Number(e.target.value) }))}
                                        className={`w-16 p-1 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    />
                                </label>

                                <label className="flex items-center gap-2">
                                    <span className="w-24">Line Length:</span>
                                    <input
                                        type="number"
                                        min={40}
                                        max={120}
                                        value={options.printWidth}
                                        onChange={e => setOptions(o => ({ ...o, printWidth: Number(e.target.value) }))}
                                        className={`w-16 p-1 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label htmlFor="inputCode" className="block font-semibold">
                                Input Code
                            </label>
                            <textarea
                                id="inputCode"
                                rows={15}
                                value={inputCode}
                                onChange={e => setInputCode(e.target.value)}
                                placeholder="Paste or type your code here"
                                className={`w-full p-3 border rounded resize-none font-mono text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                            />

                            <label htmlFor="formattedCode" className="block font-semibold">
                                Formatted Code
                            </label>
                            <textarea
                                id="formattedCode"
                                rows={15}
                                value={formattedCode}
                                readOnly
                                placeholder="Formatted code will appear here"
                                className={`w-full p-3 border rounded resize-none font-mono text-sm ${darkMode ? 'bg-gray-900 border-gray-700 text-green-300' : 'bg-gray-50 border-gray-300 text-green-700'}`}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Adsense (Replace with your actual client and slot IDs) */}
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={adsenseConfig.CLIENT_ID}
                data-ad-slot={adsenseConfig.SLOT_ID}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </Layout>
    );
}
