import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDiaryStore } from "@/lib/diary-store";
import { artists } from "@/lib/diary-data";
import { toast } from "sonner";
import { useState } from "react";

const MAX_SLOTS = 5;

// Stamp component with ink effect
const StampSlot = ({
  artist,
  index,
  collected,
}: {
  artist: (typeof artists)[0] | null;
  index: number;
  collected: boolean;
}) => (
  <div
    className={`relative aspect-square rounded-xl border-2 gentle-transition flex flex-col items-center justify-center gap-0.5 overflow-hidden ${
      artist
        ? "border-primary/40 bg-card"
        : "border-dashed border-border bg-muted/20"
    }`}
  >
    {artist ? (
      <>
        {/* Stamp frame effect */}
        <div className="absolute inset-0 border-4 border-dotted border-primary/10 rounded-lg m-0.5 pointer-events-none" />
        <div
          className="relative"
          style={{
            animation: collected ? "stamp-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" : undefined,
          }}
        >
          <img
            src={artist.icon}
            alt={artist.name}
            className="w-10 h-10 rounded-full object-cover"
            style={{
              filter: "saturate(0.8) contrast(1.1)",
              mixBlendMode: "multiply",
            }}
          />
          {/* Ink stamp overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, transparent 30%, hsl(var(--primary) / 0.15) 70%)",
            }}
          />
        </div>
        <span className="text-[8px] font-body text-muted-foreground leading-tight mt-0.5 font-medium">
          {artist.name}
        </span>
      </>
    ) : (
      <div className="flex flex-col items-center gap-1 opacity-40">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
          <span className="text-xs text-muted-foreground/50">＋</span>
        </div>
        <span className="text-[7px] text-muted-foreground/40">空位</span>
      </div>
    )}
  </div>
);

const LibraryPage = () => {
  const navigate = useNavigate();
  const { savedArtists, toggleSavedArtist } = useDiaryStore();
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => {
    const artistId = savedArtists[i] || null;
    return artistId ? artists.find((a) => a.id === artistId) || null : null;
  });

  const handleToggle = (artistId: string) => {
    const isAdded = savedArtists.includes(artistId);
    if (isAdded) {
      toggleSavedArtist(artistId);
      toast("已移除", { duration: 2000 });
    } else {
      const success = toggleSavedArtist(artistId);
      if (!success) {
        toast("素材库已满", { description: "先移除一位画师吧", duration: 2000 });
      } else {
        setJustAdded(artistId);
        setTimeout(() => setJustAdded(null), 800);
        toast("已收集 ✨", { duration: 2000 });
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
          <h2 className="font-display text-xl flex items-center gap-2">
            素材图鉴 <span className="text-base">📕</span>
          </h2>
          <p className="text-xs font-body text-muted-foreground">
            已收集 {savedArtists.length}/{MAX_SLOTS} 枚印章
          </p>
        </div>
      </div>

      {/* Stamp collection box */}
      <div
        className="rounded-2xl border-2 border-border p-5 note-shadow mb-6 animate-slide-up relative overflow-hidden"
        style={{
          animationDelay: "0.1s",
          animationFillMode: "both",
          background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--paper)) 100%)",
        }}
      >
        {/* Notebook texture lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, hsl(var(--foreground)) 23px, hsl(var(--foreground)) 24px)",
          }}
        />
        <p className="text-xs font-body text-muted-foreground mb-3 flex items-center gap-1.5 relative">
          🏷️ 印章收藏册
        </p>
        <div className="grid grid-cols-5 gap-2.5 relative">
          {slots.map((artist, index) => (
            <StampSlot
              key={index}
              artist={artist}
              index={index}
              collected={justAdded === artist?.id}
            />
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
                {/* Artist icon styled like a stamp */}
                <div className="relative">
                  <img
                    src={artist.icon}
                    alt={artist.name}
                    className={`w-12 h-12 rounded-xl object-cover border-2 gentle-transition ${
                      isAdded ? "border-primary/40" : "border-border"
                    }`}
                    style={{
                      filter: isAdded ? "none" : "grayscale(0.5) opacity(0.7)",
                    }}
                  />
                  {isAdded && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] text-primary-foreground font-bold shadow-sm">
                      ✓
                    </div>
                  )}
                </div>
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
                      : "bg-primary text-primary-foreground note-shadow hover:scale-105"
                  }`}
                >
                  {isAdded ? "移除" : "收集"}
                </button>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-fade-in">
                  <div className="border-t border-dashed border-border pt-3">
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
