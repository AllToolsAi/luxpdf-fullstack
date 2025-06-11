'use client';

import { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';
import { FiUpload, FiInfo, FiTrash2, FiDownload } from 'react-icons/fi';

export default function AllFileFormatter() {
    const [file, setFile] = useState(null);
    const [formatted, setFormatted] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const resetAll = () => {
        setFile(null);
        setFormatted(false);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e) => {
        setError(null);
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.size > 100 * 1024 * 1024) {
            setError('File size exceeds 100MB limit.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setFile(selectedFile);
        setFormatted(false);
    };

    const handleFormat = () => {
        if (!file) {
            setError('Please upload a file to format.');
            return;
        }

        // Simulate formatting logic
        setFormatted(true);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Layout>
            <SEO
                title="All File Formatter – Clean Up Any Document or File Online"
                description="Format and clean up any file type online for free. Improve readability, remove unwanted data, and optimize files easily."
                keywords="file formatter, document cleaner, format files, cleanup tool, beautify file, tidy code"
                canonical="https://yourdomain.com/tools/all-file-formatter"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="py-16 bg-background dark:bg-gray-900 min-h-[80vh]">
                <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_100px] max-w-screen-xl mx-auto px-4 gap-6">
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
                    <main>
                        <h1 className="text-4xl font-bold text-center text-primary dark:text-white mb-4">
                            All File Formatter
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Upload and format any supported file type to make it clean, readable, and well-structured.
                        </p>

                        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Upload File to Format
                                </label>
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all
                                        ${file
                                        ? 'border-primary dark:border-primary'
                                        : 'border-gray-300 hover:border-primary dark:border-gray-600 dark:hover:border-primary'}
                                    `}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FiUpload className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Up to 100MB</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        id="file-upload"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                {file && (
                                    <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                                        Selected file: <strong>{file.name}</strong> ({formatFileSize(file.size)})
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleFormat}
                                    disabled={!file}
                                    className={`flex-1 py-3 text-white rounded-md text-lg font-semibold transition-colors ${
                                        !file
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    Format File
                                </button>
                                <button
                                    onClick={resetAll}
                                    className="flex-1 py-3 text-primary font-semibold rounded-md border border-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <FiTrash2 className="inline mr-2 -mt-1" />
                                    Clear
                                </button>
                            </div>

                            {/* Success Message */}
                            {formatted && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 mt-4 flex justify-between items-center">
                                    <p className="font-medium">File formatted successfully!</p>
                                    <FiDownload className="w-5 h-5" />
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 mt-4">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Tips */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm mt-6">
                                <h3 className="flex items-center font-medium text-blue-800 dark:text-blue-300 mb-2">
                                    <FiInfo className="mr-2" /> Tips for Formatting Files
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                                    <li>Supported types include .txt, .json, .xml, .csv, .md, and more.</li>
                                    <li>Remove unnecessary whitespace or malformed data before upload.</li>
                                    <li>Ensure encoding is UTF-8 for best results.</li>
                                    <li>Use specific formatters for code-heavy files.</li>
                                </ul>
                            </div>
                        </div>
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
        </Layout>
    );
}
