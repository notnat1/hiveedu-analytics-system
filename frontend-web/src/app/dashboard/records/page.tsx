"use client";
import { useTranslation } from "react-i18next";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Pencil } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "@/lib/api";

interface DecodedToken {
  sub: string;
  username: string;
  role: string;
}

interface UserOption {
  userId: string;
  username: string;
  fullName?: string;
  role: string;
  assignedTutorId?: string | null;
}

interface CurrentProfileResponse {
  userId: string;
  username: string;
  fullName?: string | null;
  role: string;
  assignedTutorId?: string | null;
}

interface UserFeatureSnapshot {
  x1: number;
  x2: number;
  tryoutCount: number;
}

interface AcademicRecord {
  id: string;
  userId: string;
  mathScore?: number | null;
  logicScore?: number | null;
  englishScore?: number | null;
  mathematicsScore?: number | null;
  logicalReasoningScore?: number | null;
  averageScore?: number | null;
  teacherObjectiveScore?: number | null;
  teacherFeedback?: string | null;
  actualExamScore?: number | null;
  examDate?: string | null;
  examLabel?: string | null;
  isUsedForTraining?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ToastState {
  show: boolean;
  message: string;
  tone: "success" | "error";
}

const inputClassName =
  "w-full rounded-xl bg-[#09090b] border border-white/10 text-zinc-100 px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

const textareaClassName =
  "w-full rounded-xl bg-[#09090b] border border-white/10 text-zinc-100 px-4 py-3 text-sm placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

export default function AcademicRecordsPage() {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [mathScore, setMathScore] = useState("");
  const [logicScore, setLogicScore] = useState("");
  const [englishScore, setEnglishScore] = useState("");
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [teacherObjectiveScore, setTeacherObjectiveScore] = useState("");
  const [actualExamScore, setActualExamScore] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examLabel, setExamLabel] = useState("");
  const [isUsedForTraining, setIsUsedForTraining] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    tone: "success",
  });
  const [userFeatures, setUserFeatures] = useState<UserFeatureSnapshot | null>(null);
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleImport = async () => {
    if (!importFile) return;
    const token = getAuthToken();
    if (!token) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const response = await fetch(`${API_BASE}/records/bulk-import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengimpor data");
      }

      const result = await response.json();
      showToast(`Berhasil: ${result.success}, Gagal: ${result.failed}`);
      if (selectedUserId) {
        await fetchRecords(selectedUserId);
      }
      setIsImportModalOpen(false);
      setImportFile(null);
    } catch (error) {
      console.error(error);
      showToast("Gagal mengimpor file Excel", "error");
    } finally {
      setIsImporting(false);
    }
  };

  const showToast = (message: string, tone: ToastState["tone"] = "success") => {
    setToast({ show: true, message, tone });
    setTimeout(() => {
      setToast({ show: false, message: "", tone: "success" });
    }, 3000);
  };

  const isReadOnly = currentUser?.role === "USER" || currentUser?.role === "PARENT";
  const selectedUser = userOptions.find((user) => user.userId === selectedUserId) ?? null;

  const localAveragePreview = useMemo(() => {
    if (
      mathScore.trim() === "" ||
      logicScore.trim() === "" ||
      englishScore.trim() === ""
    ) {
      return null;
    }

    const parsedMathScore = Number(mathScore);
    const parsedLogicScore = Number(logicScore);
    const parsedEnglishScore = Number(englishScore);

    if (
      !Number.isFinite(parsedMathScore) ||
      !Number.isFinite(parsedLogicScore) ||
      !Number.isFinite(parsedEnglishScore)
    ) {
      return null;
    }

    return Number(((parsedMathScore + parsedLogicScore + parsedEnglishScore) / 3).toFixed(1));
  }, [englishScore, logicScore, mathScore]);

  const latestAverageScore = useMemo(() => {
    const latestRecord = records[0];
    if (!latestRecord) {
      return null;
    }

    if (
      typeof latestRecord.averageScore === "number" &&
      Number.isFinite(latestRecord.averageScore)
    ) {
      return latestRecord.averageScore;
    }

    const mathValue = latestRecord.mathScore ?? latestRecord.mathematicsScore;
    const logicValue = latestRecord.logicScore ?? latestRecord.logicalReasoningScore;
    const englishValue = latestRecord.englishScore;

    if (
      typeof mathValue === "number" &&
      Number.isFinite(mathValue) &&
      typeof logicValue === "number" &&
      Number.isFinite(logicValue) &&
      typeof englishValue === "number" &&
      Number.isFinite(englishValue)
    ) {
      return (mathValue + logicValue + englishValue) / 3;
    }

    return null;
  }, [records]);

  const resetForm = () => {
    setEditingRecordId(null);
    setMathScore("");
    setLogicScore("");
    setEnglishScore("");
    setTeacherFeedback("");
    setTeacherObjectiveScore("");
    setActualExamScore("");
    setExamDate("");
    setExamLabel("");
    setIsUsedForTraining(true);
  };

  const getAuthToken = () => localStorage.getItem("token");

  const getNumericValue = (value: string) => {
    if (value.trim() === "") {
      return undefined;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : Number.NaN;
  };

  const getRecordMathScore = (record: AcademicRecord) =>
    record.mathScore ?? record.mathematicsScore ?? null;

  const getRecordLogicScore = (record: AcademicRecord) =>
    record.logicScore ?? record.logicalReasoningScore ?? null;

  const getRecordTeacherObjectiveScore = (record: AcademicRecord) =>
    typeof record.teacherObjectiveScore === "number" &&
    Number.isFinite(record.teacherObjectiveScore)
      ? record.teacherObjectiveScore
      : null;

  const getEligibilityBadges = (record: AcademicRecord) => {
    const badges: Array<{
      key: string;
      label: string;
      className: string;
    }> = [];

    const mathValue = getRecordMathScore(record);
    const logicValue = getRecordLogicScore(record);
    const englishValue = record.englishScore ?? null;

    if (
      typeof mathValue === "number" &&
      typeof logicValue === "number" &&
      typeof englishValue === "number"
    ) {
      badges.push({
        key: "eligible-input",
        label: t("records.badge_eligible"),
        className:
          "border border-blue-500/20 bg-blue-500/10 text-blue-400",
      });
    }

    if (typeof record.actualExamScore === "number") {
      badges.push({
        key: "ground-truth-ready",
        label: t("records.badge_ground_truth"),
        className:
          "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      });
    }

    if (getRecordTeacherObjectiveScore(record) !== null) {
      badges.push({
        key: "x3-ready",
        label: t("records.badge_x3_ready"),
        className:
          "border border-violet-500/20 bg-violet-500/10 text-violet-400",
      });
    }

    if (record.isUsedForTraining === false) {
      badges.push({
        key: "excluded-training",
        label: t("records.badge_excluded"),
        className:
          "border border-red-500/20 bg-red-500/10 text-red-400",
      });
    }

    return badges;
  };

  const fetchUsers = async (decoded: DecodedToken) => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    try {
      setIsLoadingUsers(true);
      setPageError("");

      const usersEndpoint =
        decoded.role === "ADMIN"
          ? `${API_BASE}/users`
          : decoded.role === "TEACHER"
            ? `${API_BASE}/users/role/user`
            : `${API_BASE}/users/me`;

      const response = await fetch(usersEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("errors.failed_fetch_users"));
      }

      const responseData = await response.json().then(r => r.data ?? r);
      const profile = responseData as CurrentProfileResponse & { linkedStudentId?: string | null };
      let data: UserOption[];
      
      if (decoded.role === "USER") {
        data = [
          {
            userId: profile.userId,
            username: profile.username,
            fullName: profile.fullName ?? undefined,
            role: profile.role,
            assignedTutorId: profile.assignedTutorId ?? null,
          }
        ];
      } else if (decoded.role === "PARENT") {
        data = profile.linkedStudentId ? [
          {
            userId: profile.linkedStudentId,
            username: (profile as any).linkedStudent?.username || "linked_student",
            fullName: (profile as any).linkedStudent?.fullName || (t("users.linked_student") ?? "Linked Student"),
            role: "USER",
            assignedTutorId: null,
          } as UserOption,
        ] : [];
      } else {
        data = responseData as UserOption[];
      }
      const roleUsers = data.filter((user) => user.role === "USER");
      const filteredUsers =
        decoded.role === "ADMIN"
          ? roleUsers
          : decoded.role === "TEACHER"
            ? roleUsers.filter((user) => user.assignedTutorId === decoded.sub)
            : roleUsers;

      setUserOptions(filteredUsers);
      setSelectedUserId((previousSelectedUserId) => {
        if (
          previousSelectedUserId &&
          filteredUsers.some((user) => user.userId === previousSelectedUserId)
        ) {
          return previousSelectedUserId;
        }

        if (decoded.role === "USER" || decoded.role === "PARENT") {
          return filteredUsers[0]?.userId ?? "";
        }

        return filteredUsers[0]?.userId ?? "";
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserOptions([]);
      setPageError(t("errors.unable_load_users"));
      showToast(t("errors.unable_load_users"), "error");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchUserFeatures = async (userId: string) => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/${userId}/features`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("errors.failed_fetch_user_features"));
      }

      const data = (await response.json().then(r => r.data ?? r)) as UserFeatureSnapshot;
      setUserFeatures(data);
    } catch (error) {
      console.error("Error fetching user features:", error);
      setUserFeatures(null);
    }
  };

  const fetchRecords = async (userId: string) => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    try {
      setIsLoadingRecords(true);
      const response = await fetch(`${API_BASE}/records/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setRecords([]);
          setIsLoadingRecords(false);
          return;
        }
        throw new Error(t("errors.failed_fetch_records"));
      }

      const data = (await response.json().then(r => r.data ?? r)) as AcademicRecord[];
      setRecords(data);
    } catch (error) {
      console.error("Error fetching academic records:", error);
      setRecords([]);
      showToast(t("errors.failed_fetch_records"), "error");
    } finally {
      setIsLoadingRecords(false);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setPageError(t("errors.token_not_found"));
      setIsLoadingUsers(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setCurrentUser(decoded);
      void fetchUsers(decoded);
    } catch (error) {
      console.error("Error decoding token:", error);
      setPageError(t("errors.unable_identify_session"));
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setRecords([]);
      setUserFeatures(null);
      resetForm();
      return;
    }

    resetForm();
    void Promise.all([fetchUserFeatures(selectedUserId), fetchRecords(selectedUserId)]);
  }, [selectedUserId]);

  const handleEditRecord = (record: AcademicRecord) => {
    if (isReadOnly) {
      return;
    }

    setEditingRecordId(record.id);
    setMathScore(String(getRecordMathScore(record) ?? ""));
    setLogicScore(String(getRecordLogicScore(record) ?? ""));
    setEnglishScore(String(record.englishScore ?? ""));
    setTeacherFeedback(record.teacherFeedback ?? "");
    setTeacherObjectiveScore(
      typeof record.teacherObjectiveScore === "number"
        ? String(record.teacherObjectiveScore)
        : "",
    );
    setActualExamScore(
      typeof record.actualExamScore === "number" ? String(record.actualExamScore) : "",
    );
    setExamDate(record.examDate ?? "");
    setExamLabel(record.examLabel ?? "");
    setIsUsedForTraining(record.isUsedForTraining ?? true);
  };

  const handleSubmitRecord = async () => {
    if (isReadOnly) {
      showToast(t("toasts.readonly_user"), "error");
      return;
    }

    if (!selectedUserId) {
      showToast(t("toasts.select_user_first"), "error");
      return;
    }

    const parsedMathScore = getNumericValue(mathScore);
    const parsedLogicScore = getNumericValue(logicScore);
    const parsedEnglishScore = getNumericValue(englishScore);
    const parsedTeacherObjectiveScore = getNumericValue(teacherObjectiveScore);
    const parsedActualExamScore = getNumericValue(actualExamScore);

    if (
      typeof parsedMathScore !== "number" ||
      Number.isNaN(parsedMathScore) ||
      typeof parsedLogicScore !== "number" ||
      Number.isNaN(parsedLogicScore) ||
      typeof parsedEnglishScore !== "number" ||
      Number.isNaN(parsedEnglishScore)
    ) {
      showToast(t("toasts.valid_numbers_required"), "error");
      return;
    }

    if (
      [parsedMathScore, parsedLogicScore, parsedEnglishScore].some(
        (score) => score < 0 || score > 100,
      )
    ) {
      showToast(t("toasts.score_range"), "error");
      return;
    }

    if (
      typeof parsedTeacherObjectiveScore === "number" &&
      (Number.isNaN(parsedTeacherObjectiveScore) ||
        parsedTeacherObjectiveScore < 0 ||
        parsedTeacherObjectiveScore > 100)
    ) {
      showToast(t("toasts.x3_range"), "error");
      return;
    }

    if (
      typeof parsedActualExamScore === "number" &&
      (Number.isNaN(parsedActualExamScore) ||
        parsedActualExamScore < 0 ||
        parsedActualExamScore > 100)
    ) {
      showToast(t("toasts.exam_range"), "error");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showToast(t("toasts.session_not_found"), "error");
      return;
    }

    const payload = {
      userId: selectedUserId,
      mathScore: parsedMathScore,
      logicScore: parsedLogicScore,
      englishScore: parsedEnglishScore,
      teacherObjectiveScore:
        typeof parsedTeacherObjectiveScore === "number"
          ? parsedTeacherObjectiveScore
          : undefined,
      teacherFeedback: teacherFeedback.trim() || undefined,
      actualExamScore:
        typeof parsedActualExamScore === "number" ? parsedActualExamScore : undefined,
      examDate: examDate || undefined,
      examLabel: examLabel.trim() || undefined,
      isUsedForTraining,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(
        editingRecordId
          ? `${API_BASE}/records/${editingRecordId}`
          : `${API_BASE}/records`,
        {
          method: editingRecordId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(t("errors.failed_save_record"));
      }

      await fetchRecords(selectedUserId);
      await fetchUserFeatures(selectedUserId);
      resetForm();
      showToast(t("toasts.record_saved"));
    } catch (error) {
      console.error("Error saving academic record:", error);
      showToast(t("toasts.unable_save_record"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">{t("records.title")}</h1>
        <p className="text-sm text-zinc-500">
          {t("records.desc")}
        </p>
      </header>

      {pageError && (
        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 px-5 py-4 text-sm text-red-300">
          {pageError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-100">{t("records.select_user")}</h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {t("records.select_user_desc")}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="user-select" className="text-sm text-zinc-400">
              {t("records.username_label")}
            </label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              disabled={isLoadingUsers || isReadOnly}
              className={inputClassName}
            >
              <option value="" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                {isLoadingUsers ? t("records.loading_users") : t("records.select_a_user")}
              </option>
              {userOptions.map((user) => (
                <option key={user.userId} value={user.userId} className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  {user.username} - {user.fullName || "N/A"}
                </option>
              ))}
            </select>
            {isReadOnly && (
              <p className="text-xs text-zinc-500">
                {t("records.readonly_note")}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500">
              {t("records.current_analytics_snapshot")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <div className="bg-[#09090b] border border-white/10 rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-zinc-500">{t("records.x1_attendance")}</p>
                <p className="text-lg font-semibold text-zinc-100 mt-1">
                  {selectedUserId && userFeatures ? `${userFeatures.x1.toFixed(1)}%` : "N/A"}
                </p>
              </div>
              <div className="bg-[#09090b] border border-white/10 rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-zinc-500">{t("records.x2_tryout")}</p>
                <p className="text-lg font-semibold text-zinc-100 mt-1">
                  {selectedUserId && userFeatures ? userFeatures.x2.toFixed(1) : "N/A"}
                </p>
              </div>
              <div className="bg-[#09090b] border border-white/10 rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-zinc-500">{t("records.latest_average")}</p>
                <p className="text-lg font-semibold text-zinc-100 mt-1">
                  {typeof latestAverageScore === "number" ? latestAverageScore.toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-2xl p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-zinc-100">
                {editingRecordId ? t("records.update_record") : t("records.input_scores")}
              </h2>
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                {t("records.enter_normalized")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {editingRecordId && !isReadOnly && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.04]"
                >
                  {t("records.cancel_edit")}
                </button>
              )}
              {!isReadOnly && !editingRecordId && (
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-400 transition-all hover:border-blue-500/50 hover:bg-blue-500/20 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Upload Excel
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="math-score" className="text-sm text-zinc-400">
                {t("records.math_score")}
              </label>
              <input
                id="math-score"
                type="number"
                min={0}
                max={100}
                value={mathScore}
                onChange={(event) => setMathScore(event.target.value)}
                disabled={isReadOnly || !selectedUserId}
                className={inputClassName}
                placeholder={t("records.placeholder_0_100")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="logic-score" className="text-sm text-zinc-400">
                {t("records.logic_score")}
              </label>
              <input
                id="logic-score"
                type="number"
                min={0}
                max={100}
                value={logicScore}
                onChange={(event) => setLogicScore(event.target.value)}
                disabled={isReadOnly || !selectedUserId}
                className={inputClassName}
                placeholder={t("records.placeholder_0_100")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="english-score" className="text-sm text-zinc-400">
                {t("records.english_score")}
              </label>
              <input
                id="english-score"
                type="number"
                min={0}
                max={100}
                value={englishScore}
                onChange={(event) => setEnglishScore(event.target.value)}
                disabled={isReadOnly || !selectedUserId}
                className={inputClassName}
                placeholder={t("records.placeholder_0_100")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="average-score" className="text-sm text-zinc-400">
                Average Score Preview
              </label>
              <input
                id="average-score"
                type="text"
                readOnly
                value={typeof localAveragePreview === "number" ? localAveragePreview.toFixed(1) : t("records.calculated_backend")}
                className={inputClassName}
              />
              <p className="text-xs text-zinc-500">
                {t("records.avg_preview_note")}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="teacher-objective-score" className="text-sm text-zinc-400">
                {t("records.teacher_x3")}
              </label>
              <input
                id="teacher-objective-score"
                type="number"
                min={0}
                max={100}
                value={teacherObjectiveScore}
                onChange={(event) => setTeacherObjectiveScore(event.target.value)}
                disabled={isReadOnly || !selectedUserId}
                className={inputClassName}
                placeholder={t("records.placeholder_recommended")}
              />
              <p className="text-xs text-zinc-500">
                {t("records.teacher_x3_desc")}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="actual-exam-score" className="text-sm text-zinc-400">
                {t("records.actual_exam")}
              </label>
              <input
                id="actual-exam-score"
                type="number"
                min={0}
                max={100}
                value={actualExamScore}
                onChange={(event) => setActualExamScore(event.target.value)}
                disabled={isReadOnly || !selectedUserId}
                className={inputClassName}
                placeholder={t("records.placeholder_ground_truth")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="exam-date" className="text-sm text-zinc-400">
                {t("records.exam_date")}
              </label>
              <input
                id="exam-date"
                type="date"
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                disabled={isReadOnly || !selectedUserId}
                className={inputClassName}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="exam-label" className="text-sm text-zinc-400">
                {t("records.exam_label")}
              </label>
              <input
                id="exam-label"
                type="text"
                value={examLabel}
                onChange={(event) => setExamLabel(event.target.value)}
                disabled={isReadOnly || !selectedUserId}
                className={inputClassName}
                placeholder={t("records.placeholder_label")}
              />
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <label htmlFor="teacher-feedback" className="text-sm text-zinc-400">
              {t("records.teacher_feedback")}
            </label>
            <textarea
              id="teacher-feedback"
              rows={4}
              value={teacherFeedback}
              onChange={(event) => setTeacherFeedback(event.target.value)}
              disabled={isReadOnly || !selectedUserId}
              className={textareaClassName}
              placeholder={t("records.placeholder_notes")}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/[0.04] bg-[#09090b] px-5 py-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-200">{t("records.use_for_mlr")}</p>
              <p className="text-xs text-zinc-500">
                {t("records.use_for_mlr_desc")}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isUsedForTraining}
              onClick={() => !isReadOnly && selectedUserId && setIsUsedForTraining((current) => !current)}
              disabled={isReadOnly || !selectedUserId}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isUsedForTraining ? "bg-blue-600" : "bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isUsedForTraining ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {!isReadOnly && (
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitRecord}
                disabled={!selectedUserId || isSubmitting}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 rounded-xl shadow-[0_8px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_10px_25px_rgba(14,165,233,0.3)] hover:from-blue-500 hover:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? editingRecordId
                    ? t("records.saving_changes")
                    : t("records.saving_record")
                  : editingRecordId
                    ? t("records.save_changes")
                    : t("records.save_record")}
              </button>
            </div>
          )}
        </section>
      </div>

      <section className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-2xl p-6 md:p-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-lg font-semibold text-zinc-100">{t("records.history")}</h2>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            {selectedUser
              ? t("records.showing_records_for", { name: selectedUser.fullName || selectedUser.username })
              : t("records.select_user_review")}
          </p>
        </div>

        {selectedUserId ? (
          isLoadingRecords ? (
            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-6 py-8 text-center text-sm text-zinc-400">
              {t("records.loading_records")}
            </div>
          ) : records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1350px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.col_user")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.exam_label")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.exam_date")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.col_math")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.col_logic")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.col_english")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.col_avg")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.teacher_x3")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.col_actual")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.col_training")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.col_eligibility")}</th>
                    <th className="border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("records.teacher_feedback")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 text-right">{t("records.col_actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((record, index) => {
                    const mathValue = getRecordMathScore(record);
                    const logicValue = getRecordLogicScore(record);
                    const averageValue =
                      typeof record.averageScore === "number"
                        ? record.averageScore
                        : null;
                    const teacherObjectiveValue = getRecordTeacherObjectiveScore(record);
                    const badges = getEligibilityBadges(record);

                    return (
                      <tr key={record.id || `record-${index}`} className="align-top hover:bg-white/[0.01]">
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-zinc-200">
                          {selectedUser?.fullName || selectedUser?.username || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-300">
                          {record.examLabel || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                          {record.examDate || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                          {typeof mathValue === "number" ? mathValue.toFixed(1) : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                          {typeof logicValue === "number" ? logicValue.toFixed(1) : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                          {typeof record.englishScore === "number"
                            ? record.englishScore.toFixed(1)
                            : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                          {typeof averageValue === "number" ? averageValue.toFixed(1) : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                          {typeof teacherObjectiveValue === "number"
                            ? teacherObjectiveValue.toFixed(1)
                            : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                          {typeof record.actualExamScore === "number"
                            ? record.actualExamScore.toFixed(1)
                            : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                          {record.isUsedForTraining === false ? t("records.no") : t("records.yes")}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {badges.length > 0 ? (
                              badges.map((badge) => (
                                <span
                                  key={badge.key}
                                  className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${badge.className}`}
                                >
                                  {badge.label}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-zinc-500">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="max-w-[260px] px-4 py-4 text-sm leading-6 text-zinc-400">
                          {record.teacherFeedback?.trim() || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right">
                          {!isReadOnly ? (
                            <button
                              type="button"
                              onClick={() => handleEditRecord(record)}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.04]"
                            >
                              <Pencil size={14} />
                              {t("records.btn_edit")}
                            </button>
                          ) : (
                            <span className="text-sm text-zinc-500">{t("records.badge_readonly")}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-6 py-8 text-center">
              <p className="text-sm font-medium text-zinc-200">{t("records.no_records")}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {t("records.no_records_desc")}
              </p>
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-white/5 bg-[#09090b] px-6 py-8 text-center">
            <p className="text-sm font-medium text-zinc-200">{t("records.no_user")}</p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              {t("records.no_user_desc")}
            </p>
          </div>
        )}
      </section>

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Upload Data Nilai (Excel)</h2>
              <p className="text-sm text-zinc-500 mt-1">Upload file .xlsx untuk mengimpor data nilai secara massal. Baris pertama harus berisi header.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-zinc-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-zinc-400"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                  <p className="text-xs text-zinc-500">XLSX, XLS</p>
                </div>
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={(e) => setImportFile(e.target.files?.[0] ?? null)} />
              </label>
              {importFile && (
                <div className="text-sm text-blue-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {importFile.name}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                }}
                disabled={isImporting}
                className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={isImporting || !importFile}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 flex items-center gap-2"
              >
                {isImporting && (
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isImporting ? "Mengimpor..." : "Mulai Import"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl ${
              toast.tone === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {toast.tone === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
