import { moodIcons } from "@/lib/diary-data";

interface MoodPickerProps {
  selected: string;
  onSelect: (mood: string) => void;
}

const MoodPicker = ({ selected, onSelect }: MoodPickerProps) => {
  return (
    <div className="rounded-2xl bg-card border-2 border-border px-5 py-4 note-shadow">
      <p className="text-[10px] font-body tracking-widest text-muted-foreground mb-3 flex items-center gap-1">🎭
今日心情<span>🎭</span> 今日心情
      </p>
      <div className="flex flex-wrap gap-2">
        {moodIcons.map((m) =>
        <button
          key={m.emoji}
          onClick={() => onSelect(selected === m.emoji ? "" : m.emoji)}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl gentle-transition hover:scale-110 ${
          selected === m.emoji ?
          "bg-primary/15 ring-2 ring-primary/30 scale-110" :
          "hover:bg-muted"}`
          }>

            <span className="text-lg">{m.emoji}</span>
            <span className="text-[9px] font-body text-muted-foreground">{m.label}</span>
          </button>
        )}
      </div>
    </div>);

};

export default MoodPicker;