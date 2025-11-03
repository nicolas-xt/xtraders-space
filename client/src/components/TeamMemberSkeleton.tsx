import { Card } from "@/components/ui/card";

export function TeamMemberSkeleton() {
  return (
    <Card className="backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border-2 border-slate-700/40 p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-700/50 animate-pulse" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-slate-700/50 rounded animate-pulse w-2/3" />
          <div className="h-5 w-16 bg-slate-700/50 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="h-9 bg-slate-700/30 rounded-lg animate-pulse mb-3" />
    </Card>
  );
}
