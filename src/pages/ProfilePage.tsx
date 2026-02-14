import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { useDiaryStore } from "@/lib/diary-store";
import type { DiaryEntry } from "@/lib/diary-data";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { entries } = useDiaryStore();

  // Group entries by month
  const grouped = entries.reduce<Record<string, DiaryEntry[]>>((acc, entry) => {
    const date = new Date(entry.date);
    const key = date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const sortedMonths = Object.keys(grouped).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-full hover:bg-muted gentle-transition">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-display text-xl">My journal</h1>
          <p className="text-xs font-body text-muted-foreground">{entries.length} memories collected</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <button
          onClick={() => navigate("/library")}
          className="flex-1 py-4 px-4 rounded-lg bg-card border border-border note-shadow hover:bg-muted gentle-transition text-center"
        >
          <span className="text-lg mb-1 block">🎨</span>
          <p className="text-xs font-body text-foreground font-medium">My library</p>
          <p className="text-[10px] font-body text-muted-foreground mt-0.5">Artists & styles</p>
        </button>
        <button
          onClick={() => navigate("/complete")}
          className="flex-1 py-4 px-4 rounded-lg bg-card border border-border note-shadow hover:bg-muted gentle-transition text-center"
        >
          <span className="text-lg mb-1 block">📅</span>
          <p className="text-xs font-body text-foreground font-medium">Calendar</p>
          <p className="text-[10px] font-body text-muted-foreground mt-0.5">Monthly view</p>
        </button>
      </div>

      {/* Timeline */}
      <div className="animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-display text-base">Timeline</h2>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16 rounded-lg bg-card border border-border note-shadow">
            <span className="text-3xl mb-3 block">🌱</span>
            <p className="font-display text-sm text-foreground mb-1">No memories yet</p>
            <p className="text-xs font-body text-muted-foreground">Start writing your first diary note</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-body gentle-transition hover:opacity-90"
            >
              Write now
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

            {sortedMonths.map((month) => (
              <div key={month} className="mb-6">
                {/* Month label */}
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="w-[31px] h-[31px] rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-body text-primary font-medium">
                      {month.split(" ")[0].slice(0, 3)}
                    </span>
                  </div>
                  <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">{month}</p>
                </div>

                {/* Entries */}
                <div className="space-y-2 ml-[15px] pl-6 border-l border-transparent">
                  {grouped[month].map((entry) => {
                    const date = new Date(entry.date);
                    const dayStr = date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });

                    return (
                      <div
                        key={entry.id}
                        className="relative rounded-lg bg-card border border-border p-4 note-shadow hover:note-shadow-hover gentle-transition"
                      >
                        {/* Connector dot */}
                        <div className="absolute left-[-27px] top-5 w-2 h-2 rounded-full bg-accent border border-border" />

                        <div className="flex items-start gap-3">
                          {entry.image && (
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <img src={entry.image} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-body text-muted-foreground uppercase tracking-widest mb-1">
                              {dayStr}
                            </p>
                            <p className="text-sm font-body text-foreground leading-relaxed line-clamp-3">
                              {entry.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
