const { PDFDocument } = require('pdf-lib')
const { performance } = require('perf_hooks')

exports.mergePDFs = async (req, res, next) => {
    const startTime = performance.now()

    try {
        // Validation
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'Please upload at least 2 PDF files' })
        }

        if (req.files.length > 60) {
            return res.status(400).json({ error: 'Maximum 60 files allowed' })
        }

        // Total size check (limit: 500MB)
        const totalSize = req.files.reduce((sum, file) => sum + file.size, 0)
        if (totalSize > 500 * 1024 * 1024) {
            return res.status(400).json({
                error: 'Total size exceeds 500MB limit',
                actualSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`
            })
        }

        const mergedPdf = await PDFDocument.create()
        let totalPages = 0
        let processedFiles = 0
        const processingErrors = []

        const BATCH_SIZE = 5
        for (let i = 0; i < req.files.length; i += BATCH_SIZE) {
            const batch = req.files.slice(i, i + BATCH_SIZE)

            await Promise.all(batch.map(async (file) => {
                try {
                    const pdfDoc = await PDFDocument.load(file.buffer)
                    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
                    pages.forEach(page => mergedPdf.addPage(page))
                    totalPages += pages.length
                    processedFiles++
                } catch (err) {
                    console.error(`Error processing ${file.originalname}:`, err)
                    processingErrors.push({
                        file: file.originalname,
                        error: 'Invalid PDF file or corrupt content'
                    })
                }
            }))
        }

        if (totalPages === 0) {
            return res.status(400).json({
                error: 'No valid PDF files could be processed',
                details: processingErrors
            })
        }

        const mergedPdfBytes = await mergedPdf.save()
        const endTime = performance.now()

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf')
        res.setHeader('X-Processing-Time', `${((endTime - startTime) / 1000).toFixed(2)}s`)
        res.setHeader('X-Total-Pages', totalPages)
        res.setHeader('X-Total-Files', processedFiles)
        res.send(mergedPdfBytes)

    } catch (err) {
        next(err)
    }
}
