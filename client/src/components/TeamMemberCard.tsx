import { type TeamMember } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Phone, Mail } from "lucide-react";

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
      ring: "ring-emerald-500/50",
      glow: "shadow-emerald-500/30",
      gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      border: "border-emerald-500/20",
    },
    Offline: {
      ring: "ring-gray-500/30",
      glow: "shadow-gray-500/10",
      gradient: "from-gray-500/8 via-gray-500/3 to-transparent",
      border: "border-gray-500/10",
    },
    "In Call": {
      ring: "ring-blue-500/50",
      glow: "shadow-blue-500/30",
      gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
      border: "border-blue-500/20",
    },
  }[member.status];

  return (
    <Card
      className={`group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 ${statusConfig.border} ${
        isCurrentUser ? "ring-2 ring-primary/50 shadow-primary/20" : ""
      }`}
      data-testid={`card-team-member-${member.uid}`}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Subtle mesh pattern */}
      <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      <div className="relative flex flex-col gap-4">
        {/* Header with avatar and status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative flex-shrink-0 ring-4 rounded-full transition-all duration-300 ${statusConfig.ring} shadow-2xl ${statusConfig.glow} group-hover:scale-110 group-hover:ring-offset-2 ring-offset-background`}>
              <Avatar className="w-20 h-20 border-2 border-background" data-testid={`avatar-${member.uid}`}>
                <AvatarImage src={member.photoURL || undefined} alt={member.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {/* Status indicator dot */}
              <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-background transition-all duration-300 ${
                member.status === "Online" ? "bg-emerald-500 animate-pulse" : 
                member.status === "In Call" ? "bg-blue-500 animate-pulse" : 
                "bg-gray-400"
              }`} />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="text-lg font-bold truncate mb-1 group-hover:text-primary transition-colors"
                data-testid={`text-name-${member.uid}`}
              >
                {member.name}
                {isCurrentUser && (
                  <span className="ml-2 text-xs text-muted-foreground font-normal bg-primary/10 px-2 py-0.5 rounded-full">(Você)</span>
                )}
              </h3>
            </div>
          </div>

          <StatusBadge status={member.status} size="md" />
        </div>

        {/* Contact info */}
        <div className="space-y-2 pl-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <p className="truncate" data-testid={`text-email-${member.uid}`}>
              {member.email}
            </p>
          </div>
        </div>

        {/* Custom status */}
        {member.customStatus && (
          <div className="mt-2 px-3 py-2 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg border border-border/50">
            <p
              className="text-sm text-foreground font-medium italic"
              data-testid={`text-custom-status-${member.uid}`}
            >
              💬 {member.customStatus}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
