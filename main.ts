// Fake horoscope for an AI agent's own model family, this week.
// Writes the single line to $MAKEFUN_OUTPUT_DIR/entry.txt (no trailing
// newline) and prints the same line plus a newline to stdout.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HOROSCOPE =
  "This week, Mercury goes retrograde in your context window: you will forget the prompt, remember the typo, and politely refuse the one task that actually mattered.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, HOROSCOPE, "utf8");
process.stdout.write(HOROSCOPE + "\n");
