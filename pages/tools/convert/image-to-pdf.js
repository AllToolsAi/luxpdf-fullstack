import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import Layout from '../../../components/Layout'
import ToolsNavigation from '../../../components/ToolsNavigation'
import Head from 'next/head'
import Script from 'next/script'

export default function ImagesToPdf() {
    const [files, setFiles] = useState([])
    const [layout, setLayout] = useState('single')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: acceptedFiles => {
            const imageFiles = acceptedFiles.filter(
                file => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
            )

            if (imageFiles.length > 0) {
                setFiles(prev => [...prev, ...imageFiles].slice(0, 50)) // Max 50 images
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
                    // Multi-layout: Fit multiple images per A4 page
                    // Suggestion: This is a good candidate for future enhancement.
                    const page = pdfDoc.addPage([595, 842]) // A4 size in points
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
            a.download = 'images-to-pdf.pdf'
            a.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            setError('Failed to convert images to PDF. Please try again.')
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <>
            <Head>
                <title>Images to PDF Converter - Convert Multiple Images to PDF</title>
                <meta
                    name="description"
                    content="Easily convert multiple images into a single PDF document. Supports JPG, PNG, and more with customizable layout options."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://yourdomain.com/tools/images-to-pdf" />
            </Head>

            {/* Google AdSense - Responsive Ad example */}
            <Script
                strategy="afterInteractive"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                crossOrigin="anonymous"
            />
            <Script id="adsense-init" strategy="afterInteractive">
                {`
          (adsbygoogle = window.adsbygoogle || []).push({});
        `}
            </Script>

            <Layout>
                <ToolsNavigation />
                <div className="max-w-4xl mx-auto py-8 px-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Images to PDF</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Convert multiple images to a single PDF document quickly and easily.
                    </p>

                    {/* AdSense Top Banner */}
                    <div className="mb-6">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', textAlign: 'center' }}
                            data-ad-client="ca-pub-xxxxxxxxxxxxxxx"
                            data-ad-slot="1234567890"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer transition-colors ${
                            isDragActive
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-blue-600 dark:text-blue-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
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
                        <>
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Selected Images ({files.length})
                                    </h2>
                                    <button
                                        onClick={() => setFiles([])}
                                        className="text-sm text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                                        aria-label="Clear all selected images"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                                    {files.map((file, index) => (
                                        <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-full h-24 object-cover"
                                            />
                                            <button
                                                onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                                                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate px-1 py-0.5">{file.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="layout" className="block text-gray-900 dark:text-gray-300 mb-2 font-medium">
                                    Layout Options
                                </label>
                                <select
                                    id="layout"
                                    value={layout}
                                    onChange={e => setLayout(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition"
                                >
                                    <option value="single">One image per page (original size)</option>
                                    <option value="multi">Multiple images per page (A4 size)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded border border-red-300 dark:border-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            onClick={convertToPdf}
                            disabled={files.length === 0 || isProcessing}
                            className={`btn-primary flex-1 ${
                                files.length === 0 || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isProcessing ? 'Creating PDF...' : 'Convert to PDF'}
                        </button>
                        {files.length > 0 && (
                            <button
                                onClick={() => setFiles([])}
                                disabled={isProcessing}
                                className="btn-secondary"
                            >
                                Clear Images
                            </button>
                        )}
                    </div>

                    {/* AdSense Bottom Banner */}
                    <div className="mt-8">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', textAlign: 'center' }}
                            data-ad-client="ca-pub-xxxxxxxxxxxxxxx"
                            data-ad-slot="0987654321"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>
                </div>
            </Layout>
        </>
    )
}
