
import { type TeamMember } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Mail, Sparkles, Zap } from "lucide-react";

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
      gradient: "from-emerald-500/20 via-teal-500/10 to-emerald-600/5",
      accentGradient: "from-emerald-400 to-teal-500",
      cardGlow: "shadow-[0_8px_32px_-8px_rgba(16,185,129,0.4)]",
      borderGlow: "shadow-[inset_0_1px_1px_0_rgba(16,185,129,0.2)]",
      avatarGlow: "shadow-[0_0_24px_rgba(16,185,129,0.6)]",
      dot: "bg-emerald-400",
      shimmer: "from-emerald-400/0 via-emerald-400/40 to-emerald-400/0",
      pulse: true,
    },
    Offline: {
      gradient: "from-slate-600/10 via-slate-500/5 to-slate-600/5",
      accentGradient: "from-slate-400 to-slate-500",
      cardGlow: "shadow-[0_4px_16px_-4px_rgba(100,116,139,0.15)]",
      borderGlow: "shadow-[inset_0_1px_1px_0_rgba(100,116,139,0.1)]",
      avatarGlow: "shadow-[0_0_16px_rgba(100,116,139,0.3)]",
      dot: "bg-slate-400",
      shimmer: "from-slate-400/0 via-slate-400/20 to-slate-400/0",
      pulse: false,
    },
    "In Call": {
      gradient: "from-blue-500/20 via-violet-500/15 to-purple-600/10",
      accentGradient: "from-blue-400 via-violet-400 to-purple-500",
      cardGlow: "shadow-[0_8px_32px_-8px_rgba(59,130,246,0.5)]",
      borderGlow: "shadow-[inset_0_1px_1px_0_rgba(59,130,246,0.3)]",
      avatarGlow: "shadow-[0_0_28px_rgba(59,130,246,0.7)]",
      dot: "bg-blue-400",
      shimmer: "from-blue-400/0 via-violet-400/50 to-purple-400/0",
      pulse: true,
    },
  }[member.status];

  return (
    <Card
      className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/80 via-slate-800/40 to-slate-900/80 border border-white/10 transition-all duration-500 ease-out hover:scale-[1.02] hover:border-white/20 ${statusConfig.cardGlow} ${statusConfig.borderGlow} ${
        isCurrentUser ? "ring-2 ring-primary/60 shadow-[0_0_32px_-8px_rgba(var(--primary-rgb),0.5)]" : ""
      }`}
      data-testid={`card-team-member-${member.uid}`}
    >
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-700`} />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* Diagonal shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.shimmer} translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-[100%] group-hover:translate-y-[100%] transition-transform duration-1500 ease-out`} />
      </div>

      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${statusConfig.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative p-6">
        {/* Header with avatar and info */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar section */}
          <div className="relative flex-shrink-0 group/avatar">
            {/* Rotating ring animation */}
            <div className={`absolute -inset-3 rounded-2xl bg-gradient-to-r ${statusConfig.accentGradient} opacity-20 blur-lg group-hover/avatar:opacity-40 transition-opacity duration-500`} />
            <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-r ${statusConfig.accentGradient} opacity-0 group-hover/avatar:opacity-30 group-hover/avatar:animate-spin transition-opacity duration-500`} style={{ animationDuration: '3s' }} />
            
            <div className="relative">
              <div className={`relative rounded-2xl p-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${statusConfig.avatarGlow} transition-all duration-500 group-hover/avatar:scale-110`}>
                <Avatar className="w-20 h-20 rounded-xl border-2 border-white/20" data-testid={`avatar-${member.uid}`}>
                  <AvatarImage src={member.photoURL || undefined} alt={member.name} className="object-cover" />
                  <AvatarFallback className={`bg-gradient-to-br ${statusConfig.accentGradient} text-white font-bold text-xl`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-[3px] border-slate-900 ${statusConfig.dot} shadow-lg transition-transform duration-300 group-hover/avatar:scale-125`}>
                {statusConfig.pulse && (
                  <>
                    <div className={`absolute inset-0 rounded-full ${statusConfig.dot} animate-ping opacity-75`} />
                    <div className={`absolute inset-0 rounded-full ${statusConfig.dot}`} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Info section */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-start gap-2 mb-2">
              <h3
                className="text-xl font-bold text-white truncate tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text"
                data-testid={`text-name-${member.uid}`}
              >
                {member.name}
              </h3>
              {isCurrentUser && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-lg shadow-lg shadow-primary/30 animate-pulse" style={{ animationDuration: '2s' }}>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-bold text-white tracking-wider">YOU</span>
                </div>
              )}
            </div>
            
            <StatusBadge status={member.status} size="sm" />
          </div>
        </div>

        {/* Email section with glassmorphism */}
        <div className="relative overflow-hidden mb-4 group/email">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover/email:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner transition-all duration-300 group-hover/email:border-white/20 group-hover/email:bg-white/10">
            <div className={`p-2.5 bg-gradient-to-br ${statusConfig.accentGradient} rounded-lg shadow-lg`}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <p 
              className="text-sm text-slate-200 truncate font-medium tracking-wide"
              data-testid={`text-email-${member.uid}`}
            >
              {member.email}
            </p>
          </div>
        </div>

        {/* Custom status with enhanced design */}
        {member.customStatus && (
          <div className="relative overflow-hidden group/status">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/status:opacity-100 group-hover/status:translate-x-full transition-all duration-1000" />
            <div className={`relative px-4 py-3.5 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 shadow-inner transition-all duration-300 group-hover/status:border-white/20 group-hover/status:shadow-lg`}>
              <div className="flex items-start gap-2">
                <Zap className={`w-4 h-4 mt-0.5 bg-gradient-to-br ${statusConfig.accentGradient} bg-clip-text text-transparent`} />
                <p
                  className="text-sm text-slate-100 font-medium leading-relaxed tracking-wide"
                  data-testid={`text-custom-status-${member.uid}`}
                >
                  {member.customStatus}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom glow effect */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${statusConfig.accentGradient} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
    </Card>
  );
}
