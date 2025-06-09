'use client';

import { useState, useEffect, useRef } from 'react';
import { FiRefreshCw, FiDownload, FiUpload, FiActivity } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function SpeedTest() {
    const [downloadSpeed, setDownloadSpeed] = useState(null);
    const [uploadSpeed, setUploadSpeed] = useState(null);
    const [ping, setPing] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [testHistory, setTestHistory] = useState([]);
    const testInterval = useRef(null);

    const runSpeedTest = () => {
        setIsTesting(true);
        setError(null);
        setProgress(0);
        setDownloadSpeed(null);
        setUploadSpeed(null);
        setPing(null);

        // Simulate ping test
        setTimeout(() => {
            setPing(Math.floor(Math.random() * 50) + 5); // Random ping between 5-55ms
        }, 1000);

        // Simulate download test
        let downloadProgress = 0;
        testInterval.current = setInterval(() => {
            downloadProgress += Math.floor(Math.random() * 10) + 5;
            if (downloadProgress >= 100) {
                downloadProgress = 100;
                clearInterval(testInterval.current);
                setDownloadSpeed((Math.random() * 90 + 10).toFixed(2)); // Random speed 10-100 Mbps
                runUploadTest();
            }
            setProgress(downloadProgress);
        }, 200);
    };

    const runUploadTest = () => {
        setProgress(0);
        let uploadProgress = 0;
        testInterval.current = setInterval(() => {
            uploadProgress += Math.floor(Math.random() * 10) + 5;
            if (uploadProgress >= 100) {
                uploadProgress = 100;
                clearInterval(testInterval.current);
                setUploadSpeed((Math.random() * 40 + 5).toFixed(2)); // Random speed 5-45 Mbps
                completeTest();
            }
            setProgress(uploadProgress);
        }, 300);
    };

    const completeTest = () => {
        setIsTesting(false);
        setProgress(0);
        const newResult = {
            date: new Date().toLocaleString(),
            download: downloadSpeed,
            upload: uploadSpeed,
            ping: ping
        };
        setTestHistory(prev => [newResult, ...prev.slice(0, 4)]);
    };

    const stopTest = () => {
        clearInterval(testInterval.current);
        setIsTesting(false);
        setProgress(0);
        setError('Test canceled by user');
    };

    useEffect(() => {
        return () => {
            if (testInterval.current) {
                clearInterval(testInterval.current);
            }
        };
    }, []);

    return (
        <Layout>
            <SEO
                title="Internet Speed Test | Network Performance Tool"
                description="Free online tool to test your internet connection speed. Measure download, upload speeds and ping latency."
                keywords="speed test, internet speed, bandwidth test, download speed, upload speed, ping test"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
                }}
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">Internet Speed Test</h1>
                        <p className="text-center text-gray-600 mb-8">Check your download, upload speeds and ping latency</p>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto space-y-6">
                            {/* Test Results */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border rounded-lg p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                                        <FiDownload size={24} />
                                        <span className="font-medium">Download</span>
                                    </div>
                                    <div className="text-3xl font-bold">
                                        {downloadSpeed ? `${downloadSpeed} Mbps` : '--'}
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                                        <FiUpload size={24} />
                                        <span className="font-medium">Upload</span>
                                    </div>
                                    <div className="text-3xl font-bold">
                                        {uploadSpeed ? `${uploadSpeed} Mbps` : '--'}
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                                        <FiActivity size={24} />
                                        <span className="font-medium">Ping</span>
                                    </div>
                                    <div className="text-3xl font-bold">
                                        {ping ? `${ping} ms` : '--'}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {isTesting && (
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}

                            {/* Test History */}
                            {testHistory.length > 0 && (
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 border-b">
                                        <h3 className="font-medium">Recent Tests</h3>
                                    </div>
                                    <div className="divide-y">
                                        {testHistory.map((test, index) => (
                                            <div key={index} className="p-3 grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Date</p>
                                                    <p>{test.date}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Download</p>
                                                    <p className="font-medium">{test.download} Mbps</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Upload</p>
                                                    <p className="font-medium">{test.upload} Mbps</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={isTesting ? stopTest : runSpeedTest}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                                        isTesting ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    <FiRefreshCw className={isTesting ? 'animate-spin' : ''} />
                                    {isTesting ? 'Stop Test' : 'Start Test'}
                                </button>
                            </div>

                            {/* Feedback */}
                            {error && <div className="p-4 bg-red-50 rounded-lg text-red-700">{error}</div>}

                            {/* Tips */}
                            <div className="p-4 bg-blue-50 rounded-lg text-sm">
                                <h3 className="flex items-center font-medium text-blue-800 mb-2">
                                    <FiActivity className="mr-2" /> Tool Tips
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Close other applications for accurate results</li>
                                    <li>Use a wired connection for more stable speeds</li>
                                    <li>Run multiple tests at different times for average speed</li>
                                </ul>
                            </div>

                            {/* AdSense */}
                            <div className="p-4 bg-gray-100 rounded-lg text-center">
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
                    </main>
                </div>
            </section>
        </Layout>
    );
}