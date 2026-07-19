import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function QivrenLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)} aria-label="QIVREN">
      <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20">
        <div className="absolute inset-[1px] rounded-[15px] bg-slate-950/20" />
        <Sparkles className="relative size-5" aria-hidden="true" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="truncate text-sm font-black tracking-[0.22em] text-slate-900 dark:text-white">QIVREN</div>
          <div className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">Vireqon Intelligence</div>
        </div>
      )}
    </div>
  );
}
