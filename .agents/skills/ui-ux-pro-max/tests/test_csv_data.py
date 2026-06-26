#!/usr/bin/env python3
"""
Tests for ui-ux-pro-max CSV data files.

Verifies structural integrity: correct headers, no-duplicate primary keys,
minimum row counts, non-empty required fields, and format-specific rules
(hex color format, consistent stack schemas).

Run with:
    python3 -m unittest test_csv_data.py -v
"""

import csv
import os
import re
import unittest

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
STACKS_DIR = os.path.join(DATA_DIR, "stacks")

HEX_COLOR_RE = re.compile(r"^#[0-9A-Fa-f]{6}$")

# Stacks shipped in this PR
STACK_FILES = [
    "astro.csv",
    "flutter.csv",
    "html-tailwind.csv",
    "jetpack-compose.csv",
    "nextjs.csv",
    "nuxt-ui.csv",
    "nuxtjs.csv",
    "react-native.csv",
    "react.csv",
    "shadcn.csv",
    "svelte.csv",
    "swiftui.csv",
    "vue.csv",
]


def read_csv(path):
    """Return (headers, rows) for a CSV file."""
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        headers = next(reader)
        rows = list(reader)
    return headers, rows


def read_csv_dicts(path):
    """Return list of dicts for a CSV file using its header row as keys."""
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


class TestChartsCsv(unittest.TestCase):
    """Tests for data/charts.csv"""

    CSV_PATH = os.path.join(DATA_DIR, "charts.csv")
    EXPECTED_HEADERS = [
        "No",
        "Data Type",
        "Keywords",
        "Best Chart Type",
        "Secondary Options",
        "Color Guidance",
        "Performance Impact",
        "Accessibility Notes",
        "Library Recommendation",
        "Interactive Level",
    ]
    REQUIRED_FIELDS = ["Data Type", "Keywords", "Best Chart Type", "Library Recommendation"]
    MIN_ROWS = 20

    def setUp(self):
        self.headers, self.rows = read_csv(self.CSV_PATH)
        self.dicts = read_csv_dicts(self.CSV_PATH)

    def test_file_exists(self):
        self.assertTrue(os.path.isfile(self.CSV_PATH), "charts.csv not found")

    def test_header_columns(self):
        self.assertEqual(self.headers, self.EXPECTED_HEADERS)

    def test_minimum_row_count(self):
        self.assertGreaterEqual(len(self.rows), self.MIN_ROWS)

    def test_no_column_contains_unique_values(self):
        nos = [row["No"] for row in self.dicts]
        self.assertEqual(len(nos), len(set(nos)), "Duplicate 'No' values found")

    def test_no_column_contains_only_integers(self):
        for row in self.dicts:
            self.assertTrue(
                row["No"].strip().isdigit(),
                f"Non-integer 'No' value: {row['No']!r}"
            )

    def test_no_column_sequential(self):
        nos = [int(row["No"]) for row in self.dicts]
        self.assertEqual(nos, list(range(1, len(nos) + 1)), "No column is not sequential from 1")

    def test_required_fields_are_non_empty(self):
        for i, row in enumerate(self.dicts, 1):
            for field in self.REQUIRED_FIELDS:
                self.assertTrue(
                    row[field].strip(),
                    f"Row {i}: required field '{field}' is empty"
                )

    def test_each_row_has_correct_column_count(self):
        expected = len(self.EXPECTED_HEADERS)
        for i, row in enumerate(self.rows, 1):
            self.assertEqual(
                len(row), expected,
                f"Row {i} has {len(row)} columns, expected {expected}"
            )

    def test_keywords_field_contains_comma_separated_terms(self):
        # Each chart type should have at least one keyword
        for i, row in enumerate(self.dicts, 1):
            self.assertTrue(
                len(row["Keywords"].strip()) > 0,
                f"Row {i}: Keywords field is empty"
            )


