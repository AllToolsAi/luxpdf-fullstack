// import { useState, useRef, useEffect } from 'react';
// import Head from 'next/head';
// import Script from 'next/script';
// import { FiImage, FiText, FiSquare, FiCircle, FiDownload } from 'react-icons/fi';
// import { fabric } from 'fabric';

// export default function CanvaEditor() {
//     const canvasRef = useRef(null);
//     const [canvas, setCanvas] = useState(null);
//     const [activeTool, setActiveTool] = useState('select');
//     const [templates] = useState([
//         { id: 1, name: 'Social Media Post', width: 800, height: 800 },
//         { id: 2, name: 'Presentation Slide', width: 1024, height: 768 },
//         { id: 3, name: 'Business Card', width: 350, height: 200 }
//     ]);
//     const [selectedTemplate, setSelectedTemplate] = useState(null);
//     const [textContent, setTextContent] = useState('');
//     const [error, setError] = useState('');

//     useEffect(() => {
//         if (!canvasRef.current) return;

//         const initCanvas = new fabric.Canvas(canvasRef.current, {
//             backgroundColor: '#fff',
//             selection: true,
//             preserveObjectStacking: true,
//         });
//         setCanvas(initCanvas);

//         // Cleanup on unmount
//         return () => initCanvas.dispose();
//     }, []);

//     useEffect(() => {
//         if (canvas && selectedTemplate) {
//             canvas.setWidth(selectedTemplate.width);
//             canvas.setHeight(selectedTemplate.height);
//             canvas.setBackgroundColor('#fff', canvas.renderAll.bind(canvas));
//             canvas.clear();
//             canvas.renderAll();
//         }
//     }, [selectedTemplate, canvas]);

//     const handleTemplateSelect = (template) => {
//         setSelectedTemplate(template);
//         setActiveTool('select');
//         setError('');
//     };

//     const addText = () => {
//         if (!canvas) return;
//         if (!textContent.trim()) {
//             setError('Please enter some text before adding.');
//             return;
//         }
//         setError('');
//         const text = new fabric.Textbox(textContent, {
//             left: 50,
//             top: 50,
//             fontFamily: 'Arial',
//             fontSize: 24,
//             fill: '#2c3e50', // dark text color matching theme
//             editable: true,
//             width: 200,
//         });
//         canvas.add(text);
//         canvas.setActiveObject(text);
//         canvas.renderAll();
//         setTextContent('');
//     };

//     const addRectangle = () => {
//         if (!canvas) return;
//         const rect = new fabric.Rect({
//             left: 50,
//             top: 50,
//             width: 150,
//             height: 100,
//             fill: '#2980b9', // primary blue from your theme
//             stroke: '#1c5980',
//             strokeWidth: 2,
//         });
//         canvas.add(rect);
//         canvas.renderAll();
//     };

//     const addCircle = () => {
//         if (!canvas) return;
//         const circle = new fabric.Circle({
//             left: 50,
//             top: 50,
//             radius: 50,
//             fill: '#27ae60', // secondary green from your theme
//             stroke: '#1f7a3a',
//             strokeWidth: 2,
//         });
//         canvas.add(circle);
//         canvas.renderAll();
//     };

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file || !canvas) return;

//         if (!file.type.startsWith('image/')) {
//             setError('Please upload a valid image file.');
//             return;
//         }

