// import { useState, useRef, useEffect, useCallback } from 'react';
// import { FiImage, FiDownload, FiSliders, FiLayers, FiCrop } from 'react-icons/fi';
// import { fabric } from 'fabric';
// import Script from 'next/script'; // if using Next.js for AdSense
// import Head from 'next/head';     // for SEO meta tags

// // Simple SEO component (adjust or replace with your SEO component)
// const SEO = () => (
//     <Head>
//         <title>Online Photo Editor - Professional Image Editing in Browser</title>
//         <meta name="description" content="Edit your photos online with professional tools including filters, cropping, and adjustments. No installation needed." />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//     </Head>
// );

// const PhotoEditor = () => {
//     const canvasRef = useRef(null);
//     const [canvas, setCanvas] = useState(null);
//     const [activeTool, setActiveTool] = useState('select');
//     const [image, setImage] = useState(null);
//     const [filters, setFilters] = useState({
//         brightness: 100,
//         contrast: 100,
//         saturation: 100,
//         blur: 0
//     });

//     // debounce applying filters to avoid excessive re-renders on slider move
//     const debounceTimeout = useRef(null);
//     const applyFiltersDebounced = useCallback(() => {
//         if (!image) return;
//         if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//         debounceTimeout.current = setTimeout(() => {
//             image.filters = [
//                 new fabric.Image.filters.Brightness({ brightness: (filters.brightness - 100) / 100 }),
//                 new fabric.Image.filters.Contrast({ contrast: (filters.contrast - 100) / 100 }),
//                 new fabric.Image.filters.Saturation({ saturation: (filters.saturation - 100) / 100 }),
//                 new fabric.Image.filters.Blur({ blur: filters.blur / 10 }),
//             ];
//             image.applyFilters();
//             canvas.renderAll();
//         }, 150); // 150ms debounce delay
//     }, [filters, image, canvas]);

//     useEffect(() => {
//         const initCanvas = new fabric.Canvas(canvasRef.current, {
//             width: 800,
//             height: 600,
//             backgroundColor: '#1e1e2f', // Darkish background similar to chat.js theme
//             selection: true,
//         });
//         setCanvas(initCanvas);
//         return () => initCanvas.dispose();
//     }, []);

