const fs = require('fs-extra');

async function copyPdfWorker() {
  try {
    await fs.copy(
      'node_modules/pdfjs-dist/build/pdf.worker.min.js',
      'public/pdf.worker.min.js'
    );
    console.log('pdf.worker.min.js copied successfully');
  } catch (err) {
    console.error('Error copying pdf.worker.min.js:', err);
    process.exit(1);
  }
}

copyPdfWorker();
