import { UploadCloud } from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export default function ToolTemplate({
                                         toolTitle,
                                         toolDescription,
                                         maxFiles = 1,
                                         onFilesProcessed,
                                         processButtonLabel = "Process",
                                         accept = { 'application/pdf': [] },
                                         fileLimitMessage = "Maximum files exceeded.",
                                     }) {
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputUrl, setOutputUrl] = useState(null);

    const onDrop = (acceptedFiles) => {
        if (files.length + acceptedFiles.length > maxFiles) {
            alert(fileLimitMessage);
            return;
        }
        setFiles((prev) => [...prev, ...acceptedFiles]);
    };

    const handleProcess = async () => {
        setProcessing(true);
        setProgress(0);
        try {
            const { url, finalProgress } = await onFilesProcessed(files, setProgress);
            setOutputUrl(url);
            setProgress(finalProgress || 100);
        } catch (err) {
            alert("An error occurred.");
        } finally {
            setProcessing(false);
        }
    };

    const clearFiles = () => {
        setFiles([]);
        setProgress(0);
        setOutputUrl(null);
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        accept,
        onDrop,
        noClick: true,
        noKeyboard: true,
    });

    return (
        <>
            <Head>
                <title>{toolTitle} – PDF Toolkit</title>
                <meta name="description" content={toolDescription} />
            </Head>

            <Script id="adsbygoogle-init" strategy="afterInteractive">
                {(adsbygoogle = window.adsbygoogle || []).push({})}
            </Script>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />

            <section className="text-center mb-6">
                <h1 className="text-3xl font-bold text-heading">{toolTitle}</h1>
                <p className="text-muted mt-1">{toolDescription}</p>
            </section>

            <div className="sticky-button-bar">
                <button
                    onClick={handleProcess}
                    className="bg-primary text-white px-6 py-3 rounded shadow hover:bg-red-600 transition disabled:opacity-50"
                    disabled={files.length === 0 || processing}
                >
                    {processing ? "Processing..." : processButtonLabel}
                </button>

                <button
                    onClick={() => window.open(outputUrl, "_blank")}
                    className="bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition disabled:opacity-50"
                    disabled={!outputUrl}
                >
                    Download
                </button>

                <button
                    onClick={clearFiles}
                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded shadow hover:bg-gray-400 transition"
                >
                    Clear All
                </button>
            </div>

            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white text-center hover:border-primary transition mt-6">
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto text-primary w-10 h-10 mb-3" />
                <p className="text-muted mb-4">Drop files here or use the upload button</p>
                <button
                    type="button"
                    onClick={open}
                    className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
                >
                    Upload Files
                </button>
            </div>

            {progress > 0 && processing && (
                <div className="mt-4 mx-auto max-w-xl">
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-sm text-muted text-center mt-1">Processing... {progress}%</p>
                </div>
            )}

            {files.length > 0 && (
                <ul className="mt-6 grid gap-4">
                    {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-white p-4 rounded border shadow-sm">
                            <div className="truncate">{file.name}</div>
                        </li>
                    ))}
                </ul>
            )}

            <footer className="bg-white shadow-inner py-8 mt-16 text-center text-sm text-muted border-t">
                <div className="max-w-4xl mx-auto px-4">
                    <p>© 2025 PDF Toolkit. All rights reserved.</p>
                    <p>Fast, secure, and 100% free PDF tools for everyone.</p>
                </div>
            </footer>
        </>
    );
}
