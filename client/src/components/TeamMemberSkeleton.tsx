import { Card } from "@/components/ui/card";

export function TeamMemberSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border p-5">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar skeleton */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-muted animate-pulse border border-border" />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-muted/60 animate-pulse border-2 border-card" />
        </div>

        {/* Info skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse w-2/3" />
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Email skeleton */}
      <div className="h-10 bg-muted/50 rounded-lg border border-border/50 animate-pulse mb-3" />
    </Card>
  );
}