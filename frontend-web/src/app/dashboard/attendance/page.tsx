"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

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
  "w-full rounded-xl bg-[#09090b] border border-white/10 text-zinc-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

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

  const showToast = (message: string, tone: ToastState["tone"] = "success") => {
    setToast({ show: true, message, tone });
    setTimeout(() => {
      setToast({ show: false, message: "", tone: "success" });
    }, 3000);
  };

  const isReadOnly = currentUser?.role === "USER";
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

      if (decoded.role === "USER") {
        const response = await fetch("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch current user.");
        }

        const currentAccount = (await response.json()) as UserOption;
        setUserOptions([currentAccount]);
        setSelectedUserId(currentAccount.id);
        return;
      }

      const response = await fetch("http://localhost:3000/users/role/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const data = (await response.json()) as UserOption[];
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

        return filteredUsers[0]?.id ?? "";
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserOptions([]);
      const message =
        decoded.role === "USER"
          ? "Unable to load your attendance profile right now."
          : "Unable to load user options right now.";
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

      const response = await fetch(`http://localhost:3000/attendance/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch attendance records.");
      }

      const data = (await response.json()) as AttendanceRecord[];
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setAttendanceRecords([]);
      showToast("Unable to load attendance records right now.", "error");
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPageError("Authentication token not found.");
      setIsLoadingUsers(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setCurrentUser(decoded);
      void fetchUsers(decoded);
    } catch (error) {
      console.error("Error decoding token:", error);
      setPageError("Unable to identify the current session.");
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
      const response = await fetch(`http://localhost:3000/attendance/${attendanceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete attendance record.");
      }

      await fetchAttendanceRecords(selectedUserId);
      if (editingAttendanceId === attendanceId) {
        resetForm();
      }
      showToast("Attendance record deleted successfully.");
    } catch (error) {
      console.error("Error deleting attendance:", error);
      showToast("Unable to delete attendance record right now.", "error");
    }
  };

  const handleSubmitAttendance = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Authentication token not found.", "error");
      return;
    }

    if (isReadOnly) {
      showToast("This page is read-only for user accounts.", "error");
      return;
    }

    if (!selectedUserId || !attendanceDate) {
      showToast("Please select a user and date first.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        editingAttendanceId
          ? `http://localhost:3000/attendance/${editingAttendanceId}`
          : "http://localhost:3000/attendance",
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
            "Attendance for this user on this date already exists.",
            "error",
          );
          return;
        }

        throw new Error("Failed to save attendance");
      }

      await fetchAttendanceRecords(selectedUserId);
      resetForm();
      showToast(
        editingAttendanceId
          ? "Attendance record updated successfully."
          : "Attendance record saved successfully.",
      );
    } catch (error) {
      console.error("Error saving attendance:", error);
      showToast("Unable to save attendance right now.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Attendance Tracking</h1>
        <p className="text-sm text-zinc-500">
          Record daily attendance events for each user and feed real participation data into the X1 attendance engine.
        </p>
      </header>

      {pageError && (
        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 px-5 py-4 text-sm text-red-300">
          {pageError}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
        <section className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-zinc-100">
                {editingAttendanceId ? "Update Attendance" : "Attendance Input"}
              </h2>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Daily attendance signal entry
              </p>
            </div>

            {editingAttendanceId && !isReadOnly && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.04]"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="attendance-date" className="text-sm font-medium text-zinc-300">
                Date
              </label>
              <input
                id="attendance-date"
                type="date"
                value={attendanceDate}
                onChange={(event) => setAttendanceDate(event.target.value)}
                disabled={isReadOnly}
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="attendance-status" className="text-sm font-medium text-zinc-300">
                Status
              </label>
              <select
                id="attendance-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as AttendanceStatus)}
                disabled={isReadOnly}
                className={inputClassName}
              >
                <option value="PRESENT" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  PRESENT
                </option>
                <option value="LATE" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  LATE
                </option>
                <option value="ABSENT" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  ABSENT
                </option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="attendance-user" className="text-sm font-medium text-zinc-300">
                Active User
              </label>
              <select
                id="attendance-user"
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                disabled={isLoadingUsers || isReadOnly}
                className={inputClassName}
              >
                <option value="" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  {isLoadingUsers ? "Loading users..." : "Select a user"}
                </option>
                {userOptions.map((user) => (
                  <option key={user.userId} value={user.userId} className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                    {user.username} - {user.fullName || "N/A"}
                  </option>
                ))}
              </select>
              {isReadOnly && (
                <p className="text-xs text-zinc-500">
                  User accounts can review attendance here, but create, update, and delete actions are disabled.
                </p>
              )}
            </div>
          </div>

          {!isReadOnly && (
            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitAttendance}
                disabled={isSubmitting || !selectedUserId || !attendanceDate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold text-white shadow-lg hover:from-blue-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? editingAttendanceId
                    ? "Saving Changes..."
                    : "Saving Attendance..."
                  : editingAttendanceId
                    ? "Save Changes"
                    : "Save Attendance"}
              </button>
            </div>
          )}
        </section>

        <aside className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-lg font-semibold text-zinc-100">X1 Attendance Logic</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Attendance-driven MLR input
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Attendance Points</p>
              <div className="mt-3 space-y-2 text-sm text-zinc-300">
                <p>PRESENT = 1</p>
                <p>LATE = 0.5</p>
                <p>ABSENT = 0</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">X1 Formula</p>
              <p className="mt-2 text-sm leading-7 text-zinc-300">
                Attendance points / attendance records * 100
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#09090b] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Selected User X1</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {selectedUserId
                  ? `${attendanceSummary.attendancePercentage.toFixed(1)}%`
                  : "N/A"}
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                Built from {attendanceSummary.totalAttendanceRecords} attendance records and {attendanceSummary.attendancePoints.toFixed(1)} attendance points.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-lg font-semibold text-zinc-100">Attendance History</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {selectedUser
              ? `Showing attendance records for ${selectedUser.fullName || selectedUser.username}`
              : "Select a user to review attendance history"}
          </p>
        </div>

        {selectedUserId ? (
          isLoadingAttendance ? (
            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-6 py-8 text-center text-sm text-zinc-400">
              Loading attendance history...
            </div>
          ) : attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">User Name</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Date</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Status</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Attendance Point</th>
                    <th className="whitespace-nowrap border-b border-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attendanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-white/[0.01]">
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
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteAttendance(record.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-red-300 transition-all hover:border-red-500/30 hover:bg-red-500/15"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-zinc-500">Read-only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-[#09090b] px-6 py-8 text-center">
              <p className="text-sm font-medium text-zinc-200">No attendance records found yet.</p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                Save the first attendance record to start building the user&apos;s X1 history.
              </p>
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-white/5 bg-[#09090b] px-6 py-8 text-center">
            <p className="text-sm font-medium text-zinc-200">No user selected.</p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Select a user first to review attendance history and attendance percentage.
            </p>
          </div>
        )}
      </section>

      {toast.show && (
        <div className="fixed bottom-8 right-8 flex items-center gap-3 bg-[#09090b] border border-white/[0.08] shadow-2xl backdrop-blur-3xl rounded-xl px-5 py-4 z-50 animate-in slide-in-from-bottom-6 fade-in duration-300">
          {toast.tone === "success" ? (
            <CheckCircle2 className="text-emerald-500" size={20} />
          ) : (
            <AlertCircle className="text-red-400" size={20} />
          )}
          <span className="text-sm font-medium text-zinc-200">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
