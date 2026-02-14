import { RefreshCw, X } from "lucide-react";
import { useState, useEffect } from "react";
import { dailyThemes } from "@/lib/diary-data";

interface DailyThemeProps {
  onThemeChange: (theme: string) => void;
}

const DailyTheme = ({ onThemeChange }: DailyThemeProps) => {
  const [theme, setTheme] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [useCustom, setUseCustom] = useState(false);
  const [customTheme, setCustomTheme] = useState("");

  const pickTheme = () => {
    const t = dailyThemes[Math.floor(Math.random() * dailyThemes.length)];
    setTheme(t);
    if (!useCustom) onThemeChange(t);
  };

  useEffect(() => {
    pickTheme();
  }, []);

  const handleRefresh = () => {
    if (useCustom) return;
    setIsRefreshing(true);
    setTimeout(() => {
      pickTheme();
      setIsRefreshing(false);
    }, 400);
  };

  const toggleCustom = () => {
    if (useCustom) {
      setUseCustom(false);
      onThemeChange(theme);
    } else {
      setUseCustom(true);
      onThemeChange(customTheme || "");
    }
  };

  const handleCustomChange = (val: string) => {
    setCustomTheme(val);
    onThemeChange(val);
  };

  const clearTheme = () => {
    onThemeChange("");
    setUseCustom(false);
    setTheme("");
    setCustomTheme("");
  };

  return (
    <div className="rounded-2xl bg-card border-2 border-border px-5 py-4 note-shadow">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[10px] font-body tracking-widest text-muted-foreground flex items-center gap-1 flex-1">
          <span>💭</span> 今日主题
        </p>
        <button
          onClick={toggleCustom}
          className={`text-[10px] font-body px-2.5 py-1 rounded-full gentle-transition ${
            useCustom ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {useCustom ? "用推荐" : "自定义"}
        </button>
        <button
          onClick={clearTheme}
          className="text-[10px] font-body px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:text-foreground gentle-transition"
        >
          无主题
        </button>
      </div>

      {useCustom ? (
        <input
          value={customTheme}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="输入你的主题…"
          className="w-full bg-transparent font-display text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none border-b border-border/50 pb-1"
        />
      ) : (
        <div className="flex items-center gap-2">
          <p className={`font-display text-base text-foreground gentle-transition flex-1 ${isRefreshing ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}>
            {theme ? `「${theme}」` : <span className="text-muted-foreground/50">无主题，自由书写</span>}
          </p>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl hover:bg-muted gentle-transition hover:scale-105"
            aria-label="刷新主题"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyTheme;
