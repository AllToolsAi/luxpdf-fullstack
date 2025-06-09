import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { FiMapPin, FiGlobe, FiCopy } from 'react-icons/fi';

const IPLocationFinder = () => {
    const [ipData, setIpData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ipInput, setIpInput] = useState('');

    const fetchIPData = async (ip = '') => {
        setLoading(true);
        try {
            // Simulated API call delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Mock data - replace with real API call here
            const mockData = {
                ip: ip || '192.168.1.1',
                city: ip ? 'New York' : 'Your City',
                region: ip ? 'New York' : 'Your Region',
                country: ip ? 'United States' : 'Your Country',
                loc: ip ? '40.7128,-74.0060' : '00.0000,00.0000',
                org: ip ? 'AS12345 Example ISP' : 'Your ISP',
                timezone: ip ? 'America/New_York' : 'Your Timezone'
            };

            setIpData(mockData);
        } catch (error) {
            console.error('Error fetching IP data:', error);
            setIpData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIPData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (ipInput.trim()) {
            fetchIPData(ipInput.trim());
        }
    };

    // Memoize copy handlers to improve performance
    const createCopyHandler = (text) => () => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text);
    };

    const ipResults = useMemo(() => {
        if (!ipData) return null;
        return (
            <section className="mt-6 space-y-6 bg-white dark:bg-gray-700 rounded-lg shadow p-4">
                <div className="ip-info space-y-3">
                    {[
                        { label: 'IP Address', value: ipData.ip, copyable: true },
                        {
                            label: 'Location',
                            value: `${ipData.city}, ${ipData.region}, ${ipData.country}`,
                            copyable: false
                        },
                        { label: 'Coordinates', value: ipData.loc, copyable: true },
                        { label: 'ISP', value: ipData.org, copyable: false },
                        { label: 'Timezone', value: ipData.timezone, copyable: false }
                    ].map(({ label, value, copyable }) => (
                        <div
                            key={label}
                            className="info-row flex justify-between border-b border-gray-200 dark:border-gray-600 py-2"
                        >
                            <span className="font-semibold">{label}</span>
                            <span className="flex items-center gap-2">
                {value}
                                {copyable && (
                                    <button
                                        onClick={createCopyHandler(value)}
                                        aria-label={`Copy ${label}`}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                                    >
                                        <FiCopy />
                                    </button>
                                )}
              </span>
                        </div>
                    ))}
                </div>

                <div className="map-placeholder mt-6 flex flex-col items-center text-gray-500 dark:text-gray-400">
                    <FiGlobe className="globe-icon text-6xl mb-3" aria-hidden="true" />
                    <p>Map would display here with API integration</p>
                </div>
            </section>
        );
    }, [ipData]);

    return (
        <>
            <Head>
                <title>IP Location Finder - Geolocate Any IP Address</title>
                <meta
                    name="description"
                    content="Discover detailed geographical information, ISP, and timezone data for any IP address quickly and easily."
                />
                <meta name="robots" content="index, follow" />
            </Head>

            {/* AdSense Top Placeholder */}
            <div className="my-6 flex justify-center">
                {/* Place your AdSense script or component here */}
            </div>

            <main className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-gray-900 dark:text-gray-100">
                <header className="flex items-center space-x-3 mb-6">
                    <FiMapPin className="text-3xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <h1 className="text-2xl font-bold">IP Location Finder</h1>
                </header>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Discover geographical information for any IP address.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3"
                    aria-label="IP address lookup form"
                >
                    <input
                        type="text"
                        aria-label="IP address input"
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        placeholder="Enter IP address (leave blank for your IP)"
                        className="flex-grow rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`rounded-md px-6 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                            loading
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        aria-live="polite"
                    >
                        {loading ? 'Searching...' : 'Lookup IP'}
                    </button>
                </form>

                {ipResults}

                {/* AdSense Bottom Placeholder */}
                <div className="my-8 flex justify-center">
                    {/* Place your AdSense script or component here */}
                </div>
            </main>
        </>
    );
};

export default IPLocationFinder;
