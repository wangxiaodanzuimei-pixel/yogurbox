import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Download } from "lucide-react";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import NotePreview from "@/components/NotePreview";
import ExportDialog from "@/components/ExportDialog";
import ArtistButton from "@/components/ArtistButton";
import { useDiaryStore } from "@/lib/diary-store";
import { artists, defaultTemplate, type ArtistStyle } from "@/lib/diary-data";
import { toast } from "sonner";
import { useState, useCallback } from "react";

const StylePage = () => {
  const navigate = useNavigate();
  const { text, image, images, selectedStyle, setSelectedStyle, layoutVariant, cycleLayout, mood, saveEntry, updateEntry, editingEntryId, reset, savedArtists, toggleSavedArtist } = useDiaryStore();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);

  // Artists saved in backpack that are NOT the current weekly artists
  const weeklyIds = artists.map((a) => a.id);
  const backpackArtists = savedArtists.filter((id) => !weeklyIds.includes(id));

  const handleSelectArtist = useCallback((artist: typeof artists[0]) => {
    setSelectedStyle(artist.style);
    // Auto-save to backpack when used
    if (!savedArtists.includes(artist.id)) {
      const ok = toggleSavedArtist(artist.id);
      if (ok) toast("已自动收藏 ✨", { duration: 1000 });
    }
  }, [savedArtists, setSelectedStyle, toggleSavedArtist]);

  const handleToggleSave = useCallback((artistId: string) => {
    const wasSaved = savedArtists.includes(artistId);
    const ok = toggleSavedArtist(artistId);
    if (!ok) {
      toast("背包已满（最多5个）", { duration: 1500 });
      return;
    }
    toast(wasSaved ? "已取消收藏" : "已收藏 ✨", { duration: 1000 });
  }, [savedArtists, toggleSavedArtist]);

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
        <div className="w-9" />
      </div>

      <div className={`mb-6 animate-float-in gentle-transition ${isRegenerating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        <NotePreview text={text} image={image} images={images} style={selectedStyle} layoutVariant={layoutVariant} />
      </div>

      <div id="onboard-layout" className="flex justify-center mb-6">
        <button
          onClick={handleRegenerate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border-2 border-border text-sm font-body text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105 gentle-transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
          换一种排版
        </button>
      </div>

      <div id="onboard-weekly-artists" className="space-y-2 mb-6 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        {/* Section: This week's artists */}
        <p className="text-[10px] font-body tracking-widest text-muted-foreground px-1 mb-1">🌟 本周艺术家</p>
        {artists.map((artist) => (
          <ArtistButton
            key={artist.id}
            name={artist.name}
            subtitle={artist.subtitle}
            bio={artist.bio}
            isActive={selectedStyle === artist.style}
            onClick={() => handleSelectArtist(artist)}
            color={artist.color}
            isSaved={savedArtists.includes(artist.id)}
            onToggleSave={() => handleToggleSave(artist.id)}
          />
        ))}

        {/* Section: From backpack */}
        <div className="pt-2">
          <button
            onClick={() => setShowBackpack(!showBackpack)}
            className={`w-full px-4 py-3 rounded-xl text-left gentle-transition font-body flex items-center gap-3 ${
              showBackpack ? "bg-card border-2 border-primary/20" : "bg-card border-2 border-border hover:bg-muted"
            }`}
          >
            <span className="text-base">🎒</span>
            <div className="flex-1">
              <p className="font-display text-sm font-medium">从背包选择</p>
              <p className="text-[10px] text-muted-foreground">已收藏的艺术家</p>
            </div>
            <span className={`text-xs text-muted-foreground gentle-transition ${showBackpack ? "rotate-90" : ""}`}>›</span>
          </button>
          {showBackpack && (
            <div className="mt-1 ml-4 space-y-1 animate-fade-in">
              {backpackArtists.length === 0 ? (
                <p className="text-[10px] font-body text-muted-foreground/50 py-2 px-2">背包里还没有额外的艺术家～</p>
              ) : (
                backpackArtists.map((id) => {
                  const artist = artists.find((a) => a.id === id);
                  if (!artist) return null;
                  return (
                    <ArtistButton
                      key={artist.id}
                      name={artist.name}
                      subtitle={artist.subtitle}
                      bio={artist.bio}
                      isActive={selectedStyle === artist.style}
                      onClick={() => setSelectedStyle(artist.style)}
                      color={artist.color}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Section: System default */}
        <div className="pt-2">
          <p className="text-[10px] font-body tracking-widest text-muted-foreground px-1 mb-1">📐 系统默认</p>
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
      </div>

      <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <button
          onClick={() => {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            if (editingEntryId) {
              updateEntry({ id: editingEntryId, text, image: image || undefined, images, style: selectedStyle, date: dateStr, theme: "", mood });
              toast("已更新 ✨", { duration: 1000 });
            } else {
              saveEntry({ id: Date.now().toString(), text, image: image || undefined, images, style: selectedStyle, date: dateStr, theme: "", mood });
              toast("已存下 ✨", { duration: 1000 });
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

      <div className="h-6" />

      <OnboardingOverlay
        storageKey="onboarding-style"
        steps={[
          { targetId: "onboard-layout", message: "总共有6种排版供你选择，点击这里随机切换 🎲" },
          { targetId: "onboard-weekly-artists", message: "每周都会更新两位新的作者元素，下周就会消失哦。喜欢的话可以将她收藏进背包 🌟" },
        ]}
      />

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

export default StylePage;
