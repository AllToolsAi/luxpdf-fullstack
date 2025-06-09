import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Head from 'next/head';
import Script from 'next/script';

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

export default function EpubToPdf() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [converting, setConverting] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0 && acceptedFiles[0].name.toLowerCase().endsWith('.epub')) {
            setFile(acceptedFiles[0]);
            setResult(null); // clear previous
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/epub+zip': ['.epub'],
            'application/octet-stream': ['.epub'], // fallback mime
        },
        maxFiles: 1,
        multiple: false,
    });

    const convertToPdf = useCallback(async () => {
        if (!file) return;
        setConverting(true);
        setResult(null);

        // Simulate conversion delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setResult({
            fileName: file.name.replace(/\.epub$/i, '.pdf'),
            size: Math.round(file.size * 1.05), // PDF size ~ similar or smaller
        });

        setConverting(false);
    }, [file]);

    return (
        <>
            <Head>
                <title>EPUB to PDF Converter - Fast & Easy</title>
                <meta name="description" content="Convert your EPUB eBooks to PDF format quickly and easily online." />
                <meta property="og:title" content="EPUB to PDF Converter" />
                <meta property="og:description" content="Convert your EPUB eBooks to PDF format quickly and easily online." />
                <meta property="og:type" content="website" />
            </Head>

            <Adsense />

            <div className="tool-container theme-chatjs">
                <h2>EPUB to PDF Converter</h2>

                <div {...getRootProps()} className={`file-dropzone ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} />
                    {file ? (
                        <p>Selected file: <strong>{file.name}</strong></p>
                    ) : (
                        <p>{isDragActive ? 'Drop the EPUB file here...' : 'Drag & drop EPUB file here, or click to select'}</p>
                    )}
                </div>

                <button
                    onClick={convertToPdf}
                    disabled={!file || converting}
                    className="convert-button"
                    aria-busy={converting}
                >
                    {converting ? 'Converting...' : 'Convert to PDF'}
                </button>

                {result && (
                    <div className="download-section">
                        <p>Conversion complete! Ready for download: <strong>{result.fileName}</strong></p>
                        <button onClick={() => alert('Download would start here')} className="download-button">
                            Download PDF
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        .theme-chatjs {
          font-family: 'Inter', sans-serif;
          max-width: 480px;
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
        .file-dropzone {
          border: 2px dashed #0070f3;
          padding: 2rem;
          text-align: center;
          border-radius: 8px;
          cursor: pointer;
          color: #555;
          transition: background-color 0.2s ease, border-color 0.2s ease;
          user-select: none;
        }
        .file-dropzone.active {
          background-color: #e0f0ff;
          border-color: #005bb5;
          color: #005bb5;
        }
        .convert-button,
        .download-button {
          display: block;
          width: 100%;
          padding: 12px 0;
          margin-top: 1.5rem;
          background-color: #0070f3;
          color: #fff;
          font-weight: 600;
          font-size: 1.1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.25s ease;
        }
        .convert-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .convert-button:hover:not(:disabled),
        .download-button:hover {
          background-color: #005bb5;
        }
        .download-section {
          margin-top: 1.5rem;
          text-align: center;
          font-weight: 600;
          color: #0070f3;
        }
      `}</style>
        </>
    );
}
