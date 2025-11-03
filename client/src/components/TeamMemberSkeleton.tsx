
import { Card } from "@/components/ui/card";

export function TeamMemberSkeleton() {
  return (
    <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/80 via-slate-800/40 to-slate-900/80 border border-white/10 p-6">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600/10 via-slate-500/5 to-slate-600/5 animate-pulse" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      
      <div className="relative">
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar skeleton */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 animate-pulse shadow-lg" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-600/50 animate-pulse border-[3px] border-slate-900" />
          </div>
          
          {/* Info skeleton */}
          <div className="flex-1 pt-1 space-y-3">
            <div className="h-6 bg-gradient-to-r from-slate-700/60 to-slate-700/40 rounded-lg animate-pulse w-3/4" />
            <div className="h-6 w-24 bg-gradient-to-r from-slate-700/60 to-slate-700/40 rounded-lg animate-pulse" />
          </div>
        </div>
        
        {/* Email skeleton */}
        <div className="h-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 animate-pulse mb-4" />
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
    </Card>
  );
}
