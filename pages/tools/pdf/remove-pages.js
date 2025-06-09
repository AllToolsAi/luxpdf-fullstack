'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiDownload, FiTrash2, FiFileText, FiInfo, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import adsenseConfig from "../../../lib/adsenseConfig";

export default function RemovePages() {
    const [pdfjsLib, setPdfjsLib] = useState(null);
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [pagesToRemove, setPagesToRemove] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

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
        setPagesToRemove(new Set());
        setIsProcessing(false);
        setError('');
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
                const viewport = page.getViewport({ scale: 0.15 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;

                thumbnails.push({
                    index: i,
                    src: canvas.toDataURL(),
                    aspectRatio: viewport.width / viewport.height,
                });

                setProgress(Math.floor((i / loadedPdf.numPages) * 100));
            }

            setFile(selectedFile);
            setPageImages(thumbnails);
            const loadedPdfDoc = await PDFDocument.load(arrayBuffer);
            setPdfDoc(loadedPdfDoc);
        } catch (err) {
            console.error(err);
            setError('Failed to process PDF. Try another file.');
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

    const togglePage = (pageNum) => {
        setPagesToRemove(prev => {
            const newSet = new Set(prev);
            newSet.has(pageNum) ? newSet.delete(pageNum) : newSet.add(pageNum);
            return newSet;
        });
    };

    const selectAllPages = () => {
        setPagesToRemove(prev =>
            prev.size === pageImages.length ? new Set() : new Set(pageImages.map(p => p.index))
        );
    };

    const handleRemovePages = async () => {
        if (!pdfDoc) return setError('Please upload a PDF file first.');
        if (pagesToRemove.size === 0) return setError('Select pages to remove.');
        if (pagesToRemove.size >= pageImages.length) return setError('Cannot remove all pages.');

        setIsProcessing(true);
        setError('');
        setSuccess(false);

        try {
            const newPdf = await PDFDocument.create();
            const pagesToKeep = Array.from({ length: pageImages.length }, (_, i) => i).filter(i => !pagesToRemove.has(i + 1));
            const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
            copiedPages.forEach(page => newPdf.addPage(page));
            const pdfBytes = await newPdf.save();

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace(/\.pdf$/i, '')}_removed_pages.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Failed to remove pages. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Layout>
            <SEO
                title="Remove PDF Pages | Delete Pages from PDF Documents"
                description="Free online tool to remove pages from PDF files. Select and delete unwanted pages from your PDF document."
                keywords="remove pdf pages, delete pdf pages, pdf remover, pdf editor, pdf tools"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">Remove PDF Pages</h1>

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
                                        <FiPlus className="w-6 h-6" />
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

                            {/* Page Selection */}
                            {pageImages.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-gray-700">
                                            {pagesToRemove.size} page{pagesToRemove.size !== 1 ? 's' : ''} selected for removal
                                        </h3>
                                        <button
                                            onClick={selectAllPages}
                                            className="text-primary hover:text-primary-dark text-sm"
                                        >
                                            {pagesToRemove.size === pageImages.length ? 'Deselect all' : 'Select all'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                        {pageImages.map((page) => (
                                            <div
                                                key={page.index}
                                                onClick={() => togglePage(page.index)}
                                                className={`relative border rounded-md overflow-hidden transition-all cursor-pointer ${
                                                    pagesToRemove.has(page.index)
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                style={{ aspectRatio: page.aspectRatio }}
                                            >
                                                <img
                                                    src={page.src}
                                                    alt={`Page ${page.index}`}
                                                    className="w-full h-full object-contain bg-gray-100"
                                                />
                                                {pagesToRemove.has(page.index) && (
                                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-bl">
                                                        <FiTrash2 />
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-1 text-center text-xs text-gray-700 font-medium">
                                                    {page.index}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleRemovePages}
                                    disabled={isProcessing || pagesToRemove.size === 0}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
                                        isProcessing || pagesToRemove.size === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Remove Selected Pages'}
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
                                        Pages removed successfully! Download started.
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
                                    <li>Upload a PDF file to select pages for removal</li>
                                    <li>Click on page thumbnails to mark them for deletion</li>
                                    <li>Files are processed securely in your browser</li>
                                    <li>Supports files up to 50MB in size</li>
                                    <li>Download the cleaned PDF with selected pages removed</li>
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