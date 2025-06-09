import { VM } from 'vm2';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const dangerousPatterns = require('./dangerousPatterns.json');

export class CodeSandbox {
    constructor() {
        this.vm = new VM({
            timeout: 1000,
            sandbox: {},
            eval: false,
            wasm: false,
            fixAsync: true
        });
    }

    static analyzeCode(code) {
        return dangerousPatterns.some(pattern => {
            const regex = new RegExp(pattern, 'gm');
            return regex.test(code);
        });
    }

    executeSafe(code) {
        if (CodeSandbox.analyzeCode(code)) {
            throw new Error('Potentially dangerous code detected');
        }

        try {
            return this.vm.run(code);
        } catch (error) {
            console.error('Sandbox execution error:', error);
            throw new Error('Code execution failed');
        }
    }

    static runInContainer(code, lang) {
        const containerName = `exec-${Date.now()}`;
        try {
            const cmd = `docker run --rm --name ${containerName} \
        -e CODE="${Buffer.from(code).toString('base64')}" \
        -e LANG=${lang} \
        code-executor:latest`;

            const output = execSync(cmd, {
                timeout: 5000,
                stdio: 'pipe'
            });

            return output.toString();
        } finally {
            try {
                execSync(`docker kill ${containerName}`, { stdio: 'ignore' });
            } catch (e) {}
        }
    }
}
