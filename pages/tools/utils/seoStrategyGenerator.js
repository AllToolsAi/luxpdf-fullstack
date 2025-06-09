'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiSun, FiMoon, FiMaximize2, FiMinimize2, FiRefreshCw } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function SEOStrategyGenerator() {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [businessType, setBusinessType] = useState('ecommerce');
    const [targetKeywords, setTargetKeywords] = useState('');
    const [strategy, setStrategy] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const containerRef = useRef(null);

    const businessTypes = [
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'blog', label: 'Blog' },
        { value: 'saas', label: 'SaaS' },
        { value: 'local', label: 'Local Business' },
        { value: 'agency', label: 'Agency' }
    ];

    const generateStrategy = () => {
        if (!websiteUrl && !targetKeywords) {
            setError('Please enter either a website URL or target keywords');
            return;
        }

        setIsGenerating(true);
        setError('');
        setStrategy(null);

        // Simulate API call with timeout
        setTimeout(() => {
            try {
                const keywords = targetKeywords
                    ? targetKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
                    : ['seo', 'marketing', 'digital strategy'];

                // Generate strategy based on business type
                const baseStrategy = {
                    technicalSeo: [
                        'Run a full site audit using Screaming Frog',
                        'Fix all 4xx/5xx errors found in Google Search Console',
                        'Optimize robots.txt and XML sitemap',
                        'Implement proper schema markup for your content',
                        'Ensure mobile responsiveness and Core Web Vitals optimization'
                    ],
                    contentStrategy: [
                        `Create pillar content around "${keywords[0] || 'your main topic'}"`,
                        'Develop a content calendar with 2-4 posts per month',
                        'Update and refresh old content with new information',
                        'Add FAQ sections to key pages for featured snippets'
                    ],
                    linkBuilding: [
                        'Identify 10 high-authority guest posting opportunities',
                        'Create 3-5 linkable assets (infographics, tools, calculators)',
                        'Build relationships with industry influencers',
                        'Monitor and disavow toxic backlinks'
                    ],
                    tracking: [
                        'Set up Google Analytics 4 with proper conversion tracking',
                        'Monitor rankings for 15-20 key phrases weekly',
                        'Track organic traffic growth monthly',
                        'Analyze competitor backlink profiles quarterly'
                    ]
                };

                // Business-specific adjustments
                if (businessType === 'ecommerce') {
                    baseStrategy.technicalSeo.push('Optimize product pages with unique descriptions');
                    baseStrategy.contentStrategy.push('Create buying guides and product comparison content');
                } else if (businessType === 'blog') {
                    baseStrategy.contentStrategy.push('Focus on long-form, in-depth articles (2000+ words)');
                    baseStrategy.linkBuilding.push('Participate in expert roundups in your niche');
                } else if (businessType === 'saas') {
                    baseStrategy.contentStrategy.push('Create detailed case studies and whitepapers');
                    baseStrategy.technicalSeo.push('Optimize documentation and knowledge base');
                } else if (businessType === 'local') {
                    baseStrategy.technicalSeo.push('Optimize Google My Business profile');
                    baseStrategy.contentStrategy.push('Create location-specific landing pages');
                } else if (businessType === 'agency') {
                    baseStrategy.contentStrategy.push('Showcase client success stories and testimonials');
                    baseStrategy.linkBuilding.push('Get listed in agency directories');
                }

                setStrategy(baseStrategy);
            } catch (err) {
                setError('Failed to generate strategy. Please try again.');
                console.error('Generation error:', err);
            } finally {
                setIsGenerating(false);
            }
        }, 1500);
    };

    const handleCopy = async (items) => {
        try {
            await navigator.clipboard.writeText(items.join('\n• '));
            setError('Copied to clipboard!');
            setTimeout(() => setError(''), 2000);
        } catch (err) {
            setError('Failed to copy');
            console.error('Copy error:', err);
        }
    };

    const handleReset = () => {
        setWebsiteUrl('');
        setBusinessType('ecommerce');
        setTargetKeywords('');
        setStrategy(null);
        setError('');
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.()
                .catch(err => {
                    setError('Fullscreen error: ' + err.message);
                    console.error('Fullscreen error:', err);
                });
        } else {
            document.exitFullscreen?.()
                .catch(err => {
                    setError('Fullscreen error: ' + err.message);
                    console.error('Fullscreen error:', err);
                });
        }
    };

    useEffect(() => {
        const onFull = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFull);
        return () => document.removeEventListener('fullscreenchange', onFull);
    }, []);

    return (
        <Layout>
            <SEO
                title="SEO Strategy Generator | Custom SEO Plan Creator"
                description="Generate a customized SEO strategy for your website. Get technical, content, and link-building recommendations tailored to your business."
                keywords="SEO strategy, SEO plan, marketing strategy, SEO roadmap, search engine optimization"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
            />

            <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">SEO Strategy Generator</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Create a customized SEO plan for your website</p>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <select
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                className="w-full px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                            >
                                {businessTypes.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="px-3 py-1 border rounded dark:border-gray-700 dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-1 bg-red-100 dark:bg-red-700 rounded flex items-center gap-2"
                            >
                                <FiRefreshCw /> Reset
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center gap-2"
                            >
                                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={`p-3 rounded ${
                            error.includes('Failed') ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'
                        }`}>
                            {error}
                        </div>
                    )}

                    <div ref={containerRef} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1 font-medium">Website URL (optional)</label>
                                    <input
                                        type="url"
                                        value={websiteUrl}
                                        onChange={(e) => setWebsiteUrl(e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Target Keywords (comma separated)</label>
                                    <textarea
                                        value={targetKeywords}
                                        onChange={(e) => setTargetKeywords(e.target.value)}
                                        placeholder="e.g., seo services, digital marketing"
                                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                                        rows={3}
                                    />
                                </div>
                                <button
                                    onClick={generateStrategy}
                                    disabled={isGenerating}
                                    className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 ${
                                        isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="animate-spin">🌀</span>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Strategy'
                                    )}
                                </button>
                            </div>

                            {strategy && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold">Your 3-Month SEO Roadmap</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Strategy for {businessTypes.find(b => b.value === businessType)?.label} business
                                        {targetKeywords && ` targeting: ${targetKeywords.split(',').map(k => k.trim()).join(', ')}`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {strategy && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold">Technical SEO</h3>
                                        <button
                                            onClick={() => handleCopy(strategy.technicalSeo)}
                                            className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"
                                        >
                                            <FiCopy /> Copy
                                        </button>
                                    </div>
                                    <ul className="space-y-2">
                                        {strategy.technicalSeo.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-block mr-2 text-blue-600 dark:text-blue-400">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold">Content Strategy</h3>
                                        <button
                                            onClick={() => handleCopy(strategy.contentStrategy)}
                                            className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"
                                        >
                                            <FiCopy /> Copy
                                        </button>
                                    </div>
                                    <ul className="space-y-2">
                                        {strategy.contentStrategy.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-block mr-2 text-blue-600 dark:text-blue-400">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold">Link Building</h3>
                                        <button
                                            onClick={() => handleCopy(strategy.linkBuilding)}
                                            className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"
                                        >
                                            <FiCopy /> Copy
                                        </button>
                                    </div>
                                    <ul className="space-y-2">
                                        {strategy.linkBuilding.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-block mr-2 text-blue-600 dark:text-blue-400">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold">Tracking & Analysis</h3>
                                        <button
                                            onClick={() => handleCopy(strategy.tracking)}
                                            className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"
                                        >
                                            <FiCopy /> Copy
                                        </button>
                                    </div>
                                    <ul className="space-y-2">
                                        {strategy.tracking.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-block mr-2 text-blue-600 dark:text-blue-400">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded text-sm">
                        <strong>Tips:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>For best results, provide both URL and target keywords</li>
                            <li>Select your business type for tailored recommendations</li>
                            <li>Implement technical SEO fixes first for fastest results</li>
                            <li>Review and adjust strategy quarterly based on performance</li>
                        </ul>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-center">
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
            </section>
        </Layout>
    );
}