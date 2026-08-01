"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// === KOMPONEN LOGO "THE PREDICTIVE HIVE" ===
const HiveEduLogo = () => (
  <div className="flex flex-col items-center justify-center gap-5 mb-8 animate-in fade-in zoom-in duration-700">
    {/* SVG Hexagon Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="w-16 h-16 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
    >
      <defs>
        <linearGradient id="hiveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" /> {/* Tailwind blue-500 */}
          <stop offset="100%" stopColor="#8b5cf6" /> {/* Tailwind violet-500 */}
        </linearGradient>
      </defs>

      {/* Hexagon Outline */}
      <polygon
        points="50,10 85,30 85,70 50,90 15,70 15,30"
        fill="none"
        stroke="url(#hiveGradient)"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Upward Trend Line (Y Prediction) */}
      <polyline
        points="30,65 50,50 70,35"
        fill="none"
        stroke="url(#hiveGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3 Nodes (X1, X2, X3) */}
      <circle cx="30" cy="65" r="4.5" fill="#ffffff" className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
      <circle cx="70" cy="35" r="4.5" fill="#ffffff" className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
    </svg>

    {/* Brand Typography */}
    <div className="flex items-baseline tracking-tight select-none">
      <h1 className="text-4xl font-bold text-zinc-100 drop-shadow-md">
        HiveEdu
      </h1>
      <span className="text-4xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500 ml-1.5 drop-shadow-sm">
        Analytics
      </span>
    </div>
  </div>
);

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid username or password");
      }

      const data = await res.json();

      // Store token securely
      if (data.accessToken || data.access_token) {
        const token = data.accessToken || data.access_token;
        localStorage.setItem("token", token);

        // As per the rule, we use 'user' terminology when decoding or managing state
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container relative min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#121214] via-[#0a0a0a] to-[#0a0a0a] overflow-hidden">

      {/* Data Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[120%] -translate-y-[100%] w-72 h-72 bg-blue-600/30 rounded-full blur-[120px] z-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 translate-x-[20%] translate-y-[0%] w-72 h-72 bg-violet-600/30 rounded-full blur-[120px] z-10 pointer-events-none"></div>

      {/* Glassmorphism Login Card */}
      <div className="login-card relative z-20 w-full max-w-md mx-4 sm:mx-0 p-8 sm:p-10 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl">

        {/* === LOGO DISISIPKAN DI SINI === */}
        <HiveEduLogo />

        <div className="mb-8 text-center">
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Enter your credentials to access the platform
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-500 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-zinc-200 placeholder:text-zinc-600 transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-500 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-zinc-200 placeholder:text-zinc-600 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-lg border border-white/10 shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center overflow-hidden"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}