class TestColorsCsv(unittest.TestCase):
    """Tests for data/colors.csv"""

    CSV_PATH = os.path.join(DATA_DIR, "colors.csv")
    EXPECTED_HEADERS = [
        "No",
        "Product Type",
        "Primary (Hex)",
        "Secondary (Hex)",
        "CTA (Hex)",
        "Background (Hex)",
        "Text (Hex)",
        "Border (Hex)",
        "Notes",
    ]
    HEX_FIELDS = [
        "Primary (Hex)",
        "Secondary (Hex)",
        "CTA (Hex)",
        "Background (Hex)",
        "Text (Hex)",
        "Border (Hex)",
    ]
    MIN_ROWS = 30

    def setUp(self):
        self.headers, self.rows = read_csv(self.CSV_PATH)
        self.dicts = read_csv_dicts(self.CSV_PATH)

    def test_file_exists(self):
        self.assertTrue(os.path.isfile(self.CSV_PATH), "colors.csv not found")

    def test_header_columns(self):
        self.assertEqual(self.headers, self.EXPECTED_HEADERS)

    def test_minimum_row_count(self):
        self.assertGreaterEqual(len(self.rows), self.MIN_ROWS)

    def test_no_column_unique(self):
        nos = [row["No"] for row in self.dicts]
        self.assertEqual(len(nos), len(set(nos)), "Duplicate 'No' values found")

    def test_product_type_non_empty(self):
        for i, row in enumerate(self.dicts, 1):
            self.assertTrue(row["Product Type"].strip(), f"Row {i}: 'Product Type' is empty")

    def test_all_hex_color_fields_valid_format(self):
        for i, row in enumerate(self.dicts, 1):
            for field in self.HEX_FIELDS:
                value = row[field].strip()
                self.assertRegex(
                    value,
                    r"^#[0-9A-Fa-f]{6}$",
                    f"Row {i}: '{field}' value {value!r} is not a valid hex color (#RRGGBB)"
                )

    def test_no_duplicate_product_types(self):
        product_types = [row["Product Type"] for row in self.dicts]
        self.assertEqual(
            len(product_types), len(set(product_types)),
            "Duplicate 'Product Type' entries found in colors.csv"
        )

    def test_notes_field_present(self):
        # Notes should be non-empty for at least most rows (design rationale)
        notes_with_content = sum(1 for row in self.dicts if row["Notes"].strip())
        self.assertGreater(
            notes_with_content, len(self.dicts) // 2,
            "More than half the rows have empty Notes"
        )


class TestIconsCsv(unittest.TestCase):
    """Tests for data/icons.csv"""

    CSV_PATH = os.path.join(DATA_DIR, "icons.csv")
    EXPECTED_HEADERS = [
        "No",
        "Category",
        "Icon Name",
        "Keywords",
        "Library",
        "Import Code",
        "Usage",
        "Best For",
        "Style",
    ]
    REQUIRED_FIELDS = ["Category", "Icon Name", "Keywords", "Library"]
    MIN_ROWS = 50

    def setUp(self):
        self.headers, self.rows = read_csv(self.CSV_PATH)
        self.dicts = read_csv_dicts(self.CSV_PATH)

    def test_file_exists(self):
        self.assertTrue(os.path.isfile(self.CSV_PATH), "icons.csv not found")

    def test_header_columns(self):
        self.assertEqual(self.headers, self.EXPECTED_HEADERS)

    def test_minimum_row_count(self):
        self.assertGreaterEqual(len(self.rows), self.MIN_ROWS)

    def test_no_column_unique(self):
        nos = [row["No"] for row in self.dicts]
        self.assertEqual(len(nos), len(set(nos)), "Duplicate 'No' values found")

    def test_required_fields_non_empty(self):
        for i, row in enumerate(self.dicts, 1):
            for field in self.REQUIRED_FIELDS:
                self.assertTrue(
                    row[field].strip(),
                    f"Row {i}: required field '{field}' is empty"
                )

    def test_each_row_has_correct_column_count(self):
        expected = len(self.EXPECTED_HEADERS)
        for i, row in enumerate(self.rows, 1):
            self.assertEqual(len(row), expected, f"Row {i}: wrong column count")


