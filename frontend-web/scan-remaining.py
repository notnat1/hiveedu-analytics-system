import re, os

files = [
    'src/app/dashboard/page.tsx',
    'src/app/dashboard/records/page.tsx',
    'src/app/dashboard/attendance/page.tsx',
    'src/app/login/page.tsx',
]

jsx_text = re.compile(r'>(\s+)([A-Z][a-z][^<>{}\n]{4,}?)(\s+)<')

skip_phrases = {'className', 'import ', '//', 't("', "t('", 'HiveEdu', 'typeof', 'console.', 'const ', 'let ', 'interface', 'type ', 'function ', 'return ', 'async ', 'await '}

for path in files:
    if not os.path.exists(path):
        print(f'Missing: {path}')
        continue
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    issues = []
    for i, line in enumerate(lines, 1):
        if any(p in line for p in skip_phrases): continue
        stripped = line.strip()
        if not stripped or stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('import'):
            continue
        for m in jsx_text.finditer(line):
            text = m.group(2).strip()
            if len(text) > 3:
                issues.append((i, text))
    if issues:
        print(f'\n=== {path} ({len(issues)}) ===')
        seen = set()
        for i, text in issues:
            if text not in seen:
                print(f'  L{i}: {text!r}')
                seen.add(text)
    else:
        print(f'OK: {path}')
