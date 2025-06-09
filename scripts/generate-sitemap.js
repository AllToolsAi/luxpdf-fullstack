import fs from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

async function generateSitemap() {
    const links = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/tools/pdf/compress', changefreq: 'weekly' },
        { url: '/tools/programming/converter', changefreq: 'weekly' },
        // ➕ Add more routes as needed
    ];

    const stream = new SitemapStream({ hostname: 'https://yourdomain.com' }); // Replace with your actual domain

    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) => data.toString());

    fs.writeFileSync('./public/sitemap.xml', xml);

    console.log('✅ Sitemap generated successfully!');
}

generateSitemap().catch((err) => {
    console.error('❌ Error generating sitemap:', err);
    process.exit(1);
});
