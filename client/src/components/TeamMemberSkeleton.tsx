import { Card } from "@/components/ui/card";

export function TeamMemberSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
      </div>
    </Card>
  );
}
