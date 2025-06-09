'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiSun, FiMoon, FiMaximize2, FiMinimize2, FiRefreshCw, FiUpload, FiDownload } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

const conversionOptions = [
    { value: 'csv', label: 'JSON to CSV' },
    { value: 'xml', label: 'JSON to XML' },
    { value: 'yaml', label: 'JSON to YAML' },
];

export default function JSONConverter() {
    const [input, setInput] = useState(
        `{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "Anytown"
  },
  "hobbies": ["reading", "hiking"]
}`
    );
    const [output, setOutput] = useState('');
    const [conversionType, setConversionType] = useState('csv');
    const [darkMode, setDarkMode] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const containerRef = useRef(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/json': ['.json'],
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
            setError('Please upload a valid JSON file');
        }
    });

    useEffect(() => {
        const onFull = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFull);
        return () => document.removeEventListener('fullscreenchange', onFull);
    }, []);

    const convertJSON = () => {
        setIsConverting(true);
        setError('');

        try {
            const data = JSON.parse(input);
            let result = '';

            switch (conversionType) {
                case 'csv':
                    result = convertToCSV(data);
                    break;
                case 'xml':
                    result = convertToXML(data);
                    break;
                case 'yaml':
                    result = convertToYAML(data);
                    break;
                default:
                    throw new Error('Invalid conversion type');
            }

            setOutput(result);
        } catch (err) {
            setError(`Conversion failed: ${err.message}`);
            setOutput('');
        } finally {
            setIsConverting(false);
        }
    };

    const convertToCSV = data => {
        if (Array.isArray(data)) {
            if (data.length === 0) return '';
            const headers = Object.keys(data[0]).join(',');
            const rows = data.map(obj =>
                Object.values(obj).map(val =>
                    typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
                ).join(',')
            );
            return [headers, ...rows].join('\n');
        }
        return Object.entries(data)
            .map(([key, value]) => `${key},${typeof value === 'string' ? `"${value}"` : value}`)
            .join('\n');
    };

    const convertToXML = data => {
        const toXML = (obj, nodeName = 'root') => {
            if (typeof obj !== 'object' || obj === null) {
                return `<${nodeName}>${obj}</${nodeName}>`;
            }

            if (Array.isArray(obj)) {
                return obj.map((item, i) =>
                    toXML(item, `${nodeName.replace(/s$/, '')}_${i}`)
                ).join('');
            }

            const children = Object.entries(obj)
                .map(([key, val]) => toXML(val, key))
                .join('');

            return `<${nodeName}>${children}</${nodeName}>`;
        };

        return '<?xml version="1.0"?>\n' + toXML(data);
    };

    const convertToYAML = data => {
        const toYAML = (obj, indent = '') => {
            if (typeof obj !== 'object' || obj === null) {
                return `${obj}\n`;
            }

            if (Array.isArray(obj)) {
                return obj
                    .map(item => `${indent}- ${toYAML(item, indent + '  ').trim()}`)
                    .join('\n');
            }

            return Object.entries(obj)
                .map(([key, val]) => {
                    const value = toYAML(val, indent + '  ');
                    return `${indent}${key}: ${value.startsWith('-') ? '\n' + value : value}`;
                })
                .join('\n');
        };

        return toYAML(data);
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
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${conversionType}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setInput(`{\n  "example": "Paste your JSON here"\n}`);
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
                title="JSON Converter | Convert to CSV, XML, YAML"
                description="Powerful JSON conversion tool. Convert JSON to CSV, XML, or YAML formats instantly with syntax highlighting."
                keywords="json converter, json to csv, json to xml, json to yaml, online json tool"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
            />

            <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">JSON Converter</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Convert JSON to CSV, XML, or YAML formats</p>

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
                            <h2 className="text-xl font-semibold">Input JSON</h2>
                            <div
                                {...getRootProps()}
                                className={`p-4 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center justify-center gap-2 text-center">
                                    <FiUpload className="text-2xl" />
                                    <p>{isDragActive ? 'Drop the JSON file here' : 'Drag & drop JSON file, or click to select'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Supports .json files</p>
                                </div>
                            </div>
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="w-full h-[40rem] p-4 font-mono text-base bg-white dark:bg-gray-800 border rounded focus:outline-none"
                                spellCheck="false"
                                placeholder="Or paste your JSON here..."
                            />
                            <button
                                onClick={convertJSON}
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
                            <pre className="w-full h-[40rem] p-4 font-mono text-base bg-white dark:bg-gray-800 border rounded overflow-auto">
    {output || 'Converted output will appear here...'}
</pre>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded text-sm">
                        <strong>Tips:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Paste JSON or upload a .json file to convert</li>
                            <li>CSV output works best with array of objects</li>
                            <li>Invalid JSON will show conversion errors</li>
                            <li>Use fullscreen mode for larger code editing</li>
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