// lib/adsenseConfig.js
const adsenseConfig = {
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-xxxxxxxxxxxxxxxx',
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT || 'yyyyyyyyyy'
};

export default adsenseConfig;
