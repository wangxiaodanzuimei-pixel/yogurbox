import type { ArtistStyle } from "@/lib/diary-data";
import floralDecoration from "@/assets/floral-decoration.png";
import inkDecoration from "@/assets/ink-decoration.png";
import geometricDecoration from "@/assets/geometric-decoration.png";

interface NotePreviewProps {
  text: string;
  image?: string | null;
  style: ArtistStyle;
  layoutVariant: number;
}

const decorationMap: Record<ArtistStyle, string> = {
  floral: floralDecoration,
  ink: inkDecoration,
  geometric: geometricDecoration,
};

const styleClasses: Record<ArtistStyle, { card: string; text: string; accent: string }> = {
  floral: {
    card: "bg-card border border-border",
    text: "text-foreground font-display italic",
    accent: "text-artist-a",
  },
  ink: {
    card: "bg-card border-2 border-foreground/10",
    text: "text-foreground font-body font-light tracking-wide",
    accent: "text-foreground",
  },
  geometric: {
    card: "bg-card border border-gold/30",
    text: "text-foreground font-display",
    accent: "text-gold",
  },
};

const NotePreview = ({ text, image, style, layoutVariant }: NotePreviewProps) => {
  const classes = styleClasses[style];
  const decoration = decorationMap[style];

  const displayText = text || "Your words will appear here, decorated with care…";

  return (
    <div className={`relative w-full max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden note-shadow gentle-transition ${classes.card}`}>
      {/* Decoration overlay */}
      <img
        src={decoration}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Date */}
        <p className={`text-xs font-body uppercase tracking-[0.2em] mb-4 ${classes.accent}`}>
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        {/* Layout variants */}
        {layoutVariant === 0 && (
          <>
            {image && (
              <div className="w-full h-28 rounded-md overflow-hidden mb-4">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <p className={`${classes.text} text-sm leading-relaxed flex-1`}>
              {displayText}
            </p>
          </>
        )}

        {layoutVariant === 1 && (
          <div className="flex gap-4 flex-1">
            {image && (
              <div className="w-24 h-32 rounded-md overflow-hidden flex-shrink-0">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <p className={`${classes.text} text-sm leading-relaxed flex-1`}>
              {displayText}
            </p>
          </div>
        )}

        {layoutVariant === 2 && (
          <>
            <p className={`${classes.text} text-sm leading-relaxed flex-1`}>
              {displayText}
            </p>
            {image && (
              <div className="w-full h-24 rounded-md overflow-hidden mt-4">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </>
        )}

        {/* Signature line */}
        <div className={`mt-auto pt-4 border-t border-border/50`}>
          <p className="text-[10px] font-body text-muted-foreground tracking-widest uppercase">
            Private diary
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotePreview;
