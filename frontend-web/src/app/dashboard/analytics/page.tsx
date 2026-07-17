"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";

type CoefficientMode = "AUTO_TRAINED" | "MANUAL_OVERRIDE";

interface AnalyticsConfigResponse {
  intercept?: number;
  attendanceCoefficient?: number;
  tryoutCoefficient?: number;
  teacherObjectiveCoefficient?: number;
  coefficientMode?: CoefficientMode;
  x1Weight?: number;
  x2Weight?: number;
  x3Weight?: number;
}

interface RunHistoryItem {
  id: string;
  generatedAt: string;
  coefficientMode: CoefficientMode;
  intercept: number;
  attendanceCoefficient: number;
  tryoutCoefficient: number;
  teacherObjectiveCoefficient?: number;
  mse: number | null;
  totalUserCount: number;
  activeUserCount: number;
  eligibleUserCount: number;
  excludedUserCount: number;
  trainingSampleCount: number;
  predictionCount: number;
  fallbackUsed: boolean;
  fallbackReason: string | null;
}

interface ToastState {
  show: boolean;
  message: string;
  tone: "success" | "error";
}

export default function AnalyticsEnginePage() {
  const [intercept, setIntercept] = useState(0);
  const [attendanceCoefficient, setAttendanceCoefficient] = useState(0.4);
  const [tryoutCoefficient, setTryoutCoefficient] = useState(0.5);
  const [teacherObjectiveCoefficient, setTeacherObjectiveCoefficient] =
    useState(0.1);
  const [coefficientMode, setCoefficientMode] =
    useState<CoefficientMode>("AUTO_TRAINED");
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isExportingWorkbook, setIsExportingWorkbook] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState("");
  const [latestRunHistory, setLatestRunHistory] = useState<RunHistoryItem | null>(
    null,
  );
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    tone: "success",
  });

  const showToast = (message: string, tone: ToastState["tone"] = "success") => {
    setToast({ show: true, message, tone });
    setTimeout(() => {
      setToast({ show: false, message: "", tone: "success" });
    }, 3000);
  };

  const fetchAnalyticsConfig = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setConfigError("Authentication token not found.");
      setIsLoadingConfig(false);
      return;
    }

    try {
      setIsLoadingConfig(true);
      setConfigError("");

      const [configResponse, runHistoryResponse] = await Promise.all([
        fetch("http://localhost:3000/analytics/config", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:3000/analytics/mlr-run-history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!configResponse.ok) {
        throw new Error("Failed to fetch analytics configuration.");
      }

      const configData = (await configResponse.json()) as AnalyticsConfigResponse;

      setIntercept(Number(configData.intercept ?? 0));
      setAttendanceCoefficient(
        Number(
          configData.attendanceCoefficient ??
            (typeof configData.x1Weight === "number"
              ? configData.x1Weight / 100
              : 0.4),
        ),
      );
      setTryoutCoefficient(
        Number(
          configData.tryoutCoefficient ??
            (typeof configData.x2Weight === "number"
              ? configData.x2Weight / 100
              : 0.5),
        ),
      );
      setTeacherObjectiveCoefficient(
        Number(
          configData.teacherObjectiveCoefficient ??
            (typeof configData.x3Weight === "number"
              ? configData.x3Weight / 100
              : 0.1),
        ),
      );
      setCoefficientMode(configData.coefficientMode ?? "AUTO_TRAINED");

      if (runHistoryResponse.ok) {
        const runHistoryData = (await runHistoryResponse.json()) as RunHistoryItem[];
        setLatestRunHistory(runHistoryData[0] ?? null);
      } else {
        setLatestRunHistory(null);
      }
    } catch (error) {
      console.error("Error fetching analytics configuration:", error);
      setConfigError("Unable to load analytics configuration right now.");
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    void fetchAnalyticsConfig();
  }, []);

  const handleSaveConfig = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Authentication token not found.", "error");
      return;
    }

    try {
      setIsSavingConfig(true);

      const response = await fetch("http://localhost:3000/analytics/config", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intercept,
          attendanceCoefficient,
          tryoutCoefficient,
          teacherObjectiveCoefficient,
          coefficientMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update analytics configuration.");
      }

      await fetchAnalyticsConfig();
      showToast("Analytics configuration updated successfully.");
    } catch (error) {
      console.error("Error updating analytics configuration:", error);
      showToast("Unable to update analytics configuration.", "error");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleExportWorkbook = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Authentication token not found.", "error");
      return;
    }

    try {
      setIsExportingWorkbook(true);

      const response = await fetch("http://localhost:3000/analytics/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export analytics report.");
      }

      const workbookBlob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(workbookBlob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "hiveedu-analytics-report.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      await fetchAnalyticsConfig();
      showToast("Analytics report exported successfully.");
    } catch (error) {
      console.error("Error exporting analytics report:", error);
      showToast("Unable to export analytics report right now.", "error");
    } finally {
      setIsExportingWorkbook(false);
    }
  };

  const isManualOverride = coefficientMode === "MANUAL_OVERRIDE";

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Analytics Engine
        </h1>
        <p className="text-sm text-zinc-500">
          Monitor the HiveEdu regression engine, review live coefficients, and
          export a complete analytics workbook from one control surface.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl md:p-8">
          <div className="mb-8 space-y-2">
            <h2 className="text-lg font-semibold text-zinc-100">
              Dynamic MLR Configuration
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Final hiveedu regression contract
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5 md:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Formula
              </p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-100">
                Y = a + b1X1 + b2X2 + b3X3
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                X1 represents attendance percentage, X2 represents average tryout
                score, X3 represents teacher objective score from Academic Records,
                and Y represents the predicted next exam score.
              </p>
              <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">
                  How Contribution Is Calculated
                </p>
                <div className="space-y-2 text-sm leading-6 text-zinc-400">
                  <p><span className="text-zinc-200 font-medium">Intercept (a)</span> — baseline constant added to every prediction.</p>
                  <p><span className="text-sky-400 font-medium">b1 × X1</span> — attendance contribution = attendance coefficient × attendance %.</p>
                  <p><span className="text-violet-400 font-medium">b2 × X2</span> — tryout contribution = tryout coefficient × average tryout score.</p>
                  <p><span className="text-amber-400 font-medium">b3 × X3</span> — teacher objective contribution = teacher objective coefficient × teacher objective score.</p>
                  <p className="text-zinc-500 pt-1">Final score is clamped between 0 and 100.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5 md:col-span-2">
              <label
                htmlFor="coefficient-mode"
                className="text-[10px] uppercase tracking-[0.2em] text-zinc-500"
              >
                Coefficient Mode
              </label>
              <select
                id="coefficient-mode"
                value={coefficientMode}
                onChange={(event) =>
                  setCoefficientMode(event.target.value as CoefficientMode)
                }
                className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-100 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="AUTO_TRAINED">AUTO_TRAINED</option>
                <option value="MANUAL_OVERRIDE">MANUAL_OVERRIDE</option>
              </select>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {isManualOverride
                  ? "Manual override is active. Intercept and coefficients can be adjusted directly."
                  : "Auto-trained mode is active. The system determines the effective coefficients from the current training dataset."}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
              <label
                htmlFor="intercept"
                className="text-[10px] uppercase tracking-[0.2em] text-zinc-500"
              >
                Intercept
              </label>
              <input
                id="intercept"
                type="number"
                step="0.01"
                value={intercept}
                onChange={(event) => setIntercept(Number(event.target.value))}
                disabled={!isManualOverride}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-zinc-100 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
              <label
                htmlFor="attendance-coefficient"
                className="text-[10px] uppercase tracking-[0.2em] text-zinc-500"
              >
                Attendance Coefficient
              </label>
              <input
                id="attendance-coefficient"
                type="number"
                step="0.01"
                value={attendanceCoefficient}
                onChange={(event) =>
                  setAttendanceCoefficient(Number(event.target.value))
                }
                disabled={!isManualOverride}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-zinc-100 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
              <label
                htmlFor="tryout-coefficient"
                className="text-[10px] uppercase tracking-[0.2em] text-zinc-500"
              >
                Tryout Coefficient
              </label>
              <input
                id="tryout-coefficient"
                type="number"
                step="0.01"
                value={tryoutCoefficient}
                onChange={(event) =>
                  setTryoutCoefficient(Number(event.target.value))
                }
                disabled={!isManualOverride}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-zinc-100 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
              <label
                htmlFor="teacher-objective-coefficient"
                className="text-[10px] uppercase tracking-[0.2em] text-zinc-500"
              >
                Teacher Objective Coefficient (b3)
              </label>
              <input
                id="teacher-objective-coefficient"
                type="number"
                step="0.01"
                value={teacherObjectiveCoefficient}
                onChange={(event) =>
                  setTeacherObjectiveCoefficient(Number(event.target.value))
                }
                disabled={!isManualOverride}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-zinc-100 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <p className="mt-2 text-sm text-zinc-500">
                X3 is sourced from Teacher Objective Score in Academic Records.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Mean Squared Error
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">
                {latestRunHistory?.mse !== null &&
                typeof latestRunHistory?.mse !== "undefined"
                  ? latestRunHistory.mse.toFixed(2)
                  : "N/A"}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Latest validation result from the most recent analytics run.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Dataset Quality
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-300">
                <div>
                  <p className="text-zinc-500">Eligible</p>
                  <p className="mt-1 font-semibold text-zinc-100">
                    {latestRunHistory?.eligibleUserCount ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Excluded</p>
                  <p className="mt-1 font-semibold text-zinc-100">
                    {latestRunHistory?.excludedUserCount ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Training Samples</p>
                  <p className="mt-1 font-semibold text-zinc-100">
                    {latestRunHistory?.trainingSampleCount ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Predictions</p>
                  <p className="mt-1 font-semibold text-zinc-100">
                    {latestRunHistory?.predictionCount ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {configError && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={16} />
              <span>{configError}</span>
            </div>
          )}

          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={isSavingConfig || isLoadingConfig}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingConfig ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl md:p-8">
          <div>
            <div className="mb-8 space-y-2">
              <h2 className="text-lg font-semibold text-zinc-100">
                Analytics Report Export
              </h2>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Backend-generated enterprise workbook
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-6">
              <p className="text-sm leading-7 text-zinc-300">
                Generate the final HiveEdu analytics workbook with prediction
                results, early warning coverage, coefficient details, dataset
                quality, attendance aggregates, tryout aggregates, and MLR run
                history.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Format
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-100">
                    XLSX
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Scope
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-100">
                    Analytics Report
                  </p>
                </div>
              </div>
              {latestRunHistory && (
                <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4 text-sm text-zinc-400">
                  <p>
                    Latest run:
                    <span className="ml-2 text-zinc-200">
                      {new Date(latestRunHistory.generatedAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="mt-2">
                    Fallback:
                    <span className="ml-2 text-zinc-200">
                      {latestRunHistory.fallbackUsed
                        ? latestRunHistory.fallbackReason || "Used stored coefficients"
                        : "No fallback used"}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={handleExportWorkbook}
              disabled={isExportingWorkbook}
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet size={18} />
              {isExportingWorkbook
                ? "Exporting Report..."
                : "Export Analytics Report"}
            </button>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#09090b] px-5 py-4 shadow-2xl backdrop-blur-3xl animate-in slide-in-from-bottom-6 fade-in duration-300">
          {toast.tone === "success" ? (
            <CheckCircle2 className="text-emerald-500" size={20} />
          ) : (
            <AlertCircle className="text-red-400" size={20} />
          )}
          <span className="text-sm font-medium text-zinc-200">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
