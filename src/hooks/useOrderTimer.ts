import { useEffect, useState, useMemo } from "react";

interface TimeElapsed {
  minutes: number;
  seconds: number;
  totalMinutes: number;
  isOverdue: boolean;
  formattedTime: string;
}

export const useOrderTimer = (
  createdAt: string,
  slaTime: number = 20, // Default SLA: 20 minutes for quick commerce
  status: string,
): TimeElapsed => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Don't run timer for completed or cancelled orders
    if (
      status === "completed" ||
      status === "cancelled" ||
      status === "handed_to_rider"
    ) {
      return;
    }

    // Update tick every second
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Calculate elapsed time based on tick
  const elapsed = useMemo(() => {
    const now = new Date().getTime();
    const orderTime = new Date(createdAt).getTime();
    const diffMs = now - orderTime;

    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(diffMs / 60000);

    const isOverdue = totalMinutes >= slaTime;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    return {
      minutes,
      seconds,
      totalMinutes,
      isOverdue,
      formattedTime,
    };
  }, [tick, createdAt, slaTime]);

  return elapsed;
};

// Hook to calculate time remaining until SLA breach
export const useOrderSLA = (
  createdAt: string,
  slaTime: number = 20,
): { remaining: number; percentage: number; isBreached: boolean } => {
  const [slaStatus, setSlaStatus] = useState({
    remaining: slaTime,
    percentage: 100,
    isBreached: false,
  });

  useEffect(() => {
    const calculateSLA = () => {
      const now = new Date().getTime();
      const orderTime = new Date(createdAt).getTime();
      const elapsedMs = now - orderTime;
      const elapsedMinutes = elapsedMs / 60000;

      const remaining = Math.max(0, slaTime - elapsedMinutes);
      const percentage = Math.max(
        0,
        Math.min(100, (remaining / slaTime) * 100),
      );
      const isBreached = elapsedMinutes >= slaTime;

      setSlaStatus({
        remaining: Math.round(remaining),
        percentage: Math.round(percentage),
        isBreached,
      });
    };

    calculateSLA();
    const interval = setInterval(calculateSLA, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [createdAt, slaTime]);

  return slaStatus;
};
