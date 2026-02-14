import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDiaryStore } from "@/lib/diary-store";
import { artists } from "@/lib/diary-data";
import { toast } from "sonner";
import { useState } from "react";

const MAX_SLOTS = 5;

const LibraryPage = () => {
  const navigate = useNavigate();
  const { savedArtists, toggleSavedArtist } = useDiaryStore();
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => {
    const artistId = savedArtists[i] || null;
    return artistId ? artists.find((a) => a.id === artistId) || null : null;
  });

  const handleToggle = (artistId: string) => {
    const isAdded = savedArtists.includes(artistId);
    if (isAdded) {
      toggleSavedArtist(artistId);
      toast("已移除");
    } else {
      const success = toggleSavedArtist(artistId);
      if (!success) {
        toast("素材库已满", { description: "先移除一位画师吧" });
      } else {
        toast("已添加 ✨");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="font-display text-xl">素材库</h2>
          <p className="text-xs font-body text-muted-foreground">已选择 {savedArtists.length}/{MAX_SLOTS}</p>
        </div>
      </div>

      {/* Slots overview */}
      <div className="rounded-2xl bg-card border-2 border-border p-5 note-shadow mb-6 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <p className="text-xs font-body text-muted-foreground mb-3">当前画师</p>
        <div className="grid grid-cols-5 gap-2.5">
          {slots.map((artist, index) => (
            <div
              key={index}
              className={`aspect-square rounded-xl border-2 gentle-transition flex flex-col items-center justify-center gap-0.5 overflow-hidden ${
                artist
                  ? "border-primary/30 bg-card"
                  : "border-dashed border-border bg-muted/30"
              }`}
            >
              {artist ? (
                <>
                  <img src={artist.icon} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-[8px] font-body text-muted-foreground leading-tight mt-0.5">
                    {artist.name}
                  </span>
                </>
              ) : (
                <span className="text-lg text-muted-foreground/30">＋</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Artist list */}
      <div className="space-y-3 mb-8">
        {artists.map((artist, index) => {
          const isAdded = savedArtists.includes(artist.id);
          const isExpanded = expandedArtist === artist.id;
          return (
            <div
              key={artist.id}
              className="rounded-2xl bg-card border border-border note-shadow animate-slide-up overflow-hidden"
              style={{ animationDelay: `${(index + 2) * 0.1}s`, animationFillMode: "both" }}
            >
              <div className="p-4 flex items-center gap-3">
                <img
                  src={artist.icon}
                  alt={artist.name}
                  className="w-12 h-12 rounded-xl object-cover border border-border"
                />
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setExpandedArtist(isExpanded ? null : artist.id)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{artist.emoji}</span>
                    <p className="font-display text-sm">{artist.name}</p>
                  </div>
                  <p className="text-[11px] font-body text-muted-foreground mt-0.5">{artist.subtitle}</p>
                </div>
                <button
                  onClick={() => handleToggle(artist.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-body gentle-transition ${
                    isAdded
                      ? "bg-muted text-muted-foreground border border-border"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isAdded ? "移除" : "添加"}
                </button>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-fade-in">
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-body text-muted-foreground leading-relaxed">{artist.bio}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryPage;