//         setError('');
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             fabric.Image.fromURL(event.target.result, (img) => {
//                 img.scaleToWidth(selectedTemplate ? selectedTemplate.width * 0.8 : 300);
//                 img.set({
//                     left: canvas.getWidth() / 2 - img.getScaledWidth() / 2,
//                     top: canvas.getHeight() / 2 - img.getScaledHeight() / 2,
//                 });
//                 canvas.add(img);
//                 canvas.setActiveObject(img);
//                 canvas.renderAll();
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
//         link.download = 'design.png';
//         link.href = dataURL;
//         link.click();
//     };

//     return (
//         <>
//             <Head>
//                 <title>Canva-Style Online Design Tool</title>
//                 <meta
//                     name="description"
//                     content="Create stunning designs with our free online Canva-style editor. Use templates, add text, shapes, and images."
//                 />
//                 <meta name="keywords" content="design tool, online editor, canvas, fabric.js, create designs, templates" />
//             </Head>

//             {/* Google AdSense script - replace with your actual client id */}
//             <Script
//                 strategy="afterInteractive"
//                 src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
//                 crossOrigin="anonymous"
//             />
//             {/* AdSense placeholder */}
//             <ins
//                 className="adsbygoogle block my-6"
//                 style={{ display: 'block', textAlign: 'center' }}
//                 data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
//                 data-ad-slot="1234567890"
//                 data-ad-format="auto"
//                 data-full-width-responsive="true"
//             ></ins>

//             <main className="max-w-6xl mx-auto p-6 bg-background rounded-lg shadow-soft dark:bg-gray-900 dark:text-gray-100 transition-colors">
//                 <header className="mb-6">
//                     <h1 className="text-4xl font-bold text-primary mb-1">Canva-Style Design Tool</h1>
//                     <p className="text-secondary font-medium">
//                         Create stunning designs with our free online editor
//                     </p>
//                 </header>

//                 <div className="flex flex-col md:flex-row gap-6">
//                     {/* Sidebar */}
//                     <aside className="md:w-72 bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-6 shadow-soft">
//                         {/* Templates */}
//                         <section>
//                             <h2 className="font-semibold text-xl mb-3">Templates</h2>
//                             <div className="grid grid-cols-1 gap-3">
//                                 {templates.map((template) => (
//                                     <button
//                                         key={template.id}
//                                         onClick={() => handleTemplateSelect(template)}
//                                         className={`p-3 rounded-md border transition-colors text-left
//                       ${
//                                             selectedTemplate?.id === template.id
//                                                 ? 'border-primary bg-primary text-white'
//                                                 : 'border-gray-300 hover:border-primary hover:bg-primary/10 dark:border-gray-600 dark:hover:border-secondary'
//                                         }`}
//                                         aria-pressed={selectedTemplate?.id === template.id}
//                                     >
//                                         <div
//                                             className="template-preview mb-2 rounded-sm border border-dashed border-gray-300 dark:border-gray-600"
//                                             style={{
//                                                 width: '100%',
//                                                 height: '80px',
//                                                 backgroundColor: '#f8f9fa',
//                                             }}
//                                             aria-hidden="true"
//                                         ></div>
//                                         <div className="text-sm font-medium">{template.name}</div>
//                                         <div className="text-xs text-gray-500 dark:text-gray-400">
//                                             {template.width} × {template.height}px
//                                         </div>
//                                     </button>
//                                 ))}
//                             </div>
//                         </section>

//                         {/* Elements */}
//                         <section>
//                             <h2 className="font-semibold text-xl mb-3">Elements</h2>
//                             <div className="flex flex-wrap gap-3 mb-4">
//                                 <button
//                                     className={`tool-button flex items-center gap-2 px-3 py-2 rounded-md font-semibold transition-colors
//                     ${
//                                         activeTool === 'text'
//                                             ? 'bg-primary text-white'
//                                             : 'bg-background border border-gray-300 hover:bg-primary/10 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-secondary/20 dark:text-gray-100'
//                                     }`}
//                                     onClick={() => setActiveTool('text')}
//                                     aria-pressed={activeTool === 'text'}
//                                     type="button"
//                                 >
//                                     <FiText /> Text
//                                 </button>
//                                 <button
//                                     className="tool-button flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-background border border-gray-300 hover:bg-primary/10 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-secondary/20 dark:text-gray-100"
//                                     onClick={addRectangle}
//                                     type="button"
//                                     aria-label="Add rectangle shape"
//                                 >
//                                     <FiSquare /> Rectangle
//                                 </button>
//                                 <button
//                                     className="tool-button flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-background border border-gray-300 hover:bg-primary/10 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-secondary/20 dark:text-gray-100"
//                                     onClick={addCircle}
//                                     type="button"
//                                     aria-label="Add circle shape"
//                                 >
//                                     <FiCircle /> Circle
//                                 </button>
//                             </div>

//                             {/* Text input and add button */}
//                             {activeTool === 'text' && (
//                                 <div className="flex gap-2">
//                                     <input
//                                         type="text"
//                                         className="flex-grow p-2 rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
//                                         placeholder="Enter text"
//                                         value={textContent}
//                                         onChange={(e) => setTextContent(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (e.key === 'Enter') {
//                                                 e.preventDefault();
//                                                 addText();
//                                             }
//                                         }}
//                                         aria-label="Text to add to canvas"
//                                     />
//                                     <button
//                                         className="px-4 py-2 bg-secondary hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
//                                         onClick={addText}
//                                         type="button"
//                                     >
//                                         Add
//                                     </button>
//                                 </div>
//                             )}

//                             {/* Image upload */}
//                             <input
//                                 type="file"
//                                 id="image-upload"
//                                 accept="image/*"
//                                 onChange={handleImageUpload}
//                                 style={{ display: 'none' }}
//                             />
//                             <label
//                                 htmlFor="image-upload"
//                                 className="inline-flex items-center gap-2 cursor-pointer mt-4 px-3 py-2 bg-primary hover:bg-blue-700 text-white rounded-md font-semibold select-none"
//                             >
//                                 <FiImage /> Add Image
//                             </label>

//                             {/* Error message */}
//                             {error && (
//                                 <p className="mt-3 text-red-600 dark:text-red-400 font-medium" role="alert">
//                                     {error}
//                                 </p>
//                             )}
//                         </section>
//                     </aside>

//                     {/* Canvas */}
//                     <section
//                         className="flex-grow bg-white rounded-lg shadow-soft dark:bg-gray-800 p-4 flex flex-col items-center justify-center min-h-[400px]"
//                         aria-label="Design canvas"
//                     >
//                         {selectedTemplate ? (
//                             <canvas
//                                 ref={canvasRef}
//                                 id="design-canvas"
//                                 className="border border-gray-300 dark:border-gray-600 rounded-md"
//                             />
//                         ) : (
//                             <p className="text-gray-500 dark:text-gray-400 italic">
//                                 Select a template to start designing
//                             </p>
//                         )}

//                         {/* Download button */}
//                         {selectedTemplate && (
//                             <button
//                                 onClick={handleDownload}
//                                 className="mt-6 flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
//                                 aria-label="Download design as PNG"
//                                 type="button"
//                             >
//                                 <FiDownload /> Download Design
//                             </button>
//                         )}
//                     </section>
//                 </div>
//             </main>
//         </>
//     );
// }
