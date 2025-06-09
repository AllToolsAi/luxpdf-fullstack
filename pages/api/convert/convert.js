import { execFileSync } from 'child_process';
import tmp from 'tmp';
import fs from 'fs/promises'; // Use promises version
import { promisify } from 'util';

const tmpFile = promisify(tmp.file);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code, fromLang, toLang } = req.body;

    if (!code || !fromLang || !toLang) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Define a map of supported conversions and their commands
    const conversionCommands = {
        'javascript-python': (input, output) => ['js2py', [input, '-o', output]],
        // Add more supported commands here as needed
    };

    const key = `${fromLang}-${toLang}`;
    if (!conversionCommands[key]) {
        return res.status(400).json({ error: 'Conversion not supported' });
    }

    let inputFilePath, outputFilePath;

    try {
        // Use async tmp.file to generate temp files and track cleanup
        inputFilePath = await tmpFile({ postfix: `.${fromLang}` });
        outputFilePath = await tmpFile({ postfix: `.${toLang}` });

        // Write code asynchronously
        await fs.writeFile(inputFilePath, code);

        // Get command and args
        const [command, args] = conversionCommands[key](inputFilePath, outputFilePath);

        // Execute command with execFileSync to avoid shell injection risks
        execFileSync(command, args, {
            stdio: 'pipe',
            timeout: 5000 // Set timeout to prevent hanging
        });

        // Read converted code asynchronously
        const convertedCode = await fs.readFile(outputFilePath, 'utf8');

        res.status(200).json({ convertedCode });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ error: 'Conversion failed', details: error.message });
    } finally {
        // Clean up temp files asynchronously if they exist
        if (inputFilePath) await fs.unlink(inputFilePath).catch(() => {});
        if (outputFilePath) await fs.unlink(outputFilePath).catch(() => {});
    }
}
