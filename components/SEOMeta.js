import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function SEO({ title, description, image }) {
    const router = useRouter();
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    const fullUrl = `${origin}${router.asPath}`;
    const fullTitle = title ? `${title} | LuxTools` : 'LuxTools';

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={image} />
            <link rel="canonical" href={fullUrl} />
        </Head>
    );
}
