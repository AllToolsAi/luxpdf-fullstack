import Layout from '../../../components/Layout'
import ToolsNavigation from '../../../components/ToolsNavigation'
import Link from 'next/link'

export default function PdfTools() {
    const tools = [
        { name: 'Merge PDF', href: '/tools/pdf/merge' },
        // ... other tools
    ]

    return (
        <Layout>
            <ToolsNavigation />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">PDF Tools</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <Link
                            key={index}
                            href={tool.href}
                            className="tool-card p-6 hover:border-primary-400 cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{tool.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400">Process your PDF files</p>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    )
}