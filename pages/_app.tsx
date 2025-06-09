// pages/_app.js
import '../styles/globals.css';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // Example: Track page views
    useEffect(() => {
        const handleRouteChange = (url) => {
            // Add analytics tracking here if needed
            console.log(`App is changing to ${url}`);
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    // Add error boundary in production
    if (process.env.NODE_ENV === 'production') {
        const ErrorBoundary = require('../components/ErrorBoundary').default;
        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <ErrorBoundary>
                    <Header />
                    <main className="min-h-screen px-4 pt-4 pb-12">
                        <Component {...pageProps} />
                    </main>
                </ErrorBoundary>
            </>
        );
    }

    // Development version without error boundary
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header />
            <main className="min-h-screen px-4 pt-4 pb-12">
                <Component {...pageProps} />
            </main>
        </>
    );
}

export default MyApp;