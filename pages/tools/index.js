import Link from 'next/link';

const menuItems = [
    {
        label: 'AI',
        items: [
            { name: 'Chat', path: '/tools/ai/chat' },
            { name: 'Email Assistant', path: '/tools/ai/email-assistant' },
            { name: 'Headline Generator', path: '/tools/ai/headline-generator' },
            { name: 'Paraphrase', path: '/tools/ai/paraphrase' },
            { name: 'Voice Studio', path: '/tools/ai/voice-studio' },
        ],
    },
    {
        label: 'Data',
        items: [
            { name: 'JSON Converter', path: '/tools/data/json-converter' },
            { name: 'XML Converter', path: '/tools/data/xml-converter' },
        ],
    },
    {
        label: 'Document',
        items: [
            { name: 'CV Generator', path: '/tools/document/cv-generator' },
        ],
    },
    {
        label: 'Converter',
        items: [
            { name: 'All File Formatter', path: '/tools/converter/all-file-formatter' },
        ],
    },
    {
        label: 'Media',
        items: [
            { name: 'Audio Converter', path: '/tools/media/audio-converter' },
            { name: 'MP4 to MP3', path: '/tools/media/mp4-to-mp3' },
            { name: 'Video Converter', path: '/tools/media/video-converter' },
        ],
    },
    {
        label: 'PDF Tools',
        items: [
            { name: 'Add Watermark', path: '/tools/pdf/add-watermark' },
            { name: 'Crop PDF', path: '/tools/pdf/crop' },
            { name: 'PDF to JPG', path: '/tools/pdf/to-jpg' },
            { name: 'Repair PDF', path: '/tools/pdf/repair' },
            { name: 'Rotate', path: '/tools/pdf/rotate' },
        ],
    },
    {
        label: 'Programming',
        items: [
            { name: 'Code Diff Checker', path: '/tools/programming/code-diff' },
            { name: 'Code Editor', path: '/tools/programming/editor' },
            { name: 'Diff', path: '/tools/programming/diff' },
            { name: 'Formatter', path: '/tools/programming/formatter' },
        ],
    },
    {
        label: 'Universal Converter',
        items: [
            { name: 'Coming Soon', path: '/coming-soon' },
        ],
    },
];

export default function ToolsPage() {
    return (
        <main className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-8 text-center text-red-600">All Tools</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {menuItems.map((category) => (
                    <section key={category.label} className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 text-primary">{category.label}</h2>
                        <ul className="space-y-2">
                            {category.items.map((tool) => (
                                <li key={tool.name}>
                                    <Link
                                        href={tool.path}
                                        className="block px-4 py-2 rounded hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                                    >
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </main>
    );
}
