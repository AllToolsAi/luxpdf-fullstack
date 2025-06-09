import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ToolLayout({ title, description, children }) {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <link rel="canonical" href={`https://yoursite.com${router.asPath}`} />
            </Head>

            <div className="max-w-4xl mx-auto py-8 px-4">
                {children}

                <div className="mt-12 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Related Tools</h3>
                    {/* Add related tools links */}
                </div>
            </div>
        </>
    );
}
