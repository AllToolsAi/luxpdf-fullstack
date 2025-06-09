import mammoth from 'mammoth';
import { Workbook } from 'exceljs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fileBuffer, format = 'xlsx' } = req.body;

        // Ensure fileBuffer is a Buffer (if client sends base64, decode it here)
        const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer, 'base64');

        // Extract raw text from Word document
        const { value: rawText } = await mammoth.extractRawText({ buffer });

        // Create Excel workbook and worksheet
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Split text by lines and tabs, then add rows
        const lines = rawText.split('\n');
        for (const line of lines) {
            const cells = line.split('\t');
            worksheet.addRow(cells);
        }

        // Generate Excel or CSV buffer
        let outputBuffer;
        if (format === 'csv') {
            outputBuffer = await workbook.csv.writeBuffer();
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=converted.csv');
        } else {
            outputBuffer = await workbook.xlsx.writeBuffer();
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader('Content-Disposition', 'attachment; filename=converted.xlsx');
        }

        res.send(outputBuffer);
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ error: 'Failed to convert Word to Excel' });
    }
}
