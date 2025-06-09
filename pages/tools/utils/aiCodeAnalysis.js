'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiSun, FiMoon, FiMaximize2, FiMinimize2, FiRefreshCw, FiUpload } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function AICodeAnalyzer() {
    const [code, setCode] = useState(
        `// Example code to analyze
function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, '10'); // Potential type issue`
    );
    const [analysis, setAnalysis] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const containerRef = useRef(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'text/*': ['.js', '.ts', '.py', '.java', '.cpp']
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = e => setCode(e.target.result);
            reader.readAsText(file);
            setError('');
        }
    });

    const analyzeCode = () => {
        setIsAnalyzing(true);
        setError('');

        // Simulate AI analysis (in a real app, this would call an API)
        setTimeout(() => {
            try {
                const issues = [
                    "Potential type coercion in calculateSum() - adding number to string",
                    "Missing error handling",
                    "Function could be documented with JSDoc"
                ];
                setAnalysis(issues.join('\n\n'));
            } catch (err) {
                setError('Analysis failed');
            } finally {
                setIsAnalyzing(false);
            }
        }, 1500);
    };

    // [Include all the helper functions like handleCopy, toggleFullscreen etc. from previous examples]

    return (
        <Layout>
            <SEO
                title="AI Code Analysis | Code Quality Checker"
                description="Advanced AI-powered code analysis tool. Detect bugs, performance issues and code smells in your JavaScript, Python, Java and more."
                keywords="code analysis, AI code review, static analysis, code quality, bug detection"
            />

            {/* [Include AdSense script like in previous examples] */}

            <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">AI Code Analysis</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Detect bugs and improve code quality</p>

                    {/* [Include the same control bar as previous examples] */}

                    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Input Code</h2>
                            <div {...getRootProps()} className={`p-4 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center justify-center gap-2 text-center">
                                    <FiUpload className="text-2xl" />
                                    <p>{isDragActive ? 'Drop code file here' : 'Drag & drop file or click to select'}</p>
                                </div>
                            </div>
                            <textarea
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-gray-800 border rounded focus:outline-none resize-none"
                                spellCheck="false"
                            />
                            <button
                                onClick={analyzeCode}
                                disabled={isAnalyzing || !code.trim()}
                                className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 ${(isAnalyzing || !code.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Analysis Results</h2>
                            <div className="w-full h-64 p-4 bg-white dark:bg-gray-800 border rounded overflow-auto">
                                {analysis || 'Analysis results will appear here...'}
                            </div>
                        </div>
                    </div>

                    {/* [Include tips and AdSense sections like previous examples] */}
                </div>
            </section>
        </Layout>
    );
}