import Head from 'next/head';
import Layout from '../components/Layout';
import ToolCategory from '../components/ToolCategory';

const categories = [
    // ... your categories remain unchanged ...
];

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>Document & Image Tools - LuxTools</title>
                <meta
                    name="description"
                    content="Convert, edit, optimize, and protect your files with our full collection of 100+ document, PDF, image, and ebook tools."
                />
                <meta name="robots" content="index, follow" />
            </Head>

            <main id="tools" className="container mx-auto px-6 py-16">
                <header>
                    <h1 className="text-5xl font-serif font-bold mb-10 text-center text-primary">
                        All Document & Image Tools
                    </h1>
                    <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                        Convert, edit, optimize, and protect your files with our full collection of 100+ tools.
                    </p>
                </header>

                {categories.map((category) => (
                    <ToolCategory key={category.name} category={category} />
                ))}
            </main>

            <section
                id="contact"
                className="bg-primary text-white py-20 text-center"
                aria-label="Contact Section"
            >
                <h2 className="text-4xl font-serif font-bold mb-6">Get In Touch</h2>
                <p className="max-w-xl mx-auto mb-6">
                    Have questions or need support? Contact us anytime.
                </p>
                <a
                    href="mailto:support@luxtools.com?subject=Support Inquiry"
                    className="inline-block bg-secondary px-6 py-3 rounded shadow hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition"
                    aria-label="Email support"
                >
                    Email Support
                </a>
            </section>
        </Layout>
    );
}
