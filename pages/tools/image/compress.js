// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import Head from 'next/head';
// import Script from 'next/script';
// import imageCompression from 'browser-image-compression';
// import { FiUpload, FiDownload, FiImage } from 'react-icons/fi';

// const Adsense = () => (
//     <>
//         <Script
//             async
//             src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
//             strategy="afterInteractive"
//             crossOrigin="anonymous"
//         />
//         <ins
//             className="adsbygoogle"
//             style={{ display: 'block', textAlign: 'center', margin: '20px 0' }}
//             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
//             data-ad-slot="1234567890"
//             data-ad-format="auto"
//             data-full-width-responsive="true"
//         />
//         <Script id="ads-init" strategy="afterInteractive">
//             {`(adsbygoogle = window.adsbygoogle || []).push({});`}
//         </Script>
//     </>
// );

// export default function ImageCompressor() {
//     const [file, setFile] = useState(null);
//     const [compressedFile, setCompressedFile] = useState(null);
//     const [compressedURL, setCompressedURL] = useState('');
//     const [isCompressing, setIsCompressing] = useState(false);
//     const [error, setError] = useState('');

//     const onDrop = useCallback((acceptedFiles) => {
//         if (acceptedFiles.length === 0) return;
//         const imageFile = acceptedFiles[0];
//         setFile(imageFile);
//         setCompressedFile(null);
//         setCompressedURL('');
//         setError('');
//     }, []);

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: {
//             'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp'],
//         },
//         maxFiles: 1,
//     });

//     const compressImage = async () => {
//         if (!file) return;
//         setIsCompressing(true);
//         setError('');
//         try {
//             const options = {
//                 maxSizeMB: 1,          // max size 1MB
//                 maxWidthOrHeight: 1024, // max dimension 1024px
//                 useWebWorker: true,
//             };
//             const compressedBlob = await imageCompression(file, options);
//             setCompressedFile(compressedBlob);
//             setCompressedURL(URL.createObjectURL(compressedBlob));
//         } catch (e) {
//             setError('Compression failed. Please try another image.');
//         }
//         setIsCompressing(false);
//     };

//     const downloadCompressed = () => {
//         if (!compressedFile) return;
//         const link = document.createElement('a');
//         link.href = compressedURL;
//         link.download = `compressed_${file.name}`;
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//     };

//     return (
//         <>
//             <Head>
//                 <title>Image Compressor - Compress JPEG, PNG, WebP</title>
//                 <meta
//                     name="description"
//                     content="Compress your images quickly and easily online. Supports JPEG, PNG, WebP, GIF, BMP formats."
//                 />
//                 <meta property="og:title" content="Image Compressor" />
//                 <meta
//                     property="og:description"
//                     content="Compress your images quickly and easily online. Supports JPEG, PNG, WebP, GIF, BMP formats."
//                 />
//                 <meta property="og:type" content="website" />
//             </Head>

//             <Adsense />

//             <div className="compressor-container theme-chatjs">
//                 <h2>
//                     <FiImage style={{ verticalAlign: 'middle', marginRight: 8 }} /> Image Compressor
//                 </h2>

//                 <div
//                     {...getRootProps()}
//                     className={`dropzone ${isDragActive ? 'active' : ''}`}
//                     aria-label="Image Upload Dropzone"
//                 >
//                     <input {...getInputProps()} aria-describedby="upload-help" />
//                     {file ? (
//                         <p><strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</p>
//                     ) : (
//                         <p id="upload-help">
//                             Drag & drop an image here, or click to select (JPEG, PNG, WebP, GIF, BMP)
//                         </p>
//                     )}
//                 </div>

//                 {file && (
//                     <>
//                         <button
//                             onClick={compressImage}
//                             disabled={isCompressing}
//                             className="compress-button"
//                             aria-busy={isCompressing}
//                         >
//                             {isCompressing ? 'Compressing...' : 'Compress Image'}
//                         </button>

//                         {error && <p className="error">{error}</p>}

//                         <div className="preview-container">
//                             <div className="preview">
//                                 <h3>Original Image</h3>
//                                 <img
//                                     src={URL.createObjectURL(file)}
//                                     alt="Original upload preview"
//                                     loading="lazy"
//                                 />
//                                 <p>{(file.size / 1024).toFixed(1)} KB</p>
//                             </div>

//                             {compressedFile && (
//                                 <div className="preview">
//                                     <h3>Compressed Image</h3>
//                                     <img
//                                         src={compressedURL}
//                                         alt="Compressed image preview"
//                                         loading="lazy"
//                                     />
//                                     <p>{(compressedFile.size / 1024).toFixed(1)} KB</p>
//                                     <button onClick={downloadCompressed} className="download-button">
//                                         <FiDownload style={{ verticalAlign: 'middle', marginRight: 6 }} />
//                                         Download Compressed
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </>
//                 )}
//             </div>

//             <style jsx>{`
//         .theme-chatjs {
//           font-family: 'Inter', sans-serif;
//           max-width: 650px;
//           margin: 2rem auto;
//           padding: 1.5rem 2rem;
//           background: #fff;
//           border-radius: 12px;
//           box-shadow: 0 8px 20px rgba(0,0,0,0.1);
//           color: #222;
//         }
//         h2 {
//           font-weight: 700;
//           font-size: 1.8rem;
//           margin-bottom: 1rem;
//           text-align: center;
//           color: #0070f3;
//         }
//         .dropzone {
//           border: 2px dashed #0070f3;
//           padding: 2rem;
//           text-align: center;
//           border-radius: 8px;
//           cursor: pointer;
//           color: #555;
//           user-select: none;
//           transition: background-color 0.2s ease, border-color 0.2s ease;
//         }
//         .dropzone.active {
//           background-color: #e0f0ff;
//           border-color: #005bb5;
//           color: #005bb5;
//         }
//         .compress-button,
//         .download-button {
//           margin-top: 1.5rem;
//           padding: 12px 20px;
//           font-weight: 600;
//           font-size: 1.1rem;
//           color: #fff;
//           background-color: #0070f3;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: background-color 0.25s ease;
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .compress-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }
//         .compress-button:hover:not(:disabled),
//         .download-button:hover {
//           background-color: #005bb5;
//         }
//         .preview-container {
//           display: flex;
//           gap: 2rem;
//           margin-top: 2rem;
//           flex-wrap: wrap;
//           justify-content: center;
//         }
//         .preview {
//           max-width: 300px;
//           text-align: center;
//         }
//         .preview img {
//           max-width: 100%;
//           border-radius: 8px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//         }
//         .error {
//           color: #d32f2f;
//           margin-top: 1rem;
//           font-weight: 600;
//           text-align: center;
//         }
//       `}</style>
//         </>
//     );
// }
