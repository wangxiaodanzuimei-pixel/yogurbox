import type { ArtistStyle } from "@/lib/diary-data";
import floralDecoration from "@/assets/floral-decoration.png";
import inkDecoration from "@/assets/ink-decoration.png";
import geometricDecoration from "@/assets/geometric-decoration.png";

interface NotePreviewProps {
  text: string;
  image?: string | null;
  images?: string[];
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
  tape: string;
  stickerEmoji: string[];
  paperTexture: string;
}> = {
  floral: {
    card: "bg-gradient-to-br from-[hsl(350,40%,97%)] via-card to-[hsl(340,30%,95%)]",
    text: "text-foreground font-display italic",
    accent: "text-artist-a",
    dateBg: "bg-artist-a/10",
    divider: "border-artist-a/20",
    cornerDecor: true,
    stamp: "🌸",
    tape: "bg-kawaii-pink/40",
    stickerEmoji: ["🌷", "🦋", "🌿"],
    paperTexture: "bg-[radial-gradient(circle_at_20%_80%,hsl(340,40%,92%)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsl(30,40%,94%)_0%,transparent_50%)]",
  },
  ink: {
    card: "bg-gradient-to-b from-[hsl(40,20%,97%)] to-[hsl(30,10%,94%)]",
    text: "text-foreground font-body font-light tracking-wide",
    accent: "text-foreground/70",
    dateBg: "bg-foreground/5",
    divider: "border-foreground/10",
    cornerDecor: false,
    stamp: "墨",
    tape: "bg-foreground/15",
    stickerEmoji: ["🖌️", "🏔️"],
    paperTexture: "bg-[repeating-linear-gradient(0deg,transparent,transparent_23px,hsl(30,10%,88%)_23px,hsl(30,10%,88%)_24px)]",
  },
  geometric: {
    card: "bg-gradient-to-br from-[hsl(45,35%,97%)] via-card to-[hsl(40,30%,93%)]",
    text: "text-foreground font-display",
    accent: "text-gold",
    dateBg: "bg-gold/10",
    divider: "border-gold/20",
    cornerDecor: true,
    stamp: "✦",
    tape: "bg-kawaii-yellow/40",
    stickerEmoji: ["⭐", "🔮", "💎"],
    paperTexture: "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,hsl(40,25%,93%)_10px,hsl(40,25%,93%)_11px)]",
  },
};

// Tape decoration component
const TapeStrip = ({ className, rotate }: { className: string; rotate: string }) => (
  <div
    className={`absolute h-5 rounded-sm opacity-70 pointer-events-none ${className}`}
    style={{
      transform: `rotate(${rotate})`,
      width: "3.5rem",
      backdropFilter: "blur(1px)",
      backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)",
    }}
  />
);

// Washi tape on image
const WashiTape = ({ style }: { style: ArtistStyle }) => {
  const config = styleConfig[style];
  return (
    <>
      <TapeStrip className={`-top-2 -left-3 ${config.tape}`} rotate="-12deg" />
      <TapeStrip className={`-top-2 -right-3 ${config.tape}`} rotate="8deg" />
    </>
  );
};

// Corner sticker
const CornerSticker = ({ emoji, position, delay }: { emoji: string; position: string; delay: string }) => (
  <div
    className={`absolute pointer-events-none text-lg ${position}`}
    style={{
      animation: `soft-bounce 3s ease-in-out ${delay} infinite`,
      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
    }}
  >
    {emoji}
  </div>
);

