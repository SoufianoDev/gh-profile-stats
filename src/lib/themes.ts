import { ThemeConfig } from "./types";

export const themes: Record<string, ThemeConfig> = {
  default: {
    name: "Default",
    bg: "#0d1117",
    text: "#c9d1d9",
    title: "#58a6ff",
    icon: "#58a6ff",
    border: "#30363d",
  },
  light: {
    name: "Light",
    bg: "#ffffff",
    text: "#24292f",
    title: "#0969da",
    icon: "#0969da",
    border: "#d0d7de",
  },
  radical: {
    name: "Radical",
    bg: "#141321",
    text: "#a9fef7",
    title: "#fe428e",
    icon: "#f8d847",
    border: "#fe428e",
  },
  tokyonight: {
    name: "Tokyo Night",
    bg: "#1a1b27",
    text: "#70a5fd",
    title: "#bf91f3",
    icon: "#38bdae",
    border: "#70a5fd",
  },
  dracula: {
    name: "Dracula",
    bg: "#282a36",
    text: "#f8f8f2",
    title: "#ff79c6",
    icon: "#bd93f9",
    border: "#6272a4",
  },
  nord: {
    name: "Nord",
    bg: "#2e3440",
    text: "#d8dee9",
    title: "#88c0d0",
    icon: "#88c0d0",
    border: "#4c566a",
  },
  gruvbox: {
    name: "Gruvbox",
    bg: "#282828",
    text: "#ebdbb2",
    title: "#fabd2f",
    icon: "#fe8019",
    border: "#3c3836",
  },
  catppuccin: {
    name: "Catppuccin",
    bg: "#1e1e2e",
    text: "#cdd6f4",
    title: "#cba6f7",
    icon: "#f5c2e7",
    border: "#313244",
  },
  ocean: {
    name: "Ocean",
    bg: "#0b1929",
    text: "#a3c4e0",
    title: "#00bfff",
    icon: "#00e5ff",
    border: "#1a3a5c",
  },
  sunset: {
    name: "Sunset",
    bg: "#1a1025",
    text: "#e8d5c4",
    title: "#ff6b6b",
    icon: "#ffa07a",
    border: "#4a2040",
  },
  forest: {
    name: "Forest",
    bg: "#0d1f0d",
    text: "#b5cea8",
    title: "#4ec9b0",
    icon: "#6a9955",
    border: "#1e3a1e",
  },
  midnight: {
    name: "Midnight",
    bg: "#020024",
    text: "#eaeaea",
    title: "#00d4ff",
    icon: "#0099ff",
    border: "#090979",
  },
};

export function resolveTheme(
  themeName: string,
  overrides: {
    bg?: string;
    text?: string;
    title_color?: string;
    icon_color?: string;
    border_color?: string;
  },
): ThemeConfig {
  const base = themes[themeName] ?? themes.default;
  return {
    ...base,
    bg: overrides.bg ? `#${overrides.bg}` : base.bg,
    text: overrides.text ? `#${overrides.text}` : base.text,
    title: overrides.title_color ? `#${overrides.title_color}` : base.title,
    icon: overrides.icon_color ? `#${overrides.icon_color}` : base.icon,
    border: overrides.border_color
      ? `#${overrides.border_color}`
      : base.border,
  };
}
