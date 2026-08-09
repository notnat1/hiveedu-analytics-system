import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE } from "@/lib/api";

export default function InterventionBadge({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/interventions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const responseJson = await res.json().then(r => r.data ?? r);
          const data = responseJson.data || responseJson;
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
  let statusText = status.replace('_', ' ');

  if (status === 'OPEN') {
    colorClass = 'border-red-500/20 bg-red-500/10 text-red-400';
    statusText = t('components.status_open');
  }
  if (status === 'IN_PROGRESS') {
    colorClass = 'border-amber-500/20 bg-amber-500/10 text-amber-400';
    statusText = t('components.status_in_progress');
  }
  if (status === 'RESOLVED') {
    colorClass = 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
    statusText = t('components.status_resolved');
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${colorClass}`}>
      {statusText}
    </span>
  );
}
