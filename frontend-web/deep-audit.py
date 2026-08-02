import re, os, json

# Comprehensive i18n audit - scans ALL TSX files for hardcoded user-facing strings
SRC = 'src'

# Patterns to flag as potentially hardcoded UI text
jsx_text_re = re.compile(r'>\s*([A-Z][a-z][^<>{}\n`]{3,}?)\s*<')
label_re = re.compile(r'<label[^>]*>\s*\n\s*([A-Z][a-z][^<>{}\n]{3,}?)\s*\n')
save_button_re = re.compile(r'"(Saving|Save|Loading|Cancel|Edit|Delete|Update|Add|Create|Remove|Select|Submit|Reset|Back|Next|Close|Confirm|Search|Export|Refresh|Apply|Clear)[^"]{0,50}"')
toast_hardcoded_re = re.compile(r'showToast\s*\(\s*"([^"]{5,})"')

# Already translated patterns
already_done = re.compile(r't\(["\']|{t\(')

# Skip these
skip_lines = {'import', '//', ' * ', '/*', 'className=', 'href=', 'http', 'localhost', 'const ', 'let ', 'var ', 'interface ', 'type ', 'console.', 'Bearer', 'Authorization'}

results = {}

def scan_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    lines = content.split('\n')
    issues = []
    
    for i, line in enumerate(lines, 1):
        # Skip already translated lines
        if already_done.search(line):
            continue
        # Skip non-UI lines
        stripped = line.strip()
        if not stripped:
            continue
        if any(s in line for s in skip_lines):
            continue
        if stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('/*'):
            continue
        
        # Check JSX text content
        for m in jsx_text_re.finditer(line):
            text = m.group(1).strip()
            if len(text) >= 4 and not any(x in text for x in ['className', 'HiveEdu', '${', '{', 'http']):
                issues.append(f'L{i} [JSX-TEXT]: {text!r}')
        
        # Check hardcoded button/string literals
        for m in save_button_re.finditer(line):
            text = m.group(0)
            issues.append(f'L{i} [STRING-LIT]: {text}')
        
        # Check hardcoded toast messages
        for m in toast_hardcoded_re.finditer(line):
            text = m.group(1)
            issues.append(f'L{i} [TOAST]: {text!r}')
    
    return issues

def scan_dir(dirpath):
    for root, dirs, files in os.walk(dirpath):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', '.git', '__pycache__']]
        for fname in files:
            if fname.endswith('.tsx') or fname.endswith('.ts'):
                fpath = os.path.join(root, fname)
                issues = scan_file(fpath)
                if issues:
                    key = fpath.replace('\\', '/').replace(SRC + '/', '')
                    results[key] = issues

scan_dir(SRC)

total = 0
for path, issues in sorted(results.items()):
    deduped = list(dict.fromkeys(issues))  # preserve order, remove dups
    print(f'\n=== {path} ({len(deduped)} items) ===')
    for item in deduped:
        print(f'  {item}')
    total += len(deduped)

print(f'\n\nTOTAL POTENTIAL HARDCODED STRINGS: {total}')
print(f'FILES WITH ISSUES: {len(results)}')
