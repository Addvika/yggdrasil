# Yggdrasil — Collaborator Onboarding Brief

**Screen Sage Studios · May 2026 · Deadline: August 17, 2026**

---

## What We're Building

Yggdrasil is an AI-powered semantic journaling web app. Users write journal entries; the app automatically extracts themes, emotions, people, and patterns from each one, then surfaces insights, goal suggestions, and a visual knowledge graph of connections across their entire journal history.

We're rebuilding it from scratch on a Google-native stack and entering it into the **Build with Gemini XPRIZE hackathon** (Education & Human Potential category, $2M prize pool). The submission deadline is **August 17, 2026.** Everything we do is scoped to that date.

---

## The App at a Glance

The app has five main tabs and a floating AI companion:

| Tab | What it does |
|---|---|
| **Journal** | Rich text composer. Users write entries with mood, tags, and entry type. On save, Gemini runs 13 automated analyses in the background. |
| **Entries** | Entry list with full-text and semantic search, tag browser. |
| **Roots** | Goals, Journeys, and gamification. A Living Tree grows as the user journals consistently. Achievements unlock at milestones. |
| **Insights** | 5-section dashboard: streak calendar, mood/frequency charts, semantic cluster map, emotional patterns, and Hidden Connections. |
| **Settings** | Analytical framework toggles (e.g. Jungian archetypes), data export. |
| **Yggi Chat** | Floating AI companion (bottom-right FAB). Opens a right-side drawer. Has full access to the user's journal history via RAG. Warm, reflective — not a chatbot. |

### Hidden Connections — Technical Detail

This is the signature feature of the app and one of the key XPRIZE differentiators. It surfaces non-obvious relationships between journal entries using **Google Cirq** (quantum-inspired graph analysis) — going beyond classical similarity matching.

**Pipeline:**

1. Gemini generates an embedding for each journal entry; stored in Vertex AI
2. Google Cirq performs quantum-inspired graph analysis on the embedding space to find non-obvious connection pairs
3. Scored connection pairs are rendered via D3.js in the Insights dashboard

**Fallback:** Cirq is not always reliable. If it fails or is unavailable, the system silently falls back to classical cosine similarity via Vertex AI. The UI looks identical either way — users never see which path ran. Whichever path executes must be logged to the admin operations dashboard.

---

## Tech Stack

The stack is entirely Google-native. Everything is new — nothing is migrated from the old prototype.

| Layer | What we use |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Auth | Firebase Auth — email/password + Google Sign-In |
| Database | Firestore |
| File storage | Firebase Storage |
| AI | Gemini API (`gemini-2.0-flash` by default; `gemini-2.0-pro` / `gemini-embedding-exp` where needed) |
| Vector search | Vertex AI — text embeddings + vector search |
| Knowledge graph | Google Cirq — quantum-inspired graph analysis for Hidden Connections |
| Backend | Firebase Cloud Functions (TypeScript) — all new |
| Hosting | Cloud Run (containerized Next.js) |
| Analytics | Firebase Analytics |
| Payments | Stripe (existing integration — do not change keys or account) |
| Graph visualization | D3.js — force-directed knowledge graph (keep as-is) |

---

## How We Work

Isabel owns all architecture, integration, and technical decisions. Collaborators pick up clearly scoped, self-contained tasks — you should be able to complete your task without needing to coordinate synchronously with anyone.

**When you get a task:**

- It will specify exactly what to build, which file(s) to touch, and what done looks like
- If something is unclear, ask before starting — don't guess at architecture
- Don't reach outside the task scope. If you spot something adjacent that needs fixing, flag it rather than fixing it
- Isabel handles all wiring between your work and the rest of the system

---

## Coding Standards

### Language & framework

- TypeScript everywhere — no JavaScript files
- Next.js App Router conventions for all pages and API routes
- Firebase SDK v9+ modular imports only

### Write complete implementations

Don't stub, scaffold, or leave TODOs in the code you hand back. Write the real thing. If a function needs error handling, write it. If a component needs loading and error states, include them.

### AI calls

