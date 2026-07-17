"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface UserProfile {
  id: string;
  fullName?: string | null;
  username?: string | null;
  role?: string | null;
  isActive?: boolean;
  assignedTutorId?: string | null;
  assignedTutor?: {
    id: string;
    fullName?: string | null;
    username?: string | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ToastState {
  show: boolean;
  message: string;
  tone: "success" | "error";
}

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    const fetchCurrentUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoadingProfile(false);
        setErrorMessage("Authentication token not found.");
        return;
      }

      try {
        setIsLoadingProfile(true);
        setErrorMessage("");

        const response = await fetch("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch current user profile");
        }

        const currentProfile = (await response.json()) as UserProfile;

        setProfile(currentProfile);
        setFullName(currentProfile.fullName ?? "");
        setUsername(currentProfile.username ?? "");
      } catch (error) {
        console.error("Error fetching current user profile:", error);
        setErrorMessage("Unable to load your profile right now.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void fetchCurrentUserProfile();
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showToast("Password confirmation does not match.", "error");
      return;
    }

    try {
      setIsSaving(true);

      const payload: {
        fullName: string;
        username: string;
        password?: string;
      } = {
        fullName,
        username,
      };

      if (newPassword) {
        payload.password = newPassword;
      }

      const response = await fetch("http://localhost:3000/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update current user profile");
      }

      const updatedProfile = (await response.json()) as UserProfile;

      setProfile(updatedProfile);
      setFullName(updatedProfile.fullName ?? "");
      setUsername(updatedProfile.username ?? "");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      showToast("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating current user profile:", error);
      showToast("Unable to update your profile right now.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500">
          Manage account identity, access credentials, and secure profile preferences.
        </p>
      </div>

      <div className="max-w-4xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-lg font-semibold text-zinc-100">Profile Management</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Update personal account information
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Role</p>
            <p className="mt-3 text-lg font-semibold text-zinc-100">
              {profile?.role ?? "N/A"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Status</p>
            <p className="mt-3 text-lg font-semibold text-zinc-100">
              {typeof profile?.isActive === "boolean"
                ? profile.isActive
                  ? "Active"
                  : "Inactive"
                : "N/A"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Assigned Tutor</p>
            <p className="mt-3 text-lg font-semibold text-zinc-100">
              {profile?.assignedTutor?.fullName ||
                profile?.assignedTutor?.username ||
                profile?.assignedTutorId ||
                "N/A"}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 inline-flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="full-name" className="text-sm font-medium text-zinc-300">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              disabled={isLoadingProfile}
              className="w-full rounded-xl bg-[#09090b] border border-white/10 text-zinc-100 px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-zinc-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isLoadingProfile}
              className="w-full rounded-xl bg-[#09090b] border border-white/10 text-zinc-100 px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium text-zinc-300">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              disabled={isLoadingProfile}
              className="w-full rounded-xl bg-[#09090b] border border-white/10 text-zinc-100 px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-zinc-300">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isLoadingProfile}
              className="w-full rounded-xl bg-[#09090b] border border-white/10 text-zinc-100 px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || isLoadingProfile}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold text-white shadow-lg hover:from-blue-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingProfile ? "Loading..." : isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

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
