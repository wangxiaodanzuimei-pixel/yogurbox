import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, ArrowRight, X, Camera, Scissors, Loader2, User } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import DailyTheme from "@/components/DailyTheme";
import { useDiaryStore } from "@/lib/diary-store";
import { toast } from "sonner";

const InputPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const { text, setText, image, setImage, setTheme } = useDiaryStore();
  const [wordCount, setWordCount] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);

  const handleTextChange = (val: string) => {
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    if (words <= 200) {
      setText(val);
      setWordCount(words);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    setShowImageMenu(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsRemoving(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const result = await removeBackground(blob);
      const url = URL.createObjectURL(result);
      setImage(url);
      toast("背景已移除 ✨");
    } catch {
      toast.error("无法移除背景，请尝试其他图片");
    } finally {
      setIsRemoving(false);
    }
  };

  const canProceed = text.trim().length > 0;

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">我的日记</h1>
          <p className="text-sm font-body text-muted-foreground">轻声书写，精心装饰</p>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted note-shadow gentle-transition"
          aria-label="个人中心"
        >
          <User className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Daily theme */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <DailyTheme onThemeChange={setTheme} />
      </div>

      {/* Text input */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="开始书写…"
          className="w-full h-48 bg-card rounded-lg border border-border p-5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 gentle-transition note-shadow"
        />
        <div className="flex justify-end mt-2">
          <span className={`text-xs font-body ${wordCount > 180 ? "text-destructive" : "text-muted-foreground"}`}>
            {wordCount}/200 字
          </span>
        </div>
      </div>

      {/* Image upload */}
      <div className="mb-8 animate-slide-up relative" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        {image ? (
          <div className="relative w-full h-40 rounded-lg overflow-hidden note-shadow">
            <img
              src={image}
              alt="已上传"
              className={`w-full h-full object-cover gentle-transition ${isRemoving ? "opacity-50" : ""}`}
            />
            {isRemoving && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
                <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                <p className="text-xs font-body text-foreground">正在移除背景…</p>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button
                onClick={handleRemoveBackground}
                disabled={isRemoving}
                className="p-1.5 rounded-full bg-foreground/60 text-primary-foreground hover:bg-foreground/80 gentle-transition disabled:opacity-50"
                title="移除背景"
              >
                <Scissors className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setImage(null)}
                className="p-1.5 rounded-full bg-foreground/60 text-primary-foreground hover:bg-foreground/80 gentle-transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowImageMenu(!showImageMenu)}
              className="w-full py-8 rounded-lg border-2 border-dashed border-border hover:border-primary/30 hover:bg-card gentle-transition flex flex-col items-center gap-2"
            >
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs font-body text-muted-foreground">添加图片</span>
            </button>

            {showImageMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-card border border-border note-shadow z-20 overflow-hidden animate-slide-up">
                <button
                  onClick={() => {
                    fileRef.current?.click();
                    setShowImageMenu(false);
                  }}
                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-muted gentle-transition text-left"
                >
                  <ImagePlus className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-body text-foreground">从相册选择</p>
                    <p className="text-[11px] font-body text-muted-foreground">选择已有的照片</p>
                  </div>
                </button>
                <div className="border-t border-border" />
                <button
                  onClick={() => {
                    cameraRef.current?.click();
                    setShowImageMenu(false);
                  }}
                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-muted gentle-transition text-left"
                >
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-body text-foreground">拍照抠图</p>
                    <p className="text-[11px] font-body text-muted-foreground">拍照并自动去除背景</p>
                  </div>
                </button>
              </div>
            )}
          </>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = async (ev) => {
                const dataUrl = ev.target?.result as string;
                setImage(dataUrl);
                setIsRemoving(true);
                try {
                  const resp = await fetch(dataUrl);
                  const blob = await resp.blob();
                  const result = await removeBackground(blob);
                  const url = URL.createObjectURL(result);
                  setImage(url);
                  toast("背景已移除 ✨");
                } catch {
                  toast("照片已保存（背景移除不可用）");
                } finally {
                  setIsRemoving(false);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
        />
      </div>

      {showImageMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowImageMenu(false)} />
      )}

      {/* Next button */}
      <div className="animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
        <button
          onClick={() => canProceed && navigate("/style")}
          disabled={!canProceed}
          className={`w-full py-4 rounded-lg font-body text-sm tracking-wide flex items-center justify-center gap-2 gentle-transition ${
            canProceed
              ? "bg-primary text-primary-foreground note-shadow hover:note-shadow-hover"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          选择风格
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InputPage;
