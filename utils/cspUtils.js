const generateCsp = () => {
    const production = process.env.NODE_ENV === 'production';

    // Default policy
    let policy = {};
    policy['default-src'] = ["'self'"];
    policy['script-src'] = [
        "'self'",
        "'unsafe-eval'", // Required for Next.js dev mode
        production ? null : "'unsafe-inline'", // Only allow in development
    ];
    policy['style-src'] = [
        "'self'",
        "'unsafe-inline'", // Next.js requires this for styles
        'https://fonts.googleapis.com'
    ];
    policy['font-src'] = ["'self'", 'https://fonts.gstatic.com'];
    policy['img-src'] = ["'self'", 'data:', 'blob:'];
    policy['connect-src'] = ["'self'"];

    // Remove any falsy values (null, undefined, etc)
    Object.keys(policy).forEach(key => {
        policy[key] = policy[key].filter(Boolean);
    });

    return policy;
};

const generateCspHeader = () => {
    const policy = generateCsp();
    return Object.entries(policy)
        .map(([key, value]) => `${key} ${value.join(' ')}`)
        .join('; ');
};

module.exports = {
    generateCsp,
    generateCspHeader
};
