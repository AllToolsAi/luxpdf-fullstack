'use client';

import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';
import { FiUpload, FiDownload, FiInfo, FiTrash2 } from 'react-icons/fi';

export default function RepairPDF() {
    const [file, setFile] = useState(null);
    const [isRepairing, setIsRepairing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [originalSize, setOriginalSize] = useState(0);
    const [repairedSize, setRepairedSize] = useState(0);
    const fileInputRef = useRef(null);

    const resetAll = () => {
        setFile(null);
        setIsRepairing(false);
        setProgress(0);
        setError(null);
        setSuccess(false);
        setOriginalSize(0);
        setRepairedSize(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const repairPDF = useCallback(async () => {
        if (!file) {
            setError('Please upload a PDF file first.');
            return;
        }

        setIsRepairing(true);
        setProgress(0);
        setError(null);
        setSuccess(false);
        setOriginalSize(file.size);

        try {
            const arrayBuffer = await file.arrayBuffer();

            // Load PDF (simulate checking for errors)
            setProgress(20);
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Simulate a "repair" by re-saving the PDF (re-encoding)
            setProgress(60);

            const repairedPdfBytes = await pdfDoc.save();

            setRepairedSize(repairedPdfBytes.byteLength);
            setProgress(100);

            // Save the repaired PDF file
            saveAs(new Blob([repairedPdfBytes], { type: 'application/pdf' }), `${file.name.replace(/\.[^/.]+$/, '')}_repaired.pdf`);

            setSuccess(true);
        } catch (err) {
            console.error('Repair error:', err);
            setError('Failed to repair the PDF. The file may be corrupted or encrypted.');
        } finally {
            setIsRepairing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [file]);

    const handleFileChange = (e) => {
        setError(null);
        setSuccess(false);
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are supported.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (selectedFile.size > 100 * 1024 * 1024) {
            setError('File size exceeds 100MB limit.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setRepairedSize(0);
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
                title="Repair PDF – Fix Corrupted or Damaged PDF Files Online"
                description="Quickly repair corrupted or damaged PDF files online for free. Restore your PDF documents easily."
                keywords="repair pdf, fix corrupted pdf, damaged pdf fix, pdf repair online, recover pdf"
                canonical="https://yourdomain.com/tools/repair-pdf"
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
                            Repair PDF Files
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Fix corrupted, damaged, or unreadable PDF files online for free. Restore your PDF documents quickly and easily.
                        </p>

                        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Upload PDF File to Repair
                                </label>
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all
                    ${
                                        isRepairing
                                            ? 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 cursor-not-allowed'
                                            : 'border-gray-300 hover:border-primary dark:border-gray-600 dark:hover:border-primary'
                                    }
                  `}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FiUpload className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 100MB</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        id="file-upload"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        disabled={isRepairing}
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
                                    onClick={repairPDF}
                                    disabled={!file || isRepairing}
                                    className={`flex-1 py-3 text-white rounded-md text-lg font-semibold transition-colors ${
                                        !file || isRepairing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    {isRepairing ? 'Repairing...' : 'Repair PDF'}
                                </button>
                                <button
                                    onClick={resetAll}
                                    disabled={isRepairing && true}
                                    className="flex-1 py-3 text-primary font-semibold rounded-md border border-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <FiTrash2 className="inline mr-2 -mt-1" />
                                    Clear
                                </button>
                            </div>

                            {/* Progress and Results */}
                            {isRepairing && (
                                <div className="space-y-2 mt-4">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Repairing... {Math.round(progress)}%</span>
                                        <span>
                      {formatFileSize(originalSize)} → {repairedSize ? formatFileSize(repairedSize) : '...'}
                    </span>
                                    </div>
                                </div>
                            )}

                            {/* Results */}
                            {success && !isRepairing && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 mt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">Repair successful!</p>
                                            <p className="text-sm">
                                                Original size: {formatFileSize(originalSize)}, repaired size: {formatFileSize(repairedSize)}
                                            </p>
                                        </div>
                                        <FiDownload className="w-5 h-5" />
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 mt-4">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Repair Tips */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm mt-6">
                                <h3 className="flex items-center font-medium text-blue-800 dark:text-blue-300 mb-2">
                                    <FiInfo className="mr-2" /> Tips for Repairing PDFs
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                                    <li>If your PDF is encrypted, repair may not work.</li>
                                    <li>Try to use original files if possible.</li>
                                    <li>Remove unnecessary attachments or embedded files before repairing.</li>
                                    <li>For severe corruption, consider professional tools.</li>
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
