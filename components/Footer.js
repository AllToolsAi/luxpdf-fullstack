import Link from 'next/link';
import { FileText, Scissors, Trash2, FileOutput, ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-background text-muted border-t mt-16">
            <div className="max-w-screen-xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Left Section – Tagline */}
                <div>
                    <h2 className="text-2xl font-bold text-heading mb-4">
                        We ❤️ building free PDF tools
                    </h2>
                    <p className="leading-relaxed">
                        No watermarks. No sign-up. No nonsense. Just simple, private, and fast tools to manage your PDFs — completely free.
                    </p>
                </div>

                {/* Middle Section – PDF Tools */}
                <div>
                    <h3 className="text-lg font-semibold text-heading mb-4">PDF Tools</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <Link href="/tools/pdf/merge" className="hover:text-primary transition">
                                Merge PDF
                            </Link>
                        </li>
                        <li className="flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-primary" />
                            <Link href="/tools/pdf/split" className="hover:text-primary transition">
                                Split PDF
                            </Link>
                        </li>
                        <li className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4 text-primary" />
                            <Link href="/tools/pdf/remove" className="hover:text-primary transition">
                                Remove Pages
                            </Link>
                        </li>
                        <li className="flex items-center gap-2">
                            <FileOutput className="w-4 h-4 text-primary" />
                            <Link href="/tools/pdf/extract" className="hover:text-primary transition">
                                Extract Pages
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right Section – Company Info */}
                <div>
                    <h3 className="text-lg font-semibold text-heading mb-4">Company</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <Link href="/privacy" className="hover:text-primary transition">
                                Privacy Policy
                            </Link>
                        </li>
                        <li className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <Link href="/terms" className="hover:text-primary transition">
                                Terms of Service
                            </Link>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <Link href="/contact" className="hover:text-primary transition">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t text-center text-xs text-muted py-5">
                © {new Date().getFullYear()} PDF Toolkit — All rights reserved.
            </div>
        </footer>
    );
}
