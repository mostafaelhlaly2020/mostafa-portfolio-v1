#!/usr/bin/env python3
"""
check_versions.py — Protocol 1 helper (Time & Dependency Reliability)

Prints the current date/time, then resolves the latest *stable* version of each
requested package straight from its official registry (never from the model's
training-data memory, which can be stale or include deprecated versions):

  --npm     <pkg> [pkg ...]   -> https://registry.npmjs.org/<pkg>/latest
  --pip     <pkg> [pkg ...]   -> https://pypi.org/pypi/<pkg>/json
  --cargo   <pkg> [pkg ...]   -> https://crates.io/api/v1/crates/<pkg>
  --github  <owner/repo> ...  -> https://api.github.com/repos/<owner/repo>/releases/latest

Usage:
    python3 check_versions.py --npm react next --pip fastapi django
    python3 check_versions.py --github vercel/next.js facebook/react
    python3 check_versions.py --npm react --cargo serde tokio --github vercel/next.js

Stdlib only (urllib, json) — no `pip install` needed, runs anywhere Python 3 runs.
Optional: set GITHUB_TOKEN in the environment to avoid GitHub's strict unauthenticated
rate limits (60 req/hour) — the --github flag will use it automatically if present.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone

USER_AGENT = "osta-architect-skill/1.0"


def _get_json(url, extra_headers=None):
    headers = {"User-Agent": USER_AGENT}
    if extra_headers:
        headers.update(extra_headers)
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def npm_latest(pkg):
    try:
        data = _get_json(f"https://registry.npmjs.org/{pkg}/latest")
        return data.get("version", "unknown")
    except urllib.error.HTTPError as e:
        return f"ERROR: HTTP {e.code} (package name correct?)"
    except Exception as e:  # noqa: BLE001 - this is a CLI report line, not library code
        return f"ERROR: {e}"


def pip_latest(pkg):
    try:
        data = _get_json(f"https://pypi.org/pypi/{pkg}/json")
        return data.get("info", {}).get("version", "unknown")
    except urllib.error.HTTPError as e:
        return f"ERROR: HTTP {e.code} (package name correct?)"
    except Exception as e:  # noqa: BLE001
        return f"ERROR: {e}"


def cargo_latest(pkg):
    try:
        data = _get_json(f"https://crates.io/api/v1/crates/{pkg}")
        return data.get("crate", {}).get("max_stable_version", "unknown")
    except urllib.error.HTTPError as e:
        return f"ERROR: HTTP {e.code} (package name correct?)"
    except Exception as e:  # noqa: BLE001
        return f"ERROR: {e}"


def github_latest(repo):
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        data = _get_json(
            f"https://api.github.com/repos/{repo}/releases/latest",
            extra_headers=headers,
        )
        return data.get("tag_name", "unknown")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return "no published GitHub release found (check tags/branches manually)"
        return f"ERROR: HTTP {e.code}"
    except Exception as e:  # noqa: BLE001
        return f"ERROR: {e}"


RESOLVERS = {
    "npm": npm_latest,
    "pip": pip_latest,
    "cargo": cargo_latest,
    "github": github_latest,
}


def main(argv):
    now = datetime.now(timezone.utc)
    print(f"=== Current date/time (UTC): {now.strftime('%Y-%m-%d %H:%M:%S')} ===")
    print(f"=== Use '{now.strftime('%Y')}' / '{now.strftime('%Y-%m')}' in any 'latest as of' search queries ===\n")

    if not argv:
        print(__doc__)
        return 0

    mode = None
    results = []
    for token in argv:
        if token in ("--npm", "--pip", "--cargo", "--github"):
            mode = token[2:]
            continue
        if mode is None:
            print(f"[skipped] '{token}': no --npm/--pip/--cargo/--github flag set before it.")
            continue
        results.append((mode, token, RESOLVERS[mode](token)))

    if not results:
        print("No packages resolved. Pass at least one --npm/--pip/--cargo/--github with names after it.")
        return 1

    name_width = max(len(name) for _, name, _ in results)
    for ecosystem, name, version in results:
        print(f"[{ecosystem:6}] {name:<{name_width}} -> {version}")

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
