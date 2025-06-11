'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    FiUpload,
    FiDownload,
    FiSettings,
    FiFile,
    FiImage,
    FiVideo,
    FiMusic,
    FiCode,
} from 'react-icons/fi';
import Script from 'next/script';
import Layout from '../../components/Layout';
import SEO from '../../components/SEOMeta';
import adsenseConfig from '../../lib/adsenseConfig';

const categories = {
    document: {
        name: 'Documents',
        icon: <FiFile />,
        conversions: [
            { from: 'pdf', to: ['docx', 'txt', 'html'] },
            { from: 'docx', to: ['pdf', 'txt', 'odt'] },
            { from: 'xlsx', to: ['csv', 'json', 'pdf'] },
        ],
    },
    image: {
        name: 'Images',
        icon: <FiImage />,
        conversions: [
            { from: 'jpg', to: ['png', 'webp', 'bmp'] },
            { from: 'png', to: ['jpg', 'webp', 'ico'] },
        ],
    },
    video: {
        name: 'Videos',
        icon: <FiVideo />,
        conversions: [
            { from: 'mp4', to: ['avi', 'mov', 'gif'] },
            { from: 'mov', to: ['mp4', 'webm'] },
        ],
    },
    audio: {
        name: 'Audio',
        icon: <FiMusic />,
        conversions: [
            { from: 'mp3', to: ['wav', 'ogg', 'flac'] },
            { from: 'wav', to: ['mp3', 'aac'] },
        ],
    },
    data: {
        name: 'Data',
        icon: <FiCode />,
        conversions: [
            { from: 'json', to: ['xml', 'csv', 'yaml'] },
            { from: 'csv', to: ['json', 'xml'] },
        ],
    },
};

function getAllAcceptTypes() {
    const accept = {};
    Object.values(categories).forEach((cat) => {
        cat.conversions.forEach((conv) => {
            accept[`.${conv.from}`] = [];
        });
    });
    return accept;
}

