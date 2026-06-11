/**
 * moodLabel.ts
 *
 * Maps (polarity, intensity) → a human-readable emotion label.
 *
 * Theoretical basis: Russell's circumplex model of affect (1980).
 *   - Polarity  = valence axis:  0 (most negative) → 10 (most positive), 5 = neutral
 *   - Intensity = arousal axis:  0 (least aroused)  → 10 (most aroused),  5 = moderate
 *
 * The grid is 11 × 11 (121 cells). Both inputs are clamped to [0, 10] and
 * rounded to the nearest integer before lookup, so any float in range works.
 *
 * Labels are drawn from the How We Feel / RULER / circumplex vocabulary.
 * Each cell has been hand-placed to match the quadrant conventions:
 *
 *   High arousal + Low valence  → top-left  (angry, panicked, terrified…)
 *   High arousal + High valence → top-right (ecstatic, elated, excited…)
 *   Low arousal  + Low valence  → bot-left  (depressed, empty, drained…)
 *   Low arousal  + High valence → bot-right (serene, tranquil, content…)
 *
 * Usage:
 *   import { getMoodLabel } from '@/lib/moodLabel';
 *   const label = getMoodLabel(8, 9); // → "Ecstatic"
 */

// ─── Grid ───────────────────────────────────────────────────────────────────
//
// MOOD_GRID[intensity][polarity]
// intensity: 0 (lowest row) → 10 (highest row)
// polarity:  0 (leftmost col) → 10 (rightmost col)
//
// Reading the table: each row is one intensity level (bottom to top),
// each column is one polarity level (left = negative, right = positive).

const MOOD_GRID: readonly (readonly string[])[] = [
  // intensity = 0 (barely any arousal — very flat affect)
  [
    "Numb",        // p0
    "Empty",       // p1
    "Blank",       // p2
    "Listless",    // p3
    "Flat",        // p4
    "Still",       // p5
    "Quiet",       // p6
    "Resting",     // p7
    "Peaceful",    // p8
    "Placid",      // p9
    "Serene",      // p10
  ],

  // intensity = 1
  [
    "Detached",    // p0
    "Withdrawn",   // p1
    "Gloomy",      // p2
    "Low",         // p3
    "Subdued",     // p4
    "Mild",        // p5
    "Easeful",     // p6
    "Settled",     // p7
    "Relaxed",     // p8
    "Calm",        // p9
    "Tranquil",    // p10
  ],

  // intensity = 2
  [
    "Despondent",  // p0
    "Dispirited",  // p1
    "Dull",        // p2
    "Downcast",    // p3
    "Melancholic", // p4  ← PRD anchor: p4, i2 → "Melancholic"
    "Neutral",     // p5
    "Okay",        // p6
    "Steady",      // p7
    "Comfortable", // p8
    "Pleased",     // p9
    "Content",     // p10
  ],

  // intensity = 3
  [
    "Troubled",    // p0
    "Unhappy",     // p1
    "Sad",         // p2
    "Disappointed", // p3
    "Uncertain",   // p4
    "Indifferent", // p5
    "Fine",        // p6
    "Good",        // p7
    "Grateful",    // p8
    "Hopeful",     // p9
    "Optimistic",  // p10
  ],

  // intensity = 4
  [
    "Distressed",  // p0
    "Dejected",    // p1
    "Sorrowful",   // p2
    "Discouraged", // p3
    "Anxious",     // p4
    "Unsettled",   // p5
    "Curious",     // p6
    "Engaged",     // p7
    "Upbeat",      // p8
    "Cheerful",    // p9
    "Happy",       // p10
  ],

  // intensity = 5 (moderate arousal — the midpoint)
  [
    "Desolate",    // p0
    "Miserable",   // p1
    "Grieving",    // p2
    "Frustrated",  // p3
    "Worried",     // p4
    "Ambivalent",  // p5
    "Interested",  // p6
    "Motivated",   // p7
    "Joyful",      // p8
    "Enthusiastic",// p9
    "Elated",      // p10
  ],

  // intensity = 6
  [
    "Desperate",   // p0
    "Resentful",   // p1
    "Distraught",  // p2
    "Angry",       // p3
    "Stressed",    // p4
    "Restless",    // p5
    "Alert",       // p6
    "Energised",   // p7
    "Excited",     // p8
    "Exhilarated", // p9
    "Jubilant",    // p10
  ],

  // intensity = 7
  [
    "Horrified",   // p0
    "Bitter",      // p1
    "Enraged",     // p2
    "Furious",     // p3
    "Panicked",    // p4
    "Agitated",    // p5
    "Stirred",     // p6
    "Invigorated", // p7
    "Thrilled",    // p8
    "Overjoyed",   // p9
    "Euphoric",    // p10
  ],

  // intensity = 8
  [
    "Terrified",   // p0
    "Livid",       // p1
    "Anguished",   // p2  ← PRD anchor: p2, i8 → "Anguished"
    "Incensed",    // p3
    "Overwhelmed", // p4
    "Frenzied",    // p5
    "Fired Up",    // p6
    "Passionate",  // p7
    "Radiant",     // p8
    "Blissful",    // p9
    "Expansive",   // p10
  ],

  // intensity = 9
  [
    "Petrified",   // p0
    "Seething",    // p1
    "Disgusted",   // p2
    "Hostile",     // p3
    "Hysterical",  // p4
    "Manic",       // p5
    "Electrified", // p6
    "Exuberant",   // p7
    "Ecstatic",    // p8  ← PRD anchor: p8, i9 → "Ecstatic"
    "Sublime",     // p9
    "Rapturous",   // p10
  ],

  // intensity = 10 (maximum arousal)
  [
    "Shattered",   // p0
    "Consumed",    // p1
    "Devastated",  // p2
    "Explosive",   // p3
    "Unravelling", // p4
    "Unmoored",    // p5
    "Surging",     // p6
    "Unstoppable", // p7
    "Luminous",    // p8
    "Infinite",    // p9
    "Boundless",   // p10
  ],
] as const;

