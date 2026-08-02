import fs from 'fs';
import path from 'path';

// More targeted scan: look for JSX content patterns inside specific UI blocks
const files = [
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/layout.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/attendance/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/records/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/users/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/analytics/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/history/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/tutors/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/audit-logs/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/app/dashboard/settings/page.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/components/RealtimeNotifications.tsx',
  'd:/hiveedu-analytics-system/frontend-web/src/components/OnboardingTour.tsx',
];

// Patterns that indicate hardcoded translatable text in JSX
// We look for:
// 1. JSX text nodes that are plain English (not wrapped in t())
// 2. placeholder/title attributes with English text
// 3. Template literals/strings in toast calls or error messages

const skipPatterns = [
  /^\s*(\/\/|\/\*|\*)/,         // comments
  /import\s+/,                   // imports
  /t\(["']/,                     // already translated
  /console\./,                   // console logs
  /className=/,                  // className attrs
  /=>/,                          // arrow functions (usually logic)
  /const\s+|let\s+|var\s+/,     // variable declarations that aren't JSX
];

function shouldSkipLine(line) {
  return skipPatterns.some(p => p.test(line));
}

// Match JSX text content between tags
const jsxTextRe = /(?<=>)\s*([A-Z][a-z][^<>{}\n`]{4,}?)\s*(?=<)/g;
// Match English strings in attributes (placeholder, title, aria-label)
const attrTextRe = /(?:placeholder|aria-label|title)={?["']([A-Za-z][^"']{5,})["']}?/g;
// Toast / alert messages 
const toastRe = /(?:toast\.|alert\(|message:\s*)["'`]([A-Z][a-z][^"'`\n]{5,})["'`]/g;
// Button/label text in JSX props (common label="..." pattern)
const labelRe = /label=["']([A-Za-z][^"']{4,})["']/g;

const results = {};

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileKey = filePath.split('/src/')[1];
  const items = [];

  lines.forEach((line, i) => {
    if (shouldSkipLine(line)) return;
    
    for (const re of [jsxTextRe, attrTextRe, toastRe, labelRe]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        const text = m[1].trim();
        // Must be real English, skip single words that are pure identifiers
        if (text.length < 4) continue;
        if (/^\d+$/.test(text)) continue;
        if (text.includes('\\n') || text.includes('${')) continue;
        // Skip known false positives
        if (['HiveEdu', 'Analytics', 'GitHub'].some(s => text.includes(s))) continue;
        items.push(`  L${i+1}: "${text}"`);
      }
    }
  });

  if (items.length > 0) {
    results[fileKey] = items;
  }
}

let total = 0;
for (const [file, items] of Object.entries(results)) {
  console.log(`\n=== ${file} (${items.length}) ===`);
  // dedupe
  const seen = new Set();
  for (const item of items) {
    if (!seen.has(item)) { console.log(item); seen.add(item); total++; }
  }
}
console.log(`\nTOTAL unique issues: ${total}`);
