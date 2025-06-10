import Head from 'next/head';
import Layout from '../components/Layout';
import {useState, useRef} from 'react';

const mainCategories = [
    {
        name: 'PDF Tools',
        icon: '📄',
        description: 'Edit, convert and optimize PDF documents',
        tools: [
            {name: 'Add Watermark', path: '/tools/pdf/add-watermark'},
            // {name: 'Crop PDF', path: '/tools/pdf/crop-pdf'},
            {name: 'PDF to JPG', path: '/tools/pdf/pdf-to-jpg-tool'},
            {name: 'Repair PDF', path: '/tools/pdf/repair-pdf'},
            {name: 'Rotate PDF', path: '/tools/pdf/rotate'},
            {name: 'Compress PDF', path: '/tools/pdf/compress-pdf'},
            {name: 'Merge PDF', path: '/tools/pdf/merge'},
            {name: 'OCR PDF', path: '/tools/pdf/ocr-pdf'},
            {name: 'Organize', path: '/tools/pdf/organize'},
            {name: 'Remove Pages', path: '/tools/pdf/remove-pages'},
            {name: 'Split PDF', path: '/tools/pdf/split'},


        ],
    },
    {
        name: 'AI Tools',
        icon: '🤖',
        description: 'AI-powered content creation tools',
        tools: [
            {name: 'Chat', path: '/tools/ai/chat'},
            {name: 'Email Assistant', path: '/tools/ai/email-assistant'},
            {name: 'Headline Generator', path: '/tools/ai/headline-generator'},
            {name: 'Paraphrase', path: '/tools/ai/paraphrase'},
            {name: 'Paraphrase', path: '/tools/ai/voice-studio'},
        ],
    },
    {
        name: 'Media Tools',
        icon: '🎵',
        description: 'Audio and video conversion tools',
        tools: [
            {name: 'Audio Converter', path: '/tools/media/audio-converter'},
            {name: 'MP4 to MP3', path: '/tools/media/mp4-to-mp3'},
            {name: 'Video Converter', path: '/tools/media/video-converter'},
        ],
    },
    {
        name: 'Document Tools',
        icon: '📑',
        description: 'Create and edit professional documents',
        tools: [
            {name: 'CV Generator', path: '/tools/document/cv-generator'},
            {name: 'All File Formatter', path: '/tools/converter/all-file-formatter'},
        ],
    },
    {
        name: 'Data Tools',
        icon: '📊',
        description: 'Data format conversion tools',
        tools: [
            {name: 'JSON Converter', path: '/tools/data/json-converter'},
            {name: 'XML Converter', path: '/tools/data/xml-converter'},
        ],
    },
    {
        name: 'Programming',
        icon: '💻',
        description: 'Developer tools and utilities',
        tools: [
            {name: 'Code Diff Checker', path: '/tools/programming/code-diff'},
            {name: 'Code Editor', path: '/tools/programming/editor'},
            {name: 'Diff', path: '/tools/programming/diff'},
            {name: 'Formatter', path: '/tools/programming/formatter'},
        ],
    },
];

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>All Tools - PDF Elegance</title>
                <meta name="description" content="Complete collection of PDF, document, and media tools"/>
            </Head>

            <main style={{backgroundColor: '#f6f9fc', minHeight: '100vh', fontFamily: "'Inter', sans-serif"}}>
                {/* Hero Section */}
                <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#212529'}}>
                        Powerful Tools for Your Documents
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto" style={{color: '#212529cc'}}>
                        Convert, edit and optimize your files with our collection of easy-to-use tools
                    </p>
                </section>

                {/* Tools Grid */}
                <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mainCategories.map((category) => (
                            <div key={category.name} className="tool-card">
                                <div className="flex flex-col items-center text-center">
                                    <div className="tool-icon" aria-hidden="true">
                                        {category.icon}
                                    </div>
                                    <h2 className="text-lg font-semibold mb-1" style={{color: '#212529'}}>
                                        {category.name}
                                    </h2>
                                    <p className="text-sm mb-4" style={{color: '#6c757d'}}>
                                        {category.description}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {category.tools.map((tool) => (
                                        <a
                                            key={tool.name}
                                            href={tool.path}
                                            className="tool-link"
                                            title={tool.name}
                                        >
                                            <span>{tool.name}</span>
                                            <span aria-hidden="true"
                                                  style={{color: '#e5322d', fontWeight: '700', fontSize: '1.25rem'}}>
                        →
                      </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary text-white py-16 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-6">Need something else?</h2>
                        <p className="text-xl mb-8">
                            We're constantly adding new tools. Let us know what you need!
                        </p>
                        <a
                            href="mailto:support@pdfelegance.com"
                            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                            Suggest a Tool
                        </a>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