export default function UniversalConverter() {
    const [files, setFiles] = useState([]);
    const [outputFormat, setOutputFormat] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [results, setResults] = useState([]);
    const [category, setCategory] = useState('document');

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(acceptedFiles);
        setResults([]);
        setOutputFormat('');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: getAllAcceptTypes(),
        multiple: true,
    });

    const availableConversions = useMemo(() => {
        if (files.length === 0) return [];
        const ext = files[0].name.split('.').pop().toLowerCase();
        for (const cat of Object.values(categories)) {
            const conv = cat.conversions.find((c) => c.from === ext);
            if (conv) return conv.to;
        }
        return [];
    }, [files]);

    useEffect(() => {
        return () => {
            results.forEach((r) => URL.revokeObjectURL(r.url));
        };
    }, [results]);

    const handleConvert = async () => {
        if (!outputFormat || files.length === 0) return;

        setIsConverting(true);
        const conversionResults = [];

        for (const file of files) {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                conversionResults.push({
                    original: file.name,
                    converted: `${file.name.split('.')[0]}.${outputFormat}`,
                    size: Math.round(file.size * 0.8),
                    url: URL.createObjectURL(
                        new Blob([`Simulated conversion: ${file.name} to ${outputFormat}`])
                    ),
                });
            } catch (err) {
                console.error(`Error converting ${file.name}:`, err);
            }
        }

        setResults(conversionResults);
        setIsConverting(false);
    };

    const downloadAll = () => {
        results.forEach((result) => {
            const a = document.createElement('a');
            a.href = result.url;
            a.download = result.converted;
            a.click();
        });
    };

    return (
        <Layout>
            <SEO
                title="Universal File Converter - Convert Documents, Images, Video & More"
                description="Convert your files between various formats easily with the Universal File Converter. Supports documents, images, videos, audio, and data files."
                keywords="file converter, document converter, image converter, video converter, audio converter, universal file format conversion"
                canonical="https://yourdomain.com/tools/universal-file-converter"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="min-h-[80vh] bg-background dark:bg-gray-900 py-16">
                <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[100px_1fr_100px] gap-6">
                    {/* Left Ad */}
                    <div className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>

                    {/* Main Content */}
                    <main className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 font-sans text-gray-900 dark:text-gray-100">
                        <header className="mb-6 flex items-center gap-2 text-3xl font-semibold text-primary dark:text-white">
                            <FiSettings />
                            Universal File Converter
                        </header>
                        <p className="mb-6 text-gray-700 dark:text-gray-300 max-w-3xl">
                            Convert between many file formats easily. Supports documents, images, videos, audio, and data.
                        </p>

                        {/* Category selector */}
                        <nav className="flex flex-wrap gap-2 mb-6">
                            {Object.entries(categories).map(([key, cat]) => (
                                <button
                                    key={key}
                                    className={`px-4 py-2 rounded-md border transition ${
                                        category === key
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary/10'
                                    }`}
                                    onClick={() => {
                                        setCategory(key);
                                        setFiles([]);
                                        setOutputFormat('');
                                        setResults([]);
                                    }}
                                    aria-pressed={category === key}
                                    type="button"
                                >
                                    <span className="inline-flex items-center gap-1">{cat.icon}</span> {cat.name}
                                </button>
                            ))}
                        </nav>

                        {/* Dropzone */}
                        <section
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-md p-12 mb-6 flex flex-col items-center justify-center cursor-pointer transition ${
                                isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white dark:bg-gray-700'
                            }`}
                            aria-label="File Upload Dropzone"
                        >
                            <input {...getInputProps()} />
                            <FiUpload size={48} className="mb-4 text-primary" />
                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                                {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
                            </p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Supported formats: {categories[category].conversions.map((c) => c.from).join(', ')}
                            </p>
                        </section>

                        {/* File list & conversion options */}
                        {files.length > 0 && (
                            <section>
                                <div className="mb-4">
                                    {files.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between border-b border-gray-200 dark:border-gray-600 py-2 text-sm"
                                        >
                                            <span>{file.name}</span>
                                            <span className="text-gray-500 dark:text-gray-400">({Math.round(file.size / 1024)} KB)</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <label htmlFor="outputFormat" className="font-medium">
                                        Convert to:
                                    </label>
                                    <select
                                        id="outputFormat"
                                        value={outputFormat}
                                        onChange={(e) => setOutputFormat(e.target.value)}
                                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select format</option>
                                        {availableConversions.map((format) => (
                                            <option key={format} value={format}>
                                                {format.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleConvert}
                                    disabled={!outputFormat || isConverting}
                                    className={`px-5 py-2 rounded-md text-white font-semibold transition ${
                                        !outputFormat || isConverting
                                            ? 'bg-primary/50 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    {isConverting ? 'Converting...' : 'Convert Files'}
                                </button>
                            </section>
                        )}

                        {/* Conversion Results */}
                        {results.length > 0 && (
                            <section className="mt-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Conversion Results</h3>
                                    <button
                                        onClick={downloadAll}
                                        className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition"
                                    >
                                        <FiDownload />
                                        Download All
                                    </button>
                                </div>

                                <div className="grid gap-4">
                                    {results.map((result, idx) => (
                                        <div
                                            key={idx}
                                            className="border rounded p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700"
                                        >
                                            <div>
                                                <div className="font-medium">{result.original}</div>
                                                <div className="text-primary">{result.converted}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    ({Math.round(result.size / 1024)} KB)
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const a = document.createElement('a');
                                                    a.href = result.url;
                                                    a.download = result.converted;
                                                    a.click();
                                                }}
                                                className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition"
                                                aria-label={`Download converted file ${result.converted}`}
                                            >
                                                <FiDownload />
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    {/* Right Ad */}
                    <div className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>
                </div>
            </section>

            {/* Footer AdSense */}
            <footer className="text-center mt-10">
                <ins
                    className="adsbygoogle inline-block"
                    style={{ display: 'block', width: '100%', height: 90 }}
                    data-ad-client={adsenseConfig.client}
                    data-ad-slot={adsenseConfig.slot}
                    data-ad-format="horizontal"
                    data-full-width-responsive="true"
                />
            </footer>
        </Layout>
    );
}
