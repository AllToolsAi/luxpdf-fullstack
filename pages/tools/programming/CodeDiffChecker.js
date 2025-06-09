'use client';

import { useState, useEffect, useRef } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { FiCopy, FiSun, FiMoon, FiMaximize2, FiMinimize2, FiRefreshCw } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
];

export default function CodeDiffChecker() {
    const [original, setOriginal] = useState(
        `// Original code\nfunction greet(name) {\n  return "Hello, " + name;\n}\n\ngreet("World");`
    );
    const [modified, setModified] = useState(
        `// Modified code\nfunction greet(name, greeting = "Hello") {\n  return \`\${greeting}, \${name}\`;\n}\n\ngreet("World", "Hi");`
    );
    const [language, setLanguage] = useState('javascript');
    const [darkMode, setDarkMode] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef(null);

    const handleReset = () => {
        setOriginal(`// Original code\nfunction example() {\n  // Your original code here\n}`);
        setModified(`// Modified code\nfunction example() {\n  // Your modified code here\n}`);
        setError('');
    };

    const handleCopyOriginal = async () => {
        try {
            await navigator.clipboard.writeText(original);
            setError('Original code copied!');
            setTimeout(() => setError(''), 2000);
        } catch (err) {
            setError('Failed to copy original code');
        }
    };

    const handleCopyModified = async () => {
        try {
            await navigator.clipboard.writeText(modified);
            setError('Modified code copied!');
            setTimeout(() => setError(''), 2000);
        } catch (err) {
            setError('Failed to copy modified code');
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.()
                .catch(err => setError('Fullscreen error: ' + err.message));
        } else {
            document.exitFullscreen?.()
                .catch(err => setError('Fullscreen error: ' + err.message));
        }
    };

    useEffect(() => {
        const onFull = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFull);
        return () => document.removeEventListener('fullscreenchange', onFull);
    }, []);

    return (
        <Layout>
            <SEO
                title="Advanced Code Diff Checker | Compare Code Changes"
                description="Powerful side-by-side code comparison tool with syntax highlighting. Perfect for reviewing changes in JavaScript, Python, Java and more."
                keywords="code diff, code comparison, git diff, javascript diff, python diff, code review tool"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
            />

            <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">Code Diff Checker</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Compare and analyze code changes side by side</p>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                        >
                            {languageOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="px-3 py-1 border rounded dark:border-gray-700 dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                            </button>
                            <button
                                onClick={handleCopyOriginal}
                                className="px-4 py-1 bg-blue-100 dark:bg-blue-700 rounded flex items-center gap-2"
                            >
                                <FiCopy /> Original
                            </button>
                            <button
                                onClick={handleCopyModified}
                                className="px-4 py-1 bg-green-100 dark:bg-green-700 rounded flex items-center gap-2"
                            >
                                <FiCopy /> Modified
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-1 bg-red-100 dark:bg-red-700 rounded flex items-center gap-2"
                            >
                                <FiRefreshCw /> Reset
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center gap-2"
                            >
                                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={`p-3 rounded ${error.includes('Failed') ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
                            {error}
                        </div>
                    )}

                    <div ref={containerRef} className="border rounded-lg dark:border-gray-700 overflow-hidden">
                        <DiffEditor
                            height="70vh"
                            language={language}
                            original={original}
                            modified={modified}
                            onChange={value => setModified(value || '')}
                            theme={darkMode ? 'vs-dark' : 'light'}
                            options={{
                                readOnly: false,
                                renderSideBySide: true,
                                minimap: { enabled: false },
                                automaticLayout: true,
                                fontSize: 14,
                                wordWrap: 'on',
                                scrollBeyondLastLine: false,
                                renderWhitespace: 'all',
                                originalEditable: true,
                            }}
                        />
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded text-sm">
                        <strong>Tips:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Edit either panel to see live differences</li>
                            <li>Use the language selector for proper syntax highlighting</li>
                            <li>Green highlights show additions, red shows deletions</li>
                            <li>Fullscreen mode provides maximum viewing area</li>
                        </ul>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-center">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        ></ins>
                    </div>
                </div>
            </section>
        </Layout>
    );
}