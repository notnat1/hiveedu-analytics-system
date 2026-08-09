"use client";
import { useTranslation } from "react-i18next";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Edit, Plus, Trash2, X, Search } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "@/lib/api";

type UserRole = "ADMIN" | "TEACHER" | "USER" | "PARENT";
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

interface DecodedToken {
  sub: string;
  username: string;
  role: string;
}

interface UserRecord {
  userId: string;
  fullName?: string;
  username: string;
  role: UserRole;
  isActive?: boolean;
  assignedTutorId?: string | null;
  linkedStudentId?: string | null;
  phone?: string | null;
  createdAt?: string;
}

interface ToastState {
  show: boolean;
  message: string;
  tone: "success" | "error";
}

const inputClassName =
  "w-full rounded-xl bg-white dark:bg-[#09090b] border border-zinc-300 dark:border-white/10 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

export default function UserManagementPage() {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [teachers, setTeachers] = useState<UserRecord[]>([]);
  const [students, setStudents] = useState<UserRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newFullName, setNewFullName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("USER");
  const [newIsActive, setNewIsActive] = useState(true);
  const [newPhone, setNewPhone] = useState("");
  const [assignedTutorId, setAssignedTutorId] = useState<string | null>(null);
  const [linkedStudentId, setLinkedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
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

  const isAdmin = currentUser?.role === "ADMIN";

  const resetFormState = () => {
    setEditingUserId(null);
    setNewFullName("");
    setNewUsername("");
    setNewPassword("");
    setNewRole("USER");
    setNewIsActive(true);
    setNewPhone("");
    setAssignedTutorId(null);
    setLinkedStudentId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormState();
  };

  const openCreateModal = () => {
    if (!isAdmin) {
      return;
    }

    resetFormState();
    setIsModalOpen(true);
  };

  const getSafeIsActive = (user: UserRecord) => user.isActive ?? true;

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPageError(t("errors.token_not_found"));
      setIsLoadingUsers(false);
      return;
    }

    try {
      setIsLoadingUsers(true);
      setPageError("");

      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("errors.failed_fetch_users"));
      }

      const data = (await response.json().then(r => r.data ?? r)) as UserRecord[];
      setUsers(data);
      setTeachers(data.filter((user) => user.role === "TEACHER"));
      setStudents(data.filter((user) => user.role === "USER"));
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setTeachers([]);
      setStudents([]);
      setPageError(t("errors.unable_load_accounts"));
      showToast(t("errors.unable_load_accounts"), "error");
    } finally {
      setIsLoadingUsers(false);
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
    } catch (error) {
      console.error("Error decoding token:", error);
      setPageError(t("errors.unable_identify_session"));
      setIsLoadingUsers(false);
    }

    void fetchUsers();
  }, []);

  const handleEditClick = (user: UserRecord) => {
    if (!isAdmin) {
      return;
    }

    setEditingUserId(user.userId);
    setNewFullName(user.fullName ?? "");
    setNewUsername(user.username);
    setNewRole(user.role);
    setNewIsActive(getSafeIsActive(user));
    setNewPhone(user.phone ?? "");
    setAssignedTutorId(user.assignedTutorId ?? null);
    setLinkedStudentId(user.linkedStudentId ?? null);
    setNewPassword("");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !isAdmin) {
      showToast(t("toasts.admin_manage_users"), "error");
      return;
    }

    const isEditing = Boolean(editingUserId);
    if (!newFullName.trim() || !newUsername.trim()) {
      showToast(t("toasts.fullname_username_required"), "error");
      return;
    }

    if (!isEditing && newPassword.trim().length < 8) {
      showToast(t("toasts.password_min_length"), "error");
      return;
    }

    if (isEditing && newPassword.trim() !== "" && newPassword.trim().length < 8) {
      showToast(t("toasts.updated_password_min_length"), "error");
      return;
    }

    const payload: {
      fullName: string;
      username: string;
      role: UserRole;
      isActive: boolean;
      password?: string;
      phone?: string;
      assignedTutorId?: string | null;
      linkedStudentId?: string | null;
    } = {
      fullName: newFullName.trim(),
      username: newUsername.trim(),
      role: newRole,
      isActive: newIsActive,
      phone: newPhone.trim() || undefined,
      assignedTutorId: newRole === "USER" ? assignedTutorId ?? null : null,
      linkedStudentId: newRole === "PARENT" ? linkedStudentId ?? null : null,
    };

    if (!isEditing || newPassword.trim() !== "") {
      payload.password = newPassword;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        isEditing
          ? `${API_BASE}/users/${editingUserId}`
          : `${API_BASE}/users`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update user." : "Failed to create user.");
      }

      closeModal();
      await fetchUsers();
      showToast(isEditing ? t("toasts.account_updated") : t("toasts.account_created"));
    } catch (error) {
      console.error(isEditing ? t("errors.error_updating_user") : t("errors.error_creating_user"), error);
      showToast(t("toasts.unable_save_account"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token || !isAdmin) {
      showToast(t("toasts.admin_delete_users"), "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("errors.failed_delete_user"));
      }

      await fetchUsers();
      showToast(t("toasts.account_deleted"));
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast(t("toasts.unable_delete_account"), "error");
    }
  };

  const getAssignedTutorName = (user: UserRecord) => {
    if (user.role !== "USER") {
      return "N/A";
    }

    const assignedTutor = teachers.find((teacher) => teacher.userId === user.assignedTutorId);
    return assignedTutor?.fullName || assignedTutor?.username || "N/A";
  };

  const getLinkedStudentName = (user: UserRecord) => {
    if (user.role !== "PARENT") {
      return "N/A";
    }

    const linkedStudent = students.find((student) => student.userId === user.linkedStudentId);
    return linkedStudent?.fullName || linkedStudent?.username || "N/A";
  };

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        normalizedQuery === "" ||
        (user.fullName ?? "").toLowerCase().includes(normalizedQuery) ||
        user.username.toLowerCase().includes(normalizedQuery);
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && getSafeIsActive(user)) ||
        (statusFilter === "INACTIVE" && !getSafeIsActive(user));

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchQuery, statusFilter, users]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-100">{t("users.title")}</h1>
          <p className="text-sm text-zinc-500">
            Manage account roles, active status, and tutor assignment for user accounts.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 hover:from-blue-500 hover:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 rounded-xl shadow-[0_8px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_10px_25px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} />
            {t("users.add_new_account")}
          </button>
        )}
      </div>

      {pageError && (
        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 px-5 py-4 text-sm text-red-300">
          {pageError}
        </div>
      )}

      {!isAdmin && currentUser && (
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] px-5 py-4 text-sm text-zinc-400 backdrop-blur-3xl">
          Account management actions are restricted to ADMIN accounts. You can still review the current account directory here.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t("users.search_placeholder")}
            className={inputClassName}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value as "ALL" | UserRole)}
          className={inputClassName}
        >
          <option value="ALL" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
            {t("users.all_roles")}
          </option>
          <option value="ADMIN" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
            {t("users.admin")}
          </option>
          <option value="TEACHER" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
            {t("users.teacher")}
          </option>
          <option value="USER" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
            {t("users.user")}
          </option>
          <option value="PARENT" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
            {t("users.parent")}
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className={inputClassName}
        >
          <option value="ALL" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
            {t("users.all_statuses")}
          </option>
          <option value="ACTIVE" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
            {t("users.active")}
          </option>
          <option value="INACTIVE" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
            {t("users.inactive")}
          </option>
        </select>
      </div>

      <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl shadow-2xl rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/[0.05]">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.05]">
                  {t("users.full_name")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.05]">
                  {t("users.username")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.05]">
                  {t("users.role")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.05]">
                  Nomor WA
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.05]">
                  {t("users.assigned_tutor_linked_student")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.05]">
                  {t("users.status")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.05]">
                  {t("users.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {isLoadingUsers ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-4 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-white/5" style={{ animationDelay: `${index * 100}ms` }}></div>
                        <div className="h-4 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-white/5" style={{ animationDelay: `${index * 100 + 50}ms` }}></div>
                        <div className="h-4 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-white/5" style={{ animationDelay: `${index * 100 + 100}ms` }}></div>
                        <div className="h-4 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-white/5" style={{ animationDelay: `${index * 100 + 150}ms` }}></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300">
                      {user.fullName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {user.role === "ADMIN" ? t("users.admin") : user.role === "TEACHER" ? t("users.teacher") : user.role === "USER" ? t("users.user") : user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {user.role === "PARENT" ? getLinkedStudentName(user) : getAssignedTutorName(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                          getSafeIsActive(user)
                            ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                      >
                        {getSafeIsActive(user) ? t("users.active") : t("users.inactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-zinc-400 hover:text-blue-400 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => void handleDeleteUser(user.userId)}
                            className="text-zinc-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-500">{t("users.readonly")}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8">
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/[0.01] border border-white/[0.05] shadow-inner backdrop-blur-md">
                      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 ring-1 ring-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <Search className="w-8 h-8 text-cyan-400 opacity-80" />
                      </div>
                      <h3 className="text-lg font-medium text-zinc-200 mb-1">{t("users.no_accounts")}</h3>
                      <p className="text-sm text-zinc-500 max-w-sm">
                        {t("users.no_accounts_desc")}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/[0.05] backdrop-blur-3xl rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {editingUserId ? t("users.edit_account_title") : t("users.add_new_account")}
              </h2>
              <button onClick={closeModal} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("users.full_name")}</label>
                <input
                  type="text"
                  placeholder={t("users.placeholder_fullname")}
                  value={newFullName}
                  onChange={(event) => setNewFullName(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("users.username")}</label>
                <input
                  type="text"
                  placeholder={t("users.placeholder_username")}
                  value={newUsername}
                  onChange={(event) => setNewUsername(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {editingUserId ? t("users.optional_password") : t("users.password_label")}
                </label>
                <input
                  type="password"
                  placeholder={
                    editingUserId
                      ? "Leave blank to keep current password"
                      : t("users.min_8_chars")
                  }
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nomor WhatsApp (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={newPhone}
                  onChange={(event) => setNewPhone(event.target.value.replace(/\D/g, ""))}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("users.role")}</label>
                <select
                  value={newRole}
                  onChange={(event) => {
                    const nextRole = event.target.value as UserRole;
                    setNewRole(nextRole);
                    if (nextRole !== "USER") {
                      setAssignedTutorId(null);
                    }
                    if (nextRole !== "PARENT") {
                      setLinkedStudentId(null);
                    }
                  }}
                  className={inputClassName}
                >
                  <option value="ADMIN" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                    {t("users.admin")}
                  </option>
                  <option value="TEACHER" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                    {t("users.teacher")}
                  </option>
                  <option value="USER" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                    {t("users.user")}
                  </option>
                  <option value="PARENT" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                    {t("users.parent")}
                  </option>
                </select>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.04] bg-zinc-50 dark:bg-[#09090b] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{t("users.active_status")}</p>
                    <p className="text-xs text-zinc-500">
                      {t("users.control_active")}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={newIsActive}
                    onClick={() => setNewIsActive((current) => !current)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all ${
                      newIsActive ? "bg-blue-600" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        newIsActive ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {newRole === "USER" && (
                <div className="space-y-2">
                  <label htmlFor="assigned-tutor" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("users.assign_tutor")}
                  </label>
                  <select
                    id="assigned-tutor"
                    value={assignedTutorId ?? ""}
                    onChange={(event) => setAssignedTutorId(event.target.value || null)}
                    className={inputClassName}
                  >
                    <option value="" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                      {teachers.length > 0 ? t("users.no_tutor_assigned") : t("users.no_teachers_available")}
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.userId}
                        value={teacher.userId}
                        className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100"
                      >
                        {teacher.fullName || teacher.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newRole === "PARENT" && (
                <div className="space-y-2">
                  <label htmlFor="linked-student" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("users.linked_student")}
                  </label>
                  <select
                    id="linked-student"
                    value={linkedStudentId ?? ""}
                    onChange={(event) => setLinkedStudentId(event.target.value || null)}
                    className={inputClassName}
                  >
                    <option value="" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                      {students.length > 0 ? t("users.select_linked_student") : t("users.no_students_available")}
                    </option>
                    {students.map((student) => (
                      <option
                        key={student.userId}
                        value={student.userId}
                        className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100"
                      >
                        {student.fullName || student.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-zinc-200"
              >
                {t("users.cancel")}
              </button>
              <button
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 hover:from-blue-500 hover:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 rounded-xl shadow-[0_8px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_10px_25px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? editingUserId
                    ? t("users.saving_changes")
                    : t("users.creating_account")
                  : editingUserId
                    ? t("users.save_changes_btn")
                    : t("users.create_account_btn")}
              </button>
            </div>
          </div>
        </div>
      )}

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
