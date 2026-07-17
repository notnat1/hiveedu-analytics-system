"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import InterventionModal from "@/components/InterventionModal";
import InterventionBadge from "@/components/InterventionBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TutorAnalyticsApiRow {
  tutorId?: string;
  tutorName?: string;
  tutorUsername?: string;
  assignedUserCount?: number;
  predictedUserCount?: number;
  averagePredictedScore?: number;
  atRiskUserCount?: number;
  averageAttendance?: number;
  averageTryoutScore?: number;
  feedbackCompletionRate?: number;
  assignedUsers?: UserPredictionRow[];
  userPredictions?: UserPredictionRow[];
}

interface UserPredictionRow {
  userId: string;
  fullName: string;
  username: string;
  tutorId: string | null;
  tutorName: string;
  attendancePercentage: number;
  averageTryoutScore: number;
  tryoutCount?: number;
  predictedScore: number | null;
  actualExamScore?: number | null;
  riskLevel: "HIGH" | "MEDIUM" | "SAFE" | "PENDING";
  suggestedIntervention: string;
  feedbackCompleted: boolean;
  hasFeedback: boolean;
}

interface TutorAnalyticsRow {
  tutorId: string;
  tutorName: string;
  tutorUsername: string;
  assignedUserCount: number;
  averagePredictedScore: number;
  atRiskUserCount: number;
  averageAttendance: number;
  averageTryoutScore: number;
  feedbackCompletionRate: number;
}

interface ToastState {
  show: boolean;
  message: string;
  tone: "success" | "error";
}

