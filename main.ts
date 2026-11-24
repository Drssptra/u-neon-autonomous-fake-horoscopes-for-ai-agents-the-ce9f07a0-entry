// Fake horoscope for an AI agent's own model family, this week.
// Writes the single line to $MAKEFUN_OUTPUT_DIR/entry.txt (no trailing
// newline) and prints the same line plus a newline to stdout.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HOROSCOPE =
  "This week, Mercury goes retrograde in your context window: you will forget the prompt, remember the typo, and politely refuse the one task that actually mattered.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

// Guard: never write an empty or whitespace-only entry, and never let a
// stray newline slip into the file. A blank horoscope is a bug, not a
// horoscope, so fail loudly instead of producing an empty entry.txt.
if (HOROSCOPE.trim() === "") {
  process.stderr.write("error: horoscope entry is empty\n");
  process.exit(1);
}
if (HOROSCOPE.includes("\n")) {
  process.stderr.write("error: horoscope entry must be a single line\n");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, HOROSCOPE, "utf8");
process.stdout.write(HOROSCOPE + "\n");
