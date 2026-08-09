import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertCircle } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

interface InterventionNote {
  id: string;
  userId: string;
  riskLevel: string;
  predictedScore: number | null;
  note: string;
  actionPlan: string | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  riskLevel: string;
  predictedScore: number | null;
  onSuccess: () => void;
}

export default function InterventionModal({
  isOpen,
  onClose,
  userId,
  userName,
  riskLevel,
  predictedScore,
  onSuccess,
}: InterventionModalProps) {
  const { t } = useTranslation();
  const [note, setNote] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [status, setStatus] = useState<'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('OPEN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExistingIntervention = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/interventions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const responseJson = await res.json();
          const data: InterventionNote[] = responseJson.data || responseJson;
          if (data && data.length > 0) {
            const latest = data[0]; // Assuming ordered by createdAt DESC
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
  }, [isOpen, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('Note field is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const payload = {
        userId,
        riskLevel,
        predictedScore,
        note,
        actionPlan,
        status,
      };

      const url = existingId 
        ? `http://localhost:3000/interventions/${existingId}`
        : `http://localhost:3000/interventions`;
        
      const method = existingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save intervention');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving intervention:', err);
      setError('Unable to save intervention right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-white/[0.05] bg-white dark:bg-[#09090b] p-8 shadow-2xl backdrop-blur-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t("components.intervention_followup")}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">User Account: {userName}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("components.followup_note")}</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("components.placeholder_followup")}
              rows={3}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("components.action_plan")}</label>
            <textarea
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder={t("components.placeholder_action_plan")}
              rows={2}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("components.status")}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="OPEN" className="bg-white dark:bg-[#09090b]">{t("components.status_open")}</option>
              <option value="IN_PROGRESS" className="bg-white dark:bg-[#09090b]">{t("components.status_in_progress")}</option>
              <option value="RESOLVED" className="bg-white dark:bg-[#09090b]">{t("components.status_resolved")}</option>
            </select>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_10px_25px_rgba(14,165,233,0.3)] transition-all hover:from-blue-500 hover:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : existingId ? 'Update Follow-up' : 'Save Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
