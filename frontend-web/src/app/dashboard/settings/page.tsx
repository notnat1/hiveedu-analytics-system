"use client";
import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { API_BASE } from "@/lib/api";

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
  isTwoFactorEnabled?: boolean;
}

interface ToastState {
  show: boolean;
  message: string;
  tone: "success" | "error";
}

export default function SettingsPage() {
  const { t } = useTranslation();
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

  // 2FA States
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [isProcessing2FA, setIsProcessing2FA] = useState(false);

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

        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t("errors.failed_fetch_profile"));
        }

        const currentProfile = (await response.json().then(r => r.data ?? r)) as UserProfile;

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

    const handleEnable2FA = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setIsProcessing2FA(true);
      const res = await fetch(`${API_BASE}/auth/2fa/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to generate 2FA");
      const data = await res.json().then(r => r.data ?? r);
      setQrCodeData(data.qrCode);
      showToast("2FA QR Code generated. Please scan it.");
    } catch (err: any) {
      showToast(err.message || "Failed to generate 2FA", "error");
    } finally {
      setIsProcessing2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setIsProcessing2FA(true);
      const res = await fetch(`${API_BASE}/auth/2fa/verify-setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: otpCode })
      });
      if (!res.ok) throw new Error("Invalid 2FA code");
      setProfile(prev => prev ? { ...prev, isTwoFactorEnabled: true } : prev);
      setQrCodeData(null);
      setOtpCode("");
      showToast("2FA enabled successfully.");
    } catch (err: any) {
      showToast(err.message || "Failed to verify 2FA", "error");
    } finally {
      setIsProcessing2FA(false);
    }
  };

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

      const response = await fetch(`${API_BASE}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(t("errors.failed_update_profile"));
      }

      const updatedProfile = (await response.json().then(r => r.data ?? r)) as UserProfile;

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
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-zinc-500">
          {t("settings.desc")}
        </p>
      </div>

      <div className="max-w-4xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-lg font-semibold text-zinc-100">{t("settings.profile_management")}</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {t("settings.profile_desc")}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("settings.role")}</p>
            <p className="mt-3 text-lg font-semibold text-zinc-100">
              {profile?.role === "ADMIN" ? t("users.admin") : profile?.role === "TEACHER" ? t("users.teacher") : profile?.role === "USER" ? t("users.user") : profile?.role ?? "N/A"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("settings.status_label")}</p>
            <p className="mt-3 text-lg font-semibold text-zinc-100">
              {typeof profile?.isActive === "boolean"
                ? profile.isActive
                  ? t("settings.active")
                  : t("settings.inactive")
                : "N/A"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/5 bg-[#09090b] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{t("settings.assigned_tutor_label")}</p>
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
              placeholder={t("settings.placeholder_fullname")}
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
              placeholder={t("settings.placeholder_username")}
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
              placeholder={t("settings.placeholder_new_password")}
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
              placeholder={t("settings.placeholder_confirm_password")}
            />
          </div>
                </div>

        {/* 2FA Section */}
        <div className="mt-12 space-y-2 mb-6">
          <h2 className="text-lg font-semibold text-zinc-100">Two-Factor Authentication</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Secure your account
          </p>
        </div>
        
        <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
          {profile?.isTwoFactorEnabled ? (
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 size={24} />
              <span className="font-medium text-sm">Two-Factor Authentication is active</span>
            </div>
          ) : (
            <div>
              {!qrCodeData ? (
                <button
                  type="button"
                  onClick={handleEnable2FA}
                  disabled={isProcessing2FA}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {isProcessing2FA ? "Generating..." : "Enable 2FA"}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl inline-block">
                    <img src={qrCodeData} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <label className="text-sm text-zinc-400">Enter the 6-digit code from your authenticator app</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        className="flex-1 rounded-xl bg-[#18181b] border border-white/10 text-zinc-100 px-4 py-3 text-center tracking-widest font-mono focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerify2FA}
                        disabled={isProcessing2FA || otpCode.length < 6}
                        className="px-5 py-3 sm:py-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all disabled:opacity-50"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || isLoadingProfile}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_10px_25px_rgba(14,165,233,0.3)] hover:from-blue-500 hover:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingProfile ? "Loading..." : isSaving ? "Saving..." : t("settings.save_changes")}
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
