import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "extension" / "library"
TITLE = re.compile(r"^\*\*`.+`\*\* — \S")
REFERENCE = re.compile(r"`([A-Za-z_][\w$]*)`")


def check_folder(folder):
    problems = []
    pages = {p.stem for p in folder.glob("*.md")}
    alias_file = folder / "aliases.json"
    aliases = json.loads(alias_file.read_text(encoding="utf-8")) if alias_file.exists() else {}
    patterns = [re.compile("^" + ".*".join(map(re.escape, glob.split("*"))) + "$") for glob in aliases]

    for glob, target in aliases.items():
        if target not in pages:
            problems.append(f"{alias_file.name}: {glob} points at missing page {target}")
        if "*" not in glob and glob in pages:
            problems.append(f"{alias_file.name}: {glob} is shadowed by its own page")

    for page in sorted(folder.glob("*.md")):
        text = page.read_text(encoding="utf-8")
        lines = text.splitlines()
        if not lines or not TITLE.match(lines[0]):
            problems.append(f"{page.name}: first line is not a '**`name`** — summary' title")
        if text.count("```") % 2:
            problems.append(f"{page.name}: unbalanced code fence")
        if not text.endswith("\n"):
            problems.append(f"{page.name}: no trailing newline")
        for line in lines:
            if not line.startswith("**See also**"):
                continue
            for name in REFERENCE.findall(line):
                if name not in pages and not any(p.match(name) for p in patterns):
                    problems.append(f"{page.name}: See also names unknown page {name}")
    return len(pages), len(aliases), problems


def main():
    names = sys.argv[1:] or ["sv", "uvm"]
    failed = False
    for name in names:
        pages, aliases, problems = check_folder(LIBRARY / name)
        print(f"{name}: {pages} pages, {aliases} aliases, {len(problems)} problem(s)")
        for problem in problems:
            print(f"  {problem}")
        failed = failed or bool(problems)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
