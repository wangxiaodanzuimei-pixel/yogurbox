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

const styleConfig: Record<ArtistStyle, {
  card: string;
  text: string;
  accent: string;
  dateBg: string;
  divider: string;
  cornerDecor: boolean;
  stamp: string;
}> = {
  floral: {
    card: "bg-gradient-to-br from-card via-card to-[hsl(340,30%,95%)]",
    text: "text-foreground font-display italic",
    accent: "text-artist-a",
    dateBg: "bg-artist-a/10",
    divider: "border-artist-a/20",
    cornerDecor: true,
    stamp: "🌸",
  },
  ink: {
    card: "bg-gradient-to-b from-card to-[hsl(30,10%,94%)]",
    text: "text-foreground font-body font-light tracking-wide",
    accent: "text-foreground/70",
    dateBg: "bg-foreground/5",
    divider: "border-foreground/10",
    cornerDecor: false,
    stamp: "墨",
  },
  geometric: {
    card: "bg-gradient-to-br from-card via-card to-[hsl(40,30%,93%)]",
    text: "text-foreground font-display",
    accent: "text-gold",
    dateBg: "bg-gold/10",
    divider: "border-gold/20",
    cornerDecor: true,
    stamp: "✦",
  },
};

const NotePreview = ({ text, image, style, layoutVariant }: NotePreviewProps) => {
  const config = styleConfig[style];
  const decoration = decorationMap[style];
  const displayText = text || "你的文字将出现在这里…";
  const dateStr = new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
  const weekday = new Date().toLocaleDateString("zh-CN", { weekday: "short" });

  return (
    <div className={`relative w-full max-w-xs mx-auto aspect-[4/5] rounded-2xl overflow-hidden note-shadow gentle-transition ${config.card}`}>
      {/* Decoration overlay */}
      <img
        src={decoration}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      {/* Corner decorations */}
      {config.cornerDecor && (
        <>
          <div className="absolute top-3 right-3 text-xl opacity-40 pointer-events-none">
            {config.stamp}
          </div>
          <div className="absolute bottom-3 left-3 text-sm opacity-25 pointer-events-none">
            {config.stamp}
          </div>
        </>
      )}

      {style === "ink" && (
        <div className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none">
          <img src={decoration} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-5">
        {/* Date badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`px-2.5 py-1 rounded-full ${config.dateBg}`}>
            <p className={`text-[10px] font-body font-medium tracking-widest ${config.accent}`}>
              {weekday} · {dateStr}
            </p>
          </div>
          {style === "ink" && (
            <span className="text-base font-display opacity-30">{config.stamp}</span>
          )}
        </div>

        {/* Decorative divider */}
        <div className={`border-t ${config.divider} mb-3`} />

        {/* 6 Layout variants */}
        {layoutVariant === 0 && (
          /* Layout 0: image on top, text below */
          <div className="flex-1 flex flex-col min-h-0">
            {image && (
              <div className="w-full h-20 rounded-lg overflow-hidden mb-3 ring-1 ring-border/50">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <p className={`${config.text} text-[13px] leading-relaxed flex-1 line-clamp-6`}>
              {displayText}
            </p>
          </div>
        )}

        {layoutVariant === 1 && (
          /* Layout 1: image left, text right */
          <div className="flex gap-3 flex-1 min-h-0">
            {image && (
              <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border/50">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <p className={`${config.text} text-[13px] leading-relaxed flex-1 line-clamp-6`}>
              {displayText}
            </p>
          </div>
        )}

        {layoutVariant === 2 && (
          /* Layout 2: text on top, image at bottom */
          <div className="flex-1 flex flex-col min-h-0">
            <p className={`${config.text} text-[13px] leading-relaxed flex-1 line-clamp-5`}>
              {displayText}
            </p>
            {image && (
              <div className="w-full h-16 rounded-lg overflow-hidden mt-3 ring-1 ring-border/50">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}

        {layoutVariant === 3 && (
          /* Layout 3: centered text, small circular image */
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 text-center">
            {image && (
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-border/30">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <p className={`${config.text} text-[13px] leading-relaxed line-clamp-5 px-2`}>
              {displayText}
            </p>
          </div>
        )}

        {layoutVariant === 4 && (
          /* Layout 4: image right, text left */
          <div className="flex gap-3 flex-1 min-h-0">
            <p className={`${config.text} text-[13px] leading-relaxed flex-1 line-clamp-6`}>
              {displayText}
            </p>
            {image && (
              <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border/50">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}

        {layoutVariant === 5 && (
          /* Layout 5: full bleed image bg with text overlay */
          <div className="flex-1 flex flex-col justify-end min-h-0 relative">
            {image && (
              <div className="absolute inset-0 -m-5 mt-0 rounded-lg overflow-hidden">
                <img src={image} alt="" className="w-full h-full object-cover opacity-30" />
              </div>
            )}
            <div className="relative bg-card/80 backdrop-blur-sm rounded-lg p-3">
              <p className={`${config.text} text-[13px] leading-relaxed line-clamp-5`}>
                {displayText}
              </p>
            </div>
          </div>
        )}

        {/* Bottom decoration */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className={`border-t ${config.divider} flex-1`} />
          <span className={`text-[10px] font-body px-2 ${config.accent} opacity-60 tracking-[0.15em]`}>
            私人日记
          </span>
          <div className={`border-t ${config.divider} flex-1`} />
        </div>
      </div>
    </div>
  );
};

export default NotePreview;
