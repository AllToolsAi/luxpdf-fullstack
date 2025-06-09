import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRefs = useRef({});

    const toolCategories = [
        {
            key: 'pdf',
            label: 'PDF Tools',
            tools: [
                { href: '/tools/pdf/merge', label: 'Merge PDF' },
                { href: '/tools/pdf/split', label: 'Split PDF' },
                { href: '/tools/pdf/compress', label: 'Compress PDF' },
            ],
        },
        {
            key: 'conversion',
            label: 'Conversion',
            tools: [
                { href: '/tools/pdf/to-word', label: 'PDF → Word' },
                { href: '/tools/pdf/to-ppt', label: 'PDF → PPT' },
                { href: '/tools/pdf/to-jpg', label: 'PDF → JPG' },
            ],
        },
        {
            key: 'other',
            label: 'Other Tools',
            tools: [
                { href: '/tools/pdf/sign', label: 'Sign PDF' },
                { href: '/tools/pdf/protect', label: 'Protect PDF' },
            ],
        },
        {
            key: 'ai',
            label: 'AI Tools',
            tools: [
                { href: '/tools/ai/chat', label: 'AI Chat' },
                { href: '/tools/ai/email-assistant', label: 'Email Assistant' },
                { href: '/tools/ai/headline-generator', label: 'Headline Gen.' },
                { href: '/tools/ai/paraphrase', label: 'Paraphraser' },
                { href: '/tools/ai/voice-studio', label: 'Voice Studio' },
            ],
        },
        {
            key: 'data',
            label: 'Data Tools',
            tools: [
                { href: '/tools/data/json-converter', label: 'JSON Converter' },
                { href: '/tools/data/xml-converter', label: 'XML Converter' },
            ],
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            for (const key in dropdownRefs.current) {
                if (
                    dropdownRefs.current[key] &&
                    !dropdownRefs.current[key].contains(event.target)
                ) {
                    setOpenDropdown(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow border-b sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between flex-wrap gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow">
                        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                            <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm0 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm-1 6h2v12h-2zm0 14h2v2h-2z" />
                        </svg>
                    </div>
                    <span className="text-xl font-extrabold text-primary">PDF Elegance</span>
                </Link>

                {/* Dropdowns */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                    {toolCategories.map(({ key, label, tools }) => (
                        <div
                            key={key}
                            className="relative"
                            ref={(el) => (dropdownRefs.current[key] = el)}
                        >
                            <button
                                onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                                className={`text-sm px-3 py-2 font-semibold text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md flex items-center gap-1 transition-all duration-150 ${
                                    openDropdown === key ? 'bg-gray-100' : ''
                                }`}
                            >
                                <span className="truncate max-w-[9rem]" title={label}>{label}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        openDropdown === key ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {openDropdown === key && tools.length > 0 && (
                                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 max-h-72 overflow-auto animate-fadeIn">
                                    <ul className="space-y-1">
                                        {tools.map(({ href, label }) => (
                                            <li key={href}>
                                                <Link
                                                    href={href}
                                                    onClick={() => setOpenDropdown(null)}
                                                    className={`block px-3 py-2 text-sm text-gray-700 hover:text-primary transition truncate ${
                                                        router.pathname === href ? 'font-bold text-primary' : ''
                                                    }`}
                                                    title={label}
                                                >
                                                    {label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div>
                    <button className="bg-primary text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-red-700 transition">
                        Get Premium
                    </button>
                </div>
            </nav>
        </header>
    );
}
