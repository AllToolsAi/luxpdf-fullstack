import { useState } from 'react';
import { FiZap, FiCopy } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

const headlineTypes = [
    'List Post',
    'How-To Guide',
    'Question Headline',
    'Controversial',
    'Ultimate Guide'
];

export default function HeadlineGenerator() {
    const [topic, setTopic] = useState('');
    const [headlines, setHeadlines] = useState([]);
    const [selectedType, setSelectedType] = useState('List Post');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateHeadlines = async () => {
        if (!topic.trim()) return;

        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const generated = {
            'List Post': [
                `10 ${topic} Tips You Need to Know Today`,
                `7 ${topic} Secrets Experts Won't Tell You`,
                `5 ${topic} Mistakes You're Probably Making`
            ],
            'How-To Guide': [
                `How to ${topic}: A Step-by-Step Guide`,
                `The Complete Guide to ${topic}`,
                `${topic} Made Easy: A Beginner's Tutorial`
            ],
            'Question Headline': [
                `Is ${topic} Really Worth It?`,
                `Why Does ${topic} Matter in 2023?`,
                `Can You Really ${topic} in 5 Minutes?`
            ],
            'Controversial': [
                `Why ${topic} Is Actually Bad For You`,
                `The Dark Side of ${topic} Nobody Talks About`,
                `${topic}: Why Everything You Know Is Wrong`
            ],
            'Ultimate Guide': [
                `The Ultimate Guide to ${topic}`,
                `${topic}: Everything You Need to Know`,
                `Mastering ${topic}: The Definitive Resource`
            ]
        }[selectedType];

        setHeadlines(generated);
        setIsGenerating(false);
    };

    return (
        <Layout>
            <SEO
                title="AI Headline Generator"
                description="Create compelling headlines that drive clicks with this AI-powered headline generator."
                image="https://yourdomain.com/images/headline-generator-thumbnail.jpg"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_100px] gap-4 max-w-screen-xl mx-auto px-4">
                    {/* Left Ad */}
                    <div className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        ></ins>
                    </div>

                    {/* Main Content */}
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-6 text-center text-primary dark:text-blue-400 flex items-center justify-center space-x-2">
                            <FiZap size={32} />
                            <span>AI Headline Generator</span>
                        </h1>
                        <p className="text-center mb-8 text-gray-700 dark:text-gray-300">
                            Create compelling headlines that drive clicks
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-3xl mx-auto space-y-6">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter your topic..."
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />

                            <div className="flex flex-wrap gap-3 justify-center">
                                {headlineTypes.map(type => (
                                    <button
                                        key={type}
                                        className={`px-4 py-2 rounded-md border ${
                                            selectedType === type
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-700'
                                        }`}
                                        onClick={() => setSelectedType(type)}
                                        type="button"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={generateHeadlines}
                                disabled={isGenerating || !topic.trim()}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                {isGenerating ? 'Generating...' : <>
                                    <FiZap />
                                    <span>Generate Headlines</span>
                                </>}
                            </button>
                        </div>

                        {headlines.length > 0 && (
                            <div className="headline-results max-w-3xl mx-auto mt-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-md">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">Generated Headlines:</h3>
                                <ul className="space-y-3">
                                    {headlines.map((headline, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-md p-3 border border-gray-200 dark:border-gray-600"
                                        >
                                            <span className="text-gray-900 dark:text-gray-100">{headline}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(headline)}
                                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
                                                aria-label={`Copy headline: ${headline}`}
                                                type="button"
                                            >
                                                <FiCopy />
                                                <span>Copy</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Ad */}
                    <div className="hidden lg:block">
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
