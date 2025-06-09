require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pdfRoutes = require('./routes/pdfRoutes')

const app = express()

// Middleware with increased limits
app.use(cors())
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ extended: true, limit: '500mb' }))

// Routes
app.use('/api/pdf', pdfRoutes)

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        limits: {
            maxFileUpload: '100MB per file',
            maxFiles: '60 files',
            totalSize: '500MB per request'
        }
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            error: 'File too large (max 100MB per file)'
        })
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(413).json({
            error: 'Too many files (max 60 files)'
        })
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            error: 'Invalid file type (PDF only)'
        })
    }

    res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log('File upload limits:')
    console.log('- 60 files max per request')
    console.log('- 100MB max per file')
    console.log('- 500MB max total per request')
})