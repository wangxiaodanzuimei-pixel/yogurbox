import floraIcon from "@/assets/artist-flora-icon.png";
import sumiIcon from "@/assets/artist-sumi-icon.png";

export const dailyThemes = [
  "今天什么让你微笑了？",
  "你注意到的一个安静时刻",
  "你感恩的一件事",
  "一种吸引你目光的颜色",
  "早晨的声音",
  "你目睹的一份小小善意",
  "今天你的双手做了什么",
  "某种熟悉的味道",
  "一个像家一样的地方",
  "你没有说出口的话",
  "此刻的光线",
  "你放下的一件事",
  "浮现的一段回忆",
  "天气给你的感觉",
  "一段值得记住的对话",
];

export const artists = [
  {
    id: "flora",
    name: "花语",
    subtitle: "水彩植物画师",
    bio: "花语从压制的野花和复古植物插画中汲取灵感。她的装饰以精致的花瓣、蔓延的藤蔓和柔和的水彩晕染为特色。",
    style: "floral" as const,
    color: "var(--artist-a)",
    icon: floraIcon,
    emoji: "🌸",
  },
  {
    id: "sumi",
    name: "墨韵",
    subtitle: "水墨诗人",
    bio: "墨韵练习水墨画艺术，创造出沉思的水墨构图。她的风格使用大胆的笔触、留白，以及黑墨在白纸上的静谧戏剧感。",
    style: "ink" as const,
    color: "var(--foreground)",
    icon: sumiIcon,
    emoji: "🖌️",
  },
];

export const defaultTemplate = {
  id: "default",
  name: "经典",
  subtitle: "简洁素雅",
  style: "geometric" as const,
};

export type ArtistStyle = "floral" | "ink" | "geometric";

export const moodIcons = [
  { emoji: "😊", label: "开心" },
  { emoji: "😌", label: "平静" },
  { emoji: "😢", label: "难过" },
  { emoji: "😴", label: "疲惫" },
  { emoji: "🤔", label: "思考" },
];

export interface DiaryEntry {
  id: string;
  text: string;
  image?: string;
  style: ArtistStyle;
  date: string;
  theme: string;
  mood?: string;
}

export const calendarIcons = [
  "🌸", "🍃", "☁️", "🌙", "✨", "🕊️", "🌿", "💫",
  "🌷", "🦋", "🌾", "🍂", "❄️", "🌺", "🐚", "🌻",
  "🪶", "🎐", "🫧", "🌈", "🪷", "🧊", "🌊", "🔮",
  "🪻", "🍵", "📖", "🎨", "🪴", "🕯️", "💭",
];
