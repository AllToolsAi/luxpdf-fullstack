import { exec } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fileBuffer, format, quality } = req.body;

        // Validate input parameters
        if (!fileBuffer || !format) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        if (!['mp4', 'webm'].includes(format)) {
            return res.status(400).json({ error: 'Unsupported output format' });
        }

        if (quality && !['low', 'medium', 'high'].includes(quality)) {
            return res.status(400).json({ error: 'Invalid quality parameter' });
        }

        const tempInput = join(tmpdir(), `input_${Date.now()}`);
        const tempOutput = join(tmpdir(), `output_${Date.now()}.${format}`);

        // Write input file buffer safely
        await fs.promises.writeFile(tempInput, Buffer.from(fileBuffer, 'base64'));

        // Build FFmpeg command safely with arguments as array to avoid shell injection
        const args = ['-i', tempInput];

        // Set video codec by format
        if (format === 'mp4') args.push('-c:v', 'libx264');
        else if (format === 'webm') args.push('-c:v', 'libvpx');

        // Set quality parameter
        if (quality === 'high') args.push('-crf', '18');
        else if (quality === 'medium') args.push('-crf', '23');
        else if (quality === 'low') args.push('-crf', '28');

        args.push(tempOutput);

        // Use spawn instead of exec for better stream handling
        const { spawn } = await import('child_process');
        await new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', args);

            ffmpeg.on('error', reject);

            ffmpeg.on('exit', code => {
                if (code === 0) resolve();
                else reject(new Error(`FFmpeg exited with code ${code}`));
            });
        });

        const resultBuffer = await fs.promises.readFile(tempOutput);

        // Cleanup temp files
        await Promise.allSettled([
            fs.promises.unlink(tempInput),
            fs.promises.unlink(tempOutput),
        ]);

        res.setHeader('Content-Type', `video/${format}`);
        res.setHeader('Content-Disposition', `attachment; filename=converted.${format}`);
        res.send(resultBuffer);
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ error: error.message });
    }
}
