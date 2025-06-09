// import { useState, useEffect, useRef } from 'react'
// import Head from 'next/head'
// import { useDropzone } from 'react-dropzone'
// import Layout from '../../../components/Layout'
// import ToolHeader from '../../../components/ToolHeader'
// import { FiUpload, FiDownload, FiImage, FiSettings, FiX } from 'react-icons/fi'
// import Script from 'next/script'

// const formatOptions = [
//     { value: 'jpg', label: 'JPG', mime: 'image/jpeg' },
//     { value: 'png', label: 'PNG', mime: 'image/png' },
//     { value: 'webp', label: 'WebP', mime: 'image/webp' },
//     { value: 'gif', label: 'GIF', mime: 'image/gif' },
//     { value: 'bmp', label: 'BMP', mime: 'image/bmp' },
//     { value: 'tiff', label: 'TIFF', mime: 'image/tiff' },
// ]

// export default function ImageConverter() {
//     const [files, setFiles] = useState([])
//     const [outputFormat, setOutputFormat] = useState('jpg')
//     const [quality, setQuality] = useState(85)
//     const [isConverting, setIsConverting] = useState(false)
//     const [results, setResults] = useState([])
//     const [error, setError] = useState(null)
//     const resultsRef = useRef(null)

//     // Scroll to results when conversion done
//     useEffect(() => {
//         if (results.length > 0) {
//             resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
//         }
//     }, [results])

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop: acceptedFiles => {
//             const imageFiles = acceptedFiles.filter(
//                 file => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
//             )
//             if (imageFiles.length > 0) {
//                 setFiles(prev => [...prev, ...imageFiles].slice(0, 20))
//                 setError(null)
//                 setResults([]) // Clear old results on new upload
//             } else if (acceptedFiles.length > 0) {
//                 setError('Please upload valid image files under 10MB each')
//             }
//         },
//         accept: {
//             'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'],
//         },
//         maxFiles: 20,
//         maxSize: 10 * 1024 * 1024,
//     })

//     const convertImages = async () => {
//         try {
//             setIsConverting(true)
//             setError(null)
//             setResults([])

//             // Simulate conversion (replace with real API or client lib)
//             const convertedImages = await Promise.all(
//                 files.map(async file => {
//                     await new Promise(resolve => setTimeout(resolve, 300)) // faster delay

//                     return {
//                         originalName: file.name,
//                         convertedName: file.name.replace(/\.[^/.]+$/, `.${outputFormat}`),
//                         size: file.size * (quality / 100), // Simulated compression
//                         url: URL.createObjectURL(
//                             new Blob(
//                                 [
//                                     `Converted from: ${file.name}\nFormat: ${outputFormat}\nQuality: ${quality}%`,
//                                 ],
//                                 { type: formatOptions.find(f => f.value === outputFormat).mime }
//                             )
//                         ),
//                     }
//                 })
//             )
//             setResults(convertedImages)
//         } catch (err) {
//             setError('Conversion failed. Please try again.')
//             console.error('Conversion error:', err)
//         } finally {
//             setIsConverting(false)
//         }
//     }

//     const downloadAll = () => {
//         results.forEach(result => {
//             const a = document.createElement('a')
//             a.href = result.url
//             a.download = result.convertedName
//             a.click()
//         })
//     }

//     const removeFile = index => {
//         setFiles(prev => prev.filter((_, i) => i !== index))
//         setResults([])
//     }

//     const clearAll = () => {
//         setFiles([])
//         setResults([])
//         setError(null)
//     }

//     return (
//         <>
//             <Head>
//                 <title>Image Converter - Convert and Compress Images Online</title>
//                 <meta
//                     name="description"
//                     content="Convert images between JPG, PNG, WebP, GIF, BMP, TIFF formats. Adjust quality and compress images easily."
//                 />
//                 <meta name="viewport" content="width=device-width, initial-scale=1" />
//                 <link rel="canonical" href="https://yourdomain.com/tools/image-converter" />
//             </Head>

//             {/* Google AdSense - Left & Right side similar to chat.js */}
//             <Script
//                 async
//                 src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
//                 strategy="afterInteractive"
//                 crossOrigin="anonymous"
//             />
//             <aside className="hidden lg:flex fixed top-20 left-0 h-[calc(100vh-80px)] w-20 flex-col items-center justify-start space-y-8 p-2">
//                 {/* Left Ad */}
//                 <ins
//                     className="adsbygoogle"
//                     style={{ display: 'block', width: '160px', height: '600px' }}
//                     data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
//                     data-ad-slot="1234567890"
//                     data-ad-format="vertical"
//                     data-full-width-responsive="false"
//                 />
//             </aside>

//             <aside className="hidden lg:flex fixed top-20 right-0 h-[calc(100vh-80px)] w-20 flex-col items-center justify-start space-y-8 p-2">
//                 {/* Right Ad */}
//                 <ins
//                     className="adsbygoogle"
//                     style={{ display: 'block', width: '160px', height: '600px' }}
//                     data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
//                     data-ad-slot="0987654321"
//                     data-ad-format="vertical"
//                     data-full-width-responsive="false"
//                 />
//             </aside>

//             <Layout>
//                 <ToolHeader
//                     title="Image Converter"
//                     description="Convert between multiple image formats with adjustable quality"
//                     icon="🖼️"
//                 />

//                 <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* File Upload */}
//                         <div
//                             {...getRootProps()}
//                             className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
//                                 isDragActive
//                                     ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
//                                     : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
//                             }`}
//                             aria-label="Drag and drop image files here or click to upload"
//                         >
//                             <input {...getInputProps()} />
//                             <div className="flex flex-col items-center justify-center space-y-3">
//                                 <FiUpload className="h-10 w-10 text-blue-500" />
//                                 <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
//                                     {files.length > 0
//                                         ? `${files.length} image${files.length !== 1 ? 's' : ''} selected`
//                                         : 'Drag & drop images here'}
//                                 </p>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                                     {files.length > 0
//                                         ? `${(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB total`
//                                         : 'Max 20 files, 10MB each'}
//                                 </p>
//                                 <button type="button" className="btn-secondary text-sm" onClick={e => e.stopPropagation()}>
//                                     Select Images
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Selected Files */}
//                         {files.length > 0 && (
//                             <div className="card p-6" aria-live="polite">
//                                 <div className="flex justify-between items-center mb-4">
//                                     <h3 className="font-medium text-gray-900 dark:text-white">
//                                         Selected Images ({files.length})
//                                     </h3>
//                                     <button onClick={clearAll} className="text-sm text-red-500 dark:text-red-400" aria-label="Clear all selected images">
//                                         Clear All
//                                     </button>
//                                 </div>

