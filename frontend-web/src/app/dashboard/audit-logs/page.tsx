"use client";
import { useTranslation } from "react-i18next";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCcw, ShieldCheck, Download, Activity, AlertTriangle, Fingerprint, Database } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "@/lib/api";

interface DecodedToken {
  sub: string;
  username: string;
  role: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  actorId: string | null;
  actorRole: string | null;
  targetType: string | null;
  targetId: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

const blockedMetadataKeys = new Set([
  "password",
  "passwordhash",
  "hash",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
]);

const inputClassName =
  "w-full rounded-xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50";

function sanitizeMetadataValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.slice(0, 10).map((item) => sanitizeMetadataValue(item));
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !blockedMetadataKeys.has(key.toLowerCase()))
      .map(([key, nestedValue]) => [key, sanitizeMetadataValue(nestedValue)]);

    return Object.fromEntries(entries);
  }

  if (typeof value === "string") {
    return value.length > 120 ? `${value.slice(0, 117)}...` : value;
  }

  return value;
}

function buildMetadataPreview(metadata: Record<string, unknown> | null): string {
  if (!metadata) {
    return "N/A";
  }

  const sanitizedMetadata = sanitizeMetadataValue(metadata);
  const serialized = JSON.stringify(sanitizedMetadata, null, 2);

  if (!serialized) {
    return "N/A";
  }

  return serialized.length > 240 ? `${serialized.slice(0, 237)}...` : serialized;
}

