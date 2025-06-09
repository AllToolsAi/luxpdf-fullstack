// 'use client';

// import { useState } from 'react';
// import Layout from '../../../components/Layout';
// import SEO from '../../../components/SEOMeta';
// import { FiImage, FiFileText } from 'react-icons/fi';
// import PDFtoJPG from './pdf-to-jpg-tool'; // Extract logic from original into a reusable component
// import JPGtoPDF from './jpg-to-pdf-tool'; // We’ll create this next

// export default function PDFToolsSwitcher() {
//     const [activeTool, setActiveTool] = useState('pdf-to-jpg');

//     return (
//         <Layout>
//             <SEO
//                 title="PDF Converter - JPG to PDF and PDF to JPG"
//                 description="Convert PDFs to JPGs and vice versa. Select a tool below to get started."
//             />
//             <section className="py-16 min-h-[80vh]">
//                 <div className="max-w-screen-xl mx-auto px-4">
//                     <h1 className="text-4xl font-bold text-center mb-8">
//                         Convert Between PDF and JPG
//                     </h1>

//                     {/* Tool Switcher */}
//                     <div className="flex justify-center gap-6 mb-8">
//                         <label className="inline-flex items-center gap-2 text-lg font-medium">
//                             <input
//                                 type="radio"
//                                 value="pdf-to-jpg"
//                                 checked={activeTool === 'pdf-to-jpg'}
//                                 onChange={() => setActiveTool('pdf-to-jpg')}
//                             />
//                             <FiFileText /> PDF to JPG
//                         </label>
//                         <label className="inline-flex items-center gap-2 text-lg font-medium">
//                             <input
//                                 type="radio"
//                                 value="jpg-to-pdf"
//                                 checked={activeTool === 'jpg-to-pdf'}
//                                 onChange={() => setActiveTool('jpg-to-pdf')}
//                             />
//                             <FiImage /> JPG to PDF
//                         </label>
//                     </div>

//                     {/* Render selected tool */}
//                     {activeTool === 'pdf-to-jpg' ? <PDFtoJPG /> : <JPGtoPDF />}
//                 </div>
//             </section>
//         </Layout>
//     );
// }
