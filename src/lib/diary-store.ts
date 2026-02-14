import { create } from "zustand";
import type { ArtistStyle, DiaryEntry } from "./diary-data";

interface DiaryState {
  // Current note being created
  text: string;
  image: string | null;
  theme: string;
  mood: string;
  selectedStyle: ArtistStyle;
  layoutVariant: number;

  // Saved entries
  entries: DiaryEntry[];
  savedArtists: string[];

  // Actions
  setText: (text: string) => void;
  setImage: (image: string | null) => void;
  setTheme: (theme: string) => void;
  setMood: (mood: string) => void;
  setSelectedStyle: (style: ArtistStyle) => void;
  cycleLayout: () => void;
  saveEntry: (entry: DiaryEntry) => void;
  updateEntry: (entry: DiaryEntry) => void;
  loadEntry: (entry: DiaryEntry) => void;
  editingEntryId: string | null;
  toggleSavedArtist: (artistId: string) => boolean;
  reset: () => void;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  text: "",
  image: null,
  theme: "",
  mood: "",
  selectedStyle: "floral",
  layoutVariant: 0,
  entries: [],
  savedArtists: ["flora", "sumi"],
  editingEntryId: null,

  setText: (text) => set({ text }),
  setImage: (image) => set({ image }),
  setTheme: (theme) => set({ theme }),
  setMood: (mood) => set({ mood }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  cycleLayout: () => set((s) => ({ layoutVariant: (s.layoutVariant + 1) % 6 })),
  saveEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
  updateEntry: (entry) => set((s) => ({
    entries: s.entries.map((e) => (e.id === entry.id ? entry : e)),
    editingEntryId: null,
  })),
  loadEntry: (entry) => set({
    text: entry.text,
    image: entry.image || null,
    selectedStyle: entry.style,
    mood: entry.mood || "",
    editingEntryId: entry.id,
  }),
  toggleSavedArtist: (artistId) => {
    const { savedArtists } = get();
    if (savedArtists.includes(artistId)) {
      set({ savedArtists: savedArtists.filter((id) => id !== artistId) });
      return true;
    }
    if (savedArtists.length >= 5) return false;
    set({ savedArtists: [...savedArtists, artistId] });
    return true;
  },
  reset: () => set({ text: "", image: null, mood: "", selectedStyle: "floral", layoutVariant: 0, editingEntryId: null }),
}));
