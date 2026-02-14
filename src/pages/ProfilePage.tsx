import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Pencil } from "lucide-react";
import { useDiaryStore } from "@/lib/diary-store";
import type { DiaryEntry } from "@/lib/diary-data";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { entries, loadEntry } = useDiaryStore();

  const grouped = entries.reduce<Record<string, DiaryEntry[]>>((acc, entry) => {
    const date = new Date(entry.date);
    const key = date.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const sortedMonths = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleEdit = (entry: DiaryEntry) => {
    loadEntry(entry);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-xl hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-display text-xl flex items-center gap-1.5">📖 我的日记本</h1>
          <p className="text-xs font-body text-muted-foreground">已收集 {entries.length} 条回忆</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <button
          onClick={() => navigate("/library")}
          className="flex-1 py-4 px-4 rounded-2xl bg-card border-2 border-border note-shadow hover:bg-muted hover:scale-[1.02] gentle-transition text-center"
        >
          <span className="text-xl mb-1 block">🎨</span>
          <p className="text-xs font-body text-foreground font-medium">素材库</p>
          <p className="text-[10px] font-body text-muted-foreground mt-0.5">我的画师</p>
        </button>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-display text-base">时间轴</h2>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-card border-2 border-border note-shadow">
            <span className="text-4xl mb-3 block">🌱</span>
            <p className="font-display text-sm text-foreground mb-1">还没有回忆</p>
            <p className="text-xs font-body text-muted-foreground">开始写下你的第一篇日记吧～</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-body gentle-transition hover:scale-105"
            >
              开始写作 ✨
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            {sortedMonths.map((month) => (
              <div key={month} className="mb-6">
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="w-[31px] h-[31px] rounded-full bg-kawaii-pink/20 border-2 border-kawaii-pink/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-body text-primary font-medium">
                      {month.replace(/\d+年/, "").replace("月", "")}
                    </span>
                  </div>
                  <p className="text-xs font-body text-muted-foreground tracking-widest">{month}</p>
                </div>
                <div className="space-y-2 ml-[15px] pl-6 border-l border-transparent">
                  {grouped[month].map((entry) => {
                    const date = new Date(entry.date);
                    const dayStr = date.toLocaleDateString("zh-CN", { weekday: "short", day: "numeric" });
                    return (
                      <div key={entry.id} className="relative rounded-2xl bg-card border-2 border-border p-4 note-shadow hover:note-shadow-hover gentle-transition group">
                        <div className="absolute left-[-27px] top-5 w-2.5 h-2.5 rounded-full bg-kawaii-yellow border-2 border-card" />
                        <div className="flex items-start gap-3">
                          {entry.image && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={entry.image} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[10px] font-body text-muted-foreground tracking-widest">{dayStr}</p>
                              <button
                                onClick={() => handleEdit(entry)}
                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground gentle-transition opacity-0 group-hover:opacity-100"
                                title="编辑"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-body text-foreground leading-relaxed line-clamp-3">{entry.text}</p>
                            {entry.mood && <span className="text-sm mt-1 inline-block">{entry.mood}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
