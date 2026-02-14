export const dailyThemes = [
  "What made you smile today?",
  "A quiet moment you noticed",
  "Something you're grateful for",
  "A color that caught your eye",
  "The sound of your morning",
  "A small kindness you witnessed",
  "What your hands did today",
  "The taste of something familiar",
  "A place that felt like home",
  "Words you didn't say",
  "The light at this hour",
  "Something you let go of",
  "A memory that surfaced",
  "What the weather felt like",
  "A conversation worth remembering",
];

export const artists = [
  {
    id: "flora",
    name: "Flora",
    subtitle: "Watercolor botanist",
    bio: "Flora draws inspiration from pressed wildflowers and vintage botanical illustrations. Her decorations feature delicate petals, trailing vines, and soft watercolor washes in muted pinks and greens.",
    style: "floral" as const,
    color: "var(--artist-a)",
  },
  {
    id: "sumi",
    name: "Sumi",
    subtitle: "Ink wash poet",
    bio: "Sumi practices the art of sumi-e, creating contemplative ink wash compositions. Her style uses bold brushstrokes, negative space, and the quiet drama of black ink on white paper.",
    style: "ink" as const,
    color: "var(--foreground)",
  },
];

export const defaultTemplate = {
  id: "default",
  name: "Classic",
  subtitle: "Clean & minimal",
  style: "geometric" as const,
};

export type ArtistStyle = "floral" | "ink" | "geometric";

export interface DiaryEntry {
  id: string;
  text: string;
  image?: string;
  style: ArtistStyle;
  date: string;
  theme: string;
}

export const calendarIcons = [
  "🌸", "🍃", "☁️", "🌙", "✨", "🕊️", "🌿", "💫",
  "🌷", "🦋", "🌾", "🍂", "❄️", "🌺", "🐚", "🌻",
  "🪶", "🎐", "🫧", "🌈", "🪷", "🧊", "🌊", "🔮",
  "🪻", "🍵", "📖", "🎨", "🪴", "🕯️", "💭",
];
