import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Head from 'next/head'
import Script from 'next/script'
import Layout from '../../../components/Layout'
import { FiFilm, FiDownload } from 'react-icons/fi'

const videoFormats = [
    { id: 'mp4', name: 'MP4' },
    { id: 'avi', name: 'AVI' },
    { id: 'mov', name: 'MOV' },
    { id: 'mkv', name: 'MKV' },
    { id: 'webm', name: 'WebM' }
]

export default function VideoConverter() {
    const [file, setFile] = useState(null)
    const [outputFormat, setOutputFormat] = useState('mp4')
    const [quality, setQuality] = useState('1080p')
    const [progress, setProgress] = useState(0)
    const [converted, setConverted] = useState(false)

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            setFile(acceptedFiles[0])
            setProgress(0)
            setConverted(false)
        }
    })

    const convertVideo = () => {
        // Simulated conversion progress
        setProgress(0)
        setConverted(false)
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setConverted(true)
                    return 100
                }
                return prev + 10
            })
        }, 400)
    }

    return (
        <>
            <Head>
                <title>Free Online Video Converter | Convert MP4, MOV, AVI, MKV, WebM</title>
                <meta
                    name="description"
                    content="Convert video formats like MP4, AVI, MOV, MKV and WebM online for free. Fast, secure, and high-quality video conversion."
                />
                <link rel="canonical" href="https://yourdomain.com/tools/video/converter" />
            </Head>

            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // Replace with your ID
            />
            <Script
                id="adsbygoogle-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
            />

            <Layout
                title="Online Video Converter"
                description="Convert between video formats like MP4, AVI, MOV, MKV and WebM"
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

                    <main className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
                        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                            <FiFilm /> Video Converter
                        </h1>

                        <div
                            {...getRootProps()}
                            className="border-2 border-dashed border-blue-400 dark:border-blue-600 p-6 rounded-xl text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition mb-6"
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <p className="text-blue-600 dark:text-blue-400 font-medium">{file.name}</p>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">Drag & drop your video here or click to select</p>
                            )}
                        </div>

                        {file && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block font-semibold mb-1">Output Format:</label>
                                        <select
                                            value={outputFormat}
                                            onChange={(e) => setOutputFormat(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            {videoFormats.map(format => (
                                                <option key={format.id} value={format.id}>{format.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-1">Quality:</label>
                                        <select
                                            value={quality}
                                            onChange={(e) => setQuality(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            <option value="1080p">High (1080p)</option>
                                            <option value="720p">Medium (720p)</option>
                                            <option value="480p">Low (480p)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={convertVideo}
                                    disabled={progress > 0 && progress < 100}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    Convert Video
                                </button>

                                {progress > 0 && (
                                    <div className="mt-6">
                                        <label className="block text-sm mb-1">Progress:</label>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                            <div
                                                className="bg-blue-600 h-4 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-center mt-2">{progress}%</p>
                                    </div>
                                )}

                                {converted && (
                                    <div className="mt-6 text-center">
                                        <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center gap-2 mx-auto">
                                            <FiDownload /> Download Converted Video
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>

                    {/* Bottom Ad */}
                    <div className="mt-12">
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
