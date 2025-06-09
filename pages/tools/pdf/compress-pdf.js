'use client';

import { useState, useCallback, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';
import { FiUpload, FiDownload, FiInfo, FiTrash2 } from 'react-icons/fi';

export default function CompressPDF() {
    const [file, setFile] = useState(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [compressionLevel, setCompressionLevel] = useState('');
    const fileInputRef = useRef(null);

    const resetAll = () => {
        setFile(null);
        setIsCompressing(false);
        setProgress(0);
        setError(null);
        setSuccess(false);
        setOriginalSize(0);
        setCompressedSize(0);
        setCompressionLevel('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const compressPDF = useCallback(async () => {
        if (!file) {
            setError('Please upload a PDF file first.');
            return;
        }
        if (!compressionLevel) {
            setError('Please select a compression level.');
            return;
        }

        setIsCompressing(true);
        setProgress(0);
        setError(null);
        setSuccess(false);
        setOriginalSize(file.size);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const newPdf = await PDFDocument.create();

            setProgress(10);

            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                newPdf.addPage(copiedPage);
                setProgress(10 + ((i + 1) / pages.length) * 60);
            }

            setProgress(80);

            const compressionOptions = {
                useObjectStreams: true,
                useCompression: true,
            };

            const compressedPdfBytes = await newPdf.save(compressionOptions);
            setCompressedSize(compressedPdfBytes.byteLength);

            setProgress(100);

            if (compressionLevel === 'high') {
                const watermarkedPdf = await PDFDocument.load(compressedPdfBytes);
                const pages = watermarkedPdf.getPages();
                pages.forEach((page) => {
                    page.drawText('Compressed PDF', {
                        x: 50,
                        y: 50,
                        size: 10,
                        color: rgb(0.7, 0.7, 0.7),
                        opacity: 0.5,
                    });
                });
                const finalBytes = await watermarkedPdf.save();
                saveAs(new Blob([finalBytes], { type: 'application/pdf' }), `${file.name.replace(/\.[^/.]+$/, '')}_compressed.pdf`);
            } else {
                saveAs(new Blob([compressedPdfBytes], { type: 'application/pdf' }), `${file.name.replace(/\.[^/.]+$/, '')}_compressed.pdf`);
            }

            setSuccess(true);
        } catch (err) {
            console.error('Compression error:', err);
            setError('Compression failed. The PDF may be password protected or corrupted.');
        } finally {
            setIsCompressing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [compressionLevel, file]);

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
        setCompressedSize(0);
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
                title="Compress PDF – Reduce PDF File Size Online"
                description="Easily reduce the size of your PDF files online for free. Choose compression level and get optimized PDFs instantly."
                keywords="compress pdf, reduce pdf size, pdf compressor, online pdf compress, shrink pdf"
                canonical="https://yourdomain.com/tools/compress-pdf"
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
                            Compress PDF Files
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Reduce PDF file size while maintaining quality. Perfect for email attachments and web uploads.
                        </p>

                        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            {/* Compression Level Selector */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Compression Level <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    {['low', 'medium', 'high'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setCompressionLevel(level)}
                                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                        ${
                                                compressionLevel === level
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }
                      `}
                                            disabled={isCompressing}
                                        >
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {compressionLevel === 'low' && 'Best quality, smaller size reduction'}
                                    {compressionLevel === 'medium' && 'Balanced quality and compression'}
                                    {compressionLevel === 'high' && 'Maximum compression, visible quality reduction'}
                                    {!compressionLevel && <span className="text-red-500">Please select a compression level</span>}
                                </p>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Upload PDF File
                                </label>
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all
                    ${
                                        isCompressing
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
                                        disabled={isCompressing}
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
                                    onClick={compressPDF}
                                    disabled={!file || !compressionLevel || isCompressing}
                                    className={`flex-1 py-3 text-white rounded-md text-lg font-semibold transition-colors ${
                                        !file || !compressionLevel || isCompressing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    {isCompressing ? 'Compressing...' : 'Compress PDF'}
                                </button>
                                <button
                                    onClick={resetAll}
                                    disabled={isCompressing && true}
                                    className="flex-1 py-3 text-primary font-semibold rounded-md border border-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <FiTrash2 className="inline mr-2 -mt-1" />
                                    Clear
                                </button>
                            </div>

                            {/* Progress and Results */}
                            {isCompressing && (
                                <div className="space-y-2 mt-4">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Compressing... {Math.round(progress)}%</span>
                                        <span>
                      {formatFileSize(originalSize)} → {compressedSize ? formatFileSize(compressedSize) : '...'}
                    </span>
                                    </div>
                                </div>
                            )}

                            {/* Results */}
                            {success && !isCompressing && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 mt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">Compression successful!</p>
                                            <p className="text-sm">
                                                Reduced from {formatFileSize(originalSize)} to {formatFileSize(compressedSize)} (
                                                {compressedSize <= originalSize
                                                    ? `${Math.round((1 - compressedSize / originalSize) * 100)}% reduction`
                                                    : `increased by ${Math.round(((compressedSize / originalSize - 1) * 100))}%`}
                                                )
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

                            {/* Compression Tips */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm mt-6">
                                <h3 className="flex items-center font-medium text-blue-800 dark:text-blue-300 mb-2">
                                    <FiInfo className="mr-2" /> Tips for Better Compression
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                                    <li>For documents with text only, use "High" compression</li>
                                    <li>For PDFs with images, try different levels to balance quality and size</li>
                                    <li>Scanned documents benefit most from compression</li>
                                    <li>Remove unnecessary pages before compressing</li>
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
