import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const require = createRequire(import.meta.url);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { audioData, voiceModel, effects } = req.body;

    if (!audioData || !voiceModel || !effects) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const tempInput = path.join('/tmp', `input_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`);
    const tempOutput = path.join('/tmp', `output_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);

    try {
        // Save incoming audio file
        await fs.writeFile(tempInput, Buffer.from(audioData, 'base64'));

        // Spawn python process
        await new Promise((resolve, reject) => {
            const args = [
                'voice_engine.py',
                '--input', tempInput,
                '--model', voiceModel,
                '--pitch', effects.pitchShift || '0',
                '--output', tempOutput
            ];

            const pythonProcess = spawn('python3', args);

            let stderr = '';
            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('error', (err) => reject(err));

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Python process exited with code ${code}: ${stderr}`));
                }
            });
        });

        const processedAudio = await fs.readFile(tempOutput);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'attachment; filename=processed.mp3');
        res.status(200).send(processedAudio);

    } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ error: 'Audio processing failed' });
    } finally {
        // Cleanup files safely
        [tempInput, tempOutput].forEach(async (file) => {
            try {
                await fs.unlink(file);
            } catch {}
        });
    }
}
