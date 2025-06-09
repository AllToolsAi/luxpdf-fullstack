'use client';

import { useState, useRef, useEffect } from 'react';
import { FiUpload, FiCamera, FiTrash2, FiFileText, FiInfo, FiX, FiDownload } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';

export default function ScanToPDF() {
    const [images, setImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [cameraActive, setCameraActive] = useState(false);
    const [stream, setStream] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const resetAll = () => {
        setImages([]);
        setIsProcessing(false);
        setError(null);
        setSuccess(false);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
        stopCamera();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        resetAll();

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            setError(`Invalid file type: ${invalidFiles.map(f => f.name).join(', ')}. Only JPG, PNG, and WebP are allowed.`);
            return;
        }

        const sizeLimit = 10 * 1024 * 1024; // 10MB per image
        const oversizedFiles = files.filter(file => file.size > sizeLimit);

        if (oversizedFiles.length > 0) {
            setError(`File size exceeds 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
            return;
        }

        const imagePromises = files.map(file => {
            return new Promise((resolve) => {
                const img = new Image();
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                    img.onload = () => {
                        // Resize image to 25% of original dimensions
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width * 0.25;
                        canvas.height = img.height * 0.25;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob(blob => {
                            resolve({
                                file: new File([blob], file.name, { type: 'image/jpeg' }),
                                url: URL.createObjectURL(blob),
                                name: file.name
                            });
                        }, 'image/jpeg', 0.7);
                    };
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(imageData => {
            setImages(imageData);
        });
    };

    const startCamera = async () => {
        try {
            if (!videoRef.current) {
                setError('Camera component not ready');
                return;
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
            setCameraActive(true);
        } catch (err) {
            console.error('Camera error:', err);
            setError('Could not access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCameraActive(false);
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth * 0.25; // 25% of video width
        canvas.height = video.videoHeight * 0.25; // 25% of video height
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            setImages(prev => [...prev, {
                file: new File([blob], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' }),
                url,
                name: `scan-${Date.now()}.jpg`
            }]);
        }, 'image/jpeg', 0.7);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const generatePDF = async () => {
        if (images.length === 0) {
            setError('Please add images first');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setSuccess(false);

        try {
            const { PDFDocument, rgb } = await import('pdf-lib');
            const pdfDoc = await PDFDocument.create();

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const imageBytes = await fetch(image.url).then(res => res.arrayBuffer());

                const imageEmbed = await pdfDoc.embedJpg(imageBytes).catch(() =>
                    pdfDoc.embedPng(imageBytes).catch(() =>
                        pdfDoc.embedWebp(imageBytes)
                    )
                );

                const page = pdfDoc.addPage([imageEmbed.width, imageEmbed.height]);
                page.drawImage(imageEmbed, {
                    x: 0,
                    y: 0,
                    width: imageEmbed.width,
                    height: imageEmbed.height,
                });

                setProgress(Math.floor(((i + 1) / images.length) * 100));
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `scanned-document-${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccess(true);
        } catch (err) {
            console.error('PDF generation error:', err);
            setError('Failed to generate PDF. Please try again.');
        } finally {
            setIsProcessing(false);
            stopCamera();
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <Layout>
            <SEO
                title="Scan to PDF | Create PDF from Images or Camera"
                description="Free online tool to create PDFs from scanned images or directly from your camera. Combine multiple images into a single PDF document."
                keywords="scan to pdf, image to pdf, create pdf from images, camera to pdf, document scanner, pdf creator"
            />

            <section className="py-16 min-h-[80vh]">
                <div className="max-w-screen-xl mx-auto px-4">
                    <main>
                        <h1 className="text-4xl font-bold text-center mb-4">Scan to PDF</h1>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
                            {/* Upload Options */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isProcessing}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md border ${
                                            isProcessing
                                                ? 'bg-gray-100 cursor-not-allowed border-gray-300 text-gray-400'
                                                : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                                        } transition-colors`}
                                    >
                                        <FiUpload className="w-5 h-5" />
                                        <span>Upload Images</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        disabled={isProcessing}
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        multiple
                                    />

                                    <button
                                        onClick={cameraActive ? stopCamera : startCamera}
                                        disabled={isProcessing}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md border ${
                                            isProcessing
                                                ? 'bg-gray-100 cursor-not-allowed border-gray-300 text-gray-400'
                                                : cameraActive
                                                    ? 'bg-red-50 hover:bg-red-100 border-red-300 text-red-600'
                                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                                        } transition-colors`}
                                    >
                                        <FiCamera className="w-5 h-5" />
                                        <span>{cameraActive ? 'Stop Camera' : 'Use Camera'}</span>
                                    </button>
                                </div>

                                {cameraActive && (
                                    <div className="space-y-2">
                                        <div className="relative bg-black rounded-md overflow-hidden">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-auto max-h-96 object-contain"
                                            />
                                            <canvas ref={canvasRef} className="hidden" />
                                        </div>
                                        <button
                                            onClick={captureImage}
                                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2"
                                        >
                                            <FiCamera className="w-5 h-5" />
                                            <span>Capture Image</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-700">
                                        {images.length} image{images.length !== 1 ? 's' : ''} to include in PDF
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative border rounded-md overflow-hidden group h-32">
                                                <img
                                                    src={image.url}
                                                    alt={`Scan ${index + 1}`}
                                                    className="w-full h-full object-contain bg-gray-100 p-1"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-1 px-2 truncate text-xs">
                                                    {image.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                        Creating PDF... {progress}%
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={generatePDF}
                                    disabled={isProcessing || images.length === 0}
                                    className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
                                        isProcessing || images.length === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Generate PDF'}
                                </button>
                                <button
                                    onClick={resetAll}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 text-primary font-semibold rounded-md border border-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <FiTrash2 className="inline mr-2 -mt-1" />
                                    Clear All
                                </button>
                            </div>

                            {/* Success Message */}
                            {success && !isProcessing && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-green-800 font-medium text-center">
                                        PDF generated and downloaded successfully!
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
                                    <li>Upload images or use your camera to scan documents</li>
                                    <li>Supports JPG, PNG, and WebP image formats</li>
                                    <li>Each image will become a page in the PDF</li>
                                    <li>Files are processed securely in your browser</li>
                                    <li>Maximum 10MB per image</li>
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