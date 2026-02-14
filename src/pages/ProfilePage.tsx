import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Pencil, X } from "lucide-react";
import { useDiaryStore } from "@/lib/diary-store";
import CalendarView from "@/components/CalendarView";
import NotePreview from "@/components/NotePreview";
import ExportDialog from "@/components/ExportDialog";
import type { DiaryEntry } from "@/lib/diary-data";
import { useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { entries, loadEntry, savedArtists } = useDiaryStore();
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportEntry, setExportEntry] = useState<DiaryEntry | null>(null);

  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  })();

  const todayEntries = entries.filter((e) => e.date === todayStr);
  const latestEntry = todayEntries[todayEntries.length - 1];

  const handleEdit = (entry: DiaryEntry) => {
    loadEntry(entry);
    navigate("/");
  };

  const handleExport = (entry: DiaryEntry) => {
    setExportEntry(entry);
    setShowExport(true);
  };

  const grouped = entries.reduce<Record<string, DiaryEntry[]>>((acc, entry) => {
    const date = new Date(entry.date);
    const key = date.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const sortedMonths = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-xl hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-display text-xl flex items-center gap-1.5">📖 我的日记本</h1>
          <p className="text-xs font-body text-muted-foreground">已收集 {entries.length} 条回忆</p>
        </div>
      </div>

      {/* Today's note preview */}
      {latestEntry && (
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.05s", animationFillMode: "both" }}>
          <p className="text-[10px] font-body tracking-widest text-muted-foreground mb-2 px-1">📝 今日便签</p>
          <NotePreview text={latestEntry.text} image={latestEntry.image} style={latestEntry.style} layoutVariant={0} />
          <div className="flex gap-2 mt-3 justify-center">
            <button
              onClick={() => handleEdit(latestEntry)}
              className="text-[10px] font-body px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground gentle-transition flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" /> 编辑
            </button>
            <button
              onClick={() => handleExport(latestEntry)}
              className="text-[10px] font-body px-3 py-1.5 rounded-full bg-primary/10 text-primary gentle-transition hover:bg-primary/20 flex items-center gap-1"
            >
              📤 导出
            </button>
          </div>
        </div>
      )}

      {/* Calendar month view */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <div className="rounded-2xl bg-card p-5 note-shadow border-2 border-border">
          <h3 className="font-display text-base mb-4 text-center flex items-center justify-center gap-1.5">
            📅 月视图
          </h3>
          <CalendarView entries={entries} onDateClick={(entry) => setSelectedEntry(entry)} />
        </div>
      </div>

      {/* Material library entry */}
      <div className="animate-slide-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
        <button
          onClick={() => navigate("/library")}
          className="w-full mb-6 px-4 py-3 rounded-2xl bg-card border-2 border-border note-shadow hover:bg-muted hover:scale-[1.01] gentle-transition flex items-center gap-3"
        >
          <span className="text-lg">🎒</span>
          <div className="text-left flex-1">
            <p className="text-xs font-body text-foreground font-medium">素材背包</p>
            <p className="text-[10px] font-body text-muted-foreground">已收集 {savedArtists.length}/5 位艺术家</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Timeline */}
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

      {/* Entry detail modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-foreground/30 animate-fade-in" onClick={() => setSelectedEntry(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-card p-5 note-shadow border-2 border-border animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-body text-muted-foreground">
                {new Date(selectedEntry.date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
              </p>
              <button onClick={() => setSelectedEntry(null)} className="p-1 rounded-full hover:bg-muted">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {selectedEntry.image && (
              <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
                <img src={selectedEntry.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-sm font-body text-foreground leading-relaxed">{selectedEntry.text}</p>
            {selectedEntry.mood && <span className="text-lg mt-2 inline-block">{selectedEntry.mood}</span>}
          </div>
        </div>
      )}

      {/* Export dialog */}
      {exportEntry && (
        <ExportDialog
          open={showExport}
          onClose={() => { setShowExport(false); setExportEntry(null); }}
          text={exportEntry.text}
          image={exportEntry.image}
          style={exportEntry.style}
          layoutVariant={0}
        />
      )}
    </div>
  );
};

export default ProfilePage;
