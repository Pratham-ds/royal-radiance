import { useState, useEffect } from "react";

interface CountdownTimerProps {
  minutes?: number;
}

const CountdownTimer = ({ minutes = 15 }: CountdownTimerProps) => {
  const totalSeconds = minutes * 60;

  const [seconds, setSeconds] = useState(() => {
    const key = `countdown_${minutes}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      const remaining = parseInt(saved) - Math.floor(Date.now() / 1000);
      return remaining > 0 ? remaining : totalSeconds;
    }
    const end = Math.floor(Date.now() / 1000) + totalSeconds;
    sessionStorage.setItem(key, end.toString());
    return totalSeconds;
  });

  useEffect(() => {
    const key = `countdown_${minutes}`;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          const end = Math.floor(Date.now() / 1000) + totalSeconds;
          sessionStorage.setItem(key, end.toString());
          return totalSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [minutes, totalSeconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <span className="bg-muted text-primary font-heading text-lg font-bold w-10 h-10 flex items-center justify-center rounded-sm">
          {String(mins).padStart(2, "0")}
        </span>
        <span className="text-primary font-bold">:</span>
        <span className="bg-muted text-primary font-heading text-lg font-bold w-10 h-10 flex items-center justify-center rounded-sm">
          {String(secs).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Offer Ends</span>
    </div>
  );
};

export default CountdownTimer;
