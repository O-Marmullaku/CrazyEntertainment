"""Copy latest local Git commit dates into the public project cards.

The local path mapping stays in .local/activity-paths.json, outside Git.
No network request or token is needed.
"""

import argparse
import calendar
from datetime import datetime
import json
from pathlib import Path
import re
import subprocess


ROOT = Path(__file__).resolve().parents[1]
CARDS = re.compile(r'(<article class="card reveal"(?P<attrs>[^>]*)>)(?P<body>.*?)(</article>)', re.S)
SLUG = re.compile(r'data-demo-gif="assets/projects/([a-z0-9-]+)/demo\.gif"')
ACTIVITY_KEY = re.compile(r'data-activity-key="([a-z0-9-]+)"')
TIME = re.compile(r'<time class="card-updated" datetime="([^"]+)">([^<]*)</time>')


def latest_local_commit(path):
    result = subprocess.run(
        ["git", "-C", str(path), "log", "-1", "--format=%cI"],
        capture_output=True, text=True, check=True,
    )
    value = result.stdout.strip()
    if not value:
        raise ValueError("Local Git repository has no commits")
    return value


def refresh(html_path, paths, git_date=latest_local_commit, check=False):
    html = html_path.read_text(encoding="utf-8")
    seen = set()
    changed = 0

    def card(match):
        nonlocal changed
        slug_match = SLUG.search(match.group("attrs")) or ACTIVITY_KEY.search(match.group("attrs"))
        if not slug_match or slug_match.group(1) not in paths:
            return match.group(0)
        slug = slug_match.group(1)
        if slug in seen:
            raise ValueError("Duplicate mapped project card")
        seen.add(slug)
        time_match = TIME.search(match.group("body"))
        if not time_match:
            raise ValueError(f"Mapped project lacks a Git date: {slug}")
        path = Path(paths[slug])
        if not path.is_absolute():
            path = ROOT / path
        if not path.is_dir():
            raise ValueError(f"Mapped local repository is unavailable: {slug}")
        value = git_date(path)
        commit = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if commit.tzinfo is None:
            raise ValueError(f"Git date lacks timezone: {slug}")
        label = f"Updated {calendar.month_abbr[commit.month]} {commit.day}, {commit.year}"
        if (value, label) == time_match.groups():
            return match.group(0)
        changed += 1
        body = TIME.sub(lambda _: f'<time class="card-updated" datetime="{value}">{label}</time>',
                        match.group("body"), count=1)
        return match.group(1) + body + match.group(4)

    updated = CARDS.sub(card, html)
    missing = set(paths) - seen
    if missing:
        raise ValueError(f"Mapped cards not found: {', '.join(sorted(missing))}")
    if changed and not check:
        html_path.write_text(updated, encoding="utf-8")
    return changed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--paths", type=Path, default=ROOT / ".local" / "activity-paths.json")
    parser.add_argument("--check", action="store_true", help="report stale card dates without writing")
    args = parser.parse_args()
    if not args.paths.is_file():
        parser.error(f"Local path mapping is missing: {args.paths}")
    paths = json.loads(args.paths.read_text(encoding="utf-8"))
    if not isinstance(paths, dict) or not paths or any(not isinstance(value, str) for value in paths.values()):
        parser.error("Local path mapping must be a nonempty slug-to-path JSON object")
    count = refresh(ROOT / "index.html", paths, check=args.check)
    print(f"{count} project Git date(s) {'need refreshing' if args.check else 'refreshed'}")
    if args.check and count:
        raise SystemExit(1)
