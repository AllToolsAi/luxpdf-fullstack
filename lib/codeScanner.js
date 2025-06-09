import { parse } from '@babel/parser';
import { readFileSync } from 'fs';
import path from 'path';

const SUSPICIOUS_PATTERNS = [
    'process.exit',
    'require("child_process")',
    'execSync',
    'Function(',
    'eval(',
    'WebAssembly.instantiate',
    'fs.writeFile'
];

const COMMON_VULNS = JSON.parse(
    readFileSync(path.join(process.cwd(), 'config/vulnerabilities.json'))
);

export class CodeScanner {
    static scan(code, lang = 'javascript') {
        const issues = [];

        // Pattern matching
        SUSPICIOUS_PATTERNS.forEach(pattern => {
            if (code.includes(pattern)) {
                issues.push({
                    type: 'dangerous-pattern',
                    pattern,
                    severity: 'high'
                });
            }
        });

        // AST Analysis
        try {
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['typescript']
            });

            this.traverseAST(ast, issues);
        } catch (e) {
            // Ignore parse errors
        }

        // Language-specific checks
        if (lang === 'python') {
            this.checkPython(code, issues);
        }

        return issues.length ? issues : null;
    }

    static traverseAST(node, issues) {
        if (!node) return;

        // Check for CallExpression nodes
        if (node.type === 'CallExpression') {
            const callName = node.callee.name || '';
            if (COMMON_VULNS.includes(callName)) {
                issues.push({
                    type: 'vulnerable-call',
                    call: callName,
                    severity: 'critical'
                });
            }
        }

        // Recursively traverse child nodes if body exists
        if (Array.isArray(node.body)) {
            node.body.forEach(child => this.traverseAST(child, issues));
        } else if (node.body) {
            this.traverseAST(node.body, issues);
        }

        // Traverse other possible child nodes to improve coverage
        const keys = Object.keys(node);
        keys.forEach(key => {
            const child = node[key];
            if (Array.isArray(child)) {
                child.forEach(c => {
                    if (c && typeof c.type === 'string') {
                        this.traverseAST(c, issues);
                    }
                });
            } else if (child && typeof child.type === 'string') {
                this.traverseAST(child, issues);
            }
        });
    }

    static checkPython(code, issues) {
        const pyPatterns = [
            'import os',
            'subprocess.run',
            'eval(',
            '__import__'
        ];

        pyPatterns.forEach(pattern => {
            if (code.includes(pattern)) {
                issues.push({
                    type: 'python-danger',
                    pattern,
                    severity: 'high'
                });
            }
        });
    }
}
