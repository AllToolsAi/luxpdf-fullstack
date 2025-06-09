// 'use client';

// import { useState, useRef } from 'react';
// import { FiDownload, FiTrash2, FiFileText, FiImage, FiInfo } from 'react-icons/fi';
// import jsPDF from 'jspdf'; // popular client-side PDF lib
// import Layout from '../../../components/Layout';
// import SEO from '../../../components/SEOMeta';

// export default function JPGtoPDF() {
//     const [files, setFiles] = useState([]);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);
//     const fileInputRef = useRef(null);

//     const resetAll = () => {
//         setFiles([]);
//         setIsProcessing(false);
//         setError(null);
//         setSuccess(false);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     };

//     const handleFilesChange = (e) => {
//         setError(null);
//         setSuccess(false);
//         const selectedFiles = Array.from(e.target.files || []);
//         if (selectedFiles.length === 0) return;

//         // Validate all are images
//         const validExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp'];
//         for (const file of selectedFiles) {
//             const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
//             if (!validExtensions.includes(ext)) {
//                 setError('Supported formats: JPG, PNG, TIFF, BMP, WEBP');
//                 if (fileInputRef.current) fileInputRef.current.value = '';
//                 return;
//             }
//             if (file.size > 50 * 1024 * 1024) {
//                 setError('Each file size must be below 50MB.');
//                 if (fileInputRef.current) fileInputRef.current.value = '';
//                 return;
//             }
//         }

//         setFiles(selectedFiles);
//     };

//     const processConversion = async () => {
//         if (!files.length) {
//             setError('Please select one or more image files.');
//             return;
//         }

//         setIsProcessing(true);
//         setError(null);
//         setSuccess(false);

//         try {
//             const pdf = new jsPDF();

//             for (let i = 0; i < files.length; i++) {
//                 const file = files[i];
//                 const imgData = await readFileAsDataURL(file);

//                 // Add image to PDF, scale to fit page width (A4)
//                 const imgProps = pdf.getImageProperties(imgData);
//                 const pdfWidth = pdf.internal.pageSize.getWidth();
//                 const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//                 if (i > 0) pdf.addPage();

//                 pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
//             }

//             // Save PDF to blob URL for download
//             const pdfBlob = pdf.output('blob');
//             const url = URL.createObjectURL(pdfBlob);

//             const a = document.createElement('a');
//             a.href = url;
//             a.download = 'converted-images.pdf';
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             URL.revokeObjectURL(url);

//             setSuccess(true);
//         } catch (err) {
//             console.error(err);
//             setError('Failed to convert images to PDF. Try again.');
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Helper to read file as DataURL
//     const readFileAsDataURL = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = (e) => resolve(e.target.result);
//             reader.onerror = (e) => reject(e);
//             reader.readAsDataURL(file);
//         });
//     };

//     return (
//         <Layout>
//             <SEO
//                 title="JPG to PDF Converter"
//                 description="Convert multiple JPG images into a single PDF file."
//                 keywords="jpg to pdf, image to pdf, convert jpg to pdf online, combine images pdf"
//             />
//             <section className="py-16 min-h-[80vh]">
//                 <div className="max-w-screen-xl mx-auto px-4">
//                     <main>
//                         <h1 className="text-4xl font-bold text-center mb-4">JPG to PDF Converter</h1>

//                         <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
//                             <div>
//                                 <label className="font-medium block mb-1">Upload Images (Multiple)</label>
//                                 <div className="flex items-center gap-4">
//                                     <button
//                                         type="button"
//                                         onClick={() => fileInputRef.current?.click()}
//                                         disabled={isProcessing}
//                                         className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold ${
//                                             isProcessing ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary hover:bg-primary-dark text-white'
//                                         }`}
//                                     >
//                                         <FiImage className="w-5 h-5" />
//                                         Choose Files
//                                     </button>
//                                     <input
//                                         type="file"
//                                         ref={fileInputRef}
//                                         onChange={handleFilesChange}
//                                         disabled={isProcessing}
//                                         accept=".jpg,.jpeg,.png,.tiff,.bmp,.webp"
//                                         multiple
//                                         className="hidden"
//                                     />
//                                     {files.length > 0 && (
//                                         <div className="flex-1 truncate">
//                                             <p className="text-sm text-gray-700 truncate">{files.length} file(s) selected</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="flex gap-4">
//                                 <button
//                                     onClick={processConversion}
//                                     disabled={files.length === 0 || isProcessing}
//                                     className={`flex-1 py-3 rounded-md text-lg font-semibold transition-colors ${
//                                         files.length === 0 || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'
//                                     }`}
//                                 >
//                                     {isProcessing ? 'Processing...' : 'Convert to PDF'}
//                                 </button>
//                                 <button
//                                     onClick={resetAll}
//                                     disabled={isProcessing}
//                                     className="flex-1 py-3 text-primary font-semibold rounded-md border border-primary hover:bg-primary hover:text-white transition-colors"
//                                 >
//                                     <FiTrash2 className="inline mr-2 -mt-1" />
//                                     Clear
//                                 </button>
//                             </div>

//                             {success && (
//                                 <div className="p-4 bg-green-50 rounded-lg">
//                                     <p className="font-medium text-green-800">PDF generated successfully! Check your downloads.</p>
//                                 </div>
//                             )}

//                             {error && (
//                                 <div className="p-4 bg-red-50 rounded-lg text-red-700">
//                                     <p className="font-medium">{error}</p>
//                                 </div>
//                             )}

//                             <div className="p-4 bg-blue-50 rounded-lg text-sm">
//                                 <h3 className="flex items-center font-medium text-blue-800 mb-2">
//                                     <FiInfo className="mr-2" /> Tips for Best Results
//                                 </h3>
//                                 <ul className="list-disc list-inside space-y-1 text-blue-700">
//                                     <li>Use high-quality images for better PDF quality.</li>
//                                     <li>Upload images in supported formats only.</li>
//                                     <li>Arrange images before uploading for desired order.</li>
//                                     <li>Large files may take longer to process.</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </main>
//                 </div>
//             </section>
//         </Layout>
//     );
// }
