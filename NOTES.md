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
| AI | Anthropic SDK ✅ wired up with server-side key |
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
ANTHROPIC_API_KEY=✅ set (server-side only, never exposed to browser)
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
- 4 stat cards — ALL SHOWING REAL DATA from Supabase ✅
  - Tokens saved (formatted: 1.2k, 3.4M etc)
  - Compressions (total count)
  - Avg reduction (% from compressions table)
  - Cost saved (formatted as $0.00)
- Optimizer component embedded

### Optimizer (components/optimizer/Optimizer.tsx)
- Input textarea with live token counter
- Mode selector: Balanced / Aggressive / Smart
- Model selector: Claude / GPT-4 / Gemini
- Compress button with arrow icon
- ✅ Real Claude compression via server-side ANTHROPIC_API_KEY
- ✅ useEffect and useRouter properly imported
- ✅ Error clears when user types
- ✅ Reset button shows when input or result exists
- ✅ router.refresh() after compression — dashboard stats update live
- ✅ Upgrade modal when free user hits 50/day limit
- ✅ Progress bar turns red when limit reached
- Falls back to mock if no API key set

### Security & Rate Limiting
- lib/security.ts — sanitizePrompt, isPromptTooLarge, safeErrorMessage (never leaks keys/paths)
- lib/rateLimit.ts — checkAndIncrementUsage (server-side 50/day enforcement), saveCompression
- Both wired into app/api/compress/route.ts
- ✅ Stats now increment correctly (fixed replace → increment bug)

### API Route (app/api/compress/route.ts)
1. Auth check — must be logged in (Clerk)
2. Request size guard — blocks payloads over 1MB
3. Input validation — Zod schema
4. Sanitization — strips null bytes, control chars
5. Server-side rate limiting — checks Supabase, enforces 50/day for free plan
6. Compression — real Claude AI
7. Save to Supabase — compressions table + user_profiles stats
8. Safe error messages — never leaks API keys or internal paths

### Database (Supabase)
- Table: user_profiles (id, user_id, plan, compressions_today, total_compressions, total_tokens_saved, total_cost_saved, last_reset_date, created_at)
- Table: compressions (id, user_id, original_text, compressed_text, original_tokens, compressed_tokens, saved_pct, mode, model, cost_saved, created_at)
- RLS disabled (intentional — we filter by Clerk user_id in code)
- Schema file: lib/schema.sql

### Settings Page (app/dashboard/settings/page.tsx)
- Profile section — shows name, email, avatar, member since
- ✅ API Token section — Generate Token button, copy token, warns it won't show again
- Plan & Billing section — shows current plan, upgrade CTA
- Preferences section — UI only, not functional yet
- Danger Zone — delete account UI only, not functional yet

### Chrome Extension (tokko-extension/)
- Separate folder — NOT part of the Next.js app
- Location: Desktop/tokko-extension (extracted from zip)
- Files: manifest.json, content.js, content.css, popup.html, popup.js, background.js, icons/
- ✅ Floating dark frosted glass button — subtle, professional
- ✅ Green T badge branding
- ✅ Button stays visible + pulses during compression
- ✅ Token-based auth via background service worker
- ✅ Compression works via /api/compress-ext endpoint
- ✅ Mode selector in popup (Balanced/Aggressive/Smart)
- ✅ Toast notifications (dark with colored text)
- ✅ Handles extension context invalidated gracefully
- Current version: v7
- IMPORTANT: After reloading extension, always refresh claude.ai tab
- To update: extract new zip → chrome://extensions → reload → refresh claude.ai

### API Routes
- app/api/compress/route.ts — main web app compression (Clerk auth)
- app/api/compress-ext/route.ts — extension compression (API token auth)
- app/api/generate-token/route.ts — generates API token for extension
- app/api/status/route.ts — health check for extension popup

### Database (Supabase) — UPDATED
- user_profiles now has `api_token` column (TEXT UNIQUE)
- Run this SQL if not done: `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS api_token TEXT UNIQUE;`

---

## ❌ What's NOT Built Yet (honest list)
- Analytics page
- Stripe payments
- Settings preferences actually saving
- Settings delete account actually working
- Landing page dead links (/blog, /about, /contact etc)
- Chrome Extension not on Chrome Web Store yet (dev mode only)
- Extension needs testing end-to-end with real token flow

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

### Week 1–2: Standalone Web App ✅ DONE
- [x] Landing page
- [x] Auth (Clerk)
- [x] Supabase database
- [x] Real AI compression (Anthropic API)
- [x] Save to database
- [x] Real dashboard stats
- [x] Security (sanitize, rate limit, safe errors)
- [x] Mobile responsive
- [x] Profile dropdown nav
- [x] Settings page
- [x] FAQ, Privacy, Terms pages

### Week 3–4: Chrome Extension ✅ DONE
- [x] Floating compress button on Claude.ai
- [x] Token-based auth system
- [x] Mode selector in popup
- [x] compress-ext API route
- [x] Generate token in Settings
- [x] Background service worker for storage
- [x] CORS fixed
- [x] Text replacement working
- [ ] Submit to Chrome Web Store ← NEXT
- [ ] Add ChatGPT + Gemini support

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
- Clerk routing uses `routing="hash"` on SignIn/SignUp components
- Supabase RLS disabled — filtering by Clerk user_id in app code
- `Zap` icon removed from Optimizer.tsx — do NOT re-add (causes ReferenceError)
- API key is server-side only — never sent from browser
- useEffect and useRouter MUST be imported in Optimizer.tsx
- `saved_pct` column in Supabase is integer — always use Math.round() before saving
- Testimonials and stats on landing page are placeholder/fake
- `url.parse()` deprecation warning in Vercel logs — harmless, comes from Supabase SDK
- Settings page preferences/delete are UI only — not functional yet
- Landing page has dead links (/blog, /about, /contact etc) — not built yet

---

## 📋 Next Steps (in priority order)

### Immediate
1. **Submit to Chrome Web Store** — make it available to everyone
2. **BYOK pricing** — restructure to Free / BYOK $3 / Pro $9
3. **Landing page messaging** — show real dollar savings
4. **Add ChatGPT + Gemini** to extension

### Then
5. Stripe payments
6. REST API + SDK for developers

---

## 🛠️ How to Run
```bash
cd C:\Users\royal\Desktop\promptshrink
npm run dev
# Opens at http://localhost:3000
```

## 🧩 Chrome Extension
- Location: Desktop/tokko-extension/
- To reload after changes: chrome://extensions → click reload on Tokko
- To test: claude.ai → click input → green Compress button appears

---
*Last updated: Session 14 — Extension v7 complete. Dark frosted button, pulsing loader, graceful error handling. Next: Chrome Web Store submission + BYOK pricing.*