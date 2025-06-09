'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiDownload, FiTrash2, FiFileText, FiInfo, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import adsenseConfig from "../../../lib/adsenseConfig";

export default function OrganizePDF() {
    const [pdfjsLib, setPdfjsLib] = useState(null);
    const [file, setFile] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [orderedPages, setOrderedPages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    // Load PDF.js on client side
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
        setPdf(null);
        setPageImages([]);
        setOrderedPages([]);
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
                const viewport = page.getViewport({ scale: 0.15 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;
                thumbnails.push({
                    id: i.toString(),
                    index: i,
                    src: canvas.toDataURL(),
                    aspectRatio: viewport.width / viewport.height,
                });
                setProgress(Math.floor((i / loadedPdf.numPages) * 100));
            }

            setFile(selectedFile);
            setPdf(await PDFDocument.load(arrayBuffer));
            setPageImages(thumbnails);
            setOrderedPages(thumbnails.map((p) => p.id));
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

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newOrder = Array.from(orderedPages);
        const [removed] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, removed);
        setOrderedPages(newOrder);
    };

    const downloadOrganizedPdf = async () => {
        if (!pdf || orderedPages.length === 0) return;
        setIsProcessing(true);
        setError(null);
        setSuccess(false);

        try {
            const newPdf = await PDFDocument.create();
            const pageIndices = orderedPages.map((id) => parseInt(id, 10) - 1);
            const copiedPages = await newPdf.copyPages(pdf, pageIndices);
            copiedPages.forEach((page) => newPdf.addPage(page));
            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace(/\.pdf$/i, '')}_organized.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess(true);
        } catch (err) {
            console.error('Organize download error:', err);
            setError('Failed to download organized PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Layout>
            <SEO
                title="Organize PDF Pages | Reorder & Rearrange PDF Documents"
                description="Free online tool to reorganize PDF pages. Drag and drop to reorder pages in your PDF document and download the new version."
                keywords="organize pdf, reorder pdf pages, rearrange pdf, pdf organizer, pdf editor, pdf tools"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">Organize PDF Pages</h1>

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

                            {/* Page Thumbnails */}
                            {pageImages.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-700">
                                        Drag to reorder pages:
                                    </h3>
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="pages" direction="horizontal">
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="flex overflow-x-auto gap-3 p-2 border rounded bg-gray-50"
                                                    style={{ minHeight: '120px' }}
                                                >
                                                    {orderedPages.map((pageId, index) => {
                                                        const page = pageImages.find((p) => p.id === pageId);
                                                        return (
                                                            <Draggable
                                                                key={page.id}
                                                                draggableId={page.id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={`relative border rounded cursor-grab ${
                                                                            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                                                                        } bg-white`}
                                                                        style={{
                                                                            ...provided.draggableProps.style,
                                                                            width: `${100 * page.aspectRatio}px`,
                                                                            minWidth: '60px',
                                                                            height: '100px'
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={page.src}
                                                                            alt={`Page ${page.index}`}
                                                                            className="block rounded w-full h-full object-contain"
                                                                        />
                                                                        <span className="absolute bottom-1 right-1 text-xs bg-primary text-white px-1 rounded">
                                                                            {index + 1}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={downloadOrganizedPdf}
                                    disabled={!file || isProcessing || orderedPages.length === 0}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
                                        !file || isProcessing || orderedPages.length === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Download Organized PDF'}
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
                                        PDF organized and downloaded successfully!
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
                                    <li>Upload a PDF file to reorder its pages</li>
                                    <li>Drag and drop thumbnails to rearrange pages</li>
                                    <li>Files are processed securely in your browser</li>
                                    <li>Supports files up to 50MB in size</li>
                                    <li>Download the reorganized PDF with one click</li>
                                </ul>
                            </div>

                            {/* AdSense Placeholder */}
                            <div className="max-w-screen-xl mx-auto px-4 mt-10">
                                <ins
                                    className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client={adsenseConfig.client}
                                    data-ad-slot={adsenseConfig.slot}
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"
                                ></ins>
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </Layout>
    );
}