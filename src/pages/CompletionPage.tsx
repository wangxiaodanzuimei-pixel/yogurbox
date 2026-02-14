import { useNavigate } from "react-router-dom";
import { Download, Share2, ArrowLeft, Home, X } from "lucide-react";
import NotePreview from "@/components/NotePreview";
import CalendarView from "@/components/CalendarView";
import { useDiaryStore } from "@/lib/diary-store";
import { toast } from "sonner";
import type { DiaryEntry } from "@/lib/diary-data";
import { useState } from "react";

const CompletionPage = () => {
  const navigate = useNavigate();
  const { text, image, selectedStyle, layoutVariant, entries, saveEntry, reset } = useDiaryStore();
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  const handleSave = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    saveEntry({ id: Date.now().toString(), text, image: image || undefined, style: selectedStyle, date: dateStr, theme: "" });
    toast("已保存到相册 ✨", { description: "你的日记便签已保存～" });
  };

  const handleShare = () => {
    toast("分享功能即将上线", { description: "敬请期待后续更新 ♪" });
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <button onClick={() => navigate("/style")} className="p-2 -ml-2 rounded-xl hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-display text-lg flex items-center gap-1.5">🎉 你的便签</h2>
        <button onClick={() => { reset(); navigate("/"); }} className="p-2 -mr-2 rounded-xl hover:bg-muted gentle-transition">
          <Home className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="mb-6 animate-float-in">
        <NotePreview text={text} image={image} style={selectedStyle} layoutVariant={layoutVariant} />
      </div>

      <div className="flex gap-3 mb-10 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <button
          onClick={handleSave}
          className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-body text-sm tracking-wide flex items-center justify-center gap-2 note-shadow hover:note-shadow-hover hover:scale-[1.01] gentle-transition"
        >
          <Download className="w-4 h-4" />
          保存到相册
        </button>
        <button
          onClick={handleShare}
          className="py-3.5 px-5 rounded-2xl bg-card text-foreground font-body text-sm border-2 border-border flex items-center justify-center gap-2 hover:bg-muted hover:scale-105 gentle-transition"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <div className="rounded-2xl bg-card p-5 note-shadow border-2 border-border">
          <h3 className="font-display text-base mb-4 text-center flex items-center justify-center gap-1.5">
            📅 你的旅程
          </h3>
          <CalendarView entries={entries} onDateClick={(entry) => setSelectedEntry(entry)} />
        </div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletionPage;
