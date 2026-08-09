import fs from 'fs';

// Fix InterventionModal
let content = fs.readFileSync('src/components/InterventionModal.tsx', 'utf8');

// replace useEffect and fetchExistingIntervention
const useEffectRegex = /  useEffect\(\(\) => \{\n    if \(isOpen\) \{\n      fetchExistingIntervention\(\);\n    \} else \{\n      setNote\(''\);\n      setActionPlan\(''\);\n      setStatus\('OPEN'\);\n      setExistingId\(null\);\n      setError\(''\);\n    \}\n  \}, \[isOpen, userId\]\);\n\n  const fetchExistingIntervention = async \(\) => \{[\s\S]*?console\.error\('Failed to fetch existing intervention:', err\);\n    \}\n  \};/m;

const newUseEffect = `  useEffect(() => {
    const fetchExistingIntervention = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(\`\${API_BASE}/interventions/user/\${userId}\`, {
          headers: { Authorization: \`Bearer \${token}\` },
        });
        if (res.ok) {
          const responseJson = await res.json().then(r => r.data ?? r);
          const data = responseJson.data || responseJson;
          if (data && data.length > 0) {
            const latest = data[0];
            setNote(latest.note);
            setActionPlan(latest.actionPlan || '');
            setStatus(latest.status);
            setExistingId(latest.id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch existing intervention:', err);
      }
    };

    if (isOpen) {
      void fetchExistingIntervention();
    } else {
      setTimeout(() => {
        setNote('');
        setActionPlan('');
        setStatus('OPEN');
        setExistingId(null);
        setError('');
      }, 0);
    }
  }, [isOpen, userId]);`;

content = content.replace(useEffectRegex, newUseEffect);

// Fix unused import
content = content.replace(
  "import { X, Save, Clock, Target, CheckCircle2, AlertTriangle } from 'lucide-react';",
  "import { X, Save, Clock, Target, AlertTriangle } from 'lucide-react';"
);
content = content.replace(
  "import { X, CheckCircle2, AlertCircle } from 'lucide-react';",
  "import { X, AlertCircle } from 'lucide-react';"
);

// Fix any type in handleSubmit
content = content.replace(
  /const result: any = await res\.json\(\);/,
  `const result: { message?: string } = await res.json();`
);

fs.writeFileSync('src/components/InterventionModal.tsx', content);

// Fix AiCounselorChat
let aiContent = fs.readFileSync('src/components/AiCounselorChat.tsx', 'utf8');

aiContent = aiContent.replace(
  /        setMessages\(\(prev: any\) => \[\.\.\.prev, \{ role: "ai", content: data\.reply \|\| data\.content \}\]\);/,
  `        setMessages((prev: { role: "user"|"ai"; content: string }[]) => [...prev, { role: "ai", content: data.reply || data.content }]);`
);

fs.writeFileSync('src/components/AiCounselorChat.tsx', aiContent);

// Fix RealtimeNotifications.tsx
let rContent = fs.readFileSync('src/components/RealtimeNotifications.tsx', 'utf8');
rContent = rContent.replace(/import { io, Socket } from "socket.io-client";/, 'import { io } from "socket.io-client";');
fs.writeFileSync('src/components/RealtimeNotifications.tsx', rContent);

console.log("Fixes applied!");
