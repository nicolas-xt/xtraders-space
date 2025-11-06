import { type TeamMember } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Mail, Sparkles, PhoneCall } from "lucide-react";

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
      color: "bg-emerald-500",
      border: "border-emerald-500/20",
    },
    Offline: {
      color: "bg-slate-400",
      border: "border-slate-400/20",
    },
    "In Call": {
      color: "bg-blue-500",
      border: "border-blue-500/20",
    },
  }[member.status];

  return (
    <Card
      className={`relative overflow-hidden bg-card/50 backdrop-blur-sm border border-border hover:border-border/60 transition-all duration-200 ${
        isCurrentUser ? "ring-1 ring-primary/40" : ""
      }`}
      data-testid={`card-team-member-${member.uid}`}
    >
      <div className="p-5">
        {/* Header com avatar e info */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-14 h-14 border border-border" data-testid={`avatar-${member.uid}`}>
              <AvatarImage src={member.photoURL || undefined} alt={member.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Status indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${statusConfig.color}`} />

            {/* In-call icon overlay */}
            {member.status === "In Call" && (
              <div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border border-card shadow-sm animate-pulse"
                title="Em chamada"
                role="img"
                aria-label="Usuário em chamada"
                data-testid={`in-call-badge-${member.uid}`}
              >
                <PhoneCall className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="text-base font-semibold text-foreground truncate"
                data-testid={`text-name-${member.uid}`}
              >
                {member.name}
              </h3>
              {isCurrentUser && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs font-medium">YOU</span>
                </div>
              )}
            </div>

            <StatusBadge status={member.status} size="sm" />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/50 rounded-lg border border-border/50 mb-3">
          <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p 
            className="text-sm text-muted-foreground truncate"
            data-testid={`text-email-${member.uid}`}
          >
            {member.email}
          </p>
        </div>

        {/* Custom status */}
        {member.customStatus && (
          <div className="px-3 py-2.5 bg-muted/30 rounded-lg border border-border/50">
            <p
              className="text-sm text-foreground/80 leading-relaxed"
              data-testid={`text-custom-status-${member.uid}`}
            >
              {member.customStatus}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}