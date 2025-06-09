// import lighthouse from 'lighthouse';
// import { writeFileSync } from 'fs';
//
// export async function runSEOAudit(url) {
//     const results = await lighthouse(url, {
//         output: 'json',
//         onlyCategories: ['seo'],
//     });
//
//     const audits = Object.values(results.lhr.audits);
//     const issues = audits
//         .filter(a => a.score !== null && a.score < 0.9)
//         .map(a => ({
//             id: a.id,
//             title: a.title,
//             description: a.description,
//             score: Math.round(a.score * 100),
//         }));
//
//     const report = {
//         score: Math.round(results.lhr.categories.seo.score * 100),
//         issues,
//     };
//
//     writeFileSync('seo-report.json', JSON.stringify(report, null, 2));
//     return report;
// }
