import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import Layout from '../../../components/Layout';
import SEO from '../../../components/SEOMeta';
import Script from 'next/script';
import adsenseConfig from '../../../lib/adsenseConfig';
import { Download, Loader2, Trash2 } from 'lucide-react';
import Footer from '../../../components/Footer';

export default function ExtractPages() {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setSuccess(false);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });

    const extractPages = async () => {
        try {
            setIsProcessing(true);
            setError(null);
            setSuccess(false);

            const pageRanges = pages
                .split(',')
                .map(range => {
                    const [start, end] = range.split('-').map(Number);
                    return { start: start || 1, end: end || start || 1 };
                });

            const arrayBuffer = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(arrayBuffer);
            const pageCount = originalPdf.getPageCount();

            for (const range of pageRanges) {
                if (range.start < 1 || range.end > pageCount || range.start > range.end) {
                    throw new Error(`Invalid range: ${range.start}-${range.end}`);
                }
            }

            const newPdf = await PDFDocument.create();
            for (const range of pageRanges) {
                for (let i = range.start; i <= range.end; i++) {
                    const [copiedPage] = await newPdf.copyPages(originalPdf, [i - 1]);
                    newPdf.addPage(copiedPage);
                }
            }

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace('.pdf', '')}_extracted.pdf`;
            a.click();
            URL.revokeObjectURL(url);

            setSuccess(true);
            setFile(null);
            setPages('');
        } catch (err) {
            setError(err.message || 'Failed to extract pages');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Layout>
            <SEO
                title="Extract PDF Pages - Free & Easy Tool"
                description="Extract selected pages or page ranges from your PDF file online for free. No watermarks or sign-up needed."
                keywords="extract PDF pages, split PDF, extract ranges, remove PDF pages, pdf-lib"
                image="https://yourdomain.com/images/extract-pages-thumbnail.jpg"
            />

            <Script
                id="adsense-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: '(adsbygoogle = window.adsbygoogle || []).push({});',
                }}
            />

            <section className="py-12 bg-background min-h-[80vh]">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-center text-heading mb-6">
                        Extract PDF Pages
                    </h1>

                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition">
                        <div
                            {...getRootProps()}
                            className="border-2 border-dashed border-muted rounded-xl p-6 text-center cursor-pointer hover:border-primary transition"
                        >
                            <input {...getInputProps()} />
                            <p className="text-gray-700">
                                {file ? file.name : 'Drag & drop or click to upload a PDF'}
                            </p>
                        </div>

                        {file && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-2 text-heading">
                                    Pages to extract (e.g., 1-3,5,7-9)
                                </label>
                                <input
                                    type="text"
                                    value={pages}
                                    onChange={(e) => setPages(e.target.value)}
                                    placeholder="1-3,5,7-9"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                                <p className="text-sm text-muted mt-1">
                                    Separate ranges with commas
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-sm text-green-800">
                                Pages extracted and downloaded successfully.
                            </div>
                        )}

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={extractPages}
                                disabled={!file || !pages || isProcessing}
                                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Extracting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Extract Pages
                                    </>
                                )}
                            </button>

                            {file && (
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setPages('');
                                        setError(null);
                                        setSuccess(false);
                                    }}
                                    className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Ad */}
            <div className="max-w-screen-xl mx-auto px-4 mt-10">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={adsenseConfig.client}
                    data-ad-slot={adsenseConfig.slot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                ></ins>
            </div>

        </Layout>
    );
}
