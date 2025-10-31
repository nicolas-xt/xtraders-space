import { type UserStatus } from "@shared/schema";

interface StatusBadgeProps {
  status: UserStatus;
  size?: "sm" | "md";
  showDot?: boolean;
}

export function StatusBadge({ status, size = "sm", showDot = true }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
  };

  const statusConfig = {
    Online: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    Offline: {
      bg: "bg-gray-500/10",
      text: "text-gray-400",
      dot: "bg-gray-400",
    },
    "In Call": {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      dot: "bg-blue-400",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium transition-all duration-200 ${config.bg} ${config.text} ${sizeClasses[size]}`}
      data-testid={`badge-status-${status.toLowerCase().replace(" ", "-")}`}
    >
      {showDot && (
        <span
          className={`w-2 h-2 rounded-full transition-all duration-200 ${config.dot} ${status === "Online" || status === "In Call" ? "animate-pulse" : ""}`}
          data-testid="status-dot"
        />
      )}
      {status}
    </span>
  );
}
