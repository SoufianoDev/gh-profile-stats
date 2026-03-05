# GitHub Profile Stats

Dynamically generated GitHub stats cards for your profile README. Deploy your own instance on Vercel, swap in your username, and embed a beautiful, always-up-to-date stats card anywhere Markdown or HTML images are supported.

## Features

- **Live stats** — commits, PRs, issues, stars, streak, weekly activity, and more
- **12 built-in themes** — Default, Light, Radical, Tokyo Night, Dracula, Nord, Gruvbox, Catppuccin, Ocean, Sunset, Forest, Midnight
- **Fully customisable** — override any colour, hide individual stats, change title, border radius, and more via query parameters
- **SVG output** — crisp at any size, works in GitHub READMEs
- **Fast** — edge-cached for 30 minutes with stale-while-revalidate
- **Accessible** — respects `prefers-reduced-motion`, has proper ARIA labels
- **Interactive website** — landing page with live preview and copy-paste embed code

## Quick Start

### 1. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/github-profile-stats)

Or deploy manually:

```bash
git clone https://github.com/YOUR_USERNAME/github-profile-stats.git
cd github-profile-stats
npm install
```

### 2. Set Up GitHub Token

Create a [Personal Access Token (classic)](https://github.com/settings/tokens) with the `read:user` scope.

Copy `.env.example` to `.env` and paste your token:

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

On Vercel, add `GITHUB_TOKEN` as an environment variable in the project settings.

### 3. Use It

Add this to your `README.md`:

```markdown
![GitHub Stats](https://your-deploy.vercel.app/api/card?username=YOUR_USERNAME)
```

Replace `your-deploy.vercel.app` with your actual Vercel deployment URL.

## Parameters

All parameters are passed as URL query strings.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `username` | string | **required** | GitHub username |
| `theme` | string | `default` | Theme preset name |
| `bg` | hex | — | Background colour (without `#`) |
| `text` | hex | — | Text colour |
| `title_color` | hex | — | Title colour |
| `icon_color` | hex | — | Icon colour |
| `border_color` | hex | — | Border colour |
| `hide_border` | boolean | `false` | Remove the card border |
| `hide_title` | boolean | `false` | Remove the title |
| `show_icons` | boolean | `true` | Show stat icons |
| `hide` | string | — | Comma-separated stat keys to hide |
| `border_radius` | number | `4.5` | Corner radius (`0`–`50`) |
| `custom_title` | string | — | Override the title text |

### Hideable Stats

| Key | Stat |
|---|---|
| `stars` | Total Stars Earned |
| `commits` | Total Commits (year) |
| `prs` | Pull Requests |
| `issues` | Issues Opened |
| `streak` | Current Streak |
| `week` | Commits This Week |
| `contributions` | Contributions This Year |
| `repos` | Public Repos |
| `followers` | Followers |

### Examples

Default card:
```
/api/card?username=octocat
```

Tokyo Night theme, hiding issues and followers:
```
/api/card?username=octocat&theme=tokyonight&hide=issues,followers
```

Custom colours:
```
/api/card?username=octocat&bg=000000&text=ffffff&title_color=ff6b6b&icon_color=ffa07a
```

## Themes

| Theme | Preview colours |
|---|---|
| `default` | Dark GitHub style |
| `light` | Light GitHub style |
| `radical` | Neon pink / cyan |
| `tokyonight` | Purple / blue night |
| `dracula` | Classic Dracula palette |
| `nord` | Arctic blue-grey |
| `gruvbox` | Warm retro |
| `catppuccin` | Pastel mocha |
| `ocean` | Deep blue |
| `sunset` | Warm reds / oranges |
| `forest` | Greens |
| `midnight` | Ultra-dark blue |

Visit the landing page of your deployment to see a live gallery.

## Architecture

```
src/
├── app/
│   ├── api/card/route.ts   ← SVG card API endpoint
│   ├── layout.tsx           ← Root layout
│   ├── page.tsx             ← Landing page with docs + preview
│   └── globals.css
├── components/
│   └── CardPreview.tsx      ← Interactive client-side preview
└── lib/
    ├── types.ts             ← Shared TypeScript types
    ├── themes.ts            ← Theme definitions + resolver
    ├── sanitize.ts          ← Input sanitisation helpers
    ├── github.ts            ← GitHub GraphQL data fetching
    └── svg.ts               ← SVG card renderer
```

### How It Works

1. A request hits `/api/card?username=octocat`
2. The API route validates and sanitises all parameters
3. `github.ts` queries the GitHub GraphQL API for the user's stats (commits, PRs, issues, stars, contribution calendar)
4. Streak and weekly commit counts are computed from the contribution calendar
5. `svg.ts` renders a styled SVG card with the data
6. The response is served with `Cache-Control` headers for edge caching (30-minute TTL)

### Caching

Responses include:
```
Cache-Control: public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600
```

This means:
- Vercel's CDN caches the image for **30 minutes**
- After expiry, stale content is served while a fresh copy is generated in the background (up to 1 hour)

### Security

- All user input (username, custom title, colours) is sanitised before inclusion in SVG
- Username validation: alphanumeric + hyphens, 1–39 characters (GitHub's rules)
- Colour parameters: validated as hex strings only
- XML entities are escaped to prevent SVG injection / XSS
- The GitHub token is server-side only, never exposed to the client

## Development

```bash
npm install
cp .env.example .env   # Add your GitHub token
npm run dev             # http://localhost:3000
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (landing page)
- **GitHub GraphQL API**
- **Vercel** (deployment + edge caching)

## License

MIT
