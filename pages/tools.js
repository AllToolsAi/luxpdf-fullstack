// pages/tools.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PDFTools() {
    const [activeCategory, setActiveCategory] = useState('organize');

    const tools = {
        organize: [
            { name: 'Merge PDF', desc: 'Combine multiple PDFs into one', icon: '🧩', path: '/merge-pdf' },
            { name: 'Split PDF', desc: 'Divide a PDF into separate files', icon: '✂️', path: '/split-pdf' },
            // ... other organize tools
        ],
        optimize: [
            { name: 'Compress PDF', desc: 'Reduce the file size', icon: '🗜️', path: '/compress-pdf' },
            // ... other optimize tools
        ],
        // ... other categories
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>PDF Tools | All Tools</title>
            </Head>

            <header className="bg-white shadow-sm">
                <div className="container mx-auto p-4 flex justify-between items-center">
                    <Link href="/">
                        <a className="text-blue-600 font-bold text-xl">PDF Tools</a>
                    </Link>
                    <nav>
                        <Link href="/">
                            <a className="text-gray-600 hover:text-blue-600 ml-4">Home</a>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">All PDF Tools</h1>

                {/* Category Navigation */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {Object.keys(tools).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full ${
                                activeCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools[activeCategory].map((tool) => (
                        <Link key={tool.name} href={tool.path}>
                            <a className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 block">
                                <div className="text-3xl mb-3">{tool.icon}</div>
                                <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
                                <p className="text-gray-600">{tool.desc}</p>
                                <div className="mt-4 text-blue-600 font-medium">Use Tool</div>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}