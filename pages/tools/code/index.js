import Layout from '../../../components/Layout';
import ToolsNavigation from '../../../components/ToolsNavigation';
import Link from 'next/link';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function CodeTools() {
    const tools = [
        { name: 'HTML Editor', href: '/tools/code/html-editor' },
        { name: 'CSS Editor', href: '/tools/code/css-editor' },
        { name: 'JavaScript Editor', href: '/tools/code/js-editor' },
        { name: 'JSON Formatter', href: '/tools/code/json-formatter' },
        { name: 'XML Formatter', href: '/tools/code/xml-formatter' },
        { name: 'Code Minifier', href: '/tools/code/minifier' },
        { name: 'Code Converter', href: '/tools/code/converter' },
        { name: 'Regex Tester', href: '/tools/code/regex' }
    ];

    return (
        <Layout>
            <SEO
                title="Code Tools Suite"
                description="A powerful collection of developer tools including editors, formatters, minifiers, converters, and regex testers."
                image="https://yourdomain.com/images/code-tools-banner.png"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
            />

            <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
                <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[120px_1fr_120px] gap-8">

                    {/* Left Ad */}
                    <aside className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                            aria-label="Advertisement"
                        />
                    </aside>

                    {/* Main Content */}
                    <main>
                        <ToolsNavigation />

                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl font-bold text-primary dark:text-blue-400 mb-10">Code Tools</h1>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tools.map(({ name, href }, idx) => (
                                    <Link
                                        key={idx}
                                        href={href}
                                        className="block rounded-lg bg-gray-50 dark:bg-gray-800 p-6 shadow hover:shadow-lg transition focus:outline-none focus:ring-4 focus:ring-blue-500"
                                        aria-label={`Open the ${name} tool`}
                                    >
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Developer utilities</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </main>

                    {/* Right Ad */}
                    <aside className="hidden lg:block">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block' }}
                            data-ad-client={adsenseConfig.client}
                            data-ad-slot={adsenseConfig.slot}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                            aria-label="Advertisement"
                        />
                    </aside>

                </div>
            </section>
        </Layout>
    );
}
