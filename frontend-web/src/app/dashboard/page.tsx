"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Target,
  Activity,
  Download,
  Loader2,

  AlertTriangle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import ReportDocument from "@/components/ReportDocument";
import InterventionModal from "@/components/InterventionModal";
import InterventionBadge from "@/components/InterventionBadge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  username: string;
  role: string;
}

interface PredictionExplanation {
  interceptContribution: number;
  attendanceContribution: number;
  tryoutContribution: number;
  teacherObjectiveContribution: number;
  rawPredictedScore: number;
  predictedScore: number;
}

interface DashboardRow {
  id: string;
  name: string;
  fullName: string;
  username: string;
  assignedTutorId: string | null;
  tutorName: string | null;
  attendancePercentage: number;
  averageTryoutScore: number;
  teacherObjectiveScore: number | null;
  predictedScore: number | null;
  actualScore: number | null;
  tryoutCount: number;
  riskLevel: "HIGH" | "MEDIUM" | "SAFE" | "PENDING";
  suggestedIntervention: string;
}

interface UserFeatureSnapshot {
  userId?: string;
  attendancePercentage?: number;
  avgTryoutScore?: number;
  averageTryoutScore?: number;
  teacherObjectiveScore?: number;
  x3?: number;
  x1: number;
  x2: number;
  tryoutCount: number;
  mathematicsScore: number;
  logicalReasoningScore: number;
  englishScore: number;
  latestRecordDate?: string | null;
}

interface UserAnalyticsSnapshot extends UserFeatureSnapshot {
  predictedScore: number | null;
  riskLevel?: DashboardRow["riskLevel"];
  suggestedIntervention?: string;
  recommendation?: string;
  formula?: string;
  coefficientMode?: RunHistoryItem["coefficientMode"];
  explanation?: PredictionExplanation | null;
}

interface UserSelfAnalyticsResponse {
  userId: string;
  attendancePercentage: number;
  averageTryoutScore: number;
  avgTryoutScore: number;
  teacherObjectiveScore?: number;
  x3?: number;
  tryoutCount: number;
  predictedScore: number | null;
  riskLevel?: DashboardRow["riskLevel"];
  suggestedIntervention?: string;
  recommendation?: string;
  formula?: string;
  coefficientMode?: RunHistoryItem["coefficientMode"];
  explanation?: PredictionExplanation | null;
}

interface GlobalAnalyticsSnapshot {
  averageX1: number;
  averageX2: number;
  averageX3?: number;
  averagePredictedScore: number;
  activeUserCount: number;
  predictedUserCount: number;
}

interface RunHistoryItem {
  id: string;
  generatedAt: string;
  generatedById: string | null;
  coefficientMode: "AUTO_TRAINED" | "MANUAL_OVERRIDE";
  intercept: number;
  attendanceCoefficient: number;
  tryoutCoefficient: number;
  teacherObjectiveCoefficient?: number;
  mse: number | null;
  totalUserCount: number;
  activeUserCount: number;
  eligibleUserCount: number;
  excludedUserCount: number;
  excludedInactiveCount: number;
  excludedInsufficientTryoutCount: number;
  excludedNullScoreCount: number;
  trainingSampleCount: number;
  predictionCount: number;
  fallbackUsed: boolean;
  fallbackReason: string | null;
  notes: string | null;
}

interface UserAccountResponse {
  userId: string;
  username: string;
  fullName?: string;
  role?: string;
  assignedTutorId?: string | null;
}

interface UserRecordResponse {
  id?: string;
  mathScore?: number | null;
  logicScore?: number | null;
  englishScore?: number | null;
  mathematicsScore?: number | null;
  logicalReasoningScore?: number | null;
  averageScore?: number | null;
  teacherObjectiveScore?: number | null;
  examDate?: string | null;
  examLabel?: string | null;
  createdAt?: string;
  actualExamScore?: number | null;
  teacherFeedback?: string | null;
}

interface UserPredictionRow {
  userId: string;
  fullName: string;
  username: string;
  attendancePercentage: number;
  averageTryoutScore: number;
  teacherObjectiveScore?: number | null;
  predictedScore: number | null;
  riskLevel: "HIGH" | "MEDIUM" | "SAFE" | "PENDING";
  suggestedIntervention: string;
  explanation?: PredictionExplanation | null;
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
  averageTeacherObjectiveScore?: number | null;
  feedbackCompletionRate: number;
  userPredictions?: UserPredictionRow[];
  assignedUsers?: UserPredictionRow[];
}

interface AttendanceRecordResponse {
  id: string;
  userId: string;
  date: string;
  status: "PRESENT" | "LATE" | "ABSENT";
}

interface ToastState {
  show: boolean;
  message: string;
  tone: "success" | "error";
}