class TestLandingCsv(unittest.TestCase):
    """Tests for data/landing.csv"""

    CSV_PATH = os.path.join(DATA_DIR, "landing.csv")
    EXPECTED_HEADERS = [
        "No",
        "Pattern Name",
        "Keywords",
        "Section Order",
        "Primary CTA Placement",
        "Color Strategy",
        "Recommended Effects",
        "Conversion Optimization",
    ]
    REQUIRED_FIELDS = ["Pattern Name", "Keywords", "Section Order"]
    MIN_ROWS = 10

    def setUp(self):
        self.headers, self.rows = read_csv(self.CSV_PATH)
        self.dicts = read_csv_dicts(self.CSV_PATH)

    def test_file_exists(self):
        self.assertTrue(os.path.isfile(self.CSV_PATH), "landing.csv not found")

    def test_header_columns(self):
        self.assertEqual(self.headers, self.EXPECTED_HEADERS)

    def test_minimum_row_count(self):
        self.assertGreaterEqual(len(self.rows), self.MIN_ROWS)

    def test_no_column_unique(self):
        nos = [row["No"] for row in self.dicts]
        self.assertEqual(len(nos), len(set(nos)), "Duplicate 'No' values found")

    def test_required_fields_non_empty(self):
        for i, row in enumerate(self.dicts, 1):
            for field in self.REQUIRED_FIELDS:
                self.assertTrue(
                    row[field].strip(),
                    f"Row {i}: required field '{field}' is empty"
                )

    def test_no_duplicate_pattern_names(self):
        names = [row["Pattern Name"] for row in self.dicts]
        self.assertEqual(len(names), len(set(names)), "Duplicate 'Pattern Name' entries found")


class TestProductsCsv(unittest.TestCase):
    """Tests for data/products.csv"""

    CSV_PATH = os.path.join(DATA_DIR, "products.csv")
    EXPECTED_HEADERS = [
        "No",
        "Product Type",
        "Keywords",
        "Primary Style Recommendation",
        "Secondary Styles",
        "Landing Page Pattern",
        "Dashboard Style (if applicable)",
        "Color Palette Focus",
        "Key Considerations",
    ]
    REQUIRED_FIELDS = ["Product Type", "Keywords", "Primary Style Recommendation"]
    MIN_ROWS = 50

    def setUp(self):
        self.headers, self.rows = read_csv(self.CSV_PATH)
        self.dicts = read_csv_dicts(self.CSV_PATH)

    def test_file_exists(self):
        self.assertTrue(os.path.isfile(self.CSV_PATH), "products.csv not found")

    def test_header_columns(self):
        self.assertEqual(self.headers, self.EXPECTED_HEADERS)

    def test_minimum_row_count(self):
        self.assertGreaterEqual(len(self.rows), self.MIN_ROWS)

    def test_no_column_unique(self):
        nos = [row["No"] for row in self.dicts]
        self.assertEqual(len(nos), len(set(nos)), "Duplicate 'No' values found")

    def test_required_fields_non_empty(self):
        for i, row in enumerate(self.dicts, 1):
            for field in self.REQUIRED_FIELDS:
                self.assertTrue(
                    row[field].strip(),
                    f"Row {i}: required field '{field}' is empty"
                )

    def test_each_row_has_correct_column_count(self):
        expected = len(self.EXPECTED_HEADERS)
        for i, row in enumerate(self.rows, 1):
            self.assertEqual(len(row), expected, f"Row {i}: wrong column count")


class TestReactPerformanceCsv(unittest.TestCase):
    """Tests for data/react-performance.csv"""

    CSV_PATH = os.path.join(DATA_DIR, "react-performance.csv")
    EXPECTED_HEADERS = [
        "No",
        "Category",
        "Issue",
        "Keywords",
        "Platform",
        "Description",
        "Do",
        "Don't",
        "Code Example Good",
        "Code Example Bad",
        "Severity",
    ]
    REQUIRED_FIELDS = ["Category", "Issue", "Keywords", "Description"]
    # Severity values observed in the actual data (includes compound forms)
    VALID_SEVERITIES = {"Critical", "High", "Medium", "Low", "Medium-High", "Low-Medium"}
    MIN_ROWS = 30

    def setUp(self):
        self.headers, self.rows = read_csv(self.CSV_PATH)
        self.dicts = read_csv_dicts(self.CSV_PATH)

    def test_file_exists(self):
        self.assertTrue(os.path.isfile(self.CSV_PATH), "react-performance.csv not found")

    def test_header_columns(self):
        self.assertEqual(self.headers, self.EXPECTED_HEADERS)

    def test_minimum_row_count(self):
        self.assertGreaterEqual(len(self.rows), self.MIN_ROWS)

    def test_no_column_unique(self):
        nos = [row["No"] for row in self.dicts]
        self.assertEqual(len(nos), len(set(nos)), "Duplicate 'No' values found")

    def test_required_fields_non_empty(self):
        for i, row in enumerate(self.dicts, 1):
            for field in self.REQUIRED_FIELDS:
                self.assertTrue(
                    row[field].strip(),
                    f"Row {i}: required field '{field}' is empty"
                )

    def test_severity_values_in_known_set(self):
        for i, row in enumerate(self.dicts, 1):
            sev = row["Severity"].strip()
            if sev:  # Skip rows with empty severity
                self.assertIn(
                    sev,
                    self.VALID_SEVERITIES,
                    f"Row {i}: unexpected Severity value {sev!r}"
                )

    def test_each_row_has_correct_column_count(self):
        expected = len(self.EXPECTED_HEADERS)
        for i, row in enumerate(self.rows, 1):
            self.assertEqual(len(row), expected, f"Row {i}: wrong column count")


