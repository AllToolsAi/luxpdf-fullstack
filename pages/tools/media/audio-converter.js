import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiDownload, FiMusic } from 'react-icons/fi'
import Head from 'next/head'
import Script from 'next/script'
import Layout from '../../../components/Layout'

const audioFormats = [
    { id: 'mp3', name: 'MP3', mime: 'audio/mpeg' },
    { id: 'wav', name: 'WAV', mime: 'audio/wav' },
    { id: 'ogg', name: 'OGG', mime: 'audio/ogg' },
    { id: 'flac', name: 'FLAC', mime: 'audio/flac' },
    { id: 'aac', name: 'AAC', mime: 'audio/aac' }
]

export default function AudioConverter() {
    const [file, setFile] = useState(null)
    const [outputFormat, setOutputFormat] = useState('mp3')
    const [bitrate, setBitrate] = useState('192')

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.aac']
        },
        maxFiles: 1,
        onDrop: acceptedFiles => setFile(acceptedFiles[0])
    })

    const convertAudio = () => {
        alert(`Converting to ${outputFormat} at ${bitrate}kbps`)
        // Add actual conversion logic here (API or client-side)
    }

    return (
        <>
            <Head>
                <title>Free Online Audio Converter | MP3, WAV, OGG, FLAC, AAC</title>
                <meta
                    name="description"
                    content="Convert your audio files to MP3, WAV, OGG, FLAC, and AAC formats online for free. Simple, fast, and high-quality."
                />
                <link rel="canonical" href="https://yourdomain.com/tools/audio/converter" />
            </Head>

            {/* Google AdSense */}
            <Script
                id="adsbygoogle-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(adsbygoogle = window.adsbygoogle || []).push({});`
                }}
            />
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // replace with your publisher ID
            ></Script>

            <Layout
                title="Online Audio Converter"
                description="Free tool to convert audio files between multiple formats."
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

                    <main className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
                        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                            <FiMusic /> Audio Converter
                        </h1>

                        <div
                            {...getRootProps()}
                            className="border-2 border-dashed border-blue-400 dark:border-blue-600 p-6 text-center rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition mb-6"
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <p className="text-lg text-blue-600 dark:text-blue-400">{file.name}</p>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">
                                    <FiUpload className="inline mr-2" />
                                    Drag & drop audio file here or click to upload
                                </p>
                            )}
                        </div>

                        {file && (
                            <>
                                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Output Format</label>
                                        <select
                                            value={outputFormat}
                                            onChange={e => setOutputFormat(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            {audioFormats.map(format => (
                                                <option key={format.id} value={format.id}>
                                                    {format.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Bitrate (kbps)</label>
                                        <select
                                            value={bitrate}
                                            onChange={e => setBitrate(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            {['128', '192', '256', '320'].map(rate => (
                                                <option key={rate} value={rate}>
                                                    {rate}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={convertAudio}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    <FiDownload /> Convert Audio
                                </button>
                            </>
                        )}
                    </main>

                    {/* Bottom Ad */}
                    <div className="mt-8">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', height: 90 }}
                            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                            data-ad-slot="3333333333"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>
                </div>
            </Layout>
        </>
    )
}
