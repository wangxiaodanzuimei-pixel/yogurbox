import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { dailyThemes } from "@/lib/diary-data";

interface DailyThemeProps {
  onThemeChange: (theme: string) => void;
}

const DailyTheme = ({ onThemeChange }: DailyThemeProps) => {
  const [theme, setTheme] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pickTheme = () => {
    const t = dailyThemes[Math.floor(Math.random() * dailyThemes.length)];
    setTheme(t);
    onThemeChange(t);
  };

  useEffect(() => {
    pickTheme();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      pickTheme();
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="flex items-center gap-3 rounded-lg bg-card px-5 py-4 note-shadow">
      <div className="flex-1">
        <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-1">
          Today's theme
        </p>
        <p className={`font-display text-lg italic text-foreground gentle-transition ${isRefreshing ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}>
          "{theme}"
        </p>
      </div>
      <button
        onClick={handleRefresh}
        className="p-2 rounded-full hover:bg-muted gentle-transition"
        aria-label="Refresh theme"
      >
        <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
};

export default DailyTheme;
