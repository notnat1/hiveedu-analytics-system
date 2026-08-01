const fs = require('fs');
const path = require('path');

function findTSXFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      results = results.concat(findTSXFiles(full));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      if (!item.includes('.d.ts') && item !== 'i18n.ts' && !full.includes('i18n')) {
        results.push(full);
      }
    }
  }
  return results;
}

const files = findTSXFiles('src');
let grandTotal = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative('src', file);
  const lines = content.split('\n');
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmed = line.trim();

    // Skip comments, imports, type definitions, CSS classes, SVG paths/defs
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    if (trimmed.startsWith('import ')) continue;
    if (trimmed.startsWith('type ') || trimmed.startsWith('interface ')) continue;
    if (trimmed.includes('className=') && !trimmed.includes('>')) continue;

    // 1. JSX text content: >English Text<
    const jsxTextRegex = />([^<{}$\n\r]+)</g;
    let m;
    while ((m = jsxTextRegex.exec(line)) !== null) {
      const text = m[1].trim();
      if (text.length > 1 && /[a-zA-Z]{2,}/.test(text) && !text.includes('t(') && !text.includes('t("')) {
        // Filter out code patterns
        if (text.includes('useState') || text.includes('=>') || text.includes('===') || 
            text.includes('setIs') || text.includes('.length') || text.includes('const ') ||
            text.includes('&&') || text.includes('||') || text.startsWith('(') ||
            text.includes('.map') || text.includes('.filter') || text.includes('.find') ||
            text.includes('return') || text.includes('null') || text.includes('prev') ||
            text.includes('case ') || text.includes('switch') || text.includes('.toString') ||
            text.match(/^\d/) || text.includes('className') || text.includes('onClick') ||
            text.includes('onChange') || text.includes('key=') || text.includes('ref=') ||
            text.includes('style=') || text.includes('href=')) continue;
        findings.push({ lineNum, type: 'JSX_TEXT', text });
      }
    }

    // 2. placeholder="..." (not using t())
    const phMatches = line.matchAll(/placeholder="([^"]+)"/g);
    for (const pm of phMatches) {
      if (/[a-zA-Z]{2,}/.test(pm[1]) && !line.includes('placeholder={t(')) {
        findings.push({ lineNum, type: 'PLACEHOLDER', text: pm[1] });
      }
    }

    // 3. title="..." (not using t())
    const titleMatches = line.matchAll(/title="([^"]+)"/g);
    for (const tm of titleMatches) {
      if (/[a-zA-Z]{3,}/.test(tm[1]) && !line.includes('title={t(') && !tm[1].startsWith('http')) {
        findings.push({ lineNum, type: 'TITLE', text: tm[1] });
      }
    }

    // 4. aria-label="..." (not using t())
    const ariaMatches = line.matchAll(/aria-label="([^"]+)"/g);
    for (const am of ariaMatches) {
      if (/[a-zA-Z]{3,}/.test(am[1]) && !line.includes('aria-label={t(')) {
        findings.push({ lineNum, type: 'ARIA_LABEL', text: am[1] });
      }
    }

    // 5. Toast messages: message: "..."
    const toastMatches = line.matchAll(/message:\s*"([^"]+)"/g);
    for (const tm of toastMatches) {
      if (/[a-zA-Z]{3,}/.test(tm[1])) {
        findings.push({ lineNum, type: 'TOAST_MSG', text: tm[1] });
      }
    }

    // 6. setError("...") or throw new Error("...")
    const errorMatches = line.matchAll(/(?:setError|setPageError|Error)\("([^"]+)"\)/g);
    for (const em of errorMatches) {
      if (/[a-zA-Z]{3,}/.test(em[1]) && !em[1].includes('t(')) {
        findings.push({ lineNum, type: 'ERROR_MSG', text: em[1] });
      }
    }

    // 7. String literals used as JSX content: {"Some text"}
    const jsxStringMatches = line.matchAll(/\{["']([^"']+)["']\}/g);
    for (const jm of jsxStringMatches) {
      if (/[a-zA-Z]{3,}/.test(jm[1]) && !jm[1].includes('t(') && !jm[1].includes('http') && 
          !jm[1].includes('/') && !jm[1].includes('.') && jm[1].length > 3) {
        findings.push({ lineNum, type: 'JSX_STRING', text: jm[1] });
      }
    }

    // 8. alert("...") or confirm("...")
    const alertMatches = line.matchAll(/(?:alert|confirm|window\.alert)\("([^"]+)"\)/g);
    for (const am of alertMatches) {
      if (/[a-zA-Z]{3,}/.test(am[1])) {
        findings.push({ lineNum, type: 'ALERT', text: am[1] });
      }
    }

    // 9. label: "..." in objects (for charts, badges, etc)
    const labelMatches = line.matchAll(/(?:label|title|description|name|text|header|tooltip|message):\s*"([^"]{3,})"/g);
    for (const lm of labelMatches) {
      if (/[a-zA-Z]{3,}/.test(lm[1]) && !lm[1].includes('t(') && !lm[1].includes('http') &&
          !lm[1].includes('/dashboard') && !lm[1].startsWith('#') && !lm[1].includes('Bearer') &&
          !lm[1].includes('Content-Type') && !lm[1].includes('application/') &&
          !lm[1].includes('token') && !lm[1].includes('hiveedu') && !lm[1].includes('localhost') &&
          !lm[1].includes('.json') && !lm[1].includes('.xlsx')) {
        findings.push({ lineNum, type: 'OBJ_LABEL', text: lm[1] });
      }
    }

    // 10. Ternary text: ? "English" : "Other" 
    const ternaryMatches = line.matchAll(/\?\s*"([^"]{3,})"\s*:/g);
    for (const tm of ternaryMatches) {
      if (/[a-zA-Z]{3,}/.test(tm[1]) && !tm[1].includes('t(') && !tm[1].includes('http') &&
          !tm[1].includes('/') && !tm[1].includes('.') && !tm[1].match(/^[A-Z_]+$/) &&
          !tm[1].includes('Bearer') && !tm[1].includes('#')) {
        findings.push({ lineNum, type: 'TERNARY', text: tm[1] });
      }
    }
    
    // Also: "English" in colon part
    const ternaryMatches2 = line.matchAll(/:\s*"([^"]{3,})"\s*[;),\n\r}]/g);
    for (const tm of ternaryMatches2) {
      if (/[a-zA-Z]{3,}/.test(tm[1]) && !tm[1].includes('t(') && !tm[1].includes('http') &&
          !tm[1].includes('/') && !tm[1].includes('.') && !tm[1].match(/^[A-Z_]+$/) &&
          !tm[1].includes('Bearer') && !tm[1].includes('#') && !tm[1].includes('token') &&
          !tm[1].includes('Content') && !tm[1].includes('application')) {
        findings.push({ lineNum, type: 'TERNARY2', text: tm[1] });
      }
    }
  }

  // Deduplicate findings
  const seen = new Set();
  const unique = findings.filter(f => {
    const key = `${f.lineNum}:${f.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (unique.length > 0) {
    console.log(`\n=== ${relPath} (${unique.length} findings) ===`);
    unique.forEach(f => console.log(`  L${f.lineNum} [${f.type}] ${f.text}`));
    grandTotal += unique.length;
  }
}

console.log(`\n\n=============================`);
console.log(`GRAND TOTAL: ${grandTotal} hardcoded strings remaining`);
console.log(`=============================`);
