import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Layout from '../../../components/Layout'
 import SEO from '../../../components/SEOMeta'
import Script from 'next/script'
import adsenseConfig from '../../../lib/adsenseConfig'
import { FiUpload, FiDownload, FiBook, FiX } from 'react-icons/fi'

export default function EpubToPdf() {
    const [file, setFile] = useState(null)
    const [isConverting, setIsConverting] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setFile(acceptedFiles[0])
                setError(null)
                setResult(null)
            }
        },
        accept: {
            'application/epub+zip': ['.epub'],
        },
        maxFiles: 1,
        maxSize: 50 * 1024 * 1024, // 50MB
    })

    const convertToPDF = async () => {
        if (!file) return
        try {
            setIsConverting(true)
            setError(null)
            setResult(null)

            // Simulate conversion delay
            await new Promise(resolve => setTimeout(resolve, 4000))

            setResult({
                fileName: file.name.replace(/\.epub$/i, '.pdf'),
                size: file.size * 1.2,
            })
        } catch (err) {
            setError('Conversion failed. Please try a different file.')
            console.error('Conversion error:', err)
        } finally {
            setIsConverting(false)
        }
    }

    const downloadResult = () => {
        alert(`In a real implementation, this would download ${result.fileName}`)
    }

    return (
        <Layout>
            <SEO
                title="EPUB to PDF Converter"
                description="Easily convert your EPUB eBooks to PDF documents while preserving formatting and chapter structure."
                image="https://yourdomain.com/images/epub-to-pdf-banner.png"
            />

            {/* Adsense Init Script */}
            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
                <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[120px_1fr_120px] gap-8">

                    {/* Left Ad */}
                    <aside className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                            aria-label="Advertisement"
                        />
                    </aside>

                    {/* Main Content */}
                    <main>
                        <ToolHeader title="EPUB to PDF" description="Convert eBook files to PDF documents" icon="📖" />

                        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">

                                {/* File Upload */}
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all focus:outline-none focus:ring-4 ${
                                        isDragActive
                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                                    }`}
                                    tabIndex={0}
                                    role="button"
                                    aria-label="File upload dropzone for EPUB files"
                                >
                                    <input {...getInputProps()} aria-describedby="file-upload-desc" />
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <FiUpload className="h-10 w-10 text-blue-500" aria-hidden="true" />
                                        <p id="file-upload-desc" className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                            {file ? file.name : 'Drag & drop EPUB file here'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Max 50MB'}
                                        </p>
                                        <button
                                            type="button"
                                            className="btn-secondary text-sm"
                                            onClick={e => e.stopPropagation()}
                                            aria-label="Select EPUB file manually"
                                        >
                                            Select File
                                        </button>
                                    </div>
                                </div>

                                {/* Conversion Button */}
                                {file && (
                                    <section className="card p-6" aria-live="polite">
                                        <button
                                            onClick={convertToPDF}
                                            disabled={isConverting}
                                            className={`btn-primary w-full ${isConverting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            aria-busy={isConverting}
                                        >
                                            {isConverting ? 'Converting...' : 'Convert to PDF'}
                                        </button>
                                    </section>
                                )}

                                {/* Result */}
                                {result && (
                                    <section
                                        className="card p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                        aria-live="polite"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-medium text-green-800 dark:text-green-200">Conversion Successful</h3>
                                            <button
                                                onClick={downloadResult}
                                                className="btn-primary text-sm flex items-center"
                                                aria-label={`Download converted file ${result.fileName}`}
                                            >
                                                <FiDownload className="mr-1" aria-hidden="true" /> Download PDF
                                            </button>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center">
                                                <FiBook className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" aria-hidden="true" />
                                                <div>
                                                    <p className="font-medium">{result.fileName}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {(result.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Error */}
                                {error && (
                                    <section
                                        className="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                        aria-live="assertive"
                                        role="alert"
                                    >
                                        <div className="flex items-start">
                                            <FiX className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                                            <div>
                                                <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">Error</h3>
                                                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Sidebar */}
                            <aside className="space-y-6">
                                <div className="card p-6">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">About EPUB to PDF</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Convert your eBooks to PDF format for easier sharing, printing, or archiving while preserving the original formatting.
                                    </p>
                                </div>

                                <div className="card p-6">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Features</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                        <li>Preserves book formatting</li>
                                        <li>Maintains chapter structure</li>
                                        <li>Supports embedded images</li>
                                        <li>Fast conversion process</li>
                                    </ul>
                                </div>

                                <div className="card p-6">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Supported Formats</h3>
                                    <div className="flex items-center">
                                        <FiBook className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" aria-hidden="true" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">EPUB (.epub)</span>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </main>

                    {/* Right Ad */}
                    <aside className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                            aria-label="Advertisement"
                        />
                    </aside>
                </div>
            </section>
        </Layout>
    )
}
