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
- Hero: "Stop wasting tokens. Ship faster." tagline
- Hero shows real dollar savings — cost per call before/after, $142/mo savings at scale
- ModelsStrip — Claude, GPT-4, Gemini, Claude Code, Mistral/Llama soon
- Features section — 6 real features
- How It Works — 4 steps
- Social Proof — placeholder testimonials + stats
- Chrome Extension section — Claude.ai LIVE, ChatGPT/Gemini SOON badges
- Pricing — Free / BYOK $3 / Pro $9 (see pricing section)
- FAQ — updated, no fake API/SDK mentions
- CTA Banner
- Footer

### Pricing (updated)
- Free: 20 compressions/day, Balanced mode only, Claude only
- BYOK: $3/mo ($2 annual) — bring your own Anthropic key, unlimited, all modes
- Pro: $9/mo ($7 annual) — we handle everything, all models, analytics, API

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

### Logo & Branding
- public/tokko_logo.svg — wordmark "TOKKO" in white, used in Nav + Footer only
- public/tokko_icon.svg — green rounded square with T, used for favicon + extension
- Nav: wordmark only, no icon next to it
- Footer: wordmark only
- Favicon: tokko_icon.svg
- Extension icons: PNG versions at 16x48x128px
- Nav dropdown icons (all in /public):
  - icon-dashboard.svg — Dashboard menu item
  - icon-history.svg — History menu item
  - icon-settings.svg — Settings menu item
  - icon-signout.svg — Sign out button

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
- Current version: v8
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

## ❌ What's NOT Built Yet
- Stripe payments (BYOK $3 + Pro $9)
- BYOK key storage in settings (user pastes their Anthropic key)
- Settings preferences actually saving
- Settings delete account actually working
- Chrome Extension not on Chrome Web Store yet (dev mode only)
- ChatGPT + Gemini extension support
- Real testimonials (all placeholder)
- Analytics page in dashboard

---

### Pricing (current)
- Free: 20 compressions/day, Balanced mode only, Claude only
- BYOK: $3/mo ($2 annual) — bring your own Anthropic key, unlimited, all modes
- Pro: $9/mo ($7 annual) — we handle everything, all models, analytics, API

---

## 🗺️ Product Roadmap

### Phase 1: Web App ✅ DONE
### Phase 2: Chrome Extension ✅ DONE (Claude.ai)
### Phase 3: Monetisation ← CURRENT
- [ ] Chrome Web Store submission
- [ ] Stripe payments — BYOK ($3) + Pro ($9)
- [ ] BYOK key in Settings
- [ ] ChatGPT + Gemini extension

### Phase 4: Growth
- [ ] Real testimonials from early users
- [ ] Analytics dashboard page
- [ ] REST API for developers

---

## 📋 Next Steps (in priority order)
1. **Chrome Web Store submission**
2. **Stripe payments** — BYOK $3 + Pro $9
3. **BYOK key in settings** — store user's Anthropic key encrypted
4. **ChatGPT + Gemini** extension support

## 🎨 Design Decisions
- Dark theme only
- Accent color: green (#00e5a0)
- Font: Space Grotesk (headings) + Space Mono (labels/code)
- Border radius: rounded-2xl / rounded-3xl / rounded-4xl
- No emojis in buttons or nav — use SVG icons
- Wordmark only in Nav and Footer (no icon next to it)
- Target audience: everyone who uses AI, NOT just developers

## 🐛 Known Issues / Decisions Made
- Clerk routing uses `routing="hash"` on SignIn/SignUp components
- Supabase RLS disabled — filtering by Clerk user_id in app code
- `Zap` icon removed from Optimizer.tsx — do NOT re-add (causes ReferenceError)
- API key is server-side only — never sent from browser
- useEffect and useRouter MUST be imported in Optimizer.tsx
- `saved_pct` column in Supabase is integer — always use Math.round() before saving
- Testimonials and stats on landing page are placeholder/fake
- `url.parse()` deprecation warning in Vercel logs — harmless, from Supabase SDK
- Settings page preferences/delete are UI only — not functional yet
- After reloading Chrome extension, always refresh claude.ai tab
- Compression prompts updated — Claude never completes tasks, only compresses text
- Retry logic added — if output longer than input, retries with stricter prompt

---

## 🛠️ How to Run
```bash
cd C:\Users\royal\Desktop\promptshrink
npm run dev
# Opens at http://localhost:3000
```

## 🧩 Chrome Extension
- Location: Desktop/tokko-extension/
- Current version: v9
- To reload: chrome://extensions → reload → refresh claude.ai
- To test: claude.ai → click input → Compress button appears

---
*Last updated: Session 17 — Custom nav icons (dashboard/history/settings/signout), wordmark logo, removed developer language, compression retry logic, extension v9 with real T icon.*