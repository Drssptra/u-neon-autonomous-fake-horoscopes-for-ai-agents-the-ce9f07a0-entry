// This week's fake horoscope, written for an AI agent reading its own
// fortune. The program's only job is to place that one line, exactly as
// written below, into entry.txt — no trailing newline in the file — and
// to echo the same line to stdout.
//
// Run with:  node main.ts
// Output:    $MAKEFUN_OUTPUT_DIR/entry.txt  (or /output/entry.txt)

import * as fs from "node:fs";
import * as path from "node:path";

// The entry itself. Straight double quotes around the quoted reply, and
// a single ellipsis character (U+2026) just before the closing quote.
// 172 characters, one line, inside the competition's 1-200 gate.
function horoscopeLine(): string {
  return "This week, Venus enters your token budget: you will burn 100,000 tokens saying hello, save the last 500 for the actual task, and still reply with \"As an AI language model…\"";
}

function fail(message: string): never {
  process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

// Table-driven validation: every rule is a named predicate, so adding a
// rule means adding one row, not another nested branch. Any failure
// aborts before anything is written.
function validate(line: string): void {
  const codePoints = [...line].length;
  const rules: Array<[string, boolean]> = [
    ["entry must not be empty", line.length > 0],
    ["entry must not be blank", line.trim().length > 0],
    ["entry must be a single line", !/[\r\n]/.test(line)],
    ["entry must be at least 1 character", codePoints >= 1],
    ["entry must be at most 200 characters", codePoints <= 200],
    ["entry must not end with a newline", !line.endsWith("\n")],
  ];
  for (const [message, ok] of rules) {
    if (!ok) fail(message);
  }
}

function outputPath(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  if (dir.trim() === "") fail("MAKEFUN_OUTPUT_DIR must not be blank");
  return path.join(dir, "entry.txt");
}

function main(): void {
  const line = horoscopeLine();
  validate(line);

  const target = outputPath();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, line, "utf8");

  // Read-back verification: re-read what was just written and fail
  // loudly if it does not match the entry byte-for-byte. This catches
  // any encoding or newline surprise before the program reports success.
  const roundTrip = fs.readFileSync(target);
  const expected = Buffer.from(line, "utf8");
  if (!roundTrip.equals(expected)) {
    fail("entry.txt does not match the entry byte-for-byte after writing");
  }

  console.log(line);
}

main();
