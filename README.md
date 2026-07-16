# Minh Thu — Marketing Portfolio

A statically-generated marketing portfolio built with **Next.js 14 (App Router)**,
**Tailwind CSS** and **Framer Motion**.

## Editing content

All user-editable content lives in [`content/content.json`](content/content.json).
No code changes are needed to update text, stats, projects or images — see
**[HOW-TO-EDIT.md](HOW-TO-EDIT.md)** (tiếng Việt) for a step-by-step guide.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages statically generated)
npm start        # serve the production build
```

## Project structure

| Path | Purpose |
|------|---------|
| `content/content.json` | All editable content (site, hero, contact, projects) |
| `public/assets/` | Project images |
| `app/` | Routes: `/` (home) and `/project/[id]` (detail) |
| `components/` | UI components |
| `lib/content.ts` | Typed loader for `content.json` |
| `lib/motion.ts` | Centralized Framer Motion config |

Deployed on **Vercel** — every commit to the main branch auto-deploys.
