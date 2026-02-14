import { useNavigate } from "react-router-dom";
import { Download, ArrowLeft, Home } from "lucide-react";
import NotePreview from "@/components/NotePreview";
import ExportDialog from "@/components/ExportDialog";
import { useDiaryStore } from "@/lib/diary-store";
import { toast } from "sonner";
import { useState } from "react";

const CompletionPage = () => {
  const navigate = useNavigate();
  const { text, image, images, selectedStyle, layoutVariant, mood, saveEntry, updateEntry, editingEntryId, reset } = useDiaryStore();
  const [showExport, setShowExport] = useState(false);

  const handleSave = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (editingEntryId) {
      updateEntry({ id: editingEntryId, text, image: image || undefined, images, style: selectedStyle, date: dateStr, theme: "", mood });
      toast("已更新 ✨", { duration: 2000 });
    } else {
      saveEntry({ id: Date.now().toString(), text, image: image || undefined, images, style: selectedStyle, date: dateStr, theme: "", mood });
      toast("已存下 ✨", { duration: 2000 });
    }
    reset();
    navigate("/profile");
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
        <NotePreview text={text} image={image} images={images} style={selectedStyle} layoutVariant={layoutVariant} />
      </div>

      <div className="flex gap-3 mb-10 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <button
          onClick={handleSave}
          className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-body text-sm tracking-wide flex items-center justify-center gap-2 note-shadow hover:note-shadow-hover hover:scale-[1.01] gentle-transition"
        >
          <Download className="w-4 h-4" />
          存下它
        </button>
        <button
          onClick={() => setShowExport(true)}
          className="py-3.5 px-5 rounded-2xl bg-card text-foreground font-body text-sm border-2 border-border flex items-center justify-center gap-2 hover:bg-muted hover:scale-105 gentle-transition"
        >
          📤 导出
        </button>
      </div>

      <ExportDialog
        open={showExport}
        onClose={() => setShowExport(false)}
        text={text}
        image={image}
        images={images}
        style={selectedStyle}
        layoutVariant={layoutVariant}
      />
    </div>
  );
};

export default CompletionPage;
