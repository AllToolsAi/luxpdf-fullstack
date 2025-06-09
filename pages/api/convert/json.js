import { parse } from 'json2csv';
import js2xmlparser from 'js2xmlparser';
import yaml from 'js-yaml';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { jsonData, outputFormat } = req.body;

        if (!jsonData) {
            return res.status(400).json({ error: 'No JSON data provided' });
        }

        // Parse JSON string if needed
        const jsonObj = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        let result;

        switch (outputFormat) {
            case 'csv':
                result = parse(jsonObj);
                res.setHeader('Content-Type', 'text/csv');
                break;
            case 'xml':
                result = js2xmlparser.parse('root', jsonObj);
                res.setHeader('Content-Type', 'application/xml');
                break;
            case 'yaml':
                result = yaml.dump(jsonObj);
                res.setHeader('Content-Type', 'text/yaml');
                break;
            default:
                return res.status(400).json({ error: 'Unsupported output format' });
        }

        res.setHeader('Content-Disposition', `attachment; filename=converted.${outputFormat}`);
        return res.send(result);
    } catch (error) {
        console.error('Conversion error:', error);
        return res.status(500).json({ error: error.message });
    }
}
