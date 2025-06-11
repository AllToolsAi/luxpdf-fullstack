'use client';

import { useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';
import { FiUpload, FiDownload, FiInfo, FiTrash2 } from 'react-icons/fi';

export default function AudioConverter() {
    const [file, setFile] = useState(null);
    const [format, setFormat] = useState('mp3');
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const resetAll = () => {
        setFile(null);
        setFormat('mp3');
        setIsConverting(false);
        setProgress(0);
        setSuccess(false);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        setError(null);
        setSuccess(false);
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('audio/')) {
            setError('Only audio files are supported.');
            return;
        }

        if (selectedFile.size > 50 * 1024 * 1024) {
            setError('File size exceeds 50MB limit.');
            return;
        }

        setFile(selectedFile);
    };

    const convertAudio = async () => {
        if (!file) return;

        setIsConverting(true);
        setProgress(0);
        setSuccess(false);
        setError(null);

        try {
            // Simulated conversion progress
            let p = 0;
            const interval = setInterval(() => {
                p += 10;
                setProgress(p);
                if (p >= 100) clearInterval(interval);
            }, 200);

            await new Promise((res) => setTimeout(res, 2000));

            // Simulate download
            const blob = new Blob(['dummy audio'], { type: 'audio/' + format });
            const fileName = file.name.replace(/\.[^/.]+$/, '') + '_converted.' + format;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Conversion failed. Please try again.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <Layout>
            <SEO
                title="Audio Converter – Convert Audio Files Online for Free"
                description="Convert audio files online to MP3, WAV, OGG, and more. Fast, free, and easy audio file conversion without login."
                keywords="audio converter, convert audio files, mp3 converter, wav converter, online audio conversion"
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
                            Audio Converter
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Convert audio files to MP3, WAV, OGG, and more. No login or watermark.
                        </p>

                        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            {/* Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Upload an Audio File
                                </label>
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                                        isConverting
                                            ? 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 cursor-not-allowed'
                                            : 'border-gray-300 hover:border-primary dark:border-gray-600 dark:hover:border-primary'
                                    }`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FiUpload className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag & drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Max 50MB, formats: MP3, WAV, OGG, etc.</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        id="file-upload"
                                        type="file"
                                        accept="audio/*"
                                        onChange={handleFileChange}
                                        disabled={isConverting}
                                        className="hidden"
                                    />
                                </label>
                                {file && (
                                    <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                                        Selected file: <strong>{file.name}</strong>
                                    </p>
                                )}
                            </div>

                            {/* Format Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Choose Output Format</label>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    disabled={isConverting}
                                    className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="mp3">MP3</option>
                                    <option value="wav">WAV</option>
                                    <option value="ogg">OGG</option>
                                    <option value="aac">AAC</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={convertAudio}
                                    disabled={!file || isConverting}
                                    className={`flex-1 py-3 text-white rounded-md text-lg font-semibold transition-colors ${
                                        !file || isConverting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    {isConverting ? 'Converting...' : 'Convert Audio'}
                                </button>
                                <button
                                    onClick={resetAll}
                                    disabled={isConverting}
                                    className="flex-1 py-3 text-primary font-semibold rounded-md border border-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <FiTrash2 className="inline mr-2 -mt-1" />
                                    Clear
                                </button>
                            </div>

                            {/* Progress */}
                            {isConverting && (
                                <div className="space-y-2 mt-4">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Converting... {progress}%</p>
                                </div>
                            )}

                            {/* Success */}
                            {success && !isConverting && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 mt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">Conversion complete!</p>
                                            <p className="text-sm">Your audio file was successfully converted to {format.toUpperCase()}.</p>
                                        </div>
                                        <FiDownload className="w-5 h-5" />
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 mt-4">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Tips */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm mt-6">
                                <h3 className="flex items-center font-medium text-blue-800 dark:text-blue-300 mb-2">
                                    <FiInfo className="mr-2" /> Tips for Audio Conversion
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                                    <li>Only standard audio formats are supported.</li>
                                    <li>For high-quality conversion, use lossless formats like WAV.</li>
                                    <li>Compression (e.g., MP3) may reduce file size but also quality.</li>
                                    <li>Make sure the file is not encrypted or DRM-protected.</li>
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
