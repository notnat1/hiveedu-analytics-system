const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'frontend-web/src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Pattern 1: const xyz = (await xxxResponse.json()) as T;
    // We want to replace `await xxx.json()` with `await xxx.json().then(r => r.data ?? r)`
    content = content.replace(/await (\w+)\.json\(\)/g, 'await $1.json().then(r => r.data ?? r)');

    // For dashboard/page.tsx, we already manually updated it to use `_featJson.data || _featJson`, 
    // so we might end up with `await response.json().then(...).data || ...` which is safe but redundant.
    // Let's just run it, it'll convert `await usersResponse.json()` to `await usersResponse.json().then(r => r.data ?? r)`.

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
