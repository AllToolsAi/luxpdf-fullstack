import { useState, useRef, useEffect } from 'react';
import { FiSettings, FiDownload } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function CustomConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [conversionRules, setConversionRules] = useState({
        find: '',
        replace: '',
        caseSensitive: false,
    });
    const [isConverting, setIsConverting] = useState(false);
    const outputRef = useRef(null);

    useEffect(() => {
        if (output && outputRef.current) {
            outputRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [output]);

    const handleConversion = () => {
        if (!conversionRules.find) return;
        setIsConverting(true);

        setTimeout(() => {
            const flags = conversionRules.caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(conversionRules.find, flags);
            const result = input.replace(regex, conversionRules.replace);
            setOutput(result);
            setIsConverting(false);
        }, 300); // simulate async
    };

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Layout>
            <SEO
                pageContent={{
                    title: 'Custom Text Converter - Find & Replace Tool',
                    description:
                        'Custom text converter that allows you to find and replace text with options for case sensitivity.',
                    keywords: 'custom converter, text converter, find replace, case sensitive replace',
                    url: '/tools/custom-converter',
                }}
                url="/tools/custom-converter"
                customTitle="Custom Text Converter | Find and Replace Tool"
            />

            {/* Adsense Left */}
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.client}`}
                crossOrigin="anonymous"
            />
            <aside className="hidden lg:block fixed left-4 top-24 w-60">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '250px', height: '600px' }}
                    data-ad-client={adsenseConfig.client}
                    data-ad-slot="left-ad-slot"
                    data-ad-format="vertical"
                />
            </aside>

            {/* Adsense Right */}
            <aside className="hidden lg:block fixed right-4 top-24 w-60">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '250px', height: '600px' }}
                    data-ad-client={adsenseConfig.client}
                    data-ad-slot="right-ad-slot"
                    data-ad-format="vertical"
                />
            </aside>

            <main className="max-w-4xl mx-auto px-4 lg:px-0 mt-20 mb-24">
                <h1 className="flex items-center text-3xl font-semibold space-x-2 mb-6 text-gray-900 dark:text-gray-100">
                    <FiSettings className="text-blue-600" /> <span>Custom Converter</span>
                </h1>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleConversion();
                        }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <fieldset className="space-y-4 p-6 border rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <legend className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Conversion Rules
                            </legend>

                            <div>
                                <label htmlFor="find" className="block text-gray-700 dark:text-gray-300 mb-1">
                                    Find:
                                </label>
                                <input
                                    id="find"
                                    type="text"
                                    className="input-field"
                                    value={conversionRules.find}
                                    onChange={e =>
                                        setConversionRules({ ...conversionRules, find: e.target.value })
                                    }
                                    placeholder="Text or regex pattern"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="replace" className="block text-gray-700 dark:text-gray-300 mb-1">
                                    Replace With:
                                </label>
                                <input
                                    id="replace"
                                    type="text"
                                    className="input-field"
                                    value={conversionRules.replace}
                                    onChange={e =>
                                        setConversionRules({ ...conversionRules, replace: e.target.value })
                                    }
                                    placeholder="Replacement text"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="caseSensitive"
                                    type="checkbox"
                                    checked={conversionRules.caseSensitive}
                                    onChange={e =>
                                        setConversionRules({ ...conversionRules, caseSensitive: e.target.checked })
                                    }
                                    className="checkbox"
                                />
                                <label htmlFor="caseSensitive" className="text-gray-700 dark:text-gray-300 select-none">
                                    Case Sensitive
                                </label>
                            </div>
                        </fieldset>

                        <fieldset className="space-y-2">
                            <label htmlFor="inputText" className="block text-gray-700 dark:text-gray-300 font-semibold">
                                Input Text
                            </label>
                            <textarea
                                id="inputText"
                                rows={8}
                                className="textarea"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Paste your text here"
                                required
                            />
                        </fieldset>

                        <button
                            type="submit"
                            disabled={isConverting || !input || !conversionRules.find}
                            className={`btn-primary w-full flex justify-center items-center space-x-2 ${
                                isConverting ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                            aria-busy={isConverting}
                        >
                            {isConverting ? (
                                <>
                                    <span>Converting...</span>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white ml-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                </>
                            ) : (
                                'Convert'
                            )}
                        </button>
                    </form>

                    <section
                        ref={outputRef}
                        aria-live="polite"
                        className="space-y-4 p-6 border rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                    >
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Converted Output</h2>
                        <textarea
                            rows={12}
                            className="textarea resize-none"
                            value={output}
                            readOnly
                            placeholder="Converted text will appear here"
                            aria-label="Converted output"
                        />
                        {output && (
                            <button
                                onClick={handleDownload}
                                className="btn-primary inline-flex items-center space-x-2"
                            >
                                <FiDownload />
                                <span>Download Converted Text</span>
                            </button>
                        )}
                    </section>
                </section>
            </main>
        </Layout>
    );
}
