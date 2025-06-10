import Link from 'next/link';
import {
    FileText,
    Scissors,
    Trash2,
    FileOutput,
    ShieldCheck,
    Mail,
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-16 text-sm text-gray-600">

            <div className="border-t border-gray-200 text-center text-xs text-gray-400 py-5 select-none">
                © {new Date().getFullYear()} PDF Toolkit — All rights reserved.
            </div>
        </footer>
    );
}
