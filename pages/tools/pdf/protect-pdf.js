'use client';

import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiDownload, FiTrash2, FiLock } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';

const adsenseConfig = {
    client: 'ca-pub-xxxxxxxxxxxxxxxx', // your AdSense client ID here
    slot: '1234567890', // your ad slot here
};

export default function ProtectPDF() {
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pdfjsLib, setPdfjsLib] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const loadPDFjs = async () => {
            try {
                const pdfjs = await import('pdfjs-dist');
                const lib = pdfjs.default || pdfjs;
                lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`;
                setPdfjsLib(lib);
            } catch (err) {
                setError('Failed to load PDF.js: ' + err.message);
            }
        };
        loadPDFjs();
    }, []);

    const resetAll = () => {
        setFile(null);
        setPdfDoc(null);
        setPageImages([]);
        setPassword('');
        setIsProcessing(false);
        setError(null);
        setSuccess(false);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const processPDF = async (selectedFile) => {
        if (!pdfjsLib || !selectedFile) return;
        try {
            setIsProcessing(true);
            setError(null);
            setSuccess(false);
            setProgress(0);

            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            setPdfDoc(pdf);

            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const loaded = await loadingTask.promise;
            const previews = [];

            for (let i = 1; i <= loaded.numPages; i++) {
                const page = await loaded.getPage(i);
                const viewport = page.getViewport({ scale: 0.4 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;
                previews.push(canvas.toDataURL());

                setProgress(Math.round((i / loaded.numPages) * 100));
            }

            setFile(selectedFile);
            setPageImages(previews);
            setProgress(100);
        } catch (err) {
            setError('Failed to load PDF: ' + err.message);
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1500);
        }
    };

    const handleProtectPDF = async () => {
        if (!pdfDoc || !password.trim()) {
            setError('Please upload a PDF and enter a password.');
            return;
        }
        try {
            setIsProcessing(true);
            setError(null);
            setSuccess(false);

            // pdf-lib password protection (encryption)
            // Note: pdf-lib supports encrypting with passwords but limited options;
            // we use setPassword for user password to open PDF.

            const pdfBytes = await pdfDoc.save({
                encryption: {
                    userPassword: password,
                    ownerPassword: password,
                    permissions: {
                        printing: 'highResolution',
                        modifying: false,
                        copying: false,
                        annotating: false,
                        fillingForms: false,
                        contentAccessibility: false,
                        documentAssembly: false,
                    }
                }
            });

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace(/\.pdf$/i, '')}_protected.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess(true);
        } catch (err) {
            setError('Failed to protect PDF: ' + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDrop: (acceptedFiles) => processPDF(acceptedFiles[0]),
    });

    return (
        <Layout>
            <SEO
                title="Protect PDF with Password | Secure PDF Editor"
                description="Secure your PDF files by adding password protection online. Fast and private processing in your browser."
                keywords="protect pdf, password protect pdf, encrypt pdf, secure pdf editor"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-6">Protect PDF with Password</h1>

                    <div
                        {...getRootProps()}
                        className={`border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition
            ${isProcessing ? 'border-blue-400 bg-blue-50 cursor-wait' : 'border-blue-500 hover:bg-blue-50'}`}
                    >
                        <input {...getInputProps()} disabled={isProcessing} />
                        <FiUpload
                            className={`mx-auto mb-2 ${isProcessing ? 'text-blue-400' : 'text-blue-600'}`}
                            size={48}
                        />
                        <p className={`font-medium ${isProcessing ? 'text-blue-400' : 'text-blue-700'}`}>
                            {isProcessing ? 'Processing file...' : 'Drag and drop a PDF file here, or click to select'}
                        </p>
                    </div>

                    {progress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {file && (
                        <div className="mt-6 flex items-center justify-between bg-blue-50 border border-blue-300 rounded-lg p-4">
                            <span className="text-blue-900 font-semibold">{file.name}</span>
                            <button
                                onClick={resetAll}
                                className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold transition"
                                aria-label="Remove file"
                                disabled={isProcessing}
                            >
                                <FiTrash2 size={18} /> Remove
                            </button>
                        </div>
                    )}

                    {file && (
                        <div className="mt-6 bg-white shadow-lg rounded-xl p-6">
                            <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
                                Enter Password to Protect PDF
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Enter password"
                                disabled={isProcessing}
                            />
                            <button
                                onClick={handleProtectPDF}
                                disabled={isProcessing}
                                className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition ${
                                    isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isProcessing ? 'Processing...' : <><FiLock size={20} /> Protect & Download</>}
                            </button>
                        </div>
                    )}

                    {pageImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            {pageImages.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`Page ${i + 1}`}
                                    className="rounded-lg shadow border border-gray-200"
                                />
                            ))}
                        </div>
                    )}

                    {error && <p className="text-red-600 mt-6 font-semibold">{error}</p>}
                    {success && <p className="text-green-600 mt-6 font-semibold">PDF protected and downloaded!</p>}

                    <div className="max-w-screen-xl mx-auto px-4 mt-10">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', textAlign: 'center' }}
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
