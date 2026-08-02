import { CheckCircle2, ShieldCheck, User } from "lucide-react";

export default async function VerifyPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username || "";
  
  const formattedName = username
    .split(".")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#09090b] shadow-2xl">
        <div className="flex flex-col items-center bg-emerald-500/10 px-8 py-10 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 ring-8 ring-emerald-500/10">
            <ShieldCheck className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Document Verified
          </h1>
          <p className="mt-2 text-sm text-emerald-400">
            This E-Raport is authentic and officially issued by HiveEdu Analytics System.
          </p>
        </div>

        <div className="space-y-4 p-8">
          <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">Student Name</p>
                <p className="font-medium text-zinc-200">{formattedName}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">Status</p>
                <p className="font-medium text-emerald-400">Valid & Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 bg-white/[0.02] p-4 text-center">
          <p className="text-xs text-zinc-500">
            Secure verification provided by HiveEdu Server
          </p>
        </div>
      </div>
    </div>
  );
}
