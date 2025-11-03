
import { Card } from "@/components/ui/card";

export function TeamMemberSkeleton() {
  return (
    <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-slate-850/50 to-slate-900/95 border-2 border-slate-700/50 p-7 shadow-[0_0_20px_-8px_rgba(100,116,139,0.2)]">
      <div className="flex items-center gap-5 mb-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-slate-700/50 animate-pulse shadow-2xl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-600/50 animate-pulse" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-700/60 rounded-lg animate-pulse w-3/4" />
          <div className="h-6 w-20 bg-slate-700/60 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="h-12 bg-slate-700/40 rounded-xl animate-pulse mb-4" />
    </Card>
  );
}
