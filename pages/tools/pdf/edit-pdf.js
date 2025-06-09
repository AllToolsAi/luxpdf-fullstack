'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FiUpload, FiDownload, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const PREVIEW_SCALE = 1.0; // Increased scale for better readability

export default function EditPDF() {
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pdfjsLib, setPdfjsLib] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [annotationText, setAnnotationText] = useState('');
    const [annotations, setAnnotations] = useState({});
    const cancelRef = useRef(false);

    // Load PDF.js library with correct import paths
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let mounted = true;

        const loadPDFjs = async () => {
            try {
                // Correct import paths for PDF.js v2
                const pdfjs = await import('pdfjs-dist/build/pdf');
                const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
                const lib = pdfjs.default || pdfjs;
                lib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
                if (mounted) setPdfjsLib(lib);
            } catch (err) {
                console.error('PDF.js loading error:', err);
                if (mounted) setError('Failed to load PDF viewer. Please refresh the page.');
            }
        };

        loadPDFjs();

        return () => {
            mounted = false;
        };
    }, []);

    const resetAll = useCallback(() => {
        cancelRef.current = true;
        setFile(null);
        setPdfDoc(null);
        setPageImages([]);
        setIsProcessing(false);
        setError(null);
        setSuccess(false);
        setProgress(0);
        setAnnotationText('');
        setAnnotations({});
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    const processPDF = useCallback(async (selectedFile) => {
        if (!selectedFile || selectedFile.size > MAX_FILE_SIZE) {
            setError(selectedFile ? 'File too large (max 50MB)' : 'No file selected');
            return;
        }

        if (!pdfjsLib) {
            setError('PDF viewer is still loading. Please try again in a moment.');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setSuccess(false);
        setProgress(0);
        cancelRef.current = false;

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();

            // Load with pdf-lib
            const pdf = await PDFDocument.load(arrayBuffer);
            if (cancelRef.current) return;
            setPdfDoc(pdf);

            // Load with PDF.js for rendering
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const loaded = await loadingTask.promise;
            if (cancelRef.current) return;

            const previews = [];
            const pageCount = Math.min(loaded.numPages, 10); // Limit preview pages

            for (let i = 1; i <= pageCount; i++) {
                if (cancelRef.current) break;

                const page = await loaded.getPage(i);
                const viewport = page.getViewport({ scale: PREVIEW_SCALE });

                // Create high quality canvas
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', { willReadFrequently: true });

                const devicePixelRatio = window.devicePixelRatio || 1;
                canvas.width = Math.floor(viewport.width * devicePixelRatio);
                canvas.height = Math.floor(viewport.height * devicePixelRatio);
                canvas.style.width = `${viewport.width}px`;
                canvas.style.height = `${viewport.height}px`;

                context.scale(devicePixelRatio, devicePixelRatio);

                await page.render({
                    canvasContext: context,
                    viewport,
                    intent: 'display',
                    transform: [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]
                }).promise;

                previews.push(canvas.toDataURL('image/jpeg', 0.85));
                setProgress(Math.round((i / pageCount) * 100));
            }

            if (!cancelRef.current) {
                setFile(selectedFile);
                setPageImages(previews);
            }
        } catch (err) {
            if (!cancelRef.current) {
                console.error('PDF processing error:', err);
                setError(err.message.includes('password') ?
                    'Password-protected PDFs are not supported' :
                    'Failed to process PDF. The file may be corrupted.');
            }
        } finally {
            if (!cancelRef.current) {
                setIsProcessing(false);
                setTimeout(() => setProgress(0), 1000);
            }
        }
    }, [pdfjsLib]);

    const handleAddAnnotation = useCallback(async () => {
        if (!pdfDoc || !annotationText.trim()) {
            setError('Please upload a PDF and enter annotation text');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setSuccess(false);
        cancelRef.current = false;

        try {
            const newPdf = await PDFDocument.create();
            const [copiedPages, font] = await Promise.all([
                newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices()),
                newPdf.embedFont(StandardFonts.HelveticaBold)
            ]);

            for (let i = 0; i < copiedPages.length; i++) {
                if (cancelRef.current) break;

                const page = copiedPages[i];
                const { width, height } = page.getSize();

                page.drawText(annotationText, {
                    x: 30,
                    y: 50,
                    size: 16,
                    font,
                    color: rgb(0.9, 0.1, 0.1),
                    opacity: 0.9,
                    borderWidth: 1,
                    borderColor: rgb(0, 0, 0),
                    rotate: degrees(0),
                });

                newPdf.addPage(page);
                setProgress(Math.round((i + 1) / copiedPages.length * 100));
            }

            if (cancelRef.current) return;

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace(/\.pdf$/i, '')}_annotated.pdf`;
            a.click();

            setTimeout(() => {
                URL.revokeObjectURL(url);
                if (!cancelRef.current) {
                    setSuccess(true);
                    setIsProcessing(false);
                }
            }, 100);
        } catch (err) {
            if (!cancelRef.current) {
                console.error('Annotation error:', err);
                setError('Failed to add annotation: ' + err.message);
                setIsProcessing(false);
            }
        }
    }, [pdfDoc, annotationText, file]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
        onDrop: (acceptedFiles) => {
            resetAll();
            processPDF(acceptedFiles[0]);
        },
        disabled: isProcessing,
    });

    useEffect(() => {
        return () => {
            cancelRef.current = true;
        };
    }, []);

    return (
        <Layout>
            <SEO
                title="Edit PDF | Secure PDF Editor"
                description="Free online tool to add text annotations to PDF files. Fast, secure, and processed in your browser."
                keywords="edit pdf, annotate pdf, online pdf editor, secure pdf editor"
            />

            <section className="py-8 min-h-[80vh]">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center mb-6">Edit PDF - Add Text Annotations</h1>

                    {/* Upload Zone */}
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isProcessing ? 'border-blue-300 bg-blue-50 cursor-wait' : 'border-blue-400 hover:bg-blue-50'
                    }`}>
                        <input {...getInputProps()} />
                        <FiUpload className={`mx-auto mb-3 ${isProcessing ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
                        <p className={`font-medium ${isProcessing ? 'text-blue-500' : 'text-blue-700'}`}>
                            {isProcessing ? 'Processing PDF...' : 'Drag & drop PDF or click to browse'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Max file size: 50MB</p>
                    </div>

                    {/* Progress Bar */}
                    {progress > 0 && (
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {/* File Info */}
                    {file && (
                        <div className="mt-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[70%]">
                                {file.name}
                            </span>
                            <button
                                onClick={resetAll}
                                className="flex items-center text-sm text-red-600 hover:text-red-800 font-medium"
                                disabled={isProcessing}
                            >
                                <FiTrash2 className="mr-1" size={14} /> Remove
                            </button>
                        </div>
                    )}

                    {/* Annotation Controls */}
                    {file && (
                        <div className="mt-6 space-y-4 bg-white rounded-lg shadow-md p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Annotation Text
                                </label>
                                <input
                                    type="text"
                                    value={annotationText}
                                    onChange={(e) => setAnnotationText(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isProcessing}
                                    placeholder="Text to add to each page"
                                    maxLength={100}
                                />
                            </div>

                            <button
                                onClick={handleAddAnnotation}
                                disabled={isProcessing || !annotationText.trim()}
                                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isProcessing || !annotationText.trim() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isProcessing ? (
                                    'Adding Annotations...'
                                ) : (
                                    <>
                                        <FiEdit2 className="mr-2" size={18} />
                                        Add Annotations & Download
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Page Previews */}
                    {pageImages.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">PDF Preview</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {pageImages.map((src, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                                        <div className="relative">
                                            <img
                                                src={src}
                                                alt={`Page ${i + 1}`}
                                                className="w-full h-auto"
                                                loading="lazy"
                                                style={{ maxHeight: '500px', objectFit: 'contain' }}
                                            />
                                            {annotations[i] && (
                                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-md shadow-sm text-sm font-semibold text-red-600 border border-red-200">
                                                    {annotations[i]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 text-center text-sm text-gray-500">
                                            Page {i + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status Messages */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm font-medium">
                            Annotations added successfully! Your download should start automatically.
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}