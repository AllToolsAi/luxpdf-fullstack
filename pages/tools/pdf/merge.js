import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { ArrowUp, ArrowDown, X, UploadCloud } from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';

export default function MergePDF() {
    const [files, setFiles] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [merging, setMerging] = useState(false);

    const onDrop = (acceptedFiles) => {
        if (files.length + acceptedFiles.length > 100) {
            alert("Maximum of 100 PDFs allowed.");
            return;
        }
        setFiles((prev) => [...prev, ...acceptedFiles]);
    };

    const moveUp = (index) => {
        if (index === 0) return;
        const newFiles = [...files];
        [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
        setFiles(newFiles);
    };

    const moveDown = (index) => {
        if (index === files.length - 1) return;
        const newFiles = [...files];
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        setFiles(newFiles);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const clearFiles = () => {
        setFiles([]);
        setMergedPdfUrl(null);
        setProgress(0);
    };

    const handleMerge = async () => {
        setMerging(true);
        setProgress(0);

        const mergedPdf = await PDFDocument.create();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const bytes = await file.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
            setProgress(Math.round(((i + 1) / files.length) * 100));
        }

        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setMergedPdfUrl(url);

        // Trigger automatic download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf'; // filename for download
        document.body.appendChild(a);
        a.click();
        a.remove();

        setMerging(false);
        setFiles([]);
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: { 'application/pdf': [] },
        onDrop,
        noClick: true,  // disable click on dropzone container itself, so we can control it manually
        noKeyboard: true,
    });

    return (
        <>
            <Head>
                <title>Merge PDF Files – PDF Toolkit</title>
                <meta name="description" content="Merge PDF files online for free, securely and fast in your browser with PDF Toolkit." />
                <meta name="keywords" content="merge PDF, combine PDF, free PDF merger, PDF toolkit" />
                <meta name="robots" content="index, follow" />
            </Head>

            {/* AdSense */}
            <Script
                id="adsbygoogle-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
          `,
                }}
            />
            <ins
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />

            <section className="text-center mb-6">
                <h1 className="text-3xl font-bold text-heading">Merge PDF Files</h1>
                <p className="text-muted mt-1">Upload, arrange, merge – all in your browser</p>
            </section>

            <div className="sticky-button-bar">
                <button
                    onClick={handleMerge}
                    className="bg-primary text-white px-6 py-3 rounded shadow hover:bg-red-600 transition disabled:opacity-50"
                    disabled={files.length === 0 || merging}
                >
                    {merging ? "Merging..." : "Merge PDFs"}
                </button>

                <button
                    onClick={() => window.open(mergedPdfUrl, "_blank")}
                    className="bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition disabled:opacity-50"
                    disabled={!mergedPdfUrl}
                >
                    Download PDF
                </button>

                <button
                    onClick={clearFiles}
                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded shadow hover:bg-gray-400 transition"
                >
                    Clear All
                </button>
            </div>

            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white text-center hover:border-primary transition mt-6"
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto text-primary w-10 h-10 mb-3" />
                <p className="text-muted mb-4">Drop PDF files here or click the button to upload (Max 100 files)</p>

                <button
                    type="button"
                    onClick={open}
                    className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
                >
                    Upload PDFs
                </button>
            </div>

            {progress > 0 && merging && (
                <div className="mt-4 mx-auto max-w-xl">
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-sm text-muted text-center mt-1">Merging... {progress}%</p>
                </div>
            )}

            {files.length > 0 && (
                <ul className="mt-6 grid gap-4">
                    {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-white p-4 rounded border shadow-sm">
                            <div className="truncate">{file.name}</div>
                            <div className="flex gap-2 items-center">
                                <button onClick={() => moveUp(index)}><ArrowUp className="w-5 h-5 text-muted hover:text-primary" /></button>
                                <button onClick={() => moveDown(index)}><ArrowDown className="w-5 h-5 text-muted hover:text-primary" /></button>
                                <button onClick={() => removeFile(index)}><X className="w-5 h-5 text-red-500 hover:text-red-700" /></button>
                            </div>
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