// ─── Core lookup ─────────────────────────────────────────────────────────────

/**
 * Returns the emotion label for a given (polarity, intensity) pair.
 *
 * @param polarity  — valence score, 0–10 (5 = neutral). Accepts floats; rounds to nearest int.
 * @param intensity — arousal score, 0–10 (5 = moderate). Accepts floats; rounds to nearest int.
 * @returns         — emotion label string
 */
export function getMoodLabel(polarity: number, intensity: number): string {
  const p = Math.round(Math.max(0, Math.min(10, polarity)));
  const i = Math.round(Math.max(0, Math.min(10, intensity)));
  return MOOD_GRID[i][p];
}

// ─── Quadrant helpers (useful for Insights visualisation) ────────────────────

export type MoodQuadrant =
  | "high-energy-unpleasant"   // top-left:  angry, panicked, terrified
  | "high-energy-pleasant"     // top-right: excited, ecstatic, elated
  | "low-energy-unpleasant"    // bot-left:  depressed, empty, drained
  | "low-energy-pleasant"      // bot-right: serene, content, tranquil
  | "neutral";                 // centre:    ambivalent, indifferent, flat

/**
 * The neutral zone is a ±NEUTRAL_RADIUS band around the midpoint (5, 5).
 * Any point where both |polarity − 5| ≤ radius AND |intensity − 5| ≤ radius
 * is classified as "neutral". Adjust the radius to widen or narrow the zone.
 *
 * At radius = 1 the neutral zone covers a 3 × 3 cell square (9 cells):
 *   polarity  4–6, intensity 4–6
 * which maps to labels like Ambivalent, Indifferent, Unsettled, Curious, etc.
 *
 * "neutral" is also the default quadrant when polarity === 5 AND intensity === 5
 * regardless of radius, so the dead-centre "Ambivalent" cell is always neutral.
 */
const NEUTRAL_RADIUS = 1;

/**
 * Returns the circumplex quadrant for a given (polarity, intensity) pair.
 * Points within NEUTRAL_RADIUS of (5, 5) are classified as "neutral".
 */
export function getMoodQuadrant(
  polarity: number,
  intensity: number
): MoodQuadrant {
  const p = Math.max(0, Math.min(10, polarity));
  const i = Math.max(0, Math.min(10, intensity));

  if (Math.abs(p - 5) <= NEUTRAL_RADIUS && Math.abs(i - 5) <= NEUTRAL_RADIUS) {
    return "neutral";
  }

  if (i >= 5 && p < 5)  return "high-energy-unpleasant";
  if (i >= 5 && p >= 5) return "high-energy-pleasant";
  if (i < 5  && p < 5)  return "low-energy-unpleasant";
  return "low-energy-pleasant";
}

/**
 * Maps a quadrant to a display colour token (Tailwind-compatible CSS variable names).
 * Override in your theme if needed.
 */
export const QUADRANT_COLOR: Record<MoodQuadrant, string> = {
  "high-energy-unpleasant": "var(--mood-red)",
  "high-energy-pleasant":   "var(--mood-yellow)",
  "low-energy-unpleasant":  "var(--mood-blue)",
  "low-energy-pleasant":    "var(--mood-green)",
  "neutral":                "var(--mood-neutral)",
};

// ─── Batch helper (for Insights scatter plot) ─────────────────────────────────

export interface MoodPoint {
  polarity: number;
  intensity: number;
  label: string;
  quadrant: MoodQuadrant;
}

/**
 * Enriches a raw (polarity, intensity) pair with a label and quadrant.
 * Pass directly into the 2D mood chart data pipeline.
 */
export function enrichMoodPoint(
  polarity: number,
  intensity: number
): MoodPoint {
  return {
    polarity,
    intensity,
    label: getMoodLabel(polarity, intensity),
    quadrant: getMoodQuadrant(polarity, intensity),
  };
}

// ─── Full grid export (for Insights heatmap / legend) ─────────────────────────

/**
 * Returns the full 11 × 11 label grid as a flat array of MoodPoint objects.
 * Useful for rendering a colour-coded legend or an interactive circumplex viz.
 */
export function getFullGrid(): MoodPoint[] {
  const points: MoodPoint[] = [];
  for (let i = 0; i <= 10; i++) {
    for (let p = 0; p <= 10; p++) {
      points.push(enrichMoodPoint(p, i));
    }
  }
  return points;
}