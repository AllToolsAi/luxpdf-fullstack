// import { useState, useEffect } from 'react'
// import { useDropzone } from 'react-dropzone'
// import Layout from '../../../components/Layout'
// import ToolHeader from '../../../components/ToolHeader'
// import { FiUpload, FiDownload, FiInfo, FiX } from 'react-icons/fi'
// import SEO from '@/components/SEOMeta'
// import Script from 'next/script'
// import adsenseConfig from '@/config/adsenseConfig' // Adjust path if needed

// const pageContent = {
//     title: 'Free PDF to Word Converter | 100% Accurate Results',
//     description:
//         'Convert your PDF files to editable Word documents instantly. Supports DOCX and DOC formats. Easy, fast, and secure PDF to Word conversion.',
//     keywords: 'pdf to word, convert pdf to docx, pdf to doc, pdf converter, editable word file',
//     author: 'YourSiteName',
//     image: '/images/tools/pdf-to-word-banner.png', // add an appropriate banner image
// }

// export default function PdfToWord() {
//     const [file, setFile] = useState(null)
//     const [format, setFormat] = useState('docx')
//     const [isConverting, setIsConverting] = useState(false)
//     const [error, setError] = useState(null)
//     const [result, setResult] = useState(null)
//     const [showTips, setShowTips] = useState(false)

//     // Dropzone setup
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop: acceptedFiles => {
//             if (acceptedFiles.length > 0) {
//                 setFile(acceptedFiles[0])
//                 setError(null)
//                 setResult(null)
//             }
//         },
//         accept: {
//             'application/pdf': ['.pdf'],
//         },
//         maxFiles: 1,
//         maxSize: 50 * 1024 * 1024, // 50MB
//     })

//     // Convert file simulation
//     const convertToWord = async () => {
//         if (!file) {
//             setError('Please select a PDF file first.')
//             return
//         }

//         try {
//             setIsConverting(true)
//             setError(null)

//             // Simulate API call delay
//             await new Promise(resolve => setTimeout(resolve, 3000))

//             // Mock result Blob
//             const resultBlob = new Blob(
//                 [`Converted from: ${file.name}\nFormat: ${format}`],
//                 {
//                     type:
//                         format === 'docx'
//                             ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//                             : 'application/msword',
//                 }
//             )

//             setResult({
//                 blob: resultBlob,
//                 fileName: file.name.replace(/\.pdf$/i, `.${format}`),
//             })
//         } catch (err) {
//             setError('Conversion failed. Please try a different file.')
//             console.error('Conversion error:', err)
//         } finally {
//             setIsConverting(false)
//         }
//     }

//     // Download converted file
//     const downloadResult = () => {
//         if (!result) return
//         const url = URL.createObjectURL(result.blob)
//         const a = document.createElement('a')
//         a.href = url
//         a.download = result.fileName
//         a.click()
//         URL.revokeObjectURL(url)
//     }

//     // Accessibility: disable scrolling page when drag active (optional)
//     useEffect(() => {
//         if (isDragActive) document.body.style.overflow = 'hidden'
//         else document.body.style.overflow = ''
//     }, [isDragActive])

//     return (
//         <Layout>
//             <SEO
//                 title={pageContent.title}
//                 description={pageContent.description}
//                 keywords={pageContent.keywords}
//                 author={pageContent.author}
//                 image={pageContent.image}
//                 url="/tools/pdf-to-word"
//             />

//             {/* AdSense Top Leaderboard */}
//             <div className="flex justify-center mb-6">
//                 <ins
//                     className="adsbygoogle"
//                     style={{ display: 'block', width: '728px', height: '90px' }}
//                     data-ad-client={adsenseConfig.client}
//                     data-ad-slot={adsenseConfig.leaderboardSlot}
//                     data-ad-format="auto"
//                     data-full-width-responsive="true"
//                 />
//             </div>
//             <Script id="adsense-top" strategy="afterInteractive">
//                 {`(adsbygoogle = window.adsbygoogle || []).push({});`}
//             </Script>

//             <ToolHeader
//                 title="PDF to Word Converter"
//                 description="Convert PDF files to editable Word documents"
//                 icon="📝"
//             />

//             <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Main Section */}
//                 <div className="lg:col-span-2 space-y-6">
//                     {/* File Upload */}
//                     <div
//                         {...getRootProps()}
//                         className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${
//                             isDragActive
//                                 ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
//                                 : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
//                         }`}
//                         aria-label="PDF file upload area"
//                         role="button"
//                         tabIndex={0}
//                         onKeyDown={e => {
//                             if (e.key === 'Enter' || e.key === ' ') {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 // Open file dialog manually if needed
//                             }
//                         }}
//                     >
//                         <input {...getInputProps()} />
//                         <div className="flex flex-col items-center justify-center space-y-3">
//                             <FiUpload className="h-10 w-10 text-blue-500" aria-hidden="true" />
//                             <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
//                                 {file ? file.name : 'Drag & drop PDF file here'}
//                             </p>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Max 50MB'}
//                             </p>
//                             <button
//                                 type="button"
//                                 className="btn-secondary text-sm"
//                                 onClick={e => e.stopPropagation()}
//                                 aria-label="Select PDF file from your device"
//                             >
//                                 Select File
//                             </button>
//                         </div>
//                     </div>

//                     {/* Conversion Options */}
//                     {file && (
//                         <div className="card p-6" aria-live="polite">
//                             <h3 className="font-medium text-gray-900 dark:text-white mb-4">Conversion Settings</h3>

//                             <div className="grid grid-cols-2 gap-4 mb-6">
//                                 {['docx', 'doc'].map(f => (
//                                     <button
//                                         key={f}
//                                         onClick={() => setFormat(f)}
//                                         className={`p-4 rounded-lg border transition-all ${
//                                             format === f
//                                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
//                                                 : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
//                                         }`}
//                                         aria-pressed={format === f}
//                                         aria-label={`Select ${f.toUpperCase()} format`}
//                                     >
//                                         <span className="block font-medium">{f.toUpperCase()}</span>
//                                         <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
//                       {f === 'docx' ? 'Modern Word Format' : 'Legacy Word Format'}
//                     </span>
//                                     </button>
//                                 ))}
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <button
//                                     onClick={() => setShowTips(!showTips)}
//                                     className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
//                                     aria-expanded={showTips}
//                                     aria-controls="conversion-tips"
//                                 >
//                                     <FiInfo className="mr-1" aria-hidden="true" /> Conversion tips
//                                 </button>

//                                 <button
//                                     onClick={convertToWord}
//                                     disabled={isConverting}
//                                     className={`btn-primary ${isConverting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                     aria-disabled={isConverting}
//                                 >
//                                     {isConverting ? 'Converting...' : 'Convert to Word'}
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* Tips Panel */}
//                     {showTips && (
//                         <div
//                             className="card p-6"
//                             id="conversion-tips"
//                             aria-live="polite"
//                             role="region"
//                             tabIndex={-1}
//                         >
//                             <h3 className="font-medium text-gray-900 dark:text-white mb-3">Conversion Tips</h3>
//                             <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
//                                 <li>
//                                     <strong>DOCX</strong> is recommended for best compatibility with modern Word versions
//                                 </li>
//                                 <li>
//                                     <strong>DOC</strong> format may be needed for older Word versions (pre-2007)
//                                 </li>
//                                 <li>Text-heavy PDFs convert better than scanned documents</li>
//                                 <li>
//                                     For scanned PDFs, try our{' '}
//                                     <a
//                                         href="/tools/ocr"
//                                         className="text-blue-600 dark:text-blue-400 underline"
//                                         rel="noopener noreferrer"
//                                     >
//                                         OCR tool
//                                     </a>{' '}
//                                     first
//                                 </li>
//                             </ul>
//                         </div>
//                     )}

