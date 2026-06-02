# Yggdrasil — Product Specification

**Screen Sage Studios · Version 1.0 · May 2026**

---

> *Turn your journal into a living map of your mind.*

---

## 1. Overview

Yggdrasil is an AI-powered semantic journaling web app that transforms personal writing into a dynamic, evolving picture of the writer's inner world. Rather than storing journal entries as a flat archive, Yggdrasil continuously extracts people, themes, emotions, and patterns from every entry, then surfaces psychological and spiritual insights, goal suggestions, and a visual knowledge graph — all powered by the Gemini API.

The app is built by Screen Sage Studios and is being entered into the **Build with Gemini XPRIZE hackathon** (Devpost, $2M prize pool) under the **Education & Human Potential** category. The submission deadline is **August 17, 2026**.

### What makes Yggdrasil distinct

- AI extracts meaning automatically — users journal naturally; Gemini does the analysis
- A living knowledge graph connects entries semantically, revealing patterns invisible to the naked eye
- **Hidden Connections**: quantum-inspired graph analysis (Google Cirq) surfaces non-obvious relationships between entries
- **Yggi** — a floating AI companion with full journal context — answers questions, reflects patterns, and suggests goals
- Longitudinal growth view tracks how the user's themes, emotions, and goals shift over time
- Gamification (Living Tree, Journeys, Achievements) makes the habit sustainable

---

## 2. Project Context

A functional prototype was built on Lovable (React + TypeScript + Supabase). That codebase is reference material only. The current effort is a **full rebuild** on a clean Google-native stack — no data migration, no legacy code carried over.

### Goals for the XPRIZE submission

1. Rebuild on Next.js + Firebase + Google Cloud
2. Extend with new features that strengthen the Education & Human Potential story
3. Use the Gemini API throughout (required by the competition)
4. Deploy to production with real users and real revenue (Stripe already integrated)
5. Produce the submission package: demo video, written narrative, revenue evidence, agent execution logs

### Judging criteria

| Criterion | What judges are looking for |
|---|---|
| Business Viability | Real users, real revenue, a credible growth path |
| AI-Native Operations | AI running the business — not just powering a feature |
| Category Impact | Measurable contribution to Education & Human Potential |

---

## 3. Key Features

### 3.1 Journal Tab

- Rich text entry composer
- Mood selector, entry type, and tag support
- On-save: triggers 13 automated Gemini analyses (semantic extraction, emotional tone, themes, people, goal suggestions, and more)

### 3.2 Entries Tab

- Chronological entry list with full-text and semantic search
- Tag browser for navigating by extracted topic
- Each entry links to its generated insights

### 3.3 Roots Tab — Goals & Growth

- **Goals** — create, track, and complete personal goals; AI suggests new goals from journal patterns
- **Journeys** — multi-step growth paths the user can start and track progress against
- **Living Tree** — gamified progression metaphor; the tree grows as the user journals consistently
- **Achievements** — milestone badges unlocked by streaks, goal completions, and usage depth

### 3.4 Insights Tab

Five-section dashboard:

- **Streak calendar** — journaling consistency heatmap
- **Frequency & mood charts** — entry cadence and emotional distribution over time
- **Semantic cluster map** — groups of entries by topic proximity
- **Emotional patterns** — longitudinal view of how emotions and themes evolve
- **Hidden Connections** — non-obvious entry relationships surfaced by quantum-inspired graph analysis (see 3.7)

### 3.5 Yggi Chat — AI Companion

- Floating action button (bottom-right), opens a right-side drawer
- Full-context RAG: Yggi has access to the user's complete journal history
- Answers reflective questions, surfaces patterns, suggests goals
- Tone: warm, spiritually intelligent — not a clinical chatbot

### 3.6 Knowledge Graph

- D3 force-directed visualization of semantic connections across all entries
- Nodes = concepts, people, themes; edges = semantic similarity
- Interactive — users can explore clusters and drill into entries

### 3.7 Hidden Connections (Signature Feature)

Hidden Connections surfaces relationships between journal entries that classical similarity matching would miss. It is one of Yggdrasil's key technical differentiators for the XPRIZE competition.

**Pipeline:**

1. Gemini embeddings generated per entry and stored in Vertex AI
2. Google Cirq performs quantum-inspired graph analysis on the embedding space to find non-obvious connection pairs
3. Scored connection pairs are passed to D3 for visualization

**Fallback:** Cirq is not always reliable. If Cirq fails or is unavailable, the system silently falls back to classical cosine similarity via Vertex AI. The UI is identical in both cases. Which path executed is logged to the agent operations dashboard.

### 3.8 Settings

- Optional analytical frameworks toggle (Jungian archetypes, attachment theory, etc.) — changes how Gemini frames its insights
- Data export

### 3.9 Onboarding

- Guided first session designed to demonstrate Yggi's intelligence immediately
- Goal: deliver a first AI insight within 60 seconds of signup via a seed entry

### 3.10 AI-Native Operations Dashboard (Admin)

An internal admin-facing dashboard showing that AI runs the business, not just powers a feature. Required by the XPRIZE submission.

- Automated insight generation logs
- Yggi conversation summaries
- Pattern detection events
- Weekly report generation — all AI-executed, timestamped, and logged

---

## 4. Technical Stack

