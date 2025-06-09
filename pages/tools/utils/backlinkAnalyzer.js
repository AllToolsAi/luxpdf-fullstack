'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiSun, FiMoon, FiMaximize2, FiMinimize2, FiRefreshCw } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function BacklinkAnalyzer() {
    const [url, setUrl] = useState('');
    const [results, setResults] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const containerRef = useRef(null);

    const analyzeBacklinks = () => {
        setIsAnalyzing(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            try {
                setResults({
                    total: 42,
                    domains: 18,
                    topDomains: [
                        { domain: 'example.com', links: 5 },
                        { domain: 'anothersite.org', links: 3 }
                    ],
                    anchorTexts: [
                        { text: 'click here', count: 8 },
                        { text: 'learn more', count: 5 }
                    ]
                });
            } catch (err) {
                setError('Analysis failed');
            } finally {
                setIsAnalyzing(false);
            }
        }, 2000);
    };

    // [Include helper functions from previous examples]

    return (
        <Layout>
            <SEO
                title="Backlink Analyzer | SEO Link Profile Checker"
                description="Analyze any website's backlink profile. Discover referring domains, anchor texts and link quality metrics."
                keywords="backlink analyzer, SEO tool, link profile, referring domains, anchor text analysis"
            />

            {/* [Include AdSense script] */}

            <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">Backlink Analyzer</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Analyze any website's link profile</p>

                    {/* [Include control bar] */}

                    <div ref={containerRef} className="space-y-6">
                        <div className="flex gap-4">
                            <input
                                type="url"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="Enter URL (e.g., https://example.com)"
                                className="flex-1 p-3 border rounded dark:bg-gray-800 dark:border-gray-700"
                            />
                            <button
                                onClick={analyzeBacklinks}
                                disabled={isAnalyzing || !url}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>

                        {results && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                    <h3 className="font-semibold">Total Backlinks</h3>
                                    <p className="text-3xl">{results.total}</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                    <h3 className="font-semibold">Referring Domains</h3>
                                    <p className="text-3xl">{results.domains}</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                    <h3 className="font-semibold">Top Anchor Texts</h3>
                                    <ul className="mt-2">
                                        {results.anchorTexts.map((item, i) => (
                                            <li key={i}>{item.text} ({item.count})</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* [Include error display and AdSense sections] */}
                    </div>
                </div>
            </section>
        </Layout>
    );
}