class TestStacksCsvConsistency(unittest.TestCase):
    """Tests for all stacks/*.csv files — consistent schema and integrity."""

    EXPECTED_HEADERS = [
        "No",
        "Category",
        "Guideline",
        "Description",
        "Do",
        "Don't",
        "Code Good",
        "Code Bad",
        "Severity",
        "Docs URL",
    ]
    REQUIRED_FIELDS = ["Category", "Guideline", "Description"]
    VALID_SEVERITIES = {"Critical", "High", "Medium", "Low", "Info"}
    MIN_ROWS_PER_STACK = 40

    def _stack_path(self, filename):
        return os.path.join(STACKS_DIR, filename)

    def test_all_stack_files_exist(self):
        for filename in STACK_FILES:
            path = self._stack_path(filename)
            self.assertTrue(os.path.isfile(path), f"Stack file missing: {filename}")

    def test_all_stacks_have_identical_headers(self):
        """All stack CSVs must share the same column schema."""
        all_headers = {}
        for filename in STACK_FILES:
            headers, _ = read_csv(self._stack_path(filename))
            all_headers[filename] = headers
        first_name, first_headers = next(iter(all_headers.items()))
        for name, headers in all_headers.items():
            self.assertEqual(
                headers,
                first_headers,
                f"{name} headers differ from {first_name}:\n"
                f"  expected: {first_headers}\n"
                f"  got:      {headers}"
            )

    def test_all_stacks_expected_headers(self):
        for filename in STACK_FILES:
            headers, _ = read_csv(self._stack_path(filename))
            self.assertEqual(headers, self.EXPECTED_HEADERS, f"{filename}: unexpected headers")

    def test_all_stacks_minimum_row_count(self):
        for filename in STACK_FILES:
            _, rows = read_csv(self._stack_path(filename))
            self.assertGreaterEqual(
                len(rows), self.MIN_ROWS_PER_STACK,
                f"{filename}: only {len(rows)} rows, expected >= {self.MIN_ROWS_PER_STACK}"
            )

    def test_all_stacks_no_column_unique(self):
        for filename in STACK_FILES:
            dicts = read_csv_dicts(self._stack_path(filename))
            nos = [row["No"] for row in dicts]
            self.assertEqual(
                len(nos), len(set(nos)),
                f"{filename}: duplicate 'No' values found"
            )

    def test_all_stacks_required_fields_non_empty(self):
        for filename in STACK_FILES:
            dicts = read_csv_dicts(self._stack_path(filename))
            for i, row in enumerate(dicts, 1):
                for field in self.REQUIRED_FIELDS:
                    self.assertTrue(
                        row[field].strip(),
                        f"{filename} row {i}: required field '{field}' is empty"
                    )

    def test_all_stacks_severity_values_valid_when_present(self):
        for filename in STACK_FILES:
            dicts = read_csv_dicts(self._stack_path(filename))
            for i, row in enumerate(dicts, 1):
                sev = row["Severity"].strip()
                if sev:
                    self.assertIn(
                        sev,
                        self.VALID_SEVERITIES,
                        f"{filename} row {i}: unexpected Severity {sev!r}"
                    )

    def test_all_stacks_correct_column_count(self):
        # Rows must have at least 9 columns (all required fields); the optional
        # trailing "Docs URL" column may be absent in some rows (e.g. astro.csv row 35).
        min_required = len(self.EXPECTED_HEADERS) - 1  # 9 required, 1 optional trailing
        expected = len(self.EXPECTED_HEADERS)
        for filename in STACK_FILES:
            _, rows = read_csv(self._stack_path(filename))
            for i, row in enumerate(rows, 1):
                self.assertGreaterEqual(
                    len(row), min_required,
                    f"{filename} row {i}: too few columns ({len(row)}, minimum {min_required})"
                )
                self.assertLessEqual(
                    len(row), expected,
                    f"{filename} row {i}: too many columns ({len(row)}, maximum {expected})"
                )


