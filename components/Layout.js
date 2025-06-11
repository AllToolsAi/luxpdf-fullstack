import Footer from './Footer';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-heading font-inter">
            {/* Header - Added mt-2 (or mt-4) for spacing */}
            <header className="bg-white shadow sticky top-2 z-40 border-b border-gray-200 mt-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="logo-circle">
                            Elite PDF Tools
                            <meta name="google-adsense-account" content="ca-pub-8985590835205084"/>

                        </div>
                        <span className="text-xl font-bold text-primary">Toolkit</span>
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium">
                        <Link href="/tools/merge" className="hover:text-primary transition">Merge</Link>
                        <Link href="/tools/split" className="hover:text-primary transition">Split</Link>
                        <Link href="/tools/extract" className="hover:text-primary transition">Extract</Link>
                        <Link href="/tools/remove" className="hover:text-primary transition">Remove</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Vercel Analytics */}
            <Analytics />
        </div>
    );
}