//                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
//                                     {files.map((file, index) => (
//                                         <div key={index} className="relative group" role="listitem">
//                                             <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
//                                                 <FiImage className="h-8 w-8 text-gray-400" />
//                                             </div>
//                                             <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">{file.name}</p>
//                                             <button
//                                                 onClick={() => removeFile(index)}
//                                                 className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                                                 aria-label={`Remove ${file.name}`}
//                                             >
//                                                 <FiX className="h-3 w-3" />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Conversion Options */}
//                         {files.length > 0 && (
//                             <div className="card p-6" aria-live="polite">
//                                 <h3 className="font-medium text-gray-900 dark:text-white mb-4">Conversion Settings</h3>

//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
//                                     <div>
//                                         <label
//                                             htmlFor="format-options"
//                                             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
//                                         >
//                                             Output Format
//                                         </label>
//                                         <div id="format-options" className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Output format options">
//                                             {formatOptions.map(format => (
//                                                 <button
//                                                     key={format.value}
//                                                     onClick={() => setOutputFormat(format.value)}
//                                                     className={`p-2 rounded-md border text-sm ${
//                                                         outputFormat === format.value
//                                                             ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
//                                                             : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
//                                                     }`}
//                                                     role="radio"
//                                                     aria-checked={outputFormat === format.value}
//                                                     tabIndex={outputFormat === format.value ? 0 : -1}
//                                                 >
//                                                     {format.label}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label
//                                             htmlFor="quality-range"
//                                             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
//                                         >
//                                             Quality: {quality}%
//                                         </label>
//                                         <input
//                                             id="quality-range"
//                                             type="range"
//                                             min="10"
//                                             max="100"
//                                             value={quality}
//                                             onChange={e => setQuality(parseInt(e.target.value))}
//                                             className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
//                                             aria-valuemin={10}
//                                             aria-valuemax={100}
//                                             aria-valuenow={quality}
//                                             aria-label="Set output quality"
//                                         />
//                                         <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                             <span>Smaller</span>
//                                             <span>Better</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button
//                                     onClick={convertImages}
//                                     disabled={isConverting}
//                                     className={`btn-primary w-full ${isConverting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                     aria-busy={isConverting}
//                                 >
//                                     {isConverting ? 'Converting...' : `Convert to ${outputFormat.toUpperCase()}`}
//                                 </button>
//                             </div>
//                         )}

