import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const loadingTimer = useRef(null);

    useEffect(() => {
        const handleStart = () => {
            // Delay showing loading spinner by 200ms to avoid flicker on fast route changes
            loadingTimer.current = setTimeout(() => setLoading(true), 200);
        };
        const handleComplete = () => {
            clearTimeout(loadingTimer.current);
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            clearTimeout(loadingTimer.current);
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <>
            <Head>
                <title>MyApp</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <AuthProvider>
                <Layout>
                    {loading ? (
                        <div
                            className="fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 z-50 transition-opacity duration-300"
                            role="alert"
                            aria-busy="true"
                            aria-live="assertive"
                            aria-label="Loading content"
                        >
                            <LoadingSpinner />
                            <p className="mt-4 text-lg text-primary font-semibold">Loading...</p>
                        </div>
                    ) : (
                        <Component {...pageProps} />
                    )}
                </Layout>
            </AuthProvider>
        </>
    );
}
