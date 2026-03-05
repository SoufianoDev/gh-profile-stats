import { GitHubStats, ContributionDay } from "./types";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const QUERY = `
query($username: String!) {
  user(login: $username) {
    name
    login
    avatarUrl
    followers {
      totalCount
    }
    repositories(
      first: 100
      ownerAffiliations: OWNER
      orderBy: { field: STARGAZERS, direction: DESC }
    ) {
      totalCount
      nodes {
        stargazerCount
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}`;

function calculateStreak(days: ContributionDay[]): {
  current: number;
  longest: number;
} {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let currentRun = 0;
  for (const day of sorted) {
    if (day.contributionCount > 0) {
      currentRun++;
      longest = Math.max(longest, currentRun);
    } else {
      currentRun = 0;
    }
  }

  // Current streak: walk backwards from today
  let current = 0;
  const today = new Date().toISOString().split("T")[0];

  for (let i = sorted.length - 1; i >= 0; i--) {
    const day = sorted[i];
    if (day.date > today) continue;

    if (day.contributionCount > 0) {
      current++;
    } else {
      // Today having 0 is OK (day isn't over yet), but past days break the streak
      if (day.date === today) continue;
      break;
    }
  }

  return { current, longest };
}

function calculateWeekCommits(days: ContributionDay[]): number {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  return days
    .filter((d) => d.date >= weekAgoStr)
    .reduce((sum, d) => sum + d.contributionCount, 0);
}

export async function fetchGitHubStats(
  username: string,
): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "github-profile-stats",
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with status ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    const msg = json.errors[0]?.message ?? "Unknown GraphQL error";
    throw new Error(msg);
  }

  const user = json.data?.user;
  if (!user) {
    throw new Error(`User "${username}" not found`);
  }

  const contrib = user.contributionsCollection;
  const calendar = contrib.contributionCalendar;

  const allDays: ContributionDay[] = calendar.weeks.flatMap(
    (w: { contributionDays: ContributionDay[] }) => w.contributionDays,
  );

  const totalStars = user.repositories.nodes.reduce(
    (sum: number, repo: { stargazerCount: number }) =>
      sum + repo.stargazerCount,
    0,
  );

  const { current, longest } = calculateStreak(allDays);

  return {
    username: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    totalStars,
    totalCommits: contrib.totalCommitContributions,
    totalPRs: contrib.totalPullRequestContributions,
    totalIssues: contrib.totalIssueContributions,
    currentStreak: current,
    longestStreak: longest,
    commitsThisWeek: calculateWeekCommits(allDays),
    publicRepos: user.repositories.totalCount,
    followers: user.followers.totalCount,
    contributionsThisYear: calendar.totalContributions,
  };
}
