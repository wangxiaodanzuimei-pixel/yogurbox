import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { calendarIcons, type DiaryEntry } from "@/lib/diary-data";

interface CalendarViewProps {
  entries: DiaryEntry[];
}

const CalendarView = ({ entries }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthName = currentDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const hasEntry = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return entries.some((e) => e.date === dateStr);
  };

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const getIcon = (day: number) => calendarIcons[(day - 1) % calendarIcons.length];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-muted gentle-transition">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="font-display text-base">{monthName}</h3>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-muted gentle-transition">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["日", "一", "二", "三", "四", "五", "六"].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-body text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const filled = hasEntry(day);
          const todayClass = isToday(day);

          return (
            <div
              key={day}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs gentle-transition ${
                todayClass ? "bg-primary/10 ring-1 ring-primary/30" : ""
              } ${filled ? "bg-accent/20" : ""}`}
            >
              <span className="text-[10px] text-muted-foreground">{day}</span>
              {filled && <span className="text-sm mt-0.5">{getIcon(day)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
