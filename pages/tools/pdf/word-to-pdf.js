'use client';

import { useState, useRef, useEffect } from 'react';
import { FiDownload, FiTrash2, FiFileText, FiInfo, FiPlus, FiX } from 'react-icons/fi';
import { PDFDocument, rgb } from 'pdf-lib';
import * as mammoth from 'mammoth';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';

export default function WordToPDFConverter() {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const resourceUrls = useRef([]);

    const resetAll = () => {
        resourceUrls.current.forEach(url => URL.revokeObjectURL(url));
        resourceUrls.current = [];
        setFiles([]);
        setIsProcessing(false);
        setProgress(0);
        setCurrentFile(null);
        setError(null);
        setSuccess(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (!selectedFiles.length) return;

        resetAll();

        const validExtensions = [ '.docx'];
        const invalidFiles = selectedFiles.filter(file => {
            const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            return !validExtensions.includes(ext);
        });

        if (invalidFiles.length > 0) {
            setError(`Invalid file(s): ${invalidFiles.map(f => f.name).join(', ')}. Only DOC/DOCX allowed.`);
            return;
        }

        const sizeLimit = 50 * 1024 * 1024;
        const oversized = selectedFiles.filter(f => f.size > sizeLimit);

        if (oversized.length > 0) {
            setError(`File size exceeds 50MB: ${oversized.map(f => f.name).join(', ')}`);
            return;
        }

        setFiles(selectedFiles);
    };

    const convertToPDF = async () => {
        if (!files.length) {
            setError('Please upload Word files first.');
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setSuccess(false);
        resourceUrls.current = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setCurrentFile(file.name);
                setProgress(Math.floor((i / files.length) * 100));

                const arrayBuffer = await file.arrayBuffer();

                // Convert DOCX to HTML with styles
                const result = await mammoth.convertToHtml({ arrayBuffer });
                const htmlContent = result.value;

                // Create PDF with better content representation
                const pdfDoc = await PDFDocument.create();
                let page = pdfDoc.addPage([595, 842]); // A4 size
                const margin = 50;
                const pageHeight = page.getSize().height;
                let y = pageHeight - margin;

                // Add title
                page.drawText(`Converted from: ${file.name}`, {
                    x: margin,
                    y,
                    size: 14,
                    color: rgb(0, 0, 0),
                });
                y -= 30;

                // Process HTML content (simplified - for better results consider using a library like html-to-pdf)
                const paragraphs = htmlContent.split(/<\/?p[^>]*>/).filter(p => p.trim());

                for (const para of paragraphs) {
                    if (y < margin) {
                        page = pdfDoc.addPage([595, 842]);
                        y = pageHeight - margin;
                    }

                    // Basic styling detection
                    const isHeading = para.includes('<h1') || para.includes('<h2') || para.includes('<h3');
                    const isBold = para.includes('<strong') || para.includes('<b');
                    const isList = para.includes('<li') || para.includes('<ul') || para.includes('<ol');

                    const textSize = isHeading ? 14 : (isList ? 12 : 11);
                    const text = para.replace(/<[^>]+>/g, '').trim();

                    if (text) {
                        page.drawText(text, {
                            x: margin + (isList ? 20 : 0),
                            y,
                            size: textSize,
                            color: rgb(0, 0, 0),
                            font: isBold ? await pdfDoc.embedFont('Helvetica-Bold') : await pdfDoc.embedFont('Helvetica'),
                        });
                        y -= (textSize + (isHeading ? 10 : 5));
                    }
                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                resourceUrls.current.push(url);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.name.replace(/\.[^/.]+$/, '')}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                await new Promise(resolve => setTimeout(resolve, 500));
            }

            setProgress(100);
            setSuccess(true);
            setCurrentFile(null);
        } catch (err) {
            console.error(err);
            setError(`Conversion failed: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        return () => {
            resourceUrls.current.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    return (
        <Layout>
            <SEO
                title="Word to PDF Converter | Convert DOC/DOCX to PDF Online"
                description="Free online tool to convert Microsoft Word documents to PDF format. Preserve formatting and quality when converting DOC/DOCX files to PDF."
                keywords="word to pdf, doc to pdf, docx to pdf, convert word to pdf, word to pdf converter"
            />
            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">Word to PDF Converter</h1>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            <div>
                                <label className="font-medium block mb-1">Upload Word Files (Multiple)</label>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isProcessing}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-12 rounded-md border-2 border-dashed ${
                                            isProcessing
                                                ? 'bg-gray-100 cursor-not-allowed border-gray-300 text-gray-400'
                                                : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                                        } transition-colors`}
                                    >
                                        <FiPlus className="w-6 h-6" />
                                        <span>Select Word Files</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        disabled={isProcessing}
                                        accept=".docx"
                                        className="hidden"
                                        multiple
                                    />
                                    {files.length > 0 && (
                                        <div className="border rounded-lg p-3 bg-gray-50 space-y-2 max-h-60 overflow-y-auto">
                                            {files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                                                    <div className="flex items-center gap-2">
                                                        <FiFileText className="w-5 h-5 text-gray-500" />
                                                        <span className="text-sm">
                                                            {file.name} ({Math.round(file.size / 1024)} KB)
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newFiles = [...files];
                                                            newFiles.splice(index, 1);
                                                            setFiles(newFiles);
                                                        }}
                                                        className="p-1 text-gray-500 hover:text-red-500 rounded-full"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={convertToPDF}
                                    disabled={!files.length || isProcessing}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
                                        !files.length || isProcessing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    {isProcessing ? `Converting... ${progress}%` : 'Convert to PDF'}
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
                        </div>

                        {isProcessing && currentFile && (
                            <div className="text-center text-sm text-gray-600 mt-4">
                                Processing: {currentFile}
                            </div>
                        )}

                        {isProcessing && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}

                        {success && !isProcessing && (
                            <div className="p-4 bg-green-50 rounded-lg mt-4 text-green-800 font-medium text-center">
                                {files.length > 1 ? 'All files converted successfully!' : 'File converted successfully!'}
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 rounded-lg mt-4 text-red-700">
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 rounded-lg text-sm mt-6">
                            <h3 className="flex items-center font-medium text-blue-800 mb-2">
                                <FiInfo className="mr-2" /> Conversion Tips
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li>Upload multiple DOC or DOCX files at once</li>
                                <li>Better preserves headings, lists, and basic formatting</li>
                                <li>Files are processed securely in your browser</li>
                                <li>Supports files up to 50MB in size</li>
                                <li>For complex documents, consider professional conversion tools</li>
                            </ul>
                        </div>
                    </main>
                </div>
            </section>
        </Layout>
    );
}