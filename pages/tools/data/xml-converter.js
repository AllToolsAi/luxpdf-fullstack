'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiSun, FiMoon, FiMaximize2, FiMinimize2, FiRefreshCw, FiUpload, FiDownload } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import xml2js from 'xml2js';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

const conversionOptions = [
    { value: 'json', label: 'XML to JSON' },
    { value: 'csv', label: 'XML to CSV' },
];

export default function XMLConverter() {
    const [input, setInput] = useState(
        `<?xml version="1.0"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
  </book>
</catalog>`
    );
    const [output, setOutput] = useState('');
    const [conversionType, setConversionType] = useState('json');
    const [darkMode, setDarkMode] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const containerRef = useRef(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'text/xml': ['.xml'],
            'application/xml': ['.xml']
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = e => setInput(e.target.result);
            reader.readAsText(file);
            setError('');
        },
        onDropRejected: () => {
            setError('Please upload a valid XML file');
        }
    });

    useEffect(() => {
        const onFull = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFull);
        return () => document.removeEventListener('fullscreenchange', onFull);
    }, []);

    const handleConvert = async () => {
        setError('');
        setIsConverting(true);
        setOutput('');

        try {
            if (conversionType === 'json') {
                const result = await xml2js.parseStringPromise(input);
                setOutput(JSON.stringify(result, null, 2));
            } else if (conversionType === 'csv') {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(input, 'text/xml');

                // Find all unique element names
                const elements = Array.from(xmlDoc.querySelectorAll('*'));
                const elementNames = [...new Set(elements.map(el => el.nodeName))];

                // Create CSV header
                const headers = elementNames.join(',');

                // Extract data for each record (assuming each record is a direct child of root)
                const records = Array.from(xmlDoc.documentElement.children);
                const csvRows = records.map(record => {
                    return elementNames.map(name => {
                        const element = record.querySelector(name);
                        return element ? `"${element.textContent.replace(/"/g, '""')}"` : '';
                    }).join(',');
                });

                setOutput([headers, ...csvRows].join('\n'));
            }
        } catch (err) {
            setError(`Conversion failed: ${err.message}`);
        } finally {
            setIsConverting(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setError('Copied to clipboard!');
            setTimeout(() => setError(''), 2000);
        } catch (err) {
            setError('Failed to copy');
        }
    };

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: conversionType === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${conversionType}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setInput(`<?xml version="1.0"?>\n<root>\n  <example>Paste your XML here</example>\n</root>`);
        setOutput('');
        setError('');
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.()
                .catch(err => setError('Fullscreen error: ' + err.message));
        } else {
            document.exitFullscreen?.()
                .catch(err => setError('Fullscreen error: ' + err.message));
        }
    };

    return (
        <Layout>
            <SEO
                title="XML Converter | Convert to JSON, CSV"
                description="Powerful XML conversion tool. Convert XML to JSON or CSV formats instantly with syntax highlighting."
                keywords="xml converter, xml to json, xml to csv, online xml tool, data conversion"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
            />

            <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">XML Converter</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Convert XML to JSON or CSV formats</p>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <select
                            value={conversionType}
                            onChange={e => setConversionType(e.target.value)}
                            className="px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                        >
                            {conversionOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="px-3 py-1 border rounded dark:border-gray-700 dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {darkMode ? <FiSun size={18}/> : <FiMoon size={18}/>}
                            </button>
                            <button
                                onClick={handleCopy}
                                disabled={!output}
                                className="px-4 py-1 bg-blue-100 dark:bg-blue-700 rounded flex items-center gap-2 disabled:opacity-50"
                            >
                                <FiCopy /> Copy
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={!output}
                                className="px-4 py-1 bg-green-100 dark:bg-green-700 rounded flex items-center gap-2 disabled:opacity-50"
                            >
                                <FiDownload /> Download
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-1 bg-red-100 dark:bg-red-700 rounded flex items-center gap-2"
                            >
                                <FiRefreshCw /> Reset
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center gap-2"
                            >
                                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={`p-3 rounded ${error.includes('Failed') ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
                            {error}
                        </div>
                    )}

                    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Input XML</h2>
                            <div
                                {...getRootProps()}
                                className={`p-4 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center justify-center gap-2 text-center">
                                    <FiUpload className="text-2xl" />
                                    <p>{isDragActive ? 'Drop the XML file here' : 'Drag & drop XML file, or click to select'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Supports .xml files</p>
                                </div>
                            </div>
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="w-full h-[40rem] p-4 font-mono text-lg bg-white dark:bg-gray-800 border rounded focus:outline-none resize-none"
                                spellCheck="false"
                                placeholder="Or paste your XML here..."
                            />

                            <pre className="w-full h-[40rem] p-4 font-mono text-lg bg-white dark:bg-gray-800 border rounded overflow-auto">
    {output || 'Converted output will appear here...'}
</pre>
                            <button
                                onClick={handleConvert}
                                disabled={isConverting || !input.trim()}
                                className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 ${(isConverting || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isConverting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Converting...
                                    </>
                                ) : 'Convert'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Output {conversionType.toUpperCase()}</h2>
                            <pre className="w-full h-[40rem] p-4 font-mono text-lg bg-white dark:bg-gray-800 border rounded overflow-auto">
    {output || 'Converted output will appear here...'}
</pre>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded text-sm">
                        <strong>Tips:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Paste XML or upload a .xml file to convert</li>
                            <li>CSV output works best with structured XML data</li>
                            <li>Invalid XML will show conversion errors</li>
                            <li>Use fullscreen mode for larger XML editing</li>
                        </ul>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-center">
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
            </section>
        </Layout>
    );
}