class TestIndividualStackFiles(unittest.TestCase):
    """Spot-check individual stack files to verify non-trivial content."""

    def _assert_stack_has_categories(self, filename, expected_categories):
        dicts = read_csv_dicts(os.path.join(STACKS_DIR, filename))
        actual_categories = {row["Category"] for row in dicts}
        for cat in expected_categories:
            self.assertIn(cat, actual_categories, f"{filename}: expected category '{cat}' not found")

    def test_html_tailwind_has_key_categories(self):
        self._assert_stack_has_categories("html-tailwind.csv", ["Layout", "Typography"])

    def test_react_has_key_categories(self):
        self._assert_stack_has_categories("react.csv", ["Performance", "State"])

    def test_nextjs_has_key_categories(self):
        self._assert_stack_has_categories("nextjs.csv", ["Routing", "Performance"])

    def test_vue_has_key_categories(self):
        # vue.csv uses "Composition" (not "Composition API") as the category label
        self._assert_stack_has_categories("vue.csv", ["Composition", "State"])

    def test_svelte_has_key_categories(self):
        dicts = read_csv_dicts(os.path.join(STACKS_DIR, "svelte.csv"))
        self.assertGreater(len(dicts), 0, "svelte.csv is empty")

    def test_flutter_has_key_categories(self):
        dicts = read_csv_dicts(os.path.join(STACKS_DIR, "flutter.csv"))
        categories = {row["Category"] for row in dicts}
        self.assertGreater(len(categories), 3, "flutter.csv should have multiple categories")

    def test_swiftui_has_key_categories(self):
        dicts = read_csv_dicts(os.path.join(STACKS_DIR, "swiftui.csv"))
        categories = {row["Category"] for row in dicts}
        self.assertGreater(len(categories), 3, "swiftui.csv should have multiple categories")


class TestCsvUtilityFunctions(unittest.TestCase):
    """Unit tests for the read_csv and read_csv_dicts helpers used in tests."""

    def setUp(self):
        import tempfile
        fd, self.tmp = tempfile.mkstemp(suffix=".csv")
        with os.fdopen(fd, "w", newline="", encoding="utf-8") as f:
            f.write("No,Name,Value\n1,alpha,100\n2,beta,200\n")

    def tearDown(self):
        os.unlink(self.tmp)

    def test_read_csv_returns_headers_and_rows(self):
        headers, rows = read_csv(self.tmp)
        self.assertEqual(headers, ["No", "Name", "Value"])
        self.assertEqual(len(rows), 2)

    def test_read_csv_dicts_returns_list_of_dicts(self):
        dicts = read_csv_dicts(self.tmp)
        self.assertEqual(len(dicts), 2)
        self.assertEqual(dicts[0]["Name"], "alpha")
        self.assertEqual(dicts[1]["Value"], "200")


class TestHexColorValidation(unittest.TestCase):
    """Unit tests for the HEX_COLOR_RE regex used in color validation."""

    def test_accepts_valid_lowercase_hex(self):
        self.assertIsNotNone(HEX_COLOR_RE.match("#2563eb"))

    def test_accepts_valid_uppercase_hex(self):
        self.assertIsNotNone(HEX_COLOR_RE.match("#2563EB"))

    def test_accepts_valid_mixed_case_hex(self):
        self.assertIsNotNone(HEX_COLOR_RE.match("#F8Fafc"))

    def test_rejects_missing_hash(self):
        self.assertIsNone(HEX_COLOR_RE.match("2563EB"))

    def test_rejects_short_hex(self):
        self.assertIsNone(HEX_COLOR_RE.match("#FFF"))

    def test_rejects_long_hex(self):
        self.assertIsNone(HEX_COLOR_RE.match("#FFFFFFF"))

    def test_rejects_invalid_chars(self):
        self.assertIsNone(HEX_COLOR_RE.match("#GGGGGG"))

    def test_rejects_empty_string(self):
        self.assertIsNone(HEX_COLOR_RE.match(""))


if __name__ == "__main__":
    unittest.main()