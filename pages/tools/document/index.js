import Layout from '../../../components/Layout'
import ToolsNavigation from '../../../components/ToolsNavigation'
import Link from 'next/link'

export default function DocumentTools() {
    const tools = [
        { name: 'Word Editor', href: '/tools/document/word-editor' },
        { name: 'Excel Editor', href: '/tools/document/excel-editor' },
        { name: 'PPT Editor', href: '/tools/document/ppt-editor' },
        { name: 'Text Editor', href: '/tools/document/text-editor' },
        { name: 'Markdown Editor', href: '/tools/document/markdown-editor' },
        { name: 'Document Signer', href: '/tools/document/signer' },
        { name: 'Document Compressor', href: '/tools/document/compressor' },
        { name: 'Document Converter', href: '/tools/document/converter' }
    ]

    return (
        <Layout>
            <ToolsNavigation />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Document Tools</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <Link key={index} href={tool.href} className="tool-card">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{tool.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">Edit and process documents</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    )
}