export default function DashboardPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tutorRow, setTutorRow] = useState<TutorAnalyticsRow | null>(null);
  const [interventionUser, setInterventionUser] = useState<{ id: string; name: string; riskLevel: string; predictedScore: number | null } | null>(null);
  const [tableData, setTableData] = useState<DashboardRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isExportingAnalyticsReport, setIsExportingAnalyticsReport] = useState(false);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsSnapshot | null>(null);
  const [userRecords, setUserRecords] = useState<UserRecordResponse[]>([]);
  const [userAttendanceRecords, setUserAttendanceRecords] = useState<AttendanceRecordResponse[]>([]);
  const [globalAnalytics, setGlobalAnalytics] = useState<GlobalAnalyticsSnapshot | null>(null);
  const [latestRunHistory, setLatestRunHistory] = useState<RunHistoryItem | null>(null);
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

  function getSafeNumber(value: number | string | null | undefined): number | null {
    if (value === null || typeof value === "undefined" || value === "") {
      return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  function formatScore(value: number | string | null | undefined): string | undefined {
    const numericValue = getSafeNumber(value);
    return numericValue === null ? undefined : numericValue.toFixed(1);
  }

  function getLatestUserRecord(): UserRecordResponse | null {
    return userRecords[0] ?? null;
  }

  function getUserAttendanceSummary() {
    return userAttendanceRecords.reduce(
      (summary, record) => {
        if (record.status === "PRESENT") {
          summary.presentCount += 1;
        } else if (record.status === "LATE") {
          summary.lateCount += 1;
        } else if (record.status === "ABSENT") {
          summary.absentCount += 1;
        }

        return summary;
      },
      { presentCount: 0, lateCount: 0, absentCount: 0 },
    );
  }

  const handleDownloadPDF = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setIsGeneratingPDF(true);

      const latestRecord = getLatestUserRecord();
      const attendanceSummary = getUserAttendanceSummary();
      const teacherObjectiveScore =
        getSafeNumber(userAnalytics?.x3) ??
        getSafeNumber(userAnalytics?.teacherObjectiveScore) ??
        getSafeNumber(latestRecord?.teacherObjectiveScore);
      const record =
        currentUser.role === "USER"
          ? userAnalytics &&
            userAnalytics.predictedScore !== null &&
            getSafeNumber(userAnalytics.x1) !== null &&
            getSafeNumber(userAnalytics.x2) !== null &&
            teacherObjectiveScore !== null
            ? {
                x1: `${userAnalytics.x1.toFixed(1)}%`,
                x2: userAnalytics.x2.toFixed(1),
                x3: teacherObjectiveScore.toFixed(1),
                predicted: userAnalytics.predictedScore.toFixed(1),
                riskLevel:
                  userAnalytics.riskLevel ??
                  getRiskLevel(userAnalytics.predictedScore),
                recommendation:
                  userAnalytics.recommendation ??
                  userAnalytics.suggestedIntervention ??
                  getSuggestedIntervention(
                    userAnalytics.x1,
                    userAnalytics.x2,
                    getSafeNumber(userAnalytics.x3 ?? userAnalytics.teacherObjectiveScore),
                  ),
              }
            : null
          : null;

      if (!record) {
        return;
      }

      const reportData = {
        userName: currentUser.username,
        username: currentUser.username,
        period: latestRecord?.examLabel ?? latestRecord?.examDate ?? "Current reporting period",
        x1: record.x1,
        x2: record.x2,
        x3: record.x3,
        mathScore: formatScore(
          latestRecord?.mathScore ?? latestRecord?.mathematicsScore,
        ),
        logicScore: formatScore(
          latestRecord?.logicScore ?? latestRecord?.logicalReasoningScore,
        ),
        englishScore: formatScore(latestRecord?.englishScore),
        averageScore: formatScore(latestRecord?.averageScore ?? record.x2),
        actualExamScore: formatScore(latestRecord?.actualExamScore),
        teacherObjectiveScore: record.x3,
        teacherNote: latestRecord?.teacherFeedback ?? record.recommendation,
        examLabel: latestRecord?.examLabel,
        examDate: latestRecord?.examDate,
        presentCount: String(attendanceSummary.presentCount),
        lateCount: String(attendanceSummary.lateCount),
        absentCount: String(attendanceSummary.absentCount),
        predictedScore: record.predicted,
        riskLevel: record.riskLevel,
        recommendation: record.recommendation,
        coefficientMode: userAnalytics?.coefficientMode,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      };

      // Generate PDF blob in the background
      const blob = await pdf(<ReportDocument data={reportData} />).toBlob();

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `HiveEdu_Analytics_Report_${currentUser.username}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleExportWorkbook = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Authentication token not found.", "error");
      return;
    }

    try {
      setIsExportingAnalyticsReport(true);

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

      if (currentUser?.role !== "USER") {
        await fetchAdminDashboardData(token);
      }

      showToast("Analytics report exported successfully.");
    } catch (error) {
      console.error("Error exporting analytics report:", error);
      showToast("Unable to export analytics report right now.", "error");
    } finally {
      setIsExportingAnalyticsReport(false);
    }
  };

  const dynamicChartData = useMemo(() => {
    return tableData.map((row) => {
      return {
        name: row.name,
        actual: row.actualScore,
        predicted: row.predictedScore,
      };
    });
  }, [tableData]);

  const hasActualChartValues = useMemo(
    () => dynamicChartData.some((row) => row.actual !== null),
    [dynamicChartData],
  );

  const earlyWarningRows = useMemo(
    () => tableData.filter((row) => row.predictedScore !== null && row.predictedScore < 75),
    [tableData],
  );

  const latestCompetencyScores = useMemo(() => {
    if (!userAnalytics) {
      return [];
    }

    const latestRecord = userRecords.find((record) => {
      const mathScore = record.mathScore ?? record.mathematicsScore;
      const logicScore = record.logicScore ?? record.logicalReasoningScore;
      const englishScore = record.englishScore;

      return [mathScore, logicScore, englishScore].every(
        (score) => typeof score === "number" && Number.isFinite(score),
      );
    });

    const mathematicsScore =
      typeof latestRecord?.mathScore === "number"
        ? latestRecord.mathScore
        : typeof latestRecord?.mathematicsScore === "number"
          ? latestRecord.mathematicsScore
          : userAnalytics.mathematicsScore;
    const logicalReasoningScore =
      typeof latestRecord?.logicScore === "number"
        ? latestRecord.logicScore
        : typeof latestRecord?.logicalReasoningScore === "number"
          ? latestRecord.logicalReasoningScore
          : userAnalytics.logicalReasoningScore;
    const englishScore =
      typeof latestRecord?.englishScore === "number"
        ? latestRecord.englishScore
        : userAnalytics.englishScore;

    return [
      { subject: "Mathematics", score: mathematicsScore },
      { subject: "Logical Reasoning", score: logicalReasoningScore },
      { subject: "English Proficiency", score: englishScore },
    ];
  }, [userAnalytics, userRecords]);

  const tryoutTrendData = useMemo(() => {
    return [...userRecords]
      .reverse()
      .map((record, index) => {
        const mathScore = record.mathScore ?? record.mathematicsScore;
        const logicScore = record.logicScore ?? record.logicalReasoningScore;
        const englishScore = record.englishScore;
        const calculatedAverage =
          [mathScore, logicScore, englishScore].every(
            (score) => typeof score === "number" && Number.isFinite(score),
          )
            ? ((mathScore ?? 0) + (logicScore ?? 0) + (englishScore ?? 0)) / 3
            : null;
        const averageScore =
          typeof record.averageScore === "number" && Number.isFinite(record.averageScore)
            ? record.averageScore
            : calculatedAverage;
        const labelSource = record.examLabel || record.examDate || record.createdAt;
        const label = labelSource
          ? new Date(labelSource).toString() !== "Invalid Date"
            ? new Date(labelSource).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : labelSource
          : `Record ${index + 1}`;

        return {
          label,
          score: typeof averageScore === "number" && Number.isFinite(averageScore)
            ? Number(averageScore.toFixed(1))
            : null,
        };
      })
      .filter((record) => record.score !== null);
  }, [userRecords]);

  const comparisonChartData = useMemo(() => {
    if (!userAnalytics || !globalAnalytics || userAnalytics.predictedScore === null) {
      return [];
    }

    return [
      {
        metric: "X1 Attendance",
        you: Number(userAnalytics.x1.toFixed(1)),
        classAverage: Number(globalAnalytics.averageX1.toFixed(1)),
      },
      {
        metric: "X2 Tryout",
        you: Number(userAnalytics.x2.toFixed(1)),
        classAverage: Number(globalAnalytics.averageX2.toFixed(1)),
      },
      {
        metric: "Predicted Score",
        you: Number(userAnalytics.predictedScore.toFixed(1)),
        classAverage: Number(globalAnalytics.averagePredictedScore.toFixed(1)),
      },
    ];
  }, [globalAnalytics, userAnalytics]);

  const achievementBadges = useMemo(() => {
    if (!userAnalytics) {
      return [];
    }

    const badges: Array<{
      key: string;
      title: string;
      description: string;
      className: string;
      iconClassName: string;
    }> = [];

    if (userAnalytics.x1 === 100) {
      badges.push({
        key: "perfect-attendance",
        title: "Perfect Attendance",
        description: "You maintained flawless attendance across all recorded sessions.",
        className:
          "border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.16)]",
        iconClassName: "text-emerald-400",
      });
    }

    if (userAnalytics.x1 >= 90) {
      badges.push({
        key: "consistent-attendance",
        title: "Consistent Attendance",
        description: "Your attendance is operating inside a highly reliable range.",
        className:
          "border-sky-500/20 bg-sky-500/10 shadow-[0_0_30px_rgba(59,130,246,0.16)]",
        iconClassName: "text-sky-400",
      });
    }

    if (userAnalytics.x2 >= 85) {
      badges.push({
        key: "tryout-achiever",
        title: "Tryout Achiever",
        description: "Your average tryout performance is operating at an advanced level.",
        className:
          "border-amber-500/20 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.16)]",
        iconClassName: "text-amber-400",
      });
    }

    if (userAnalytics.predictedScore !== null && userAnalytics.predictedScore >= 75) {
      badges.push({
        key: "safe-zone",
        title: "Safe Zone",
        description: "Your predicted next exam score is currently inside the safe performance band.",
        className:
          "border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.16)]",
        iconClassName: "text-emerald-400",
      });
    }

    if (userAnalytics.predictedScore !== null && userAnalytics.predictedScore < 75) {
      badges.push({
        key: "early-improvement",
        title: "Early Improvement",
        description: "Your current analytics signal is highlighting an area to improve before the next exam.",
        className:
          "border-red-500/20 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.16)]",
        iconClassName: "text-red-400",
      });
    }

    return badges;
  }, [userAnalytics]);

  const recommendationMessage = useMemo(() => {
    if (!userAnalytics) {
      return "Maintain current progress.";
    }

    return (
      userAnalytics.recommendation ??
      userAnalytics.suggestedIntervention ??
      getSuggestedIntervention(
        userAnalytics.x1,
        userAnalytics.x2,
        getSafeNumber(userAnalytics.x3 ?? userAnalytics.teacherObjectiveScore),
      )
    );
  }, [userAnalytics]);

  const fetchUserAnalytics = async (userId: string, token: string) => {
    const [featureResponse, recordsResponse, selfAnalyticsResponse, attendanceResponse] = await Promise.all([
      fetch(`http://localhost:3000/users/${userId}/features`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`http://localhost:3000/records/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch("http://localhost:3000/analytics/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`http://localhost:3000/attendance/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (!featureResponse.ok) {
      throw new Error("Failed to fetch user features");
    }

    const featureData = (await featureResponse.json()) as UserFeatureSnapshot;
    const recordData = recordsResponse.ok
      ? ((await recordsResponse.json()) as UserRecordResponse[])
      : [];
    const attendanceData = attendanceResponse.ok
      ? ((await attendanceResponse.json()) as AttendanceRecordResponse[])
      : [];
    const selfAnalyticsData = selfAnalyticsResponse.ok
      ? ((await selfAnalyticsResponse.json()) as UserSelfAnalyticsResponse)
      : null;
    const attendancePercentage =
      selfAnalyticsData?.attendancePercentage ?? featureData.attendancePercentage ?? featureData.x1 ?? 0;
    const averageTryoutScore =
      selfAnalyticsData?.averageTryoutScore ??
      selfAnalyticsData?.avgTryoutScore ??
      featureData.averageTryoutScore ??
      featureData.avgTryoutScore ??
      featureData.x2 ??
      0;
    const teacherObjectiveScore =
      selfAnalyticsData?.teacherObjectiveScore ??
      selfAnalyticsData?.x3 ??
      featureData.teacherObjectiveScore ??
      featureData.x3 ??
      recordData.find((record) => getSafeNumber(record.teacherObjectiveScore) !== null)
        ?.teacherObjectiveScore ??
      0;
    setUserRecords(recordData);
    setUserAttendanceRecords(attendanceData);
    setUserAnalytics({
      ...featureData,
      x1: attendancePercentage,
      x2: averageTryoutScore,
      x3: teacherObjectiveScore,
      teacherObjectiveScore,
      attendancePercentage,
      averageTryoutScore,
      avgTryoutScore: averageTryoutScore,
      tryoutCount: selfAnalyticsData?.tryoutCount ?? featureData.tryoutCount ?? 0,
      predictedScore: selfAnalyticsData?.predictedScore ?? null,
      riskLevel: selfAnalyticsData?.riskLevel,
      suggestedIntervention: selfAnalyticsData?.suggestedIntervention,
      recommendation: selfAnalyticsData?.recommendation,
      formula: selfAnalyticsData?.formula,
      coefficientMode: selfAnalyticsData?.coefficientMode,
      explanation: selfAnalyticsData?.explanation ?? null,
    });
  };

  const getRiskLevel = (predictedScore: number | null): DashboardRow["riskLevel"] => {
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

  function getResolvedUserRiskLevel(
    analytics: UserAnalyticsSnapshot,
  ): DashboardRow["riskLevel"] {
    return analytics.riskLevel ?? getRiskLevel(analytics.predictedScore);
  }

  function getSuggestedIntervention(
    attendancePercentage: number,
    averageTryoutScore: number,
    teacherObjectiveScore?: number | null,
  ) {
    const hasX3 = teacherObjectiveScore !== null && typeof teacherObjectiveScore !== "undefined";
    const x1Low = attendancePercentage < 75;
    const x2Low = averageTryoutScore < 75;
    const x3Low = hasX3 && teacherObjectiveScore < 75;
    const lowSignalCount = [x1Low, x2Low, x3Low].filter(Boolean).length;

    if (lowSignalCount > 1) {
      return "Assign early intervention.";
    }

    if (x1Low && !x2Low && (!hasX3 || !x3Low)) {
      return "Improve attendance consistency.";
    }

    if (!x1Low && x2Low && (!hasX3 || !x3Low)) {
      return "Strengthen tryout practice.";
    }

    if (!x1Low && !x2Low && x3Low) {
      return "Improve teacher-guided learning focus.";
    }

    return "Maintain current progress.";
  }

  const fetchAdminDashboardData = async (token: string) => {
    const [usersResponse, runHistoryResponse] = await Promise.all([
      fetch("http://localhost:3000/users", {
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

    if (!usersResponse.ok) {
      throw new Error("Failed to fetch analytics users.");
    }

    const users = (await usersResponse.json()) as UserAccountResponse[];
    const userAccounts = users.filter((user) => user.role === "USER");
    const tutorMap = new Map(
      users
        .filter((user) => user.role === "TEACHER")
        .map((teacher) => [teacher.userId, teacher.fullName || teacher.username]),
    );

    if (runHistoryResponse.ok) {
      const runHistoryData = (await runHistoryResponse.json()) as RunHistoryItem[];
      setLatestRunHistory(runHistoryData[0] ?? null);
    } else {
      setLatestRunHistory(null);
    }

    const userRows = await Promise.all(
      userAccounts.map(async (user) => {
        const [featureResponse, recordsResponse] = await Promise.all([
          fetch(`http://localhost:3000/users/${user.userId}/features`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`http://localhost:3000/records/user/${user.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!featureResponse.ok) {
          throw new Error(`Failed to fetch features for user ${user.userId}`);
        }

        const featureData = (await featureResponse.json()) as UserFeatureSnapshot;
        const recordData = recordsResponse.ok
          ? ((await recordsResponse.json()) as UserRecordResponse[])
          : [];
        const actualScores = recordData
          .map((record) => record.actualExamScore)
          .filter(
            (score): score is number =>
              typeof score === "number" && Number.isFinite(score),
          );
        const actualScore =
          actualScores.length > 0
            ? actualScores.reduce((sum, score) => sum + score, 0) /
              actualScores.length
            : null;
        const teacherObjectiveScore =
          getSafeNumber(featureData.teacherObjectiveScore) ??
          getSafeNumber(featureData.x3) ??
          getSafeNumber(
            recordData.find(
              (record) => getSafeNumber(record.teacherObjectiveScore) !== null,
            )?.teacherObjectiveScore,
          );
        let predictedScore: number | null = null;

        if (featureData.tryoutCount >= 5 && teacherObjectiveScore !== null) {
          const predictionResponse = await fetch(
            "http://localhost:3000/analytics/predict-performance",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                attendancePercentage: featureData.x1,
                avgTryoutScore: featureData.x2,
                teacherObjectiveScore,
                tryoutCount: featureData.tryoutCount,
              }),
            },
          );

          if (predictionResponse.ok) {
            const predictionData =
              (await predictionResponse.json()) as { predictedPerformance: number };
            predictedScore = predictionData.predictedPerformance;
          }
        }

        return {
          id: user.userId,
          name: user.fullName || user.username,
          fullName: user.fullName || "",
          username: user.username,
          assignedTutorId: user.assignedTutorId ?? null,
          tutorName: user.assignedTutorId
            ? (tutorMap.get(user.assignedTutorId) ?? null)
            : null,
          attendancePercentage: featureData.x1,
          averageTryoutScore: featureData.x2,
          teacherObjectiveScore,
          predictedScore,
          actualScore,
          tryoutCount: featureData.tryoutCount,
          riskLevel: getRiskLevel(predictedScore),
          suggestedIntervention: getSuggestedIntervention(
            featureData.x1,
            featureData.x2,
            teacherObjectiveScore,
          ),
        };
      }),
    );

    setTableData(userRows);
  };

  const fetchGlobalAnalytics = async (token: string) => {
    const response = await fetch("http://localhost:3000/analytics/global", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch global analytics");
    }

    const globalData = (await response.json()) as GlobalAnalyticsSnapshot;
    setGlobalAnalytics(globalData);
  };

  const fetchTeacherDashboardData = async (token: string, userId: string) => {
    try {
      const response = await fetch("http://localhost:3000/analytics/tutors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json() as TutorAnalyticsRow[];
        const myRow = data.find((row) => row.tutorId === userId) || data[0];
        setTutorRow(myRow ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch tutor analytics:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);
      setCurrentUser(decoded);

      if (decoded.role === "USER") {
        setTableData([]);
        setLatestRunHistory(null);
        setGlobalAnalytics(null);
        await fetchUserAnalytics(decoded.sub, token);
      } else if (decoded.role === "ADMIN") {
        setUserAnalytics(null);
        setUserRecords([]);
        setUserAttendanceRecords([]);
        setGlobalAnalytics(null);
        await fetchAdminDashboardData(token);
      } else if (decoded.role === "TEACHER") {
        setTableData([]);
        setUserAnalytics(null);
        setUserRecords([]);
        setUserAttendanceRecords([]);
        setGlobalAnalytics(null);
        setLatestRunHistory(null);
        await fetchTeacherDashboardData(token, decoded.sub);
      } else {
        setTableData([]);
        setUserAnalytics(null);
        setUserRecords([]);
        setUserAttendanceRecords([]);
        setGlobalAnalytics(null);
        setLatestRunHistory(null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast("Unable to load dashboard analytics right now.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isUserDownloadDisabled =
    currentUser?.role === "USER" &&
    (!userAnalytics ||
      userAnalytics.predictedScore === null ||
      getSafeNumber(userAnalytics.x1) === null ||
      getSafeNumber(userAnalytics.x2) === null ||
      (getSafeNumber(userAnalytics.x3) === null &&
        getSafeNumber(userAnalytics.teacherObjectiveScore) === null &&
        getSafeNumber(getLatestUserRecord()?.teacherObjectiveScore) === null));

  return (
    <div className="space-y-12">
      {/* Premium Full-Screen Loading Overlay for data fetching */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a]/60 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 w-16 h-16 rounded-full border border-blue-500/20 bg-blue-500/5 animate-ping"></div>
            <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-blue-500 border-r-violet-500 animate-spin"></div>
            <div className="absolute w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
          </div>
          <p className="text-zinc-400 text-sm mt-8 font-medium animate-pulse tracking-widest uppercase">
            Synthesizing Analytics...
          </p>
        </div>
      )}

      {/* Header & Main Content */}
      {currentUser?.role === "USER" ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{currentUser.username}</span>
              </h2>
              <p className="text-zinc-500 text-sm font-light tracking-wide">
                Here is your personalized E-Raport prediction based on your recent activities.
              </p>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || isUserDownloadDisabled}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed text-zinc-200 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-xl group whitespace-nowrap self-start"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-blue-400 group-hover:translate-y-0.5 transition-transform" />
                  Download E-Raport (PDF)
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {userAnalytics ? (
              <>
                <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-2xl p-6 group transition-all duration-500 hover:bg-white/[0.03]">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">X1 Attendance</h4>
                  <p className="text-3xl font-semibold text-zinc-100 tracking-tighter">
                    {Number.isFinite(userAnalytics.x1) ? `${userAnalytics.x1.toFixed(1)}%` : "N/A"}
                  </p>
                  <p className="mt-3 text-xs text-zinc-500">Attendance consistency directly shapes your next exam prediction.</p>
                </div>
                <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-2xl p-6 group transition-all duration-500 hover:bg-white/[0.03]">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">X2 Tryout Average</h4>
                  <p className="text-3xl font-semibold text-zinc-100 tracking-tighter">
                    {Number.isFinite(userAnalytics.x2) ? userAnalytics.x2.toFixed(1) : "N/A"}
                  </p>
                  <p className="mt-3 text-xs text-zinc-500">This is your average academic record signal across complete tryout history.</p>
                </div>
                <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-2xl p-6 group transition-all duration-500 hover:bg-white/[0.03]">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">X3 Teacher Objective</h4>
                  <p className="text-3xl font-semibold text-zinc-100 tracking-tighter">
                    {getSafeNumber(userAnalytics.x3 ?? userAnalytics.teacherObjectiveScore) !== null
                      ? getSafeNumber(userAnalytics.x3 ?? userAnalytics.teacherObjectiveScore)?.toFixed(1)
                      : "N/A"}
                  </p>
                  <p className="mt-3 text-xs text-zinc-500">Teacher objective score adds guided assessment context to the prediction.</p>
                </div>
                <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-2xl p-6 group transition-all duration-500 hover:bg-white/[0.03]">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Y Predicted Next Exam Score</h4>
                  <p className="text-3xl font-semibold text-zinc-100 tracking-tighter">
                    {userAnalytics.predictedScore !== null
                      ? userAnalytics.predictedScore.toFixed(1)
                      : "N/A"}
                  </p>
                  <p className="mt-3 text-xs text-zinc-500">Generated from the final HiveEdu MLR formula using X1, X2, and X3.</p>
                </div>
                <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-2xl p-6 group transition-all duration-500 hover:bg-white/[0.03]">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Risk Level</h4>
                  <p
                    className={`text-3xl font-semibold tracking-tighter ${
                      getResolvedUserRiskLevel(userAnalytics) === "HIGH"
                        ? "text-red-400"
                        : getResolvedUserRiskLevel(userAnalytics) === "MEDIUM"
                          ? "text-amber-400"
                          : getResolvedUserRiskLevel(userAnalytics) === "SAFE"
                            ? "text-emerald-400"
                            : "text-zinc-400"
                    }`}
                  >
                    {getResolvedUserRiskLevel(userAnalytics)}
                  </p>
                  <p className="mt-3 text-xs text-zinc-500">This flag highlights whether your current prediction is inside a safe band.</p>
                </div>

                <div className="md:col-span-2 xl:col-span-4 bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent opacity-60 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-4 xl:max-w-md">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                          Personal Prediction
                        </p>
                        <h3 className="text-3xl font-semibold tracking-tight text-zinc-100">
                          {userAnalytics.predictedScore !== null
                            ? `${userAnalytics.predictedScore.toFixed(1)}`
                            : "Prediction Pending"}
                        </h3>
                        <p className="text-sm leading-7 text-zinc-400">
                          Your next exam score is projected from attendance consistency, average tryout history, and teacher objective score, then clamped into the 0-100 HiveEdu score range.
                        </p>
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-[#09090b] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
                          Risk: {getResolvedUserRiskLevel(userAnalytics)}
                        </div>
                      </div>

                      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-white/[0.06] bg-[#09090b] px-5 py-5">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">X1 Attendance</p>
                          <p className="mt-3 text-2xl font-semibold text-zinc-100">{userAnalytics.x1.toFixed(1)}%</p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.06] bg-[#09090b] px-5 py-5">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">X2 Tryout Average</p>
                          <p className="mt-3 text-2xl font-semibold text-zinc-100">{userAnalytics.x2.toFixed(1)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.06] bg-[#09090b] px-5 py-5">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">X3 Teacher Objective</p>
                          <p className="mt-3 text-2xl font-semibold text-zinc-100">
                            {getSafeNumber(userAnalytics.x3 ?? userAnalytics.teacherObjectiveScore) !== null
                              ? getSafeNumber(userAnalytics.x3 ?? userAnalytics.teacherObjectiveScore)?.toFixed(1)
                              : "N/A"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.06] bg-[#09090b] px-5 py-5">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Recorded Tryouts</p>
                          <p className="mt-3 text-2xl font-semibold text-zinc-100">{userAnalytics.tryoutCount.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 xl:col-span-4 grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-3xl p-8 md:p-10">
                    <div className="space-y-2 mb-6">
                      <h3 className="text-2xl font-medium text-zinc-100 tracking-tight">
                        Prediction Explanation
                      </h3>
                      <p className="text-sm text-zinc-500 leading-7">
                        This score is explained through the three research variables that HiveEdu is tracking for your progress.
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/[0.06] bg-[#09090b] px-6 py-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Formula Preview</p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">
                        Y = a + b1X1 + b2X2 + b3X3
                      </p>
                      <div className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
                        <p>X1 represents your attendance percentage.</p>
                        <p>X2 represents your average tryout score history.</p>
                        <p>X3 represents your teacher objective score from Academic Records.</p>
                        <p>Y is your predicted next exam score generated from those three inputs.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-3xl p-8 md:p-10">
                    <div className="space-y-2 mb-6">
                      <h3 className="text-2xl font-medium text-zinc-100 tracking-tight">
                        Recommendation Signal
                      </h3>
                      <p className="text-sm text-zinc-500 leading-7">
                        A direct next step generated from your current attendance, tryout, and teacher objective pattern.
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-blue-500/10 bg-[#09090b] px-6 py-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Recommended Focus</p>
                      <p className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
                        {recommendationMessage}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-zinc-400">
                        Keep improving all three signals together to move your predicted next exam score deeper into the safe range.
                      </p>
                    </div>
                  </div>
                </div>

                {userAnalytics.explanation && (
                  <div className="md:col-span-2 xl:col-span-4 bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-transparent opacity-60 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="space-y-2 mb-8">
                        <h3 className="text-2xl font-medium text-zinc-100 tracking-tight">
                          Prediction Breakdown
                        </h3>
                        <p className="text-sm text-zinc-500 leading-7">
                          See how each factor contributes to your final predicted score. Each bar represents the individual contribution from the MLR model.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        {[
                          {
                            label: "Intercept",
                            value: userAnalytics.explanation.interceptContribution,
                            color: "text-zinc-300",
                            barColor: "bg-zinc-500",
                          },
                          {
                            label: "Attendance (b1 × X1)",
                            value: userAnalytics.explanation.attendanceContribution,
                            color: "text-sky-400",
                            barColor: "bg-sky-500",
                          },
                          {
                            label: "Tryout (b2 × X2)",
                            value: userAnalytics.explanation.tryoutContribution,
                            color: "text-violet-400",
                            barColor: "bg-violet-500",
                          },
                          {
                            label: "Teacher Objective (b3 × X3)",
                            value: userAnalytics.explanation.teacherObjectiveContribution,
                            color: "text-amber-400",
                            barColor: "bg-amber-500",
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-2xl border border-white/[0.06] bg-[#09090b] px-5 py-5"
                          >
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                              {item.label}
                            </p>
                            <p className={`mt-3 text-2xl font-semibold ${item.color}`}>
                              {Number.isFinite(item.value) ? item.value.toFixed(2) : "N/A"}
                            </p>
                            <div className="mt-3 h-1.5 w-full rounded-full bg-white/5">
                              <div
                                className={`h-full rounded-full ${item.barColor} transition-all duration-700`}
                                style={{
                                  width: `${Number.isFinite(item.value) ? Math.min(100, Math.max(0, Math.abs(item.value))) : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-white/[0.06] bg-[#09090b] px-5 py-5">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                            Raw Score (unclamped)
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-zinc-200">
                            {Number.isFinite(userAnalytics.explanation.rawPredictedScore)
                              ? userAnalytics.explanation.rawPredictedScore.toFixed(2)
                              : "N/A"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-blue-500/10 bg-[#09090b] px-5 py-5">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                            Final Predicted Score
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-blue-400">
                            {Number.isFinite(userAnalytics.explanation.predictedScore)
                              ? userAnalytics.explanation.predictedScore.toFixed(2)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 xl:col-span-4 bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-3xl p-8 md:p-10">
                  <div className="space-y-2 mb-8">
                    <h3 className="text-2xl font-medium text-zinc-100 tracking-tight">
                      X2 Tryout Trend
                    </h3>
                    <p className="text-sm text-zinc-500 leading-7">
                      This line tracks your academic record average over time using saved tryout history.
                    </p>
                  </div>

                  {tryoutTrendData.length > 0 ? (
                    <div className="h-[360px] w-full min-w-0 min-h-[360px]">
                      {hasMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={tryoutTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                            <XAxis
                              dataKey="label"
                              tick={{ fill: "#71717a", fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                              dy={14}
                            />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fill: "#71717a", fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(9, 9, 11, 0.92)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                borderRadius: "16px",
                                backdropFilter: "blur(24px)",
                                padding: "16px 20px",
                              }}
                              itemStyle={{ color: "#f4f4f5", fontSize: "14px", fontWeight: 600 }}
                              labelStyle={{
                                color: "#71717a",
                                fontSize: "10px",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: "10px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#3b82f6"
                              strokeWidth={3}
                              dot={{ r: 4, fill: "#60a5fa", strokeWidth: 0 }}
                              activeDot={{ r: 6, fill: "#93c5fd", strokeWidth: 0 }}
                              name="Average Score"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] border border-white/5 bg-[#09090b] text-sm text-zinc-500">
                          Preparing chart surface...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] px-6 py-8 text-center">
                      <p className="text-sm font-medium text-zinc-200">No tryout history available yet.</p>
                      <p className="mt-3 text-sm leading-7 text-zinc-500">
                        Your X2 trend will appear here after academic records are saved for your account.
                      </p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 xl:col-span-4 bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_45%)] pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col xl:flex-row xl:items-center gap-10">
                    <div className="xl:w-[280px] space-y-3">
                      <h3 className="text-2xl font-medium text-zinc-100 tracking-tight">
                        Competency Radar
                      </h3>
                      <p className="text-sm text-zinc-500 leading-7">
                        A visual snapshot of your latest competency balance across Mathematics, Logical Reasoning, and English Proficiency.
                      </p>
                      <div className="space-y-3 pt-2">
                        {latestCompetencyScores.length > 0 ? (
                          latestCompetencyScores.map((entry) => (
                            <div key={entry.subject} className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#09090b] px-4 py-3">
                              <span className="text-sm text-zinc-300">{entry.subject}</span>
                              <span className="text-sm font-semibold text-blue-400">{entry.score.toFixed(1)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-white/5 bg-[#09090b] px-4 py-4 text-sm text-zinc-500">
                            No competency score data is available yet.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 h-[360px] w-full min-w-0 min-h-[360px]">
                      {latestCompetencyScores.length > 0 ? (
                        hasMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={latestCompetencyScores}>
                            <PolarGrid stroke="#27272a" />
                            <PolarAngleAxis
                              dataKey="subject"
                              tick={{ fill: "#a1a1aa", fontSize: 12 }}
                            />
                            <PolarRadiusAxis
                              angle={90}
                              domain={[0, 100]}
                              tick={{ fill: "#52525b", fontSize: 10 }}
                            />
                            <Radar
                              name="Latest Score"
                              dataKey="score"
                              stroke="#3b82f6"
                              fill="rgba(59, 130, 246, 0.35)"
                              fillOpacity={1}
                              strokeWidth={2.5}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] border border-white/5 bg-[#09090b] text-sm text-zinc-500">
                            Preparing chart surface...
                          </div>
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-white/5 bg-[#09090b] px-6 py-8 text-center">
                          <div>
                            <p className="text-sm font-medium text-zinc-200">No competency chart available yet.</p>
                            <p className="mt-3 text-sm leading-7 text-zinc-500">
                              Add complete academic records to unlock your competency radar.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 xl:col-span-4 bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-3xl p-8 md:p-10">
                  <div className="space-y-2 mb-8">
                    <h3 className="text-2xl font-medium text-zinc-100 tracking-tight">
                      Global Comparison
                    </h3>
                    <p className="text-sm text-zinc-500 leading-7">
                      Compare your current metrics against the live class average generated from active users in the HiveEdu model.
                    </p>
                  </div>

                  {comparisonChartData.length > 0 ? (
                    <div className="h-[360px] w-full min-w-0 min-h-[360px]">
                      {hasMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                            <XAxis
                              dataKey="metric"
                              tick={{ fill: "#71717a", fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                              dy={14}
                            />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fill: "#71717a", fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(9, 9, 11, 0.92)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                borderRadius: "16px",
                                backdropFilter: "blur(24px)",
                                padding: "16px 20px",
                              }}
                              itemStyle={{ color: "#f4f4f5", fontSize: "14px", fontWeight: 600 }}
                              labelStyle={{
                                color: "#71717a",
                                fontSize: "10px",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: "10px",
                              }}
                              cursor={{ fill: "rgba(255,255,255,0.02)" }}
                            />
                            <Legend
                              wrapperStyle={{ color: "#a1a1aa", fontSize: "12px", paddingTop: "16px" }}
                            />
                            <Bar dataKey="you" name="You" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                            <Bar
                              dataKey="classAverage"
                              name="Class Average"
                              fill="#8b5cf6"
                              radius={[10, 10, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] border border-white/5 bg-[#09090b] text-sm text-zinc-500">
                          Preparing chart surface...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] px-6 py-8 text-center">
                      <p className="text-sm font-medium text-zinc-200">Global comparison is not available yet.</p>
                      <p className="mt-3 text-sm leading-7 text-zinc-500">
                        This comparison will appear once both your analytics and the class average are ready.
                      </p>
                    </div>
                  )}

                  {globalAnalytics && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Active Users</p>
                        <p className="mt-2 text-2xl font-semibold text-zinc-100">{globalAnalytics.activeUserCount}</p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Global X1 Average</p>
                        <p className="mt-2 text-2xl font-semibold text-zinc-100">{globalAnalytics.averageX1.toFixed(1)}%</p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Global Predicted Average</p>
                        <p className="mt-2 text-2xl font-semibold text-zinc-100">{globalAnalytics.averagePredictedScore.toFixed(1)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 xl:col-span-4 bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-3xl p-8 md:p-10">
                  <div className="space-y-2 mb-8">
                    <h3 className="text-2xl font-medium text-zinc-100 tracking-tight">
                      Gamification Achievements
                    </h3>
                    <p className="text-sm text-zinc-500 leading-7">
                      Milestones unlock automatically as your attendance consistency, tryout quality, and predictive safety improve.
                    </p>
                  </div>

                  {achievementBadges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {achievementBadges.map((badge) => (
                        <div
                          key={badge.key}
                          className={`rounded-[1.5rem] border px-6 py-5 backdrop-blur-3xl ${badge.className}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`rounded-2xl border border-white/10 bg-[#09090b] p-3 ${badge.iconClassName}`}>
                              <Sparkles size={20} />
                            </div>
                            <div className="space-y-2">
                              <p className="text-lg font-semibold text-zinc-100">{badge.title}</p>
                              <p className="text-sm leading-7 text-zinc-300">{badge.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] px-6 py-8 text-center">
                      <p className="text-sm font-medium text-zinc-200">No achievement badges unlocked yet.</p>
                      <p className="mt-3 text-sm leading-7 text-zinc-500">
                        Keep pushing your attendance and academic performance to unlock premium milestones.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="md:col-span-2 xl:col-span-4 p-16 text-center bg-white/[0.01] border border-white/5 rounded-[2rem]">
                <p className="text-sm text-zinc-500 tracking-widest uppercase">No feature data available yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : currentUser?.role === "TEACHER" ? (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{currentUser.username}</span>
              </h2>
              <p className="text-zinc-500 text-sm font-light tracking-wide">
                Here is your overview of assigned user accounts and their predictive analytics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Assigned Users</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">{tutorRow?.assignedUserCount ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Avg Predicted</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-blue-400">
                {tutorRow?.averagePredictedScore ? tutorRow.averagePredictedScore.toFixed(1) : "N/A"}
              </p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">At-Risk Users</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-red-400">{tutorRow?.atRiskUserCount ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Avg Tryout (X2)</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">
                {tutorRow?.averageTryoutScore ? tutorRow.averageTryoutScore.toFixed(1) : "N/A"}
              </p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Avg Objective (X3)</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">
                {typeof tutorRow?.averageTeacherObjectiveScore === "number" ? tutorRow.averageTeacherObjectiveScore.toFixed(1) : "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-medium tracking-tight text-zinc-100">Quick Actions</h3>
                <p className="text-xs text-zinc-500">Navigate to key teacher tools</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <a href="/dashboard/records" className="block rounded-xl border border-white/5 bg-[#09090b] p-4 hover:bg-white/[0.02] transition-colors">
                  <p className="text-sm font-medium text-zinc-200">Academic Records</p>
                  <p className="mt-1 text-[10px] text-zinc-500">Manage tryout scores</p>
                </a>
                <a href="/dashboard/attendance" className="block rounded-xl border border-white/5 bg-[#09090b] p-4 hover:bg-white/[0.02] transition-colors">
                  <p className="text-sm font-medium text-zinc-200">Attendance</p>
                  <p className="mt-1 text-[10px] text-zinc-500">Mark user attendance</p>
                </a>
                <a href="/dashboard/tutors" className="block rounded-xl border border-white/5 bg-[#09090b] p-4 hover:bg-white/[0.02] transition-colors">
                  <p className="text-sm font-medium text-zinc-200">Tutor Analytics</p>
                  <p className="mt-1 text-[10px] text-zinc-500">View detailed metrics</p>
                </a>
                <a href="/dashboard/settings" className="block rounded-xl border border-white/5 bg-[#09090b] p-4 hover:bg-white/[0.02] transition-colors">
                  <p className="text-sm font-medium text-zinc-200">Settings</p>
                  <p className="mt-1 text-[10px] text-zinc-500">Manage your profile</p>
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl flex flex-col">
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium tracking-tight text-zinc-100">Priority Intervention Preview</h3>
                  <a href="/dashboard/tutors" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    View All
                  </a>
                </div>
                <p className="text-xs text-zinc-500">User accounts needing attention</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {(() => {
                  const predictions = tutorRow?.userPredictions || tutorRow?.assignedUsers || [];
                  const atRisk = predictions.filter(p => p.predictedScore !== null && p.predictedScore < 75).slice(0, 3);
                  
                  if (atRisk.length === 0) {
                    return (
                      <div className="flex h-[180px] items-center justify-center rounded-2xl border border-white/5 bg-[#09090b]">
                        <div className="text-center">
                          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500/80 mb-3" />
                          <p className="text-sm font-medium text-zinc-300">No priority intervention needed right now.</p>
                        </div>
                      </div>
                    );
                  }

                  return atRisk.map((user, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/5 bg-[#09090b] p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-semibold text-zinc-200">{user.fullName || user.username}</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.riskLevel === "HIGH" ? "bg-red-500/10 text-red-400" :
                          user.riskLevel === "MEDIUM" ? "bg-amber-500/10 text-amber-400" :
                          "bg-zinc-500/10 text-zinc-400"
                        }`}>
                          {user.riskLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-3">{user.suggestedIntervention || "Monitor progress closely."}</p>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="rounded border border-white/5 bg-white/[0.01] p-1.5">
                          <p className="text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">X1</p>
                          <p className="text-xs font-medium text-zinc-300">{user.attendancePercentage.toFixed(0)}%</p>
                        </div>
                        <div className="rounded border border-white/5 bg-white/[0.01] p-1.5">
                          <p className="text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">X2</p>
                          <p className="text-xs font-medium text-zinc-300">{user.averageTryoutScore.toFixed(0)}</p>
                        </div>
                        <div className="rounded border border-white/5 bg-white/[0.01] p-1.5">
                          <p className="text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">X3</p>
                          <p className="text-xs font-medium text-zinc-300">
                            {typeof user.teacherObjectiveScore === "number" ? user.teacherObjectiveScore.toFixed(0) : "N/A"}
                          </p>
                        </div>
                        <div className="rounded border border-white/5 bg-white/5 p-1.5">
                          <p className="text-[9px] uppercase tracking-wider text-zinc-400 mb-0.5">Pred</p>
                          <p className="text-xs font-semibold text-blue-400">{user.predictedScore?.toFixed(1) || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">
              Analytics Control Center
            </h2>
            <p className="text-zinc-500 text-sm font-light tracking-wide">
              Monitor the final HiveEdu regression scope, dataset quality, early warning coverage, and export-ready analytics outputs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
            {[
              {
                label: "Total Users",
                value: latestRunHistory?.totalUserCount ?? "N/A",
                icon: Users,
              },
              {
                label: "Active Users",
                value: latestRunHistory?.activeUserCount ?? "N/A",
                icon: Activity,
              },
              {
                label: "Eligible Users",
                value: latestRunHistory?.eligibleUserCount ?? "N/A",
                icon: Target,
              },
              {
                label: "Excluded Users",
                value: latestRunHistory?.excludedUserCount ?? "N/A",
                icon: AlertTriangle,
              },
              {
                label: "Training Samples",
                value: latestRunHistory?.trainingSampleCount ?? "N/A",
                icon: Activity,
              },
              {
                label: "Predictions",
                value: latestRunHistory?.predictionCount ?? "N/A",
                icon: Target,
              },
              {
                label: "MSE",
                value:
                  latestRunHistory?.mse !== null &&
                  typeof latestRunHistory?.mse !== "undefined"
                    ? latestRunHistory.mse.toFixed(2)
                    : "N/A",
                icon: Sparkles,
              },
            ].map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                        {card.label}
                      </h3>
                      <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">
                        {card.value}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/[0.05] p-3">
                      <Icon className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-2xl md:p-10">
              <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-medium tracking-tight text-zinc-100">
                    Multiple Linear Regression Overview
                  </h3>
                  <p className="mt-3 text-xs uppercase tracking-widest text-zinc-500 opacity-60">
                    Predicted trend with actual exam comparison when validation data exists.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportWorkbook}
                  disabled={isExportingAnalyticsReport}
                  className="inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 transition-all hover:border-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileSpreadsheet size={16} />
                  {isExportingAnalyticsReport
                    ? "Exporting Report..."
                    : "Export Analytics Report"}
                </button>
              </div>

              <div className="h-[380px] w-full min-w-0 min-h-[380px]">
                {hasMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dynamicChartData}
                      margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorActualOverview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.22} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPredictedOverview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        stroke="#52525b"
                        fontSize={11}
                        height={70}
                        tickMargin={12}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#71717a", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#52525b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#71717a" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          borderRadius: "16px",
                          backdropFilter: "blur(24px)",
                          padding: "16px 20px",
                        }}
                        itemStyle={{ color: "#f4f4f5", fontSize: "14px", fontWeight: 600 }}
                        labelStyle={{
                          color: "#71717a",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: "10px",
                        }}
                        cursor={{ stroke: "#27272a", strokeWidth: 1 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPredictedOverview)"
                        name="Predicted Score"
                        connectNulls
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorActualOverview)"
                        name="Actual Score"
                        connectNulls
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] border border-white/5 bg-[#09090b] text-sm text-zinc-500">
                    Preparing chart surface...
                  </div>
                )}
              </div>

              {!hasActualChartValues && (
                <div className="mt-6 rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4 text-sm text-zinc-400">
                  Actual exam values are not available yet for chart comparison. Predicted trend remains visible until validation scores are recorded.
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-2xl md:p-10">
                <div className="space-y-2 mb-8">
                  <h3 className="text-2xl font-medium tracking-tight text-zinc-100">
                    MLR Formula
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 opacity-60">
                    Final hiveedu prediction contract
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Formula Preview
                  </p>
                  <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-100">
                    Y = a + b1X1 + b2X2 + b3X3
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4">
                  <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Coefficient Mode</p>
                    <p className="mt-2 text-lg font-semibold text-zinc-100">
                      {latestRunHistory?.coefficientMode ?? "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Intercept</p>
                      <p className="mt-2 text-lg font-semibold text-zinc-100">
                        {typeof latestRunHistory?.intercept === "number"
                          ? latestRunHistory.intercept.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Attendance Coefficient</p>
                      <p className="mt-2 text-lg font-semibold text-zinc-100">
                        {typeof latestRunHistory?.attendanceCoefficient === "number"
                          ? latestRunHistory.attendanceCoefficient.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Tryout Coefficient</p>
                      <p className="mt-2 text-lg font-semibold text-zinc-100">
                        {typeof latestRunHistory?.tryoutCoefficient === "number"
                          ? latestRunHistory.tryoutCoefficient.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Teacher Objective Coefficient</p>
                      <p className="mt-2 text-lg font-semibold text-zinc-100">
                        {typeof latestRunHistory?.teacherObjectiveCoefficient === "number"
                          ? latestRunHistory.teacherObjectiveCoefficient.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Fallback Status</p>
                    <p className="mt-2 text-sm font-medium text-zinc-200">
                      {latestRunHistory?.fallbackUsed
                        ? latestRunHistory.fallbackReason || "Stored coefficients were used as fallback."
                        : "No fallback used in the latest run."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-2xl md:p-10">
                <div className="space-y-2 mb-8">
                  <h3 className="text-2xl font-medium tracking-tight text-zinc-100">
                    Data Quality & Eligibility
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 opacity-60">
                    Latest MLR run history
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Total Users", latestRunHistory?.totalUserCount],
                    ["Active Users", latestRunHistory?.activeUserCount],
                    ["Eligible Users", latestRunHistory?.eligibleUserCount],
                    ["Excluded Inactive", latestRunHistory?.excludedInactiveCount],
                    ["Excluded Tryout", latestRunHistory?.excludedInsufficientTryoutCount],
                    ["Excluded Null Score", latestRunHistory?.excludedNullScoreCount],
                    ["Training Samples", latestRunHistory?.trainingSampleCount],
                    ["Predictions Generated", latestRunHistory?.predictionCount],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/5 bg-[#09090b] px-4 py-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
                      <p className="mt-2 text-xl font-semibold text-zinc-100">
                        {typeof value === "number" ? value : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-2xl md:p-10">
            <div className="space-y-2 mb-8">
              <h3 className="text-2xl font-medium tracking-tight text-zinc-100">
                Early Warning
              </h3>
              <p className="text-xs uppercase tracking-widest text-zinc-500 opacity-60">
                Users predicted below the safe performance threshold
              </p>
            </div>

            {earlyWarningRows.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {earlyWarningRows.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-[1.5rem] border border-red-500/10 bg-[#09090b] px-6 py-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-zinc-100">{row.fullName || row.username}</p>
                        <p className="text-sm text-zinc-500">
                          {row.tutorName
                            ? `Tutor: ${row.tutorName}`
                            : row.assignedTutorId
                              ? `Assigned Tutor ID: ${row.assignedTutorId}`
                              : "Tutor assignment unavailable"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                          row.riskLevel === "HIGH"
                            ? "border border-red-500/20 bg-red-500/10 text-red-400"
                            : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {row.riskLevel}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <InterventionBadge userId={row.id} />
                      {currentUser?.role !== "USER" && (
                        <button
                          onClick={() => setInterventionUser({ id: row.id, name: row.fullName || row.username, riskLevel: row.riskLevel, predictedScore: row.predictedScore })}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 transition-colors hover:bg-white/10"
                        >
                          Follow-up
                        </button>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Attendance</p>
                        <p className="mt-2 text-sm font-semibold text-zinc-100">
                          {row.attendancePercentage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Tryout</p>
                        <p className="mt-2 text-sm font-semibold text-zinc-100">
                          {row.averageTryoutScore.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">X3</p>
                        <p className="mt-2 text-sm font-semibold text-zinc-100">
                          {row.teacherObjectiveScore !== null
                            ? row.teacherObjectiveScore.toFixed(1)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Predicted</p>
                        <p className="mt-2 text-sm font-semibold text-red-400">
                          {row.predictedScore?.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Suggested Intervention</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        {row.suggestedIntervention}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] px-6 py-8 text-center">
                <p className="text-sm font-medium text-zinc-200">No early warning users detected.</p>
                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  All current predicted users are operating inside the safe band or are still pending prediction eligibility.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-12">
              <div>
                <h3 className="text-2xl font-medium tracking-tight text-zinc-100">
                  User Performance Analytics
                </h3>
                <p className="mt-3 text-xs uppercase tracking-widest text-zinc-500 opacity-60">
                  Final feature inputs and predicted next exam score.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">User Name</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Tutor</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">X1 Attendance</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">X2 Tryout</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">X3 Teacher Objective</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Actual</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 text-right">Predicted</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 text-right">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tableData.length > 0 ? (
                    tableData.map((row) => (
                      <tr key={row.id} className="group transition-colors duration-200 hover:bg-white/[0.01]">
                        <td className="whitespace-nowrap px-4 py-6 text-sm font-medium text-zinc-200">
                          {row.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-6 text-sm text-zinc-400">
                          {row.tutorName || row.assignedTutorId || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-6 text-sm text-zinc-400">
                          {row.attendancePercentage.toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-4 py-6 text-sm text-zinc-400">
                          {row.averageTryoutScore.toFixed(1)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-6 text-sm text-zinc-400">
                          {row.teacherObjectiveScore !== null
                            ? row.teacherObjectiveScore.toFixed(1)
                            : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-6 text-sm text-zinc-400">
                          {row.actualScore !== null ? row.actualScore.toFixed(1) : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-6 text-right">
                          <span
                            className={`text-sm font-semibold ${
                              row.predictedScore !== null && row.predictedScore < 75
                                ? "text-red-500"
                                : "text-blue-400"
                            }`}
                          >
                            {row.predictedScore !== null ? row.predictedScore.toFixed(1) : "N/A"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-6 text-right">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                              row.riskLevel === "HIGH"
                                ? "border border-red-500/20 bg-red-500/10 text-red-400"
                                : row.riskLevel === "MEDIUM"
                                  ? "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                                  : row.riskLevel === "SAFE"
                                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                    : "border border-white/5 bg-white/[0.03] text-zinc-500"
                            }`}
                          >
                            {row.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-sm uppercase tracking-widest text-zinc-600">
                        No analytics data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#09090b] px-5 py-4 shadow-2xl backdrop-blur-3xl animate-in slide-in-from-bottom-6 fade-in duration-300">
          {toast.tone === "success" ? (
            <CheckCircle2 className="text-emerald-500" size={20} />
          ) : (
            <AlertCircle className="text-red-400" size={20} />
          )}
          <span className="text-sm font-medium text-zinc-200">{toast.message}</span>
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
            // Optionally re-fetch data if needed, but badge should update next reload
          }}
        />
      )}
    </div>
  );
}
