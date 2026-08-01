import Link from "next/link";
import { Home, Hexagon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Quantum Waves (from Login) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center px-4 animate-in fade-in zoom-in-95 duration-700 ease-out">
        {/* Glowing Logo */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <Hexagon size={96} className="relative z-10 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </div>
        
        <h1 className="text-8xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-zinc-200 mb-4 tracking-tight">
          Lost in the Data Hive
        </h2>
        
        <p className="text-zinc-400 mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
          The analytics node you are looking for has been moved, deleted, or never existed in the current simulation.
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl shadow-[0_8px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_15px_40px_rgba(14,165,233,0.5)] transition-all duration-300 hover:-translate-y-1"
        >
          <Home size={18} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
