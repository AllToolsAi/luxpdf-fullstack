import Link from 'next/link';

export default function ToolCategory({ category }) {
    return (
        <div className="mb-16">
            <h2 className="text-3xl font-serif text-primary font-bold mb-4 flex items-center">
                <span className="text-4xl mr-2">{category.icon}</span>
                {category.name}
            </h2>
            <p className="text-gray-600 mb-6">{category.description}</p>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.tools.map((tool) => (
                    <Link href={tool.path} key={tool.name} className="bg-white shadow-soft p-5 rounded-2xl border hover:shadow-md transition group cursor-pointer block">
                        <h3
                            className="text-lg font-bold text-primary mb-2 group-hover:underline truncate"
                            title={tool.name}
                            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                            {tool.name}
                        </h3>
                        <p className="text-sm text-gray-600 min-h-[40px]">
                            {tool.description || 'No description provided'}
                        </p>
                        {tool.featured && (
                            <span className="inline-block mt-3 text-xs bg-secondary text-white px-2 py-0.5 rounded">
      Featured
    </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
