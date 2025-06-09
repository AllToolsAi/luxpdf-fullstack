'use client';

import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiDownload, FiTrash2 } from 'react-icons/fi';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';

const adsenseConfig = {
    client: 'ca-pub-xxxxxxxxxxxxxxxx', // replace with your client ID
    slot: '1234567890', // replace with your ad slot
};

export default function AddWatermarkPDF() {
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pdfjsLib, setPdfjsLib] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0); // NEW: progress state 0-100
    const fileInputRef = useRef(null);
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

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
        setIsProcessing(false);
        setError(null);
        setSuccess(false);
        setProgress(0);
        setWatermarkText('CONFIDENTIAL');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const processPDF = async (selectedFile) => {
        if (!pdfjsLib || !selectedFile) return;
        try {
            setIsProcessing(true);
            setError(null);
            setSuccess(false);
            setProgress(0); // reset progress

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

                // Update progress in %
                setProgress(Math.round((i / loaded.numPages) * 100));
            }

            setFile(selectedFile);
            setPageImages(previews);
            setProgress(100);
        } catch (err) {
            setError('Failed to load PDF: ' + err.message);
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 1500); // hide progress after a moment
        }
    };

    const handleAddWatermark = async () => {
        if (!pdfDoc || !watermarkText.trim()) {
            setError('Please upload a file and enter watermark text.');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);
            setSuccess(false);

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            const font = await newPdf.embedFont(StandardFonts.Helvetica);

            copiedPages.forEach((page) => {
                const { width, height } = page.getSize();

                page.drawText(watermarkText, {
                    x: width / 2 - (watermarkText.length * 6),
                    y: height / 2,
                    size: 40,
                    font,
                    color: rgb(0.75, 0.75, 0.75),
                    rotate: degrees(45),
                    opacity: 0.3,
                });

                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace(/\.pdf$/i, '')}_watermarked.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess(true);
        } catch (err) {
            setError('Failed to add watermark: ' + err.message);
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
                title="Add Watermark to PDF | Secure PDF Editor"
                description="Free online tool to add watermark to PDF files. Fast, secure, and processed in your browser."
                keywords="add watermark pdf, pdf watermark, online watermark tool, secure pdf editor"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-6">Add Watermark to PDF</h1>

                    <div {...getRootProps()} className={`border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition
            ${isProcessing ? 'border-blue-400 bg-blue-50 cursor-wait' : 'border-blue-500 hover:bg-blue-50'}`}>
                        <input {...getInputProps()} disabled={isProcessing} />
                        <FiUpload
                            className={`mx-auto mb-2 ${isProcessing ? 'text-blue-400' : 'text-blue-600'}`}
                            size={48}
                        />
                        <p className={`font-medium ${isProcessing ? 'text-blue-400' : 'text-blue-700'}`}>
                            {isProcessing ? 'Processing file...' : 'Drag and drop a PDF file here, or click to select'}
                        </p>
                    </div>

                    {/* Progress Bar */}
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
                            <label htmlFor="watermarkText" className="block mb-2 font-semibold text-gray-700">
                                Watermark Text
                            </label>
                            <input
                                id="watermarkText"
                                type="text"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Enter watermark text"
                                disabled={isProcessing}
                            />
                            <button
                                onClick={handleAddWatermark}
                                disabled={isProcessing}
                                className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition ${
                                    isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isProcessing ? 'Processing...' : <><FiDownload size={20} /> Add Watermark & Download</>}
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
                                    className="rounded-lg shadow-md border border-gray-200"
                                />
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg font-semibold">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg font-semibold">
                            Watermark added and file downloaded!
                        </div>
                    )}

                    {/* Adsense */}
                    <div className="max-w-screen-xl mx-auto px-4 mt-12">
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
