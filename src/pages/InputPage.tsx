import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, ArrowRight, X } from "lucide-react";
import DailyTheme from "@/components/DailyTheme";
import { useDiaryStore } from "@/lib/diary-store";

const InputPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const { text, setText, image, setImage, setTheme } = useDiaryStore();
  const [wordCount, setWordCount] = useState(0);

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
    }
  };

  const canProceed = text.trim().length > 0;

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-2xl text-foreground mb-1">Your diary</h1>
        <p className="text-sm font-body text-muted-foreground">Write softly, decorate beautifully</p>
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
          placeholder="Begin writing…"
          className="w-full h-48 bg-card rounded-lg border border-border p-5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 gentle-transition note-shadow"
        />
        <div className="flex justify-end mt-2">
          <span className={`text-xs font-body ${wordCount > 180 ? "text-destructive" : "text-muted-foreground"}`}>
            {wordCount}/200 words
          </span>
        </div>
      </div>

      {/* Image upload */}
      <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        {image ? (
          <div className="relative w-full h-32 rounded-lg overflow-hidden note-shadow">
            <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-foreground/60 text-primary-foreground hover:bg-foreground/80 gentle-transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-8 rounded-lg border-2 border-dashed border-border hover:border-primary/30 hover:bg-card gentle-transition flex flex-col items-center gap-2"
          >
            <ImagePlus className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs font-body text-muted-foreground">Add an image</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

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
          Choose style
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InputPage;