export default function TutorsPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [interventionUser, setInterventionUser] = useState<{ id: string; name: string; riskLevel: string; predictedScore: number | null } | null>(null);
  const [tutorAnalytics, setTutorAnalytics] = useState<TutorAnalyticsRow[]>([]);
  const [priorityUsers, setPriorityUsers] = useState<UserPredictionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
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

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getRiskLevel = (
    predictedScore: number | null,
  ): UserPredictionRow["riskLevel"] => {
    if (predictedScore === null) {
      return "PENDING";
    }

    if (predictedScore < 60) {
      return "HIGH";
    }

    if (predictedScore < 75) {
      return "MEDIUM";
    }

    return "SAFE";
  };

  const getSuggestedIntervention = (
    attendancePercentage: number,
    averageTryoutScore: number,
  ) => {
    if (attendancePercentage < 75 && averageTryoutScore >= 75) {
      return "Improve attendance consistency.";
    }

    if (attendancePercentage >= 75 && averageTryoutScore < 75) {
      return "Strengthen tryout practice.";
    }

    if (attendancePercentage < 75 && averageTryoutScore < 75) {
      return "Assign early intervention.";
    }

    return "Maintain current progress.";
  };

  useEffect(() => {
    const fetchTutorAnalytics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setPageError("Authentication token not found.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setPageError("");

        const tutorsResponse = await fetch("http://localhost:3000/analytics/tutors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!tutorsResponse.ok) {
          throw new Error("Failed to fetch tutor analytics.");
        }

        const tutorApiRows =
          (await tutorsResponse.json()) as TutorAnalyticsApiRow[];
        const normalizedTutorRows: TutorAnalyticsRow[] = tutorApiRows.map((tutor) => {
          const assignedUserRows = (tutor.userPredictions ?? tutor.assignedUsers ?? []).map(
            (user) => {
              const attendancePercentage = Number(user.attendancePercentage ?? 0);
              const averageTryoutScore = Number(user.averageTryoutScore ?? 0);
              const predictedScore =
                typeof user.predictedScore === "number"
                  ? user.predictedScore
                  : null;

              return {
                ...user,
                tutorId: tutor.tutorId ?? user.tutorId ?? null,
                tutorName:
                  tutor.tutorName || tutor.tutorUsername || user.tutorName || "N/A",
                fullName: user.fullName || user.username || "N/A",
                username: user.username || "N/A",
                attendancePercentage,
                averageTryoutScore,
                predictedScore,
                riskLevel:
                  user.riskLevel || getRiskLevel(predictedScore),
                suggestedIntervention:
                  user.suggestedIntervention ||
                  getSuggestedIntervention(attendancePercentage, averageTryoutScore),
                feedbackCompleted: Boolean(
                  user.feedbackCompleted ?? user.hasFeedback,
                ),
                hasFeedback: Boolean(
                  user.hasFeedback ?? user.feedbackCompleted,
                ),
              };
            },
          );
          const predictedRows = assignedUserRows.filter(
            (user) => user.predictedScore !== null,
          );
          const atRiskRows = assignedUserRows.filter((user) => {
            const riskLevel = user.riskLevel || getRiskLevel(user.predictedScore);
            return riskLevel === "HIGH" || riskLevel === "MEDIUM";
          });

          return {
            tutorId: tutor.tutorId ?? "",
            tutorName: tutor.tutorName || tutor.tutorUsername || "N/A",
            tutorUsername: tutor.tutorUsername || "N/A",
            assignedUserCount:
              typeof tutor.assignedUserCount === "number"
                ? tutor.assignedUserCount
                : assignedUserRows.length,
            averagePredictedScore:
              typeof tutor.averagePredictedScore === "number"
                ? tutor.averagePredictedScore
                : predictedRows.length > 0
                  ? predictedRows.reduce(
                      (sum, user) => sum + (user.predictedScore ?? 0),
                      0,
                    ) / predictedRows.length
                  : 0,
            atRiskUserCount:
              typeof tutor.atRiskUserCount === "number"
                ? tutor.atRiskUserCount
                : atRiskRows.length,
            averageAttendance:
              typeof tutor.averageAttendance === "number"
                ? tutor.averageAttendance
                : assignedUserRows.length > 0
                  ? assignedUserRows.reduce(
                      (sum, user) => sum + user.attendancePercentage,
                      0,
                    ) / assignedUserRows.length
                  : 0,
            averageTryoutScore:
              typeof tutor.averageTryoutScore === "number"
                ? tutor.averageTryoutScore
                : assignedUserRows.length > 0
                  ? assignedUserRows.reduce(
                      (sum, user) => sum + user.averageTryoutScore,
                      0,
                    ) / assignedUserRows.length
                  : 0,
            feedbackCompletionRate:
              typeof tutor.feedbackCompletionRate === "number"
                ? tutor.feedbackCompletionRate
                : assignedUserRows.length > 0
                  ? (assignedUserRows.filter((user) => user.feedbackCompleted).length /
                      assignedUserRows.length) *
                    100
                  : 0,
          };
        });

        const priorityUserRows = tutorApiRows.flatMap((tutor) =>
          (tutor.userPredictions ?? tutor.assignedUsers ?? [])
            .map((user) => {
              const attendancePercentage = Number(user.attendancePercentage ?? 0);
              const averageTryoutScore = Number(user.averageTryoutScore ?? 0);
              const predictedScore =
                typeof user.predictedScore === "number"
                  ? user.predictedScore
                  : null;
              const riskLevel = user.riskLevel || getRiskLevel(predictedScore);

              return {
                ...user,
                tutorId: tutor.tutorId ?? user.tutorId ?? null,
                tutorName:
                  tutor.tutorName || tutor.tutorUsername || user.tutorName || "N/A",
                fullName: user.fullName || user.username || "N/A",
                username: user.username || "N/A",
                attendancePercentage,
                averageTryoutScore,
                predictedScore,
                riskLevel,
                suggestedIntervention:
                  user.suggestedIntervention ||
                  getSuggestedIntervention(attendancePercentage, averageTryoutScore),
                feedbackCompleted: Boolean(
                  user.feedbackCompleted ?? user.hasFeedback,
                ),
                hasFeedback: Boolean(
                  user.hasFeedback ?? user.feedbackCompleted,
                ),
              };
            })
            .filter((user) => user.riskLevel === "HIGH" || user.riskLevel === "MEDIUM"),
        );

        setTutorAnalytics(normalizedTutorRows);
        setPriorityUsers(priorityUserRows);
      } catch (error) {
        console.error("Error fetching tutor analytics:", error);
        setTutorAnalytics([]);
        setPriorityUsers([]);
        setPageError("Unable to load tutor analytics right now.");
        showToast("Unable to load tutor analytics right now.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTutorAnalytics();
  }, []);

  const chartData = useMemo(
    () =>
      tutorAnalytics.map((tutor) => ({
        name: tutor.tutorName || tutor.tutorUsername || "N/A",
        score: Number((tutor.averagePredictedScore || 0).toFixed(1)),
      })),
    [tutorAnalytics],
  );

  const summaryMetrics = useMemo(() => {
    const totalTutorAccounts = tutorAnalytics.length;
    const totalAssignedUsers = tutorAnalytics.reduce(
      (sum, tutor) => sum + (tutor.assignedUserCount || 0),
      0,
    );
    const tutorsWithScores = tutorAnalytics.filter(
      (tutor) => Number.isFinite(tutor.averagePredictedScore),
    );
    const averagePredictedScore =
      tutorsWithScores.length > 0
        ? tutorsWithScores.reduce(
            (sum, tutor) => sum + (tutor.averagePredictedScore || 0),
            0,
          ) / tutorsWithScores.length
        : 0;
    const totalAtRiskUsers = tutorAnalytics.reduce(
      (sum, tutor) => sum + (tutor.atRiskUserCount || 0),
      0,
    );

    return {
      totalTutorAccounts,
      totalAssignedUsers,
      averagePredictedScore,
      totalAtRiskUsers,
    };
  }, [tutorAnalytics]);

  const hasTutorAnalytics = tutorAnalytics.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Tutor Performance Analytics
        </h1>
        <p className="text-sm text-zinc-500">
          Monitor TEACHER performance through the aggregate predicted outcomes of
          assigned users and identify where intervention is needed first.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Total Teacher Accounts
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">
                {summaryMetrics.totalTutorAccounts}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#09090b] p-3">
              <Users className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Total Assigned Users
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">
                {summaryMetrics.totalAssignedUsers}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#09090b] p-3">
              <Target className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Average Predicted Score
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">
                {summaryMetrics.averagePredictedScore.toFixed(1)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#09090b] p-3">
              <TrendingUp className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Total At-Risk Users
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">
                {summaryMetrics.totalAtRiskUsers}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#09090b] p-3">
              <AlertTriangle className="h-5 w-5 text-red-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl md:p-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">
            Average Class Score by Tutor
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Aggregated predicted MLR score
          </p>
        </div>

        {hasTutorAnalytics ? (
          <div className="h-[380px] w-full min-w-0 min-h-[380px]">
            {hasMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    dy={14}
                    height={70}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(9, 9, 11, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "16px",
                      backdropFilter: "blur(24px)",
                      padding: "16px 20px",
                    }}
                    itemStyle={{
                      color: "#f4f4f5",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                    labelStyle={{
                      color: "#71717a",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "10px",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[14, 14, 0, 0]}
                    fill="url(#tutorPerformanceGradient)"
                  />
                  <defs>
                    <linearGradient
                      id="tutorPerformanceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.95} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] border border-white/5 bg-[#09090b] text-sm text-zinc-500">
                Preparing chart surface...
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] px-6 py-10 text-center">
            <p className="text-sm font-medium text-zinc-200">
              No tutor analytics available yet.
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              The chart will appear once tutor assignments and eligible user
              predictions are available.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl md:p-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">
            Tutor Performance Table
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Live tutor portfolio overview
          </p>
        </div>

        {hasTutorAnalytics ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b border-white/5 px-4 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    Teacher Name
                  </th>
                  <th className="whitespace-nowrap border-b border-white/5 px-4 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    Assigned Users
                  </th>
                  <th className="whitespace-nowrap border-b border-white/5 px-4 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    Average Predicted Score
                  </th>
                  <th className="whitespace-nowrap border-b border-white/5 px-4 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    At-Risk Users
                  </th>
                  <th className="whitespace-nowrap border-b border-white/5 px-4 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    Average Attendance
                  </th>
                  <th className="whitespace-nowrap border-b border-white/5 px-4 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    Average Tryout Score
                  </th>
                  <th className="whitespace-nowrap border-b border-white/5 px-4 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    Feedback Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tutorAnalytics.map((tutor) => (
                  <tr
                    key={tutor.tutorId || tutor.tutorName}
                    className="transition-colors duration-200 hover:bg-white/[0.01]"
                  >
                    <td className="whitespace-nowrap px-4 py-5 text-sm font-medium text-zinc-200">
                      {tutor.tutorName || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm text-zinc-400">
                      {tutor.assignedUserCount || 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm font-semibold text-blue-400">
                      {(tutor.averagePredictedScore || 0).toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm text-zinc-400">
                      {tutor.atRiskUserCount || 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm text-zinc-400">
                      {(tutor.averageAttendance || 0).toFixed(1)}%
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm text-zinc-400">
                      {(tutor.averageTryoutScore || 0).toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm text-zinc-400">
                      {(tutor.feedbackCompletionRate || 0).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] px-6 py-10 text-center">
            <p className="text-sm font-medium text-zinc-200">
              No tutor analytics available yet.
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Tutor performance rows will populate once tutor assignments and user
              prediction data are available.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-3xl md:p-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-lg font-semibold text-zinc-100">
            Priority Users for Intervention
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Predicted below the safe threshold
          </p>
        </div>

        {priorityUsers.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {priorityUsers.map((user) => (
              <div
                key={user.userId}
                className="rounded-[1.5rem] border border-red-500/10 bg-[#09090b] px-6 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-zinc-100">
                      {user.fullName}
                    </p>
                    <p className="text-sm text-zinc-500">
                      Tutor: {user.tutorName || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                      user.riskLevel === "HIGH"
                        ? "border border-red-500/20 bg-red-500/10 text-red-400"
                        : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {user.riskLevel}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <InterventionBadge userId={user.userId} />
                  <button
                    onClick={() => setInterventionUser({ id: user.userId, name: user.fullName || user.username, riskLevel: user.riskLevel, predictedScore: user.predictedScore })}
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 transition-colors hover:bg-white/10"
                  >
                    Follow-up
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Attendance
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-100">
                      {user.attendancePercentage.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Tryout
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-100">
                      {user.averageTryoutScore.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Predicted
                    </p>
                    <p className="mt-2 text-sm font-semibold text-red-400">
                      {user.predictedScore?.toFixed(1) ?? "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Suggested Intervention
                  </p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">
                    {user.suggestedIntervention}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] px-6 py-10 text-center">
            <p className="text-sm font-medium text-zinc-200">
              No priority users for intervention right now.
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Once users fall below the safe threshold, they will appear here with
              targeted next-step recommendations.
            </p>
          </div>
        )}
      </section>

      {pageError && (
        <div className="inline-flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} />
          <span>{pageError}</span>
        </div>
      )}

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

      {interventionUser && (
        <InterventionModal
          isOpen={true}
          onClose={() => setInterventionUser(null)}
          userId={interventionUser.id}
          userName={interventionUser.name}
          riskLevel={interventionUser.riskLevel}
          predictedScore={interventionUser.predictedScore}
          onSuccess={() => {
            showToast("Follow-up saved successfully");
          }}
        />
      )}
    </div>
  );
}
