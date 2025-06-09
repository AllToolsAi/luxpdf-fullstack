import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toolCategories = [
        {
            category: 'PDF Tools',
            tools: [
                { href: '/tools/pdf/merge', label: 'Merge PDF' },
                { href: '/tools/pdf/split', label: 'Split PDF' },
                { href: '/tools/pdf/compress', label: 'Compress PDF' },
            ],
        },
        {
            category: 'Conversion',
            tools: [
                { href: '/tools/pdf/to-word', label: 'PDF to Word' },
                { href: '/tools/pdf/to-ppt', label: 'PDF to PPT' },
                { href: '/tools/pdf/to-jpg', label: 'PDF to JPG' },
            ],
        },
        {
            category: 'Other',
            tools: [
                { href: '/tools/pdf/sign', label: 'Sign PDF' },
                { href: '/tools/pdf/protect', label: 'Protect PDF' },
            ],
        },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-md">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo on left */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg select-none">
                        P
                    </div>
                    <span className="text-2xl font-extrabold text-primary select-none">
            PDF Toolkit
          </span>
                </Link>

                {/* Center dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="inline-flex items-center gap-1 px-4 py-2 text-gray-700 font-semibold hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                    >
                        Tools
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                                dropdownOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[560px] bg-white border border-gray-200 rounded-md shadow-lg z-50 p-6 grid grid-cols-3 gap-6">
                            {toolCategories.map(({ category, tools }) => (
                                <div key={category}>
                                    <h3 className="mb-3 text-sm font-semibold text-gray-900">{category}</h3>
                                    <ul className="space-y-2">
                                        {tools.map(({ href, label }) => (
                                            <li key={href}>
                                                <Link
                                                    href={href}
                                                    className={`block text-gray-700 hover:text-primary transition-colors ${
                                                        router.pathname === href ? 'font-bold text-primary' : ''
                                                    }`}
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    {label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Empty div on right to balance layout */}
                <div style={{ width: '2rem' }}></div>
            </nav>
        </header>
    );
}
