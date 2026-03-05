export interface GitHubStats {
  username: string;
  name: string | null;
  avatarUrl: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  currentStreak: number;
  longestStreak: number;
  commitsThisWeek: number;
  publicRepos: number;
  followers: number;
  contributionsThisYear: number;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ThemeConfig {
  name: string;
  bg: string;
  text: string;
  title: string;
  icon: string;
  border: string;
}

export interface CardOptions {
  theme: string;
  hide_border: boolean;
  hide_title: boolean;
  hide: string[];
  show_icons: boolean;
  border_radius: number;
  custom_title?: string;
}

export type StatKey =
  | "stars"
  | "commits"
  | "prs"
  | "issues"
  | "streak"
  | "week"
  | "repos"
  | "followers"
  | "contributions";
