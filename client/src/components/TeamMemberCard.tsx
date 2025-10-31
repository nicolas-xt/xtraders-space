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

  const statusRingColor = {
    Online: "ring-emerald-500/50",
    Offline: "ring-gray-500/30",
    "In Call": "ring-blue-500/50",
  }[member.status];

  return (
    <Card
      className={`p-4 transition-all duration-200 hover-elevate active-elevate-2 ${
        isCurrentUser ? "ring-2 ring-primary/30" : ""
      }`}
      data-testid={`card-team-member-${member.uid}`}
    >
      <div className="flex items-start gap-3 relative">
        <div className={`relative flex-shrink-0 ring-2 rounded-full transition-all duration-200 ${statusRingColor}`}>
          <Avatar className="w-12 h-12 transition-transform duration-200" data-testid={`avatar-${member.uid}`}>
            <AvatarImage src={member.photoURL || undefined} alt={member.name} />
            <AvatarFallback className="bg-accent text-accent-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="text-base font-medium truncate transition-colors duration-200"
              data-testid={`text-name-${member.uid}`}
            >
              {member.name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">(You)</span>
              )}
            </h3>
          </div>
          <p
            className="text-xs text-muted-foreground truncate mt-0.5 transition-colors duration-200"
            data-testid={`text-email-${member.uid}`}
          >
            {member.email}
          </p>
        </div>

        <div className="absolute top-0 right-0 transition-all duration-200">
          <StatusBadge status={member.status} size="sm" />
        </div>
      </div>
    </Card>
  );
}
