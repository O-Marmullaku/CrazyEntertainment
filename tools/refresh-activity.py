"""Refresh the public date-only feed from GitHub; repo names arrive via Actions secret."""

from datetime import datetime
import json
import os
from pathlib import Path
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
FEED = ROOT / "activity.json"
REPOSITORY = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")


def timestamp(value):
    if not isinstance(value, str):
        raise ValueError("Expected an ISO timestamp")
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("Timestamp needs a timezone")
    return parsed


def latest_commit(repo, token, opener=urlopen):
    owner, name = repo.split("/")
    url = f"https://api.github.com/repos/{quote(owner)}/{quote(name)}/commits?per_page=1"
    request = Request(url, headers={
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "User-Agent": "CrazyEntertainment-activity-publisher",
    })
    with opener(request, timeout=12) as response:
        data = json.load(response)
    commit = data[0]["commit"]
    value = commit["committer"]["date"] or commit["author"]["date"]
    timestamp(value)
    return value


def refresh(feed_path, raw_sources, tokens, opener=urlopen):
    feed = json.loads(feed_path.read_text(encoding="utf-8"))
    if feed.get("schema") != 1 or not isinstance(feed.get("projects"), dict):
        raise ValueError("Invalid public feed")
    sources = json.loads(raw_sources)
    if not isinstance(sources, dict) or not sources:
        raise ValueError("Activity source secret must be a nonempty JSON object")
    if not set(sources).issubset(feed["projects"]):
        raise ValueError("Activity source key is absent from the public feed")
    if any(not isinstance(repo, str) or not REPOSITORY.fullmatch(repo) for repo in sources.values()):
        raise ValueError("Activity source is not a GitHub owner/repository pair")

    changed = 0
    failed = 0
    skipped = 0
    requested = 0
    for slug, repo in sorted(sources.items()):
        token = tokens.get(repo.split("/", 1)[0].lower())
        if not token:
            skipped += 1
            continue
        requested += 1
        try:
            remote = latest_commit(repo, token, opener)
            if timestamp(remote) > timestamp(feed["projects"][slug]):
                feed["projects"][slug] = remote
                changed += 1
        except (HTTPError, URLError, TimeoutError, KeyError, IndexError, ValueError) as error:
            # Public workflow logs must not print private repository names or tokens.
            code = error.code if isinstance(error, HTTPError) else type(error).__name__
            print(f"::warning::Activity refresh failed for {slug} ({code})")
            failed += 1
    if not requested:
        raise ValueError("No activity sources have a configured owner token")
    if failed == requested:
        raise RuntimeError("Every remote activity request failed; feed left unchanged")
    if changed:
        feed_path.write_text(json.dumps(feed, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"Activity: {changed} newer date(s), {failed} failed, {skipped} skipped without owner token")
    return changed


if __name__ == "__main__":
    raw_sources = os.environ.get("ACTIVITY_SOURCES_JSON")
    tokens = {
        "o-marmullaku": os.environ.get("ACTIVITY_READ_TOKEN_O_MARMULLAKU"),
        "johnnyguides": os.environ.get("ACTIVITY_READ_TOKEN_JOHNNYGUIDES"),
    }
    if not raw_sources or not any(tokens.values()):
        print("Activity refresh is not configured; published snapshots remain in place.")
    else:
        try:
            refresh(FEED, raw_sources, tokens)
        except (ValueError, RuntimeError) as error:
            print(error, file=sys.stderr)
            sys.exit(1)
