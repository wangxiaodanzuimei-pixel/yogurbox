import { useNavigate } from "react-router-dom";
import { Download, Share2, ArrowLeft, Home } from "lucide-react";
import NotePreview from "@/components/NotePreview";
import CalendarView from "@/components/CalendarView";
import { useDiaryStore } from "@/lib/diary-store";
import { toast } from "sonner";

const CompletionPage = () => {
  const navigate = useNavigate();
  const { text, image, selectedStyle, layoutVariant, entries, saveEntry, reset } = useDiaryStore();

  const handleSave = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    saveEntry({
      id: Date.now().toString(),
      text,
      image: image || undefined,
      style: selectedStyle,
      date: dateStr,
      theme: "",
    });
    toast("已保存到相册 ✨", {
      description: "你的日记便签已保存。",
    });
  };

  const handleShare = () => {
    toast("分享功能即将上线", {
      description: "敬请期待后续更新。",
    });
  };

  const handleGoHome = () => {
    reset();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <button onClick={() => navigate("/style")} className="p-2 -ml-2 rounded-full hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-display text-lg">你的便签</h2>
        <button onClick={handleGoHome} className="p-2 -mr-2 rounded-full hover:bg-muted gentle-transition">
          <Home className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Final note */}
      <div className="mb-6 animate-float-in">
        <NotePreview text={text} image={image} style={selectedStyle} layoutVariant={layoutVariant} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-10 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <button
          onClick={handleSave}
          className="flex-1 py-3.5 rounded-lg bg-primary text-primary-foreground font-body text-sm tracking-wide flex items-center justify-center gap-2 note-shadow hover:note-shadow-hover gentle-transition"
        >
          <Download className="w-4 h-4" />
          保存到相册
        </button>
        <button
          onClick={handleShare}
          className="py-3.5 px-5 rounded-lg bg-card text-foreground font-body text-sm border border-border flex items-center justify-center gap-2 hover:bg-muted gentle-transition"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar */}
      <div className="animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <div className="rounded-lg bg-card p-5 note-shadow border border-border">
          <h3 className="font-display text-base mb-4 text-center">你的旅程</h3>
          <CalendarView entries={entries} />
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;
