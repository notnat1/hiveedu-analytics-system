"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-medium login-brand-text tracking-tight">
            HiveEdu <span className="font-normal text-blue-500">Analytics</span>
          </h1>
          <p className="mt-3 text-zinc-500 text-sm">
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
              className="w-full px-4 py-3 bg-transparent border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 text-zinc-200 placeholder:text-zinc-600 transition-all"
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
              className="w-full px-4 py-3 bg-transparent border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 text-zinc-200 placeholder:text-zinc-600 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-lg border border-white/10 shadow-lg shadow-blue-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden"
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