//                     {/* Result */}
//                     {result && (
//                         <div
//                             className="card p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
//                             role="region"
//                             aria-live="polite"
//                             tabIndex={-1}
//                         >
//                             <h3 className="font-medium text-green-800 dark:text-green-200 mb-4">Conversion Successful!</h3>

//                             <div className="mb-6">
//                                 <p className="text-gray-600 dark:text-gray-400 mb-2">Your file is ready:</p>
//                                 <p className="font-medium">{result.fileName}</p>
//                             </div>

//                             <button
//                                 onClick={downloadResult}
//                                 className="btn-primary w-full flex items-center justify-center"
//                                 aria-label={`Download converted file ${result.fileName}`}
//                             >
//                                 <FiDownload className="mr-2" aria-hidden="true" /> Download Word File
//                             </button>
//                         </div>
//                     )}

//                     {/* Error */}
//                     {error && (
//                         <div
//                             className="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
//                             role="alert"
//                             aria-live="assertive"
//                         >
//                             <div className="flex items-start">
//                                 <FiX
//                                     className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0"
//                                     aria-hidden="true"
//                                 />
//                                 <div>
//                                     <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">Error</h3>
//                                     <p className="text-gray-600 dark:text-gray-400">{error}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Sidebar */}
//                 <aside className="space-y-6">
//                     <div className="card p-6" aria-label="How PDF to Word Works">
//                         <h3 className="font-medium text-gray-900 dark:text-white mb-3">How PDF to Word Works</h3>
//                         <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
//                             <li>Upload your PDF document</li>
//                             <li>Select your preferred Word format</li>
//                             <li>Click &quot;Convert to Word&quot; button</li>
//                             <li>Download your editable Word file</li>
//                         </ol>
//                     </div>

//                     <div className="card p-6" aria-label="Features of PDF to Word Converter">
//                         <h3 className="font-medium text-gray-900 dark:text-white mb-3">Features</h3>
//                         <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
//                             <li>Preserves text formatting</li>
//                             <li>Maintains images and tables</li>
//                             <li>High accuracy conversion</li>
//                             <li>No watermarks or limitations</li>
//                         </ul>
//                     </div>
//                 </aside>
//             </div>

//             {/* AdSense Bottom Medium Rectangle */}
//             <div className="mt-8 flex justify-center">
//                 <ins
//                     className="adsbygoogle"
//                     style={{ display: 'block', width: '300px', height: '250px' }}
//                     data-ad-client={adsenseConfig.client}
//                     data-ad-slot={adsenseConfig.bottomSidebarSlot}
//                     data-ad-format="auto"
//                     data-full-width-responsive="true"
//                 />
//             </div>
//             <Script id="adsense-bottom" strategy="afterInteractive">
//                 {`(adsbygoogle = window.adsbygoogle || []).push({});`}
//             </Script>
//         </Layout>
//     )
// }
