import { CodeScanner } from '../lib/codeScanner';
import { applyRateLimit } from './rateLimit';

export async function securityMiddleware(req, res) {
    // Rate limiting
    const rateLimitResponse = await applyRateLimit(req, res);
    if (rateLimitResponse) return rateLimitResponse;

    // Code scanning for POST requests
    if (req.method === 'POST' && req.body?.code) {
        const issues = CodeScanner.scan(req.body.code, req.body.language);
        if (issues) {
            return new Response(JSON.stringify({
                error: 'Security issues detected',
                issues
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    return null;
}
