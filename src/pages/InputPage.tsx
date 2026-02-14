import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, ArrowRight, X, Camera, Scissors, Loader2, User, RefreshCw, Check } from "lucide-react";
import MoodPicker from "@/components/MoodPicker";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import { useDiaryStore } from "@/lib/diary-store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { dailyThemes } from "@/lib/diary-data";

const InputPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const { text, setText, image, setImage, setTheme, mood, setMood } = useDiaryStore();
  const [wordCount, setWordCount] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [autoRemoveBg, setAutoRemoveBg] = useState(false);
  const [suggestedTheme, setSuggestedTheme] = useState("");
  const [themeAdopted, setThemeAdopted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    pickNewTheme();
  }, []);

  const pickNewTheme = () => {
    const t = dailyThemes[Math.floor(Math.random() * dailyThemes.length)];
    setSuggestedTheme(t);
    setThemeAdopted(false);
    setTheme("");
  };

  const handleRefreshTheme = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      pickNewTheme();
      setIsRefreshing(false);
    }, 300);
  };

  const handleAdoptTheme = async () => {
    setThemeAdopted(true);
    setTheme(suggestedTheme);
    toast("已采纳主题 ✨", { duration: 1000 });
    try {
      await supabase.from("theme_usage").insert({ theme: suggestedTheme, is_recommended: true });
    } catch (e) {
      console.error("Failed to record theme adoption", e);
    }
  };

  const handleDismissTheme = () => {
    setThemeAdopted(false);
    setTheme("");
  };

  const handleTextChange = (val: string) => {
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    if (words <= 200) {
      setText(val);
      setWordCount(words);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
      setShowImageMenu(false);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        setImage(dataUrl);
        setShowImageMenu(false);
        if (autoRemoveBg) {
          // Auto remove background after capture
          setIsRemoving(true);
          try {
            const { data, error } = await supabase.functions.invoke('remove-bg', {
              body: { image: dataUrl }
            });
            if (error) throw error;
            if (data?.image) {
              setImage(data.image);
              toast.success("背景已移除 ✨", { duration: 3000 });
            }
          } catch (err: any) {
            console.error('Auto remove bg error:', err);
            toast.error("自动抠图失败，可手动点击抠图按钮");
          } finally {
            setIsRemoving(false);
          }
        } else {
          toast("照片已保存 📷", { duration: 1000 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsRemoving(true);
    try {
      const { data, error } = await supabase.functions.invoke('remove-bg', {
        body: { image }
      });
      if (error) throw error;
      if (data?.image) {
        setImage(data.image);
        toast.success("背景已移除 ✨", { duration: 3000 });
      } else {
        throw new Error("未返回处理后的图片");
      }
    } catch (err: any) {
      console.error('Remove bg error:', err);
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
          <h1 className="text-2xl text-foreground mb-0.5 flex items-center gap-2 font-mono">鱼糕小盒子
            <span className="text-lg">📝</span>
          </h1>
          <p className="text-xs font-body text-muted-foreground">精心装饰你的碎碎念 ♪</p>
        </div>
        <button
          id="onboard-profile"
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-card border-2 border-kawaii-pink/30 flex items-center justify-center hover:bg-muted note-shadow gentle-transition hover:scale-105"
          aria-label="个人中心">

          <User className="w-4 h-4 text-primary" />
        </button>
      </div>

      {/* Mood picker */}
      <div id="onboard-mood" className="mb-4 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <MoodPicker selected={mood} onSelect={setMood} />
      </div>

      {/* Suggested theme + Text input */}
      <div id="onboard-text" className="mb-6 animate-slide-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
        {/* Theme suggestion bar */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <p className={`text-xs font-body flex-1 gentle-transition ${themeAdopted ? "text-primary" : "text-muted-foreground/50"}`}>
            💭 {themeAdopted ?
            <span>已采纳：「{suggestedTheme}」</span> :

            <span>推荐：{suggestedTheme}</span>
            }
          </p>
          {themeAdopted ?
          <button
            onClick={handleDismissTheme}
            className="text-[10px] font-body px-2.5 py-1 rounded-full bg-primary/10 text-primary gentle-transition hover:bg-primary/20">

              取消采纳
            </button> :

          <button
            onClick={handleAdoptTheme}
            className="text-[10px] font-body px-2.5 py-1 rounded-full bg-primary/10 text-primary gentle-transition hover:bg-primary/20 flex items-center gap-1">

              <Check className="w-3 h-3" />
              就写这个
            </button>
          }
          <button
            onClick={handleRefreshTheme}
            className="p-1.5 rounded-full hover:bg-muted gentle-transition"
            aria-label="换一个">

            <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground/50 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={themeAdopted ? `关于「${suggestedTheme}」…` : "开始书写…"}
          className="w-full h-44 bg-card rounded-2xl border-2 border-border p-5 text-sm font-body text-foreground placeholder:text-muted-foreground/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 gentle-transition note-shadow" />

        <div className="flex justify-end mt-2">
          <span className={`text-xs font-body ${wordCount > 180 ? "text-destructive" : "text-muted-foreground"}`}>
            {wordCount}/200 字
          </span>
        </div>
      </div>

      {/* Image upload */}
      <div id="onboard-camera" className="mb-8 animate-slide-up relative" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        {image ?
        <div className="relative w-full rounded-2xl overflow-hidden note-shadow border-2 border-border bg-muted/30 flex items-center justify-center" style={{ minHeight: '9rem', maxHeight: '16rem' }}>
            <img
            src={image}
            alt="已上传"
            className={`max-w-full max-h-64 object-contain gentle-transition ${isRemoving ? "opacity-50" : ""}`} />

            {isRemoving &&
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
                <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                <p className="text-xs font-body text-foreground">正在移除背景…</p>
              </div>
          }
            <div className="absolute top-2 right-2 flex gap-1.5 z-40">
              <button
              onClick={handleRemoveBackground}
              disabled={isRemoving}
              className="p-2 rounded-full bg-card/90 text-foreground hover:bg-card gentle-transition disabled:opacity-50 note-shadow"
              title="移除背景">

                <Scissors className="w-3.5 h-3.5" />
              </button>
              <button
              onClick={() => setImage(null)}
              className="p-2 rounded-full bg-card/90 text-foreground hover:bg-card gentle-transition note-shadow">

                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div> :

        <div className="relative">
            {/* Main camera button */}
            <button
            onClick={() => cameraRef.current?.click()}
            className="w-full py-7 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 hover:bg-card gentle-transition flex flex-col items-center gap-2">

              <div className="w-10 h-10 rounded-full bg-kawaii-green/15 flex items-center justify-center">
                <Camera className="w-5 h-5 text-kawaii-green" />
              </div>
              <span className="text-xs font-body text-muted-foreground">拍照</span>
            </button>


            {/* Top-right: auto remove bg toggle */}
            <button
            onClick={() => setAutoRemoveBg(!autoRemoveBg)}
            className={`absolute top-2 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-body gentle-transition border note-shadow ${
            autoRemoveBg ?
            "bg-primary/10 border-primary/30 text-primary" :
            "bg-card/80 border-border text-muted-foreground"}`
            }>

              <Scissors className="w-3 h-3" />
              自动抠图
            </button>
          </div>
        }
        <input id="file-upload" ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <input id="camera-upload"
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden" />

      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-3 bg-gradient-to-t from-background via-background to-transparent z-30">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => canProceed && navigate("/style")}
            disabled={!canProceed}
            className={`w-full py-4 rounded-2xl font-body text-sm tracking-wide flex items-center justify-center gap-2 gentle-transition ${
            canProceed ?
            "bg-primary text-primary-foreground note-shadow hover:note-shadow-hover hover:scale-[1.01]" :
            "bg-muted text-muted-foreground cursor-not-allowed"}`
            }>

            选择风格
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="h-20" />

      <OnboardingOverlay
        storageKey="onboarding-input"
        steps={[
        { targetId: "onboard-mood", message: "先告诉我你今天的心情吧，这个图标会出现在之后的月度视图中哦 🎭" },
        { targetId: "onboard-text", message: "写下你想记录的事～ ✍️" },
        { targetId: "onboard-camera", message: "还可以拍一张照片装饰你的便签，点亮抠图功能的话我会帮你抠图 📷" },
        { targetId: "onboard-profile", message: "在这里可以看到你的历史记录和素材库 📖" }]
        } />

    </div>);

};

export default InputPage;