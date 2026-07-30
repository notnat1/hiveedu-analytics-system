"use client";

import { useState, useEffect } from "react";
import { Calculator, ChevronRight, Info, AlertTriangle } from "lucide-react";

interface WhatIfSimulatorProps {
  initialX1: number;
  initialX2: number;
  initialX3: number;
  tryoutCount: number;
  token: string;
}

export default function WhatIfSimulator({
  initialX1,
  initialX2,
  initialX3,
  tryoutCount,
  token,
}: WhatIfSimulatorProps) {
  const [x1, setX1] = useState(initialX1);
  const [x2, setX2] = useState(initialX2);
  const [x3, setX3] = useState(initialX3);
  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/analytics/predict-performance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attendancePercentage: x1,
            avgTryoutScore: x2,
            teacherObjectiveScore: x3,
            tryoutCount: tryoutCount,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setPredictedScore(data.predictedPerformance);
        }
      } catch (error) {
        console.error("Error predicting score:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPrediction();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [x1, x2, x3, tryoutCount, token]);

  const calculateDelta = (current: number, initial: number) => {
    const delta = current - initial;
    if (delta === 0) return null;
    return (
      <span className={`text-[10px] font-bold ${delta > 0 ? "text-emerald-400" : "text-red-400"}`}>
        {delta > 0 ? "+" : ""}
        {delta.toFixed(1)}
      </span>
    );
  };

  const getRiskColor = (score: number | null) => {
    if (score === null) return "text-zinc-400";
    if (score < 60) return "text-red-400";
    if (score < 75) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div className="md:col-span-2 xl:col-span-4 bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden mt-8">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Calculator className="w-32 h-32 text-indigo-500 blur-xl" />
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <div className="space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 mb-2">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                Interactive Planner
              </span>
            </div>
            <h3 className="text-2xl font-medium text-zinc-100 tracking-tight">
              "What-If" Target Simulator
            </h3>
            <p className="text-sm text-zinc-500 leading-7">
              Adjust the sliders to see how improving your attendance, tryout scores, or teacher objective impacts your predicted final exam score in real-time.
            </p>
          </div>

          <div className="space-y-8">
            {/* Slider X1 */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  X1: Attendance (%)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-zinc-100">{x1.toFixed(1)}%</span>
                  {calculateDelta(x1, initialX1)}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={x1}
                onChange={(e) => setX1(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Slider X2 */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  X2: Average Tryout
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-zinc-100">{x2.toFixed(1)}</span>
                  {calculateDelta(x2, initialX2)}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={x2}
                onChange={(e) => setX2(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Slider X3 */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  X3: Teacher Objective
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-zinc-100">{x3.toFixed(1)}</span>
                  {calculateDelta(x3, initialX3)}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={x3}
                onChange={(e) => setX3(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            
            <div className="flex items-start gap-3 rounded-2xl bg-[#09090b] border border-white/5 p-4 mt-8">
               <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
               <p className="text-xs text-zinc-400 leading-relaxed">
                 <strong className="text-zinc-200">Pro-tip:</strong> Focus on increasing your X2 (Tryout) score as it usually has a strong coefficient multiplier in the MLR formula.
               </p>
            </div>
          </div>
        </div>

        <div className="xl:w-[350px] flex flex-col justify-center">
          <div className="rounded-[2rem] bg-[#09090b] border border-white/10 p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">
                Simulated Target Score
              </p>
              
              <div className="h-24 flex items-center justify-center">
                {isLoading ? (
                  <div className="animate-pulse flex gap-1">
                     <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                     <div className="w-2 h-2 rounded-full bg-indigo-500 animation-delay-200"></div>
                     <div className="w-2 h-2 rounded-full bg-indigo-500 animation-delay-400"></div>
                  </div>
                ) : (
                  <h1 className={`text-6xl font-bold tracking-tighter ${getRiskColor(predictedScore)} transition-colors duration-500`}>
                    {predictedScore !== null ? predictedScore.toFixed(1) : "--"}
                  </h1>
                )}
              </div>
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => {
                    setX1(initialX1);
                    setX2(initialX2);
                    setX3(initialX3);
                  }}
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 bg-white/5 px-4 py-2 rounded-full hover:bg-white/10"
                >
                  Reset to Current Metrics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
