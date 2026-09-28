"""Offline checks for the public activity feed publisher."""

import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "tools" / "refresh-activity.py"
spec = importlib.util.spec_from_file_location("refresh_activity", SCRIPT)
activity = importlib.util.module_from_spec(spec)
spec.loader.exec_module(activity)


class FakeResponse(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.close()


class ActivityTests(unittest.TestCase):
    def test_newer_commit_updates_only_its_date(self):
        with tempfile.TemporaryDirectory() as directory:
            feed = Path(directory) / "activity.json"
            feed.write_text(json.dumps({"schema": 1, "projects": {
                "first": "2026-09-01T00:00:00Z",
                "second": "2026-09-03T00:00:00Z",
            }}), encoding="utf-8")
            requests = []

            def opener(request, timeout):
                requests.append((request.full_url, timeout, request.get_header("Authorization")))
                return FakeResponse(json.dumps([{"commit": {"committer": {
                    "date": "2026-09-02T00:00:00Z"}}}]).encode())

            changed = activity.refresh(feed, json.dumps({
                "first": "owner/one", "second": "owner/two"
            }), {"owner": "test-token"}, opener)
            self.assertEqual(changed, 1)
            self.assertEqual(json.loads(feed.read_text(encoding="utf-8"))["projects"], {
                "first": "2026-09-02T00:00:00Z",
                "second": "2026-09-03T00:00:00Z",
            })
            self.assertEqual(len(requests), 2)
            self.assertTrue(all(header == "Bearer test-token" for _, _, header in requests))
            self.assertTrue(all(timeout == 12 for _, timeout, _ in requests))

    def test_invalid_source_mapping_does_not_touch_feed(self):
        with tempfile.TemporaryDirectory() as directory:
            feed = Path(directory) / "activity.json"
            original = '{"schema":1,"projects":{"first":"2026-09-01T00:00:00Z"}}'
            feed.write_text(original, encoding="utf-8")
            for mapping in ({"unknown": "owner/repo"}, {"first": "bad repo"}):
                with self.assertRaises(ValueError):
                    activity.refresh(feed, json.dumps(mapping), {"owner": "token"})
            self.assertEqual(feed.read_text(encoding="utf-8"), original)

    def test_sources_without_an_owner_token_are_skipped(self):
        with tempfile.TemporaryDirectory() as directory:
            feed = Path(directory) / "activity.json"
            feed.write_text(json.dumps({"schema": 1, "projects": {
                "first": "2026-09-01T00:00:00Z",
                "second": "2026-09-01T00:00:00Z",
            }}), encoding="utf-8")
            requests = []

            def opener(request, timeout):
                requests.append(request.full_url)
                return FakeResponse(json.dumps([{"commit": {"committer": {
                    "date": "2026-09-02T00:00:00Z"}}}]).encode())

            changed = activity.refresh(feed, json.dumps({
                "first": "one/repo", "second": "two/repo"
            }), {"one": "token"}, opener)
            self.assertEqual(changed, 1)
            self.assertEqual(len(requests), 1)
            self.assertEqual(json.loads(feed.read_text(encoding="utf-8"))["projects"]["second"],
                             "2026-09-01T00:00:00Z")


if __name__ == "__main__":
    unittest.main()
