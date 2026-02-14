import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, BookOpen, Download } from "lucide-react";
import NotePreview from "@/components/NotePreview";
import ExportDialog from "@/components/ExportDialog";
import ArtistButton from "@/components/ArtistButton";
import { useDiaryStore } from "@/lib/diary-store";
import { artists, defaultTemplate, type ArtistStyle } from "@/lib/diary-data";
import { toast } from "sonner";
import { useState } from "react";

const StylePage = () => {
  const navigate = useNavigate();
  const { text, image, selectedStyle, setSelectedStyle, layoutVariant, cycleLayout, mood, saveEntry, updateEntry, editingEntryId, reset } = useDiaryStore();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      cycleLayout();
      setIsRegenerating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-xl hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-display text-lg flex items-center gap-1.5">✨ 选择风格</h2>
        <button onClick={() => navigate("/library")} className="p-2 -mr-2 rounded-xl hover:bg-muted gentle-transition">
          <BookOpen className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className={`mb-6 animate-float-in gentle-transition ${isRegenerating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        <NotePreview text={text} image={image} style={selectedStyle} layoutVariant={layoutVariant} />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleRegenerate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border-2 border-border text-sm font-body text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105 gentle-transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
          换一种排版
        </button>
      </div>

      <div className="space-y-2 mb-6 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        {artists.map((artist) => (
          <ArtistButton
            key={artist.id}
            name={artist.name}
            subtitle={artist.subtitle}
            bio={artist.bio}
            isActive={selectedStyle === artist.style}
            onClick={() => setSelectedStyle(artist.style)}
            color={artist.color}
          />
        ))}

        <button
          onClick={() => setSelectedStyle("geometric")}
          className={`w-full px-4 py-3 rounded-xl text-left gentle-transition font-body ${
            selectedStyle === "geometric"
              ? "bg-primary text-primary-foreground note-shadow"
              : "bg-card text-foreground hover:bg-muted border-2 border-border"
          }`}
        >
          <p className="font-display text-sm font-medium">{defaultTemplate.name}</p>
          <p className={`text-xs mt-0.5 ${selectedStyle === "geometric" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {defaultTemplate.subtitle}
          </p>
        </button>
      </div>

      <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <button
          onClick={() => {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            if (editingEntryId) {
              updateEntry({ id: editingEntryId, text, image: image || undefined, style: selectedStyle, date: dateStr, theme: "", mood });
              toast("已更新 ✨", { duration: 2000 });
            } else {
              saveEntry({ id: Date.now().toString(), text, image: image || undefined, style: selectedStyle, date: dateStr, theme: "", mood });
              toast("已存下 ✨", { duration: 2000 });
            }
            reset();
            navigate("/profile");
          }}
          className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-body text-sm tracking-wide note-shadow hover:note-shadow-hover hover:scale-[1.01] gentle-transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          存下它
        </button>
        <button
          onClick={() => setShowExport(true)}
          className="py-4 px-5 rounded-2xl bg-card text-foreground font-body text-sm border-2 border-border flex items-center justify-center gap-2 hover:bg-muted hover:scale-105 gentle-transition"
        >
          📤 导出
        </button>
      </div>

      <ExportDialog
        open={showExport}
        onClose={() => setShowExport(false)}
        text={text}
        image={image}
        style={selectedStyle}
        layoutVariant={layoutVariant}
      />
    </div>
  );
};

export default StylePage;
