"use client";
import { useTranslation } from "react-i18next";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "@/lib/api";

type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";

interface DecodedToken {
  sub: string;
  username: string;
  role: string;
}

interface UserOption {
  userId: string;
  username: string;
  fullName?: string;
  role?: string;
  assignedTutorId?: string | null;
}

interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  status: AttendanceStatus;
  createdAt?: string;
}

interface ToastState {
  show: boolean;
  message: string;
  tone: "success" | "error";
}

const inputClassName =
  "w-full rounded-xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

const getAttendancePoint = (status: AttendanceStatus) => {
  if (status === "PRESENT") {
    return 1;
  }

  if (status === "LATE") {
    return 0.5;
  }

  return 0;
};

export default function AttendancePage() {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [status, setStatus] = useState<AttendanceStatus>("PRESENT");
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    tone: "success",
  });

  // New states for Bulk Attendance
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAttendance, setBulkAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().slice(0, 10));
  const [bulkSearchQuery, setBulkSearchQuery] = useState("");
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);

  // New state for Delete Confirmation
  const [attendanceToDelete, setAttendanceToDelete] = useState<AttendanceRecord | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");


  const showToast = (message: string, tone: ToastState["tone"] = "success") => {
    setToast({ show: true, message, tone });
    setTimeout(() => {
      setToast({ show: false, message: "", tone: "success" });
    }, 3000);
  };

  const isReadOnly = currentUser?.role === "USER" || currentUser?.role === "PARENT";
  const selectedUser = userOptions.find((user) => user.userId === selectedUserId) ?? null;

  const attendanceSummary = useMemo(() => {
    const totalAttendanceRecords = attendanceRecords.length;
    const attendancePoints = attendanceRecords.reduce(
      (sum, record) => sum + getAttendancePoint(record.status),
      0,
    );
    const attendancePercentage =
      totalAttendanceRecords > 0
        ? (attendancePoints / totalAttendanceRecords) * 100
        : 0;

    return {
      totalAttendanceRecords,
      attendancePoints,
      attendancePercentage,
    };
  }, [attendanceRecords]);

  const resetForm = () => {
    setEditingAttendanceId(null);
    setAttendanceDate(new Date().toISOString().slice(0, 10));
    setStatus("PRESENT");
  };

  const fetchUsers = async (decoded: DecodedToken) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      setIsLoadingUsers(true);
      setPageError("");

      if (decoded.role === "USER" || decoded.role === "PARENT") {
        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t("errors.failed_fetch_user"));
        }

        const currentProfile = (await response.json().then(r => r.data ?? r)) as any;
        
        if (decoded.role === "PARENT") {
          if (currentProfile.linkedStudentId) {
            const studentAccount = {
              userId: currentProfile.linkedStudentId,
              username: currentProfile.linkedStudent?.username || "linked_student",
              fullName: currentProfile.linkedStudent?.fullName || (t("users.linked_student") ?? "Linked Student"),
              role: "USER",
              assignedTutorId: null
            } as unknown as UserOption;
            setUserOptions([studentAccount]);
            setSelectedUserId(studentAccount.userId);
          } else {
            setUserOptions([]);
          }
        } else {
          setUserOptions([currentProfile as UserOption]);
          setSelectedUserId(currentProfile.userId);
        }
        return;
      }

      const response = await fetch(`${API_BASE}/users/role/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("errors.failed_fetch_users"));
      }

      const data = (await response.json().then(r => r.data ?? r)) as UserOption[];
      const filteredUsers =
        decoded.role === "ADMIN"
          ? data
          : decoded.role === "TEACHER"
            ? data.filter((user) => user.assignedTutorId === decoded.sub)
            : data.filter((user) => user.userId === decoded.sub);

      setUserOptions(filteredUsers);
      setSelectedUserId((previousSelectedUserId) => {
        if (
          previousSelectedUserId &&
          filteredUsers.some((user) => user.userId === previousSelectedUserId)
        ) {
          return previousSelectedUserId;
        }

        if (decoded.role === "USER") {
          return decoded.sub;
        }

        return filteredUsers[0]?.userId ?? "";
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserOptions([]);
      const message =
        decoded.role === "USER"
          ? t("errors.unable_load_attendance_profile")
          : t("errors.unable_load_user_options");
      setPageError(message);
      showToast(message, "error");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchAttendanceRecords = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      setIsLoadingAttendance(true);

      const response = await fetch(`${API_BASE}/attendance/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("errors.failed_fetch_attendance"));
      }

      const data = (await response.json().then(r => r.data ?? r)) as AttendanceRecord[];
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setAttendanceRecords([]);
      showToast(t("errors.failed_fetch_attendance"), "error");
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
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
      setAttendanceRecords([]);
      resetForm();
      return;
    }

    resetForm();
    void fetchAttendanceRecords(selectedUserId);
  }, [selectedUserId]);

  const handleEditAttendance = (record: AttendanceRecord) => {
    if (isReadOnly) {
      return;
    }

    setEditingAttendanceId(record.id);
    setAttendanceDate(record.date || new Date().toISOString().slice(0, 10));
    setStatus(record.status);
  };

  const handleDeleteAttendance = async (attendanceId: string) => {
    if (isReadOnly) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || !selectedUserId) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/attendance/${attendanceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("errors.failed_delete_attendance"));
      }

      await fetchAttendanceRecords(selectedUserId);
      if (editingAttendanceId === attendanceId) {
        resetForm();
      }
      showToast(t("toasts.attendance_deleted"));
    } catch (error) {
      console.error("Error deleting attendance:", error);
      showToast(t("toasts.unable_delete_attendance"), "error");
    }
  };

  const handleSubmitAttendance = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast(t("errors.token_not_found"), "error");
      return;
    }

    if (isReadOnly) {
      showToast(t("toasts.readonly_user"), "error");
      return;
    }

    if (!selectedUserId || !attendanceDate) {
      showToast(t("toasts.select_user_date"), "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        editingAttendanceId
          ? `${API_BASE}/attendance/${editingAttendanceId}`
          : `${API_BASE}/attendance`,
        {
          method: editingAttendanceId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUserId,
            date: attendanceDate,
            status,
          }),
        },
      );

      if (!response.ok) {
        if (response.status === 409) {
          showToast(
            t("toasts.attendance_exists"),
            "error",
          );
          return;
        }

        throw new Error(t("errors.failed_save_attendance"));
      }

      await fetchAttendanceRecords(selectedUserId);
      resetForm();
      showToast(
        editingAttendanceId
          ? t("toasts.attendance_updated")
          : t("toasts.attendance_added"),
      );
    } catch (error) {
      console.error("Error saving attendance:", error);
      showToast(t("errors.failed_save_attendance"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenBulkModal = () => {
    const initialBulk: Record<string, AttendanceStatus> = {};
    userOptions.forEach(user => initialBulk[user.userId] = "PRESENT");
    setBulkAttendance(initialBulk);
    setBulkDate(new Date().toISOString().slice(0, 10));
    setBulkSearchQuery("");
    setIsBulkModalOpen(true);
  };

  const handleMarkAllPresent = () => {
    const newBulk: Record<string, AttendanceStatus> = {};
    userOptions.forEach(user => newBulk[user.userId] = "PRESENT");
    setBulkAttendance(newBulk);
  };

  const handleSubmitBulk = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast(t("errors.token_not_found"), "error");
      return;
    }

    try {
      setIsSubmittingBulk(true);
      const promises = Object.entries(bulkAttendance).map(([userId, userStatus]) => 
        fetch(`${API_BASE}/attendance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            date: bulkDate,
            status: userStatus,
          }),
        }).then(async (res) => {
          if (!res.ok && res.status !== 409) {
            throw new Error(`Failed to save for user ${userId}`);
          }
          return res;
        })
      );
      await Promise.all(promises);
      
      showToast(t("toasts.attendance_added", "Attendance successfully saved"));
      setIsBulkModalOpen(false);
      if (selectedUserId) {
        await fetchAttendanceRecords(selectedUserId);
      }
    } catch (error) {
      console.error("Error saving bulk attendance:", error);
      showToast(t("errors.failed_save_attendance"), "error");
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{t("attendance.title")}</h1>
        <p className="text-sm text-zinc-500">
          {t("attendance.desc")}
        </p>
      </header>

      {pageError && (
        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 px-5 py-4 text-sm text-red-300">
          {pageError}
        </div>
      )}

      {/* Top: Info panels */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
        {/* Attendance Stats */}
        <section className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-lg font-semibold text-zinc-100">{t("attendance.history")}</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {selectedUser
                ? t("attendance.showing_attendance_for", { name: selectedUser.fullName || selectedUser.username })
                : t("attendance.select_user_review")}
            </p>
          </div>

          {/* User Selector */}
          <div className="space-y-2 mb-6">
            <label htmlFor="attendance-user-info" className="text-sm font-medium text-zinc-300">
              {t("attendance.active_user")}
            </label>
            <select
              id="attendance-user-info"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              disabled={isLoadingUsers}
              className={inputClassName}
            >
              <option value="" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                {isLoadingUsers ? t("attendance.loading_users") : t("attendance.select_a_user")}
              </option>
              {userOptions.map((user) => (
                <option key={user.userId} value={user.userId} className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  {user.username} - {user.fullName || "N/A"}
                </option>
              ))}
            </select>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/70 mb-2">Hadir</p>
              <p className="text-2xl font-bold text-emerald-400">
                {attendanceRecords.filter(r => r.status === "PRESENT").length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 px-4 py-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500/70 mb-2">Terlambat</p>
              <p className="text-2xl font-bold text-amber-400">
                {attendanceRecords.filter(r => r.status === "LATE").length}
              </p>
            </div>
            <div className="rounded-2xl border border-red-500/10 bg-red-500/5 px-4 py-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-red-500/70 mb-2">Tidak Hadir</p>
              <p className="text-2xl font-bold text-red-400">
                {attendanceRecords.filter(r => r.status === "ABSENT").length}
              </p>
            </div>
          </div>
        </section>

        {/* X1 Logic Panel */}
        <aside className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-lg font-semibold text-zinc-100">{t("attendance.x1_logic")}</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {t("attendance.x1_logic_desc")}
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("attendance.attendance_points")}</p>
              <div className="mt-3 space-y-2 text-sm text-zinc-300">
                <p>{t("attendance.present_1")}</p>
                <p>{t("attendance.late_05")}</p>
                <p>{t("attendance.absent_0")}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("attendance.x1_formula")}</p>
              <p className="mt-2 text-sm leading-7 text-zinc-300">
                {t("attendance.x1_formula_value")}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#09090b] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("attendance.selected_user_x1")}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {selectedUserId
                  ? `${attendanceSummary.attendancePercentage.toFixed(1)}%`
                  : "N/A"}
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {t("attendance.attendance_built_from", { records: attendanceSummary.totalAttendanceRecords, points: attendanceSummary.attendancePoints.toFixed(1) })}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Riwayat Kehadiran section — with "Input Kehadiran" button in header */}
      <section className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-100">{t("attendance.history")}</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {selectedUser
                ? t("attendance.showing_attendance_for", { name: selectedUser.fullName || selectedUser.username })
                : t("attendance.select_user_review")}
            </p>
          </div>

          {!isReadOnly && (
            <button
              type="button"
              onClick={handleOpenBulkModal}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(14,165,233,0.25)] transition-all hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] hover:from-blue-500 hover:to-cyan-400 hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              {t("attendance.attendance_input")}
            </button>
          )}
        </div>

        {/* Inline edit form — only visible when editing a record */}
        {editingAttendanceId && !isReadOnly && (
          <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
            <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-widest">{t("attendance.update_attendance")}</p>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-all hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
              >
                {t("attendance.cancel_edit")}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
              <label htmlFor="edit-attendance-date" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("attendance.date")}</label>
                <input
                  id="edit-attendance-date"
                  type="date"
                  value={attendanceDate}
                  onChange={(event) => setAttendanceDate(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-attendance-status" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("attendance.status")}</label>
                <select
                  id="edit-attendance-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as AttendanceStatus)}
                  className={inputClassName}
                >
                  <option value="PRESENT" className="bg-[#09090b]">{t("attendance.present")}</option>
                  <option value="LATE" className="bg-[#09090b]">{t("attendance.late")}</option>
                  <option value="ABSENT" className="bg-[#09090b]">{t("attendance.absent")}</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitAttendance}
                disabled={isSubmitting || !selectedUserId || !attendanceDate}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(14,165,233,0.3)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] hover:from-blue-500 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("attendance.saving_changes") : t("attendance.save_changes")}
              </button>
            </div>
          </div>
        )}

        {selectedUserId ? (
          isLoadingAttendance ? (
            <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#09090b] p-6">
              <div className="space-y-4">
                <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5"></div>
                <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5 delay-75"></div>
                <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5 delay-150"></div>
                <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5 delay-200"></div>
                <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5 delay-300"></div>
              </div>
            </div>
          ) : attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("attendance.col_user")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("attendance.date")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("attendance.status")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("attendance.col_point")}</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 text-right">{t("attendance.col_actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attendanceRecords.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-white/[0.01]">
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-zinc-200">
                        {selectedUser?.fullName || selectedUser?.username || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                        {record.date || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                        {record.status || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-400">
                        {getAttendancePoint(record.status).toFixed(
                          Number.isInteger(getAttendancePoint(record.status)) ? 0 : 1,
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        {!isReadOnly ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditAttendance(record)}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.04]"
                            >
                              <Pencil size={14} />
                              {t("attendance.btn_edit")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttendanceToDelete(record)}
                              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-red-300 transition-all hover:border-red-500/30 hover:bg-red-500/15"
                            >
                              <Trash2 size={14} />
                              {t("attendance.btn_delete")}
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-zinc-500">{t("attendance.badge_readonly")}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-6 py-8 text-center">
              <p className="text-sm font-medium text-zinc-200">{t("attendance.no_records")}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {t("attendance.no_records_desc")}
              </p>
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-white/5 bg-[#09090b] px-6 py-8 text-center">
            <p className="text-sm font-medium text-zinc-200">{t("attendance.no_user")}</p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              {t("attendance.no_user_desc")}
            </p>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal — AWS-style: requires typing "confirm" */}
      {attendanceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#09090b] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

            {/* Header danger strip */}
            <div className="border-b border-red-500/20 bg-red-500/5 px-6 py-4 flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Konfirmasi Penghapusan</h3>
                <p className="text-xs text-red-500/80 font-medium mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Data absensi berikut akan dihapus secara <span className="font-semibold text-red-500">permanen</span> dan tidak dapat dipulihkan kembali.
              </p>

              {/* Record info */}
              <div className="rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02] px-4 py-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400">Tanggal</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">{attendanceToDelete.date || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400">Status</p>
                  <p className={`mt-0.5 text-sm font-semibold ${
                    attendanceToDelete.status === "PRESENT" ? "text-emerald-600 dark:text-emerald-400"
                    : attendanceToDelete.status === "LATE" ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
                  }`}>
                    {attendanceToDelete.status === "PRESENT" ? "Hadir" : attendanceToDelete.status === "LATE" ? "Terlambat" : "Tidak Hadir"}
                  </p>
                </div>
              </div>

              {/* Confirm input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ketik{" "}
                  <code className="font-mono font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded text-xs">
                    confirm
                  </code>{" "}
                  untuk melanjutkan penghapusan
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && deleteConfirmText === "confirm") {
                      void handleDeleteAttendance(attendanceToDelete.id);
                      setAttendanceToDelete(null);
                      setDeleteConfirmText("");
                    }
                  }}
                  placeholder="Ketik confirm di sini..."
                  autoFocus
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 transition-all bg-white dark:bg-white/[0.02] ${
                    deleteConfirmText === "confirm"
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-zinc-200 dark:border-white/10 focus:ring-zinc-500/20"
                  }`}
                />
                {deleteConfirmText.length > 0 && deleteConfirmText !== "confirm" && (
                  <p className="text-xs text-zinc-500">
                    Masukkan kata <span className="font-mono text-red-500">confirm</span> dengan benar untuk mengaktifkan tombol hapus.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-100 dark:border-white/10 px-6 py-4 flex justify-end gap-3 bg-zinc-50/50 dark:bg-white/[0.01]">
              <button
                type="button"
                onClick={() => { setAttendanceToDelete(null); setDeleteConfirmText(""); }}
                className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-all hover:bg-zinc-100 dark:hover:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "confirm"}
                onClick={() => {
                  void handleDeleteAttendance(attendanceToDelete.id);
                  setAttendanceToDelete(null);
                  setDeleteConfirmText("");
                }}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-500"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Bulk Attendance Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#09090b] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/10 p-6 md:p-8">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Input Kehadiran</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Isi absensi untuk semua siswa sekaligus secara cepat.</p>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-white/10 space-y-5 bg-zinc-50/50 dark:bg-white/[0.01]">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Tanggal</label>
                  <input
                    type="date"
                    value={bulkDate}
                    onChange={(e) => setBulkDate(e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Cari Siswa</label>
                  <input
                    type="text"
                    placeholder="Ketik nama siswa..."
                    value={bulkSearchQuery}
                    onChange={(e) => setBulkSearchQuery(e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleMarkAllPresent}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50"
                >
                  Tandai Semua Hadir
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-3">
              {userOptions
                .filter((user) => 
                  user.fullName?.toLowerCase().includes(bulkSearchQuery.toLowerCase()) || 
                  user.username.toLowerCase().includes(bulkSearchQuery.toLowerCase())
                )
                .map((user) => (
                <div key={user.userId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors p-4 md:px-6">
                  <div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{user.fullName || user.username}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">{user.username}</p>
                  </div>
                  <div className="flex rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-200/60 dark:bg-white/[0.06] overflow-hidden p-1 gap-1">
                    {(["PRESENT", "LATE", "ABSENT"] as AttendanceStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => setBulkAttendance(prev => ({ ...prev, [user.userId]: st }))}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                          bulkAttendance[user.userId] === st
                            ? st === "PRESENT" ? "bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400 shadow-sm" 
                              : st === "LATE" ? "bg-amber-500 text-white dark:bg-amber-500/20 dark:text-amber-400 shadow-sm" 
                              : "bg-red-500 text-white dark:bg-red-500/20 dark:text-red-400 shadow-sm"
                            : "text-zinc-500 dark:text-zinc-500 hover:bg-zinc-300/60 dark:hover:bg-white/5 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                      >
                        {st === "PRESENT" ? "Hadir" : st === "LATE" ? "Terlambat" : "Tidak Hadir"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {userOptions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tidak ada siswa</p>
                  <p className="text-sm text-zinc-500 mt-1">Daftar siswa kosong atau tidak ditemukan.</p>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-100 dark:border-white/10 p-6 md:p-8 flex justify-end gap-3 bg-zinc-50/50 dark:bg-white/[0.01]">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-all hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitBulk}
                disabled={isSubmittingBulk || userOptions.length === 0}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(14,165,233,0.3)] transition-all hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingBulk ? "Menyimpan..." : "Simpan Kehadiran"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-8 right-8 flex items-center gap-3 bg-white dark:bg-[#09090b] border border-zinc-200/80 dark:border-white/[0.08] shadow-2xl backdrop-blur-3xl rounded-xl px-5 py-4 z-50 animate-in slide-in-from-bottom-6 fade-in duration-300">
          {toast.tone === "success" ? (
            <CheckCircle2 className="text-emerald-500" size={20} />
          ) : (
            <AlertCircle className="text-red-400" size={20} />
          )}
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
