import { GitHubStats, ThemeConfig, CardOptions } from "./types";
import { escapeXml, formatNumber } from "./sanitize";

// Octicon-style SVG paths (16x16 viewBox)
const ICONS: Record<string, string> = {
  star: "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z",
  commit:
    "M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32zM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  pr: "M7.177 3.073 9.573.677A.25.25 0 0 1 10 .854v4.792a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354zM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25zM11 2.5h-1V4h1a1 1 0 0 1 1 1v5.628a2.251 2.251 0 1 0 1.5 0V5A2.5 2.5 0 0 0 11 2.5zm1 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0zM3.75 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z",
  issue:
    "M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z",
  fire: "M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.943.114 1.5-.455 1.5-.638 0-1.18-.504-1.48-1.089a3.645 3.645 0 0 1-.346-1.323 3.9 3.9 0 0 0-.6.961c-.563.767-.895 1.636-.895 2.622 0 2.52 2.168 4.5 5 4.5z",
  calendar:
    "M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0zm0 3.5h-.75a.25.25 0 0 0-.25.25V6h8.5V3.75a.25.25 0 0 0-.25-.25h-.75v.75a.75.75 0 0 1-1.5 0V3.5h-5v.75a.75.75 0 0 1-1.5 0zm-1.5 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5z",
  repo: "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8zm-8 11h8v1.5h-8a1 1 0 0 1 0-2z",
  people:
    "M5.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.49 3.49 0 0 1 2 5.5zM11 4a.75.75 0 1 0 0 1.5 1.5 1.5 0 0 1 .666 2.844.75.75 0 0 0-.416.672v.352a.75.75 0 0 0 .574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 1 0 1.434-.44 5.01 5.01 0 0 0-2.56-3.012A3 3 0 0 0 11 4z",
  graph:
    "M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042z",
};

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

function getVisibleStats(
  stats: GitHubStats,
  hide: string[],
): StatItem[] {
  const year = new Date().getFullYear();
  const all: { key: string; label: string; value: string; icon: string }[] = [
    {
      key: "stars",
      label: "Total Stars Earned",
      value: formatNumber(stats.totalStars),
      icon: "star",
    },
    {
      key: "commits",
      label: `Total Commits (${year})`,
      value: formatNumber(stats.totalCommits),
      icon: "commit",
    },
    {
      key: "prs",
      label: "Pull Requests",
      value: formatNumber(stats.totalPRs),
      icon: "pr",
    },
    {
      key: "issues",
      label: "Issues Opened",
      value: formatNumber(stats.totalIssues),
      icon: "issue",
    },
    {
      key: "streak",
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: "fire",
    },
    {
      key: "week",
      label: "Commits This Week",
      value: formatNumber(stats.commitsThisWeek),
      icon: "calendar",
    },
    {
      key: "contributions",
      label: "Contributions This Year",
      value: formatNumber(stats.contributionsThisYear),
      icon: "graph",
    },
    {
      key: "repos",
      label: "Public Repos",
      value: formatNumber(stats.publicRepos),
      icon: "repo",
    },
    {
      key: "followers",
      label: "Followers",
      value: formatNumber(stats.followers),
      icon: "people",
    },
  ];

  return all
    .filter((s) => !hide.includes(s.key))
    .map(({ label, value, icon }) => ({ label, value, icon }));
}

export function renderCard(
  stats: GitHubStats,
  theme: ThemeConfig,
  options: CardOptions,
): string {
  const visible = getVisibleStats(stats, options.hide);
  const showIcons = options.show_icons;

  const CARD_WIDTH = 495;
  const PAD_X = 25;
  const PAD_TOP = 25;
  const TITLE_H = options.hide_title ? 0 : 30;
  const GAP = 5;
  const ROW_H = 25;
  const PAD_BOT = 20;

  const statsStartY = PAD_TOP + TITLE_H + GAP;
  const cardHeight = statsStartY + visible.length * ROW_H + PAD_BOT;
  const rx = options.border_radius;

  const title = options.custom_title
    ? escapeXml(options.custom_title)
    : `${escapeXml(stats.name || stats.username)}&apos;s GitHub Stats`;

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD_X}" y="${PAD_TOP + 18}" class="title">${title}</text>`;

  const rows = visible
    .map((stat, i) => {
      const y = statsStartY + i * ROW_H;
      const iconX = PAD_X;
      const textX = PAD_X + (showIcons ? 25 : 0);
      const delay = i * 150;

      const iconSvg = showIcons
        ? `<svg x="${iconX}" y="${y}" width="16" height="16" viewBox="0 0 16 16" fill="${theme.icon}"><path d="${ICONS[stat.icon] ?? ""}"/></svg>`
        : "";

      return `    <g class="row" style="animation-delay:${delay}ms">
      ${iconSvg}
      <text x="${textX}" y="${y + 12.5}" class="label">${escapeXml(stat.label)}:</text>
      <text x="${CARD_WIDTH - PAD_X}" y="${y + 12.5}" class="value" text-anchor="end">${escapeXml(stat.value)}</text>
    </g>`;
    })
    .join("\n");

  const border = options.hide_border
    ? ""
    : ` stroke="${theme.border}" stroke-width="1"`;

  return `<svg width="${CARD_WIDTH}" height="${cardHeight}" viewBox="0 0 ${CARD_WIDTH} ${cardHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <title>${title}</title>
  <style>
    .title { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; animation: fadeIn .8s ease-in-out forwards; }
    .label { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .value { font: 700 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .row   { opacity: 0; animation: fadeIn .3s ease-in-out forwards; }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @media (prefers-reduced-motion: reduce) {
      .row, .title { animation: none !important; opacity: 1; }
    }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${CARD_WIDTH - 1}" height="${cardHeight - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
${rows}
</svg>`;
}

export function renderErrorCard(message: string, theme: ThemeConfig): string {
  const safe = escapeXml(message);
  return `<svg width="495" height="120" viewBox="0 0 495 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Error">
  <title>Error</title>
  <style>
    .err-title { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #f85149; }
    .err-msg   { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
  </style>
  <rect x="0.5" y="0.5" rx="4.5" ry="4.5" width="494" height="119" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <text x="25" y="45" class="err-title">Something went wrong</text>
  <text x="25" y="75" class="err-msg">${safe}</text>
</svg>`;
}
