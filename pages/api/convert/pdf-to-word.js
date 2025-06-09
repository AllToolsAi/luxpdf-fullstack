import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Layout from '../../../components/Layout';
import { FiUpload, FiDownload, FiFileText } from 'react-icons/fi';

export default function PdfToWord() {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setFile(acceptedFiles[0]);
                setResult(null);
                setError(null);
            }
        },
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        maxSize: 50 * 1024 * 1024, // 50MB
    });

    const convertToWord = async () => {
        if (!file) return;

        try {
            setIsConverting(true);
            setError(null);
            setResult(null);

            // TODO: Replace with real API call
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock result
            setResult({
                fileName: file.name.replace(/\.pdf$/i, '.docx'),
                size: Math.round(file.size * 0.8),
            });
        } catch (err) {
            setError('Conversion failed. Please try again.');
            console.error('Conversion error:', err);
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <Layout>
            <ToolHeader
                title="PDF to Word"
                description="Convert PDF documents to editable Word files"
                icon="📄➡️📝"
            />

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
            >
                <input {...getInputProps()} />
                <FiUpload className="mx-auto mb-3 text-4xl text-gray-500" />
                {file ? (
                    <p className="text-gray-700 font-semibold">{file.name}</p>
                ) : (
                    <p className="text-gray-500">
                        Drag & drop a PDF file here, or click to select
                    </p>
                )}
            </div>

            {error && <p className="text-red-600 mt-2">{error}</p>}

            <button
                onClick={convertToWord}
                disabled={!file || isConverting}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isConverting ? 'Converting...' : 'Convert to Word'}
            </button>

            {result && (
                <div className="mt-6 p-4 border rounded bg-green-50 flex items-center space-x-3">
                    <FiFileText className="text-2xl text-green-600" />
                    <div>
                        <p className="font-semibold">{result.fileName}</p>
                        <p className="text-sm text-gray-600">
                            Approximate size: {(result.size / 1024).toFixed(2)} KB
                        </p>
                        {/* Ideally, provide a download link for the converted file here */}
                    </div>
                </div>
            )}
        </Layout>
    );
}
