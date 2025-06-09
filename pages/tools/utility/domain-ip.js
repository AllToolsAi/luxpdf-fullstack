'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiRefreshCw, FiCopy, FiGlobe, FiInfo } from 'react-icons/fi';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';

export default function DomainIPConverter() {
    const [domain, setDomain] = useState('');
    const [ipInfo, setIpInfo] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(false);
    const domainInputRef = useRef(null);

    const handleLookup = async () => {
        if (!domain.trim()) {
            setError('Please enter a domain name');
            return;
        }
        setIsLoading(true);
        setError(null);
        setIpInfo(null);

        try {
            // 1. Resolve domain via Google DNS
            const resolveRes = await fetch(`https://dns.google/resolve?name=${domain.trim()}`);
            const resolveData = await resolveRes.json();
            const ip = resolveData?.Answer?.find(a => a.type === 1)?.data;
            if (!ip) throw new Error('Failed to resolve domain');

            // 2. Fetch geo via IPinfo.io (API token required)
            const token = process.env.NEXT_PUBLIC_IPINFO_TOKEN;
            const geoRes = await fetch(
                `https://ipinfo.io/${ip}/json?token=${token}`
            );
            const geo = await geoRes.json();
            if (geo.error) throw new Error(geo.error.message);

            const result = {
                domain: domain.trim(),
                ip,
                country: geo.country,
                region: geo.region,
                city: geo.city,
                org: geo.org,
                timezone: geo.timezone,
                date: new Date().toLocaleString(),
            };

            setIpInfo(result);
            setHistory(prev => [result, ...prev.slice(0, 4)]);
            setNotice(true);
            setTimeout(() => setNotice(false), 5000);

        } catch (e) {
            console.error(e);
            setError('Lookup failed. Make sure the domain is valid and token is set.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setNotice(true);
        setTimeout(() => setNotice(false), 2000);
    };

    const handleReset = () => {
        setDomain('');
        setIpInfo(null);
        setError(null);
        domainInputRef.current?.focus();
    };

    const loadExample = () => setDomain('example.com');

    return (
        <Layout>
            <SEO
                title="Domain to IP Converter | DNS Lookup Tool"
                description="Convert domain names to IP with accurate geolocation info."
                keywords="domain to ip, dns lookup, ipinfo, ip geolocation"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{__html: `(adsbygoogle = window.adsbygoogle||[]).push({});`}}
            />

            <section className="py-16">
                <div className="max-w-screen-xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-4">Domain to IP Converter</h1>
                    <p className="text-center text-gray-600 mb-6">
                        Enter a domain to get its IP and geolocation info (city, region, org).
                        <span className="flex items-center justify-center mt-2 text-sm text-gray-500">
              <FiInfo className="mr-1"/> *Accuracy limited by IP-based lookup*
            </span>
                    </p>

                    <div className="bg-white p-8 rounded-xl shadow max-w-2xl mx-auto space-y-6">
                        <div>
                            <label className="font-medium block mb-2">Domain</label>
                            <div className="flex gap-2">
                                <input
                                    ref={domainInputRef}
                                    type="text"
                                    value={domain}
                                    placeholder="example.com"
                                    onChange={e => setDomain(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleLookup()}
                                    className="flex-1 border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={loadExample}
                                    className="px-4 border rounded flex items-center gap-1 hover:bg-gray-50"
                                >
                                    <FiGlobe/> Example
                                </button>
                            </div>
                        </div>

                        {ipInfo && (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                    <h3 className="font-medium">DNS & Geo Info</h3>
                                    <button
                                        onClick={() => handleCopy(ipInfo.ip)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    ><FiCopy/> Copy IP</button>
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {['domain','ip','country','region','city','org','timezone','date'].map(key => (
                                        <div key={key}>
                                            <p className="text-gray-500 capitalize">{key.replace('_',' ')}</p>
                                            <p className="font-medium">{ipInfo[key]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleLookup}
                                disabled={isLoading || !domain.trim()}
                                className={`flex-1 py-3 font-semibold rounded text-white ${isLoading||!domain.trim()?'bg-gray-400':'bg-blue-600 hover:bg-blue-700'}`}
                            >{isLoading?<FiRefreshCw className="animate-spin"/>:'Lookup Domain'}</button>
                            <button
                                onClick={handleReset}
                                disabled={isLoading}
                                className="flex-1 py-3 rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
                            >Reset</button>
                        </div>

                        {(error || notice) && (
                            <div className={`p-4 rounded-lg text-center ${error?'bg-red-50 text-red-700':'bg-green-50 text-green-800'}`}>
                                {error || 'Lookup successful!'}
                            </div>
                        )}

                        {history.length > 0 && (
                            <div className="mt-6 border rounded-lg">
                                <div className="bg-gray-50 px-4 py-2 font-medium">Recent Lookups</div>
                                <div className="divide-y">
                                    {history.map((h,i)=>(
                                        <div key={i} className="px-4 py-3 flex justify-between hover:bg-gray-50">
                                            <div>
                                                <p className="font-medium">{h.domain}</p>
                                                <p className="text-gray-500">{h.ip}</p>
                                            </div>
                                            <button
                                                onClick={()=>{ setDomain(h.domain); setIpInfo(h); }}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >Reload</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-gray-100 rounded text-sm text-gray-600 text-center">
                            Powered by IPinfo.io — <a href="https://ipinfo.io" target="_blank" className="underline">more accurate geolocation</a>&nbsp;
                            :contentReference[oaicite:1]{index=1}
                        </div>

                        <div className="mt-6 text-center">
                            <ins className="adsbygoogle" style={{display:'block'}} data-ad-client={adsenseConfig.client} data-ad-slot={adsenseConfig.slot} data-ad-format="auto" data-full-width-responsive="true"></ins>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
