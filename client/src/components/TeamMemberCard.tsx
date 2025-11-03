import { type TeamMember } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";

interface TeamMemberCardProps {
  member: TeamMember;
  isCurrentUser?: boolean;
}

export function TeamMemberCard({ member, isCurrentUser = false }: TeamMemberCardProps) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusConfig = {
    Online: {
      ring: "ring-emerald-500/40",
      glow: "shadow-emerald-500/20",
      gradient: "from-emerald-500/10 to-transparent",
    },
    Offline: {
      ring: "ring-gray-500/30",
      glow: "shadow-gray-500/10",
      gradient: "from-gray-500/5 to-transparent",
    },
    "In Call": {
      ring: "ring-blue-500/40",
      glow: "shadow-blue-500/20",
      gradient: "from-blue-500/10 to-transparent",
    },
  }[member.status];

  return (
    <Card
      className={`group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isCurrentUser ? "ring-2 ring-primary/40 shadow-primary/10" : ""
      }`}
      data-testid={`card-team-member-${member.uid}`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative flex items-start gap-4">
        <div className={`relative flex-shrink-0 ring-2 rounded-full transition-all duration-300 ${statusConfig.ring} shadow-lg ${statusConfig.glow} group-hover:scale-110`}>
          <Avatar className="w-14 h-14" data-testid={`avatar-${member.uid}`}>
            <AvatarImage src={member.photoURL || undefined} alt={member.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-base">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className="text-base font-semibold truncate"
              data-testid={`text-name-${member.uid}`}
            >
              {member.name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">(Você)</span>
              )}
            </h3>
          </div>
          <p
            className="text-xs text-muted-foreground truncate"
            data-testid={`text-email-${member.uid}`}
          >
            {member.email}
          </p>
          {member.customStatus && (
            <div className="mt-2 px-2 py-1 bg-muted/50 rounded-md inline-block">
              <p
                className="text-xs text-foreground/90 italic"
                data-testid={`text-custom-status-${member.uid}`}
              >
                💬 {member.customStatus}
              </p>
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <StatusBadge status={member.status} size="sm" />
        </div>
      </div>
    </Card>
  );
}
