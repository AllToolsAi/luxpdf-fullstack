// components/AdvancedSEO.js
import Head from 'next/head';

export default function AdvancedSEO({
                                        seoData,
                                        url,
                                        customTitle,
                                        customDescription,
                                        canonicalBase = 'https://yoursite.com',
                                    }) {
    const title = customTitle || seoData?.title || '';
    const description = customDescription || seoData?.metaDescription || '';
    const keywords = seoData?.keywords?.join(', ') || '';
    const schemaMarkup = seoData?.schemaMarkup || {};
    const faqSchema = seoData?.faqSchema || undefined;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={`${canonicalBase}${url}`} />

            {/* OpenGraph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={`${canonicalBase}${url}`} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />

            {/* Schema.org */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": schemaMarkup.type || 'WebPage',
                        name: title,
                        description,
                        url: `${canonicalBase}${url}`,
                        ...(faqSchema ? { mainEntity: faqSchema } : {}),
                    }),
                }}
            />
        </Head>
    );
}
