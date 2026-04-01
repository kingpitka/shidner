# Shidner

A personal lab for code experiments, Claude-powered tools, and interactive demos.

## Setup

1. **Clone / create repo** on GitHub
2. Drop these files in the root of the repo
3. Go to **Settings → Pages → Source: Deploy from branch → main / root**
4. Site will be live at `https://yourusername.github.io/repo-name/`

## Adding a Project

1. Add an entry to `projects.json`:

```json
{
  "slug": "my-project",
  "title": "My Project",
  "description": "One sentence description for the card.",
  "tags": ["claude", "tool"],
  "date": "2025",
  "status": "Live",
  "embed_url": "projects/my-project/index.html",
  "long_description": "Longer description shown below the demo."
}
```

2. Create the folder `projects/my-project/index.html` with your project code.

That's it — the card appears on the home page automatically.

## Project Fields

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | ✓ | URL-safe identifier, no spaces |
| `title` | ✓ | Display name |
| `description` | ✓ | Short card description |
| `tags` | ✓ | Array of tag strings |
| `date` | | Year or date shown on project page |
| `status` | | "Live", "WIP", "Archived", etc. |
| `embed_url` | | Path to embed as iframe (leave `""` for no demo) |
| `long_description` | | Paragraph shown below the demo |

## Structure

```
/
├── index.html        ← shell + router
├── style.css         ← global styles
├── app.js            ← hash router + page renderer
├── projects.json     ← project registry
└── projects/
    └── my-project/
        └── index.html
```
