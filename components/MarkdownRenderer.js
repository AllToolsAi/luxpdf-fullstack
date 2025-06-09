import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function MarkdownRenderer({ content }) {
    return (
        <div
            className="
        prose prose-lg max-w-none dark:prose-invert
        prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500
        prose-ul:list-disc prose-li:my-1
        prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
        prose-hr:my-8
      "
        >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
