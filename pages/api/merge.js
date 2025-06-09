import { useState } from 'react';

export default function MergePage() {
  const [mergedFile, setMergedFile] = useState(null);

  const handleMerge = async (e) => {
    e.preventDefault();

    const input = e.target.elements.files;
    const files = input.files;

    if (!files.length) {
      alert('Please select at least one PDF file to merge.');
      return;
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }

    try {
      const res = await fetch('/api/merge', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        alert('Error merging PDFs');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setMergedFile(url);
    } catch (error) {
      alert('An error occurred while merging PDFs');
      console.error(error);
    }
  };

  return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Merge PDF Files</h1>
        <form onSubmit={handleMerge}>
          <input
              type="file"
              name="files"
              multiple
              accept="application/pdf"
              className="mb-4"
          />
          <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Merge PDFs
          </button>
        </form>
        {mergedFile && (
            <div className="mt-4">
              <a
                  href={mergedFile}
                  download="merged.pdf"
                  className="text-blue-500 underline"
              >
                Download Merged PDF
              </a>
            </div>
        )}
      </div>
  );
}
