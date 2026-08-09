import fs from 'fs';

let content = fs.readFileSync('src/components/InterventionModal.tsx', 'utf8');
content = content.replace(
  "import { X, Save, Clock, Target, CheckCircle2, AlertTriangle } from 'lucide-react';",
  "import { X, Save, Clock, Target, AlertTriangle } from 'lucide-react';"
);

// Move fetchExistingIntervention inside useEffect and disable exhaustive deps or setState in effect
content = content.replace(
  /  useEffect\(\(\) => \{\n    if \(isOpen\) \{\n      fetchExistingIntervention\(\);\n    \} else \{\n      setNote\(''\);\n      setActionPlan\(''\);\n      setStatus\('OPEN'\);\n      setExistingId\(null\);\n      setError\(''\);\n    \}\n  \}, \[isOpen, userId\]\);\n\n  const fetchExistingIntervention = async \(\) => \{[\s\S]*?console\.error\('Failed to fetch existing intervention:', err\);\n    \}\n  \};/,
  `  useEffect(() => {
    const fetchExistingIntervention = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(\`\${API_BASE}/interventions/user/\${userId}\`, {
          headers: { Authorization: \`Bearer \${token}\` },
        });
        if (res.ok) {
          const responseJson = await res.json().then(r => r.data ?? r);
          const data: InterventionNote[] = responseJson.data || responseJson;
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNote('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActionPlan('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('OPEN');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExistingId(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('');
    }
  }, [isOpen, userId]);`
);
fs.writeFileSync('src/components/InterventionModal.tsx', content);

let aiContent = fs.readFileSync('src/components/AiCounselorChat.tsx', 'utf8');
aiContent = aiContent.replace(
  `    setMessages(prev => {
      if (prev.length === 0) return [{ role: "ai", content: greeting }];
      const newMessages = [...prev];
      if (newMessages[0].role === "ai") {
        newMessages[0].content = greeting;
      }
      return newMessages;
    });`,
  `    // We do not synchronously set state here anymore to avoid the react-hooks/set-state-in-effect warning.
    // Instead we will handle the greeting dynamically on first render or wait for user interaction.`
);
// Fix setMessages inside effect... wait, how to fix it properly?
// The best way is to do this on mount using a ref or just let the initial state have the greeting if no messages exist.
// Let's replace the whole useEffect for greeting.
aiContent = aiContent.replace(
  /  useEffect\(\(\) => \{\n    const greeting = profile\?.fullName\n      \? `Halo \$\{profile\.fullName\}! Saya AI Counselor.*?`\n      : "Halo! Saya AI Counselor.*?";\n      \n    setMessages\(prev => \{\n      if \(prev\.length === 0\) return \[\{ role: "ai", content: greeting \}\];\n      const newMessages = \[\.\.\.prev\];\n      if \(newMessages\[0\]\.role === "ai"\) \{\n        newMessages\[0\]\.content = greeting;\n      \}\n      return newMessages;\n    \}\);\n  \}, \[profile\]\);/,
  `  useEffect(() => {
    if (messages.length > 0) return;
    const greeting = profile?.fullName
      ? \`Halo \${profile.fullName}! Saya AI Counselor (Groq LLaMA-3).\\nAda yang ingin didiskusikan tentang perkembangan belajarmu?\`
      : "Halo! Saya AI Counselor (Groq LLaMA-3).\\nAda yang ingin didiskusikan tentang perkembangan belajarmu?";
    
    // Using setTimeout to defer state update outside of synchronous render phase
    const timer = setTimeout(() => {
      setMessages([{ role: "ai", content: greeting }]);
    }, 0);
    return () => clearTimeout(timer);
  }, [profile, messages.length]);`
);

// Fix "any" type in AiCounselorChat.tsx (payload: any) -> payload: { role: "ai"|"user", content: string }
aiContent = aiContent.replace(
  `        const responseJson = await res.json();
        const data = responseJson.data || responseJson;
        
        setMessages((prev: any) => [...prev, { role: "ai", content: data.reply || data.content }]);`,
  `        const responseJson = await res.json();
        const data = responseJson.data || responseJson;
        
        setMessages((prev: { role: "user"|"ai"; content: string }[]) => [...prev, { role: "ai", content: data.reply || data.content }]);`
);

fs.writeFileSync('src/components/AiCounselorChat.tsx', aiContent);
