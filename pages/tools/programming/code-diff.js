import { useState } from 'react';
import { diffLines } from 'diff';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';

export default function CodeDiff() {
    const [original, setOriginal] = useState('');
    const [modified, setModified] = useState('');
    const [diffResult, setDiffResult] = useState([]);

    const handleDiff = () => {
        const diff = diffLines(original, modified);
        setDiffResult(diff);
    };

    return (
        <Layout>
            <SEO
                title="Code Diff Tool - Compare Programming Code Online"
                description="Compare programming code online and see differences side-by-side. Highlight changes and edits easily with our free code diff checker."
                keywords="code diff, programming diff tool, compare code online, diff checker, code difference viewer"
            />

            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                crossOrigin="anonymous"
            ></Script>
            <Script id="adsense-init" strategy="afterInteractive">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-heading mb-4">Code Diff Tool</h1>
                <p className="text-muted mb-6">
                    Paste original and modified code below to view their differences side-by-side.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold text-heading mb-1">Original Code</label>
                        <textarea
                            value={original}
                            onChange={(e) => setOriginal(e.target.value)}
                            rows={25}
                            className="w-full p-4 border rounded-lg bg-white dark:bg-gray-800 text-sm dark:text-white resize-y h-[500px]"
                            placeholder="Paste original code here..."
                        ></textarea>
                    </div>
                    <div>
                        <label className="block font-semibold text-heading mb-1">Modified Code</label>
                        <textarea
                            value={modified}
                            onChange={(e) => setModified(e.target.value)}
                            rows={25}
                            className="w-full p-4 border rounded-lg bg-white dark:bg-gray-800 text-sm dark:text-white resize-y h-[500px]"
                            placeholder="Paste modified code here..."
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleDiff}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg transition"
                    >
                        View Diff
                    </button>
                </div>

                {diffResult.length > 0 && (
                    <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg overflow-x-auto">
                        <h2 className="text-xl font-bold text-heading mb-4">Diff Output</h2>
                        <pre className="whitespace-pre-wrap text-sm">
              {diffResult.map((part, index) => (
                  <span
                      key={index}
                      className={
                          part.added
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : part.removed
                                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                  : 'text-gray-800 dark:text-white'
                      }
                  >
                  {part.value}
                </span>
              ))}
            </pre>
                    </div>
                )}

                {/* AdSense */}
                <div className="mt-10">
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                        data-ad-slot="xxxxxxxxxx"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    ></ins>
                </div>
            </div>
        </Layout>
    );
}
