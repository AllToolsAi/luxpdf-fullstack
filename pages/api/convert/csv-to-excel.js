import ExcelJS from 'exceljs';
import { parse } from 'csv-parse/sync';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fileData, format = 'xlsx' } = req.body;

        if (!fileData) {
            return res.status(400).json({ error: 'No CSV data provided' });
        }

        // Parse CSV data
        const records = parse(fileData, {
            columns: true,
            skip_empty_lines: true,
        });

        // Create Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Set headers if records exist
        if (records.length > 0) {
            worksheet.columns = Object.keys(records[0]).map((key) => ({
                header: key,
                key,
                width: 20,
            }));
        }

        // Add all rows
        worksheet.addRows(records);

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set response headers for file download
        res.setHeader(
            'Content-Type',
            format === 'xls'
                ? 'application/vnd.ms-excel'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=converted.${format === 'xls' ? 'xls' : 'xlsx'}`
        );

        return res.send(buffer);
    } catch (error) {
        console.error('Conversion error:', error);
        return res.status(500).json({ error: 'Failed to convert CSV to Excel' });
    }
}
