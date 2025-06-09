// import { useState } from 'react';
// import Head from 'next/head';
// import CodeEditor from '../../../components/CodeEditor';
// import { FaCompressAlt, FaCopy } from 'react-icons/fa';

// // Languages options with readable names
// const languageOptions = [
//     { id: 'javascript', name: 'JavaScript' },
//     { id: 'css', name: 'CSS' },
//     { id: 'html', name: 'HTML' },
// ];

// export default function CodeMinifier() {
//     const [inputCode, setInputCode] = useState('');
//     const [minifiedCode, setMinifiedCode] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [options, setOptions] = useState({
//         preserveComments: false,
//         removeWhitespace: true,
//     });

//     // Basic minify function — recommend using libraries like terser, cssnano, html-minifier for production
//     const minifyCode = () => {
//         let result = inputCode;

//         if (options.removeWhitespace) {
//             result = result.replace(/\s+/g, ' ').trim();
//         }

//         if (!options.preserveComments) {
//             if (language === 'javascript') {
//                 result = result.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
//             } else if (language === 'css') {
//                 result = result.replace(/\/\*[\s\S]*?\*\//g, '');
//             } else if (language === 'html') {
//                 result = result.replace(/<!--[\s\S]*?-->/g, '');
//             }
//         }

//         setMinifiedCode(result);
//     };

//     return (
//         <>
//             <Head>
//                 <title>Code Minifier - Compress JavaScript, CSS, HTML | YourSite</title>
//                 <meta
//                     name="description"
//                     content="Minify and compress your JavaScript, CSS, or HTML code easily with our free online tool. Remove comments and whitespace to optimize your code."
//                 />
//                 <meta name="robots" content="index, follow" />
//             </Head>

//             {/* AdSense placeholder (replace with actual AdSense script and unit IDs) */}
//             <div className="mb-4 flex justify-center">
//                 {/* <ins className="adsbygoogle"
//           style={{ display: 'block', width: '728px', height: '90px' }}
//           data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
//           data-ad-slot="xxxxxxxxxx"
//           data-ad-format="auto"
//           data-full-width-responsive="true"></ins>
//         <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
//             </div>

//             <main className="container mx-auto px-4 py-8 max-w-6xl">
//                 <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
//                     Code Minifier
//                 </h1>

//                 <div className="grid md:grid-cols-2 gap-6 mb-6">
//                     {/* Input Editor */}
//                     <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
//                         <label htmlFor="language-select" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
//                             Select Language:
//                         </label>
//                         <select
//                             id="language-select"
//                             aria-label="Select programming language"
//                             value={language}
//                             onChange={(e) => setLanguage(e.target.value)}
//                             className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mb-4 w-full text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
//                         >
//                             {languageOptions.map((lang) => (
//                                 <option key={lang.id} value={lang.id}>
//                                     {lang.name}
//                                 </option>
//                             ))}
//                         </select>

//                         <CodeEditor
//                             language={language}
//                             value={inputCode}
//                             onChange={setInputCode}
//                             height="400px"
//                         />
//                     </section>

//                     {/* Output Editor */}
//                     <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="font-semibold text-gray-800 dark:text-gray-200">Minified Output</h2>
//                             <button
//                                 onClick={() => navigator.clipboard.writeText(minifiedCode)}
//                                 disabled={!minifiedCode}
//                                 aria-label="Copy minified code"
//                                 title="Copy to clipboard"
//                                 className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
//                             >
//                                 <FaCopy />
//                             </button>
//                         </div>

//                         <CodeEditor
//                             language={language}
//                             value={minifiedCode}
//                             readOnly
//                             height="400px"
//                         />
//                     </section>
//                 </div>

//                 {/* Minification Options */}
//                 <section className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-6 max-w-xl mx-auto">
//                     <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Minification Options</h3>
//                     <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
//                         <label className="flex items-center space-x-2 cursor-pointer select-none">
//                             <input
//                                 type="checkbox"
//                                 checked={options.preserveComments}
//                                 onChange={() => setOptions((prev) => ({ ...prev, preserveComments: !prev.preserveComments }))}
//                                 className="cursor-pointer"
//                             />
//                             <span>Preserve Comments</span>
//                         </label>

//                         <label className="flex items-center space-x-2 cursor-pointer select-none">
//                             <input
//                                 type="checkbox"
//                                 checked={options.removeWhitespace}
//                                 onChange={() => setOptions((prev) => ({ ...prev, removeWhitespace: !prev.removeWhitespace }))}
//                                 className="cursor-pointer"
//                             />
//                             <span>Remove Whitespace</span>
//                         </label>
//                     </div>
//                 </section>

//                 {/* Minify Button */}
//                 <div className="flex justify-center">
//                     <button
//                         onClick={minifyCode}
//                         disabled={!inputCode}
//                         className={`px-6 py-3 rounded-lg font-medium flex items-center transition ${
//                             !inputCode
//                                 ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//                         }`}
//                         aria-disabled={!inputCode}
//                         aria-label="Minify code"
//                         title="Minify code"
//                     >
//                         <FaCompressAlt className="mr-2" /> Minify Code
//                     </button>
//                 </div>
//             </main>

//             {/* AdSense placeholder (replace with actual AdSense script and unit IDs) */}
//             <div className="mt-8 flex justify-center">
//                 {/* <ins className="adsbygoogle"
//           style={{ display: 'block', width: '728px', height: '90px' }}
//           data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
//           data-ad-slot="xxxxxxxxxx"
//           data-ad-format="auto"
//           data-full-width-responsive="true"></ins>
//         <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
//             </div>
//         </>
//     );
// }
