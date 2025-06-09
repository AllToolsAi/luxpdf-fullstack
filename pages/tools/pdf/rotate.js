'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiUpload, FiRotateCw, FiRotateCcw, FiTrash2, FiFileText, FiInfo, FiX, FiDownload } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import { degrees } from 'pdf-lib';


export default function RotatePDF() {
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [pageRotations, setPageRotations] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    // Load PDF.js dynamically
    const [pdfjsLib, setPdfjsLib] = useState(null);
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadPdfJs = async () => {
            try {
                const pdfjs = await import('pdfjs-dist');
                const pdfjsLib = pdfjs.default || pdfjs;
                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
                setPdfjsLib(pdfjsLib);
            } catch (err) {
                console.error('Failed to load PDF.js:', err);
                setError('Failed to initialize PDF processor');
            }
        };

        loadPdfJs();
    }, []);

    const resetAll = () => {
        setFile(null);
        setPdfDoc(null);
        setPageImages([]);
        setPageRotations({});
        setIsProcessing(false);
        setError(null);
        setSuccess(false);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const processPdfFile = async (selectedFile) => {
        if (!pdfjsLib || !selectedFile) return;

        try {
            setIsProcessing(true);
            if (selectedFile.size > 50 * 1024 * 1024) {
                throw new Error('File size exceeds 50MB limit');
            }

            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const loadedPdf = await loadingTask.promise;

            const thumbnails = [];
            for (let i = 1; i <= loadedPdf.numPages; i++) {
                const page = await loadedPdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.1 }); // Smaller thumbnails
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;

                thumbnails.push({
                    index: i,
                    src: canvas.toDataURL(),
                    aspectRatio: viewport.width / viewport.height,
                    originalWidth: viewport.width,
                    originalHeight: viewport.height
                });

                setProgress(Math.floor((i / loadedPdf.numPages) * 100));
            }

            setFile(selectedFile);
            setPdfDoc(await PDFDocument.load(arrayBuffer));
            setPageImages(thumbnails);
            // Initialize all rotations to 0 degrees
            setPageRotations(thumbnails.reduce((acc, page) => {
                acc[page.index] = 0;
                return acc;
            }, {}));
        } catch (err) {
            console.error('PDF processing error:', err);
            setError(err.message || 'Failed to process PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileInputChange = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        resetAll();
        await processPdfFile(selectedFile);
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (!selectedFile) return;
        resetAll();
        await processPdfFile(selectedFile);
    }, [pdfjsLib]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        maxSize: 50 * 1024 * 1024,
        noClick: true
    });

    const rotatePage = (pageIndex, degrees) => {
        setPageRotations(prev => ({
            ...prev,
            [pageIndex]: (prev[pageIndex] + degrees) % 360
        }));
    };

    const rotateAllPages = (degrees) => {
        setPageRotations(prev => {
            const newRotations = {};
            Object.keys(prev).forEach(key => {
                newRotations[key] = (prev[key] + degrees) % 360;
            });
            return newRotations;
        });
    };

    const generateRotatedPDF = async () => {
        if (!pdfDoc) {
            setError('Please upload a PDF file first.');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setSuccess(false);

        try {
            const newPdf = await PDFDocument.create();

            // Copy all pages from original PDF
            const pageIndices = Array.from({ length: pageImages.length }, (_, i) => i);
            const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);

            // Apply rotations to each page
            copiedPages.forEach((page, index) => {
                const pageNum = index + 1;
                const rotation = pageRotations[pageNum] || 0;
                if (rotation !== 0) {
                    page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
                }
                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace(/\.pdf$/i, '')}_rotated.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess(true);

            // ✅ Reset after success
            setTimeout(() => {
                resetAll();
            }, 500); // Small delay so the user sees the success message briefly
        } catch (err) {
            console.error('Rotation error:', err);
            setError('Failed to rotate PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <Layout>
            <SEO
                title="Rotate PDF | Rotate Pages in PDF Documents"
                description="Free online tool to rotate pages in PDF files. Rotate all pages or individual pages in your PDF document."
                keywords="rotate pdf, rotate pdf pages, pdf rotator, pdf editor, pdf tools"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">Rotate PDF</h1>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            {/* File Upload */}
                            <div>
                                <label className="font-medium block mb-1">Upload PDF File</label>
                                <div className="space-y-3">
                                    <div
                                        {...getRootProps()}
                                        className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-12 rounded-md border-2 border-dashed ${
                                            isDragActive
                                                ? 'border-blue-500 bg-blue-50'
                                                : isProcessing
                                                    ? 'bg-gray-100 cursor-not-allowed border-gray-300 text-gray-400'
                                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                                        } transition-colors cursor-pointer`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            {...getInputProps()}
                                            ref={fileInputRef}
                                            onChange={handleFileInputChange}
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                        />
                                        <FiUpload className="w-6 h-6" />
                                        <span>
                                            {file
                                                ? file.name
                                                : isDragActive
                                                    ? 'Drop PDF here'
                                                    : 'Select PDF File'}
                                        </span>
                                        <p className="text-gray-400 text-sm">Max file size: 50MB</p>
                                    </div>

                                    {file && (
                                        <div className="border rounded-lg p-3 bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FiFileText className="w-5 h-5 text-gray-500" />
                                                    <span className="text-sm">
                                                        {file.name} ({Math.round(file.size / 1024)} KB)
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => resetAll()}
                                                    className="p-1 text-gray-500 hover:text-red-500 rounded-full"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {isProcessing && (
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 text-center">
                                        Processing pages... {progress}%
                                    </p>
                                </div>
                            )}

                            {/* Page Thumbnails with Rotation Controls */}
                            {pageImages.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-gray-700">
                                            Rotate Pages
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => rotateAllPages(90)}
                                                className="p-2 text-gray-700 hover:text-primary rounded-md border border-gray-300 hover:border-primary transition-colors"
                                                title="Rotate all 90° clockwise"
                                            >
                                                <FiRotateCw className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => rotateAllPages(-90)}
                                                className="p-2 text-gray-700 hover:text-primary rounded-md border border-gray-300 hover:border-primary transition-colors"
                                                title="Rotate all 90° counter-clockwise"
                                            >
                                                <FiRotateCcw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                                        {pageImages.map((page) => {
                                            const rotation = pageRotations[page.index] || 0;
                                            return (
                                                <div key={page.index} className="flex flex-col items-center gap-1">
                                                    <div
                                                        className="relative w-full border rounded-md overflow-hidden bg-gray-100"
                                                        style={{
                                                            aspectRatio: '1/1.414', // REMOVE this
                                                            maxHeight: '120px' // REMOVE this
                                                        }}
                                                    >
                                                        <img
                                                            src={page.src}
                                                            alt={`Page ${page.index}`}
                                                            className="w-full max-h-[110px] object-contain p-1"
                                                            style={{
                                                                transform: `rotate(${rotation}deg)`,
                                                                transformOrigin: 'center'
                                                            }}
                                                        />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-0.5 text-center text-xs font-medium">
                                                            {page.index}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center gap-1 w-full">
                                                        <button
                                                            onClick={() => rotatePage(page.index, -90)}
                                                            className="p-1 text-gray-700 hover:text-primary rounded border border-gray-300 hover:border-primary transition-colors text-xs"
                                                            title="Rotate counter-clockwise"
                                                        >
                                                            <FiRotateCcw className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs flex items-center px-1">
                                                            {rotation}°
                                                        </span>
                                                        <button
                                                            onClick={() => rotatePage(page.index, 90)}
                                                            className="p-1 text-gray-700 hover:text-primary rounded border border-gray-300 hover:border-primary transition-colors text-xs"
                                                            title="Rotate clockwise"
                                                        >
                                                            <FiRotateCw className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={generateRotatedPDF}
                                    disabled={isProcessing || !file}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
                                        isProcessing || !file
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Download Rotated PDF'}
                                </button>
                                <button
                                    onClick={resetAll}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 text-primary font-semibold rounded-md border border-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <FiTrash2 className="inline mr-2 -mt-1" />
                                    Clear
                                </button>
                            </div>

                            {/* Success Message */}
                            {success && !isProcessing && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-green-800 font-medium text-center">
                                        PDF rotated and downloaded successfully!
                                    </p>
                                </div>
                            )}


                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 rounded-lg text-red-700">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Tips */}
                            <div className="p-4 bg-blue-50 rounded-lg text-sm">
                                <h3 className="flex items-center font-medium text-blue-800 mb-2">
                                    <FiInfo className="mr-2" /> Tool Tips
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Upload a PDF file to rotate its pages</li>
                                    <li>Rotate individual pages or all pages at once</li>
                                    <li>Multiple rotations will accumulate (90° + 90° = 180°)</li>
                                    <li>Files are processed securely in your browser</li>
                                    <li>Supports files up to 50MB in size</li>
                                </ul>
                            </div>

                            {/* AdSense Placeholder */}
                            <div className="p-4 bg-gray-100 rounded-lg text-center">
                                <p className="text-gray-600 text-sm">Advertisement</p>
                                <div className="h-[90px] w-full bg-gray-200 flex items-center justify-center mt-2">
                                    <span className="text-gray-500">Ad Space</span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </Layout>
    );
}