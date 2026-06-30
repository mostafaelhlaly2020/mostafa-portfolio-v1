/**
 * Tests for PROJECT_MAP.md documentation accuracy.
 *
 * Scope: Verifies the reclassification of icon-fallback operator changes
 * (|| → ??) from "bug fixes" to "semantic improvements" in Phase B of the
 * project map, as introduced in this PR.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectMapPath = join(__dirname, "..", "PROJECT_MAP.md");
const content = readFileSync(projectMapPath, "utf-8");
const lines = content.split("\n");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return all lines in the Phase B fixes table that mention the given file. */
function tableRowsFor(filename) {
  return lines.filter((l) => l.includes(`\`${filename}\``));
}

/**
 * Return all bullet lines in the Phase B "Scope Boundaries Enforced" section.
 * Phase B starts at the "## Phase B" heading; the scope section is the first
 * "### Scope Boundaries Enforced" encountered after that.
 */
function phaseBScopeBoundaryLines() {
  const phaseBStart = lines.findIndex((l) => l.startsWith("## Phase B"));
  if (phaseBStart === -1) return [];

  const scopeStart = lines.findIndex(
    (l, i) => i > phaseBStart && l.includes("### Scope Boundaries Enforced")
  );
  if (scopeStart === -1) return [];

  // Slice until the next heading of equal or higher level
  const scopeEnd = lines.findIndex(
    (l, i) => i > scopeStart && (l.startsWith("##") || l.startsWith("---"))
  );
  const slice =
    scopeEnd === -1 ? lines.slice(scopeStart) : lines.slice(scopeStart, scopeEnd);

  return slice.filter((l) => l.trim().startsWith("- ✅") || l.trim().startsWith("- ❌"));
}

// ---------------------------------------------------------------------------
// Icon-fallback entries — reclassified as "semantic improvement"
// ---------------------------------------------------------------------------

describe("Phase B table — icon fallback operator change classification", () => {
  const iconFiles = [
    "src/sections/Skills.tsx",
    "src/sections/Certifications.tsx",
    "src/sections/Contact.tsx",
  ];

  for (const file of iconFiles) {
    test(`${file} row describes change as a semantic improvement`, () => {
      const rows = tableRowsFor(file);
      assert.ok(
        rows.length > 0,
        `Expected at least one table row referencing ${file}`
      );
      const row = rows.join(" ");
      assert.ok(
        row.toLowerCase().includes("semantic improvement"),
        `Row for ${file} should contain "semantic improvement", got:\n${row}`
      );
    });

    test(`${file} row does not classify the change as a bug fix`, () => {
      const rows = tableRowsFor(file);
      const row = rows.join(" ").toLowerCase();
      assert.ok(
        !row.includes("bug fix"),
        `Row for ${file} should not say "bug fix", got:\n${row}`
      );
    });

    test(`${file} row records commit 7c0a980`, () => {
      const rows = tableRowsFor(file);
      assert.ok(
        rows.some((r) => r.includes("7c0a980")),
        `Row for ${file} should reference commit 7c0a980`
      );
    });
  }

  test("Skills.tsx row mentions 'functionally equivalent' (detailed description row)", () => {
    // Only Skills.tsx carries the full description; the other two use the shorthand "(semantic improvement)"
    const rows = tableRowsFor("src/sections/Skills.tsx");
    const row = rows.join(" ").toLowerCase();
    assert.ok(
      row.includes("functionally equivalent"),
      `Skills.tsx row should mention "functionally equivalent" as it carries the canonical description.\nGot:\n${rows.join(" ")}`
    );
  });
});

// ---------------------------------------------------------------------------
// Scope Boundaries — counts and labels
// ---------------------------------------------------------------------------

describe("Phase B scope boundary summary — reclassified counts", () => {
  test("contains a '3 Semantic Improvements' boundary entry", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const hasSemanticImprovements = boundaries.some((l) =>
      l.includes("3 Semantic Improvements")
    );
    assert.ok(
      hasSemanticImprovements,
      `Phase B scope boundaries should include a "3 Semantic Improvements" entry.\nBoundaries found:\n${boundaries.join("\n")}`
    );
  });

  test("semantic improvement entry mentions icon fallback operator change (|| → ??)", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const entry = boundaries.find((l) => l.includes("Semantic Improvements"));
    assert.ok(
      entry,
      `A "Semantic Improvements" boundary entry must exist in Phase B.\nBoundaries:\n${boundaries.join("\n")}`
    );
    // The document uses backtick-wrapped `||` and `??`, so the literal characters are present
    assert.ok(
      entry.includes("||") && entry.includes("??"),
      `Semantic improvement entry should reference || → ?? change, got:\n${entry}`
    );
  });

  test("semantic improvement entry explains functional equivalence", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const entry = boundaries.find((l) => l.includes("Semantic Improvements"));
    assert.ok(
      entry,
      `A "Semantic Improvements" boundary entry must exist in Phase B.\nBoundaries:\n${boundaries.join("\n")}`
    );
    assert.ok(
      entry.toLowerCase().includes("functionally equivalent"),
      `Semantic improvement entry should mention "functionally equivalent", got:\n${entry}`
    );
  });

  test("semantic improvement entry references LucideIcon type", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const entry = boundaries.find((l) => l.includes("Semantic Improvements"));
    assert.ok(entry, "A Semantic Improvements boundary entry must exist");
    assert.ok(
      entry.includes("LucideIcon"),
      `Semantic improvement entry should reference LucideIcon type, got:\n${entry}`
    );
  });

  test("contains a '3 Fixes' boundary entry for SEO titles", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const hasThreeFixes = boundaries.some((l) => /\b3 Fixes\b/.test(l));
    assert.ok(
      hasThreeFixes,
      `Phase B scope boundaries should have a "3 Fixes" entry.\nBoundaries found:\n${boundaries.join("\n")}`
    );
  });

  test("SEO fixes boundary entry references metaDescription → site.name correction", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const seoEntry = boundaries.find((l) => /\b3 Fixes\b/.test(l));
    assert.ok(
      seoEntry,
      `A "3 Fixes" boundary entry must exist in Phase B.\nBoundaries:\n${boundaries.join("\n")}`
    );
    assert.ok(
      seoEntry.includes("metaDescription") || seoEntry.includes("site.name"),
      `SEO fixes entry should mention metaDescription or site.name, got:\n${seoEntry}`
    );
  });

  test("does not contain a combined '6 Fixes' boundary entry", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const hasSixFixes = boundaries.some((l) => /\b6 Fixes\b/.test(l));
    assert.ok(
      !hasSixFixes,
      `Phase B scope boundaries must not have a combined "6 Fixes" entry after reclassification.\nBoundaries found:\n${boundaries.join("\n")}`
    );
  });

  test("icon fallback files do not appear listed under the Fixes boundary entry", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const fixesEntry = boundaries.find((l) => /\b3 Fixes\b/.test(l));
    if (!fixesEntry) return;
    assert.ok(
      !fixesEntry.toLowerCase().includes("icon fallback") &&
        !fixesEntry.toLowerCase().includes("skills.tsx") &&
        !fixesEntry.toLowerCase().includes("certifications.tsx") &&
        !fixesEntry.toLowerCase().includes("contact.tsx"),
      `"3 Fixes" boundary entry should not mention icon fallback files after reclassification, got:\n${fixesEntry}`
    );
  });
});

