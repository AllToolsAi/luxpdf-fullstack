import Link from 'next/link';

export default function ToolHeader({ title, icon, category }) {
    return (
        <div className="mb-8">
            <nav className="flex items-center text-sm text-gray-600 mb-4">
                <Link href="/tools" legacyBehavior>
                    <a className="hover:text-blue-600 hover:underline">All Tools</a>
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">{category}</span>
            </nav>

            <div className="flex items-center">
                {icon && (
                    <span className="text-3xl mr-4" aria-hidden="true">
            {icon}
          </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
        </div>
    );
}
