
import { type TeamMember } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Mail, Sparkles } from "lucide-react";

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
      gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/20",
      ring: "ring-emerald-400/40",
      dot: "bg-emerald-400",
      pulse: true,
    },
    Offline: {
      gradient: "from-slate-500/10 via-slate-400/5 to-transparent",
      border: "border-slate-700/40",
      glow: "shadow-slate-500/5",
      ring: "ring-slate-600/30",
      dot: "bg-slate-500",
      pulse: false,
    },
    "In Call": {
      gradient: "from-blue-500/20 via-purple-500/10 to-transparent",
      border: "border-blue-500/30",
      glow: "shadow-blue-500/25",
      ring: "ring-blue-400/40",
      dot: "bg-blue-400",
      pulse: true,
    },
  }[member.status];

  return (
    <Card
      className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border-2 transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl ${statusConfig.border} ${statusConfig.glow} ${
        isCurrentUser ? "ring-2 ring-primary/60 shadow-primary/30" : ""
      }`}
      data-testid={`card-team-member-${member.uid}`}
    >
      {/* Animated gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-700`}
      />
      
      {/* Mesh pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} 
      />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar with enhanced glow */}
          <div className={`relative flex-shrink-0 rounded-full ring-4 transition-all duration-500 ${statusConfig.ring} group-hover:ring-offset-2 group-hover:ring-offset-slate-900 group-hover:scale-110`}>
            <div className={`absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 ${statusConfig.dot}`} />
            
            <Avatar className="relative w-16 h-16 border-2 border-slate-700/50" data-testid={`avatar-${member.uid}`}>
              <AvatarImage src={member.photoURL || undefined} alt={member.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-slate-200 font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Status indicator with enhanced animation */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-[3px] border-slate-900 transition-all duration-300 ${statusConfig.dot} ${
              statusConfig.pulse ? "animate-pulse" : ""
            }`}>
              {statusConfig.pulse && (
                <div className={`absolute inset-0 rounded-full ${statusConfig.dot} animate-ping opacity-75`} />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="text-base font-semibold text-slate-100 truncate group-hover:text-white transition-colors duration-300"
                data-testid={`text-name-${member.uid}`}
              >
                {member.name}
              </h3>
              {isCurrentUser && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-full">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">You</span>
                </div>
              )}
            </div>
            
            <StatusBadge status={member.status} size="sm" />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/40 backdrop-blur-sm rounded-lg border border-slate-700/30 mb-3">
          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <p 
            className="text-xs text-slate-400 truncate font-mono"
            data-testid={`text-email-${member.uid}`}
          >
            {member.email}
          </p>
        </div>

        {/* Custom status message */}
        {member.customStatus && (
          <div className="relative overflow-hidden px-3 py-2.5 bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/10 to-transparent animate-pulse" />
            <p
              className="relative text-xs text-slate-300 font-medium italic leading-relaxed"
              data-testid={`text-custom-status-${member.uid}`}
            >
              💭 {member.customStatus}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
