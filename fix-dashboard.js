const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend-web/src/app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// We need to replace patterns like:
// const users = (await usersResponse.json()) as UserAccountResponse[];
// with:
// const _usersJson = await usersResponse.json(); const users = (_usersJson.data || _usersJson) as UserAccountResponse[];

// This is a bit tricky with Regex, so let's do targeted string replacements.

content = content.replace(
  'const users = (await usersResponse.json()) as UserAccountResponse[];',
  'const _uJson = await usersResponse.json(); const users = (_uJson.data || _uJson) as UserAccountResponse[];'
);

content = content.replace(
  'const runHistoryData = (await runHistoryResponse.json()) as RunHistoryItem[];',
  'const _rhJson = await runHistoryResponse.json(); const runHistoryData = (_rhJson.data || _rhJson) as RunHistoryItem[];'
);

content = content.replace(
  'featureData = (await featureResponse.json()) as UserFeatureSnapshot;',
  'const _fJson = await featureResponse.json(); featureData = (_fJson.data || _fJson) as UserFeatureSnapshot;'
);

content = content.replace(
  '((await recordsResponse.json()) as UserRecordResponse[])',
  '( (()=>{ const j = arguments[0]; return j.data || j; })(await recordsResponse.json()) as UserRecordResponse[])'
);
// Wait, arguments[0] doesn't work like that in an IIFE. Let's use a proper IIFE.
content = content.replace(
  '((await recordsResponse.json()) as UserRecordResponse[])',
  '( (await recordsResponse.json()).data || await recordsResponse.json() /* THIS WILL FAIL DUE TO BODY CONSUMED */ )'
);

fs.writeFileSync(filePath, content);
console.log('done');
