import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
            { name: 'Universal Converter', path: '/tools/universal-converter' },
        ],
    },
];

export default function Header() {
    const [openMenu, setOpenMenu] = useState(null);
    const timeoutRef = useRef(null);
    const dropdownRefs = useRef([]);

    const handleMouseEnter = (index) => {
        clearTimeout(timeoutRef.current);
        setOpenMenu(index);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpenMenu(null);
        }, 200); // Slightly shorter delay than before
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (
            dropdownRefs.current.every(
                (ref) => ref && !ref.contains(event.target)
            )
        ) {
            setOpenMenu(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center">
                <Link href="/" className="text-xl font-bold text-red-600 hover:text-red-700 transition-colors">
                    PDF Elegance
                </Link>

                <div className="flex-grow flex justify-center">
                    <nav className="flex items-center space-x-2">
                        {menuItems.map((menu, index) => (
                            <div
                                key={index}
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                ref={(el) => (dropdownRefs.current[index] = el)}
                            >
                                <button
                                    className={`px-4 py-2 flex items-center gap-1 rounded-md transition-colors ${
                                        openMenu === index
                                            ? "bg-red-700 text-white"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                    aria-expanded={openMenu === index}
                                    aria-controls={`dropdown-${index}`}
                                >
                                    {menu.label}
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${
                                            openMenu === index ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    id={`dropdown-${index}`}
                                    className={`absolute left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-xl z-50 transition-all duration-200 origin-top ${
                                        openMenu === index
                                            ? "opacity-100 scale-y-100 visible"
                                            : "opacity-0 scale-y-95 invisible"
                                    }`}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <ul className="py-1">
                                        {menu.items.map((item, idx) => (
                                            <li key={idx}>
                                                <Link
                                                    href={item.path}
                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    onClick={() => setOpenMenu(null)}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}