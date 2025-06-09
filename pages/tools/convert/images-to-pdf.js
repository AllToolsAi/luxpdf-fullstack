import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import Layout from '../../../components/Layout'
import SEO from '../../../components/SEOMeta' // Assuming you have this component for SEO metadata
import Script from 'next/script' // for Adsense script
import adsenseConfig from '../../../lib/adsenseConfig';


export default function ImagesToPdf() {
    const [files, setFiles] = useState([])
    const [layout, setLayout] = useState('single')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)

    // For revoking object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: acceptedFiles => {
            const imageFiles = acceptedFiles.filter(
                file => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
            )

            if (imageFiles.length > 0) {
                // Add a preview URL to each file for better memory management
                const filesWithPreview = imageFiles.map(file =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                )
                setFiles(prev => [...prev, ...filesWithPreview].slice(0, 50))
                setError(null)
            } else if (acceptedFiles.length > 0) {
                setError('Please upload valid image files (JPEG, PNG, etc.) under 10MB each')
            }
        },
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
        },
        maxFiles: 50,
        maxSize: 10 * 1024 * 1024,
    })

    const convertToPdf = async () => {
        try {
            setIsProcessing(true)
            setError(null)

            const pdfDoc = await PDFDocument.create()

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer()
                let image

                if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(arrayBuffer)
                } else if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(arrayBuffer)
                } else {
                    continue
                }

                if (layout === 'single') {
                    const page = pdfDoc.addPage([image.width, image.height])
                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: image.width,
                        height: image.height,
                    })
                } else {
                    const page = pdfDoc.addPage([595, 842]) // A4 size
                    const scale = Math.min(595 / image.width, 842 / image.height)
                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: image.width * scale,
                        height: image.height * scale,
                    })
                }
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'converted-images.pdf'
            a.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            setError('Failed to convert images to PDF')
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Layout>
            {/* SEO meta similar to chat.js */}
            <SEO
                title="Images to PDF - Convert Multiple Images to PDF"
                description="Easily convert multiple images (JPEG, PNG, etc.) into a single PDF document online. Supports up to 50 images, 10MB each."
                canonical="/tools/pdf/images-to-pdf"
            />

            {/* Google AdSense script */}
            <Script
                strategy="afterInteractive"
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.client}`}
                crossOrigin="anonymous"
            />

            {/* Tools Navigation */}
            <ToolsNavigation />

            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Adsense top banner */}
                <div className="mb-6 flex justify-center">
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block', width: '728px', height: '90px' }}
                        data-ad-client={adsenseConfig.client}
                        data-ad-slot={adsenseConfig.topBannerSlot}
                        data-ad-format="horizontal"
                        data-full-width-responsive="true"
                    />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Images to PDF</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Convert multiple images to a single PDF document easily and quickly.
                </p>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer transition-colors ${
                        isDragActive
                            ? 'border-primary-500 bg-primary-50 dark:bg-dark-700'
                            : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-500'
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-primary-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to select'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Maximum 50 images, 10MB each</p>
                    </div>
                </div>

                {files.length > 0 && (
                    <section className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Selected Images ({files.length})
                            </h2>
                            <button
                                onClick={() => setFiles([])}
                                className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                aria-label="Clear all selected images"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                            {files.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={file.preview}
                                        alt={file.name}
                                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-dark-600"
                                        loading="lazy"
                                    />
                                    <button
                                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Remove image ${file.name}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-white"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1" title={file.name}>
                                        {file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {files.length > 0 && (
                    <section className="mb-6">
                        <label
                            htmlFor="layout-select"
                            className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
                        >
                            Layout Options
                        </label>
                        <select
                            id="layout-select"
                            value={layout}
                            onChange={e => setLayout(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700"
                            aria-label="Select PDF layout option"
                        >
                            <option value="single">One image per page (original size)</option>
                            <option value="multi">Multiple images per page (A4 size)</option>
                        </select>
                    </section>
                )}

                {error && (
                    <div
                        role="alert"
                        className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800"
                    >
                        {error}
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={convertToPdf}
                        disabled={files.length === 0 || isProcessing}
                        className={`btn-primary ${files.length === 0 || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        aria-disabled={files.length === 0 || isProcessing}
                    >
                        {isProcessing ? 'Creating PDF...' : 'Convert to PDF'}
                    </button>
                    {files.length > 0 && (
                        <button
                            onClick={() => setFiles([])}
                            className="btn-secondary"
                            aria-label="Clear selected images"
                        >
                            Clear Images
                        </button>
                    )}
                </div>

                {/* Adsense bottom banner */}
                <div className="mt-8 flex justify-center">
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block', width: '300px', height: '250px' }}
                        data-ad-client={adsenseConfig.client}
                        data-ad-slot={adsenseConfig.bottomSidebarSlot}
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                </div>
            </div>
        </Layout>
    )
}