// ---------------------------------------------------------------------------
// Internal consistency checks
// ---------------------------------------------------------------------------

describe("PROJECT_MAP.md Phase B internal consistency", () => {
  test("exactly three icon-fallback file rows exist in the Phase B table", () => {
    const iconFiles = [
      "src/sections/Skills.tsx",
      "src/sections/Certifications.tsx",
      "src/sections/Contact.tsx",
    ];
    const rows = iconFiles.flatMap((f) => tableRowsFor(f));
    assert.equal(
      rows.length,
      3,
      `Expected exactly 3 icon-fallback rows in Phase B table, found ${rows.length}`
    );
  });

  test("exactly three SEO fix rows exist for PrivacyPolicyPage, TermsPage, CookiesPage", () => {
    const seoFiles = [
      "src/pages/PrivacyPolicyPage.tsx",
      "src/pages/TermsPage.tsx",
      "src/pages/CookiesPage.tsx",
    ];
    const rows = seoFiles.flatMap((f) => tableRowsFor(f));
    assert.equal(
      rows.length,
      3,
      `Expected exactly 3 SEO fix rows in Phase B table, found ${rows.length}`
    );
  });

  test("icon fallback rows all reference commit 7c0a980", () => {
    const iconFiles = [
      "src/sections/Skills.tsx",
      "src/sections/Certifications.tsx",
      "src/sections/Contact.tsx",
    ];
    for (const file of iconFiles) {
      const rows = tableRowsFor(file);
      assert.ok(
        rows.some((r) => r.includes("7c0a980")),
        `${file} row must reference commit 7c0a980`
      );
    }
  });

  test("SEO fix rows all reference commit 01656fc", () => {
    const seoFiles = [
      "src/pages/PrivacyPolicyPage.tsx",
      "src/pages/TermsPage.tsx",
      "src/pages/CookiesPage.tsx",
    ];
    for (const file of seoFiles) {
      const rows = tableRowsFor(file);
      assert.ok(
        rows.some((r) => r.includes("01656fc")),
        `${file} row must reference commit 01656fc`
      );
    }
  });

  test("Phase B table header exists with correct columns", () => {
    const hasHeader = lines.some((l) =>
      l.includes("| File | Issue | Fix | Commit |")
    );
    assert.ok(
      hasHeader,
      "Phase B must contain a markdown table with the expected header"
    );
  });

  test("Phase B scope boundaries contain exactly one semantic-improvement entry", () => {
    const boundaries = phaseBScopeBoundaryLines();
    const semanticEntries = boundaries.filter((l) =>
      l.includes("Semantic Improvements")
    );
    assert.equal(
      semanticEntries.length,
      1,
      `Expected exactly 1 semantic-improvement boundary entry in Phase B, found ${semanticEntries.length}:\n${semanticEntries.join("\n")}`
    );
  });

  test("Phase B section heading exists and is marked COMPLETED", () => {
    const phaseBLine = lines.find((l) => l.startsWith("## Phase B"));
    assert.ok(phaseBLine, "Phase B heading must exist");
    assert.ok(
      phaseBLine.includes("COMPLETED"),
      `Phase B heading should be marked as COMPLETED, got:\n${phaseBLine}`
    );
  });

  // Regression: ensure old text "catches all falsy" (bug-framing) is absent
  test("icon fallback rows do not use 'catches all falsy' bug framing (regression guard)", () => {
    const iconFiles = [
      "src/sections/Skills.tsx",
      "src/sections/Certifications.tsx",
      "src/sections/Contact.tsx",
    ];
    for (const file of iconFiles) {
      const rows = tableRowsFor(file);
      const row = rows.join(" ");
      // The old description implied a bug: "catches all falsy"
      // After the PR reclassification, this framing must not appear.
      assert.ok(
        !row.includes("catches all falsy"),
        `${file} row must not retain the old "catches all falsy" bug framing.\nGot:\n${row}`
      );
    }
  });
});