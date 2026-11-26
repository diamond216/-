"""Tests for log-edit.py. Run: python3 -m unittest discover -s tools/context -v"""
import importlib.util
import tempfile
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location("log_edit", Path(__file__).with_name("log-edit.py"))
log_edit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(log_edit)


class LogEditTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        (self.root / "Context" / "quests" / "build").mkdir(parents=True)
        (self.root / "src").mkdir()
        self.addCleanup(self._tmp.cleanup)

    def quest(self, quest_id):
        (self.root / "Context" / "quests" / "build" / f"{quest_id}.md").write_text("x", encoding="utf-8")

    def run_cli(self, quest, files=("src/a.ts",), summary="did it", validation="ok", lock_wait=1):
        return log_edit.main(["--quest", quest, "--files", *files, "--summary", summary,
                              "--validation", validation], root=self.root, lock_wait=lock_wait)

    def log(self):
        return (self.root / "Context" / "Edit-Log.md").read_text(encoding="utf-8")

    def test_writes_three_line_entry(self):
        self.quest("Q-20261126-a")
        self.assertEqual(self.run_cli("Q-20261126-a"), 0)
        entry = log_edit.parse_entries(self.log())[0]
        self.assertEqual(len(entry), 3)
        self.assertIn("Q-20261126-a", entry[0])
        self.assertIn("src/a.ts", entry[1])

    def test_unknown_quest_is_rejected(self):
        self.assertEqual(self.run_cli("Q-20261126-missing"), 1)
        self.assertFalse((self.root / "Context" / "Edit-Log.md").exists())

    def test_path_outside_repo_is_rejected(self):
        self.quest("Q-20261126-a")
        self.assertEqual(self.run_cli("Q-20261126-a", files=("../outside.txt",)), 1)
        self.assertEqual(self.run_cli("Q-20261126-a", files=("/etc/passwd",)), 1)

    def test_same_quest_updates_entry(self):
        self.quest("Q-20261126-a")
        self.run_cli("Q-20261126-a", summary="first")
        self.run_cli("Q-20261126-a", summary="second")
        entries = log_edit.parse_entries(self.log())
        self.assertEqual(len(entries), 1)
        self.assertIn("second", entries[0][0])

    def test_keeps_ten_and_archives_the_rest_by_month(self):
        for i in range(12):
            quest_id = f"Q-20261126-job{i:02d}"
            self.quest(quest_id)
            log_edit.log_edit(self.root, quest_id, ["src/a.ts"], f"job {i}", "ok",
                              today="2026-10-05" if i < 2 else "2026-11-26")
        self.assertEqual(len(log_edit.parse_entries(self.log())), 10)
        archived = (self.root / "Context" / "archive" / "edit-log" / "2026-10.md").read_text(encoding="utf-8")
        self.assertIn("job00", archived)
        self.assertIn("job01", archived)

    def test_secrets_are_redacted(self):
        self.quest("Q-20261126-a")
        self.run_cli("Q-20261126-a", summary="used ghp_abcdefghijklmnopqrstuvwx and password=hunter2",
                     validation="Bearer abcdefghijklmnop1234")
        text = self.log()
        self.assertNotIn("ghp_abc", text)
        self.assertNotIn("hunter2", text)
        self.assertNotIn("abcdefghijklmnop1234", text)
        self.assertIn("[REDACTED]", text)

    def test_lock_times_out_when_held(self):
        self.quest("Q-20261126-a")
        lock = self.root / "Context" / "Edit-Log.md.lock"
        lock.write_text("held", encoding="utf-8")
        self.assertEqual(self.run_cli("Q-20261126-a", lock_wait=0.3), 1)

    def test_lock_is_released_after_write(self):
        self.quest("Q-20261126-a")
        self.run_cli("Q-20261126-a")
        self.assertFalse((self.root / "Context" / "Edit-Log.md.lock").exists())


if __name__ == "__main__":
    unittest.main()
