import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import Layout from '../../../components/Layout'
import SEO from '../../../components/SEOMeta'
import Script from 'next/script'
import adsenseConfig from '../../../lib/adsenseConfig'

export default function PdfToImages() {
    const [file, setFile] = useState(null)
    const [format, setFormat] = useState('png')
    const [quality, setQuality] = useState(80)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [images, setImages] = useState([])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setFile(acceptedFiles[0])
                setError(null)
                setImages([])
            }
        },
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
    })

    // Cleanup created object URLs on unmount or file change
    useEffect(() => {
        return () => {
            images.forEach(img => URL.revokeObjectURL(img.url))
        }
    }, [images])

    const convertToImages = async () => {
        if (!file) return
        try {
            setIsProcessing(true)
            setError(null)

            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            const pageCount = pdfDoc.getPageCount()
            const generatedImages = []

            // Demo simulation for image generation
            for (let i = 0; i < pageCount; i++) {
                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 300))

                // Simulated base64 image string — replace with real PDF rendering logic
                const base64Data = btoa(`Simulated image ${i + 1} for ${file.name}`)
                generatedImages.push({
                    url: `data:image/${format};base64,${base64Data}`,
                    name: `${file.name.replace('.pdf', '')}_page_${i + 1}.${format}`,
                    page: i + 1,
                })

                setImages([...generatedImages])
            }
        } catch (err) {
            setError('Failed to convert PDF to images')
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const downloadAllImages = () => {
        images.forEach(img => {
            const a = document.createElement('a')
            a.href = img.url
            a.download = img.name
            a.click()
            URL.revokeObjectURL(img.url)
        })
    }

    return (
        <Layout>
            {/* SEO meta */}
            <SEO
                title="PDF to Images - Convert PDF pages to image files"
                description="Convert each page of a PDF file to individual image files (PNG, JPEG, WebP) online. Easy and fast conversion tool."
                canonical="/tools/pdf/pdf-to-images"
            />

            {/* Google AdSense script */}
            <Script
                strategy="afterInteractive"
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.client}`}
                crossOrigin="anonymous"
            />

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

                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">PDF to Images</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Convert each page of a PDF to separate image files quickly and easily.
                </p>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer transition-colors ${
                        isDragActive
                            ? 'border-primary-500 bg-primary-50 dark:bg-dark-700'
                            : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-500'
                    }`}
                    aria-label="Drop PDF file here or click to select"
                >
                    <input {...getInputProps()} aria-describedby="pdf-upload-desc" />
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
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p
                            className="text-lg font-medium text-gray-700 dark:text-gray-300"
                            id="pdf-upload-desc"
                        >
                            {file ? file.name : 'Drag & drop a PDF file here, or click to select'}
                        </p>
                    </div>
                </div>

                {file && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                htmlFor="format-select"
                                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
                            >
                                Image Format
                            </label>
                            <select
                                id="format-select"
                                value={format}
                                onChange={e => setFormat(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700"
                            >
                                <option value="png">PNG</option>
                                <option value="jpg">JPEG</option>
                                <option value="webp">WebP</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="quality-range"
                                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
                            >
                                Quality ({quality}%)
                            </label>
                            <input
                                type="range"
                                id="quality-range"
                                min="10"
                                max="100"
                                value={quality}
                                onChange={e => setQuality(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-dark-600"
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800"
                    >
                        {error}
                    </div>
                )}

                {images.length > 0 && (
                    <section className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Generated Images ({images.length})
                            </h2>
                            <button
                                onClick={downloadAllImages}
                                className="btn-primary"
                                aria-label="Download all generated images"
                            >
                                Download All
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 dark:border-dark-600 rounded-lg p-2 flex flex-col items-center"
                                >
                                    <div className="bg-gray-100 dark:bg-dark-700 w-full h-32 flex items-center justify-center rounded mb-2 overflow-hidden">
                                        {/* Simulated image preview */}
                                        <img
                                            src={img.url}
                                            alt={`Page ${img.page} preview`}
                                            loading="lazy"
                                            className="object-contain max-h-full"
                                        />
                                    </div>
                                    <p
                                        className="text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center"
                                        title={img.name}
                                    >
                                        {img.name}
                                    </p>
                                    <a
                                        href={img.url}
                                        download={img.name}
                                        className="mt-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                        aria-label={`Download image for page ${img.page}`}
                                    >
                                        Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={convertToImages}
                        disabled={!file || isProcessing}
                        className={`btn-primary ${
                            !file || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        aria-disabled={!file || isProcessing}
                        aria-live="polite"
                    >
                        {isProcessing ? 'Converting...' : 'Convert to Images'}
                    </button>
                    {file && (
                        <button
                            onClick={() => {
                                setFile(null)
                                setImages([])
                                setError(null)
                            }}
                            className="btn-secondary"
                        >
                            Clear File
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
