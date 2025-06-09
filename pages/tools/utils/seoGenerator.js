import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { FiCopy } from 'react-icons/fi';
import { BiFullscreen } from 'react-icons/bi';
import Script from 'next/script';

export default function SEOGenerator() {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState('Professional');
    const [results, setResults] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateSEOContent = useCallback(() => {
        setIsGenerating(true);
        setError('');

        const parsedKeywords = keywords
            .split(',')
            .map((k) => k.trim().toLowerCase())
            .filter(Boolean);

        setTimeout(() => {
            try {
                const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

                const metaTitle = `${capitalizedTopic} | Boost Your Visibility & Ranking Online`;
                const metaDescription = `Discover expert strategies for ${capitalizedTopic}. This guide covers the essentials and advanced techniques for higher search rankings. Keywords: ${parsedKeywords.join(', ') || topic.toLowerCase()}.`;
                const h1 = `Complete ${capitalizedTopic} Strategy Guide (${tone} Tone)`;
                const contentOutline = [
                    `1. Introduction to ${capitalizedTopic}`,
                    `2. Importance of ${capitalizedTopic} in Modern SEO`,
                    `3. Key ${capitalizedTopic} Metrics to Monitor`,
                    `4. Step-by-Step ${capitalizedTopic} Implementation`,
                    `5. Common ${capitalizedTopic} Mistakes & Fixes`,
                    `6. Tools to Support Your ${capitalizedTopic} Strategy`,
                    `7. Summary & Final Recommendations`,
                ];
                const keywordSuggestions = [
                    ...parsedKeywords,
                    `${topic.toLowerCase()} guide`,
                    `optimize ${topic.toLowerCase()}`,
                    `${topic.toLowerCase()} best practices`,
                ];

                setResults({ metaTitle, metaDescription, h1, contentOutline, keywordSuggestions });
            } catch {
                setError('Generation failed. Please try again.');
            } finally {
                setIsGenerating(false);
            }
        }, 800);
    }, [topic, keywords, tone]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white p-4 md:p-10">
            <Head>
                <title>SEO Generator Tool</title>
                <meta name="description" content="Generate SEO meta tags, outlines, and keyword ideas easily." />
            </Head>
            <Script id="adsense-script" async strategy="afterInteractive"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxx"
                    crossOrigin="anonymous"
            />

            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">SEO Content Generator</h1>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter SEO topic (e.g. backlinks, schema)"
                        className="p-3 border rounded dark:bg-gray-900"
                    />
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Comma-separated keywords"
                        className="p-3 border rounded dark:bg-gray-900"
                    />
                </div>

                <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="p-3 border rounded dark:bg-gray-900"
                >
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Persuasive">Persuasive</option>
                    <option value="Informative">Informative</option>
                </select>

                <button
                    onClick={generateSEOContent}
                    className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                    disabled={isGenerating || !topic}
                >
                    {isGenerating ? 'Generating…' : 'Generate'}
                </button>

                {error && <p className="text-red-500 font-medium">{error}</p>}

                {results && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-2">Meta Title</h2>
                            <div className="flex justify-between items-center">
                                <p className="text-sm break-words">{results.metaTitle}</p>
                                <button onClick={() => handleCopy(results.metaTitle)}>
                                    <FiCopy className="text-blue-500 hover:text-blue-600" />
                                </button>
                            </div>
                        </div>

                        <div className="p-5 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-2">Meta Description</h2>
                            <div className="flex justify-between items-center">
                                <p className="text-sm break-words">{results.metaDescription}</p>
                                <button onClick={() => handleCopy(results.metaDescription)}>
                                    <FiCopy className="text-blue-500 hover:text-blue-600" />
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2 p-5 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">Content Outline</h2>
                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                {results.contentOutline.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:col-span-2 p-5 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">Keyword Suggestions</h2>
                            <div className="flex flex-wrap gap-2">
                                {results.keywordSuggestions.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-700 text-xs font-medium">
                    {kw}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {copied && <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">Copied!</div>}
            </div>
        </div>
    );
}