import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Lock } from "lucide-react";
import { useDiaryStore } from "@/lib/diary-store";
import { artists } from "@/lib/diary-data";
import { toast } from "sonner";

const LibraryPage = () => {
  const navigate = useNavigate();
  const { savedArtists, toggleSavedArtist } = useDiaryStore();

  const handleToggle = (artistId: string) => {
    const success = toggleSavedArtist(artistId);
    if (!success) {
      toast("Library full", {
        description: "Remove an artist first, or upgrade for more slots.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h2 className="font-display text-xl">My library</h2>
          <p className="text-xs font-body text-muted-foreground">{savedArtists.length}/5 artists saved</p>
        </div>
      </div>

      {/* Artist list */}
      <div className="space-y-3 mb-10">
        {artists.map((artist, index) => {
          const isSaved = savedArtists.includes(artist.id);
          return (
            <div
              key={artist.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border note-shadow animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="font-display text-lg text-foreground">{artist.name[0]}</span>
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-medium">{artist.name}</p>
                <p className="text-xs font-body text-muted-foreground mt-0.5">{artist.subtitle}</p>
              </div>
              <button
                onClick={() => handleToggle(artist.id)}
                className={`p-2 rounded-full gentle-transition ${
                  isSaved ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Membership teaser */}
      <div className="rounded-lg bg-card p-6 border border-border note-shadow text-center animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <Lock className="w-6 h-6 mx-auto text-accent mb-3" />
        <h3 className="font-display text-base mb-2">Unlock more</h3>
        <p className="text-xs font-body text-muted-foreground leading-relaxed mb-4">
          Get unlimited artist slots, access past artists, and high-resolution exports with membership.
        </p>
        <button className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-body text-sm tracking-wide hover:opacity-90 gentle-transition">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default LibraryPage;
