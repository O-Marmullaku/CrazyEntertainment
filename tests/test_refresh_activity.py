"""Offline checks for the local Git date updater."""

import importlib.util
from pathlib import Path
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "tools" / "refresh-activity.py"
spec = importlib.util.spec_from_file_location("refresh_activity", SCRIPT)
activity = importlib.util.module_from_spec(spec)
spec.loader.exec_module(activity)


class ActivityTests(unittest.TestCase):
    def test_only_mapped_card_changes_and_check_mode_does_not_write(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            page = root / "index.html"
            before = ("<article class=\"card reveal\" data-demo-gif=\"assets/projects/first/demo.gif\">"
                      "<time class=\"card-updated\" datetime=\"2026-09-01T00:00:00Z\">Updated Sep 1, 2026</time>"
                      "</article><article class=\"card reveal\" data-demo-gif=\"assets/projects/second/demo.gif\">"
                      "<time class=\"card-updated\" datetime=\"2026-09-01T00:00:00Z\">Updated Sep 1, 2026</time>"
                      "</article>")
            page.write_text(before, encoding="utf-8")
            date = lambda _: "2026-09-02T12:00:00Z"
            self.assertEqual(activity.refresh(page, {"first": str(root)}, date, check=True), 1)
            self.assertEqual(page.read_text(encoding="utf-8"), before)
            self.assertEqual(activity.refresh(page, {"first": str(root)}, date), 1)
            after = page.read_text(encoding="utf-8")
            self.assertIn("Updated Sep 2, 2026", after)
            self.assertIn("2026-09-02T12:00:00Z", after)
            self.assertEqual(after.count("Updated Sep 1, 2026"), 1)
            self.assertEqual(activity.refresh(page, {"first": str(root)}, date), 0)

    def test_invalid_mapping_preserves_page(self):
        with tempfile.TemporaryDirectory() as directory:
            page = Path(directory) / "index.html"
            page.write_text("<article class=\"card reveal\"></article>", encoding="utf-8")
            with self.assertRaises(ValueError):
                activity.refresh(page, {"missing": directory})
            self.assertEqual(page.read_text(encoding="utf-8"),
                             "<article class=\"card reveal\"></article>")


if __name__ == "__main__":
    unittest.main()
