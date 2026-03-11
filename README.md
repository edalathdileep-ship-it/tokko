# PromptShrink

> Compress your AI prompts by up to 75%. Same output, fraction of the cost.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom design tokens)
- **Zustand** (state management + localStorage persistence)
- **Anthropic SDK** (real compression via Claude)
- **Zod** (API validation)
- **Lucide React** (icons)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding Your API Key

PromptShrink works in **demo mode** without an API key (mock compression). To use real Claude compression:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Go to `/dashboard/settings` in the app
3. Paste your key — it's stored in localStorage, never on our servers

Or set it server-side in `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## Project Structure

```
promptshrink/
├── app/
│   ├── api/
│   │   └── compress/route.ts    ← POST /api/compress
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx       ← Main optimizer UI
│   ├── layout.tsx
│   ├── page.tsx                 ← Landing page
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   ├── optimizer/
│   │   └── Optimizer.tsx        ← Core compression UI
│   ├── sections/                ← Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Pricing.tsx
│   │   ├── Docs.tsx
│   │   └── Sections.tsx         ← Models, Features, HowItWorks, SocialProof, CTA
│   └── ui/
│       ├── Button.tsx
│       └── Chips.tsx            ← Chip, Badge, Eyebrow, KickerPill
├── lib/
│   ├── compression.ts           ← Anthropic API + mock compression
│   ├── store.ts                 ← Zustand stores
│   └── utils.ts                 ← cn(), token counting, formatting
└── types/
    └── index.ts                 ← All TypeScript types
```

---

## API

### POST /api/compress

```json
{
  "prompt": "Your prompt text here",
  "mode": "balanced",
  "model": "claude",
  "apiKey": "sk-ant-api03-..." 
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "compressed": "Compressed prompt...",
    "originalTokens": 64,
    "compressedTokens": 18,
    "savedTokens": 46,
    "savedPct": 71.87,
    "costSaved": 0.000138,
    "mode": "balanced",
    "model": "claude",
    "timestamp": "2026-03-04T...",
    "id": "ps_1234_abc"
  }
}
```

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Set `ANTHROPIC_API_KEY` in Vercel environment variables if you want server-side compression.

---

## Roadmap

- [ ] Auth (NextAuth.js or Clerk)
- [ ] Database (Planetscale / Supabase for compression history)
- [ ] Analytics dashboard with Recharts
- [ ] Stripe billing (Pro + Teams plans)
- [ ] API key management UI
- [ ] Claude Code MCP integration
- [ ] Slack bot