const NotePreview = ({ text, image, images, style, layoutVariant }: NotePreviewProps) => {
  const config = styleConfig[style];
  const decoration = decorationMap[style];
  // Support both legacy single image and new images array
  const resolvedImage = images && images.length > 0 ? images[0] : image;
  const displayText = text || "你的文字将出现在这里…";
  const dateStr = new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
  const weekday = new Date().toLocaleDateString("zh-CN", { weekday: "short" });

  const renderImage = (className: string, containerClass: string) => {
    if (!resolvedImage) return null;
    return (
      <div className={`relative overflow-hidden ${containerClass}`}>
        <WashiTape style={style} />
        <img src={resolvedImage} alt="" className={`w-full h-full object-contain ${className}`} />
      </div>
    );
  };

  return (
    <div className={`relative w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden note-shadow gentle-transition ${config.card}`}>
      {/* Paper texture overlay */}
      <div className={`absolute inset-0 pointer-events-none opacity-60 ${config.paperTexture}`} />

      {/* Decoration overlay */}
      <img
        src={decoration}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
      />

      {/* Subtle paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Corner stickers */}
      {config.cornerDecor && (
        <>
          <CornerSticker emoji={config.stickerEmoji[0]} position="top-2 right-2" delay="0s" />
          <CornerSticker emoji={config.stickerEmoji[1] || config.stamp} position="bottom-2 left-2" delay="0.5s" />
          {config.stickerEmoji[2] && (
            <CornerSticker emoji={config.stickerEmoji[2]} position="bottom-3 right-4" delay="1s" />
          )}
        </>
      )}

      {style === "ink" && (
        <>
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none">
            <img src={decoration} alt="" className="w-full h-full object-cover" />
          </div>
          {/* Ink splatter sticker */}
          <div className="absolute bottom-3 right-3 text-sm opacity-30 pointer-events-none" style={{ animation: "gentle-pulse 4s ease-in-out infinite" }}>
            🖌️
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-5">
        {/* Date badge - styled like a cute tag/label */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`px-3 py-1.5 rounded-lg ${config.dateBg} border border-border/30`}
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <p className={`text-[10px] font-body font-medium tracking-widest ${config.accent}`}>
              {weekday} · {dateStr}
            </p>
          </div>
          {style === "ink" && (
            <span className="text-base font-display opacity-30">{config.stamp}</span>
          )}
        </div>

        {/* Decorative divider - styled like torn paper edge */}
        <div className={`border-t-2 border-dashed ${config.divider} mb-3`} />

        {/* 6 Layout variants */}
        {layoutVariant === 0 && (
          <div className="flex-1 flex flex-col min-h-0">
            {renderImage("", "w-full h-20 rounded-lg ring-1 ring-border/50 mb-3 bg-muted/20")}
            <p className={`${config.text} text-[13px] leading-relaxed flex-1 line-clamp-6`}>
              {displayText}
            </p>
          </div>
        )}

        {layoutVariant === 1 && (
          <div className="flex gap-3 flex-1 min-h-0">
            {renderImage("", "w-20 h-24 rounded-lg flex-shrink-0 ring-1 ring-border/50 bg-muted/20")}
            <p className={`${config.text} text-[13px] leading-relaxed flex-1 line-clamp-6`}>
              {displayText}
            </p>
          </div>
        )}

        {layoutVariant === 2 && (
          <div className="flex-1 flex flex-col min-h-0">
            <p className={`${config.text} text-[13px] leading-relaxed flex-1 line-clamp-5`}>
              {displayText}
            </p>
            {renderImage("", "w-full h-16 rounded-lg mt-3 ring-1 ring-border/50 bg-muted/20")}
          </div>
        )}

        {layoutVariant === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 text-center">
            {resolvedImage && (
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-border/30 bg-muted/20">
                  <img src={resolvedImage} alt="" className="w-full h-full object-cover" />
                </div>
                {/* Cute frame decoration */}
                <div className="absolute -top-1 -right-1 text-xs" style={{ animation: "sparkle 2s ease-in-out infinite" }}>✨</div>
              </div>
            )}
            <p className={`${config.text} text-[13px] leading-relaxed line-clamp-5 px-2`}>
              {displayText}
            </p>
          </div>
        )}

        {layoutVariant === 4 && (
          <div className="flex gap-3 flex-1 min-h-0">
            <p className={`${config.text} text-[13px] leading-relaxed flex-1 line-clamp-6`}>
              {displayText}
            </p>
            {renderImage("", "w-20 h-24 rounded-lg flex-shrink-0 ring-1 ring-border/50 bg-muted/20")}
          </div>
        )}

        {layoutVariant === 5 && (
          <div className="flex-1 flex flex-col justify-end min-h-0 relative">
            {resolvedImage && (
              <div className="absolute inset-0 -m-5 mt-0 rounded-lg overflow-hidden">
                <img src={resolvedImage} alt="" className="w-full h-full object-cover opacity-30" />
              </div>
            )}
            <div className="relative bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border/30">
              <p className={`${config.text} text-[13px] leading-relaxed line-clamp-5`}>
                {displayText}
              </p>
            </div>
          </div>
        )}

        {/* Bottom decoration - like a cute stamp footer */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className={`border-t border-dashed ${config.divider} flex-1`} />
          <span className={`text-[10px] font-body px-2 ${config.accent} opacity-60 tracking-[0.15em] flex items-center gap-1`}>
            {config.stamp} 私人日记
          </span>
          <div className={`border-t border-dashed ${config.divider} flex-1`} />
        </div>
      </div>
    </div>
  );
};

export default NotePreview;
