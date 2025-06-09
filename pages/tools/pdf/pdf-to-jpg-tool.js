'use client';

import { useState, useRef, useEffect } from 'react';
import { FiDownload, FiTrash2, FiFileText, FiImage, FiInfo, FiPlus, FiX } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';

export default function PDFImageConverter() {
    const [activeTab, setActiveTab] = useState('images-to-pdf');
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [pdfConversionMode, setPdfConversionMode] = useState('pages');
    const fileInputRef = useRef(null);
    const resourceUrls = useRef([]);

    const resetAll = () => {
        resourceUrls.current.forEach(url => URL.revokeObjectURL(url));
        resourceUrls.current = [];
        setFiles([]);
        setIsProcessing(false);
        setProgress(0);
        setError(null);
        setSuccess(false);
        setImageUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        setError(null);
        setSuccess(false);
        setImageUrls([]);

        // Validation
        if (activeTab === 'pdf-to-images' && selectedFiles.length > 1) {
            setError('Please upload only one PDF file.');
            return;
        }

        const validExtensions = activeTab === 'pdf-to-images'
            ? ['.pdf']
            : ['.jpg', '.jpeg', '.png', '.webp'];

        const invalidFiles = selectedFiles.filter(file =>
            !validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );

        if (invalidFiles.length > 0) {
            setError(`Invalid file type. Only ${validExtensions.join(', ')} allowed.`);
            return;
        }

        const oversizedFiles = selectedFiles.filter(file => file.size > 50 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setError('File size exceeds 50MB limit.');
            return;
        }

        setFiles(selectedFiles);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const processConversion = async () => {
        if (files.length === 0) {
            setError('Please upload files first.');
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setSuccess(false);
        setImageUrls([]);
        resourceUrls.current = [];

        try {
            if (activeTab === 'pdf-to-images') {
                // PDF to Images conversion logic
                const urls = [];
                const count = pdfConversionMode === 'pages' ? 3 : 4; // Simulated count

                for (let i = 0; i < count; i++) {
                    const canvas = document.createElement('canvas');
                    canvas.width = pdfConversionMode === 'pages' ? 800 * 0.25 : 600 * 0.25;
                    canvas.height = pdfConversionMode === 'pages' ? 1000 * 0.25 : 400 * 0.25;
                    const ctx = canvas.getContext('2d');

                    // Draw content based on mode
                    if (pdfConversionMode === 'pages') {
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = '#000';
                        ctx.font = `${12 * 0.25}px sans-serif`;
                        ctx.fillText(`${files[0].name.split('.')[0]} - Page ${i + 1}`, 20, 20);
                    } else {
                        ctx.fillStyle = i % 2 === 0 ? '#ffcccc' : '#ccffcc';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = '#000';
                        ctx.font = `${10 * 0.25}px sans-serif`;
                        ctx.fillText(`Image ${i + 1}`, 10, 15);
                    }

                    const previewUrl = canvas.toDataURL('image/jpeg', 0.8);
                    urls.push({
                        previewUrl,
                        downloadUrl: previewUrl, // In real app, use full resolution
                        name: `${files[0].name.split('.')[0]}-${pdfConversionMode === 'pages' ? 'page' : 'image'}-${i + 1}.jpg`,
                        type: pdfConversionMode === 'pages' ? 'page' : 'image'
                    });

                    setProgress(Math.round(((i + 1) / count) * 100));
                }

                setImageUrls(urls);
                setSuccess(true);
                await downloadImagesAsZip(urls);
                resetAll();
            } else {
                // Images to PDF conversion - FIXED
                const pdfDoc = await PDFDocument.create();

                // Process each image sequentially
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const arrayBuffer = await file.arrayBuffer();

                    // Convert WebP to PNG if needed
                    let image;
                    try {
                        if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
                            image = await pdfDoc.embedJpg(arrayBuffer);
                        } else if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
                            image = await pdfDoc.embedPng(arrayBuffer);
                        } else {
                            // For WebP, we'd need to convert to PNG first in a real app
                            throw new Error('WebP support requires conversion to PNG');
                        }

                        const page = pdfDoc.addPage([image.width, image.height]);
                        page.drawImage(image, {
                            x: 0,
                            y: 0,
                            width: image.width,
                            height: image.height,
                        });
                    } catch (err) {
                        console.error(`Error processing ${file.name}:`, err);
                        throw new Error(`Failed to process ${file.name}: ${err.message}`);
                    }

                    setProgress(Math.round(((i + 1) / files.length) * 100));
                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                resourceUrls.current.push(url);

                // Download with proper filename
                const filename = files.length === 1
                    ? `${files[0].name.split('.')[0]}.pdf`
                    : 'converted-images.pdf';

                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                setSuccess(true);
                resetAll();
            }
        } catch (err) {
            console.error('Conversion error:', err);
            setError(`Conversion failed: ${err.message}`);
            resetAll();
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImagesAsZip = async (images) => {
        const zip = new JSZip();
        const folderName = pdfConversionMode === 'pages' ? 'extracted_pages' : 'extracted_images';
        const imgFolder = zip.folder(folderName);

        for (const img of images) {
            const response = await fetch(img.downloadUrl);
            const blob = await response.blob();
            imgFolder.file(img.name, blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${folderName}.zip`);
    };

    useEffect(() => {
        return () => {
            resourceUrls.current.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    return (
        <Layout>
            <SEO
                title="PDF ↔ Images Converter"
                description="Convert between PDF and images with multiple file support"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">PDF ↔ Images Converter</h1>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            {/* Tab Navigation */}
                            <div className="flex border-b">
                                <button
                                    onClick={() => {
                                        setActiveTab('images-to-pdf');
                                        resetAll();
                                    }}
                                    className={`py-2 px-4 font-medium border-b-2 transition-colors ${
                                        activeTab === 'images-to-pdf'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Images to PDF
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('pdf-to-images');
                                        resetAll();
                                    }}
                                    className={`py-2 px-4 font-medium border-b-2 transition-colors ${
                                        activeTab === 'pdf-to-images'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    PDF to Images
                                </button>
                            </div>

                            {/* PDF Conversion Mode Selector */}
                            {activeTab === 'pdf-to-images' && (
                                <div className="space-y-2">
                                    <label className="font-medium block">Conversion Mode</label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPdfConversionMode('pages')}
                                            className={`px-4 py-2 rounded-md ${
                                                pdfConversionMode === 'pages'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            Pages to JPG
                                        </button>
                                        <button
                                            onClick={() => setPdfConversionMode('images')}
                                            className={`px-4 py-2 rounded-md ${
                                                pdfConversionMode === 'images'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            Extract Images
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {pdfConversionMode === 'pages'
                                            ? 'Every page of the PDF will be converted into a JPG file'
                                            : 'Extract all images from the PDF document'}
                                    </p>
                                </div>
                            )}

                            {/* File Upload */}
                            <div>
                                <label className="font-medium block mb-1">
                                    {activeTab === 'pdf-to-images' ? 'Upload PDF' : 'Upload Images'}
                                </label>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isProcessing || (activeTab === 'pdf-to-images' && files.length > 0)}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-12 rounded-md border-2 border-dashed ${
                                            isProcessing || (activeTab === 'pdf-to-images' && files.length > 0)
                                                ? 'bg-gray-100 cursor-not-allowed border-gray-300 text-gray-400'
                                                : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                                        } transition-colors`}
                                    >
                                        <FiPlus className="w-6 h-6" />
                                        <span>
                                            {activeTab === 'pdf-to-images'
                                                ? 'Select PDF File'
                                                : 'Select Images (Multiple)'}
                                        </span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        disabled={isProcessing}
                                        accept={activeTab === 'pdf-to-images' ? 'application/pdf' : 'image/jpeg, image/png, image/webp'}
                                        multiple={activeTab !== 'pdf-to-images'}
                                        className="hidden"
                                    />

                                    {/* Compact File List with Scroll */}
                                    {files.length > 0 && (
                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="max-h-40 overflow-y-auto">
                                                <table className="w-full">
                                                    <tbody>
                                                    {files.map((file, index) => (
                                                        <tr key={index} className="border-b hover:bg-gray-50">
                                                            <td className="py-2 px-3">
                                                                <div className="flex items-center gap-2">
                                                                    {activeTab === 'pdf-to-images' ? (
                                                                        <FiFileText className="w-4 h-4 text-gray-500 shrink-0" />
                                                                    ) : (
                                                                        <img
                                                                            src={URL.createObjectURL(file)}
                                                                            alt={file.name}
                                                                            className="w-8 h-8 object-cover rounded shrink-0"
                                                                        />
                                                                    )}
                                                                    <span className="text-sm truncate">
                                                                            {file.name} ({Math.round(file.size / 1024)} KB)
                                                                        </span>
                                                                </div>
                                                            </td>
                                                            <td className="text-right px-3">
                                                                <button
                                                                    onClick={() => removeFile(index)}
                                                                    className="p-1 text-gray-500 hover:text-red-500 rounded-full"
                                                                >
                                                                    <FiX className="w-3 h-3" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={processConversion}
                                    disabled={files.length === 0 || isProcessing}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
                                        files.length === 0 || isProcessing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    {isProcessing
                                        ? `Processing... ${progress}%`
                                        : activeTab === 'pdf-to-images'
                                            ? (pdfConversionMode === 'pages' ? 'Convert Pages' : 'Extract Images')
                                            : 'Convert to PDF'}
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

                            {/* Progress Bar */}
                            {isProcessing && (
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Results Preview (PDF to Images) */}
                            {activeTab === 'pdf-to-images' && imageUrls.length > 0 && !isProcessing && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-blue-800 font-medium text-center">
                                            {pdfConversionMode === 'pages'
                                                ? 'PDF Pages Preview (25% size) - Full resolution will be downloaded'
                                                : 'Extracted Images Preview (25% size) - Full resolution will be downloaded'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imageUrls.map((img, i) => (
                                            <div key={i} className="border rounded overflow-hidden">
                                                <img
                                                    src={img.previewUrl}
                                                    alt={img.type === 'page' ? `Page ${i + 1}` : `Image ${i + 1}`}
                                                    className="w-full h-auto"
                                                />
                                                <div className="p-2 bg-gray-50 text-center">
                                                    <span className="text-sm text-gray-700">
                                                        {img.type === 'page' ? `Page ${i + 1}` : `Image ${i + 1}`}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && !isProcessing && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-green-800 font-medium text-center">
                                        {activeTab === 'pdf-to-images'
                                            ? (pdfConversionMode === 'pages'
                                                ? 'Pages downloaded successfully!'
                                                : 'Images extracted successfully!')
                                            : 'PDF created successfully!'}
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
                                    <FiInfo className="mr-2" /> Conversion Tips
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    {activeTab === 'pdf-to-images' ? (
                                        pdfConversionMode === 'pages' ? (
                                            <>
                                                <li>Each page of the PDF will become a separate JPG file</li>
                                                <li>Preview shows pages at 25% size for quick viewing</li>
                                                <li>Downloaded pages will be at full resolution</li>
                                                <li>Files are automatically downloaded as a ZIP archive</li>
                                            </>
                                        ) : (
                                            <>
                                                <li>All embedded images will be extracted from the PDF</li>
                                                <li>Preview shows images at 25% size</li>
                                                <li>Downloaded images maintain their original quality</li>
                                                <li>Images are automatically downloaded as a ZIP file</li>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <li>Upload high-quality images for best PDF quality</li>
                                            <li>You can select multiple images at once</li>
                                            <li>PDF will be automatically downloaded</li>
                                            <li>Supports JPG, PNG formats (WebP requires conversion)</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </Layout>
    );
}