import { useState, useEffect } from "react";

const FIFTEEN_MINUTES = 15 * 60;

const CountdownTimer = () => {
  const [seconds, setSeconds] = useState(() => {
    const saved = sessionStorage.getItem("countdown");
    if (saved) {
      const remaining = parseInt(saved) - Math.floor(Date.now() / 1000);
      return remaining > 0 ? remaining : FIFTEEN_MINUTES;
    }
    const end = Math.floor(Date.now() / 1000) + FIFTEEN_MINUTES;
    sessionStorage.setItem("countdown", end.toString());
    return FIFTEEN_MINUTES;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          const end = Math.floor(Date.now() / 1000) + FIFTEEN_MINUTES;
          sessionStorage.setItem("countdown", end.toString());
          return FIFTEEN_MINUTES;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">
        Offer Ends
      </span>
    </div>
  );
};

export default CountdownTimer;
