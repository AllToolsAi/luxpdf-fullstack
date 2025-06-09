import { useState, useRef, useEffect } from 'react';
import { FiCopy, FiSave, FiSun, FiMoon, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs';


import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'typescript', label: 'TypeScript' },
];

export default function CodeEditor() {
    const [code, setCode] = useState(
        `// Welcome to Code Editor\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Developer"));`
    );
    const [language, setLanguage] = useState('javascript');
    const [darkMode, setDarkMode] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => console.error('Failed to copy:', err));
    };

    const handleSave = () => {
        try {
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `code.${language}`;
            a.click();
            URL.revokeObjectURL(url);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (err) {
            console.error('Failed to save:', err);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.()
                .catch(err => console.error('Error attempting to enable fullscreen:', err));
        } else {
            document.exitFullscreen?.()
                .catch(err => console.error('Error attempting to exit fullscreen:', err));
        }
    };

    useEffect(() => {
        const onFull = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFull);
        return () => document.removeEventListener('fullscreenchange', onFull);
    }, []);

    // Trigger Adsense after component mounts
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('Adsense error:', e);
        }
    }, []);

    return (
        <Layout>
            <SEO
                title="Online Code Editor | Syntax Highlighting Tool"
                description="Free online code editor with syntax highlighting. Supports JS, Python, Java, and more."
                keywords="code editor, syntax highlighting, online IDE, JavaScript editor, Python editor"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
            />

            <section className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80vh]">
                <div className="max-w-4xl mx-auto px-4 space-y-6">
                    <h1 className="text-4xl font-bold text-center">Online Code Editor</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400">Edit, highlight, and save your code snippets</p>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                        >
                            {languageOptions.map((l) => (
                                <option key={l.value} value={l.value}>{l.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-3 py-1 border rounded dark:border-gray-700 dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                        <button onClick={handleCopy} className="px-4 py-1 bg-blue-100 dark:bg-blue-700 rounded flex items-center gap-2">
                            <FiCopy /> {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                        <button onClick={handleSave} className="px-4 py-1 bg-green-100 dark:bg-green-700 rounded flex items-center gap-2">
                            <FiSave /> {isSaved ? 'Saved!' : 'Save'}
                        </button>
                        <button onClick={toggleFullscreen} className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center gap-2">
                            {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                        </button>
                    </div>

                    <div ref={containerRef} className="relative border rounded-lg dark:border-gray-700 overflow-hidden">
                        <SyntaxHighlighter
                            language={language}
                            style={darkMode ? atomOneDark : github}
                            customStyle={{ margin: 0, padding: '1rem', fontSize: '14px', minHeight: '300px' }}
                            showLineNumbers
                            className="relative z-0"
                        >
                            {code}
                        </SyntaxHighlighter>
                        <textarea
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            spellCheck="false"
                            className="absolute inset-0 w-full h-full z-10 bg-transparent font-mono p-4 resize-none focus:outline-none"
                            style={{
                                color: darkMode ? 'white' : 'black',
                                caretColor: darkMode ? 'white' : 'black',
                                backgroundColor: 'transparent',
                            }}
                        />

                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded text-sm">
                        <strong>Tips:</strong> Choose a language, switch themes, and click save to download your code.
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
