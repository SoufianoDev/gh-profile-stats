"use client";

import { useState, useEffect, useCallback } from "react";

const THEME_NAMES = [
  "default",
  "light",
  "radical",
  "tokyonight",
  "dracula",
  "nord",
  "gruvbox",
  "catppuccin",
  "ocean",
  "sunset",
  "forest",
  "midnight",
];

const STAT_OPTIONS = [
  { key: "stars", label: "Stars" },
  { key: "commits", label: "Commits" },
  { key: "prs", label: "PRs" },
  { key: "issues", label: "Issues" },
  { key: "streak", label: "Streak" },
  { key: "week", label: "This Week" },
  { key: "contributions", label: "Contributions" },
  { key: "repos", label: "Repos" },
  { key: "followers", label: "Followers" },
];

export default function CardPreview() {
  const [username, setUsername] = useState("octocat");
  const [theme, setTheme] = useState("default");
  const [showIcons, setShowIcons] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [hiddenStats, setHiddenStats] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState("");
  const [borderRadius, setBorderRadius] = useState("4.5");
  const [copied, setCopied] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [origin, setOrigin] = useState("https://your-deploy.vercel.app");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const buildUrl = useCallback(
    (base: string) => {
      const p = new URLSearchParams();
      p.set("username", username);
      if (theme !== "default") p.set("theme", theme);
      if (!showIcons) p.set("show_icons", "false");
      if (hideBorder) p.set("hide_border", "true");
      if (hideTitle) p.set("hide_title", "true");
      if (hiddenStats.length) p.set("hide", hiddenStats.join(","));
      if (customTitle.trim()) p.set("custom_title", customTitle.trim());
      if (borderRadius !== "4.5") p.set("border_radius", borderRadius);
      return `${base}/api/card?${p.toString()}`;
    },
    [
      username,
      theme,
      showIcons,
      hideBorder,
      hideTitle,
      hiddenStats,
      customTitle,
      borderRadius,
    ],
  );

  // Debounced preview URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username.trim()) {
        setImgUrl(buildUrl(""));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [username, buildUrl]);

  const embedUrl = buildUrl(origin);
  const markdownCode = `![GitHub Stats](${embedUrl})`;
  const htmlCode = `<img src="${embedUrl}" alt="GitHub Stats" />`;

  function toggleStat(key: string) {
    setHiddenStats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Controls */}
      <div className="space-y-5">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-[#8b949e] mb-1.5">
            GitHub Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="octocat"
            className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-[#c9d1d9] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-[#8b949e] mb-1.5">
            Theme
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-[#c9d1d9] focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
          >
            {THEME_NAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Title */}
        <div>
          <label className="block text-sm font-medium text-[#8b949e] mb-1.5">
            Custom Title{" "}
            <span className="text-[#484f58] font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="My Awesome Stats"
            className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-[#c9d1d9] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium text-[#8b949e] mb-1.5">
            Border Radius: {borderRadius}
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="0.5"
            value={borderRadius}
            onChange={(e) => setBorderRadius(e.target.value)}
            className="w-full accent-[#58a6ff]"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showIcons}
              onChange={(e) => setShowIcons(e.target.checked)}
              className="accent-[#58a6ff] w-4 h-4"
            />
            Show Icons
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={hideBorder}
              onChange={(e) => setHideBorder(e.target.checked)}
              className="accent-[#58a6ff] w-4 h-4"
            />
            Hide Border
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={hideTitle}
              onChange={(e) => setHideTitle(e.target.checked)}
              className="accent-[#58a6ff] w-4 h-4"
            />
            Hide Title
          </label>
        </div>

        {/* Hide Stats */}
        <div>
          <label className="block text-sm font-medium text-[#8b949e] mb-1.5">
            Hide Stats
          </label>
          <div className="flex flex-wrap gap-2">
            {STAT_OPTIONS.map((stat) => (
              <button
                key={stat.key}
                onClick={() => toggleStat(stat.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  hiddenStats.includes(stat.key)
                    ? "border-[#f85149] bg-[#f8514920] text-[#f85149] line-through"
                    : "border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:border-[#58a6ff]"
                }`}
              >
                {stat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview + Embed Code */}
      <div className="space-y-5">
        {/* Live Preview */}
        <div>
          <h3 className="text-sm font-medium text-[#8b949e] mb-3">
            Live Preview
          </h3>
          <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6 flex items-center justify-center min-h-[200px]">
            {imgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={imgUrl}
                src={imgUrl}
                alt="Stats card preview"
                className="max-w-full"
              />
            ) : (
              <p className="text-[#484f58] text-sm">
                Enter a username to see the preview
              </p>
            )}
          </div>
        </div>

        {/* Markdown Embed */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-sm font-medium text-[#8b949e]">Markdown</h3>
            <button
              onClick={() => copyToClipboard(markdownCode)}
              className="text-xs text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-3 text-xs text-[#c9d1d9] overflow-x-auto whitespace-pre-wrap break-all">
            {markdownCode}
          </pre>
        </div>

        {/* HTML Embed */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-sm font-medium text-[#8b949e]">HTML</h3>
            <button
              onClick={() => copyToClipboard(htmlCode)}
              className="text-xs text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-3 text-xs text-[#c9d1d9] overflow-x-auto whitespace-pre-wrap break-all">
            {htmlCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
