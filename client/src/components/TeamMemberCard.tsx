
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
      gradient: "from-emerald-400/30 via-teal-400/20 to-emerald-500/10",
      cardBg: "from-slate-900/95 via-emerald-950/30 to-slate-900/95",
      border: "border-emerald-500/40",
      glow: "shadow-[0_0_40px_-12px_rgba(16,185,129,0.4)]",
      ring: "ring-emerald-400/50",
      avatarRing: "ring-emerald-400",
      dot: "bg-emerald-400",
      pulse: true,
    },
    Offline: {
      gradient: "from-slate-600/20 via-slate-500/10 to-slate-600/5",
      cardBg: "from-slate-900/95 via-slate-850/50 to-slate-900/95",
      border: "border-slate-700/50",
      glow: "shadow-[0_0_20px_-8px_rgba(100,116,139,0.2)]",
      ring: "ring-slate-600/40",
      avatarRing: "ring-slate-500",
      dot: "bg-slate-400",
      pulse: false,
    },
    "In Call": {
      gradient: "from-blue-400/30 via-violet-400/20 to-purple-500/10",
      cardBg: "from-slate-900/95 via-blue-950/30 to-slate-900/95",
      border: "border-blue-500/40",
      glow: "shadow-[0_0_40px_-12px_rgba(59,130,246,0.5)]",
      ring: "ring-blue-400/50",
      avatarRing: "ring-blue-400",
      dot: "bg-blue-400",
      pulse: true,
    },
  }[member.status];

  return (
    <Card
      className={`group relative overflow-hidden backdrop-blur-2xl bg-gradient-to-br ${statusConfig.cardBg} border-2 transition-all duration-700 ease-out hover:scale-[1.03] hover:shadow-2xl ${statusConfig.border} ${statusConfig.glow} ${
        isCurrentUser ? "ring-2 ring-primary/70 shadow-primary/40" : ""
      }`}
      data-testid={`card-team-member-${member.uid}`}
    >
      {/* Animated gradient overlay with blur */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-50 group-hover:opacity-90 transition-opacity duration-1000 blur-2xl`}
      />
      
      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700"
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Floating light effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-radial from-white/10 via-white/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-in-out" />
      </div>
      
      <div className="relative p-7">
        {/* Avatar with modern styling */}
        <div className="flex items-center gap-5 mb-5">
          <div className={`relative flex-shrink-0 rounded-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-3`}>
            {/* Glow effect behind avatar */}
            <div className={`absolute -inset-2 rounded-2xl blur-2xl opacity-40 group-hover:opacity-70 transition-all duration-700 ${statusConfig.dot}`} />
            
            {/* Avatar ring */}
            <div className={`relative rounded-2xl p-1 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl ring-4 transition-all duration-700 ${statusConfig.ring}`}>
              <Avatar className="relative w-20 h-20 rounded-xl shadow-2xl" data-testid={`avatar-${member.uid}`}>
                <AvatarImage src={member.photoURL || undefined} alt={member.name} className="object-cover rounded-xl" />
                <AvatarFallback className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white font-bold text-xl rounded-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Status indicator with modern design */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-slate-900 transition-all duration-500 ${statusConfig.dot} shadow-lg`}>
              {statusConfig.pulse && (
                <>
                  <div className={`absolute inset-0 rounded-full ${statusConfig.dot} animate-ping opacity-60`} />
                  <div className={`absolute inset-0 rounded-full ${statusConfig.dot} animate-pulse`} />
                </>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className="text-lg font-bold text-white truncate group-hover:text-white/95 transition-colors duration-300 tracking-tight"
                data-testid={`text-name-${member.uid}`}
              >
                {member.name}
              </h3>
              {isCurrentUser && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-primary/30 to-primary/20 border border-primary/40 rounded-lg backdrop-blur-xl shadow-lg shadow-primary/20">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-primary tracking-wide">YOU</span>
                </div>
              )}
            </div>
            
            <StatusBadge status={member.status} size="sm" />
          </div>
        </div>

        {/* Email with modern card design */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/60 backdrop-blur-xl rounded-xl border border-slate-700/40 mb-4 shadow-inner transition-all duration-300 hover:border-slate-600/60 hover:bg-slate-950/80">
          <div className="p-2 bg-slate-800/60 rounded-lg">
            <Mail className="w-4 h-4 text-slate-300" />
          </div>
          <p 
            className="text-sm text-slate-300 truncate font-medium tracking-wide"
            data-testid={`text-email-${member.uid}`}
          >
            {member.email}
          </p>
        </div>

        {/* Custom status with modern styling */}
        {member.customStatus && (
          <div className="relative overflow-hidden px-4 py-3.5 bg-gradient-to-br from-slate-800/70 via-slate-700/50 to-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-600/40 shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-400/5 to-transparent animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p
              className="relative text-sm text-slate-200 font-medium italic leading-relaxed tracking-wide"
              data-testid={`text-custom-status-${member.uid}`}
            >
              💭 {member.customStatus}
            </p>
          </div>
        )}
      </div>

      {/* Bottom highlight line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
    </Card>
  );
}