//                         {/* Results */}
//                         {results.length > 0 && (
//                             <div
//                                 ref={resultsRef}
//                                 className="card p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
//                                 aria-live="polite"
//                                 aria-label="Conversion results"
//                             >
//                                 <div className="flex justify-between items-center mb-4">
//                                     <h3 className="font-medium text-green-800 dark:text-green-200">
//                                         Conversion Complete ({results.length} files)
//                                     </h3>
//                                     <button onClick={downloadAll} className="btn-primary text-sm flex items-center" aria-label="Download all converted images">
//                                         <FiDownload className="mr-1" /> Download All
//                                     </button>
//                                 </div>

//                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
//                                     {results.map((result, index) => (
//                                         <div key={index} className="group" role="listitem">
//                                             <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative">
//                                                 <FiImage className="h-8 w-8 text-gray-400" />
//                                                 <a
//                                                     href={result.url}
//                                                     download={result.convertedName}
//                                                     className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                                                     aria-label={`Download ${result.convertedName}`}
//                                                 >
//                                                     <FiDownload className="h-5 w-5 text-white" />
//                                                 </a>
//                                             </div>
//                                             <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">{result.convertedName}</p>
//                                             <p className="text-xs text-gray-500 dark:text-gray-500">
//                                                 {(result.size / 1024 / 1024).toFixed(2)} MB
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Error */}
//                         {error && (
//                             <div
//                                 className="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
//                                 role="alert"
//                                 aria-live="assertive"
//                             >
//                                 <div className="flex items-start">
//                                     <FiX className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
//                                     <div>
//                                         <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">Error</h3>
//                                         <p className="text-gray-600 dark:text-gray-400">{error}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Sidebar */}
//                     <aside className="space-y-6">
//                         <div className="card p-6">
//                             <h3 className="font-medium text-gray-900 dark:text-white mb-3">Supported Formats</h3>
//                             <div className="grid grid-cols-2 gap-2">
//                                 {formatOptions.map(format => (
//                                     <div key={format.value} className="flex items-center">
//                                         <FiImage className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
//                                         <span className="text-sm text-gray-600 dark:text-gray-400">{format.label}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="card p-6">
//                             <h3 className="font-medium text-gray-900 dark:text-white mb-3">How It Works</h3>
//                             <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
//                                 <li>Upload your images (max 20 at once)</li>
//                                 <li>Select output format and quality</li>
//                                 <li>Click "Convert" button</li>
//                                 <li>Download your converted images</li>
//                             </ol>
//                         </div>

//                         <div className="card p-6">
//                             <h3 className="font-medium text-gray-900 dark:text-white mb-3">Tips</h3>
//                             <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
//                                 <li>Use JPG for photos (smaller file size)</li>
//                                 <li>Use PNG for graphics with transparency</li>
//                                 <li>WebP offers best compression for modern browsers</li>
//                                 <li>Adjust quality slider to reduce file size</li>
//                             </ul>
//                         </div>
//                     </aside>
//                 </div>
//             </Layout>
//         </>
//     )
// }