The stack is entirely Google-native. Everything is new — nothing is migrated from the old prototype.

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | Server components + API routes |
| Auth | Firebase Auth | Email/password + Google Sign-In |
| Database | Firestore | Replaces Supabase Postgres |
| File storage | Firebase Storage | User uploads and exports |
| AI | Gemini API | `gemini-2.0-flash` (default); `gemini-2.0-pro` / `gemini-embedding-exp` where needed |
| Vector search | Vertex AI | Text embeddings + vector search (replaces pgvector) |
| Knowledge graph | Google Cirq | Quantum-inspired graph analysis for Hidden Connections |
| Backend | Firebase Cloud Functions (TypeScript) | All new — none carried over |
| Hosting | Cloud Run | Containerized Next.js app |
| Analytics | Firebase Analytics | Comprehensive event tracking |
| Payments | Stripe | Existing integration — keep account/keys |
| Graph viz | D3.js | Force-directed knowledge graph (keep as-is) |

---

## 5. Analytics & Event Tracking

Comprehensive Firebase Analytics event tracking is required for the XPRIZE submission (usage evidence). Every significant user action is instrumented. All events and required properties are typed in `src/lib/analytics.ts`.

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
| `yggi_chat_opened` | User opens the Yggi chat drawer |
| `yggi_message_sent` | User sends a message — include: `conversation_turn_count` |
| `insight_generated` | Automated insight produced per entry |
| `insights_tab_viewed` | User views the Insights dashboard |
| `hidden_connections_viewed` | User views the Hidden Connections section |
| `hidden_connections_computation` | Logs which path ran: `cirq` or `fallback_vertex` |
| `knowledge_graph_viewed` | User views the knowledge graph |
| `weekly_wisdom_generated` | Weekly AI reflection generated |

### Goals & Growth

| Event | Description |
|---|---|
| `goal_created` | User creates a new goal |
| `goal_completed` | User marks a goal complete |
| `goal_deleted` | User deletes a goal |
| `journey_started` | User starts a Journey |
| `journey_completed` | User completes a Journey |
| `achievement_unlocked` | Achievement unlocked — include: `achievement_id` |
| `living_tree_viewed` | User views the Living Tree |

### Onboarding & Retention

| Event | Description |
|---|---|
| `onboarding_started` | User begins onboarding flow |
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

## 6. Feature Priorities

All scope decisions favor shipping over perfection. 80% functional in production beats 100% functional in development.

### P0 — Must ship to submit

1. **New stack scaffold** — Next.js app with Firebase Auth, Firestore, Cloud Functions, Cloud Run deployment pipeline
2. **Gemini integration** — All AI calls through Gemini API. The 13 per-entry analyses, Yggi chat, weekly wisdom, goal suggestions, embeddings — all Gemini
3. **Stripe** — Already integrated; wire up to the new stack, ensure subscription flow works end-to-end in production
4. **Firebase Analytics** — Comprehensive event tracking across all 5 categories
5. **Cloud Run deployment** — Containerized Next.js on Cloud Run, production domain, HTTPS

### P1 — XPRIZE differentiators (Education & Human Potential)

6. **AI-native operations layer** — Admin dashboard showing AI running the business: insight generation logs, Yggi summaries, pattern detection events, weekly reports — all timestamped
7. **Hidden Connections** — Quantum-inspired graph analysis via Google Cirq, with Vertex AI cosine similarity as silent fallback
8. **Longitudinal growth view** — How the user's themes, emotions, and goals have shifted over time
9. **Onboarding flow** — Guided first session. First AI insight within 60 seconds of signup.

### P2 — Revenue & growth (stretch)

10. **Referral / share** — Share an anonymized public insight card to social
11. **Group/cohort journaling** — Shared growth spaces (therapist + client, study group)

---

## 7. Team & Working Model

Isabel Abonitalla (Screen Sage Studios) leads and owns all architecture, integration, and technical decisions. Collaborators are part-time and variable in number — they take clearly scoped, self-contained tasks that do not require synchronous coordination.

| Role | Responsibilities |
|---|---|
| Isabel (Lead) | Architecture, system design, all integration work, API wiring, deployment, scope decisions |
| Collaborators (part-time, variable) | Self-contained implementation tasks: UI components, Cloud Functions, analytics wiring, testing |

---

## 8. Design & Brand

The visual identity is established and not up for redesign.

| Element | Value |
|---|---|
| Primary color | `#1A3C2E` (forest green) |
| Palette | Earthy tones, nature/tree metaphors, sacred geometry influences |
| Brand voice | Screen Sage Studios — warm, elegant, gentle |
| App tone | Spiritually intelligent, not clinical |
| Metaphors | Trees, roots, growth, the Norse world-tree Yggdrasil |

---

## 9. XPRIZE Submission Requirements

**Deadline: August 17, 2026**

| Deliverable | Notes |
|---|---|
| GitHub repo | Share with `testing@devpost.com` and `judging@hacker.fund` |
| 3-minute demo video | AI live in production executing key decisions |
| Written narrative (500–1000 words) | AI vs. human roles; jobs/opportunities created |
| Revenue evidence | Stripe dashboard export |
| Expenses disclosure | Marketing + customer acquisition spend |
| Product evidence | Agent execution logs, API usage records, screenshots |
| Customer evidence | Real customer contact info + testimonials |

---

*Yggdrasil · Screen Sage Studios · Stack: Next.js + Firebase + Gemini API + Vertex AI + Google Cirq + Cloud Run · Category: Education & Human Potential · Deadline: August 17, 2026*
