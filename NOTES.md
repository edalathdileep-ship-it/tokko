# Tokko — Project Bible
> Read this at the start of every session to get fully up to speed.
> Update this file at the end of every session.

---

## 🏗️ What Tokko Is
A token compression SaaS. Users paste AI prompts, Tokko compresses them by up to 75%, saving money on API costs. Works with Claude, GPT-4, and Gemini.

**Tagline:** Stop wasting tokens. Ship faster.

---

## 💻 Tech Stack
| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic SDK (not wired up yet) |
| Payments | Stripe (not set up yet) |
| Hosting | Vercel — https://tokko-seven.vercel.app |

---

## 📁 Project Location
`C:\Users\royal\Desktop\promptshrink`

---

## 🔑 Environment Variables (.env.local)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=✅ set
CLERK_SECRET_KEY=✅ set
NEXT_PUBLIC_SUPABASE_URL=https://suwsxluxiaylphybyvkk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=✅ set
ANTHROPIC_API_KEY=❌ not set yet (needs purchase)
```

---

## ✅ What's Built & Working

### Landing Page (app/page.tsx)
- Hero section with demo card
- Models strip (Claude, GPT-4, Gemini, Claude Code, Mistral soon, Llama soon)
- Features section (6 features with icons from /public folder)
- How It Works (4 steps)
- Social Proof (testimonials + stats) — NOTE: all fake/placeholder
- Pricing section (Free / Pro / Teams with monthly/annual toggle)
- Docs section (Quick Start, API, JS SDK, Python SDK, Claude Code)
- CTA Banner
- Footer

### Auth (Clerk)
- Signup page: app/auth/signup/page.tsx — uses routing="hash"
- Signin page: app/auth/signin/page.tsx — uses routing="hash"
- Middleware: middleware.ts — protects /dashboard and /api/compress
- Google OAuth enabled
- Nav shows "Dashboard" when logged in, "Log in / Get started" when logged out

### Dashboard (app/dashboard/page.tsx)
- Protected by Clerk middleware
- Shows user's first name greeting
- 4 stat cards (all showing "—" placeholder, not real data yet)
- Optimizer component embedded

### Optimizer (components/optimizer/Optimizer.tsx)
- Input textarea with live token counter
- Mode selector: Balanced / Aggressive / Smart (text only, no icons)
- Model selector: Claude / GPT-4 / Gemini
- Compress button with arrow icon (no emoji)
- Mock compression working (fake results, no real AI)

### Database (Supabase)
- Table: user_profiles (id, user_id, plan, compressions_today, total_compressions, total_tokens_saved, total_cost_saved, last_reset_date, created_at)
- Table: compressions (id, user_id, original_text, compressed_text, original_tokens, compressed_tokens, saved_pct, mode, model, cost_saved, created_at)
- RLS disabled (intentional — we filter by Clerk user_id in code)
- Schema file: lib/schema.sql

### Other Files
- lib/supabase.ts — Supabase client
- lib/compression.ts — mock compression logic
- lib/utils.ts — helpers
- lib/store.ts — Zustand store
- types/index.ts — all TypeScript types
- components/ui/Button.tsx
- components/ui/Chips.tsx
- components/ui/Icons.tsx — inline SVG icons

---

## ❌ What's NOT Built Yet (honest list)

### Fake on landing page (needs to be labeled "coming soon" or removed):
- API Reference page (/docs/api) — doesn't exist
- JavaScript SDK — doesn't exist
- Python SDK — doesn't exist
- Claude Code MCP integration — doesn't exist
- Changelog page (/changelog) — doesn't exist
- Roadmap page (/roadmap) — doesn't exist
- Status page (/status) — doesn't exist
- Blog (/blog) — doesn't exist
- Careers (/careers) — doesn't exist
- About (/about) — doesn't exist
- Contact (/contact) — doesn't exist
- Privacy Policy (/privacy) — doesn't exist
- Terms of Service (/terms) — doesn't exist

### Features not built:
- Real AI compression (needs ANTHROPIC_API_KEY)
- Save compression to Supabase (code not written)
- Dashboard real stats (all showing "—")
- Compression history page
- Analytics page
- Stripe payments
- Free plan daily limit enforcement (50/day)
- Mobile responsive layout
- FAQ section (not built yet)

### Footer issues:
- Logo shows "PS" instead of "T"
- All social media links go to "#"
- Most footer links go to pages that don't exist

---

## 💰 Pricing
| Plan | Monthly | Annual |
|---|---|---|
| Free | $0 | $0 |
| Pro | $9/mo | $7/mo |
| Teams | $29/mo | $23/mo |

**Free limits:** 50 compressions/day
**Pro:** Unlimited compressions, all modes, all models, analytics, history, API
**Teams:** Everything in Pro + 10 seats, team analytics, Slack bot, priority support

---

## 🗺️ Product Roadmap (decided by user)

### Week 1–2: Standalone Web App ← WE ARE HERE
- [x] Landing page
- [x] Auth (Clerk)
- [x] Supabase database
- [ ] Real AI compression (Anthropic API) ← NEXT
- [ ] Save to database
- [ ] Real dashboard stats
- [ ] Fix footer / fake links
- [ ] FAQ section
- [ ] Mobile responsive

### Week 3–4: Chrome Extension
- [ ] Browser extension that adds compress button to Claude.ai, ChatGPT, Gemini
- [ ] One-click compression from any AI chat interface
- [ ] Freemium model to grow users

### Month 2: API Wrapper
- [ ] REST API for developers
- [ ] API keys per user
- [ ] Usage tracking and rate limiting
- [ ] JS SDK (npm install tokko)
- [ ] Python SDK (pip install tokko)
- [ ] Docs site

### Month 3+: Claude Code MCP Integration
- [ ] MCP server for Claude Code
- [ ] Auto-compress prompts inside Claude Code
- [ ] Premium tier feature
- [ ] Setup guide in docs

---

## 🖼️ Icon Files (in /public folder)
**Features section:**
- compress.svg → Prompt Compressor
- modals.svg → Multi-Model Support
- live-tokens.svg → Live Token Counter
- analytic-graph.svg → Analytics Dashboard
- smart.svg → Smart Mode
- history.svg → Compression History

**Docs section:**
- quick-start.svg → Quick Start Guide
- api.svg → REST API Reference
- code.svg → JavaScript SDK
- sdk.svg → Python SDK
- team.svg → Claude Code Integration

All icons use: `style={{ filter: 'brightness(0) invert(1)' }}` to appear white.

---

## 🎨 Design Decisions
- Dark theme only
- Accent color: green (#00e5a0)
- Font: Space Grotesk (headings) + Space Mono (labels/code)
- Border radius: rounded-2xl / rounded-3xl / rounded-4xl
- Icons: SVG files in /public folder, rendered with white color filter
- No emojis in buttons
- No bullet points in mode selector

---

## 🐛 Known Issues / Decisions Made
- Clerk routing uses `routing="hash"` on SignIn/SignUp components to avoid catch-all route errors
- Supabase RLS is disabled — filtering by Clerk user_id in application code instead
- `Zap` icon was removed from Optimizer.tsx (was causing ReferenceError)
- Footer logo still says "PS" — needs to be changed to "T"
- Testimonials and stats on landing page are all placeholder/fake

---

## 📋 Immediate Next Tasks (in order)
1. ~~Fix footer (remove dead links, fix PS logo, clean up)~~ ✅
2. ~~Add FAQ section to landing page~~ ✅
3. ~~Label "coming soon" features honestly~~ ✅
4. ~~Privacy Policy + Terms pages~~ ✅
5. Add Anthropic API key → wire up real compression
6. Save compressions to Supabase
7. Show real stats on dashboard
8. Stripe payments
9. Mobile responsive
10. ~~Deploy (Vercel)~~ ✅ → https://tokko-seven.vercel.app

---

## 🛠️ How to Run
```bash
cd C:\Users\royal\Desktop\promptshrink
npm run dev
# Opens at http://localhost:3000
```

---
*Last updated: Session 6 — Deployed to Vercel at https://tokko-seven.vercel.app*