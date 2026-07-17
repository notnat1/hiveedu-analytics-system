import React, { useEffect, useState } from 'react';

export default function InterventionBadge({ userId }: { userId: string }) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/interventions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setStatus(data[0].status);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStatus();
  }, [userId]);

  if (!status) return null;

  let colorClass = 'border-white/10 bg-white/5 text-zinc-400';
  if (status === 'OPEN') colorClass = 'border-red-500/20 bg-red-500/10 text-red-400';
  if (status === 'IN_PROGRESS') colorClass = 'border-amber-500/20 bg-amber-500/10 text-amber-400';
  if (status === 'RESOLVED') colorClass = 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${colorClass}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
