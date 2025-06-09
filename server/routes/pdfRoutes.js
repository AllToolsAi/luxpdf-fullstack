const express = require('express')
const router = express.Router()
const pdfController = require('../controllers/pdfController')
const convertController = require('../controllers/convertController')
const multer = require('multer')

// Use memory storage to handle uploads in memory (good for smaller files)
const storage = multer.memoryStorage()
const upload = multer({ storage })

// PDF Tools routes
router.post('/merge', upload.array('files'), pdfController.mergePDFs)
router.post('/split', upload.single('file'), pdfController.splitPDF)
router.post('/compress', upload.single('file'), pdfController.compressPDF)
router.post('/rotate', upload.single('file'), pdfController.rotatePDF)
router.post('/crop', upload.single('file'), pdfController.cropPDF)

// Conversion Tools routes
router.post('/to-word', upload.single('file'), convertController.pdfToWord)
router.post('/to-excel', upload.single('file'), convertController.pdfToExcel)
router.post('/image-to-pdf', upload.array('images'), convertController.imageToPdf)
router.post('/html-to-pdf', upload.single('file'), convertController.htmlToPdf)

module.exports = router
