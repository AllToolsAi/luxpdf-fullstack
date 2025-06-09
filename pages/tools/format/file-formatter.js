import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Head from 'next/head';
import Script from 'next/script';
import { FiUpload, FiDownload, FiFile } from 'react-icons/fi';

const formattingOptions = [
    { id: 'prettify', name: 'Prettify JSON/XML' },
    { id: 'minify', name: 'Minify JSON/XML' },
    { id: 'csv-to-json', name: 'CSV to JSON' },
    { id: 'json-to-csv', name: 'JSON to CSV' },
    { id: 'sql-formatter', name: 'SQL Formatter' },
];

// Simple formatting functions (expand as needed)
function prettifyJson(text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        return 'Invalid JSON';
    }
}

function minifyJson(text) {
    try {
        return JSON.stringify(JSON.parse(text));
    } catch {
        return 'Invalid JSON';
    }
}

// Add your own formatting logic here for CSV, SQL, etc.
function formatContent(type, text) {
    switch(type) {
        case 'prettify':
            return prettifyJson(text);
        case 'minify':
            return minifyJson(text);
        // TODO: add CSV <-> JSON, SQL formatter here
        default:
            return text;
    }
}

function downloadOutput(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'output.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

const Adsense = () => (
    <>
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive"
            crossOrigin="anonymous"
        />
        <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center', margin: '20px 0' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
        <Script id="ads-init" strategy="afterInteractive">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
    </>
);

export default function FileFormatter() {
    const [file, setFile] = useState(null);
    const [inputContent, setInputContent] = useState('');
    const [outputContent, setOutputContent] = useState('');
    const [formattingType, setFormattingType] = useState('prettify');
    const [isFormatting, setIsFormatting] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setFile(file);
            setInputContent(e.target.result);
            setOutputContent(''); // reset output on new file
        };
        reader.readAsText(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/*': ['.json', '.xml', '.csv', '.sql', '.txt'],
        },
        maxFiles: 1,
    });

    const handleFormat = () => {
        if (!inputContent) return;
        setIsFormatting(true);

        setTimeout(() => {
            const formatted = formatContent(formattingType, inputContent);
            setOutputContent(formatted);
            setIsFormatting(false);
        }, 500); // simulate async formatting
    };

    return (
        <>
            <Head>
                <title>File Formatter - JSON, XML, CSV, SQL</title>
                <meta
                    name="description"
                    content="Format your JSON, XML, CSV, or SQL files quickly with our easy-to-use online file formatter."
                />
                <meta property="og:title" content="File Formatter" />
                <meta
                    property="og:description"
                    content="Format your JSON, XML, CSV, or SQL files quickly with our easy-to-use online file formatter."
                />
                <meta property="og:type" content="website" />
            </Head>

            <Adsense />

            <div className="converter-container theme-chatjs">
                <h2>
                    <FiFile style={{ verticalAlign: 'middle', marginRight: 8 }} /> File Formatter
                </h2>

                <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                    aria-label="File Upload Dropzone"
                >
                    <input {...getInputProps()} aria-describedby="upload-help" />
                    {file ? (
                        <p><strong>{file.name}</strong></p>
                    ) : (
                        <p id="upload-help">
                            Drag & drop file here, or click to select (JSON, XML, CSV, SQL, TXT)
                        </p>
                    )}
                </div>

                {file && (
                    <>
                        <div className="formatting-options">
                            <label htmlFor="format-select">Formatting Option:</label>
                            <select
                                id="format-select"
                                value={formattingType}
                                onChange={(e) => setFormattingType(e.target.value)}
                            >
                                {formattingOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="io-container">
                            <div className="input-section">
                                <h3>Original Content</h3>
                                <textarea
                                    value={inputContent}
                                    readOnly
                                    rows={10}
                                    aria-label="Original file content"
                                />
                            </div>

                            <button
                                onClick={handleFormat}
                                disabled={isFormatting}
                                aria-busy={isFormatting}
                                className="format-button"
                            >
                                {isFormatting ? 'Formatting...' : 'Format'}
                            </button>

                            <div className="output-section">
                                <h3>Formatted Output</h3>
                                <textarea
                                    value={outputContent}
                                    readOnly
                                    rows={10}
                                    aria-label="Formatted output content"
                                />
                                {outputContent && (
                                    <button
                                        onClick={() => downloadOutput(outputContent, `formatted_${file.name}`)}
                                        className="download-button"
                                    >
                                        <FiDownload style={{ verticalAlign: 'middle', marginRight: 6 }} />
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
        .theme-chatjs {
          font-family: 'Inter', sans-serif;
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem 2rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          color: #222;
        }
        h2 {
          font-weight: 700;
          font-size: 1.8rem;
          margin-bottom: 1rem;
          text-align: center;
          color: #0070f3;
        }
        .dropzone {
          border: 2px dashed #0070f3;
          padding: 2rem;
          text-align: center;
          border-radius: 8px;
          cursor: pointer;
          color: #555;
          user-select: none;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .dropzone.active {
          background-color: #e0f0ff;
          border-color: #005bb5;
          color: #005bb5;
        }
        .formatting-options {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        label {
          font-weight: 600;
          color: #0070f3;
        }
        select {
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          border: 1.5px solid #0070f3;
          font-size: 1rem;
          cursor: pointer;
          color: #222;
          background: #f8faff;
          transition: border-color 0.2s ease;
        }
        select:hover,
        select:focus {
          border-color: #005bb5;
          outline: none;
        }
        .io-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .input-section,
        .output-section {
          display: flex;
          flex-direction: column;
        }
        h3 {
          margin-bottom: 0.5rem;
          color: #0070f3;
          font-weight: 700;
          font-size: 1.2rem;
        }
        textarea {
          font-family: 'Source Code Pro', monospace;
          font-size: 0.9rem;
          padding: 1rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          resize: vertical;
          min-height: 150px;
          color: #333;
          background-color: #f7f9fc;
          transition: border-color 0.2s ease;
        }
        textarea:focus {
          border-color: #0070f3;
          outline: none;
          background-color: #fff;
        }
        .format-button,
        .download-button {
          margin-top: 1rem;
          padding: 12px 20px;
          font-weight: 600;
          font-size: 1.1rem;
          color: #fff;
          background-color: #0070f3;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.25s ease;
          align-self: flex-start;
          display: flex;
          align-items: center;
        }
        .format-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .format-button:hover:not(:disabled),
        .download-button:hover {
          background-color: #005bb5;
        }
      `}</style>
        </>
    );
}