- All AI functionality goes through the **Gemini API** — no other LLM providers
- Default model: `gemini-2.0-flash` — only upgrade if there's a specific reason
- Batch Cloud Function calls where possible to keep GCP costs down

### Google-first

If a Google Cloud product covers the use case, use it. Don't introduce third-party alternatives for things Firebase/GCP already handles.

---

## Analytics Event Reference

Firebase Analytics is instrumented throughout the app. If your task involves a UI interaction or a backend process listed below, fire the corresponding event. Event names and required properties are exact — don't improvise. All events are typed in `src/lib/analytics.ts`.

### Journaling

| Event | Description |
|---|---|
| `entry_created` | New entry saved — include: `entry_type`, `has_mood`, `tag_count`, `word_count` |
| `entry_edited` | Existing entry updated |
| `entry_deleted` | Entry deleted |
| `entry_searched` | Search performed — include: `search_type: full_text \| semantic` |

### AI & Insights

| Event | Description |
|---|---|
| `yggi_chat_opened` | User opens the Yggi drawer |
| `yggi_message_sent` | User sends a message — include: `conversation_turn_count` |
| `insight_generated` | Automated insight produced per entry |
| `insights_tab_viewed` | User views the Insights tab |
| `hidden_connections_viewed` | User views Hidden Connections |
| `hidden_connections_computation` | Log which path ran: `cirq` or `fallback_vertex` |
| `knowledge_graph_viewed` | User views the Knowledge Graph |
| `weekly_wisdom_generated` | Weekly AI reflection generated |

### Goals & Growth

| Event | Description |
|---|---|
| `goal_created` | User creates a goal |
| `goal_completed` | User completes a goal |
| `goal_deleted` | User deletes a goal |
| `journey_started` | User starts a Journey |
| `journey_completed` | User completes a Journey |
| `achievement_unlocked` | Achievement unlocked — include: `achievement_id` |
| `living_tree_viewed` | User views the Living Tree |

### Onboarding & Retention

| Event | Description |
|---|---|
| `onboarding_started` | User begins onboarding |
| `onboarding_completed` | User completes onboarding |
| `seed_entry_analyzed` | First Yggi insight delivered during onboarding |
| `streak_milestone` | Milestone reached — include: `streak_days` |

### Business

| Event | Description |
|---|---|
| `subscription_started` | Subscription started — include: `plan` |
| `subscription_cancelled` | Subscription cancelled |
| `subscription_renewed` | Subscription renewed |
| `paywall_viewed` | User hits the paywall |
| `settings_opened` | User opens Settings |
| `data_exported` | User exports their data |

---

## Design Rules

The visual identity is established — don't redesign anything. If you're building UI, match the existing aesthetic.

| Element | Value |
|---|---|
| Primary color | `#1A3C2E` (forest green) |
| Palette | Earthy tones, nature and tree metaphors, sacred geometry influences |
| App tone | Warm, spiritually intelligent — not clinical |
| Metaphors | Trees, roots, growth — rooted in the Norse world-tree Yggdrasil |
| **Don't** | Introduce new color schemes, rounded-everything design trends, or clinical UI patterns |

---

## About the Old Codebase

There is an existing prototype at `github.com/lovable-isa23/yggdrasil-journal`. It is **reference material only.**

- You can read it to understand features and UI logic
- Do not copy-paste code from it into the new stack
- Nothing from the old database is being migrated
- GitHub tree-view pages are blocked by robots.txt — raw file URLs work if Isabel pastes them directly

> **TL;DR:** The old code tells you what was built. The new code is what you're building.

---

## Priorities & Deadline

The submission deadline is **August 17, 2026.** Every scope decision should favor shipping over perfection.

| Priority | What it covers |
|---|---|
| **P0 — Must ship** | Stack scaffold, Gemini integration, Stripe wiring, Firebase Analytics, Cloud Run deployment |
| **P1 — XPRIZE edge** | AI-native operations dashboard, Hidden Connections (Cirq + fallback), Longitudinal growth view, Onboarding flow |
| **P2 — Stretch** | Referral/share, Group/cohort journaling |

---

*Yggdrasil · Screen Sage Studios · Build with Gemini XPRIZE · Education & Human Potential · August 17, 2026*
