import Link from 'next/link';

export default function ToolCard({ tool }) {
    return (
        <Link href={tool.href} passHref>
            <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition cursor-pointer text-center">
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="text-xl font-semibold text-primary">{tool.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{tool.description}</p>
            </div>
        </Link>
    );
}
