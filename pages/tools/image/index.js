import Head from 'next/head'
import Layout from '../../../components/Layout'
import ToolGrid from '../../../components/ToolGrid'
import Script from 'next/script'

const imageTools = [
    {
        name: 'Image Converter',
        href: '/tools/image/converter',
        icon: '🔄',
        description: 'Convert between JPG, PNG, WEBP, SVG, GIF formats',
    },
    {
        name: 'Image Compressor',
        href: '/tools/image/compress',
        icon: '🗜️',
        description: 'Reduce image file size without quality loss',
    },
    {
        name: 'Background Remover',
        href: '/tools/image/remove-bg',
        icon: '✂️',
        description: 'Automatically remove image backgrounds',
    },
    {
        name: 'Image Resizer',
        href: '/tools/image/resize',
        icon: '📏',
        description: 'Resize images to specific dimensions',
    },
    {
        name: 'Image Cropper',
        href: '/tools/image/crop',
        icon: '🖼️',
        description: 'Crop images to focus on important areas',
    },
    {
        name: 'Watermark Adder',
        href: '/tools/image/watermark',
        icon: '💧',
        description: 'Add text or image watermarks',
    },
    {
        name: 'Image Filters',
        href: '/tools/image/filters',
        icon: '🎨',
        description: 'Apply artistic filters to images',
    },
    {
        name: 'Face Detection',
        href: '/tools/image/face-detection',
        icon: '👤',
        description: 'Detect and analyze faces in photos',
    },
    {
        name: 'Image Metadata',
        href: '/tools/image/metadata',
        icon: '🏷️',
        description: 'View and edit image EXIF data',
    },
    {
        name: 'Image Upscaler',
        href: '/tools/image/upscale',
        icon: '🔍',
        description: 'Enhance image resolution using AI',
    },
]

export default function ImageTools() {
    return (
        <>
            <Head>
                <title>Free Online Image Tools | Edit, Convert & Optimize Images</title>
                <meta
                    name="description"
                    content="Use powerful online tools to edit images. Convert formats, resize, compress, remove backgrounds, and more – 100% free."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://yourdomain.com/tools/image" />
            </Head>

            {/* Google AdSense */}
            <Script
                id="adsbygoogle-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
          `,
                }}
            />
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // replace with your publisher ID
            ></Script>

            <Layout
                title="Free Online Image Tools | Edit, Convert & Process Images"
                description="Collection of powerful image processing tools. Convert formats, compress, resize, remove backgrounds and more."
            >
                <div className="relative container mx-auto px-4 py-12">
                    {/* Left Ad */}
                    <aside className="hidden lg:block absolute left-0 top-16">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', width: 120, height: 600 }}
                            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                            data-ad-slot="1111111111"
                            data-ad-format="vertical"
                        />
                    </aside>

                    {/* Right Ad */}
                    <aside className="hidden lg:block absolute right-0 top-16">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', width: 120, height: 600 }}
                            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                            data-ad-slot="2222222222"
                            data-ad-format="vertical"
                        />
                    </aside>

                    <main className="mx-auto max-w-6xl">
                        <h1 className="text-3xl font-bold text-center mb-4">
                            Image Processing Tools
                        </h1>
                        <p className="text-center text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                            Free online tools for all your image editing and conversion needs.
                        </p>

                        <ToolGrid tools={imageTools} />

                        <section className="mt-12 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl shadow">
                            <h2 className="text-xl font-semibold mb-4">How to Use</h2>
                            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-200">
                                <li>Select the desired tool from the list</li>
                                <li>Upload your image (JPG, PNG, WebP, etc.)</li>
                                <li>Adjust the settings to your preference</li>
                                <li>Download the final result instantly</li>
                            </ol>
                        </section>
                    </main>
                </div>
            </Layout>
        </>
    )
}
