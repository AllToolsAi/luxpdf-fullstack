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
import Script from 'next/script'; // if using Next.js for Adsense

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
    Object.values(categories).forEach(cat => {
        cat.conversions.forEach(conv => {
            accept[`.${conv.from}`] = [];
        });
    });
    return accept;
}

const UniversalConverter = () => {
    const [files, setFiles] = useState([]);
    const [outputFormat, setOutputFormat] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [results, setResults] = useState([]);
    const [category, setCategory] = useState('document');

    // Dropzone config with stable onDrop handler
    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles);
        setResults([]);
        setOutputFormat('');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: getAllAcceptTypes(),
        multiple: true,
    });

    // Memoize available conversions for selected files (first file only)
    const availableConversions = useMemo(() => {
        if (files.length === 0) return [];
        const ext = files[0].name.split('.').pop().toLowerCase();
        for (const cat of Object.values(categories)) {
            const conv = cat.conversions.find(c => c.from === ext);
            if (conv) return conv.to;
        }
        return [];
    }, [files]);

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            results.forEach(r => URL.revokeObjectURL(r.url));
        };
    }, [results]);

    // Simulated conversion process - replace with real API calls
    const handleConvert = async () => {
        if (!outputFormat || files.length === 0) return;

        setIsConverting(true);
        const conversionResults = [];

        for (const file of files) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
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
        results.forEach(result => {
            const a = document.createElement('a');
            a.href = result.url;
            a.download = result.converted;
            a.click();
        });
    };

    return (
        <>
            {/* Adsense Script (replace YOUR_AD_CLIENT_ID with real one) */}
            <Script
                id="adsense-script"
                strategy="afterInteractive"
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                data-ad-client="YOUR_AD_CLIENT_ID"
            />

            <div className="universal-converter max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md font-sans text-gray-900">
                <header className="converter-header mb-6 flex items-center gap-2 text-2xl font-semibold">
                    <FiSettings />
                    Universal File Converter
                </header>
                <p className="mb-4 text-gray-700">Convert between any file formats with one easy tool.</p>

                {/* AdSense Sidebar */}
                <aside className="adsense-sidebar hidden lg:block fixed top-20 right-6 w-60 h-auto rounded-md shadow-lg bg-white p-3 text-center">
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="YOUR_AD_CLIENT_ID"
                        data-ad-slot="1234567890"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                </aside>

                {/* Category selector */}
                <nav className="category-selector flex flex-wrap gap-2 mb-6">
                    {Object.entries(categories).map(([key, cat]) => (
                        <button
                            key={key}
                            className={`category-btn px-4 py-2 rounded-md border ${
                                category === key
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-indigo-100'
                            } transition`}
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
                    className={`file-dropzone border-2 border-dashed rounded-md p-12 mb-6 flex flex-col items-center justify-center cursor-pointer transition ${
                        isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'
                    }`}
                    aria-label="File Upload Dropzone"
                >
                    <input {...getInputProps()} />
                    <FiUpload size={48} className="mb-4 text-indigo-600" />
                    <p className="text-gray-700 font-medium">
                        {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Supported formats: {categories[category].conversions.map(c => c.from).join(', ')}
                    </p>
                </section>

                {/* File list & conversion options */}
                {files.length > 0 && (
                    <section className="conversion-options mb-6">
                        <div className="file-list mb-4">
                            {files.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="file-item flex justify-between border-b border-gray-200 py-2 text-sm"
                                >
                                    <span>{file.name}</span>
                                    <span className="text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                                </div>
                            ))}
                        </div>

                        <div className="format-selection flex items-center gap-3 mb-4">
                            <label htmlFor="outputFormat" className="font-medium">
                                Convert to:
                            </label>
                            <select
                                id="outputFormat"
                                value={outputFormat}
                                onChange={e => setOutputFormat(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">Select format</option>
                                {availableConversions.map(format => (
                                    <option key={format} value={format}>
                                        {format.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleConvert}
                            disabled={!outputFormat || isConverting}
                            className={`convert-button px-5 py-2 rounded-md text-white font-semibold transition ${
                                !outputFormat || isConverting
                                    ? 'bg-indigo-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isConverting ? 'Converting...' : 'Convert Files'}
                        </button>
                    </section>
                )}

                {/* Conversion Results */}
                {results.length > 0 && (
                    <section className="results-section">
                        <div className="results-header flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Conversion Results</h3>
                            <button
                                onClick={downloadAll}
                                className="download-all flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
                            >
                                <FiDownload /> Download All
                            </button>
                        </div>

                        <div className="results-grid grid gap-4">
                            {results.map((result, idx) => (
                                <div
                                    key={idx}
                                    className="result-item border rounded p-3 flex justify-between items-center bg-gray-50"
                                >
                                    <div className="file-info">
                                        <div className="original font-medium">{result.original}</div>
                                        <div className="converted text-indigo-700">{result.converted}</div>
                                        <div className="file-size text-sm text-gray-500">
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
                                        className="download-button flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
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

                {/* Adsense Footer */}
                <footer className="adsense-footer mt-10 text-center">
                    <ins
                        className="adsbygoogle inline-block"
                        style={{ display: 'block', width: '100%', height: 90 }}
                        data-ad-client="YOUR_AD_CLIENT_ID"
                        data-ad-slot="1234567890"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                </footer>
            </div>

            <style jsx>{`
        .category-btn {
          user-select: none;
        }
        .convert-button {
          min-width: 140px;
        }
        .download-button {
          min-width: 110px;
        }
        .file-dropzone p {
          user-select: none;
        }
      `}</style>
        </>
    );
};

export default UniversalConverter;
