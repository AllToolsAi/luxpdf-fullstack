import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Head from 'next/head'
import Script from 'next/script'
import Layout from '../../../components/Layout'
import { FiVideo, FiDownload } from 'react-icons/fi'

export default function Mp4ToMp3() {
    const [file, setFile] = useState(null)
    const [bitrate, setBitrate] = useState('192')

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'video/mp4': ['.mp4'] },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0 && acceptedFiles[0].name.endsWith('.mp4')) {
                setFile(acceptedFiles[0])
            }
        }
    })

    const extractAudio = () => {
        // Placeholder for real audio extraction logic
        alert(`Extracting audio from ${file.name} at ${bitrate}kbps`)
    }

    return (
        <>
            <Head>
                <title>MP4 to MP3 Converter Online | Extract High-Quality Audio</title>
                <meta
                    name="description"
                    content="Convert MP4 videos to MP3 audio easily and quickly online. Select audio bitrate and download high-quality MP3 files."
                />
                <link rel="canonical" href="https://yourdomain.com/tools/video/mp4-to-mp3" />
            </Head>

            <Script
                id="adsbygoogle-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
            />
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // replace this
            />

            <Layout
                title="MP4 to MP3 Converter"
                description="Extract MP3 audio from MP4 video files easily online"
            >
                <div className="relative container mx-auto px-4 py-12">

                    {/* Left Ad */}
                    <aside className="hidden lg:block absolute left-0 top-16">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', width: 120, height: 600 }}
                            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                            data-ad-slot="4444444444"
                            data-ad-format="vertical"
                        />
                    </aside>

                    {/* Right Ad */}
                    <aside className="hidden lg:block absolute right-0 top-16">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', width: 120, height: 600 }}
                            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                            data-ad-slot="5555555555"
                            data-ad-format="vertical"
                        />
                    </aside>

                    <main className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
                        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                            <FiVideo /> MP4 to MP3 Converter
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
                                    Drag & drop MP4 video here or click to select
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Audio Bitrate (kbps):</label>
                            <select
                                value={bitrate}
                                onChange={(e) => setBitrate(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                            >
                                {['128', '192', '256', '320'].map(rate => (
                                    <option key={rate} value={rate}>
                                        {rate} kbps
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={extractAudio}
                            disabled={!file}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiDownload /> Extract MP3
                        </button>
                    </main>

                    {/* Bottom Ad */}
                    <div className="mt-8">
                        <ins
                            className="adsbygoogle"
                            style={{ display: 'block', height: 90 }}
                            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                            data-ad-slot="6666666666"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>
                </div>
            </Layout>
        </>
    )
}
