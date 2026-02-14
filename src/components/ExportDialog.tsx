import { useState, useRef, useCallback } from "react";
import { X, Download } from "lucide-react";
import NotePreview from "./NotePreview";
import type { ArtistStyle } from "@/lib/diary-data";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  text: string;
  image?: string | null;
  images?: string[];
  style: ArtistStyle;
  layoutVariant: number;
}

const ExportDialog = ({ open, onClose, text, image, images, style, layoutVariant }: ExportDialogProps) => {
  const [ratio, setRatio] = useState<"1:1" | "4:3">("1:1");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `diary-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: just alert
      alert("导出失败，请稍后再试");
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-foreground/40 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-sm bg-card rounded-2xl border-2 border-border note-shadow p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base flex items-center gap-1.5">📤 导出便签</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Ratio selector */}
        <div className="flex gap-2 mb-4">
          {(["1:1", "4:3"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRatio(r)}
              className={`flex-1 py-2 rounded-xl text-xs font-body border-2 gentle-transition ${
                ratio === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Preview with watermark */}
        <div
          ref={containerRef}
          className={`bg-card rounded-2xl overflow-hidden ${ratio === "4:3" ? "aspect-[4/3]" : "aspect-square"} flex flex-col relative`}
        >
          <div className="flex-1 flex items-center justify-center p-3">
            <div className={ratio === "4:3" ? "w-full max-w-[70%]" : "w-full"}>
              <NotePreview text={text} image={image} images={images} style={style} layoutVariant={layoutVariant} />
            </div>
          </div>
          {/* Watermark - bottom right */}
          <div className="absolute bottom-2 right-3">
            <p className="text-[8px] font-body text-muted-foreground/40 tracking-[0.15em]">
              designed by 花语
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full mt-4 py-3 rounded-2xl bg-primary text-primary-foreground font-body text-sm flex items-center justify-center gap-2 note-shadow hover:scale-[1.01] gentle-transition"
        >
          <Download className="w-4 h-4" />
          保存图片
        </button>
      </div>
    </div>
  );
};

export default ExportDialog;
