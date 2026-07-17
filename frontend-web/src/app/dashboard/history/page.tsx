"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AcademicHistoryRecord {
  id: string;
  date: string;
  math: number;
  logic: number;
  english: number;
  teacherFeedback: string;
  x2: number;
}

const INITIAL_HISTORY_RECORDS: AcademicHistoryRecord[] = [
  {
    id: "history-1",
    date: "2026-02-04",
    math: 82,
    logic: 79,
    english: 84,
    teacherFeedback: "Strong consistency with steady logical pacing.",
    x2: 81.7,
  },
  {
    id: "history-2",
    date: "2026-02-18",
    math: 85,
    logic: 83,
    english: 86,
    teacherFeedback: "Sharper decision-making and improved answer control.",
    x2: 84.7,
  },
  {
    id: "history-3",
    date: "2026-03-06",
    math: 87,
    logic: 86,
    english: 88,
    teacherFeedback: "Excellent upward trend with stronger language precision.",
    x2: 87.0,
  },
  {
    id: "history-4",
    date: "2026-03-24",
    math: 90,
    logic: 88,
    english: 91,
    teacherFeedback: "Balanced execution across all competency areas.",
    x2: 89.7,
  },
];

export default function AcademicHistoryPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [historyRecords] = useState<AcademicHistoryRecord[]>(INITIAL_HISTORY_RECORDS);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  const [selectedTrendMetric] = useState<"x2">("x2");

  const trendData = useMemo(
    () =>
      historyRecords.map((record) => ({
        date: new Date(record.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        x2: Number(record[selectedTrendMetric].toFixed(1)),
      })),
    [historyRecords, selectedTrendMetric],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Academic History</h1>
        <p className="text-sm text-zinc-500">
          Review long-range tryout movement and archived academic records for this user.
        </p>
      </div>

      <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">X2 Tryout Trend</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-2">
              Historical average score trajectory
            </p>
          </div>
          <div className="inline-flex items-center rounded-full bg-[#09090b] border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
            Live UI Preview
          </div>
        </div>

        <div className="h-[320px] w-full min-w-0 min-h-[320px]">
          {hasMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.35} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(9, 9, 11, 0.92)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    color: "#f4f4f5",
                    backdropFilter: "blur(24px)",
                  }}
                  labelStyle={{ color: "#a1a1aa", fontSize: "11px" }}
                />
                <Line
                  type="monotone"
                  dataKey="x2"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6", stroke: "#09090b", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#60a5fa", stroke: "#09090b", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] border border-white/5 bg-[#09090b] text-sm text-zinc-500">
              Preparing chart surface...
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-100">Archived Academic Records</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-2">
            Historical subject-by-subject performance detail
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="border-b border-white/5 py-4 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 whitespace-nowrap">Date</th>
                <th className="border-b border-white/5 py-4 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 whitespace-nowrap">Math</th>
                <th className="border-b border-white/5 py-4 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 whitespace-nowrap">Logic</th>
                <th className="border-b border-white/5 py-4 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 whitespace-nowrap">English</th>
                <th className="border-b border-white/5 py-4 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 whitespace-nowrap">Teacher Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyRecords.map((record) => (
                <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-4 text-sm text-zinc-300 whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-5 px-4 text-sm text-zinc-400 whitespace-nowrap">{record.math.toFixed(1)}</td>
                  <td className="py-5 px-4 text-sm text-zinc-400 whitespace-nowrap">{record.logic.toFixed(1)}</td>
                  <td className="py-5 px-4 text-sm text-zinc-400 whitespace-nowrap">{record.english.toFixed(1)}</td>
                  <td className="py-5 px-4 text-sm text-zinc-400 min-w-[320px]">{record.teacherFeedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
