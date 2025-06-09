import { useState } from 'react';
import { FiMail, FiCopy, FiRefreshCw } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

const emailTypes = [
    'Professional',
    'Follow-up',
    'Networking',
    'Sales Pitch',
    'Apology'
];

export default function EmailAssistant() {
    const [purpose, setPurpose] = useState('');
    const [details, setDetails] = useState('');
    const [tone, setTone] = useState('professional');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateEmail = async () => {
        if (!purpose.trim()) return;

        setIsGenerating(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const templates = {
            professional: `Subject: Regarding ${purpose}\n\nDear [Recipient's Name],\n\n${details || `I'm writing to you about ${purpose}.`}\n\nBest regards,\n[Your Name]`,
            followup: `Subject: Following Up on ${purpose}\n\nHi [Name],\n\n${details || `I wanted to follow up regarding ${purpose}.`}\n\nLooking forward to your response.\n\nBest,\n[Your Name]`,
            networking: `Subject: ${purpose} - Let's Connect\n\nHello [Name],\n\n${details || `I came across your profile and wanted to connect about ${purpose}.`}\n\nWould love to chat when you have time.\n\nRegards,\n[Your Name]`,
            sales: `Subject: How [Company] Can Help With ${purpose}\n\nHi [Name],\n\n${details || `I believe our solution could help you with ${purpose}.`}\n\nLet me know if you'd like to discuss further.\n\nBest,\n[Your Name]`,
            apology: `Subject: My Apologies Regarding ${purpose}\n\nDear [Name],\n\n${details || `I sincerely apologize for ${purpose}.`}\n\nPlease let me know how I can make it right.\n\nRegards,\n[Your Name]`
        };

        setGeneratedEmail(templates[tone]);
        setIsGenerating(false);
    };

    return (
        <Layout>
            <SEO
                title="AI Email Assistant"
                description="Generate professional emails instantly with our AI Email Assistant. Save time and get perfect email drafts for every occasion."
                image="https://yourdomain.com/images/email-assistant-thumbnail.jpg"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: '(adsbygoogle = window.adsbygoogle || []).push({});',
                }}
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
                            <FiMail size={32} />
                            <span>AI Email Assistant</span>
                        </h1>
                        <p className="text-center mb-8 text-gray-700 dark:text-gray-300">
                            Generate professional emails in seconds
                        </p>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-3xl mx-auto">
                            <div className="space-y-6">
                                <div>
                                    <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Email Purpose</label>
                                    <input
                                        type="text"
                                        value={purpose}
                                        onChange={(e) => setPurpose(e.target.value)}
                                        placeholder="e.g., job application, meeting request"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Key Details</label>
                                    <textarea
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        placeholder="Add specific details to include..."
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Tone</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    >
                                        {emailTypes.map(type => (
                                            <option key={type.toLowerCase()} value={type.toLowerCase()}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={generateEmail}
                                    disabled={isGenerating || !purpose.trim()}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isGenerating ? 'Generating...' : <>
                                        <FiRefreshCw />
                                        <span>Generate Email</span>
                                    </>}
                                </button>
                            </div>
                        </div>

                        {generatedEmail && (
                            <div className="email-output max-w-3xl mx-auto mt-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-md">
                                <div className="output-header flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Generated Email</h3>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(generatedEmail)}
                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
                                        title="Copy Email"
                                    >
                                        <FiCopy />
                                        <span>Copy Email</span>
                                    </button>
                                </div>
                                <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{generatedEmail}</pre>
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
