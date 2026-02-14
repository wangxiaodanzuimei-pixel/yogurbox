import { Info, Bookmark } from "lucide-react";
import { useState } from "react";

interface ArtistButtonProps {
  name: string;
  subtitle: string;
  bio: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

const ArtistButton = ({ name, subtitle, bio, isActive, onClick, isSaved, onToggleSave }: ArtistButtonProps) => {
  const [showBio, setShowBio] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`w-full px-4 py-3 rounded-xl text-left gentle-transition font-body ${
          isActive
            ? "bg-primary text-primary-foreground note-shadow scale-[1.01]"
            : "bg-card text-foreground hover:bg-muted border-2 border-border hover:scale-[1.01]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-sm font-medium">{name}</p>
            <p className={`text-xs mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {onToggleSave && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave();
                }}
                className={`p-1.5 rounded-full gentle-transition ${isActive ? "hover:bg-primary-foreground/10" : "hover:bg-muted"}`}
                aria-label={isSaved ? "取消收藏" : "收藏"}
              >
                <Bookmark className={`w-3.5 h-3.5 gentle-transition ${isSaved ? "fill-current" : ""}`} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBio(!showBio);
              }}
              className={`p-1.5 rounded-full ${isActive ? "hover:bg-primary-foreground/10" : "hover:bg-muted"}`}
              aria-label={`关于 ${name}`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </button>

      {showBio && (
        <div className="absolute bottom-full left-0 right-0 mb-2 p-4 rounded-2xl bg-card note-shadow border-2 border-border z-20 animate-slide-up">
          <p className="text-xs font-body text-foreground leading-relaxed">{bio}</p>
          <button
            onClick={() => setShowBio(false)}
            className="mt-2 text-[10px] text-muted-foreground tracking-widest hover:text-foreground"
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtistButton;