//     useEffect(() => {
//         applyFiltersDebounced();
//     }, [filters, applyFiltersDebounced]);

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const reader = new FileReader();
//         reader.onload = (event) => {
//             fabric.Image.fromURL(event.target.result, (img) => {
//                 img.scaleToWidth(600);
//                 canvas.clear();
//                 canvas.add(img).centerObject(img).setActiveObject(img);
//                 canvas.renderAll();
//                 setImage(img);
//                 // Reset filters to default on new image load
//                 setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0 });
//             });
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleDownload = () => {
//         if (!canvas) return;
//         const dataURL = canvas.toDataURL({
//             format: 'png',
//             quality: 1,
//         });
//         const link = document.createElement('a');
//         link.download = 'edited-image.png';
//         link.href = dataURL;
//         link.click();
//     };

//     return (
//         <>
//             <SEO />

//             {/* Google AdSense */}
//             <Script
//                 async
//                 strategy="afterInteractive"
//                 src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
//                 crossOrigin="anonymous"
//             />
//             <Script id="adsense-init" strategy="afterInteractive">
//                 {`
//           (adsbygoogle = window.adsbygoogle || []).push({
//             google_ad_client: "ca-pub-xxxxxxxxxxxxxxxx", 
//             enable_page_level_ads: true
//           });
//         `}
//             </Script>

//             <div className="photo-editor max-w-4xl mx-auto p-4 text-gray-200 bg-[#1e1e2f] rounded-lg shadow-lg min-h-screen flex flex-col">

//                 {/* AdSense Banner Top */}
//                 <ins className="adsbygoogle mb-4 block text-center"
//                      style={{ display: 'inline-block', width: '728px', height: '90px' }}
//                      data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
//                      data-ad-slot="1234567890"
//                      data-ad-format="auto"
//                      data-full-width-responsive="true"></ins>

//                 <div className="editor-header mb-6 text-center">
//                     <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
//                         <FiImage /> Online Photo Editor
//                     </h1>
//                     <p className="text-gray-400 mt-1">
//                         Professional-grade image editing in your browser
//                     </p>
//                 </div>

//                 <div className="editor-container flex flex-col md:flex-row gap-6 flex-grow">

//                     <div className="toolbar flex flex-col md:w-64 gap-3 text-sm">
//                         <button
//                             className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`}
//                             onClick={() => setActiveTool('select')}
//                             aria-label="Select tool"
//                         >
//                             <FiLayers /> Select
//                         </button>
//                         <button
//                             className={`tool-btn ${activeTool === 'crop' ? 'active' : ''}`}
//                             onClick={() => setActiveTool('crop')}
//                             aria-label="Crop tool"
//                         >
//                             <FiCrop /> Crop
//                         </button>
//                         <button
//                             className={`tool-btn ${activeTool === 'adjust' ? 'active' : ''}`}
//                             onClick={() => setActiveTool('adjust')}
//                             aria-label="Adjust tool"
//                         >
//                             <FiSliders /> Adjust
//                         </button>

//                         <input
//                             type="file"
//                             id="image-upload"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                             className="hidden"
//                         />
//                         <label
//                             htmlFor="image-upload"
//                             className="upload-button cursor-pointer bg-blue-600 hover:bg-blue-700 rounded px-3 py-2 mt-2 text-center"
//                         >
//                             Upload Image
//                         </label>

//                         {image && (
//                             <button
//                                 onClick={handleDownload}
//                                 className="download-button mt-auto bg-green-600 hover:bg-green-700 rounded px-3 py-2 flex items-center justify-center gap-1"
//                             >
//                                 <FiDownload /> Download
//                             </button>
//                         )}
//                     </div>

//                     {activeTool === 'adjust' && (
//                         <div className="adjustment-panel flex-1 bg-[#2c2c44] rounded p-4 text-gray-300 space-y-4">
//                             {['brightness', 'contrast', 'saturation', 'blur'].map((filter) => (
//                                 <div key={filter} className="adjustment-item flex items-center gap-4">
//                                     <label className="w-24 capitalize" htmlFor={filter}>
//                                         {filter}
//                                     </label>
//                                     <input
//                                         id={filter}
//                                         type="range"
//                                         min={filter === 'blur' ? 0 : 0}
//                                         max={filter === 'blur' ? 50 : 200}
//                                         value={filters[filter]}
//                                         onChange={(e) => setFilters((f) => ({ ...f, [filter]: Number(e.target.value) }))}
//                                         className="flex-grow"
//                                     />
//                                     <span className="w-12 text-right">
//                     {filter === 'blur' ? `${filters[filter]}px` : `${filters[filter]}%`}
//                   </span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     <div className="canvas-container flex-1 relative bg-[#252535] rounded-lg flex items-center justify-center min-h-[600px]">
//                         <canvas ref={canvasRef} id="editor-canvas" className="rounded" />
//                         {!image && (
//                             <div className="empty-state absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 pointer-events-none">
//                                 <FiImage size={48} />
//                                 <p>Upload an image to start editing</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* AdSense Banner Bottom */}
//                 <ins className="adsbygoogle mt-6 block text-center"
//                      style={{ display: 'inline-block', width: '728px', height: '90px' }}
//                      data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
//                      data-ad-slot="1234567890"
//                      data-ad-format="auto"
//                      data-full-width-responsive="true"></ins>
//             </div>

//             <style jsx>{`
//         .tool-btn {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 1rem;
//           background: transparent;
//           border: 1px solid #444466;
//           border-radius: 6px;
//           color: #ccc;
//           cursor: pointer;
//           transition: background 0.3s, color 0.3s;
//           user-select: none;
//         }
//         .tool-btn:hover {
//           background: #35354a;
//           color: white;
//         }
//         .tool-btn.active {
//           background: #5865f2;
//           color: white;
//           border-color: #5865f2;
//         }
//         .upload-button {
//           font-weight: 600;
//         }
//         .download-button {
//           font-weight: 600;
//         }
//       `}</style>
//         </>
//     );
// };

// export default PhotoEditor;
