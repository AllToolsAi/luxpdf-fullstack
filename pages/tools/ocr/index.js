// pages/tools/ocr/index.jsx
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Layout from '../../../components/Layout'
import ToolHeader from '../../../components/ToolHeader'
import {
    FiUpload,
    FiDownload,
    FiFileText,
    FiGlobe,
    FiX
} from 'react-icons/fi'

const languageOptions = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'ara', name: 'Arabic' },
    { code: 'rus', name: 'Russian' }
]

export default function OCRTool() {
    const [file, setFile] = useState(null)
    const [language, setLanguage] = useState('eng')
    const [isProcessing, setIsProcessing] = useState(false)
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
            'image/*': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        maxSize: 20 * 1024 * 1024 // 20MB
    })

    const runOCR = async () => {
        try {
            setIsProcessing(true)
            setError(null)

            // Simulate OCR process
            await new Promise(resolve => setTimeout(resolve, 3000))

            setResult({
                text: `OCR Results for: ${file.name}\n\n` +
                    `Language: ${languageOptions.find(l => l.code === language).name}\n\n` +
                    "This is a simulated OCR result. In a real implementation, this would contain the actual extracted text from your document.\n\n" +
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                fileName: file.name.replace(/\.[^/.]+$/, '.txt')
            })

        } catch (err) {
            setError('OCR processing failed. Please try a different file.')
            console.error('OCR error:', err)
        } finally {
            setIsProcessing(false)
        }
    }

    const downloadResult = () => {
        const blob = new Blob([result.text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Layout>
            <ToolHeader
                title="OCR Tool"
                description="Extract text from images and scanned PDFs"
                icon="🔍"
            />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* File Upload */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                            isDragActive
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <FiUpload className="h-10 w-10 text-blue-500" />
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                {file ? file.name : 'Drag & drop file here'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {file
                                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                                    : 'Supports JPG, PNG, PDF (max 20MB)'}
                            </p>
                            <button
                                type="button"
                                className="btn-secondary text-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Select File
                            </button>
                        </div>
                    </div>

                    {/* OCR Options */}
                    {file && (
                        <div className="card p-6">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-4">OCR Settings</h3>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Document Language
                                </label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                                >
                                    {languageOptions.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={runOCR}
                                disabled={isProcessing}
                                className={`btn-primary w-full ${isProcessing ? 'opacity-50' : ''}`}
                            >
                                {isProcessing ? 'Processing...' : 'Extract Text'}
                            </button>
                        </div>
                    )}

                    {/* Results */}
                    {result && (
                        <div className="card p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-green-800 dark:text-green-200">
                                    Text Extracted Successfully
                                </h3>
                                <button
                                    onClick={downloadResult}
                                    className="btn-primary text-sm flex items-center"
                                >
                                    <FiDownload className="mr-1" /> Download
                                </button>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {result.text}
                </pre>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                            <div className="flex items-start">
                                <FiX className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">Error</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="card p-6">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">How OCR Works</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                            <li>Upload an image or scanned PDF</li>
                            <li>Select the document language</li>
                            <li>Click "Extract Text" button</li>
                            <li>Download or copy the extracted text</li>
                        </ol>
                    </div>

                    <div className="card p-6">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Best Practices</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                            <li>Use high-quality images (300dpi or better)</li>
                            <li>Ensure good lighting and contrast</li>
                            <li>Select the correct language for best accuracy</li>
                            <li>For PDFs, use text layers if available</li>
                        </ul>
                    </div>

                    <div className="card p-6">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Supported Languages</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {languageOptions.map((lang) => (
                                <div key={lang.code} className="flex items-center">
                                    <FiGlobe className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                    {lang.name}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