export default function AuditLogsPage() {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("");
  const [limitFilter, setLimitFilter] = useState("100");

  const isAdmin = currentUser?.role === "ADMIN";

  const fetchAuditLogs = async (isManualRefresh = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPageError(t("errors.token_not_found"));
      setIsLoading(false);
      return;
    }

    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setPageError("");

      const params = new URLSearchParams();
      if (actionFilter.trim()) {
        params.set("action", actionFilter.trim());
      }
      if (targetTypeFilter.trim()) {
        params.set("targetType", targetTypeFilter.trim());
      }
      if (limitFilter.trim()) {
        params.set("limit", limitFilter.trim());
      }

      const response = await fetch(
        `${API_BASE}/audit-logs${params.toString() ? `?${params.toString()}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(t("errors.failed_fetch_audit"));
      }

      const data = (await response.json().then(r => r.data ?? r)) as AuditLogItem[];
      setAuditLogs(data);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setAuditLogs([]);
      setPageError(t("errors.unable_load_audit"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPageError(t("errors.token_not_found"));
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setCurrentUser(decoded);

      if (decoded.role === "ADMIN") {
        void fetchAuditLogs();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setPageError(t("errors.unable_identify_session"));
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionOptions = useMemo(() => {
    const actions = new Set(auditLogs.map((log) => log.action).filter(Boolean));
    return Array.from(actions).sort();
  }, [auditLogs]);

  const targetTypeOptions = useMemo(() => {
    const targetTypes = new Set(
      auditLogs
        .map((log) => log.targetType)
        .filter((value): value is string => typeof value === "string" && value.length > 0),
    );
    return Array.from(targetTypes).sort();
  }, [auditLogs]);

  const stats = useMemo(() => {
    const total = auditLogs.length;
    const suspicious = auditLogs.filter(
      (log) => log.action?.includes("FAILED") || log.action?.includes("UNAUTHORIZED")
    ).length;
    
    const actionCounts: Record<string, number> = {};
    let topAction = "None";
    let maxCount = 0;
    
    auditLogs.forEach(log => {
      if (log.action) {
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
        if (actionCounts[log.action] > maxCount) {
          maxCount = actionCounts[log.action];
          topAction = log.action;
        }
      }
    });

    return { total, suspicious, topAction };
  }, [auditLogs]);

  const exportToCSV = () => {
    if (auditLogs.length === 0) return;
    
    const headers = ["Timestamp", "Action", "Actor Role", "Actor ID", "Target Type", "Target ID", "Description"];
    const csvContent = [
      headers.join(","),
      ...auditLogs.map(log => {
        return [
          `"${new Date(log.createdAt).toLocaleString()}"`,
          `"${log.action || ""}"`,
          `"${log.actorRole || ""}"`,
          `"${log.actorId || ""}"`,
          `"${log.targetType || ""}"`,
          `"${log.targetId || ""}"`,
          `"${log.description?.replace(/"/g, '""') || ""}"`
        ].join(",");
      })
    ].join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audit-logs-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{t("audit.title")}</h1>
          <p className="text-sm text-zinc-500">
            Review important backend activity for accountability and enterprise traceability.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={exportToCSV}
            disabled={auditLogs.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_8px_20px_rgba(14,165,233,0.2)] transition-all hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] hover:from-blue-500 hover:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Export CSV
          </button>
        )}
      </header>

      {!isAdmin ? (
        <div className="rounded-[2rem] border border-white/[0.04] bg-white/[0.01] px-8 py-10 backdrop-blur-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
            <ShieldCheck size={24} />
          </div>
          <p className="mt-5 text-lg font-semibold text-zinc-100">{t("audit.access_denied")}</p>
          <p className="mt-3 text-sm leading-7 text-zinc-500">
            Audit log review is available to ADMIN accounts only.
          </p>
        </div>
      ) : (
        <>
          {pageError && (
            <div className="rounded-2xl border border-red-500/10 bg-red-500/5 px-5 py-4 text-sm text-red-600 dark:text-red-300">
              {pageError}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-[1.5rem] border border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-white/[0.01] p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Database size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t("audit.total_logs")}</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</p>
              </div>
            </div>
            
            <div className="rounded-[1.5rem] border border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-white/[0.01] p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t("audit.suspicious")}</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.suspicious}</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-white/[0.01] p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t("audit.top_action")}</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate w-32">{stats.topAction}</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-white/[0.01] p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Fingerprint size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t("audit.audit_traces")}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t("audit.secured")}</p>
              </div>
            </div>
          </div>

          <section className="rounded-[2rem] border border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-white/[0.01] p-6 md:p-8 backdrop-blur-3xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <select
                value={actionFilter}
                onChange={(event) => setActionFilter(event.target.value)}
                className={inputClassName}
              >
                <option value="" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  All Actions
                </option>
                {actionOptions.map((action) => (
                  <option key={action} value={action} className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                    {action}
                  </option>
                ))}
              </select>

              <select
                value={targetTypeFilter}
                onChange={(event) => setTargetTypeFilter(event.target.value)}
                className={inputClassName}
              >
                <option value="" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  All Target Types
                </option>
                {targetTypeOptions.map((targetType) => (
                  <option
                    key={targetType}
                    value={targetType}
                    className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100"
                  >
                    {targetType}
                  </option>
                ))}
              </select>

              <select
                value={limitFilter}
                onChange={(event) => setLimitFilter(event.target.value)}
                className={inputClassName}
              >
                <option value="25" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  25 rows
                </option>
                <option value="50" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  50 rows
                </option>
                <option value="100" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  100 rows
                </option>
                <option value="200" className="bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
                  200 rows
                </option>
              </select>

              <button
                type="button"
                onClick={() => void fetchAuditLogs(true)}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02] px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-200 transition-all hover:bg-zinc-100 dark:hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : t("audit.refresh")}
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => void fetchAuditLogs(true)}
                disabled={isRefreshing}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_10px_25px_rgba(14,165,233,0.3)] transition-all hover:from-blue-500 hover:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply Filters
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-white/[0.01] p-6 md:p-8 backdrop-blur-3xl overflow-hidden">
            {isLoading ? (
              <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#09090b] p-6">
                <div className="space-y-4">
                  <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5"></div>
                  <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5 delay-75"></div>
                  <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5 delay-150"></div>
                  <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5 delay-200"></div>
                  <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5 delay-300"></div>
                </div>
              </div>
            ) : auditLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-white/[0.05]">
                  <thead>
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 border-b border-white/[0.05]">
                        Created At
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 border-b border-white/[0.05]">
                        Action
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 border-b border-white/[0.05]">
                        Actor Role
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 border-b border-white/[0.05]">
                        Actor ID
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 border-b border-white/[0.05]">
                        Target Type
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 border-b border-white/[0.05]">
                        Target ID
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 border-b border-white/[0.05]">
                        Description
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 border-b border-white/[0.05]">
                        Metadata Summary
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {auditLogs.map((log, index) => (
                      <tr key={log.id || `audit-log-${index}`} className="align-top hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-200">
                          {log.action || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                          {log.actorRole || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                          {log.actorId || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                          {log.targetType || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                          {log.targetId || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                          {log.description || "N/A"}
                        </td>
                        <td className="px-4 py-4">
                          <pre className="max-w-[320px] overflow-hidden whitespace-pre-wrap break-words rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-[#09090b] px-4 py-3 text-xs leading-6 text-zinc-700 dark:text-zinc-400">
                            {buildMetadataPreview(log.metadata)}
                          </pre>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#09090b] px-6 py-10 text-center">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{t("audit.no_logs")}</p>
                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  Adjust your filters or refresh the feed when new system activity is expected.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
