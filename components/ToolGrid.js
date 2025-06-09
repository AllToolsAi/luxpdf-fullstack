import Link from 'next/link';

export default function ToolGrid({ tools }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
                <Link href={tool.href} key={index} passHref>
                    <a className="block p-4 border rounded-lg hover:shadow-md transition-shadow dark:border-gray-700">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{tool.icon}</span>
                            <h3 className="font-bold text-lg">{tool.name}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
                    </a>
                </Link>
            ))}
        </div>
    );
}
