"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

// === LOGO BARU: THE ASCENDANT MONOGRAM (H & A) ===
const HiveEduLogo = () => (
  <div className="flex flex-col items-center justify-center gap-6 mb-8 animate-in fade-in zoom-in duration-700">
    
    {/* LIGHT MODE LOGO - Elegant Glass Monogram */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="w-16 h-16 block dark:hidden transition-transform duration-500 hover:scale-105"
    >
      <defs>
        <linearGradient id="monoH_Light" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" /> {/* blue-600 */}
          <stop offset="100%" stopColor="#1e40af" /> {/* blue-800 */}
        </linearGradient>
        <linearGradient id="monoA_Light" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" /> {/* violet-500 */}
          <stop offset="50%" stopColor="#6366f1" /> {/* indigo-500 */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* cyan-500 */}
        </linearGradient>
        <filter id="shadowLight" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.15" />
        </filter>
        <filter id="shadowPillar" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Left Pillar of H (Bottom Layer) */}
      <rect x="28" y="15" width="10" height="70" rx="5" fill="url(#monoH_Light)" filter="url(#shadowPillar)" />

      {/* The A Chevron (Middle Layer) */}
      <path d="M 16 85 L 50 20 L 84 85" fill="none" stroke="url(#monoA_Light)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadowLight)" />

      {/* Right Pillar of H (Top Layer) */}
      <rect x="62" y="15" width="10" height="70" rx="5" fill="url(#monoH_Light)" filter="url(#shadowLight)" />

      {/* Analytics Apex Data Node */}
      <circle cx="50" cy="20" r="5" fill="#ffffff" filter="url(#shadowLight)" />
      <circle cx="50" cy="20" r="2" fill="#06b6d4" />
    </svg>

    {/* DARK MODE LOGO - Cyber Neon Monogram */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="w-16 h-16 hidden dark:block drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-transform duration-500 hover:scale-105"
    >
      <defs>
        <linearGradient id="monoH_Dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
          <stop offset="100%" stopColor="#1d4ed8" /> {/* blue-700 */}
        </linearGradient>
        <linearGradient id="monoA_Dark" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a78bfa" /> {/* violet-400 */}
          <stop offset="50%" stopColor="#818cf8" /> {/* indigo-400 */}
          <stop offset="100%" stopColor="#22d3ee" /> {/* cyan-400 */}
        </linearGradient>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="shadowDark" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Background soft glow for the A */}
      <path d="M 16 85 L 50 20 L 84 85" fill="none" stroke="url(#monoA_Dark)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlow)" opacity="0.4" />

      {/* Left Pillar of H */}
      <rect x="28" y="15" width="10" height="70" rx="5" fill="url(#monoH_Dark)" />

      {/* The A Chevron */}
      <path d="M 16 85 L 50 20 L 84 85" fill="none" stroke="url(#monoA_Dark)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadowDark)" />

      {/* Right Pillar of H */}
      <rect x="62" y="15" width="10" height="70" rx="5" fill="url(#monoH_Dark)" filter="url(#shadowDark)" />

      {/* Analytics Apex Data Node */}
      <circle cx="50" cy="20" r="5" fill="#22d3ee" filter="url(#neonGlow)" />
      <circle cx="50" cy="20" r="2.5" fill="#ffffff" />
    </svg>

    {/* Brand Typography - Elite SaaS Monogram Style */}
    <div className="flex flex-col items-center select-none">
      <div className="flex items-baseline">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 drop-shadow-sm transition-colors duration-300 tracking-tight">
          Hive
        </h1>
        <h1 className="text-4xl font-light text-zinc-600 dark:text-zinc-300 drop-shadow-sm transition-colors duration-300 tracking-tight ml-0.5">
          Edu
        </h1>
      </div>
      <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 uppercase tracking-[0.3em] mt-1 transition-colors duration-300">
        Analytics
      </span>
    </div>
  </div>
);

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      if (data.accessToken || data.access_token) {
        const token = data.accessToken || data.access_token;
        localStorage.setItem("token", token);

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
    <div className="login-container relative min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300">

      {/* Animated Quantum Wave (3D Ribbon) Background - REFINED FOR LIGHT MODE */}
      <style>{`
        @keyframes wave-spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes wave-spin-reverse {
          0% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
      `}</style>
      
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500">
        
        {/* Subtle background glow from the top */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-blue-500/10 dark:bg-blue-600/10 rounded-[100%] blur-[120px]"></div>

        {/* The Quantum Waves (Giant wobbly rotating blobs placed below the screen) */}
        {/* By placing them far down, only their top crests are visible, creating a smooth fluid horizon line */}
        <div className="absolute bottom-[-150vw] sm:bottom-[-90vw] left-1/2 w-[250vw] h-[250vw] sm:w-[150vw] sm:h-[150vw] opacity-90 dark:opacity-80 mix-blend-multiply dark:mix-blend-screen">
          
          {/* Wave 1 - Deep Blue/Cyan Base (Stronger, deeper colors for Light Mode) */}
          <div 
            className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-tr from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-400 opacity-80 dark:opacity-60"
            style={{
              transformOrigin: '48% 50%',
              borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%',
              animation: 'wave-spin 22s linear infinite',
              filter: 'blur(30px)'
            }}
          ></div>
          
          {/* Wave 2 - Indigo/Sky Mid-layer */}
          <div 
            className="absolute top-1/2 left-1/2 w-[95%] h-[95%] bg-gradient-to-tl from-indigo-600 to-sky-400 dark:from-indigo-700 dark:to-sky-400 opacity-80 dark:opacity-60"
            style={{
              transformOrigin: '50% 52%',
              borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%',
              animation: 'wave-spin-reverse 28s linear infinite',
              filter: 'blur(40px)'
            }}
          ></div>

          {/* Wave 3 - Violet/Cyan Core Highlight */}
          <div 
            className="absolute top-1/2 left-1/2 w-[90%] h-[90%] bg-gradient-to-bl from-violet-600 to-cyan-400 dark:from-violet-600 dark:to-cyan-300 opacity-90 dark:opacity-80"
            style={{
              transformOrigin: '52% 48%',
              borderRadius: '40% 60% 55% 45% / 50% 40% 60% 50%',
              animation: 'wave-spin 18s linear infinite',
              filter: 'blur(20px)'
            }}
          ></div>
        </div>

        {/* Minimalist Floating Dust Particles (Darker in Light Mode for contrast) */}
        <div className="absolute top-[20%] left-[20%] w-[4px] h-[4px] bg-blue-500 dark:bg-blue-300 rounded-full blur-[1px] opacity-40 animate-pulse"></div>
        <div className="absolute top-[40%] left-[80%] w-[5px] h-[5px] bg-cyan-600 dark:bg-cyan-200 rounded-full blur-[1px] opacity-50 animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute top-[70%] left-[10%] w-[6px] h-[6px] bg-indigo-600 dark:bg-indigo-300 rounded-full blur-[2px] opacity-60 animate-[pulse_5s_ease-in-out_infinite]"></div>

        {/* Frosted Glass Vignette Mask - THINNED OUT FOR LIGHT MODE TO LET COLORS POP */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/80 dark:from-zinc-950/90 via-transparent to-zinc-50/10 dark:to-zinc-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(250,250,250,0.5)_100%)] dark:bg-[radial-gradient(ellipse_at_top,transparent_10%,rgba(9,9,11,0.9)_100%)]"></div>
      </div>

      {/* Login Card */}
      <div className="login-card relative z-20 w-full max-w-md mx-4 sm:mx-0 p-8 sm:p-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-colors duration-300">

        {/* LOGO */}
        <HiveEduLogo />

        <div className="mb-8 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-wide transition-colors duration-300">
            Enter your credentials to access the platform
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center animate-pulse transition-colors duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2 transition-colors duration-300">
              Username
            </label>
            {/* INPUT FIELD */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all shadow-sm"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2 transition-colors duration-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all shadow-sm"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-4 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 hover:from-blue-500 hover:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 text-white font-bold tracking-wide rounded-xl shadow-[0_8px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_8px_20px_rgba(14,165,233,0.2)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_10px_25px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden"
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