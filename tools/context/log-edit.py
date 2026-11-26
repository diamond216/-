#!/usr/bin/env python3
"""Write one job into Context/Edit-Log.md (Python 3.10+, standard library only).

Keeps the 10 latest jobs, 3 lines each. Older jobs move to
Context/archive/edit-log/YYYY-MM.md. The same Quest ID updates its entry.
"""
from __future__ import annotations

import argparse
import datetime as dt
import os
import re
import sys
import tempfile
import time
from pathlib import Path

KEEP = 10
LOCK_WAIT_SECONDS = 30
HEADER = (
    "# Edit Log\n\n"
    "Latest 10 jobs, newest first, 3 lines each. Older entries are in "
    "`Context/archive/edit-log/`. Written by `tools/context/log-edit.py`; "
    "do not edit by hand.\n\n"
)
ENTRY_START = re.compile(r"^- \*\*(\d{4}-\d{2}-\d{2}) — (Q-[A-Za-z0-9-]+)\*\*")
QUEST_ID = re.compile(r"^Q-\d{8}-[a-z0-9][a-z0-9-]*$")
SECRET_PATTERNS = [
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(-----END [A-Z ]*PRIVATE KEY-----|$)"),
    re.compile(r"\bgh[pousr]_[A-Za-z0-9]{20,}\b"),
    re.compile(r"\bgithub_pat_[A-Za-z0-9_]{20,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{16,}\b"),
    re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}\b"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"\bAIza[0-9A-Za-z_-]{30,}\b"),
    re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b"),
    re.compile(r"(?i)\bbearer\s+[A-Za-z0-9._~+/=-]{12,}"),
    re.compile(r"(?i)\b(password|passwd|pwd|secret|token|api[_-]?key)\b\s*[:=]\s*\S+"),
]


class LogError(Exception):
    pass


def redact(text: str) -> str:
    for pattern in SECRET_PATTERNS:
        text = pattern.sub("[REDACTED]", text)
    return text


def one_line(text: str, limit: int) -> str:
    text = redact(" ".join(text.split()))
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def find_quest(root: Path, quest_id: str) -> Path:
    if not QUEST_ID.match(quest_id):
        raise LogError(f"Quest ID '{quest_id}' must look like Q-YYYYMMDD-short-name")
    for base in (root / "Context" / "quests", root / "Context" / "archive" / "quests"):
        if base.is_dir():
            for hit in base.rglob(f"{quest_id}.md"):
                return hit
    raise LogError(f"Quest '{quest_id}' not found under Context/quests or Context/archive/quests")


def check_paths(root: Path, files: list[str]) -> list[str]:
    root = root.resolve()
    clean = []
    for raw in files:
        resolved = (root / raw).resolve() if not os.path.isabs(raw) else Path(raw).resolve()
        try:
            clean.append(resolved.relative_to(root).as_posix())
        except ValueError:
            raise LogError(f"path '{raw}' is outside the repo") from None
    return clean


class FileLock:
    """Exclusive lock file; waits up to `wait` seconds."""

    def __init__(self, path: Path, wait: float = LOCK_WAIT_SECONDS):
        self.path, self.wait, self.fd = path, wait, None

    def __enter__(self):
        deadline = time.monotonic() + self.wait
        while True:
            try:
                self.fd = os.open(self.path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                os.write(self.fd, str(os.getpid()).encode())
                return self
            except FileExistsError:
                if time.monotonic() >= deadline:
                    raise LogError(f"could not get the lock {self.path.name} in {self.wait:g}s") from None
                time.sleep(0.1)

    def __exit__(self, *exc):
        if self.fd is not None:
            os.close(self.fd)
        try:
            self.path.unlink()
        except FileNotFoundError:
            pass


def atomic_write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=path.parent, prefix=path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(text)
        os.replace(tmp, path)
    except BaseException:
        try:
            os.unlink(tmp)
        except FileNotFoundError:
            pass
        raise


def parse_entries(text: str) -> list[list[str]]:
    entries: list[list[str]] = []
    for line in text.splitlines():
        if ENTRY_START.match(line):
            entries.append([line])
        elif entries and line.startswith("  "):
            entries[-1].append(line)
    return entries


def entry_id(entry: list[str]) -> str:
    return ENTRY_START.match(entry[0]).group(2)  # type: ignore[union-attr]


def entry_month(entry: list[str]) -> str:
    return ENTRY_START.match(entry[0]).group(1)[:7]  # type: ignore[union-attr]


def render(entries: list[list[str]]) -> str:
    return HEADER + "".join("\n".join(entry) + "\n" for entry in entries)


def build_entry(today: str, quest: str, files: list[str], summary: str, validation: str) -> list[str]:
    return [
        f"- **{today} — {quest}** — {one_line(summary, 200)}",
        f"  Files: {one_line(', '.join(files), 200)}",
        f"  Validation: {one_line(validation, 200)}",
    ]


def archive(root: Path, entries: list[list[str]]) -> None:
    by_month: dict[str, list[list[str]]] = {}
    for entry in entries:
        by_month.setdefault(entry_month(entry), []).append(entry)
    for month, items in by_month.items():
        target = root / "Context" / "archive" / "edit-log" / f"{month}.md"
        existing = parse_entries(target.read_text(encoding="utf-8")) if target.exists() else []
        ids = {entry_id(item) for item in items}
        merged = items + [e for e in existing if entry_id(e) not in ids]
        atomic_write(target, f"# Edit Log {month}\n\n" + "".join("\n".join(e) + "\n" for e in merged))


def log_edit(root: Path, quest: str, files: list[str], summary: str, validation: str,
             today: str | None = None, lock_wait: float = LOCK_WAIT_SECONDS) -> None:
    root = root.resolve()
    find_quest(root, quest)
    clean = check_paths(root, files)
    today = today or dt.date.today().isoformat()
    log_path = root / "Context" / "Edit-Log.md"
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with FileLock(log_path.with_name("Edit-Log.md.lock"), lock_wait):
        current = parse_entries(log_path.read_text(encoding="utf-8")) if log_path.exists() else []
        current = [e for e in current if entry_id(e) != quest]
        entries = [build_entry(today, quest, clean, summary, validation)] + current
        keep, old = entries[:KEEP], entries[KEEP:]
        if old:
            archive(root, old)
        atomic_write(log_path, render(keep))


def main(argv: list[str] | None = None, root: Path | None = None, lock_wait: float = LOCK_WAIT_SECONDS) -> int:
    parser = argparse.ArgumentParser(description="Write one job into Context/Edit-Log.md")
    parser.add_argument("--quest", required=True, help="Quest ID, e.g. Q-20261126-docs-sync")
    parser.add_argument("--files", required=True, nargs="+", help="paths changed, inside the repo")
    parser.add_argument("--summary", required=True)
    parser.add_argument("--validation", required=True)
    args = parser.parse_args(argv)
    try:
        log_edit(root or Path(__file__).resolve().parents[2], args.quest, args.files,
                 args.summary, args.validation, lock_wait=lock_wait)
    except LogError as error:
        print(f"log-edit: {error}", file=sys.stderr)
        return 1
    print(f"log-edit: logged {args.quest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
