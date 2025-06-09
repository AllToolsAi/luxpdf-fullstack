import Layout from '../../../components/Layout';
import ToolGrid from '../../../components/ToolGrid';

const aiTools = [
    {
        name: "AI Text Generator",
        href: "/tools/ai/text-generator",
        icon: "✍️",
        description: "Generate human-like text content"
    },
    {
        name: "AI Image Generator",
        href: "/tools/ai/image-generator",
        icon: "🎨",
        description: "Create images from text prompts"
    },
    {
        name: "AI Code Assistant",
        href: "/tools/ai/code-helper",
        icon: "💻",
        description: "Generate and explain code"
    },
    {
        name: "AI Voice Clone",
        href: "/tools/ai/voice-clone",
        icon: "🎙️",
        description: "Generate realistic voice audio"
    },
    {
        name: "AI Video Generator",
        href: "/tools/ai/video-generator",
        icon: "🎥",
        description: "Create videos from text or images"
    },
    {
        name: "AI Document Analyzer",
        href: "/tools/ai/document-analyzer",
        icon: "📄",
        description: "Summarize and analyze documents"
    }
];

export default function AITools() {
    return (
        <Layout
            title="Free AI Tools Online | Text, Image & Code Generation"
            description="Collection of powerful AI tools for content generation, coding assistance, and creative projects"
        >
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-center mb-4">
                    AI-Powered Tools
                </h1>
                <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
                    Cutting-edge artificial intelligence tools for various tasks
                </p>

                <ToolGrid tools={aiTools} />

                <div className="mt-12 bg-purple-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">About Our AI Tools</h2>
                    <p>
                        These tools leverage advanced machine learning models to help with creative
                        and technical tasks. All processing happens securely in your browser.
                    </p>
                </div>
            </div>
        </Layout>
    );
}