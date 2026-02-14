import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import { useDiaryStore } from "@/lib/diary-store";
import { artists } from "@/lib/diary-data";
import { toast } from "sonner";
import { useState } from "react";

const MAX_SLOTS = 5;

const LibraryPage = () => {
  const navigate = useNavigate();
  const { savedArtists, toggleSavedArtist } = useDiaryStore();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [wiggleSlot, setWiggleSlot] = useState<number | null>(null);

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => {
    const artistId = savedArtists[i] || null;
    return artistId ? artists.find((a) => a.id === artistId) || null : null;
  });

  const handleSlotTap = (index: number) => {
    const artist = slots[index];
    if (artist) {
      setSelectedSlot(selectedSlot === index ? null : index);
    }
  };

  const handleRemove = (artistId: string, index: number) => {
    toggleSavedArtist(artistId);
    setSelectedSlot(null);
    setWiggleSlot(index);
    setTimeout(() => setWiggleSlot(null), 500);
    toast("已移除", { description: "空位已释放" });
  };

  const handleEquip = (artistId: string) => {
    const success = toggleSavedArtist(artistId);
    if (!success) {
      toast("道具箱已满", { description: "先移除一位艺术家吧～" });
    } else {
      toast("装备成功！✨");
    }
  };

  // Artists not in slots
  const unequipped = artists.filter((a) => !savedArtists.includes(a.id));

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="font-display text-xl flex items-center gap-2">
            道具箱
            <Sparkles className="w-4 h-4 text-kawaii-yellow" />
          </h2>
          <p className="text-xs font-body text-muted-foreground">已装备 {savedArtists.length}/{MAX_SLOTS}</p>
        </div>
      </div>

      {/* Inventory grid - game style */}
      <div className="rounded-2xl bg-card border-2 border-slot-border p-5 note-shadow mb-6 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">🎒</span>
          <p className="text-xs font-body text-muted-foreground font-medium tracking-wide">我的画师</p>
        </div>

        <div className="grid grid-cols-5 gap-2.5">
          {slots.map((artist, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => handleSlotTap(index)}
                className={`w-full aspect-square rounded-xl border-2 gentle-transition flex flex-col items-center justify-center gap-0.5 overflow-hidden ${
                  artist
                    ? "border-kawaii-pink/40 bg-card slot-glow hover:scale-105"
                    : "border-dashed border-slot-border bg-slot slot-empty-style"
                } ${wiggleSlot === index ? "animate-wiggle" : ""}`}
              >
                {artist ? (
                  <>
                    <img
                      src={artist.icon}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-[8px] font-body text-muted-foreground leading-tight mt-0.5">
                      {artist.name}
                    </span>
                  </>
                ) : (
                  <span className="text-lg text-muted-foreground/30">＋</span>
                )}
              </button>

              {/* Rarity badge */}
              {artist && (
                <div className={`absolute -top-1 -right-1 px-1 py-0.5 rounded text-[7px] font-bold font-body ${
                  artist.rarity === "SSR"
                    ? "bg-kawaii-yellow text-foreground"
                    : "bg-kawaii-pink text-primary-foreground"
                }`}>
                  {artist.rarity}
                </div>
              )}

              {/* Selected overlay */}
              {selectedSlot === index && artist && (
                <div className="absolute inset-0 rounded-xl bg-foreground/50 flex items-center justify-center animate-fade-in">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(artist.id, index);
                    }}
                    className="px-2 py-1 rounded-lg bg-card text-[10px] font-body text-destructive font-medium"
                  >
                    卸下
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Artist detail cards */}
      <div className="space-y-3 mb-8">
        {artists.map((artist, index) => {
          const isEquipped = savedArtists.includes(artist.id);
          return (
            <div
              key={artist.id}
              className="rounded-2xl bg-card border border-border p-4 note-shadow animate-slide-up"
              style={{ animationDelay: `${(index + 2) * 0.1}s`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={artist.icon}
                    alt={artist.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-kawaii-pink/20"
                  />
                  <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold font-body ${
                    artist.rarity === "SSR"
                      ? "bg-kawaii-yellow text-foreground"
                      : "bg-kawaii-pink text-primary-foreground"
                  }`}>
                    {artist.rarity}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{artist.emoji}</span>
                    <p className="font-display text-sm font-medium">{artist.name}</p>
                  </div>
                  <p className="text-[11px] font-body text-muted-foreground mt-0.5">{artist.subtitle}</p>
                  <p className="text-[10px] font-body text-muted-foreground/70 mt-1 leading-relaxed line-clamp-2">
                    {artist.bio}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isEquipped) {
                      toggleSavedArtist(artist.id);
                      toast("已卸下");
                    } else {
                      handleEquip(artist.id);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-body font-medium gentle-transition ${
                    isEquipped
                      ? "bg-kawaii-pink/20 text-primary border border-kawaii-pink/30"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isEquipped ? "已装备" : "装备"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Membership teaser - gacha style */}
      <div className="rounded-2xl bg-gradient-to-br from-kawaii-yellow/20 via-card to-kawaii-pink/20 p-6 border border-accent/30 note-shadow text-center animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
        <div className="text-3xl mb-2">🎰</div>
        <h3 className="font-display text-base mb-1">解锁更多画师</h3>
        <p className="text-[11px] font-body text-muted-foreground leading-relaxed mb-4">
          升级会员获得更多道具箱位置<br/>访问限定画师 · 高清导出
        </p>
        <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-medium hover:opacity-90 gentle-transition flex items-center gap-2 mx-auto">
          <Lock className="w-3.5 h-3.5" />
          了解更多
        </button>
      </div>
    </div>
  );
};

export default LibraryPage;
