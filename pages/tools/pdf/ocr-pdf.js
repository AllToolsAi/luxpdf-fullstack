'use client';

import { useState, useRef } from 'react';
import { FiDownload, FiTrash2, FiImage, FiInfo } from 'react-icons/fi';
import Tesseract from 'tesseract.js';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import adsenseConfig from "../../../lib/adsenseConfig";


export default function OCRPDF() {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTesseractLoading, setIsTesseractLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [language, setLanguage] = useState('eng');
    const [ocrResult, setOcrResult] = useState('');
    const fileInputRef = useRef(null);

    const resetAll = () => {
        setFile(null);
        setIsProcessing(false);
        setIsTesseractLoading(false);
        setProgress(0);
        setError(null);
        setSuccess(false);
        setOcrResult('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const processOCR = async () => {
        if (!file || !language) {
            let missing = [];
            if (!file) missing.push('File');
            if (!language) missing.push('Language');
            setError(`Please select: ${missing.join(', ')}`);
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setSuccess(false);

        try {
            const { data } = await Tesseract.recognize(file, language, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                },
            });

            setOcrResult(data.text);
            setProgress(100);
            setSuccess(true);
        } catch (err) {
            console.error('OCR error:', err);
            setError('OCR processing failed. The file may be corrupted or unsupported.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileChange = (e) => {
        setError(null);
        setSuccess(false);
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file extension for images
        const validExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp'];
        const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExt)) {
            setError('Supported formats: JPG, PNG, TIFF, BMP, WEBP');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (selectedFile.size > 50 * 1024 * 1024) {
            setError('File size exceeds 50MB limit.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setFile(selectedFile);
    };

    const downloadResult = () => {
        if (!ocrResult) return;

        const blob = new Blob([ocrResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file ? `${file.name.split('.')[0]}-extracted.txt` : 'extracted-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Layout>
            <SEO
                title="OCR Tool - Extract Text from Images"
                description="Extract text from images using optical character recognition (OCR) technology"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">OCR Text Extraction</h1>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            {/* Language Selection */}
                            <div>
                                <label className="font-medium">Language</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    {[
                                        { code: 'eng', name: 'English' },
                                        { code: 'spa', name: 'Spanish' },
                                        { code: 'fra', name: 'French' },
                                        { code: 'deu', name: 'German' },
                                        { code: 'por', name: 'Portuguese' },
                                        { code: 'chi_sim', name: 'Chinese' },
                                        { code: 'jpn', name: 'Japanese' },
                                        { code: 'rus', name: 'Russian' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setLanguage(lang.code)}
                                            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                                language === lang.code
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                            disabled={isProcessing}
                                            title={lang.name}
                                        >
                                            {lang.code.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="font-medium block mb-1">Upload Image</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isProcessing}
                                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold ${
                                            isProcessing
                                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                                : 'bg-primary hover:bg-primary-dark text-white'
                                        }`}
                                    >
                                        <FiImage className="w-5 h-5" />
                                        Choose File
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        disabled={isProcessing}
                                        accept=".jpg,.jpeg,.png,.tiff,.bmp,.webp"
                                        className="hidden"
                                    />
                                    {file && (
                                        <div className="flex-1 truncate">
                                            <p className="text-sm text-gray-700 truncate">
                                                {file.name} ({Math.round(file.size / 1024)} KB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={processOCR}
                                    disabled={!file || isProcessing}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
                                        !file || isProcessing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    {isTesseractLoading ? 'Loading Engine...' :
                                        isProcessing ? `Processing... ${progress}%` : 'Extract Text'}
                                </button>
                                <button
                                    onClick={resetAll}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 text-primary font-semibold rounded-md border border-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <FiTrash2 className="inline mr-2 -mt-1" />
                                    Clear
                                </button>
                            </div>

                            {/* Progress Bar */}
                            {isProcessing && (
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Results */}
                            {success && !isProcessing && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-green-800">Text extracted successfully!</p>
                                                <p className="text-sm text-green-700 mt-1">
                                                    {ocrResult.split(/\s+/).filter(Boolean).length} words extracted
                                                </p>
                                            </div>
                                            <button
                                                onClick={downloadResult}
                                                className="p-2 bg-green-100 hover:bg-green-200 rounded-full text-green-800 transition-colors"
                                                title="Download extracted text"
                                            >
                                                <FiDownload className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-4 max-h-96 overflow-auto bg-gray-50">
                                        <pre className="text-sm whitespace-pre-wrap font-sans">{ocrResult}</pre>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 rounded-lg text-red-700">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Tips */}
                            <div className="p-4 bg-blue-50 rounded-lg text-sm">
                                <h3 className="flex items-center font-medium text-blue-800 mb-2">
                                    <FiInfo className="mr-2" /> Tips for Best Results
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Use clear, high-contrast images (300+ DPI recommended)</li>
                                    <li>Select the correct document language for better accuracy</li>
                                    <li>For multi-page documents, process each page separately</li>
                                    <li>Straighten skewed images before uploading</li>
                                    <li>Results may vary based on font type and image quality</li>
                                </ul>
                            </div>
                        </div>
                        {/* AdSense Placeholder */}
                        <div className="max-w-screen-xl mx-auto px-4 mt-10">
                            <ins
                                className="adsbygoogle"
                                style={{ display: 'block' }}
                                data-ad-client={adsenseConfig.client}
                                data-ad-slot={adsenseConfig.slot}
                                data-ad-format="auto"
                                data-full-width-responsive="true"
                            ></ins>
                        </div>
                    </main>
                </div>
            </section>
        </Layout>
    );
}