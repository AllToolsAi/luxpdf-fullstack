import Link from 'next/link';
import { useRouter } from 'next/router';

const tools = [
    { name: 'Merge PDF', href: '/tools/pdf/merge' },
    { name: 'Split PDF', href: '/tools/pdf/split' },
    { name: 'Compress PDF', href: '/tools/pdf/compress' },
    { name: 'Extract PDF Pages', href: '/tools/pdf/extract' },
    { name: 'Remove PDF Pages', href: '/tools/pdf/remove' },
];

export default function ToolsNavigation({ className = '' }) {
    const router = useRouter();

    return (
        <nav className={`flex justify-center space-x-4 overflow-x-auto ${className}`}>
            {tools.map(({ name, href }) => {
                const isActive = router.pathname === href;
                return (
                    <Link key={href} href={href} legacyBehavior>
                        <a
                            className={`whitespace-nowrap px-4 py-2 rounded-md font-medium transition 
                ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-primary/10'}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {name}
                        </a>
                    </Link>
                );
            })}
        </nav>
    );
}
