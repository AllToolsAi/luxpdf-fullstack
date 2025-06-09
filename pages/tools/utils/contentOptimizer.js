'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiSun, FiMoon, FiMaximize2, FiMinimize2, FiRefreshCw } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function ContentOptimizer() {
    const [content, setContent] = useState('');
    const [optimized, setOptimized] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const containerRef = useRef(null);

    const optimizeContent = () => {
        setIsOptimizing(true);
        setError('');

        // Simulate optimization
        setTimeout(() => {
            try {
                const suggestions = [
                    "Improved readability score from 65 to 82",
                    "Added 3 relevant keywords naturally",
                    "Shortened 4 long sentences",
                    "Added 2 subheadings for better structure"
                ];
                setOptimized(content + "\n\n--- OPTIMIZATION RESULTS ---\n" + suggestions.join('\n'));
            } catch (err) {
                setError('Optimization failed');
            } finally {
                setIsOptimizing(false);
            }
        }, 2000);
    };

    // [Include helper functions from previous examples]

    return (
        <Layout>
            <SEO
                title="Content Optimizer | SEO Text Improvement Tool"
                description="AI-powered content optimization tool. Improve readability, SEO factors and engagement of your articles and blog posts."
                keywords="content optimizer, SEO content, readability checker, text improvement, writing assistant"
            />

            {/* [Include AdSense script] */}

            <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">Content Optimizer</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Enhance your content for SEO and readability</p>

                    {/* [Include control bar] */}

                    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Original Content</h2>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="w-full h-96 p-4 bg-white dark:bg-gray-800 border rounded focus:outline-none resize-none"
                                placeholder="Paste your article or blog post here"
                            />
                            <button
                                onClick={optimizeContent}
                                disabled={isOptimizing || !content.trim()}
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                            >
                                {isOptimizing ? 'Optimizing...' : 'Optimize Content'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Optimized Content</h2>
                            <div className="w-full h-96 p-4 bg-white dark:bg-gray-800 border rounded overflow-auto">
                                {optimized || 'Optimized content will appear here...'}
                            </div>
                        </div>
                    </div>

                    {/* [Include tips and AdSense sections] */}
                </div>
            </section>
        </Layout>
    );
}