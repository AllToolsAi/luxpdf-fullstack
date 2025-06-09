'use client';

import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiDownload, FiTrash2, FiFileText, FiX, FiInfo } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import adsenseConfig from "../../../lib/adsenseConfig";

export default function CropPDF() {
    const [file, setFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pdfjsLib, setPdfjsLib] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const [cropRegion, setCropRegion] = useState({ x: 50, y: 50, width: 400, height: 500 });
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const loadPDFjs = async () => {
            try {
                const pdfjs = await import('pdfjs-dist');
                const lib = pdfjs.default || pdfjs;
                setDebugInfo(prev => prev + '\nPDF.js version: ' + lib.version);
                lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`;
                setPdfjsLib(lib);
            } catch (err) {
                setError('Failed to load PDF.js: ' + err.message);
                setDebugInfo(prev => prev + '\nPDF.js load error: ' + err.message);
            }
        };
        loadPDFjs();
    }, []);

    const resetAll = () => {
        setFile(null);
        setPdfDoc(null);
        setPageImages([]);
        setCropRegion({ x: 50, y: 50, width: 400, height: 500 });
        setIsProcessing(false);
        setError(null);
        setSuccess(false);
        setDebugInfo('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const processPDF = async (selectedFile) => {
        if (!pdfjsLib || !selectedFile) {
            setError('PDF.js not loaded or no file selected');
            return;
        }

        try {
            setIsProcessing(true);
            setDebugInfo('Starting PDF processing...');

            const arrayBuffer = await selectedFile.arrayBuffer();
            setDebugInfo(prev => prev + '\nFile loaded, size: ' + arrayBuffer.byteLength + ' bytes');

            // Load with pdf-lib first
            const pdf = await PDFDocument.load(arrayBuffer);
            setPdfDoc(pdf);
            setDebugInfo(prev => prev + '\nPDF loaded with pdf-lib, pages: ' + pdf.getPageCount());

            // Load with pdf.js for preview
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const loaded = await loadingTask.promise;
            setDebugInfo(prev => prev + '\nPDF loaded with pdf.js, pages: ' + loaded.numPages);

            const previews = [];
            const firstPage = await loaded.getPage(1);
            const viewport = firstPage.getViewport({ scale: 0.4 });
            setDebugInfo(prev => prev + `\nFirst page dimensions: ${viewport.width}x${viewport.height}`);

            for (let i = 1; i <= loaded.numPages; i++) {
                const page = await loaded.getPage(i);
                const viewport = page.getViewport({ scale: 0.4 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;
                previews.push(canvas.toDataURL());
            }

            setFile(selectedFile);
            setPageImages(previews);
            setDebugInfo(prev => prev + '\nGenerated previews for all pages');

            // Set initial crop region based on first page dimensions
            setCropRegion({
                x: 50,
                y: 50,
                width: viewport.width * (72 / viewport.width) * 0.8, // Convert to PDF points
                height: viewport.height * (72 / viewport.height) * 0.8
            });

        } catch (err) {
            setError('Failed to load PDF: ' + err.message);
            setDebugInfo(prev => prev + '\nError in processPDF: ' + err.message);
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCrop = async () => {
        if (!pdfDoc) {
            setError('Please upload a file first.');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);
            setSuccess(false);
            setDebugInfo('Starting crop process...');

            const newPdf = await PDFDocument.create();
            const pageIndices = pdfDoc.getPageIndices();
            setDebugInfo(prev => prev + `\nCopying ${pageIndices.length} pages`);

            const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
            setDebugInfo(prev => prev + '\nPages copied, applying crop...');

            copiedPages.forEach((page) => {
                const { width, height } = page.getSize();
                setDebugInfo(prev => prev + `\nOriginal page size: ${width}x${height}`);

                // Apply crop box
                page.setCropBox(
                    cropRegion.x,
                    cropRegion.y,
                    Math.min(cropRegion.width, width - cropRegion.x),
                    Math.min(cropRegion.height, height - cropRegion.y)
                );

                const cropBox = page.getCropBox();
                setDebugInfo(prev => prev + `\nApplied crop box: x=${cropBox.x}, y=${cropBox.y}, width=${cropBox.width}, height=${cropBox.height}`);

                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();
            setDebugInfo(prev => prev + '\nPDF saved, size: ' + pdfBytes.byteLength + ' bytes');

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace(/\.pdf$/i, '')}_cropped.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess(true);
            setDebugInfo(prev => prev + '\nDownload initiated successfully');
        } catch (err) {
            setError('Failed to crop PDF: ' + err.message);
            setDebugInfo(prev => prev + '\nError in handleCrop: ' + err.message);
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    // ... rest of the component remains the same until the return statement ...

    return (
        <Layout>
            <SEO
                title="Crop PDF | Trim PDF Pages Online"
                description="Free tool to crop PDF pages. Select crop area and download trimmed PDF. Secure and browser-based."
                keywords="crop pdf, trim pdf, cut pdf, pdf editor, pdf cropper, pdf tools"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">Crop PDF</h1>

                        {/* ... previous JSX remains the same ... */}

                        {/* Add debug info section (can be hidden in production) */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                                <h3 className="font-medium mb-2">Debug Information</h3>
                                <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
                            </div>
                        )}

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
                    </main>
                </div>
            </section>
        </Layout>
    );
}