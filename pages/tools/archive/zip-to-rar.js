import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function ZipToRar() {
    const [file, setFile] = useState(null);
    const [compression, setCompression] = useState('normal');
    const [error, setError] = useState(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles, rejectedFiles) => {
            setError(null);
            if (rejectedFiles.length > 0) {
                setError('Only ZIP files are accepted.');
                return;
            }
            if (acceptedFiles.length > 0 && acceptedFiles[0].name.toLowerCase().endsWith('.zip')) {
                setFile(acceptedFiles[0]);
            } else {
                setError('Please upload a valid ZIP file.');
            }
        },
        accept: { 'application/zip': ['.zip'] },
        maxFiles: 1,
    });

    const convertToRar = async () => {
        if (!file) return;
        alert(`Converting ${file.name} to RAR with ${compression} compression`);
        // Replace with real conversion logic
    };

    return (
        <Layout>
            <SEO
                title="ZIP to RAR Converter"
                description="Convert your ZIP files to RAR format easily with adjustable compression levels. Fast and simple online tool."
                image="https://yourdomain.com/images/zip-to-rar-thumbnail.png"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
                <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[120px_1fr_120px] gap-8">
                    {/* Left Ad */}
                    <aside className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                            aria-label="Advertisement"
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col space-y-8">
                        <h1 className="text-4xl font-bold text-primary dark:text-blue-400">ZIP to RAR Converter</h1>

                        <div
                            {...getRootProps()}
                            className={`border-4 border-dashed rounded-lg p-12 cursor-pointer transition 
                ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-700'}
                text-center text-gray-500 dark:text-gray-400`}
                            aria-label="File upload dropzone"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.preventDefault(); }}
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Selected: {file.name}</p>
                            ) : (
                                <p className="text-lg">Drag & drop a ZIP file here, or click to select</p>
                            )}
                        </div>

                        {error && (
                            <p className="text-red-500 font-semibold">{error}</p>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label htmlFor="compression" className="font-semibold min-w-[150px]">
                                Compression Level:
                            </label>
                            <select
                                id="compression"
                                value={compression}
                                onChange={(e) => setCompression(e.target.value)}
                                className="rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="store">Store</option>
                                <option value="fast">Fast</option>
                                <option value="normal">Normal</option>
                                <option value="maximum">Maximum</option>
                            </select>
                        </div>

                        <button
                            onClick={convertToRar}
                            disabled={!file}
                            className={`w-full max-w-xs py-3 rounded-full font-semibold transition
                ${file ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                            aria-disabled={!file}
                            aria-label="Convert ZIP file to RAR"
                            type="button"
                        >
                            Convert to RAR
                        </button>
                    </main>

                    {/* Right Ad */}
                    <aside className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                            aria-label="Advertisement"
                        />
                    </aside>
                </div>
            </section>
        </Layout>
    );
}
