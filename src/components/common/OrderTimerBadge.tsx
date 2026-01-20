import { Clock, AlertCircle } from "lucide-react";
import { useOrderTimer } from "../../hooks/useOrderTimer";

interface OrderTimerBadgeProps {
  createdAt: string;
  status: string;
  slaTime: number;
  compact?: boolean;
}

export function OrderTimerBadge({
  createdAt,
  status,
  slaTime,
  compact = false,
}: OrderTimerBadgeProps) {
  const timer = useOrderTimer(createdAt, slaTime, status);

  // Don't show for completed/cancelled orders
  if (
    status === "completed" ||
    status === "cancelled" ||
    status === "handed_to_rider"
  ) {
    return null;
  }

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1 text-xs ${timer.isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground"}`}
      >
        {timer.isOverdue ? (
          <AlertCircle className="h-3 w-3" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
        <span>{timer.formattedTime}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium ${
        timer.isOverdue
          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
      }`}
    >
      {timer.isOverdue ? (
        <AlertCircle className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      <span>{timer.formattedTime}</span>
      {timer.isOverdue && <span className="font-bold">OVERDUE</span>}
    </div>
  );
}
